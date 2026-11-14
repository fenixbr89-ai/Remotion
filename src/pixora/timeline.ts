// Linha do tempo absoluta do vídeo (30 fps, 1800 frames = 60 s).
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 1800;

/** Início de cada cena no roteiro (frames). Índice 11 = fim. */
export const START = [0, 120, 270, 360, 540, 780, 960, 1110, 1290, 1470, 1650, 1800];

/** Duração do desfoque cruzado (8 frames out + 8 frames in). */
export const BLUR_T = 16;
export const HALF = BLUR_T / 2;

/** Durações das sequências no TransitionSeries (inclui as sobreposições). */
export const DUR = {
  c01: 120, // corte com zoom → c02
  c02: 150, // corte seco com flash → c03
  c03: 90 + HALF,
  c04: 180 + BLUR_T,
  c05: 240 + BLUR_T,
  c06: 180 + BLUR_T,
  c07: 150 + BLUR_T,
  c08: 180 + BLUR_T,
  c09: 180 + BLUR_T,
  c10: 180 + HALF, // corte seco com flash → c11
  c11: 150,
} as const;

/** Narração (PT-BR) com a janela em que cada fala acontece. */
export const NARRACAO: { from: number; to: number; text: string }[] = [
  { from: 14, to: 112, text: "Seu conteúdo tá parado… e ninguém para pra ver?" },
  { from: 140, to: 262, text: "Imagem parada não prende ninguém." },
  { from: 282, to: 356, text: "Movimento é o que segura a atenção." },
  { from: 382, to: 528, text: "A Pixora cria vídeos comerciais com movimento de verdade." },
  { from: 566, to: 770, text: "Do estilo clean ao mais impactante, do jeito da sua marca." },
  { from: 806, to: 950, text: "Visual premium, limpo, profissional." },
  { from: 984, to: 1100, text: "Narração e trilha já vêm inclusas." },
  { from: 1146, to: 1226, text: "E o melhor…" },
  { from: 1330, to: 1462, text: "Preço acessível, segurança e entrega rápida." },
  { from: 1492, to: 1640, text: "Bora tirar o seu vídeo do papel? Chama a Pixora." },
];
