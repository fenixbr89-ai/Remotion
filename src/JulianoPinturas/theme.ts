import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Inter (Google Fonts, licença OFL), embutida para render offline.
// Pesos altos + tracking negativo aproximam a tipografia das campanhas da Apple.
export const SANS = "Inter";
loadFont({
  family: SANS,
  url: staticFile("fonts/Inter-Variable.woff2"),
  weight: "100 900",
});

// Identidade da logo: preto, branco e laranja
export const C = {
  black: "#000000",
  white: "#F5F5F7",
  text: "#1D1D1F",
  grey: "#86868B",
  orange: "#FF6B00",
};

// Texto em degradê laranja (destaques)
export const ORANGE_GRADIENT =
  "linear-gradient(90deg, #FF9500 0%, #FF6B00 50%, #FF4D00 100%)";

// Trilha a 120 BPM => 1 batida = 15 frames
export const BEAT = 15;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Curva suave e precisa, típica das animações da Apple
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
