import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

const BLOBS = [
  { x: 180, y: 380, size: 620, sx: 0.013, sy: 0.009, ax: 120, ay: 90 },
  { x: 860, y: 1050, size: 700, sx: 0.01, sy: 0.012, ax: 140, ay: 120 },
  { x: 420, y: 1620, size: 560, sx: 0.015, sy: 0.008, ax: 100, ay: 80 },
];

/** 3 bolhas laranja desfocadas se movendo devagar */
export const BlurBlobs: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const f = useCurrentFrame() + offset;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {BLOBS.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: COLORS.orange,
            opacity: 0.12,
            filter: "blur(80px)",
            left: b.x - b.size / 2 + Math.sin(f * b.sx + i) * b.ax,
            top: b.y - b.size / 2 + Math.cos(f * b.sy + i * 2) * b.ay,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
