import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { C, CLAMP, EASE, FONT, ORANGE_GRADIENT } from "./theme";

/** iOS-like spring (0→1, slight overshoot). */
export const useSpring = (delay = 0, damping = 14, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness, mass: 0.8 },
  });
};

export const useEase = (delay: number, dur: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
};

/** Shot with a soft blur-dissolve on its last frames. */
export const Shot: React.FC<{
  dur: number;
  bg: string;
  out?: boolean;
  children: React.ReactNode;
}> = ({ dur, bg, out = true, children }) => {
  const frame = useCurrentFrame();
  const o = out ? interpolate(frame, [dur - 6, dur], [0, 1], CLAMP) : 0;
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          opacity: 1 - o,
          filter: o > 0.01 ? `blur(${o * 16}px)` : undefined,
          scale: String(1 - 0.04 * o),
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Apple-style text: fade + blur + small rise. */
export const T: React.FC<{
  children: React.ReactNode;
  size: number;
  weight?: number;
  color?: string;
  gradient?: boolean;
  delay?: number;
  dur?: number;
  align?: "center" | "left";
  style?: React.CSSProperties;
}> = ({
  children,
  size,
  weight = 700,
  color = C.text,
  gradient,
  delay = 0,
  dur = 14,
  align = "center",
  style,
}) => {
  const p = useEase(delay, dur);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        letterSpacing:
          size >= 80 ? "-0.04em" : size >= 44 ? "-0.02em" : "-0.01em",
        lineHeight: 1.08,
        textAlign: align,
        color,
        opacity: p,
        translate: `0 ${(1 - p) * size * 0.3}px`,
        filter: p < 0.99 ? `blur(${(1 - p) * 12}px)` : undefined,
        whiteSpace: "pre-line",
        ...(gradient
          ? {
              backgroundImage: ORANGE_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Frosted glass surface (notifications, widgets, sheets). */
export const Glass: React.FC<{
  children: React.ReactNode;
  radius?: number;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ children, radius = 44, dark = false, style }) => (
  <div
    style={{
      borderRadius: radius,
      background: dark ? "rgba(40,40,40,0.62)" : "rgba(255,255,255,0.72)",
      backdropFilter: "blur(40px) saturate(1.6)",
      boxShadow:
        "0 30px 60px rgba(0,0,0,0.12), inset 0 0 0 1.5px rgba(255,255,255,0.5)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Soft colored wallpaper, like an iOS background. */
export const Wallpaper: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const frame = useCurrentFrame();
  const d = frame * 0.6;
  return (
    <AbsoluteFill style={{ background: dark ? "#0B0B0C" : "#F2EEEA" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -300 + d,
          top: -200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,140,40,0.75), rgba(255,140,40,0) 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          right: -400 + d * 0.5,
          bottom: -300,
          borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(255,90,0,0.45), rgba(255,90,0,0) 65%)"
            : "radial-gradient(circle, rgba(255,214,180,0.9), rgba(255,214,180,0) 65%)",
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Product hero: object turns slowly with a floor reflection,
 * like an Apple product page.
 */
export const Product: React.FC<{
  src: string;
  width: number;
  y: number;
  delay?: number;
  dark?: boolean;
}> = ({ src, width, y, delay = 0, dark = false }) => {
  const frame = useCurrentFrame();
  const f = frame - delay;
  const p = useEase(delay, 24);
  const turn = -18 * (1 - p) + f * 0.18;
  const img = (
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        display: "block",
        rotate: `y ${turn}deg`,
      }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - width / 2,
        top: y,
        width,
        translate: `0 calc(-50% + ${(1 - p) * 80}px)`,
        scale: String(
          (0.9 + 0.1 * p) * interpolate(f, [0, 90], [1, 1.05], CLAMP),
        ),
        opacity: p,
        perspective: 1800,
      }}
    >
      {/* light pool */}
      <div
        style={{
          position: "absolute",
          inset: "-30% -20%",
          background: dark
            ? "radial-gradient(ellipse at center, rgba(255,120,30,0.22), rgba(0,0,0,0) 60%)"
            : "radial-gradient(ellipse at center, rgba(255,255,255,1), rgba(255,255,255,0) 60%)",
        }}
      />
      <div style={{ position: "relative" }}>{img}</div>
      {/* reflection */}
      <div
        style={{
          position: "relative",
          scale: "1 -1",
          marginTop: -8,
          opacity: dark ? 0.22 : 0.14,
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 45%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 45%)",
          filter: "blur(2px)",
          height: 0,
          overflow: "visible",
        }}
      >
        <div style={{ translate: "0 -100%" }}>{img}</div>
      </div>
    </div>
  );
};

/** Small rounded "spec" chip under product headlines. */
export const Chip: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  delay?: number;
}> = ({ children, dark = false, delay = 0 }) => {
  const s = useSpring(delay, 16, 200);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 38,
        letterSpacing: "-0.01em",
        color: dark ? C.white : C.text,
        background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.05)",
        border: `1.5px solid ${dark ? "rgba(255,255,255,0.18)" : C.hair}`,
        borderRadius: 999,
        padding: "14px 32px",
        scale: String(s),
        opacity: Math.min(1, s),
      }}
    >
      {children}
    </div>
  );
};

/** iOS squircle app icon. */
export const AppIcon: React.FC<{
  size: number;
  bg: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ size, bg, children, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.225,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({
  at,
  src,
  volume = 0.35,
}) => (
  <Sequence from={at} layout="none" name={`SFX ${src}`}>
    <Audio src={staticFile(`audio/${src}`)} volume={volume} />
  </Sequence>
);
