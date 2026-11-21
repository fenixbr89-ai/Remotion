import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { montserrat } from "./fonts";

// Flash de luz quente (estilo light leak) por cima de cada corte.
// "length" deve ser igual ao durationInFrames do TransitionSeries.Overlay.
const LightLeakOverlayInner: React.FC<{
  readonly length: number;
  readonly originX: number;
  readonly color: string;
  readonly style?: React.CSSProperties;
}> = ({ length, originX, color, style }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, length / 2, length], [0, 1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", ...style }}>
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: progress,
          background: `radial-gradient(ellipse 90% 70% at ${originX}% ${
            40 + progress * 10
          }%, ${color} 0%, rgba(255,120,40,0.55) 35%, rgba(255,60,20,0) 75%)`,
        }}
      />
      <AbsoluteFill
        style={{ backgroundColor: "white", opacity: progress * 0.35 }}
      />
    </AbsoluteFill>
  );
};

export const LightLeakOverlay = Interactive.create({
  Component: LightLeakOverlayInner,
  layout: "none",
  schema: {
    length: { type: "number", default: 16, min: 2, step: 1, description: "Duração (frames)", hiddenFromList: false },
    originX: { type: "number", default: 20, min: 0, max: 100, description: "Posição da luz (%)", hiddenFromList: false },
    color: { type: "color", default: "#FFD9A0", description: "Cor da luz" },
  },
});

// Escurece bordas e topo/base para dar contraste a legendas e selos
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%), linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);

// Barra de progresso fina no topo
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 10,
        width: `${(frame / (durationInFrames - 1)) * 100}%`,
        background: "linear-gradient(90deg, #FFD23F, #FF7A1A)",
      }}
    />
  );
};

// Título de abertura ("gancho")
const OpeningTitleInner: React.FC<{
  readonly kicker: string;
  readonly title: string;
  readonly subtitle: string;
  readonly style?: React.CSSProperties;
}> = ({ kicker, title, subtitle, style }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = (delay: number) =>
    interpolate(frame, [delay, delay + 0.45 * fps], [0, 1], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: montserrat,
        color: "white",
        textAlign: "center",
        opacity: exit,
        ...style,
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: 10,
          padding: "10px 28px",
          backgroundColor: "#FFD23F",
          color: "#3A0A12",
          borderRadius: 12,
          opacity: enter(0),
          translate: `0px ${(1 - enter(0)) * -40}px`,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          marginTop: 22,
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 0.92,
          letterSpacing: -4,
          textTransform: "uppercase",
          WebkitTextStroke: "16px #3A0A12",
          paintOrder: "stroke fill",
          textShadow: "0 14px 40px rgba(0,0,0,0.6)",
          opacity: enter(4),
          scale: interpolate(enter(4), [0, 1], [1.4, 1]),
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 26,
          fontWeight: 800,
          fontSize: 58,
          padding: "12px 34px",
          backgroundColor: "#7A1426",
          borderRadius: 999,
          border: "5px solid #FFD23F",
          opacity: enter(10),
          translate: `0px ${(1 - enter(10)) * 40}px`,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

export const OpeningTitle = Interactive.create({
  Component: OpeningTitleInner,
  layout: "none",
  schema: {
    kicker: { type: "string", default: "ESTE SÁBADO", description: "Chamada" },
    title: { type: "string", default: "Caixa premiada", description: "Título" },
    subtitle: { type: "string", default: "🎁 em dobro!", description: "Subtítulo" },
  },
});
