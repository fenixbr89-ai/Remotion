/**
 * "Por que o céu é azul?" — narração: public/ceu-azul/narracao.wav (95,76 s)
 * Tempos das palavras: public/ceu-azul/words.json (scripts/align.mjs + transcrição Vosk).
 *
 * Fatos conferidos:
 * - Luz do Sol ≈ branca = mistura do espectro visível (~380–750 nm); Newton, prisma.
 * - Vermelho ~700 nm, azul ~450 nm, violeta ~400 nm.
 * - Ar seco: ~78% N₂, ~21% O₂; moléculas (~0,3 nm) ≪ comprimento de onda.
 * - Rayleigh: intensidade espalhada ∝ 1/λ⁴ → (700/450)⁴ ≈ 5,9 ("quase 6×"). Artigo de 1871.
 * - Céu não violeta: o Sol emite menos violeta que azul e o olho é menos sensível ao violeta.
 * - Pôr do sol: caminho óptico muito maior → azul espalhado no trajeto; sobram laranja/vermelho.
 * - Sem atmosfera (espaço, Lua) o céu é preto mesmo de dia.
 * - Marte: poeira deixa o céu de dia alaranjado (caramelo); pôr do sol azulado (fotos dos rovers).
 */
import words from "../../../public/ceu-azul/words.json";
import meta from "../../../public/ceu-azul/meta.json";
import type { Word } from "../Legendas";
import { durationFor, Scene, VideoDef } from "../timing";
import { rays, wave } from "../helpers";
import { circle, Layer, path, scatter, shape, text, Tone } from "../shapes";
import { rng, THEMES } from "../theme";

const CY = 820;

/* ---------- formas próprias deste vídeo ---------- */

const draw = (fn: (c: CanvasRenderingContext2D) => void, tone: Tone = "base", weight = 1): Layer => ({
  kind: "draw",
  tone,
  weight,
  draw: (c) => {
    c.fillStyle = "#fff";
    c.strokeStyle = "#fff";
    c.lineCap = "round";
    c.lineJoin = "round";
    fn(c);
  },
});

/** Sol cortado pelo horizonte. */
const halfSun = (y: number, r: number, tone: Tone = "theme"): Layer[] => [
  draw((c) => {
    c.beginPath();
    c.rect(0, 0, 1080, y - 12);
    c.clip();
    c.beginPath();
    c.arc(540, y, r, 0, Math.PI * 2);
    c.fill();
  }, tone),
  draw((c) => {
    c.lineWidth = 12;
    c.beginPath();
    c.moveTo(110, y);
    c.lineTo(970, y);
    c.stroke();
  }, "base", 0.5),
  draw((c) => {
    c.lineWidth = 12;
    for (let i = 0; i < 7; i++) {
      const a = Math.PI + (i + 0.5) * (Math.PI / 7);
      c.beginPath();
      c.moveTo(540 + Math.cos(a) * (r + 50), y + Math.sin(a) * (r + 50));
      c.lineTo(540 + Math.cos(a) * (r + 130), y + Math.sin(a) * (r + 130));
      c.stroke();
    }
  }, tone, 0.6),
];

const prismPath = "M 0 260 L 150 0 L 300 260 Z";
const prism = (): Layer => path(prismPath, [300, 260], 360, { x: 540, y: CY, stroke: 14 });

const beamIn = (): Layer =>
  draw((c) => {
    c.lineWidth = 12;
    c.beginPath();
    c.moveTo(90, CY + 70);
    c.lineTo(470, CY + 10);
    c.stroke();
  });

const fanOut = (): Layer[] =>
  [0, 1, 2, 3, 4, 5].map((k) =>
    draw((c) => {
      c.lineWidth = 10;
      c.beginPath();
      c.moveTo(610, CY + 30);
      c.lineTo(990, CY - 40 + k * 46);
      c.stroke();
    }, k >= 4 ? "theme" : "base", 0.5),
  );

