import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, EASE_IN_OUT, fontFamily } from "./theme";

// Small moving watermark: top-left -> top-right -> bottom-left -> center.
// Positions are [left %, top %, translateX %, translateY %].
const SPOTS: [number, number, number, number][] = [
  [5, 4, 0, 0],
  [95, 4, -100, 0],
  [5, 96, 0, -100],
  [50, 56, -50, -50],
];
const GLIDE = 30; // frames to move between spots

export const Watermark: React.FC<{ text?: string }> = ({ text = "Kayke.hs" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const seg = durationInFrames / SPOTS.length;
  // keyframes: hold each spot, glide at the end of each segment
  const inF: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i < SPOTS.length; i++) {
    if (i > 0) {
      inF.push(i * seg);
      idx.push(i);
    } else {
      inF.push(0);
      idx.push(0);
    }
    if (i < SPOTS.length - 1) {
      inF.push((i + 1) * seg - GLIDE);
      idx.push(i);
    }
  }
  const pos = (k: 0 | 1 | 2 | 3) =>
    interpolate(
      frame,
      inF,
      idx.map((i) => SPOTS[i][k]),
      { ...clamp, easing: EASE_IN_OUT },
    );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: `${pos(0)}%`,
          top: `${pos(1)}%`,
          translate: `${pos(2)}% ${pos(3)}%`,
          fontFamily,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.85)",
          background: "rgba(20,16,36,0.28)",
          padding: "6px 16px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
