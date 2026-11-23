import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, clamp, EASE_OUT, fontFamily, GRADIENT } from "./theme";

/* ---------- Background ---------- */

export const Bg: React.FC<{ variant: "dark" | "light" }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const dark = variant === "dark";
  const drift = Math.sin(frame / 40) * 60;
  return (
    <AbsoluteFill
      style={{ backgroundColor: dark ? C.dark : C.light, overflow: "hidden" }}
    >
      <AbsoluteFill
        style={{
          background: dark
            ? `radial-gradient(900px 900px at ${50 + drift / 20}% 28%, rgba(132,104,249,0.45), transparent 70%),
               radial-gradient(800px 700px at 20% 95%, rgba(90,59,232,0.35), transparent 70%)`
            : `radial-gradient(900px 800px at ${60 + drift / 20}% 20%, rgba(200,187,255,0.75), transparent 70%),
               radial-gradient(800px 700px at 10% 100%, rgba(132,104,249,0.22), transparent 70%)`,
        }}
      />
      {/* Thin orbit arcs, echoing the Instagram feed */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
        viewBox="0 0 1080 1920"
      >
        {[700, 1000, 1300].map((r, i) => (
          <circle
            key={r}
            cx={1080 + drift}
            cy={-100}
            r={r}
            fill="none"
            stroke={dark ? "rgba(200,187,255,0.10)" : "rgba(132,104,249,0.16)"}
            strokeWidth={2}
            strokeDasharray={i === 1 ? "4 14" : undefined}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- Camera: 3D push-in + drift ---------- */

export const Camera: React.FC<{
  children: React.ReactNode;
  rx?: [number, number];
  ry?: [number, number];
  scale?: [number, number];
}> = ({ children, rx = [6, 0], ry = [0, 0], scale = [1, 1.06] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const e = EASE_OUT(Math.min(1, p * 1.4));
  return (
    <AbsoluteFill style={{ perspective: 2200 }}>
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx[0] + (rx[1] - rx[0]) * e}deg) rotateY(${
            ry[0] + (ry[1] - ry[0]) * p
          }deg) scale(${scale[0] + (scale[1] - scale[0]) * p})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Kinetic words: blur-in per word ---------- */

export const Words: React.FC<{
  text: string;
  start?: number;
  size: number;
  weight?: number;
  color: string;
  accent?: string[];
  stagger?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  start = 0,
  size,
  weight = 700,
  color,
  accent = [],
  stagger = 3,
  lineHeight = 1.02,
  style,
}) => {
  const frame = useCurrentFrame();
  let idx = 0;
  return (
    <div
      style={{
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: "-0.045em",
        lineHeight,
        textAlign: "center",
        ...style,
      }}
    >
      {text.split("\n").map((line, li) => (
        <div key={li}>
          {line.split(" ").map((w, wi) => {
            const s = start + idx++ * stagger;
            const p = interpolate(frame, [s, s + 20], [0, 1], {
              ...clamp,
              easing: EASE_OUT,
            });
            const isAccent = accent.some((a) =>
              w.toLowerCase().includes(a.toLowerCase()),
            );
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  marginRight: "0.24em",
                  opacity: p,
                  filter: `blur(${(1 - p) * 18}px)`,
                  translate: `0px ${(1 - p) * 50}px`,
                  ...(isAccent
                    ? {
                        backgroundImage: GRADIENT,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        paddingBottom: "0.08em",
                      }
                    : {}),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- Glass card ---------- */

export const Glass: React.FC<{
  dark?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ dark, style, children }) => (
  <div
    style={{
      background: dark
        ? "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))"
        : "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62))",
      border: `2px solid ${dark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,1)"}`,
      backdropFilter: "blur(30px)",
      WebkitBackdropFilter: "blur(30px)",
      borderRadius: 48,
      boxShadow: dark
        ? "0 50px 100px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.12)"
        : "0 50px 100px rgba(90,59,232,0.16), 0 8px 24px rgba(22,19,31,0.06)",
      fontFamily,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- Icons ---------- */

export const ServerIcon: React.FC<{ size: number; glow?: boolean }> = ({
  size,
  glow,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      style={{
        filter: glow ? "drop-shadow(0 20px 40px rgba(132,104,249,0.6))" : undefined,
      }}
    >
      <defs>
        <linearGradient id="srv" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A2340" />
          <stop offset="1" stopColor="#0D0B17" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${i * 38})`}>
          <rect x="4" y="2" width="92" height="33" rx="9" fill="url(#srv)" stroke="rgba(200,187,255,0.35)" strokeWidth="1.5" />
          <rect x="14" y="15" width="40" height="5" rx="2.5" fill="rgba(200,187,255,0.35)" />
          <circle
            cx="80"
            cy="18"
            r="4"
            fill={C.purple}
            opacity={0.5 + 0.5 * Math.abs(Math.sin((frame + i * 9) / 6))}
          />
          <circle cx="68" cy="18" r="3" fill={C.lavender} opacity={0.6} />
        </g>
      ))}
    </svg>
  );
};

export const Cursor: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.3))" }}>
    <path
      d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.6 L11.7 14.2 L18 14.2 Z"
      fill="#fff"
      stroke="#16131F"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconTile: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 120,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: GRADIENT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 18px 40px rgba(90,59,232,0.4), inset 0 2px 0 rgba(255,255,255,0.4)",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);
