// Gera a trilha (lo-fi tech, 104 BPM) e os efeitos sonoros do vídeo PIXORA
// por síntese, sem dependências externas. Saída em public/audio/.
//
//   node scripts/gerar-audio.mjs
//
// Requer ffmpeg no PATH para converter a trilha em MP3 (os SFX ficam em WAV).

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const SR = 44100;
const OUT = join(process.cwd(), "public", "audio");
mkdirSync(OUT, { recursive: true });

// ---------- utilidades ----------
let seed = 1337;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const TAU = Math.PI * 2;

const writeWav = (path, data) => {
  const buf = Buffer.alloc(44 + data.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + data.length * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  writeFileSync(path, buf);
};

const normalize = (data, peak = 0.9) => {
  let m = 0;
  for (const v of data) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < data.length; i++) data[i] *= peak / m;
  return data;
};

// Filtro de variável de estado (Chamberlin) — passa-banda/baixa por amostra.
const svf = () => {
  let low = 0;
  let band = 0;
  return (x, fc, q = 0.7) => {
    const f = 2 * Math.sin((Math.PI * Math.min(fc, SR / 6)) / SR);
    low += f * band;
    const high = x - low - q * band;
    band += f * high;
    return { low, band, high };
  };
};

// ---------- efeitos sonoros ----------
const sfx = {
  whoosh() {
    const n = Math.floor(SR * 0.55);
    const d = new Float32Array(n);
    const f = svf();
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const env = Math.sin(Math.PI * Math.pow(t, 0.7)) ** 2;
      const fc = 250 + 2600 * Math.sin(Math.PI * t);
      d[i] = f(noise(), fc, 0.35).band * env;
    }
    return normalize(d, 0.55);
  },
  tap() {
    const n = Math.floor(SR * 0.06);
    const d = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const env = Math.exp(-t * 140);
      d[i] = (Math.sin(TAU * 2300 * t) * 0.6 + noise() * 0.25) * env;
    }
    return normalize(d, 0.5);
  },
  pop() {
    const n = Math.floor(SR * 0.14);
    const d = new Float32Array(n);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const fr = 380 + 700 * (1 - Math.exp(-t * 60));
      ph += (TAU * fr) / SR;
      d[i] = Math.sin(ph) * Math.exp(-t * 38) * Math.min(1, t * 900);
    }
    return normalize(d, 0.55);
  },
  ding() {
    const n = Math.floor(SR * 1.6);
    const d = new Float32Array(n);
    const notes = [
      [midi(88), 0],
      [midi(93), 0.11],
    ];
    for (const [fr, start] of notes) {
      const s0 = Math.floor(start * SR);
      for (let i = s0; i < n; i++) {
        const t = (i - s0) / SR;
        const env = Math.exp(-t * 3.2) * Math.min(1, t * 400);
        d[i] +=
          (Math.sin(TAU * fr * t) +
            0.35 * Math.sin(TAU * fr * 2.76 * t) * Math.exp(-t * 6) +
            0.15 * Math.sin(TAU * fr * 5.4 * t) * Math.exp(-t * 12)) *
          env;
      }
    }
    return normalize(d, 0.5);
  },
  impact() {
    const n = Math.floor(SR * 1.8);
    const d = new Float32Array(n);
    const f = svf();
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const fr = 32 + 50 * Math.exp(-t * 7);
      ph += (TAU * fr) / SR;
      const boom = Math.sin(ph) * Math.exp(-t * 2.2);
      const thump = f(noise(), 180, 0.9).low * Math.exp(-t * 18) * 2.5;
      d[i] = Math.tanh((boom + thump) * 1.6) * Math.min(1, t * 2000);
    }
    return normalize(d, 0.85);
  },
};

for (const [name, fn] of Object.entries(sfx)) {
  writeWav(join(OUT, `${name}.wav`), fn());
}

// ---------- trilha ----------
const BPM = 104;
const BEAT = 60 / BPM;
const DUR = 54;
const N = SR * DUR;
const L = new Float32Array(N);
const DRUMS_IN = 12; // a batida entra na cena 4
const DROP_START = 9; // cena 3: respiro antes da batida
const OUTRO = 50; // logo

// Progressão: Fmaj7 – Em7 – Dm7 – Cmaj7 (2 compassos cada)
const chords = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [50, 53, 57, 60],
  [48, 52, 55, 59],
];
const BAR = BEAT * 4;
const chordAt = (t) => chords[Math.floor(t / (BAR * 2)) % chords.length];

const add = (i, v) => {
  if (i >= 0 && i < N) L[i] += v;
};

