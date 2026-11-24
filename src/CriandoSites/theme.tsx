import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/InterTight";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

export const sans = loadSans("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;
export const serif = loadSerif("italic", {
  weights: ["400"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;

export const C = {
  preto: "#0A0A0A",
  branco: "#FFFFFF",
  cinza: "#D9D9D9",
  texto: "#111111",
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/**
 * Texto no estilo do perfil: sans bold apertada + palavras em serif itálico.
 * Marque as palavras em serif com *asteriscos*: "e nenhum *site*."
 * Use "\n" para quebrar linha.
 */
export const Frase: React.FC<{
  texto: string;
  tamanho?: number;
  cor?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ texto, tamanho = 84, cor = C.texto, delay = 0, style }) => {
  const frame = useCurrentFrame() - delay;
  const linhas = texto.split("\n");
  return (
    <div
      style={{
        textAlign: "center",
        color: cor,
        fontFamily: sans,
        fontWeight: 800,
        fontSize: tamanho,
        letterSpacing: "-0.045em",
        lineHeight: 1.02,
        ...style,
      }}
    >
      {linhas.map((linha, i) => (
        <div
          key={i}
          style={{
            opacity: interpolate(frame, [i * 3, i * 3 + 8], [0, 1], clamp),
            translate: interpolate(
              frame,
              [i * 3, i * 3 + 14],
              ["0px 28px", "0px 0px"],
              { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
            ),
          }}
        >
          {linha.split(/(\*[^*]+\*)/g).map((parte, j) =>
            parte.startsWith("*") ? (
              <span
                key={j}
                style={{
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "1.12em",
                  letterSpacing: "-0.02em",
                }}
              >
                {parte.slice(1, -1)}
              </span>
            ) : (
              <span key={j}>{parte}</span>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

/** Entrada com leve escala + fade, usada em cards e mídias. */
export const useEntrada = (delay = 0) => {
  const frame = useCurrentFrame() - delay;
  return {
    opacity: interpolate(frame, [0, 8], [0, 1], clamp),
    scale: interpolate(frame, [0, 16], [0.9, 1], {
      ...clamp,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  };
};
