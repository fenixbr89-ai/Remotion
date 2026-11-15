import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { cores, fontes } from "../tema";

export const W = 1080;
export const H = 1920;

export const useEntrada = (atraso: number, config = { damping: 18, stiffness: 160, mass: 0.7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config });
};

export const progresso = (frame: number, inicio: number, fim: number) =>
  interpolate(frame, [inicio, fim], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

// Palavra que sobe de trás de uma máscara.
export const Palavra: React.FC<{
  atraso: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ atraso, children, style }) => {
  const p = useEntrada(atraso);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: 4 }}>
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${(1 - p) * 110}%)`,
          ...style,
        }}
      >
        {children}
      </span>
    </span>
  );
};

export const Rotulo: React.FC<{ children: React.ReactNode; cor?: string; style?: React.CSSProperties }> = ({
  children,
  cor = cores.cinza,
  style,
}) => (
  <div
    style={{
      fontFamily: fontes.mono,
      fontSize: 30,
      letterSpacing: 8,
      color: cor,
      ...style,
    }}
  >
    {children}
  </div>
);

// Grade de fundo que desliza devagar — o "padrão".
export const GradeFundo: React.FC = () => {
  const frame = useCurrentFrame();
  const passo = 90;
  const off = (frame * 0.4) % passo;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: Math.ceil(W / passo) + 2 }).map((_, i) => (
        <line key={`v${i}`} x1={i * passo - off} y1={0} x2={i * passo - off} y2={H} stroke="rgba(242,240,235,0.045)" />
      ))}
      {Array.from({ length: Math.ceil(H / passo) + 2 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * passo - off} x2={W} y2={i * passo - off} stroke="rgba(242,240,235,0.045)" />
      ))}
    </svg>
  );
};