const molecule = (x: number, y: number, r: number, tone: Tone = "base"): Layer[] => [
  circle(x - r * 0.75, y, r, { tone }),
  circle(x + r * 0.75, y, r, { tone }),
];

const earthArc = (tone: Tone = "theme"): Layer[] => [
  circle(540, CY + 1000, 640, { stroke: 14 }),
  circle(540, CY + 1000, 760, { stroke: 30, tone }),
];

const eye = (): Layer[] => [
  draw((c) => {
    c.lineWidth = 14;
    c.beginPath();
    c.moveTo(170, CY);
    c.quadraticCurveTo(540, CY - 330, 910, CY);
    c.quadraticCurveTo(540, CY + 330, 170, CY);
    c.stroke();
  }),
  draw((c) => {
    c.beginPath();
    c.arc(540, CY, 125, 0, Math.PI * 2);
    c.fill();
    c.globalCompositeOperation = "destination-out";
    c.beginPath();
    c.arc(540, CY, 50, 0, Math.PI * 2);
    c.fill();
  }, "theme"),
];

const moon = (): Layer =>
  draw((c) => {
    c.beginPath();
    c.arc(540, CY, 290, 0, Math.PI * 2);
    c.fill();
    c.globalCompositeOperation = "destination-out";
    for (const [x, y, r] of [
      [450, 720, 60],
      [640, 860, 80],
      [500, 960, 40],
      [660, 680, 36],
      [400, 860, 30],
    ]) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
  });

const stars = (seed: number, n: number): Layer =>
  draw((c) => {
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      c.beginPath();
      c.arc(80 + r() * 920, 260 + r() * 1150, 3 + r() * 9, 0, Math.PI * 2);
      c.fill();
    }
  });

