// Linha do tempo absoluta do vídeo (30 fps, 1800 frames = 60 s).
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 1800;

/** Início de cada cena no roteiro (frames). Último índice = fim. */
export const START = [0, 120, 270, 360, 540, 780, 960, 1110, 1290, 1470, 1605, 1680, 1800];
export const SCENES = START.length - 1;

/**
 * Transição entre a cena k+1 e k+2 (frames de sobreposição).
 * 0 = a passagem acontece dentro da própria cena (zoom, ponto que cresce, círculo).
 */
export const TRANS = [0, 0, 0, 20, 20, 20, 20, 20, 20, 0, 0];

/** Frame absoluto em que a sequência da cena i (0-based) começa. */
export const sceneFrom = (i: number) => START[i] - (i > 0 ? TRANS[i - 1] / 2 : 0);

const sceneDur = (i: number) =>
  START[i + 1] - START[i] + (i > 0 ? TRANS[i - 1] / 2 : 0) + (i < SCENES - 1 ? TRANS[i] / 2 : 0);

export const DUR = {
  c01: sceneDur(0),
  c02: sceneDur(1),
  c03: sceneDur(2),
  c04: sceneDur(3),
  c05: sceneDur(4),
  c06: sceneDur(5),
  c07: sceneDur(6),
  c08: sceneDur(7),
  c09: sceneDur(8),
  c10: sceneDur(9),
  c11: sceneDur(10),
  c12: sceneDur(11),
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
