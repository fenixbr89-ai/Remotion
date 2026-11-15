import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { clamp } from "./anim";

/**
 * Pincelada laranja atravessando a tela. Cobre tudo na metade da duração
 * (momento do corte) e sai pela direita revelando a próxima cena.
 */
export const PaintStroke: React.FC<{ color: string; duration: number }> = ({
  color,
  duration,
}) => {
  const frame = useCurrentFrame();
  const W = 2400;
  const x = interpolate(frame, [0, duration], [-W - 400, 1080 + 400], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const id = "paint-rough";
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <svg
        width={W + 400}
        height={2600}
        viewBox={`0 0 ${W + 400} 2600`}
        style={{
          position: "absolute",
          left: x,
          top: -340,
          transform: "skewX(-14deg)",
        }}
      >
        <defs>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves={3} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={90} />
          </filter>
        </defs>
        <g filter={`url(#${id})`}>
          <rect x={200} y={0} width={W} height={2600} fill={color} />
          {/* cerdas soltas na borda de trás e da frente */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect
              key={i}
              x={i % 2 === 0 ? 120 - i * 6 : W + 200 + i * 4}
              y={i * 320 + 40}
              width={70 + (i % 3) * 30}
              height={220}
              fill={color}
              opacity={0.85}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
