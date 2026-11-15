import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { clamp } from "./anim";
import { COLORS } from "../theme";

/** Sublinhado "feito à mão" desenhado com strokeDashoffset */
export const HandUnderline: React.FC<{
  delay?: number;
  duration?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ delay = 0, duration = 18, color = COLORS.orange, strokeWidth = 16 }) => {
  const frame = useCurrentFrame();
  const L = 1000;
  const p = interpolate(frame - delay, [0, duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });
  return (
    <svg
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        left: "-6%",
        width: "112%",
        bottom: "-18%",
        height: "34%",
        overflow: "visible",
      }}
    >
      <path
        d="M6 38 C 70 18, 150 30, 210 26 S 330 14, 394 22 M40 50 C 120 40, 240 44, 360 36"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={L}
        strokeDasharray={L}
        strokeDashoffset={L * (1 - p)}
      />
    </svg>
  );
};
