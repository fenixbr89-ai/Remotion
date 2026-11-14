import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Fontes embutidas em public/fonts (Google Fonts, licença OFL) para render offline
export const DISPLAY = "Anton";
export const SANS = "Inter";
loadFont({ family: DISPLAY, url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" });
loadFont({ family: SANS, url: staticFile("fonts/Inter-Variable.woff2"), weight: "100 900" });

// Identidade visual da logo: preto, branco e laranja
export const C = {
  black: "#0B0B0B",
  ink: "#151515",
  white: "#F5F5F3",
  orange: "#FF6B00",
  orangeDeep: "#E85500",
  grey: "#8A8A8A",
};

export const FPS = 30;
// Trilha a 120 BPM => 1 batida = 15 frames, 1 compasso = 60 frames
export const BEAT = 15;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const SNAP = Easing.bezier(0.05, 0.9, 0.1, 1);
