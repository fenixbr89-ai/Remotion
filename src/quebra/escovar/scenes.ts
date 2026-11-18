/**
 * "Por que a gente precisa escovar os dentes?" — roteiro: public/escovar/roteiro.txt
 * Sem narração ainda: tempos provisórios (fakeWords). Ao chegar o áudio, trocar por words.json.
 */
import { durationFor, Scene, VideoDef } from "../timing";
import { fakeWords } from "../helpers";
import { circle, Layer, path, scatter, shape, text, Tone } from "../shapes";
import { rng, THEMES } from "../theme";

const LINES = [
  "Por que a gente precisa escovar os dentes?",
  "Na sua boca vivem centenas de tipos de bactérias.",
  "Mais de setecentas espécies diferentes já foram encontradas lá.",
  "A maioria é inofensiva.",
  "O problema é quando elas se juntam.",
  "Depois que você come, elas grudam nos dentes",
  "e formam uma película pegajosa chamada placa bacteriana.",
  "Ela é quase invisível,",
  "e começa a se formar poucas horas depois da escovação.",
  "Essas bactérias comem o açúcar que sobra na boca",
  "e soltam ácido.",
  "Esse ácido tira os minerais do esmalte,",
  "e com o tempo abre um buraco: a cárie.",
  "Mas não é só isso.",
  "A placa também irrita a gengiva.",
  "Ela fica vermelha, inchada e sangra quando você escova.",
  "Isso se chama gengivite.",
  "Se ninguém faz nada, a placa endurece e vira tártaro.",
  "E o tártaro a escova não tira mais.",
  "Só o dentista consegue remover.",
  "Com o tempo, a inflamação pode descer até o osso que segura o dente.",
  "É a periodontite,",
  "uma das principais causas de perda de dentes em adultos.",
  "E o mau hálito?",
  "Também vem delas.",
  "As bactérias soltam gases com enxofre,",
  "o mesmo tipo de cheiro de ovo podre.",
  "Escovar desmancha essa placa antes que ela cause estrago.",
  "Por isso o certo é escovar pelo menos duas vezes por dia,",
  "por uns dois minutos, com pasta com flúor.",
  "E passar o fio dental,",
  "porque a escova não alcança direito o espaço entre os dentes.",
  "Não esquece da língua, que também acumula bactérias.",
  "Comenta o tema do próximo vídeo.",
];

const words = fakeWords(LINES, 0.4, 14, 0.4);
const CY = 820;

/* ---------- formas ---------- */

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

const TOOTH =
  "M40 20 C60 0 90 10 100 22 C110 10 140 0 160 20 C185 45 180 90 170 120 C162 150 160 190 150 225 C145 240 128 238 124 222 L112 170 C108 158 92 158 88 170 L76 222 C72 238 55 240 50 225 C40 190 38 150 30 120 C20 90 15 45 40 20 Z";
const tooth = (x = 540, y = CY, w = 420, o: { stroke?: number; tone?: Tone } = {}): Layer =>
  path(TOOTH, [200, 240], w, { x, y, ...o });

/** bactérias: bastões e bolinhas espalhados numa área */
const bugs = (seed: number, n: number, cx: number, cy: number, rx: number, ry: number, tone: Tone = "base"): Layer =>
  draw((c) => {
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r());
      const x = cx + Math.cos(a) * d * rx;
      const y = cy + Math.sin(a) * d * ry;
      c.beginPath();
      if (r() < 0.5) c.arc(x, y, 14 + r() * 8, 0, Math.PI * 2);
      else c.roundRect(x - 26, y - 11, 52, 22, 11);
      c.fill();
    }
  }, tone);

const brush = (x = 540, y = CY): Layer[] => [
  draw((c) => c.fillRect(x - 380, y + 20, 520, 44)),
  draw((c) => c.fillRect(x + 140, y + 10, 240, 60)),
  draw((c) => {
    c.lineWidth = 10;
    for (let i = 0; i < 9; i++) {
      c.beginPath();
      c.moveTo(x + 160 + i * 26, y);
      c.lineTo(x + 160 + i * 26, y - 110);
      c.stroke();
    }
  }, "blue", 0.6),
];

