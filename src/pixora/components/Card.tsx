import React from "react";
import { useCurrentFrame } from "remotion";
import { enterStyle } from "../anim";
import { C, CARD_W, CARD_X } from "../constants";

/** Card branco arredondado (44 px) com sombra suave e entrada desfoque -> nítido. */
export const Card: React.FC<{
  start: number;
  top: number;
  height?: number;
  width?: number;
  padding?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, top, height, width = CARD_W, padding = 52, children, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X + (CARD_W - width) / 2,
        top,
        width,
        height,
        padding,
        boxSizing: "border-box",
        background: C.white,
        borderRadius: 44,
        boxShadow: C.shadow,
        ...enterStyle(frame, start, { dy: 50, scaleFrom: 0.9 }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Título de card em caixa alta, espaçado. */
export const CardTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({
  children,
  icon,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      fontSize: 30,
      fontWeight: 800,
      letterSpacing: "4px",
      color: C.gray,
    }}
  >
    {icon}
    {children}
  </div>
);
