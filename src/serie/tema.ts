import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, spring, staticFile } from "remotion";

// Fonte da marca (Plus Jakarta Sans, OFL) servida de public/fonts — o render não depende de internet.
export const fontFamily = "Plus Jakarta Sans";
for (const weight of ["500", "600", "700", "800"]) {
  loadFont({ family: fontFamily, url: staticFile(`fonts/plus-jakarta-sans-latin-${weight}-normal.woff2`), weight });
}

export const cor = {
  azul: "#3B82F6",
  azulClaro: "#60A5FA",
  azulEscuro: "#1E40AF",
  escuro: "#17181A",
  escuro2: "#232428",
  claro: "#F4F4F2",
  cinza: "#8A8D90",
  branco: "#FFFFFF",
  vermelho: "#EF4444",
  verde: "#22C55E",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 com mola, começando no frame `inicio`. */
export const entra = (frame: number, fps: number, inicio: number, damping = 14) =>
  spring({ frame: frame - inicio, fps, config: { damping, mass: 0.8 } });

/** 0→1 suave entre dois frames. */
export const suave = (frame: number, de: number, ate: number) =>
  interpolate(frame, [de, ate], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

/** Opacidade de saída nos últimos `dur` frames da cena. */
export const sai = (frame: number, total: number, dur = 10) =>
  interpolate(frame, [total - dur, total], [1, 0], clamp);
