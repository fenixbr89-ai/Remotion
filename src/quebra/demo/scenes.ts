/**
 * DEMO sem narração — só para aprovar o estilo do motor de partículas.
 * Tempo das palavras é sintético (fakeWords). Num vídeo real, `words` vem do
 * words.json gerado por scripts/align.mjs a partir do áudio.
 *
 * Fatos: luz do Sol ≈ branca (mistura do espectro visível); espalhamento de
 * Rayleigh ∝ 1/λ⁴ → azul (~450 nm) espalha ~5× mais que vermelho (~700 nm).
 */
import { durationFor, Scene, VideoDef } from "../timing";
import { fakeWords, rays, wave } from "../helpers";
import { circle, scatter, shape, text } from "../shapes";
import { THEMES } from "../theme";

const LINES = [
  "Por que o céu é azul?",
  "A luz do Sol parece branca,",
  "mas é a mistura de todas as cores.",
  "Quando ela entra no ar,",
  "as moléculas espalham muito mais o azul,",
  "porque a onda dele é mais curta.",
  "Cerca de cinco vezes mais que o vermelho.",
  "Qual a próxima curiosidade?",
];

const words = fakeWords(LINES);
const CY = 820;

const scenes: Scene[] = [
  { cue: "", shape: scatter() },
  {
    cue: "Por",
    offset: -0.2,
    shape: shape("q", [text("?", 760, { y: CY, tone: "theme" })]),
  },
  {
    cue: "Sol",
    offset: -0.15,
    shape: shape("sol", [circle(540, CY, 170), rays(540, CY, 230, 330, 12)]),
    overlays: [{ type: "label", text: "luz do sol", x: 540, y: CY + 440 }],
  },
  {
    cue: "mistura",
    shape: shape("espectro", [
      wave(160, 920, CY - 200, 50, 300, 10),
      wave(160, 920, CY, 50, 210, 10, "theme"),
      wave(160, 920, CY + 200, 50, 140, 10),
    ]),
    overlays: [
      { type: "label", text: "espectro visível", x: 540, y: CY - 360 },
      { type: "bracket", x: 960, y1: CY - 260, y2: CY + 260, at: 0.6 },
    ],
    pan: "right",
  },
  {
    cue: "ar",
    offset: -0.1,
    shape: shape("terra", [
      circle(540, CY + 120, 300),
      circle(540, CY + 120, 380, { stroke: 16, tone: "theme" }),
    ]),
    overlays: [
      { type: "label", text: "atmosfera", x: 540, y: CY - 300, tone: "theme" },
      { type: "arrow", from: [160, 330], to: [330, 520], at: 0.5 },
    ],
    pan: "up",
  },
  {
    cue: "moléculas",
    shape: shape(
      "moleculas",
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const r = i % 2 ? 250 : 150;
        return circle(540 + Math.cos(a) * r, CY + Math.sin(a) * r, 48, { tone: i % 3 ? "base" : "theme" });
      }).concat([circle(540, CY, 60, { tone: "theme" })]),
    ),
    overlays: [
      { type: "label", text: "espalhamento de rayleigh", x: 540, y: CY + 430 },
      { type: "arrow", from: [540, CY], to: [900, CY - 330], tone: "theme", at: 0.6 },
      { type: "arrow", from: [540, CY], to: [170, CY - 300], tone: "theme", at: 0.7 },
    ],
  },
  {
    cue: "onda",
    shape: shape("ondas", [
      wave(140, 940, CY - 170, 70, 110, 11, "theme"),
      wave(140, 940, CY + 190, 70, 290, 11),
    ]),
    overlays: [
      { type: "label", text: "azul · ~450 nm", x: 140, y: CY - 290, align: "left", tone: "theme" },
      { type: "label", text: "vermelho · ~700 nm", x: 140, y: CY + 70, align: "left" },
    ],
    pan: "left",
  },
  {
    cue: "cinco",
    shape: shape("5x", [text("5×", 620, { y: CY, tone: "theme" })]),
    overlays: [{ type: "label", text: "mais espalhado", x: 540, y: CY + 380 }],
  },
  {
    cue: "Qual",
    shape: shape("fim", [text("?", 640, { y: CY - 40 }), circle(540, CY + 330, 26, { tone: "theme" })]),
    overlays: [{ type: "label", text: "comenta aí", x: 540, y: CY + 450, tone: "theme" }],
  },
];

const last = words[words.length - 1].fim;

export const demo: VideoDef = {
  words,
  theme: THEMES.pb,
  scenes,
  durationInFrames: durationFor(last),
};
