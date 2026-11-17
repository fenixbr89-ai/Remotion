import { FONT_SANS, H, W, hashString, rng } from "./theme";

/**
 * Formas-alvo das partículas. Cada forma é uma lista de camadas desenhadas num
 * canvas fora da tela; os pixels preenchidos viram pontos-alvo.
 * Coordenadas sempre no espaço do vídeo (1080×1920).
 */
export type Tone = "base" | "theme" | "accent" | "good";

type LayerCommon = {
  tone?: Tone; // cor da camada (padrão: base/branco)
  /** desenha só o contorno com esta espessura (px) em vez de preencher */
  stroke?: number;
  /** peso relativo na distribuição das partículas (padrão 1) */
  weight?: number;
};

export type Layer = LayerCommon &
  (
    | {
        kind: "text";
        text: string;
        x?: number;
        y?: number;
        size: number;
        fontWeight?: 600 | 900;
        font?: string;
      }
    | {
        kind: "path";
        d: string;
        viewBox: [number, number];
        x?: number;
        y?: number;
        /** largura final em px no vídeo */
        width: number;
      }
    | { kind: "circle"; x: number; y: number; r: number }
    | { kind: "rect"; x: number; y: number; w: number; h: number; radius?: number }
    | { kind: "draw"; draw: (ctx: CanvasRenderingContext2D) => void }
  );

export type ShapeSpec = {
  id: string;
  layers: Layer[];
  /** centro do brilho radial (padrão: centro de massa dos pontos) */
  glow?: [number, number];
  /** rotação contínua (graus/s) — só quando faz sentido físico */
  spin?: number;
  /** fração das partículas reservada para a borda (define a silhueta) */
  edge?: number;
};

export type ShapePoints = {
  xs: Float32Array;
  ys: Float32Array;
  tone: Uint8Array; // 0 base, 1 theme, 2 accent (vermelho), 3 good (verde)
  cx: number;
  cy: number;
  spin: number;
};

const TONE_IDX: Record<Tone, number> = { base: 0, theme: 1, accent: 2, good: 3 };
const SCALE = 0.5; // amostra em meia resolução

const drawLayer = (ctx: CanvasRenderingContext2D, l: Layer) => {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (l.stroke) ctx.lineWidth = l.stroke;
  const paint = (p?: Path2D) => {
    if (l.stroke) {
      if (p) ctx.stroke(p);
      else ctx.stroke();
    } else if (p) ctx.fill(p);
    else ctx.fill();
  };
  switch (l.kind) {
    case "text": {
      ctx.font = `${l.fontWeight ?? 900} ${l.size}px "${l.font ?? FONT_SANS}"`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const lines = l.text.split("\n");
      const lh = l.size * 1.02;
      lines.forEach((t, i) => {
        const y = (l.y ?? 820) + (i - (lines.length - 1) / 2) * lh;
        if (l.stroke) ctx.strokeText(t, l.x ?? W / 2, y);
        else ctx.fillText(t, l.x ?? W / 2, y);
      });
      break;
    }
    case "path": {
      const s = l.width / l.viewBox[0];
      const x = (l.x ?? W / 2) - (l.viewBox[0] * s) / 2;
      const y = (l.y ?? 820) - (l.viewBox[1] * s) / 2;
      ctx.translate(x, y);
      ctx.scale(s, s);
      if (l.stroke) ctx.lineWidth = l.stroke / s;
      paint(new Path2D(l.d));
      break;
    }
    case "circle":
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
      paint();
      break;
    case "rect":
      ctx.beginPath();
      ctx.roundRect(l.x - l.w / 2, l.y - l.h / 2, l.w, l.h, l.radius ?? 0);
      paint();
      break;
    case "draw":
      l.draw(ctx);
      break;
  }
  ctx.restore();
};

type Mask = { fill: number[]; edge: number[] };

