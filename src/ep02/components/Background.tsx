import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../constants";

const ORBS = [
  { x: 180, y: 360, r: 520, c: "rgba(56,189,248,.30)", sx: 0.011, sy: 0.008, ax: 60, ay: 40 },
  { x: 900, y: 1150, r: 600, c: "rgba(29,78,216,.18)", sx: 0.009, sy: 0.012, ax: 70, ay: 50 },
  { x: 760, y: 220, r: 380, c: "rgba(56,189,248,.20)", sx: 0.013, sy: 0.007, ax: 40, ay: 60 },
];

/** Fundo claro com grade de 60 px e orbs azuis desfocados flutuando devagar. */
export const Background: React.FC<{ color?: string }> = ({ color = C.bg }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: color, overflow: "hidden" }}>
      {ORBS.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x - o.r / 2 + Math.sin(frame * o.sx + i) * o.ax,
            top: o.y - o.r / 2 + Math.cos(frame * o.sy + i * 2) * o.ay,
            width: o.r,
            height: o.r,
            borderRadius: "50%",
            background: o.c,
            filter: "blur(90px)",
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: "0px 0px",
        }}
      />
    </AbsoluteFill>
  );
};
