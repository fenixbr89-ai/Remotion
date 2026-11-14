// Juliano Pinturas — estilo iPhone, guiado pelo roteiro de narração (30 fps, 990 frames = 33 s).
export const J = {
  laranja: "#F26A1B",
  ambar: "#FF9F43",
  preto: "#111111",
  fundo: "#F8F8FA",
  cinza: "#8E8E93",
  cinzaEscuro: "#3A3A3C",
  linha: "#E5E5EA",
  verde: "#34C759",
  verdeEscuro: "#1E9E45",
};

export const GRADIENTE = `linear-gradient(90deg, #E2560B 0%, ${J.laranja} 40%, ${J.ambar} 100%)`;

/**
 * Cenas (frames) e as falas que cada uma cobre:
 * A 0–156     "Precisa pintar, reformar ou consertar alguma coisa? Chama o Juliano."
 * B 156–510   "Pintura, pintura automotiva, elétrica, ... e pós-obra. Tudo com um só contato."
 * C 510–660   "Da parede da sua casa à pintura do seu carro."
 * D 660–780   "Com qualidade, capricho e confiança."
 * E 780–990   "Peça seu orçamento pelo WhatsApp. Juliano Pinturas. Transformando seus espaços."
 */
export const START = [0, 156, 510, 660, 780, 990];
export const TRANS = [12, 12, 16, 16];
export const J_TOTAL = START[START.length - 1];

const n = START.length - 1;
const dur = (i: number) =>
  START[i + 1] -
  START[i] +
  (i > 0 ? TRANS[i - 1] / 2 : 0) +
  (i < n - 1 ? TRANS[i] / 2 : 0);
export const DUR = {
  a: dur(0),
  b: dur(1),
  c: dur(2),
  d: dur(3),
  e: dur(4),
} as const;

/** Os serviços na ordem em que são falados. */
export const SERVICOS: {
  src: string;
  titulo: string;
  sub: string;
  filtro?: string;
}[] = [
  {
    src: "emoji/pincel",
    titulo: "Pintura",
    sub: "Paredes, fachadas e acabamento",
    filtro: "hue-rotate(28deg) saturate(1.3)",
  },
  { src: "3d/carro", titulo: "Pintura automotiva", sub: "Seu carro como novo" },
  { src: "3d/lampada", titulo: "Elétrica", sub: "Instalações elétricas" },
  { src: "3d/bomba", titulo: "Hidráulica", sub: "Instalações hidráulicas" },
  { src: "3d/gota", titulo: "Caixa d'água", sub: "Instalação e manutenção" },
  { src: "3d/casa", titulo: "Telhado", sub: "Telhados e calhas" },
  { src: "3d/tijolos", titulo: "Reformas", sub: "Pequenas reformas" },
  { src: "3d/vassoura", titulo: "Pós-obra", sub: "Limpeza e acabamento final" },
];
