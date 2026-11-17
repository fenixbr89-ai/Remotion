import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, ip } from "../anim";
import { C } from "../constants";

export type CursorKey = { f: number; x: number; y: number };

/**
 * Cursor: bolinha cinza translúcida com borda branca. Move-se entre os
 * keyframes com easing e, em cada clique, encolhe e solta uma onda azul.
 */
export const Cursor: React.FC<{
  keys: CursorKey[];
  clicks?: number[];
  hideAt?: number;
}> = ({ keys, clicks = [], hideAt }) => {
  const frame = useCurrentFrame();
  const first = keys[0].f;
  const fs = keys.map((k) => k.f);
  const opts = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  } as const;
  // interpolação segmento a segmento com easing em cada trecho
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= fs[i]) {
      x = interpolate(frame, [fs[i], fs[i + 1]], [keys[i].x, keys[i + 1].x], opts);
      y = interpolate(frame, [fs[i], fs[i + 1]], [keys[i].y, keys[i + 1].y], opts);
    }
  }

  const appear = ip(frame, [first, first + 8], [0, 1], easeOut);
  const vanish = hideAt !== undefined ? ip(frame, [hideAt, hideAt + 8], [0, 1]) : 0;
  const opacity = appear * (1 - vanish);
  if (opacity <= 0) return null;

  let press = 0;
  for (const c of clicks) {
    press = Math.max(press, ip(frame, [c - 3, c], [0, 1]) - ip(frame, [c + 1, c + 8], [0, 1]));
  }

  return (
    <>
      {clicks.map((c) => {
        const p = ip(frame, [c, c + 20], [0, 1], easeOut);
        if (frame < c || p >= 1) return null;
        const r = 20 + p * 70;
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `6px solid ${C.sky}`,
              boxSizing: "border-box",
              opacity: (1 - p) * 0.9 * opacity,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: x - 28,
          top: y - 28,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(138,148,166,.55)",
          border: "4px solid #FFFFFF",
          boxSizing: "border-box",
          boxShadow: "0 10px 26px rgba(11,31,77,.22)",
          scale: String(1 - press * 0.28 + (1 - appear) * 0.4),
          opacity,
        }}
      />
    </>
  );
};
