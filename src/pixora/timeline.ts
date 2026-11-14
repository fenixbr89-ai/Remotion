// Linha do tempo guiada pela narração gravada (30 fps, 1035 frames = 34,5 s).
// A voz (public/narracao/pixora_narracao.wav) toca inteira a partir do frame 0;
// cada cena começa e termina nas pausas da fala.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Segundos → frames. */
export const S = (sec: number) => Math.round(sec * FPS);

/**
 * Início de cada cena (frames); o último índice é o fim.
 * Ordem: gancho, problema, virada, estilos, diferencial 1, diferencial 2,
 * prova social, benefícios, chamada, espera, logo.
 */
export const START = [
  0, 102, 165, 228, 360, 459, 525, 618, 795, 846, 918, 1035,
];
export const SCENES = START.length - 1;
export const TOTAL = START[SCENES];

export const IDX = {
  c01: 0,
  c02: 1,
  c03: 2,
  c05: 3,
  c06: 4,
  c07: 5,
  c08: 6,
  c09: 7,
  c10: 8,
  c11: 9,
  c12: 10,
} as const;

/**
 * Transição entre a cena k e k+1 (frames de sobreposição).
 * 0 = a passagem acontece dentro da própria cena (zoom, ponto que cresce, círculo).
 */
export const TRANS = [0, 0, 0, 10, 10, 10, 10, 10, 0, 0];

/** Frame absoluto em que a sequência da cena i começa. */
export const sceneFrom = (i: number) =>
  START[i] - (i > 0 ? TRANS[i - 1] / 2 : 0);

/** Momento da narração (segundos) → frame local da cena i. */
export const loc = (i: number, sec: number) => S(sec) - sceneFrom(i);

const sceneDur = (i: number) =>
  START[i + 1] -
  START[i] +
  (i > 0 ? TRANS[i - 1] / 2 : 0) +
  (i < SCENES - 1 ? TRANS[i] / 2 : 0);

export const DUR = {
  c01: sceneDur(IDX.c01),
  c02: sceneDur(IDX.c02),
  c03: sceneDur(IDX.c03),
  c05: sceneDur(IDX.c05),
  c06: sceneDur(IDX.c06),
  c07: sceneDur(IDX.c07),
  c08: sceneDur(IDX.c08),
  c09: sceneDur(IDX.c09),
  c10: sceneDur(IDX.c10),
  c11: sceneDur(IDX.c11),
  c12: sceneDur(IDX.c12),
} as const;

export const NARRACAO_ARQUIVO = "narracao/pixora_narracao.wav";

/** Trechos com voz na gravação (segundos) — usados para abaixar a trilha. */
export const FALA: [number, number][] = [
  [0, 2.9],
  [3.59, 5.23],
  [5.76, 7.28],
  [7.92, 9.9],
  [10.3, 11.7],
  [12.14, 13.93],
  [14.49, 14.95],
  [15.6, 17.24],
  [17.72, 18.3],
  [18.7, 20.24],
  [20.8, 21.27],
  [21.7, 24.09],
  [24.53, 26.2],
  [26.76, 27.98],
  [28.38, 30.48],
];

/** Falas (para legendas opcionais). */
export const NARRACAO: { from: number; to: number; text: string }[] = [
  {
    from: S(0),
    to: S(2.9),
    text: "Seu conteúdo tá parado… e ninguém para pra ver?",
  },
  { from: S(3.59), to: S(5.23), text: "Imagem parada não prende ninguém." },
  { from: S(5.76), to: S(7.28), text: "Movimento é o que prende." },
  {
    from: S(7.92),
    to: S(11.7),
    text: "Do estilo clean ao mais impactante, do jeito da sua marca.",
  },
  {
    from: S(12.14),
    to: S(14.95),
    text: "Visual premium, limpo, profissional.",
  },
  { from: S(15.6), to: S(17.24), text: "Narração e trilha já vêm inclusas." },
  {
    from: S(17.72),
    to: S(20.24),
    text: "E a entrega? Mais rápida do que você imagina.",
  },
  {
    from: S(20.8),
    to: S(26.2),
    text: "E o melhor: tudo isso por apenas cinquenta reais. Seguro e sem complicação.",
  },
  { from: S(26.76), to: S(27.98), text: "Bora tirar o seu vídeo do papel?" },
  { from: S(28.38), to: S(30.48), text: "Chama a Pixora. Tô te esperando!" },
];
