// Juliano Pinturas — cores e linha do tempo (30 fps, 1350 frames = 45 s).
export const J = {
  laranja: "#F26A1B",
  laranjaClaro: "#FFB27A",
  preto: "#111111",
  cinza: "#F2F2F2",
  cinzaMedio: "#8E8E93",
  parede: "#D9D9D9",
  tinta: "#F6EEE6",
  agua: "#9CC9EA",
};

/** Início de cada cena (frames); o último índice é o fim. */
export const J_START = [0, 150, 360, 600, 870, 1110, 1350];
export const J_TOTAL = J_START[J_START.length - 1];
/** Pincelada laranja entre as cenas (frames de sobreposição). */
export const J_TRANS = [20, 20, 20, 20, 20];

const n = J_START.length - 1;
const dur = (i: number) =>
  J_START[i + 1] -
  J_START[i] +
  (i > 0 ? J_TRANS[i - 1] / 2 : 0) +
  (i < n - 1 ? J_TRANS[i] / 2 : 0);

export const J_DUR = {
  j01: dur(0),
  j02: dur(1),
  j03: dur(2),
  j04: dur(3),
  j05: dur(4),
  j06: dur(5),
} as const;

export const J_SFX = "juliano";
