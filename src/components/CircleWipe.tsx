import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { clamp } from "./anim";

/**
 * Círculo expandindo do centro: cobre a tela até a metade da duração
 * e depois abre um "buraco" revelando a próxima cena.
 */
export const CircleWipe: React.FC<{ color: string; duration: number }> = ({
  color,
  duration,
}) => {
  const frame = useCurrentFrame();
  const half = duration / 2;
  const R = 1150;
  const ease = Easing.bezier(0.65, 0, 0.35, 1);
  const grow = interpolate(frame, [0, half], [0, R], { ...clamp, easing: ease });
  const hole = interpolate(frame, [half, duration], [0, R], { ...clamp, easing: ease });
  const mask =
    frame < half
      ? `radial-gradient(circle at 50% 50%, #000 ${grow}px, transparent ${grow + 1}px)`
      : `radial-gradient(circle at 50% 50%, transparent ${hole}px, #000 ${hole + 1}px)`;
  return (
    <AbsoluteFill
      style={{ background: color, maskImage: mask, WebkitMaskImage: mask }}
    />
  );
};
