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

/** Narração (PT-BR) com a janela em que cada fala acontece. */
export const NARRACAO: { from: number; to: number; text: string }[] = [
  { from: 14, to: 112, text: "Seu conteúdo tá parado… e ninguém para pra ver?" },
  { from: 140, to: 262, text: "Imagem parada não prende ninguém." },
  { from: 282, to: 356, text: "Movimento é o que segura a atenção." },
  { from: 386, to: 590, text: "Do estilo clean ao mais impactante, do jeito da sua marca." },
  { from: 626, to: 770, text: "Visual premium, limpo, profissional." },
  { from: 804, to: 920, text: "Narração e trilha já vêm inclusas." },
  { from: 966, to: 1046, text: "E o melhor…" },
  { from: 1150, to: 1282, text: "Preço acessível, segurança e entrega rápida." },
  { from: 1312, to: 1460, text: "Bora tirar o seu vídeo do papel? Chama a Pixora." },
];
