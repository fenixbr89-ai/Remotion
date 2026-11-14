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
import { BACK, C, CLAMP, EASE, FONT } from "./theme";

/** 0→1 progress between `delay` and `delay + dur`. */
export const useP = (delay: number, dur: number, easing = EASE) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], { ...CLAMP, easing });
};

type Exit = "blur" | "left" | "up" | "none";

/**
 * One shot: background + centered content. The last frames blur out,
 * which gives the quick "dissolve by blur" cuts of the reference.
 */
export const Shot: React.FC<{
  dur: number;
  bg?: string;
  exit?: Exit;
  children: React.ReactNode;
}> = ({ dur, bg = C.bg, exit = "blur", children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [dur - 6, dur], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const out = exit === "none" ? 0 : o;
  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          opacity: 1 - out,
          filter: out > 0.01 ? `blur(${out * 22}px)` : undefined,
          scale: exit === "blur" ? String(1 - 0.08 * out) : "1",
          translate:
            exit === "left"
              ? `${-240 * out}px 0`
              : exit === "up"
                ? `0 ${-200 * out}px`
                : "0 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Mode = "blur" | "up" | "left" | "right" | "zoom" | "none";

/** Kinetic word / phrase. */
export const Word: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  delay?: number;
  dur?: number;
  mode?: Mode;
  style?: React.CSSProperties;
}> = ({
  children,
  size = 96,
  weight = 700,
  color = C.ink,
  delay = 0,
  dur = 10,
  mode = "blur",
  style,
}) => {
  const p = useP(delay, dur);
  const frame = useCurrentFrame();
  const m = 1 - p;
  const tr =
    mode === "up"
      ? `0 ${m * size * 0.8}px`
      : mode === "left"
        ? `${-m * 300}px 0`
        : mode === "right"
          ? `${m * 300}px 0`
          : "0 0";
  const sc = mode === "blur" ? 1 + 0.5 * m : mode === "zoom" ? 3 - 2 * p : 1;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.08,
        letterSpacing: "-0.02em",
        textAlign: "center",
        whiteSpace: "pre-line",
        opacity: mode === "none" ? (frame >= delay ? 1 : 0) : p,
        translate: tr,
        scale: String(sc),
        filter: m > 0.01 && mode !== "none" ? `blur(${m * 18}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Typewriter: reveals letters one by one, with a blinking underscore. */
export const Typewriter: React.FC<{
  text: string;
  size?: number;
  delay?: number;
  speed?: number;
  color?: string;
}> = ({ text, size = 90, delay = 0, speed = 1.2, color = C.ink }) => {
  const frame = useCurrentFrame();
  const n = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - delay) / speed)),
  );
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        color,
        letterSpacing: "-0.02em",
      }}
    >
      {text.slice(0, n)}
      <span style={{ opacity: blink ? 1 : 0, color: C.grey }}>_</span>
    </div>
  );
};

/** Tilted pill tag that springs in. */
export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  delay?: number;
  tilt?: number;
  outline?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  bg = C.grey,
  color = C.white,
  size = 80,
  delay = 0,
  tilt = -7,
  outline = false,
  style,
}) => {
  const p = useP(delay, 12, BACK);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        color: outline ? C.ink : color,
        background: outline ? C.white : bg,
        border: outline ? `6px solid ${C.ink}` : "none",
        borderRadius: 999,
        padding: `${size * 0.12}px ${size * 0.45}px`,
        rotate: `${tilt * p + (1 - p) * -25}deg`,
        scale: String(p),
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        boxShadow: outline ? "none" : "0 18px 40px rgba(0,0,0,0.12)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Pointer hand that glides to its spot and "clicks". */
export const Hand: React.FC<{
  x: number;
  y: number;
  delay?: number;
  click?: number;
}> = ({ x, y, delay = 0, click = 10 }) => {
  const frame = useCurrentFrame();
  const p = useP(delay, 10);
  const press = interpolate(
    frame,
    [delay + click, delay + click + 3, delay + click + 7],
    [1, 0.8, 1],
    CLAMP,
  );
  return (
    <svg
      width={170}
      height={190}
      viewBox="0 0 170 190"
      style={{
        position: "absolute",
        left: x + (1 - p) * 220,
        top: y + (1 - p) * 220,
        opacity: p,
        scale: String(press),
        rotate: "-18deg",
      }}
    >
      <path
        d="M58 100 V22 a16 16 0 0 1 32 0 V82 l6 -4 a15 15 0 0 1 22 6 l2 4 a15 15 0 0 1 22 8 l1 4 a14 14 0 0 1 20 10 V140 c0 28 -22 44 -50 44 h-14 c-20 0 -34 -10 -46 -26 L22 122 a15 15 0 0 1 24 -18 Z"
        fill={C.white}
        stroke={C.ink}
        strokeWidth={9}
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** Expanding concentric rings (radar), centered on the frame. */
export const Rings: React.FC<{
  color?: string;
  count?: number;
  start?: number;
  speed?: number;
}> = ({
  color = "rgba(255,255,255,0.8)",
  count = 3,
  start = 0,
  speed = 40,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const t = ((frame - start + i * (speed / count)) % speed) / speed;
        if (frame < start) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 400 + t * 900,
              height: 400 + t * 900,
              borderRadius: "50%",
              border: `5px solid ${color}`,
              opacity: 1 - t,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Hand-drawn underline scribble, drawn on. */
export const Scribble: React.FC<{
  width: number;
  delay?: number;
  color?: string;
}> = ({ width, delay = 0, color = C.orange }) => {
  const p = useP(delay, 12);
  return (
    <svg
      width={width}
      height={70}
      viewBox="0 0 600 70"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      <path
        d="M10 30 C 150 10, 330 12, 590 22 C 420 30, 200 40, 60 58"
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

/** Circular arc that draws around a word and keeps turning. */
export const Arc: React.FC<{
  size: number;
  delay?: number;
  color?: string;
  width?: number;
}> = ({ size, delay = 0, color = C.ink, width = 16 }) => {
  const frame = useCurrentFrame();
  const p = useP(delay, 16);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        position: "absolute",
        rotate: `${-90 + (frame - delay) * 2.4}deg`,
        overflow: "visible",
      }}
    >
      <circle
        cx={100}
        cy={100}
        r={92}
        fill="none"
        stroke={color}
        strokeWidth={width / (size / 200)}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={`${0.72 * p} 1`}
      />
      <circle
        cx={100}
        cy={100}
        r={80}
        fill="none"
        stroke={color}
        strokeWidth={(width * 0.4) / (size / 200)}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={`${0.35 * p} 1`}
        strokeDashoffset={0.5}
      />
    </svg>
  );
};

/** iOS-style toggle that switches on at `on`. */
export const Toggle: React.FC<{ on: number; scale?: number }> = ({
  on,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [on, on + 6], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  return (
    <div
      style={{
        width: 130 * scale,
        height: 72 * scale,
        borderRadius: 999,
        background: t > 0.5 ? C.orange : C.light,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 6 * scale,
          left: (6 + 58 * t) * scale,
          width: 60 * scale,
          height: 60 * scale,
          borderRadius: "50%",
          background: C.white,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
};

/** 3D image popping in like an emoji sticker. */
export const Sticker: React.FC<{
  src: string;
  width: number;
  x?: number;
  y?: number;
  delay?: number;
  tilt?: number;
  style?: React.CSSProperties;
}> = ({ src, width, x, y, delay = 0, tilt = 12, style }) => {
  const frame = useCurrentFrame();
  const p = useP(delay, 12, BACK);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: x === undefined ? "relative" : "absolute",
        left: x,
        top: y,
        width,
        scale: String(p),
        rotate: `${tilt * (1 - p) + Math.sin((frame - delay) / 9) * 3}deg`,
        filter: "drop-shadow(0 20px 26px rgba(0,0,0,0.18))",
        ...style,
      }}
    />
  );
};

export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({
  at,
  src,
  volume = 0.4,
}) => (
  <Sequence from={at} layout="none" name={`SFX ${src}`}>
    <Audio src={staticFile(`audio/${src}`)} volume={volume} />
  </Sequence>
);
