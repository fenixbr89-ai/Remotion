import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, spring, staticFile } from "remotion";

// Fonte da marca (Plus Jakarta Sans, OFL) servida de public/fonts — o render não depende de internet.
export const fontFamily = "Plus Jakarta Sans";
for (const weight of ["500", "600", "700", "800"]) {
  loadFont({ family: fontFamily, url: staticFile(`fonts/plus-jakarta-sans-latin-${weight}-normal.woff2`), weight });
}

/** Paleta: branco de fundo, azul da logo em degradê, preto só em detalhes. */
export const cor = {
  branco: "#FFFFFF",
  gelo: "#F5F8FF",
  azulFundo: "#EAF1FF",
  azulBorda: "#DCE6FA",
  azulProfundo: "#1D4ED8",
  azul: "#3B82F6",
  azulClaro: "#60A5FA",
  azulCeu: "#BFDBFE",
  texto: "#0E2A6B",
  textoSuave: "#5B6B8C",
  preto: "#111318",
  vermelho: "#EF4444",
  vermelhoFundo: "#FEECEC",
  verde: "#16A34A",
  verdeFundo: "#E8F7EE",
};

export const degrade = `linear-gradient(120deg, ${cor.azulProfundo} 0%, ${cor.azul} 55%, ${cor.azulClaro} 100%)`;

/** Texto preenchido com o degradê da marca. */
export const textoDegrade: React.CSSProperties = {
  backgroundImage: degrade,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const sombra = "0 24px 60px rgba(29, 78, 216, 0.12), 0 4px 14px rgba(17, 19, 24, 0.05)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 com mola, começando no frame `inicio`. */
export const entra = (frame: number, fps: number, inicio: number, damping = 14) =>
  spring({ frame: frame - inicio, fps, config: { damping, mass: 0.8 } });

/** 0→1 suave entre dois frames. */
export const suave = (frame: number, de: number, ate: number) =>
  interpolate(frame, [de, ate], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

/** Flutuação contínua (px) para ícones decorativos. */
export const flutua = (frame: number, fase = 0, amp = 14) => Math.sin(frame / 22 + fase) * amp;
