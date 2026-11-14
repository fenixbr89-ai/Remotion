/**
 * Geometria (px no quadro 1080×1920) dos elementos que viram "ponte" entre cenas.
 * As cenas desenham esses elementos exatamente aqui; o morph entre cenas usa os mesmos valores.
 */
export type Ret = { x: number; y: number; w: number; h: number; r: number };


export const LOJA_TOPO = 620;
export const G = {
  ganchoBarra: { x: 220, y: 1024, w: 640, h: 18, r: 9 },
  lojaPorta: { x: 682, y: LOJA_TOPO + 276, w: 150, h: 296, r: 16 },
  chuteRisco: { x: 190, y: 884, w: 700, h: 20, r: 10 },
  contaBarra: { x: 240, y: 1180, w: 600, h: 22, r: 11 },
  cardapioPilula: { x: 450, y: 1170, w: 180, h: 66, r: 33 },
  cardapioCopo: { x: 420, y: 874, w: 240, h: 276, r: 0 },
  custoCopo: { x: 140, y: 727, w: 300, h: 345, r: 0 },
  custoTotal: { x: 70, y: 1250, w: 940, h: 152, r: 40 },
  erroValor: { x: 90, y: 840, w: 900, h: 235, r: 0 },
  erroBarra: { x: 240, y: 1086, w: 600, h: 18, r: 9 },
  appTotal: { x: 576, y: 785, w: 172, h: 45, r: 0 },
  appResultado: { x: 308, y: 1042, w: 464, h: 170, r: 28 },
  sobraBarra: { x: 250, y: 950, w: 580, h: 18, r: 9 },
  formulaLinha: { x: 50, y: 440, w: 980, h: 110, r: 30 },
  formulaEtiqueta: { x: 520, y: 1010, w: 420, h: 177, r: 32 },
  divisaoBarra: { x: 70, y: 560, w: 940, h: 150, r: 36 },
  mesCalendario: { x: 610, y: 480, w: 280, h: 230, r: 36 },
  mesLucro: { x: 70, y: 940, w: 940, h: 260, r: 44 },
  fraseBarra: { x: 240, y: 1170, w: 600, h: 22, r: 11 },
  produtoLogo: { x: 332, y: 555, w: 50, h: 50, r: 14 },
  produtoBotao: { x: 325, y: 1460, w: 430, h: 106, r: 53 },
  comentaFaixa: { x: 60, y: 420, w: 960, h: 215, r: 40 },
  comentaCoracao: { x: 331, y: 1027, w: 30, h: 30, r: 15 },
  outroCoracao: { x: 290, y: 1180, w: 110, h: 110, r: 55 },
} satisfies Record<string, Ret>;

/** Estilo absoluto a partir de um retângulo. */
export const naPosicao = (r: Ret): React.CSSProperties => ({ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r });
