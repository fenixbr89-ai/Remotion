import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../constants";

const ORBS = [
  { x: 180, y: 360, r: 520, c: "rgba(56,189,248,.20)" },
  { x: 900, y: 1150, r: 600, c: "rgba(29,78,216,.10)" },
];

/** Fundo claro e limpo: cor de base com 2 brilhos azuis bem suaves e parados (sem grade, sem movimento). */
export const Background: React.FC<{ color?: string }> = ({ color = C.bg }) => (
  <AbsoluteFill style={{ backgroundColor: color, overflow: "hidden" }}>
    {ORBS.map((o, i) => (
      <div key={i} style={{ position: "absolute", left: o.x - o.r / 2, top: o.y - o.r / 2, width: o.r, height: o.r, borderRadius: "50%", background: o.c, filter: "blur(90px)" }} />
    ))}
  </AbsoluteFill>
);