const sampleLayer = (l: Layer): Mask => {
  const cw = Math.round(W * SCALE);
  const ch = Math.round(H * SCALE);
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.scale(SCALE, SCALE);
  drawLayer(ctx, l);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const on = (i: number) => data[i * 4 + 3] > 110;
  const fill: number[] = [];
  const edge: number[] = [];
  for (let y = 1; y < ch - 1; y++) {
    for (let x = 1; x < cw - 1; x++) {
      const i = y * cw + x;
      if (!on(i)) continue;
      if (!on(i - 1) || !on(i + 1) || !on(i - cw) || !on(i + cw)) edge.push(i);
      else fill.push(i);
    }
  }
  return { fill, edge };
};

const cache = new Map<string, ShapePoints>();

/** Gera exatamente `n` pontos-alvo para a forma (determinístico). */
export const buildShape = (spec: ShapeSpec, n: number): ShapePoints => {
  const key = `${spec.id}:${n}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const r = rng(hashString(spec.id));
  const cw = Math.round(W * SCALE);
  const masks = spec.layers.map(sampleLayer);
  const areas = masks.map(
    (m, i) => (m.fill.length + m.edge.length * 2.5) * (spec.layers[i].weight ?? 1),
  );
  const total = areas.reduce((a, b) => a + b, 0) || 1;
  const edgeFrac = spec.edge ?? 0.3;

  const xs = new Float32Array(n);
  const ys = new Float32Array(n);
  const tone = new Uint8Array(n);
  let k = 0;
  masks.forEach((m, li) => {
    const count =
      li === masks.length - 1 ? n - k : Math.round((areas[li] / total) * n);
    const t = TONE_IDX[spec.layers[li].tone ?? "base"];
    const nEdge = m.fill.length ? Math.round(count * edgeFrac) : count;
    for (let j = 0; j < count && k < n; j++, k++) {
      const pool =
        j < nEdge ? (m.edge.length ? m.edge : m.fill) : m.fill.length ? m.fill : m.edge;
      if (!pool.length) {
        xs[k] = W / 2;
        ys[k] = H / 2;
        continue;
      }
      const p = pool[Math.floor(r() * pool.length)];
      xs[k] = ((p % cw) + r()) / SCALE;
      ys[k] = (Math.floor(p / cw) + r()) / SCALE;
      tone[k] = t;
    }
  });

  // embaralha para a atribuição partícula→ponto ser aleatória (efeito de remontagem)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
    [ys[i], ys[j]] = [ys[j], ys[i]];
    [tone[i], tone[j]] = [tone[j], tone[i]];
  }

  let sx = 0;
  let sy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
    sy += ys[i];
  }
  const out: ShapePoints = {
    xs,
    ys,
    tone,
    cx: spec.glow?.[0] ?? sx / n,
    cy: spec.glow?.[1] ?? sy / n,
    spin: spec.spin ?? 0,
  };
  cache.set(key, out);
  return out;
};

/* ---------- atalhos para montar formas ---------- */

export const text = (
  t: string,
  size: number,
  opts: Partial<Extract<Layer, { kind: "text" }>> = {},
): Layer => ({ kind: "text", text: t, size, ...opts });

export const path = (
  d: string,
  viewBox: [number, number],
  width: number,
  opts: Partial<Extract<Layer, { kind: "path" }>> = {},
): Layer => ({ kind: "path", d, viewBox, width, ...opts });

export const circle = (
  x: number,
  y: number,
  r: number,
  opts: LayerCommon = {},
): Layer => ({ kind: "circle", x, y, r, ...opts });

export const shape = (
  id: string,
  layers: Layer[],
  opts: Omit<ShapeSpec, "id" | "layers"> = {},
): ShapeSpec => ({ id, layers, ...opts });

/** Nuvem espalhada pela tela (estado inicial / "poeira"). */
export const scatter = (id = "scatter"): ShapeSpec => ({
  id,
  edge: 0,
  layers: [{ kind: "rect", x: W / 2, y: 860, w: 1000, h: 1300 }],
  glow: [W / 2, 820],
});
