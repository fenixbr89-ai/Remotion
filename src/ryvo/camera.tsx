import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "./ThemeContext";

export type Cam = { x?: number; y?: number; s?: number; rx?: number; ry?: number; rz?: number };
export type Dir = "up" | "down" | "left" | "right" | "zoom" | "none";

const VEC: Record<string, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

/** Frames used by a whip transition on each side of a cut. */
export const WHIP = 7;

const lerp = (a = 0, b = 0, t: number) => a + (b - a) * t;

/** Keyframes in seconds → value at current frame (eased between keys). */
export const useKf = (keys: [number, number][], easing = Easing.bezier(0.45, 0, 0.2, 1)) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(
    frame,
    keys.map((k) => k[0] * fps),
    keys.map((k) => k[1]),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
  );
};

/**
 * One camera shot. The camera drifts from cam[0] to cam[1] over the whole shot
 * (push-in, orbit, tilt), and the shot whips in/out with directional motion blur.
 */
export const Shot: React.FC<{
  id: string;
  dur: number;
  cam?: [Cam, Cam];
  inDir?: Dir;
  outDir?: Dir;
  children: React.ReactNode;
}> = ({ id, dur, cam = [{}, {}], inDir = "none", outDir = "none", children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.1, 0.3, 1),
  });
  const [a, b] = cam;
  const c = {
    x: lerp(a.x, b.x, p),
    y: lerp(a.y, b.y, p),
    s: lerp(a.s ?? 1, b.s ?? 1, p),
    rx: lerp(a.rx, b.rx, p),
    ry: lerp(a.ry, b.ry, p),
    rz: lerp(a.rz, b.rz, p),
  };

  let ox = 0;
  let oy = 0;
  let sc = 1;
  let bx = 0;
  let by = 0;
  let iso = 0;
  let op = 1;

  if (inDir !== "none" && frame < WHIP) {
    const k = 1 - frame / WHIP;
    const e = k * k;
    if (inDir === "zoom") {
      sc *= 1 + e * 1.6;
      iso = k * 36;
      op = 1 - e * 0.6;
    } else {
      const v = VEC[inDir];
      ox = -v[0] * 1400 * e;
      oy = -v[1] * 2000 * e;
      bx = Math.abs(v[0]) * 110 * k;
      by = Math.abs(v[1]) * 110 * k;
    }
  }
  if (outDir !== "none" && frame > dur - WHIP) {
    const k = (frame - (dur - WHIP)) / WHIP;
    const e = k * k;
    if (outDir === "zoom") {
      sc *= 1 + e * 2.4;
      iso = Math.max(iso, k * 36);
      op = 1 - e * 0.7;
    } else {
      const v = VEC[outDir];
      ox = v[0] * 1400 * e;
      oy = v[1] * 2000 * e;
      bx = Math.max(bx, Math.abs(v[0]) * 110 * k);
      by = Math.max(by, Math.abs(v[1]) * 110 * k);
    }
  }

  const fid = `mb-${id}`;
  const useDir = bx > 0.5 || by > 0.5;
  const filter = useDir ? `url(#${fid})` : iso > 0.5 ? `blur(${iso}px)` : undefined;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {useDir ? (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <defs>
            <filter id={fid} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={`${bx.toFixed(1)} ${by.toFixed(1)}`} />
            </filter>
          </defs>
        </svg>
      ) : null}
      <AbsoluteFill
        style={{
          transform: `translate(${ox}px, ${oy}px) scale(${sc})`,
          filter,
          opacity: op,
        }}
      >
        <AbsoluteFill
          style={{
            transform: `perspective(2200px) translate3d(${c.x}px, ${c.y}px, 0) scale(${c.s}) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotateZ(${c.rz}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Kinetic typography synced to the narration: words appear one by one with blur + scale.
 * Wrap a keyword in *asterisks* to highlight it.
 */
export const Kinetic: React.FC<{
  text: string;
  start?: number;
  wps?: number;
  size?: number;
  width?: number;
  nowrap?: boolean;
  align?: "center" | "left";
  style?: React.CSSProperties;
}> = ({ text, start = 0.12, wps = 3.3, size = 84, width = 940, nowrap, align = "center", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = useTheme();
  const words = text.split(" ");
  return (
    <div
      style={{
        width: nowrap ? undefined : width,
        whiteSpace: nowrap ? "nowrap" : undefined,
        display: "flex",
        flexWrap: nowrap ? "nowrap" : "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        rowGap: size * 0.04,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.035em",
        ...style,
      }}
    >
      {words.map((w, i) => {
        const hl = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        const t0 = (start + i / wps) * fps;
        const k = interpolate(frame, [t0, t0 + 0.32 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: k,
              filter: k < 1 ? `blur(${(1 - k) * 14}px)` : undefined,
              transform: `translateY(${(1 - k) * 26}px) scale(${1.25 - 0.25 * k})`,
              fontWeight: hl ? 800 : 500,
              color: hl ? T.accentText : T.text,
            }}
          >
            {clean}
          </span>
        );
      })}
    </div>
  );
};

/** Large out-of-focus element passing in front of the camera (depth of field / parallax). */
export const Foreground: React.FC<{
  from: [number, number];
  to: [number, number];
  size: number;
  dur: number;
  blur?: number;
  children: React.ReactNode;
}> = ({ from, to, size, dur, blur = 16, children }) => {
  const frame = useCurrentFrame();
  const p = frame / dur;
  return (
    <div
      style={{
        position: "absolute",
        left: lerp(from[0], to[0], p) - size / 2,
        top: lerp(from[1], to[1], p) - size / 2,
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
        opacity: 0.9,
        zIndex: 50,
      }}
    >
      {children}
    </div>
  );
};
