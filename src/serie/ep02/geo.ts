import type { Ret } from "../geo";

/** Tempos (frames, 30 fps) e geometria do EP. 02. 38 s = 1140 frames. */
export const FPS = 30;
export const DURACAO = 38 * FPS;
export const s = (seg: number) => Math.round(seg * FPS);

export const CENAS02 = {
  gancho: { de: 0, ate: s(4.5) },
  custo: { de: s(4.5), ate: s(14) },
  erro: { de: s(14), ate: s(20) },
  preco: { de: s(20), ate: s(28) },
  sobra: { de: s(28), ate: s(34) },
  cta: { de: s(34), ate: DURACAO },
};

export const G2 = {
  ganchoBarra: { x: 240, y: 1010, w: 600, h: 20, r: 10 },
  custoCard: { x: 120, y: 500, w: 840, h: 900, r: 44 },
  custoMini: { x: 160, y: 526, w: 84, h: 84, r: 24 },
  custoTotal: { x: 160, y: 1236, w: 760, h: 130, r: 34 },
  erroCusto: { x: 320, y: 590, w: 440, h: 86, r: 43 },
  erroRisco: { x: 170, y: 910, w: 740, h: 26, r: 13 },
  celular: { x: 260, y: 500, w: 560, h: 1131, r: 0 },
  chatEntrada: { x: 298, y: 1512, w: 390, h: 88, r: 44 },
  chatEnviar: { x: 700, y: 1512, w: 88, h: 88, r: 44 },
  chatIfood: { x: 326, y: 1136, w: 428, h: 96, r: 26 },
  sobraCard: { x: 120, y: 520, w: 840, h: 820, r: 44 },
  sobraVendeu: { x: 160, y: 640, w: 760, h: 96, r: 26 },
  sobraSobrou: { x: 160, y: 1150, w: 760, h: 160, r: 34 },
  ctaLogo: { x: 400, y: 560, w: 280, h: 280, r: 140 },
  ctaBotao: { x: 330, y: 1160, w: 420, h: 120, r: 60 },
} satisfies Record<string, Ret>;
