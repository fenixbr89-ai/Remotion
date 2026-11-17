import React, { useEffect, useMemo, useRef, useState } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { buildShape, ShapePoints, ShapeSpec, Tone, TONES } from "./shapes";
import { FPS, H, W, hexToRgb, loadQuebraFonts, rng } from "./theme";

export const MORPH_S = 0.6; // duração do morph de cada partícula
export const DELAY_S = 0.25; // atraso aleatório máximo por partícula
export const MORPH_TOTAL_S = MORPH_S + DELAY_S;

export type FieldScene = { from: number; shape: ShapeSpec; theme: string };

type Props = {
  scenes: FieldScene[]; // ordenadas por `from` (frames)
  count?: number;
  /** cor de cada Tone (exceto "theme", que vem da cena) */
  palette: Record<Exclude<Tone, "theme">, string>;
};

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const sceneAt = (scenes: FieldScene[], frame: number) => {
  let i = 0;
  while (i + 1 < scenes.length && scenes[i + 1].from <= frame) i++;
  return i;
};

/** Posição do brilho radial no frame (segue o morph). */
export const glowAt = (
  scenes: FieldScene[],
  shapes: ShapePoints[],
  frame: number,
) => {
  const i = sceneAt(scenes, frame);
  const cur = shapes[i];
  const prev = shapes[Math.max(0, i - 1)];
  const t = easeInOut(
    Math.min(1, Math.max(0, (frame - scenes[i].from) / (MORPH_TOTAL_S * FPS))),
  );
  return {
    x: prev.cx + (cur.cx - prev.cx) * t,
    y: prev.cy + (cur.cy - prev.cy) * t,
    index: i,
  };
};

