// Linha do tempo absoluta do vídeo (30 fps, 1620 frames = 54 s).
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * Início de cada cena no roteiro (frames); o último índice é o fim.
 * Ordem: gancho, problema, virada, estilos, diferencial 1, diferencial 2,
 * prova social, benefícios, chamada, espera, logo.
 */
export const START = [0, 120, 270, 360, 600, 780, 930, 1110, 1290, 1425, 1500, 1620];
export const SCENES = START.length - 1;
export const TOTAL = START[SCENES];

/** Índice de cada cena em START. */
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
export const TRANS = [0, 0, 0, 20, 20, 20, 20, 20, 0, 0];

/** Frame absoluto em que a sequência da cena i começa. */
export const sceneFrom = (i: number) => START[i] - (i > 0 ? TRANS[i - 1] / 2 : 0);

const sceneDur = (i: number) =>
  START[i + 1] - START[i] + (i > 0 ? TRANS[i - 1] / 2 : 0) + (i < SCENES - 1 ? TRANS[i] / 2 : 0);

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

/**
 * Narração gravada (public/narracao/pixora_narracao.wav, 30,5 s).
 * Cada trecho do arquivo [de, ate] (segundos) toca a partir de `em` (segundos no vídeo).
 */
export const NARRACAO_ARQUIVO = "narracao/pixora_narracao.wav";
export const NARRACAO_CLIPS: { de: number; ate: number; em: number; text: string }[] = [
  { de: 0.0, ate: 3.05, em: 0.3, text: "Seu conteúdo tá parado… e ninguém para pra ver?" },
  { de: 3.5, ate: 5.35, em: 5.0, text: "Imagem parada não prende ninguém." },
  { de: 5.68, ate: 7.4, em: 9.4, text: "Movimento é o que prende." },
  { de: 7.84, ate: 11.82, em: 12.6, text: "Do estilo clean ao mais impactante, do jeito da sua marca." },
  { de: 12.06, ate: 15.08, em: 20.4, text: "Visual premium, limpo, profissional." },
  { de: 15.52, ate: 17.36, em: 26.4, text: "Narração e trilha já vêm inclusas." },
  { de: 17.64, ate: 20.36, em: 31.7, text: "E a entrega? Mais rápida do que você imagina." },
  { de: 20.72, ate: 26.32, em: 37.4, text: "E o melhor: tudo isso por apenas cinquenta reais. Seguro e sem complicação." },
  { de: 26.68, ate: 28.1, em: 44.2, text: "Bora tirar o seu vídeo do papel?" },
  { de: 28.3, ate: 30.48, em: 46.6, text: "Chama a Pixora. Tô te esperando!" },
];

/** Janelas de fala em frames (usadas pelas legendas e para abaixar a trilha). */
export const NARRACAO: { from: number; to: number; text: string }[] = NARRACAO_CLIPS.map((c) => ({
  from: Math.round(c.em * FPS),
  to: Math.round((c.em + c.ate - c.de) * FPS),
  text: c.text,
}));
