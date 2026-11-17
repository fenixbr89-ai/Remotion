import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// ---------------------------------------------------------------------------
// Vídeo
// ---------------------------------------------------------------------------
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** segundos -> frame absoluto */
export const s = (sec: number) => Math.round(sec * FPS);

// ---------------------------------------------------------------------------
// Cores
// ---------------------------------------------------------------------------
export const C = {
  bg: "#F5F7FB",
  bgBlue: "#E6EFFC",
  grid: "rgba(11,31,77,.05)",
  navy: "#0B1F4D",
  blue: "#1D4ED8",
  sky: "#38BDF8",
  gray: "#8A94A6",
  strike: "#C3CAD6",
  white: "#FFFFFF",
  soft: "#EEF3FC",
  ring: "#DCE8FB",
  gradient: "linear-gradient(90deg, #1D4ED8 0%, #38BDF8 100%)",
  gradientDiag: "linear-gradient(135deg, #1D4ED8 0%, #38BDF8 100%)",
  shadow: "0 30px 80px rgba(11,31,77,.12)",
  shadowSm: "0 14px 36px rgba(11,31,77,.12)",
};

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------
// Arquivos locais (OFL) em public/fonts: não dependem de rede na renderização.
for (const w of ["500", "600", "700", "800"]) {
  loadFont({
    family: "Inter",
    url: staticFile(`fonts/inter-latin-${w}-normal.woff2`),
    weight: w,
    style: "normal",
  });
}
for (const w of ["600", "700"]) {
  loadFont({
    family: "Lora",
    url: staticFile(`fonts/lora-latin-${w}-italic.woff2`),
    weight: w,
    style: "italic",
  });
}
export const FONT = {
  sans: "Inter, sans-serif",
  serif: "Lora, serif",
};

// ---------------------------------------------------------------------------
// Layout (safe area)
// ---------------------------------------------------------------------------
export const SAFE = 100;
export const CAPTION_TOP = 1330;
export const CAPTION_BOTTOM = 1550;
export const CARD_W = 840;
export const CARD_X = (WIDTH - CARD_W) / 2; // 120

export const TRANSITION = Math.round(0.35 * FPS); // ~10 frames de saída/entrada
