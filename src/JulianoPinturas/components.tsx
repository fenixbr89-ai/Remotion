import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { C, CLAMP, DISPLAY, EASE_IN, EASE_OUT, SANS, SNAP } from "./theme";

type Dir = "left" | "right" | "up" | "down" | "zoom" | "cut";

const vec = (d: Dir): [number, number] => {
  switch (d) {
    case "left":
      return [-1, 0];
    case "right":
      return [1, 0];
    case "up":
      return [0, -1];
    case "down":
      return [0, 1];
    default:
      return [0, 0];
  }
};

/**
 * A "shot": hard cut background + content that whip-pans / snap-zooms in and out
 * with controlled motion blur. `dur` must match the parent Sequence duration.
 */
export const Shot: React.FC<{
  dur: number;
  bg: string;
  enter?: Dir;
  exit?: Dir;
  children: React.ReactNode;
}> = ({ dur, bg, enter = "zoom", exit = "cut", children }) => {
  const frame = useCurrentFrame();
  const pIn = interpolate(frame, [0, 7], [0, 1], { ...CLAMP, easing: SNAP });
  const pOut = interpolate(frame, [dur - 5, dur], [0, 1], {
    ...CLAMP,
    easing: EASE_IN,
  });
  const [ix, iy] = vec(enter);
  const [ox, oy] = vec(exit);
  const tx = -ix * 700 * (1 - pIn) + ox * 700 * pOut;
  const ty = -iy * 900 * (1 - pIn) + oy * 900 * pOut;
  const zoomIn = enter === "zoom" ? 1.35 - 0.35 * pIn : 1;
  const zoomOut = exit === "zoom" ? 1 + 0.5 * pOut : 1;
  const blur =
    (enter === "cut" ? 0 : 26 * (1 - pIn)) + (exit === "cut" ? 0 : 26 * pOut);

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          translate: `${tx}px ${ty}px`,
          scale: String(zoomIn * zoomOut),
          filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Masked line reveal (text slides up from behind a mask). */
export const Reveal: React.FC<{
  delay?: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: "below" | "above";
}> = ({ delay = 0, dur = 9, children, style, from = "below" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        // clip only the bottom edge, so accents (Á, Ó, Ç) never get cut
        clipPath: "inset(-400px -200px 0 -200px)",
        paddingBottom: 14,
        marginBottom: -14,
        ...style,
      }}
    >
      <div
        style={{
          translate: `0 ${(from === "below" ? 105 : -105) * (1 - p)}%`,
          rotate: `${(from === "below" ? 6 : -6) * (1 - p)}deg`,
          transformOrigin: "left bottom",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Heuristic font fit for the condensed display face (Anton). */
export const fitSize = (text: string, maxWidth: number, max: number) => {
  const longest = Math.max(...text.split("\n").map((l) => l.length));
  return Math.min(max, Math.floor(maxWidth / (longest * 0.52)));
};

export const Display: React.FC<{
  children: React.ReactNode;
  size: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size, color = C.white, style }) => (
  <div
    style={{
      fontFamily: DISPLAY,
      fontSize: size,
      lineHeight: 0.95,
      color,
      textTransform: "uppercase",
      letterSpacing: "-0.005em",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
}> = ({ children, color = C.orange, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 8], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 40,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color,
        opacity: p,
      }}
    >
      <div
        style={{ width: 90 * p, height: 8, background: color, borderRadius: 4 }}
      />
      {children}
    </div>
  );
};

/**
 * Brush stroke with a rough, painted edge, drawn on over time.
 * Coordinates are in the 1080x1920 frame.
 */
export const PaintStroke: React.FC<{
  d: string;
  width: number;
  color?: string;
  start?: number;
  dur?: number;
  seed?: number;
}> = ({ d, width, color = C.orange, start = 0, dur = 10, seed = 3 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.bezier(0.3, 0.6, 0.2, 1),
  });
  const id = `rough-${seed}`;
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.6"
            numOctaves={2}
            seed={seed}
          />
          <feDisplacementMap in="SourceGraphic" scale={28} />
        </filter>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="butt"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        filter={`url(#${id})`}
      />
    </svg>
  );
};

/** 3D object: snaps in with a Y-spin, then floats with a slow 3D wobble. */
export const Object3D: React.FC<{
  src: string;
  width: number;
  x?: number;
  y?: number;
  delay?: number;
  spin?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({ src, width, x = 540, y = 960, delay = 0, spin = 70, shadow = true, style }) => {
  const frame = useCurrentFrame();
  const f = frame - delay;
  const p = interpolate(f, [0, 12], [0, 1], {
    ...CLAMP,
    easing: Easing.spring({ damping: 12, stiffness: 160 }),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y,
        width,
        translate: `0 -50%`,
        perspective: 1400,
        opacity: interpolate(f, [0, 3], [0, 1], CLAMP),
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          scale: String(0.35 + 0.65 * p),
          rotate: `y ${spin * (1 - p) + Math.sin(f / 18) * 8}deg`,
          translate: `0 ${Math.sin(f / 14) * 10}px`,
          filter: shadow
            ? "drop-shadow(0 40px 50px rgba(0,0,0,0.45))"
            : undefined,
        }}
      />
    </div>
  );
};

export const Flash: React.FC<{ at?: number; color?: string; len?: number }> = ({
  at = 0,
  color = "#fff",
  len = 5,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + len], [0, 0.9, 0], CLAMP);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o }} />;
};

/** Soft vignette + orange bloom for the dark shots. */
export const Atmosphere: React.FC<{ glow?: string; y?: number }> = ({
  glow = "rgba(255,107,0,0.22)",
  y = 50,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% ${y}%, ${glow} 0%, rgba(0,0,0,0) 55%), radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)`,
    }}
  />
);

/** Sound effect placed at a local frame. */
export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({
  at,
  src,
  volume = 0.6,
}) => (
  <Sequence from={at} layout="none" name={`SFX ${src}`}>
    <Audio src={staticFile(`audio/${src}`)} volume={volume} />
  </Sequence>
);

/** Tiny animated counter-label in the corner, like an index in a campaign. */
export const Index: React.FC<{ n: string; color?: string }> = ({
  n,
  color = C.grey,
}) => (
  <div
    style={{
      position: "absolute",
      top: 120,
      right: 90,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: "0.2em",
      color,
    }}
  >
    {n}
  </div>
);