/** Curva aproximada da irradiância solar no visível (pico ~480–500 nm). */
const solarCurve = (): Layer[] => [
  draw((c) => {
    c.lineWidth = 12;
    c.beginPath();
    for (let x = 160; x <= 920; x += 4) {
      const nm = 380 + ((x - 160) / 760) * 370;
      const v = Math.exp(-Math.pow((nm - 490) / 170, 2)) * (nm < 490 ? 0.55 + 0.45 * ((nm - 380) / 110) : 1);
      const y = CY + 220 - v * 420;
      if (x === 160) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();
  }, "theme"),
  draw((c) => {
    c.lineWidth = 8;
    c.beginPath();
    c.moveTo(150, CY + 260);
    c.lineTo(930, CY + 260);
    c.stroke();
  }, "base", 0.4),
];

const dome = (filled: boolean): Layer[] => [
  draw((c) => {
    c.beginPath();
    c.arc(540, CY + 300, 420, Math.PI, 0);
    if (filled) c.fill();
    else {
      c.lineWidth = 14;
      c.stroke();
    }
  }, "theme"),
  draw((c) => {
    c.lineWidth = 12;
    c.beginPath();
    c.moveTo(80, CY + 300);
    c.lineTo(1000, CY + 300);
    c.stroke();
  }, "base", 0.4),
  circle(540, CY + 262, 26),
];

const beamScatter = (): Layer[] => [
  draw((c) => {
    c.lineWidth = 14;
    c.beginPath();
    c.moveTo(90, CY);
    c.lineTo(990, CY);
    c.stroke();
  }),
  draw((c) => {
    const r = rng(77);
    for (let i = 0; i < 70; i++) {
      const x = 140 + r() * 820;
      const y = CY + (r() < 0.5 ? -1 : 1) * (60 + r() * 380);
      c.beginPath();
      c.arc(x, y, 5 + r() * 8, 0, Math.PI * 2);
      c.fill();
    }
  }, "theme"),
];

const dust = (): Layer =>
  draw((c) => {
    const r = rng(9);
    for (let i = 0; i < 160; i++) {
      const a = Math.PI + r() * Math.PI;
      const d = Math.sqrt(r()) * 420;
      c.beginPath();
      c.arc(540 + Math.cos(a) * d, CY + 300 + Math.sin(a) * d, 4 + r() * 7, 0, Math.PI * 2);
      c.fill();
    }
  }, "theme");

/* ---------- cenas (cada uma entra na palavra `cue`) ---------- */

const scenes: Scene[] = [
  { cue: "", shape: scatter() },
  { cue: "Por", offset: -0.15, shape: shape("q1", [text("?", 760, { y: CY, tone: "theme" })]) },
  {
    cue: "pôr",
    offset: -0.1,
    shape: shape("sunset1", halfSun(CY + 150, 230), { glow: [540, CY + 60] }),
    overlays: [{ type: "label", text: "pôr do sol", x: 540, y: CY + 260 }],
  },
  {
    cue: "Tudo",
    shape: shape("sol", [circle(540, CY, 170), rays(540, CY, 230, 330, 12)]),
    overlays: [{ type: "label", text: "luz do sol", x: 540, y: CY + 440 }],
  },
  {
    cue: "Ela",
    shape: shape("feixe", [
      draw((c) => {
        c.fillRect(90, CY - 55, 900, 110);
      }),
    ]),
    overlays: [{ type: "label", text: "luz branca", x: 540, y: CY - 130 }],
    pan: "right",
  },
  {
    cue: "mistura",
    shape: shape("espectro", [
      wave(160, 920, CY - 200, 50, 300, 10),
      wave(160, 920, CY, 50, 210, 10, "theme"),
      wave(160, 920, CY + 200, 50, 140, 10),
    ]),
    overlays: [
      { type: "label", text: "todas as cores", x: 540, y: CY - 330 },
      { type: "bracket", x: 960, y1: CY - 260, y2: CY + 260, at: 0.6 },
    ],
  },
  {
    cue: "Newton",
    shape: shape("prisma", [prism(), beamIn()]),
    overlays: [{ type: "label", text: "prisma · newton", x: 540, y: CY + 260 }],
  },
  {
    cue: "entra",
    shape: shape("prisma-arco", [prism(), beamIn(), ...fanOut()]),
    overlays: [
      { type: "label", text: "luz branca", x: 90, y: CY + 150, align: "left" },
      { type: "label", text: "arco-íris", x: 990, y: CY + 300, align: "right", tone: "theme", at: 0.7 },
    ],
  },
  {
    cue: "Cada",
    shape: shape("onda", [wave(140, 940, CY, 120, 400, 12, "theme")]),
    overlays: [
      { type: "line", from: [240, CY - 190], to: [640, CY - 190] },
      { type: "label", text: "comprimento de onda", x: 440, y: CY - 220 },
    ],
    pan: "left",
  },
  {
    cue: "vermelho",
    shape: shape("onda-longa", [wave(140, 940, CY, 90, 330, 12)]),
    overlays: [{ type: "label", text: "vermelho · ~700 nm", x: 540, y: CY - 190 }],
  },
  {
    cue: "azul",
    shape: shape("ondas", [wave(140, 940, CY - 170, 70, 110, 11, "theme"), wave(140, 940, CY + 190, 70, 290, 11)]),
    overlays: [
      { type: "label", text: "azul · ~450 nm", x: 140, y: CY - 290, align: "left", tone: "theme" },
      { type: "label", text: "vermelho · ~700 nm", x: 140, y: CY + 70, align: "left" },
    ],
  },
  {
    cue: "Agora",
    shape: shape("terra", earthArc(), { glow: [540, CY + 300] }),
    overlays: [
      { type: "label", text: "atmosfera", x: 540, y: CY + 100, tone: "theme" },
      { type: "arrow", from: [150, 300], to: [420, CY - 30], at: 0.4 },
      { type: "label", text: "luz do sol", x: 150, y: 270, align: "left", at: 0.4 },
    ],
    pan: "up",
  },
  {
    cue: "moléculas",
    shape: shape("n2o2", [...molecule(330, CY - 60, 85), ...molecule(750, CY + 120, 85, "theme")]),
    overlays: [
      { type: "label", text: "n₂ · nitrogênio · 78%", x: 330, y: CY - 210 },
      { type: "label", text: "o₂ · oxigênio · 21%", x: 750, y: CY + 300, tone: "theme" },
    ],
  },
  {
    cue: "menores",
    shape: shape("escala", [wave(80, 1000, CY, 230, 700, 12), circle(540, CY, 14, { tone: "theme", weight: 3 })]),
    overlays: [
      { type: "arrow", from: [700, CY + 330], to: [560, CY + 30], tone: "theme" },
      { type: "label", text: "molécula", x: 720, y: CY + 380, tone: "theme" },
      { type: "label", text: "onda de luz", x: 540, y: CY - 300 },
    ],
  },
  {
    cue: "Quando",
    shape: shape("espalha", [...molecule(540, CY, 60, "theme"), rays(540, CY, 170, 330, 12, 10)]),
    overlays: [{ type: "label", text: "espalhamento", x: 540, y: CY + 430 }],
  },
  {
    cue: "Só",
    shape: shape("diferente", [text("≠", 640, { y: CY, tone: "theme" })]),
    overlays: [{ type: "label", text: "não é igual para todas", x: 540, y: CY + 330 }],
  },
  {
    cue: "Quanto",
    shape: shape("curta-espalha", [
      wave(140, 940, CY - 170, 60, 110, 11, "theme"),
      wave(140, 940, CY + 190, 60, 290, 11),
    ]),
    overlays: [
      { type: "arrow", from: [540, CY - 240], to: [380, CY - 440], tone: "theme" },
      { type: "arrow", from: [540, CY - 240], to: [700, CY - 440], tone: "theme" },
      { type: "label", text: "onda curta → espalha mais", x: 540, y: CY + 380, tone: "good" },
    ],
  },
  {
    cue: "azul",
    shape: shape("6x", [text("~6×", 470, { y: CY, tone: "theme" })]),
    overlays: [{ type: "label", text: "azul vs vermelho", x: 540, y: CY + 300 }],
  },
  {
    cue: "Isso",
    shape: shape("lei", [text("1/λ⁴", 330, { y: CY, tone: "theme" })]),
    overlays: [{ type: "label", text: "espalhamento de rayleigh", x: 540, y: CY + 260 }],
  },
  {
    cue: "físico",
    shape: shape("1871", [text("1871", 330, { y: CY })]),
    overlays: [{ type: "label", text: "lord rayleigh · físico", x: 540, y: CY + 240, tone: "theme" }],
  },
  {
    cue: "Então",
    shape: shape("ceu-linha", dome(false), { glow: [540, CY + 150] }),
    overlays: [
      { type: "arrow", from: [260, CY + 20], to: [500, CY + 240], at: 0.4 },
      { type: "arrow", from: [540, CY - 100], to: [540, CY + 200], at: 0.5 },
      { type: "arrow", from: [820, CY + 20], to: [580, CY + 240], at: 0.6 },
    ],
  },
  {
    cue: "tem",
    shape: shape("ceu-azul", dome(true), { glow: [540, CY + 150], edge: 0.35 }),
    overlays: [{ type: "label", text: "luz azul espalhada", x: 540, y: CY + 400, tone: "theme" }],
    pan: "up",
  },
  { cue: "espera", offset: -0.2, shape: shape("excl", [text("!", 700, { y: CY })]) },
  {
    cue: "violeta",
    shape: shape("onda-violeta", [wave(140, 940, CY, 70, 90, 11, "theme")]),
    overlays: [{ type: "label", text: "violeta · ~400 nm", x: 540, y: CY - 170, tone: "theme" }],
  },
  {
    cue: "Por",
    shape: shape("q-violeta", [text("?", 700, { y: CY, tone: "theme" })]),
  },
  {
    cue: "Sol",
    shape: shape("espectro-sol", solarCurve(), { glow: [540, CY] }),
    overlays: [
      { type: "label", text: "luz que o sol emite", x: 540, y: CY - 330 },
      { type: "label", text: "violeta", x: 160, y: CY + 320, align: "left" },
      { type: "label", text: "vermelho", x: 920, y: CY + 320, align: "right" },
      { type: "arrow", from: [230, CY - 160], to: [190, CY + 40], tone: "accent", at: 0.8 },
      { type: "label", text: "menos", x: 230, y: CY - 190, tone: "accent", at: 0.8 },
    ],
  },
  {
    cue: "olhos",
    shape: shape("olho", eye()),
    overlays: [{ type: "label", text: "pouco sensível ao violeta", x: 540, y: CY + 300 }],
  },
  {
    cue: "pôr",
    shape: shape("sunset2", halfSun(CY + 150, 260), { glow: [540, CY + 60] }),
  },
  {
    cue: "fim",
    shape: shape("terra-tarde", [...earthArc(), circle(140, CY - 140, 60, { tone: "theme" })], {
      glow: [540, CY + 300],
    }),
    overlays: [
      { type: "line", from: [540, CY - 400], to: [540, CY + 280], dashed: true, at: 0.3 },
      { type: "label", text: "meio-dia", x: 560, y: CY - 420, align: "left", at: 0.3 },
    ],
  },
  {
    cue: "atravessa",
    shape: shape("terra-tarde2", [...earthArc(), circle(140, CY - 140, 60, { tone: "theme" })], {
      glow: [540, CY + 300],
    }),
    overlays: [
      { type: "line", from: [540, CY - 400], to: [540, CY + 280], dashed: true, at: 0 },
      { type: "arrow", from: [200, CY - 110], to: [530, CY + 270], tone: "theme", at: 0.1 },
      { type: "label", text: "muito mais ar", x: 160, y: CY + 60, align: "left", tone: "theme", at: 0.5 },
    ],
  },
  {
    cue: "caminho",
    shape: shape("feixe-espalha", beamScatter()),
    overlays: [{ type: "label", text: "azul espalhado no caminho", x: 540, y: CY + 520, tone: "theme" }],
    pan: "right",
  },
  {
    cue: "Sobram",
    shape: shape("sunset3", halfSun(CY + 200, 300), { glow: [540, CY + 100] }),
    overlays: [{ type: "label", text: "laranja + vermelho", x: 540, y: CY + 300, tone: "theme" }],
  },
  {
    cue: "sem",
    shape: shape("sem-ar", [text("SEM AR", 210, { y: CY })]),
  },
  {
    cue: "Por isso",
    shape: shape("estrelas", [stars(5, 70)], { edge: 0 }),
    overlays: [{ type: "label", text: "espaço · céu preto", x: 540, y: CY - 620 }],
  },
  {
    cue: "Lua",
    shape: shape("lua", [moon(), stars(6, 18)]),
    overlays: [{ type: "label", text: "lua · céu preto de dia", x: 540, y: CY + 420 }],
  },
  {
    cue: "Marte",
    shape: shape("marte", [circle(540, CY, 280, { tone: "theme" })]),
    overlays: [{ type: "label", text: "marte", x: 540, y: CY + 400, tone: "theme" }],
  },
  {
    cue: "poeira",
    shape: shape("poeira", [dust(), ...dome(false).slice(1)], { glow: [540, CY + 150] }),
    overlays: [{ type: "label", text: "poeira · céu alaranjado", x: 540, y: CY + 400, tone: "theme" }],
  },
  {
    cue: "e",
    skip: 0,
    shape: shape("sunset-marte", halfSun(CY + 150, 230), { glow: [540, CY + 60] }),
    overlays: [{ type: "label", text: "pôr do sol em marte", x: 540, y: CY + 260, tone: "theme" }],
  },
  {
    cue: "Qual",
    shape: shape("fim", [text("?", 640, { y: CY - 40 }), circle(540, CY + 330, 26, { tone: "theme" })]),
    overlays: [{ type: "label", text: "comenta aí", x: 540, y: CY + 450, tone: "theme" }],
  },
];

export const ceuAzul: VideoDef = {
  audio: "ceu-azul/narracao.wav",
  words: words as Word[],
  theme: THEMES.pb,
  scenes,
  durationInFrames: durationFor(meta.audioSeconds),
};