const clock = (): Layer[] => [
  circle(540, CY, 260, { stroke: 14 }),
  draw((c) => {
    c.lineWidth = 16;
    c.beginPath();
    c.moveTo(540, CY);
    c.lineTo(540, CY - 180);
    c.moveTo(540, CY);
    c.lineTo(660, CY + 60);
    c.stroke();
  }),
];

const gum = (tone: Tone = "base"): Layer =>
  draw((c) => {
    c.lineWidth = 60;
    c.beginPath();
    c.moveTo(220, CY + 120);
    c.quadraticCurveTo(540, CY - 20, 860, CY + 120);
    c.stroke();
  }, tone);

const drops = (seed: number, tone: Tone): Layer =>
  draw((c) => {
    const r = rng(seed);
    for (let i = 0; i < 6; i++) {
      const x = 300 + r() * 480;
      const y = CY + 170 + r() * 160;
      c.beginPath();
      c.moveTo(x, y - 34);
      c.quadraticCurveTo(x + 24, y, x, y + 16);
      c.quadraticCurveTo(x - 24, y, x, y - 34);
      c.fill();
    }
  }, tone);

const cloud = (): Layer =>
  draw((c) => {
    for (const [x, y, r] of [
      [400, CY + 40, 130],
      [560, CY - 40, 170],
      [720, CY + 40, 130],
      [560, CY + 90, 140],
    ]) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
  });

const tongue = (): Layer[] => [
  draw((c) => {
    c.beginPath();
    c.moveTo(330, CY - 220);
    c.lineTo(750, CY - 220);
    c.lineTo(750, CY + 60);
    c.quadraticCurveTo(750, CY + 300, 540, CY + 300);
    c.quadraticCurveTo(330, CY + 300, 330, CY + 60);
    c.closePath();
    c.lineWidth = 14;
    c.stroke();
    c.beginPath();
    c.moveTo(540, CY - 180);
    c.lineTo(540, CY + 160);
    c.stroke();
  }),
  bugs(31, 14, 540, CY + 20, 150, 180, "yellow"),
];

const bubble = (): Layer =>
  draw((c) => {
    c.lineWidth = 16;
    c.beginPath();
    c.roundRect(240, CY - 200, 600, 360, 60);
    c.moveTo(380, CY + 160);
    c.lineTo(330, CY + 280);
    c.lineTo(470, CY + 160);
    c.stroke();
  });

/* ---------- cenas ---------- */