export const useShapes = (scenes: FieldScene[], count: number) => {
  const [handle] = useState(() => delayRender("quebra: fontes e formas"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadQuebraFonts()
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return useMemo(
    () => (ready ? scenes.map((s) => buildShape(s.shape, count)) : null),
    [ready, scenes, count],
  );
};

export const ParticleField: React.FC<
  Props & { shapes: ShapePoints[] }
> = ({ scenes, shapes, count = 12000, palette }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // atributos fixos por partícula
  const attrs = useMemo(() => {
    const r = rng(1234);
    const delay = new Float32Array(count);
    const swirl = new Float32Array(count);
    const phase = new Float32Array(count);
    const bright = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      delay[i] = r() * DELAY_S;
      swirl[i] = (r() < 0.5 ? -1 : 1) * (0.15 + r() * 0.35);
      phase[i] = r() * Math.PI * 2;
      bright[i] = 0.65 + r() * 0.55;
    }
    return { delay, swirl, phase, bright };
  }, [count]);

  const work = useMemo(() => {
    const small = document.createElement("canvas");
    small.width = W / 2;
    small.height = H / 2;
    const sharp = document.createElement("canvas");
    sharp.width = W;
    sharp.height = H;
    return { small, sharp };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const i = sceneAt(scenes, frame);
    const cur = shapes[i];
    const prev = shapes[Math.max(0, i - 1)];
    const local = (frame - scenes[i].from) / FPS;
    const sec = frame / FPS;

    const tones = (theme: string) =>
      TONES.map((t) => hexToRgb(t === "theme" ? theme : palette[t]));
    const toneCur = tones(scenes[i].theme);
    const tonePrev = tones(scenes[Math.max(0, i - 1)].theme);

    const rot = (s: ShapePoints, t: number) => {
      const a = (s.spin * Math.PI * t) / 180;
      return { c: Math.cos(a), s: Math.sin(a) };
    };
    const rc = rot(cur, local);
    const rp = rot(prev, sec - scenes[Math.max(0, i - 1)].from / FPS);

    const sctx = work.sharp.getContext("2d")!;
    const img = sctx.createImageData(W, H);
    const d = img.data;

    const splat = (x: number, y: number, rgb: number[], a: number) => {
      const xi = x | 0;
      const yi = y | 0;
      if (xi < 1 || yi < 1 || xi >= W - 1 || yi >= H - 1) return;
      const fx = x - xi;
      const fy = y - yi;
      // bilinear 2×2 + halo leve
      const w00 = (1 - fx) * (1 - fy) * a;
      const w10 = fx * (1 - fy) * a;
      const w01 = (1 - fx) * fy * a;
      const w11 = fx * fy * a;
      const add = (px: number, py: number, w: number) => {
        const o = (py * W + px) * 4;
        d[o] += rgb[0] * w;
        d[o + 1] += rgb[1] * w;
        d[o + 2] += rgb[2] * w;
        d[o + 3] = 255;
      };
      add(xi, yi, w00 + 0.25 * a);
      add(xi + 1, yi, w10 + 0.25 * a);
      add(xi, yi + 1, w01 + 0.25 * a);
      add(xi + 1, yi + 1, w11 + 0.25 * a);
    };

    const n = count;
    for (let p = 0; p < n; p++) {
      // alvo atual (com rotação física, se houver)
      let bx = cur.xs[p];
      let by = cur.ys[p];
      if (cur.spin) {
        const dx = bx - cur.cx;
        const dy = by - cur.cy;
        bx = cur.cx + dx * rc.c - dy * rc.s;
        by = cur.cy + dx * rc.s + dy * rc.c;
      }
      let ax = prev.xs[p];
      let ay = prev.ys[p];
      if (prev.spin && prev !== cur) {
        const dx = ax - prev.cx;
        const dy = ay - prev.cy;
        ax = prev.cx + dx * rp.c - dy * rp.s;
        ay = prev.cy + dx * rp.s + dy * rp.c;
      }
      const raw = i === 0 ? 1 : (local - attrs.delay[p]) / MORPH_S;
      const t = raw <= 0 ? 0 : raw >= 1 ? 1 : easeInOut(raw);

      let x = ax + (bx - ax) * t;
      let y = ay + (by - ay) * t;
      if (t > 0 && t < 1) {
        // redemoinho: desvio perpendicular que some nas pontas
        const dx = bx - ax;
        const dy = by - ay;
        const k = Math.sin(Math.PI * t) * attrs.swirl[p];
        x += -dy * k;
        y += dx * k;
      }
      // tremor contínuo
      const ph = attrs.phase[p];
      x += Math.sin(sec * 2.1 + ph) * 1.3 + Math.sin(sec * 5.3 + ph * 2) * 0.5;
      y += Math.cos(sec * 1.7 + ph) * 1.3 + Math.cos(sec * 4.1 + ph * 3) * 0.5;

      const ca = tonePrev[prev.tone[p]];
      const cb = toneCur[cur.tone[p]];
      const rgb = [
        ca[0] + (cb[0] - ca[0]) * t,
        ca[1] + (cb[1] - ca[1]) * t,
        ca[2] + (cb[2] - ca[2]) * t,
      ];
      const tw = 0.85 + 0.15 * Math.sin(sec * 3 + ph * 5);
      // cores do tema são mais escuras que o branco: compensa o brilho
      const lift = 1 + 0.35 * (cur.tone[p] > 0 ? t : 0) + 0.35 * (prev.tone[p] > 0 ? 1 - t : 0);
      splat(x, y, rgb, attrs.bright[p] * tw * lift);
    }
    sctx.putImageData(img, 0, 0);

    // bloom: blur somado em meia resolução
    const smctx = work.small.getContext("2d")!;
    smctx.clearRect(0, 0, W / 2, H / 2);
    smctx.filter = "blur(6px)";
    smctx.drawImage(work.sharp, 0, 0, W / 2, H / 2);
    smctx.filter = "none";

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.9;
    ctx.filter = "blur(10px)";
    ctx.drawImage(work.small, 0, 0, W, H);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.drawImage(work.small, 0, 0, W, H);
    ctx.drawImage(work.sharp, 0, 0);
    ctx.globalCompositeOperation = "source-over";
  }, [frame, scenes, shapes, attrs, work, count, palette]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, width: W, height: H }}
    />
  );
};
