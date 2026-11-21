import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { montserrat } from "./fonts";

type EndCardProps = {
  readonly headline: string;
  readonly cta: string;
  readonly tagline: string;
};

// Cartão final com chamada para ação
const EndCardInner: React.FC<EndCardProps> = ({ headline, cta, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = (delay: number) =>
    interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 35%, #A3203A 0%, #5A0F1E 55%, #2A060D 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: montserrat,
          color: "white",
          textAlign: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 260,
            scale: interpolate(frame, [0, 0.6 * fps], [0, 1], {
              easing: Easing.spring({ damping: 10, mass: 0.7 }),
              output: "perceptual-scale",
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            rotate: `${interpolate(frame, [0, 3 * fps], [-30, 15])}deg`,
          }}
        >
          🍕
        </div>
        <div
          style={{
            marginTop: 30,
            fontWeight: 900,
            fontSize: 118,
            lineHeight: 0.98,
            letterSpacing: -3,
            textTransform: "uppercase",
            opacity: enter(5),
            translate: `0px ${(1 - enter(5)) * 50}px`,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: 60,
            padding: "30px 70px",
            borderRadius: 999,
            backgroundColor: "#FFD23F",
            color: "#3A0A12",
            fontWeight: 900,
            fontSize: 72,
            textTransform: "uppercase",
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            opacity: enter(12),
            scale:
              interpolate(enter(12), [0, 1], [0.7, 1]) *
              interpolate(Math.sin(frame / 5), [-1, 1], [0.97, 1.03]),
          }}
        >
          {cta}
        </div>
        <div
          style={{
            marginTop: 70,
            fontWeight: 600,
            fontSize: 48,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#FFD23F",
            opacity: enter(20),
          }}
        >
          {tagline}
        </div>
      </div>
    </>
  );
};

export const EndCard = Interactive.create({
  Component: EndCardInner,
  layout: "absolute-fill",
  schema: {
    headline: {
      type: "string",
      default: "Já fez seu pedido hoje?",
      description: "Título",
    },
    cta: { type: "string", default: "Peça agora!", description: "Botão" },
    tagline: {
      type: "string",
      default: "Sabor irresistível",
      description: "Assinatura",
    },
  },
});
