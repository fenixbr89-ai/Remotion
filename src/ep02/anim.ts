import type { CSSProperties } from "react";
import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./constants";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** interpolate com clamp dos dois lados */
export const ip = (
  frame: number,
  input: number[],
  output: number[],
  easing?: (t: number) => number,
) => interpolate(frame, input, output, { ...CL, easing });

/** spring com leve overshoot controlado */
export const pop = (frame: number, start: number, damping = 13) =>
  spring({
    frame: frame - start,
    fps: FPS,
    config: { damping, mass: 0.8, stiffness: 140 },
  });

/**
 * Entrada padrão da série: desfocado -> nítido, subindo, com overshoot.
 * Retorna estilo pronto para aplicar.
 */
export const enterStyle = (
  frame: number,
  start: number,
  opts: { dy?: number; blur?: number; scaleFrom?: number; damping?: number } = {},
): CSSProperties => {
  const { dy = 30, blur = 14, scaleFrom = 0.94, damping = 13 } = opts;
  const sp = pop(frame, start, damping);
  const p = ip(frame, [start, start + 12], [0, 1], easeOut);
  return {
    opacity: p,
    filter: p >= 1 ? undefined : `blur(${(1 - p) * blur}px)`,
    translate: `0px ${(1 - sp) * dy}px`,
    scale: String(scaleFrom + (1 - scaleFrom) * sp),
  };
};

/** "Punch" de zoom curto: soma ao scale da câmera */
export const punch = (frame: number, at: number, amount = 0.045) =>
  ip(frame, [at, at + 4], [0, amount], easeOut) -
  ip(frame, [at + 4, at + 18], [0, amount], easeInOut);

/** pseudo-aleatório determinístico */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