const scenes: Scene[] = [
  { cue: "", shape: scatter() },
  { cue: "Por", shape: shape("dente", [tooth()]) },
  {
    cue: "centenas",
    shape: shape("bacterias", [bugs(1, 40, 540, CY, 380, 380)]),
    overlays: [{ type: "label", text: "bactérias", x: 540, y: CY + 480 }],
  },
  {
    cue: "setecentas",
    shape: shape("700", [text("700+", 330, { y: CY })]),
    overlays: [{ type: "label", text: "espécies na boca", x: 540, y: CY + 240 }],
  },
  {
    cue: "maioria",
    shape: shape("poucas", [bugs(2, 10, 540, CY, 380, 380)]),
    overlays: [{ type: "label", text: "maioria inofensiva", x: 540, y: CY + 480, tone: "good" }],
    pan: "right",
  },
  {
    cue: "problema",
    shape: shape("juntas", [bugs(3, 60, 540, CY, 230, 230)]),
    overlays: [{ type: "label", text: "juntas", x: 540, y: CY + 330, tone: "accent" }],
  },
  {
    cue: "grudam",
    shape: shape("dente-grudam", [tooth(), bugs(4, 12, 540, CY - 300, 260, 50)]),
    pan: "down",
  },
  {
    cue: "película",
    shape: shape("placa", [tooth(), draw((c) => {
      c.lineWidth = 36;
      c.beginPath();
      c.moveTo(380, CY - 200);
      c.bezierCurveTo(460, CY - 280, 620, CY - 280, 700, CY - 200);
      c.stroke();
    }, "yellow")]),
    overlays: [{ type: "label", text: "placa bacteriana", x: 540, y: CY - 360, tone: "yellow" }],
  },
  {
    cue: "invisível",
    shape: shape("lupa", [circle(500, CY - 40, 240, { stroke: 16 }), draw((c) => {
      c.lineWidth = 34;
      c.beginPath();
      c.moveTo(680, CY + 140);
      c.lineTo(820, CY + 280);
      c.stroke();
    }), bugs(5, 10, 500, CY - 40, 150, 150, "yellow")]),
    overlays: [{ type: "label", text: "quase invisível", x: 540, y: CY + 400 }],
  },
  {
    cue: "começa",
    shape: shape("relogio", clock()),
    overlays: [{ type: "label", text: "poucas horas", x: 540, y: CY + 360 }],
  },
  {
    cue: "açúcar",
    shape: shape("acucar", [0, 1, 2, 3].map((i) =>
      draw((c) => c.fillRect(300 + (i % 2) * 260, CY - 230 + Math.floor(i / 2) * 260, 200, 200)),
    )),
    overlays: [{ type: "label", text: "açúcar", x: 540, y: CY + 330 }],
  },
  {
    cue: "ácido",
    shape: shape("acido", [text("ÁCIDO", 220, { y: CY }), drops(6, "accent")]),
  },
  {
    cue: "minerais",
    shape: shape("dente-mineral", [tooth(), draw((c) => {
      const r = rng(7);
      for (let i = 0; i < 26; i++) {
        c.beginPath();
        c.arc(260 + r() * 560, CY - 520 + r() * 180, 6 + r() * 8, 0, Math.PI * 2);
        c.fill();
      }
    })]),
    overlays: [{ type: "label", text: "minerais saindo", x: 540, y: CY + 360 }],
    pan: "up",
  },
  {
    cue: "cárie",
    shape: shape("carie", [draw((c) => {
      const p = new Path2D(TOOTH);
      c.translate(540 - 210, CY - 252);
      c.scale(2.1, 2.1);
      c.fill(p);
      c.globalCompositeOperation = "destination-out";
      c.beginPath();
      c.arc(70, 40, 26, 0, Math.PI * 2);
      c.fill();
    })]),
    overlays: [
      { type: "arrow", from: [220, CY - 420], to: [450, CY - 200], tone: "accent" },
      { type: "label", text: "cárie", x: 220, y: CY - 450, tone: "accent" },
    ],
  },
  { cue: "Mas", shape: shape("excl", [text("!", 700, { y: CY })]) },
  {
    cue: "gengiva",
    shape: shape("gengiva", [tooth(540, CY - 60, 380), gum()]),
    overlays: [{ type: "label", text: "gengiva", x: 540, y: CY + 260 }],
  },
  {
    cue: "vermelha",
    shape: shape("sangra", [tooth(540, CY - 60, 380), gum("accent"), drops(8, "accent")]),
    overlays: [{ type: "label", text: "inflamada", x: 540, y: CY - 360, tone: "accent" }],
  },
  {
    cue: "gengivite",
    shape: shape("gengivite", [text("GENGIVITE", 150, { y: CY })]),
    overlays: [{ type: "label", text: "inflamação da gengiva", x: 540, y: CY + 160, tone: "accent" }],
  },
  {
    cue: "endurece",
    shape: shape("tartaro", [tooth(), draw((c) => {
      const r = rng(9);
      for (let i = 0; i < 9; i++) {
        c.fillRect(350 + r() * 330, CY + 20 + r() * 60, 40 + r() * 30, 40 + r() * 30);
      }
    }, "yellow")]),
    overlays: [{ type: "label", text: "tártaro", x: 540, y: CY - 330, tone: "yellow" }],
  },
  {
    cue: "tártaro",
    skip: 1,
    shape: shape("escova-nao", brush()),
    overlays: [
      { type: "line", from: [360, CY - 320], to: [720, CY + 40], tone: "accent" },
      { type: "line", from: [720, CY - 320], to: [360, CY + 40], tone: "accent" },
      { type: "label", text: "escova não tira", x: 540, y: CY + 260, tone: "accent" },
    ],
  },
  {
    cue: "dentista",
    shape: shape("espelho", [
      draw((c) => {
        c.lineWidth = 24;
        c.beginPath();
        c.moveTo(260, CY + 380);
        c.lineTo(620, CY - 40);
        c.stroke();
      }),
      circle(680, CY - 120, 120, { stroke: 18 }),
    ]),
    overlays: [{ type: "label", text: "só o dentista", x: 540, y: CY + 470, tone: "good" }],
  },
  {
    cue: "osso",
    shape: shape("osso", [tooth(540, CY - 40), draw((c) => c.fillRect(140, CY + 120, 800, 140), "base", 0.5)]),
    overlays: [
      { type: "label", text: "osso", x: 160, y: CY + 320, align: "left" },
      { type: "arrow", from: [800, CY - 120], to: [800, CY + 100], tone: "accent" },
    ],
  },
  {
    cue: "periodontite",
    shape: shape("periodontite", [text("PERIODONTITE", 120, { y: CY })]),
  },
  {
    cue: "perda",
    shape: shape("perda", [tooth(540, CY - 160, 360), draw((c) => c.fillRect(140, CY + 180, 800, 120), "base", 0.5)]),
    overlays: [
      { type: "arrow", from: [540, CY + 20], to: [540, CY - 120], tone: "accent" },
      { type: "label", text: "perda de dentes", x: 540, y: CY + 400, tone: "accent" },
    ],
  },
  {
    cue: "hálito",
    shape: shape("halito", [cloud()]),
    overlays: [{ type: "label", text: "mau hálito", x: 540, y: CY + 330 }],
    pan: "up",
  },
  { cue: "delas", shape: shape("bacterias2", [bugs(10, 40, 540, CY, 300, 300)]) },
  {
    cue: "enxofre",
    shape: shape("enxofre", [text("S", 640, { y: CY, tone: "yellow" })]),
    overlays: [{ type: "label", text: "enxofre", x: 540, y: CY + 380, tone: "yellow" }],
  },
  {
    cue: "ovo",
    shape: shape("ovo", [draw((c) => {
      c.beginPath();
      c.ellipse(540, CY, 210, 280, 0, 0, Math.PI * 2);
      c.lineWidth = 16;
      c.stroke();
    })]),
    overlays: [{ type: "label", text: "cheiro de ovo podre", x: 540, y: CY + 380, tone: "accent" }],
  },
  {
    cue: "desmancha",
    shape: shape("escova-limpa", [...brush(), bugs(11, 14, 620, CY - 330, 300, 80, "yellow")]),
    overlays: [{ type: "label", text: "placa removida", x: 540, y: CY + 260, tone: "good" }],
    pan: "right",
  },
  {
    cue: "duas",
    shape: shape("2x", [text("2×", 560, { y: CY })]),
    overlays: [{ type: "label", text: "por dia", x: 540, y: CY + 320, tone: "good" }],
  },
  {
    cue: "minutos",
    shape: shape("2min", [text("2 MIN", 280, { y: CY })]),
    overlays: [{ type: "label", text: "pasta com flúor", x: 540, y: CY + 230, tone: "blue" }],
  },
  {
    cue: "fio",
    shape: shape("fio", [tooth(380, CY, 300), tooth(700, CY, 300), draw((c) => {
      c.lineWidth = 8;
      c.beginPath();
      c.moveTo(540, CY - 420);
      c.lineTo(540, CY + 300);
      c.stroke();
    }, "blue", 0.5)]),
    overlays: [{ type: "label", text: "fio dental", x: 540, y: CY + 420, tone: "blue" }],
  },
  {
    cue: "alcança",
    shape: shape("entre", [tooth(380, CY, 300), tooth(700, CY, 300), bugs(12, 8, 540, CY - 40, 18, 160, "yellow")]),
    overlays: [{ type: "label", text: "entre os dentes", x: 540, y: CY + 420, tone: "yellow" }],
  },
  {
    cue: "língua",
    shape: shape("lingua", tongue()),
    overlays: [{ type: "label", text: "língua", x: 540, y: CY + 400 }],
  },
  {
    cue: "Comenta",
    shape: shape("comenta", [bubble(), text("?", 260, { y: CY - 20 })]),
    overlays: [{ type: "label", text: "comenta o tema do próximo vídeo", x: 540, y: CY + 420, tone: "blue" }],
  },
];

export const escovar: VideoDef = {
  words,
  theme: THEMES.pb,
  scenes,
  durationInFrames: durationFor(words[words.length - 1].fim),
};
