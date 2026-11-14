import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Inter (Google Fonts, licença OFL) — a mais próxima da SF Pro, embutida para render offline
export const FONT = "Inter";
loadFont({
  family: FONT,
  url: staticFile("fonts/Inter-Variable.woff2"),
  weight: "100 900",
});

// Paleta Apple + laranja da marca
export const C = {
  black: "#000000",
  light: "#F5F5F7",
  white: "#FFFFFF",
  text: "#1D1D1F",
  grey: "#86868B",
  hair: "#D2D2D7",
  orange: "#FF6B00",
};

export const ORANGE_GRADIENT =
  "linear-gradient(90deg, #FF9F0A 0%, #FF6B00 55%, #FF4500 100%)";

// Trilha a 120 BPM => 1 batida = 15 frames
export const BEAT = 15;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Curva "ease out" das animações de interface da Apple
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
