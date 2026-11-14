import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Poppins (Google Fonts, licença OFL), embutida para render offline
export const FONT = "Poppins";
for (const w of ["500", "600", "700", "800"]) {
  loadFont({
    family: FONT,
    url: staticFile(`fonts/Poppins-${w}.woff2`),
    weight: w,
  });
}

// Fundo claro, texto grafite e laranja da marca como único destaque
export const C = {
  bg: "#FAFAFA",
  ink: "#1C1C1C",
  grey: "#8E8E8E",
  light: "#E7E7E7",
  mid: "#5E5E5E",
  orange: "#FF6B00",
  white: "#FFFFFF",
};

// Trilha a 120 BPM => 1 batida = 15 frames
export const BEAT = 15;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);
