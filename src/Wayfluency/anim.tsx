import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import { F, FPS } from "./theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const springAt = (
  frame: number,
  sec: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) =>
  spring({
    frame: frame - F(sec),
    fps: FPS,
    config: { damping: 14, stiffness: 140, mass: 0.7, ...config },
  });

/** Ramp 0→1 between two times (seconds), eased. */
export const ramp = (
  frame: number,
  fromSec: number,
  toSec: number,
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) => interpolate(frame, [F(fromSec), F(toSec)], [0, 1], { ...clamp, easing });

/** Decaying camera shake, starting at `sec`. */
export const shake = (frame: number, sec: number, amp = 14, durFrames = 10) => {
  const t = frame - F(sec);
  if (t < 0 || t > durFrames) return { x: 0, y: 0 };
  const k = 1 - t / durFrames;
  return {
    x: Math.sin(t * 2.7) * amp * k,
    y: Math.cos(t * 3.3) * amp * 0.7 * k,
  };
};

type PopProps = {
  at: number;
  from?: "up" | "down" | "left" | "right" | "zoom" | "punch";
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  inline?: boolean;
};

/** Element that enters at a given second (synced to the narration). */
export const Pop: React.FC<PopProps> = ({
  at,
  from = "up",
  dist = 60,
  style,
  children,
  inline,
}) => {
  const frame = useCurrentFrame();
  const s = springAt(frame, at);
  const o = interpolate(frame, [F(at), F(at) + 6], [0, 1], clamp);
  const blur = interpolate(s, [0, 1], [14, 0], clamp);
  let tr = "";
  if (from === "up") tr = `translateY(${(1 - s) * dist}px)`;
  if (from === "down") tr = `translateY(${-(1 - s) * dist}px)`;
  if (from === "left") tr = `translateX(${-(1 - s) * dist * 3}px)`;
  if (from === "right") tr = `translateX(${(1 - s) * dist * 3}px)`;
  if (from === "zoom") tr = `scale(${interpolate(s, [0, 1], [0.6, 1])})`;
  if (from === "punch") tr = `scale(${interpolate(s, [0, 1], [1.7, 1])})`;
  return (
    <div
      style={{
        display: inline ? "inline-block" : "block",
        opacity: o,
        transform: tr,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Words that appear one by one at given times. */
export const Words: React.FC<{
  items: { t: string; at: number; style?: React.CSSProperties }[];
  gap?: number;
}> = ({ items, gap = 16 }) => (
  <span style={{ display: "inline-flex", flexWrap: "wrap", gap, justifyContent: "center", alignItems: "baseline" }}>
    {items.map((w, i) => (
      <Pop key={i} at={w.at} dist={30} inline style={w.style}>
        {w.t}
      </Pop>
    ))}
  </span>
);
