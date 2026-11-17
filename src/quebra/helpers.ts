import { Word } from "./Legendas";
import { Layer, Tone } from "./shapes";

/** Linha senoidal (onda) desenhada em traço. */
export const wave = (
  x0: number,
  x1: number,
  y: number,
  amp: number,
  wavelength: number,
  lineWidth = 10,
  tone: Tone = "base",
): Layer => ({
  kind: "draw",
  tone,
  draw: (ctx) => {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let x = x0; x <= x1; x += 2) {
      const yy = y + Math.sin(((x - x0) / wavelength) * Math.PI * 2) * amp;
      if (x === x0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  },
});

/** Raios ao redor de um centro (ex.: Sol). */
export const rays = (
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  n: number,
  lineWidth = 14,
  tone: Tone = "base",
): Layer => ({
  kind: "draw",
  tone,
  draw: (ctx) => {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
    }
  },
});

/**
 * Palavras com tempo sintético (só para prévia sem áudio):
 * distribui pelo tamanho da palavra, com pausa entre linhas.
 */
export const fakeWords = (lines: string[], start = 0.4, cps = 15, gap = 0.35): Word[] => {
  const out: Word[] = [];
  let t = start;
  lines.forEach((line, li) => {
    for (const p of line.split(" ")) {
      const dur = (p.length + 2) / cps;
      out.push({ palavra: p, inicio: +t.toFixed(3), fim: +(t + dur * 0.9).toFixed(3), linha: li });
      t += dur;
    }
    t += gap;
  });
  return out;
};
