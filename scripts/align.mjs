#!/usr/bin/env node
/**
 * Gera words.json ({palavra, inicio, fim, linha}) + meta.json ({audioSeconds}).
 *
 * Uso:
 *   node scripts/align.mjs public/<video>/narracao.wav public/<video>/roteiro.txt [--whisper caps.json]
 *
 * roteiro.txt: uma frase/linha por linha (a "linha" vira bloco de legenda).
 *
 * Modo 1 (--whisper): caps.json = array de Caption do Remotion
 *   ({text, startMs, endMs}) vindo de @remotion/install-whisper-cpp. Se o número
 *   de palavras bater com o roteiro, usa o texto do roteiro com os tempos do
 *   whisper; senão, alinha palavra a palavra pelo texto normalizado.
 * Modo 2 (padrão, sem transcrição): detecta silêncios com ffmpeg, encaixa as
 *   fronteiras de linha nas pausas mais próximas e distribui as palavras dentro
 *   da fala proporcionalmente ao tamanho.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const [audio, roteiroPath, ...rest] = process.argv.slice(2);
if (!audio || !roteiroPath) {
  console.error("uso: node scripts/align.mjs <audio.wav> <roteiro.txt> [--whisper caps.json]");
  process.exit(1);
}
const wIdx = rest.indexOf("--whisper");
const whisperPath = wIdx >= 0 ? rest[wIdx + 1] : null;
const outDir = dirname(audio);

const lines = readFileSync(roteiroPath, "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);
const script = lines.flatMap((l, li) => l.split(/\s+/).map((p) => ({ palavra: p, linha: li })));

const duration = parseFloat(
  execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audio])
    .toString()
    .trim(),
);

const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const weight = (p) => p.length + 2 + (/[,;:]$/.test(p) ? 3 : 0) + (/[.?!…]$/.test(p) ? 5 : 0);
const r3 = (x) => Math.round(x * 1000) / 1000;

let words;

if (whisperPath) {
  const caps = JSON.parse(readFileSync(whisperPath, "utf8"))
    .map((c) => ({ text: c.text.trim(), s: c.startMs / 1000, e: c.endMs / 1000 }))
    .filter((c) => norm(c.text));
  // alinhamento de sequência (Needleman-Wunsch) roteiro × transcrição,
  // com semelhança aproximada — o texto vem do roteiro, os tempos do áudio
  const lev = (x, y) => {
    const dp = Array.from({ length: x.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= y.length; j++) dp[0][j] = j;
    for (let i = 1; i <= x.length; i++)
      for (let j = 1; j <= y.length; j++)
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    return dp[x.length][y.length];
  };
  const sim = (x, y) => (x && y ? 1 - lev(x, y) / Math.max(x.length, y.length) : 0);
  const A = script.map((w) => norm(w.palavra));
  const B = caps.map((c) => norm(c.text));
  const n = A.length;
  const m = B.length;
  const GAP = -0.4;
  const S = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
  const P = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1)); // 1 diag, 2 up, 3 left
  for (let i = 1; i <= n; i++) { S[i][0] = i * GAP; P[i][0] = 2; }
  for (let j = 1; j <= m; j++) { S[0][j] = j * GAP; P[0][j] = 3; }
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) {
      const q = sim(A[i - 1], B[j - 1]);
      const d = S[i - 1][j - 1] + (q >= 0.5 ? q : -0.6);
      const u = S[i - 1][j] + GAP;
      const l = S[i][j - 1] + GAP;
      if (d >= u && d >= l) { S[i][j] = d; P[i][j] = 1; }
      else if (u >= l) { S[i][j] = u; P[i][j] = 2; }
      else { S[i][j] = l; P[i][j] = 3; }
    }
  words = script.map((w) => ({ ...w, inicio: null, fim: null }));
  let matched = 0;
  for (let i = n, j = m; i > 0 || j > 0; ) {
    const pp = P[i][j];
    if (pp === 1) {
      if (sim(A[i - 1], B[j - 1]) >= 0.5) {
        words[i - 1].inicio = caps[j - 1].s;
        words[i - 1].fim = caps[j - 1].e;
        matched++;
      }
      i--; j--;
    } else if (pp === 2) i--;
    else j--;
  }
  // palavras sem par: preenche o vão entre vizinhos (ex.: "1871" falado como 6 palavras)
  for (let i = 0; i < words.length; i++) {
    if (words[i].inicio !== null) continue;
    const a = words[i - 1]?.fim ?? 0;
    let k = i;
    while (k < words.length && words[k].inicio === null) k++;
    const b = words[k]?.inicio ?? duration;
    const cnt = k - i;
    for (let q = 0; q < cnt; q++) {
      words[i + q].inicio = a + ((b - a) * q) / cnt;
      words[i + q].fim = a + ((b - a) * (q + 1)) / cnt;
    }
    i = k - 1;
  }
  console.log(`transcrição: ${caps.length} palavras · roteiro: ${n} · casadas: ${matched}`);
} else {
  // --- detecção de silêncio ---
  const text = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", audio, "-af", "silencedetect=noise=-38dB:d=0.18", "-f", "null", "-"],
    { encoding: "utf8" },
  ).stderr;
  const silences = [];
  let start = null;
  for (const m of text.matchAll(/silence_(start|end): ([\d.]+)/g)) {
    if (m[1] === "start") start = parseFloat(m[2]);
    else if (start !== null) {
      silences.push([start, parseFloat(m[2])]);
      start = null;
    }
  }
  if (start !== null) silences.push([start, duration]);

  // segmentos de fala = complemento dos silêncios
  const speech = [];
  let t = 0;
  for (const [a, b] of silences) {
    if (a - t > 0.05) speech.push([t, a]);
    t = b;
  }
  if (duration - t > 0.05) speech.push([t, duration]);
  const speechTotal = speech.reduce((s, [a, b]) => s + b - a, 0);

  // tempo de fala → tempo real
  const toReal = (st) => {
    let acc = 0;
    for (const [a, b] of speech) {
      if (st <= acc + (b - a)) return a + (st - acc);
      acc += b - a;
    }
    return speech.at(-1)[1];
  };

  // fronteiras de linha: proporcional ao tamanho, encaixada na pausa mais próxima
  const lineW = lines.map((l) => l.split(/\s+/).reduce((s, p) => s + weight(p), 0));
  const totalW = lineW.reduce((a, b) => a + b, 0);
  const pauses = silences.map(([a, b]) => [a, b]).filter(([a]) => a > speech[0][0]);
  const bounds = [speech[0][0]];
  let accW = 0;
  for (let li = 0; li < lines.length - 1; li++) {
    accW += lineW[li];
    const guess = toReal((accW / totalW) * speechTotal);
    let best = null;
    for (const p of pauses) {
      if (p[0] <= bounds.at(-1) + 0.2) continue;
      if (!best || Math.abs(p[0] - guess) < Math.abs(best[0] - guess)) best = p;
    }
    const ok = best && Math.abs(best[0] - guess) < 1.2;
    bounds.push(ok ? best : [guess, guess]);
  }
  const lineSpans = lines.map((_, li) => {
    const s = li === 0 ? bounds[0] : bounds[li][1];
    const e = li === lines.length - 1 ? speech.at(-1)[1] : bounds[li + 1][0];
    return [s, e];
  });

  words = [];
  lines.forEach((l, li) => {
    const [s, e] = lineSpans[li];
    // fala dentro da janela da linha
    const segs = speech
      .map(([a, b]) => [Math.max(a, s), Math.min(b, e)])
      .filter(([a, b]) => b - a > 0.03);
    const segTotal = segs.reduce((x, [a, b]) => x + b - a, 0) || e - s;
    const local = (st) => {
      let acc = 0;
      for (const [a, b] of segs) {
        if (st <= acc + (b - a)) return a + (st - acc);
        acc += b - a;
      }
      return e;
    };
    const ps = l.split(/\s+/);
    const ws = ps.map(weight);
    const tw = ws.reduce((a, b) => a + b, 0);
    let acc = 0;
    ps.forEach((p, i) => {
      const a = local((acc / tw) * segTotal);
      acc += ws[i];
      const b = local((acc / tw) * segTotal);
      words.push({ palavra: p, linha: li, inicio: a, fim: b });
    });
  });
  console.log(`silêncios: ${silences.length}, fala: ${speechTotal.toFixed(2)} s`);
}

words = words.map((w) => ({ palavra: w.palavra, inicio: r3(w.inicio), fim: r3(w.fim), linha: w.linha }));
writeFileSync(join(outDir, "words.json"), JSON.stringify(words, null, 1));
writeFileSync(join(outDir, "meta.json"), JSON.stringify({ audioSeconds: r3(duration) }, null, 1));
console.log(`ok: ${words.length} palavras, áudio ${duration.toFixed(2)} s → ${join(outDir, "words.json")}`);