// Pad
{
  const lp = svf();
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const ch = chordAt(t);
    let v = 0;
    for (const note of ch) {
      const fr = midi(note);
      v += Math.sin(TAU * fr * t) + 0.5 * Math.sin(TAU * fr * 1.003 * t + 1);
    }
    v = lp(v, 900, 0.9).low;
    let g = 0.05;
    if (t > DROP_START && t < DRUMS_IN) g *= 0.45;
    L[i] += v * g;
  }
}

// Teclas (stabs estilo Rhodes)
const keyHit = (time, notes, vel) => {
  const s0 = Math.floor(time * SR);
  const len = Math.floor(SR * 1.4);
  for (const note of notes) {
    const fr = midi(note + 12);
    for (let k = 0; k < len; k++) {
      const t = k / SR;
      const env = Math.exp(-t * 3) * Math.min(1, t * 300);
      const v =
        Math.sin(TAU * fr * t + 0.8 * Math.sin(TAU * fr * t) * Math.exp(-t * 6)) * env;
      add(s0 + k, v * vel * 0.05);
    }
  }
};
for (let b = 0; b * BEAT < OUTRO + BAR; b++) {
  const t = b * BEAT;
  if (t > DROP_START && t < DRUMS_IN) continue;
  const inBar = b % 4;
  if (inBar === 0) keyHit(t, chordAt(t), 1);
  if (inBar === 2) keyHit(t + BEAT * 0.5, chordAt(t), 0.6);
}

// Baixo
for (let b = 0; b * BEAT < OUTRO; b++) {
  const t = b * BEAT;
  if (t < DRUMS_IN || b % 2 !== 0) continue;
  const root = chordAt(t)[0] - 12;
  const s0 = Math.floor(t * SR);
  const len = Math.floor(SR * BEAT * 1.8);
  for (let k = 0; k < len; k++) {
    const tt = k / SR;
    const env = Math.exp(-tt * 2.2) * Math.min(1, tt * 200);
    add(s0 + k, Math.sin(TAU * midi(root) * tt) * env * 0.22);
  }
}

// Bateria
const kick = (time) => {
  const s0 = Math.floor(time * SR);
  let ph = 0;
  for (let k = 0; k < SR * 0.4; k++) {
    const t = k / SR;
    ph += (TAU * (45 + 90 * Math.exp(-t * 30))) / SR;
    add(s0 + k, Math.sin(ph) * Math.exp(-t * 9) * 0.5);
  }
};
const snare = (time) => {
  const s0 = Math.floor(time * SR);
  const f = svf();
  for (let k = 0; k < SR * 0.25; k++) {
    const t = k / SR;
    const nz = f(noise(), 2200, 0.8).band * Math.exp(-t * 22);
    const body = Math.sin(TAU * 185 * t) * Math.exp(-t * 30);
    add(s0 + k, (nz * 0.35 + body * 0.18) * 0.8);
  }
};
const hat = (time, vel) => {
  const s0 = Math.floor(time * SR);
  const f = svf();
  for (let k = 0; k < SR * 0.05; k++) {
    const t = k / SR;
    add(s0 + k, f(noise(), 7000, 0.6).high * Math.exp(-t * 90) * 0.07 * vel);
  }
};
for (let b = 0; b * BEAT < OUTRO; b++) {
  const t = DRUMS_IN + b * BEAT;
  if (t >= OUTRO) break;
  const inBar = b % 4;
  if (inBar === 0 || (inBar === 2 && b % 8 === 6)) kick(t);
  if (inBar === 2) kick(t + BEAT * 0.5);
  if (inBar === 1 || inBar === 3) snare(t);
  hat(t, 1);
  hat(t + BEAT * 0.56, 0.6); // swing leve
}

// Envelope geral: entrada suave e fade final no logo
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let g = Math.min(1, t / 1.2);
  if (t > OUTRO) g *= Math.max(0, 1 - (t - OUTRO) / (DUR - OUTRO));
  L[i] = Math.tanh(L[i] * 1.4) * g;
}
normalize(L, 0.8);

const tmp = join(OUT, "trilha.tmp.wav");
writeWav(tmp, L);
try {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-b:a", "192k", join(OUT, "trilha.mp3")]);
  rmSync(tmp);
  console.log("Trilha: public/audio/trilha.mp3");
} catch {
  console.warn("ffmpeg indisponível: mantendo trilha em WAV (renomeie para trilha.wav e ajuste o código).");
}
console.log("SFX:", Object.keys(sfx).map((s) => `${s}.wav`).join(", "));
