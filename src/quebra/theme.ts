import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FPS = 60;
export const W = 1080;
export const H = 1920;

/**
 * Paleta Quebra Padrão: base PRETO E BRANCO, com detalhezinhos coloridos
 * quando a cor ajuda a explicar (rótulo, seta, raio, pontinho — nunca a cena toda):
 * vermelho = negativo · verde = positivo · azul e amarelo = detalhes do assunto.
 */
export const BASE = "#F4F6FF";
export const ACCENT_RED = "#FF3B3B";
export const GOOD_GREEN = "#3DDC84";
export const DETAIL_BLUE = "#3DA5FF";
export const DETAIL_YELLOW = "#FFC83D";
export const BG_TOP = "#0C0A12";
export const BG = "#000000";

export const THEMES = {
  pb: BASE, // padrão: preto e branco
  // as cores abaixo só por pedido explícito — o padrão do canal é preto e branco
  eletrico: "#3DA5FF", // átomos, eletricidade, céu
  energia: "#FFC83D", // energia, sol, calor
  vida: "#3DFF9A", // biologia
  espaco: "#A78BFF", // espaço
} as const;

export const FONT_SANS = "Inter Display";
export const FONT_MONO = "JetBrains Mono";

let fontsPromise: Promise<unknown> | null = null;
export const loadQuebraFonts = () => {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadFont({
        family: FONT_SANS,
        url: staticFile("fonts/InterDisplay-SemiBold.otf"),
        weight: "600",
      }),
      loadFont({
        family: FONT_SANS,
        url: staticFile("fonts/InterDisplay-Black.otf"),
        weight: "900",
      }),
      loadFont({
        family: FONT_MONO,
        url: staticFile("fonts/JetBrainsMono-Medium.ttf"),
        weight: "500",
      }),
    ]);
  }
  return fontsPromise;
};

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

/** RNG determinístico (mulberry32). */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const hashString = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
