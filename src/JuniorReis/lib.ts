import type { CSSProperties } from "react";
import { Easing, interpolate } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

export const SANS = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;
export const SERIF = loadLora("italic", {
  weights: ["500"],
  subsets: ["latin"],
}).fontFamily;

// ---------- Cores ----------
export const LIME = "#D4FF4F";
export const LIME_DEEP = "#9BCD2F";
export const OLIVE = "#5B6B2E";
export const INK = "#111111";
export const MUTED_DARK = "#8C8C8C";
export const MUTED_LIGHT = "#8A8A85";

// ---------- Linha do tempo ----------
export const FPS = 30;
/** Duração da transição (morph) entre cenas, em frames */
export const M = 24;
/** Duração de cada cena (sem contar a sobreposição da transição) */
export const DUR = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 120];
export const START = DUR.map((_, i) => DUR.slice(0, i).reduce((a, b) => a + b, 0));
export const TOTAL = DUR.reduce((a, b) => a + b, 0);
export const THEME: ("d" | "l")[] = ["d", "d", "d", "d", "l", "d", "d", "l", "d", "l", "d", "l", "d", "d", "l"];

// ---------- Easing ----------
export const EO = Easing.bezier(0.16, 1, 0.3, 1);
export const EIO = Easing.bezier(0.72, 0, 0.22, 1);
export const EI = Easing.bezier(0.5, 0, 0.75, 0);

export const tw = (
  f: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = EO,
) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- Geometria (coordenadas das artes 1080x1920) ----------
export type Rect = { x: number; y: number; w: number; h: number; r: number };
export const lerpRect = (A: Rect, B: Rect, p: number): Rect => ({
  x: lerp(A.x, B.x, p),
  y: lerp(A.y, B.y, p),
  w: lerp(A.w, B.w, p),
  h: lerp(A.h, B.h, p),
  r: lerp(A.r, B.r, p),
});

export const tile = (cx: number, cy: number, size = 190, r = 50): Rect => ({ x: cx - size / 2, y: cy - size / 2, w: size, h: size, r });
export const circ = (cx: number, cy: number, d: number): Rect => ({ x: cx - d / 2, y: cy - d / 2, w: d, h: d, r: d / 2 });

/** Centros dos 5 serviços (cena 4) */
export const SERVICE_C: [number, number][] = [
  [250, 520],
  [540, 520],
  [830, 520],
  [395, 860],
  [685, 860],
];
/** Nós do caminho (cena 11) */
export const NODES: [number, number][] = [
  [250, 360],
  [830, 570],
  [250, 790],
  [830, 1000],
];

export const R = {
  s1Pill: { x: 100, y: 985, w: 880, h: 165, r: 82 },
  s2Card: { x: 172, y: 262, w: 736, h: 916, r: 62 },
  s3Notif0: { x: 100, y: 330, w: 880, h: 165, r: 82 },
  bigCard: { x: 100, y: 300, w: 880, h: 850, r: 60 },
  phone: { x: 260, y: 280, w: 560, h: 920, r: 72 },
  s9Card: { x: 204, y: 214, w: 672, h: 992, r: 64 },
  s10Card: { x: 100, y: 330, w: 880, h: 800, r: 60 },
  s12Card1: { x: 100, y: 400, w: 880, h: 240, r: 60 },
  s12Card2: { x: 100, y: 690, w: 880, h: 240, r: 60 },
  s13Card: { x: 100, y: 430, w: 880, h: 662, r: 60 },
  s13Follow: { x: 162, y: 920, w: 368, h: 115, r: 58 },
  s13Msg: { x: 550, y: 920, w: 368, h: 115, r: 58 },
  s14Notif: { x: 100, y: 588, w: 880, h: 165, r: 82 },
  s14Btn: { x: 232, y: 805, w: 614, h: 107, r: 54 },
  s15Dot: { x: 440, y: 560, w: 200, h: 200, r: 100 },
  logo: { x: 95, y: 430, w: 890, h: 460, r: 0 },
} satisfies Record<string, Rect>;

// ---------- Superfícies ----------
export const DARK_GLASS: CSSProperties = {
  background:
    "linear-gradient(105deg, rgba(98,120,36,0.95) 0%, rgba(64,76,34,0.96) 26%, #2b2b2b 60%, #252525 100%)",
  boxShadow: "inset 0 0 0 2px rgba(170,190,100,0.26)",
};
export const LIGHT_GLASS: CSSProperties = {
  background: "linear-gradient(120deg, #E5F8B8 0%, #F0F6E0 45%, #FAFAF7 100%)",
  boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.95)",
};
export const OLIVE_FRAME: CSSProperties = {
  background:
    "linear-gradient(172deg, #62762a 0%, #46561f 38%, #30352a 78%, #2b2b2b 100%)",
};
export const SHADOW_DARK = "0 30px 70px rgba(0,0,0,0.55)";
export const SHADOW_LIGHT = "0 40px 90px rgba(70,80,40,0.18)";

// ---------- Caminho pontilhado (cena 4) ----------
type Pt = [number, number];
const bez = (a: Pt, b: Pt, c: Pt, e: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * e[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * e[1],
  ];
};
export const PATH_DOTS: Pt[] = (() => {
  const segs: [Pt, Pt, Pt, Pt][] = [
    [[205, 1217], [330, 1180], [400, 1062], [520, 1024]],
    [[520, 1024], [640, 1000], [770, 1062], [842, 992]],
  ];
  const pts: Pt[] = [];
  segs.forEach((s) => {
    for (let i = 0; i <= 400; i++) pts.push(bez(s[0], s[1], s[2], s[3], i / 400));
  });
  const out: Pt[] = [pts[0]];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc >= 29) {
      out.push(pts[i]);
      acc = 0;
    }
  }
  return out;
})();
export const pathAt = (u: number): Pt => PATH_DOTS[Math.round(Math.max(0, Math.min(1, u)) * (PATH_DOTS.length - 1))];

/** "Toque": afunda e volta (0..1..0) */
export const bump = (f: number, t: number) => tw(f, t, t + 3) * (1 - tw(f, t + 4, t + 15));
