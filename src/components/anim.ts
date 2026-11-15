import { interpolate, spring } from "remotion";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Padrão de entrada: blur 12→0, opacity 0→1, translateY 30→0, spring damping 14 */
export const enter = (frame: number, fps: number, delay = 0) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  const lin = interpolate(frame - delay, [0, 10], [0, 1], clamp);
  return {
    progress: s,
    style: {
      opacity: lin,
      filter: `blur(${Math.max(0, 12 * (1 - s))}px)`,
      translate: `0px ${30 * (1 - s)}px`,
    } as React.CSSProperties,
  };
};

/** Padrão de saída nos últimos 8 frames + drift contínuo */
export const exitAndDrift = (frame: number, duration: number) => {
  const exitP = interpolate(frame, [duration - 8, duration], [0, 1], clamp);
  const drift = interpolate(frame, [0, duration], [1, 1.04], clamp);
  return {
    opacity: 1 - exitP,
    filter: exitP > 0 ? `blur(${10 * exitP}px)` : undefined,
    scale: `${drift * (1 + 0.08 * exitP)}`,
  } as React.CSSProperties;
};

export { clamp };
