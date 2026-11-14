import { Easing } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

export const { fontFamily: SANS } = loadMontserrat("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin", "latin-ext"],
});
export const { fontFamily: CONDENSADA } = loadOswald("normal", {
  weights: ["500", "700"],
  subsets: ["latin", "latin-ext"],
});

export const COR = {
  fundo: "#FAFAF9",
  cinzaClaro: "#EFEFED",
  linha: "#E4E3E0",
  texto: "#121212",
  textoSuave: "#5E5E5E",
  laranja: "#F26A1B",
  laranjaClaro: "#FF9A57",
  agua: "#7FBCE0",
  paredeVelha: "#BDB7AD",
  paredeNova: "#F1DFCB",
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Saída suave, tipo "ease-out expo". */
export const suave = Easing.bezier(0.16, 1, 0.3, 1);
/** Entrada e saída suaves, para movimentos de câmera. */
export const camera = Easing.bezier(0.65, 0, 0.35, 1);

export const FPS = 30;
