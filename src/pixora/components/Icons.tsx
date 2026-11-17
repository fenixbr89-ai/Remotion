import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { enterStyle } from "../anim";
import { C } from "../constants";

/** Ícone de linha (Lucide) pintado com o degradê da marca via mask. */
export const LineIcon: React.FC<{
  name: string;
  size: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name, size, color = C.gradientDiag, style }) => {
  const url = `url(${staticFile(`icons/${name}.svg`)})`;
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        flexShrink: 0,
        ...style,
      }}
    />
  );
};

/** Imagem 3D (Fluent Emoji). */
export const Icon3D: React.FC<{ src: string; size: number; style?: React.CSSProperties }> = ({
  src,
  size,
  style,
}) => (
  <Img
    src={staticFile(src)}
    style={{ width: size, height: size, objectFit: "contain", flexShrink: 0, ...style }}
  />
);

/** Logo do Preço Certo: etiqueta de preço em degradê azul (escuro -> claro). */
export const Logo: React.FC<{ size: number; white?: boolean }> = ({ size, white }) => {
  const id = white ? "lgw" : "lg";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={white ? "#FFFFFF" : C.blue} />
          <stop offset="100%" stopColor={white ? "#DCEBFF" : C.sky} />
        </linearGradient>
      </defs>
      <path
        d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
        fill={`url(#${id})`}
      />
      <circle cx="7.5" cy="7.5" r="1.7" fill={white ? C.blue : "#FFFFFF"} />
    </svg>
  );
};

/** Badge branco redondo com sombra e entrada em spring. */
export const IconBadge: React.FC<{
  x: number;
  y: number;
  size?: number;
  start: number;
  seed?: number;
  children: React.ReactNode;
}> = ({ x, y, size = 150, start, seed = 0, children }) => {
  const frame = useCurrentFrame();
  // sem flutuação: o badge entra e fica parado
  const floatY = 0 * seed;
  const floatX = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2 + floatX,
        top: y - size / 2 + floatY,
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.white,
        boxShadow: C.shadowSm,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...enterStyle(frame, start, { dy: 40, scaleFrom: 0.4, damping: 11 }),
      }}
    >
      {children}
    </div>
  );
};
