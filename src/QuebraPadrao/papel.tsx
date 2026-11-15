import React from "react";
import { random } from "remotion";
import { cores } from "./tema";

// Gera um polígono de papel rasgado (em %) com bordas irregulares.
export const poligonoRasgado = (
  semente: string,
  bordas: { topo?: boolean; direita?: boolean; base?: boolean; esquerda?: boolean },
  intensidade = 1.6,
) => {
  const pts: string[] = [];
  const passos = 26;
  const j = (i: number, lado: string) =>
    (random(`${semente}-${lado}-${i}`) - 0.5) * intensidade * 2;
  for (let i = 0; i <= passos; i++) {
    const x = (i / passos) * 100;
    pts.push(`${x}% ${bordas.topo ? Math.max(0, 1.5 + j(i, "t")) : 0}%`);
  }
  for (let i = 1; i <= passos; i++) {
    const y = (i / passos) * 100;
    pts.push(`${bordas.direita ? Math.min(100, 98.5 + j(i, "d")) : 100}% ${y}%`);
  }
  for (let i = passos - 1; i >= 0; i--) {
    const x = (i / passos) * 100;
    pts.push(`${x}% ${bordas.base ? Math.min(100, 98.5 + j(i, "b")) : 100}%`);
  }
  for (let i = passos - 1; i >= 1; i--) {
    const y = (i / passos) * 100;
    pts.push(`${bordas.esquerda ? Math.max(0, 1.5 + j(i, "e")) : 0}% ${y}%`);
  }
  return `polygon(${pts.join(", ")})`;
};

export const Granulado: React.FC<{ opacidade?: number; id: string }> = ({
  opacidade = 0.18,
  id,
}) => (
  <svg
    width="100%"
    height="100%"
    style={{ position: "absolute", inset: 0, opacity: opacidade, mixBlendMode: "overlay" }}
  >
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

export const Papel: React.FC<{
  semente: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  cor?: string;
  bordas?: { topo?: boolean; direita?: boolean; base?: boolean; esquerda?: boolean };
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  semente,
  x,
  y,
  w,
  h,
  rot = 0,
  cor = cores.papel,
  bordas = { topo: true, direita: true, base: true, esquerda: true },
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      transform: `rotate(${rot}deg)`,
      filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.55))",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: cor,
        clipPath: poligonoRasgado(semente, bordas),
        overflow: "hidden",
      }}
    >
      <Granulado id={`g-${semente}`} opacidade={0.35} />
      {children}
    </div>
  </div>
);
