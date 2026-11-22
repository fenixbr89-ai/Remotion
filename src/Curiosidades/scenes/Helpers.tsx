import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { easeBack, prog } from "../anim";

/** Illustration entrance: fades and rises into place. */
export const Rise: React.FC<{ delay?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 6,
  y = 80,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 26);
  return <div style={{ opacity: p, translate: `0px ${(1 - p) * y}px`, ...style }}>{children}</div>;
};

/** Pop with gentle overshoot. */
export const Pop: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 6, children, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 22, easeBack);
  return (
    <div style={{ opacity: prog(f, delay, 10), scale: interpolate(p, [0, 1], [0.4, 1]), ...style }}>{children}</div>
  );
};

/** Expanding rings that loop, like a stimulus spreading in the bone. */
export const AnimPulses: React.FC<{ x: number; y: number; rx: number; ry: number; start?: number; period?: number }> = ({
  x,
  y,
  rx,
  ry,
  start = 30,
  period = 54,
}) => {
  const f = useCurrentFrame();
  const on = prog(f, start, 15);
  return (
    <g opacity={on}>
      {[0, 1, 2].map((k) => {
        const ph = ((Math.max(0, f - start) / period + k / 3) % 1 + 1) % 1;
        return (
          <ellipse
            key={k}
            cx={x}
            cy={y}
            rx={rx + ph * 110}
            ry={ry + ph * 130}
            fill="none"
            stroke={C.accent}
            strokeWidth={7 - ph * 4}
            opacity={1 - ph}
          />
        );
      })}
    </g>
  );
};

/** Chewing motion for force arrows: returns a y offset (0 = biting). */
export const usePress = (start = 40, period = 36) => {
  const f = useCurrentFrame();
  if (f < start) return { off: -40, on: prog(f, start - 12, 12) };
  const ph = ((f - start) % period) / period;
  const press = ph < 0.35 ? ph / 0.35 : 1 - (ph - 0.35) / 0.65;
  return { off: -40 * (1 - press), on: 1 };
};

/** SVG arrow that draws itself. */
export const DrawArrow: React.FC<{ d: string; head: string; p: number; width?: number }> = ({ d, head, p, width = 12 }) => (
  <g fill="none" stroke={C.accent} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0 ? 1 : 0}>
    <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    <path d={head} opacity={prog(p * 100, 85, 15)} />
  </g>
);
