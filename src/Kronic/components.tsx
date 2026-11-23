import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENT, C, clamp, EASE, fontFamily } from "./theme";

/* ---------- Flat background ---------- */

export const Bg: React.FC<{ color: string }> = ({ color }) => (
  <AbsoluteFill style={{ backgroundColor: color }} />
);

/* ---------- Gentle camera push-in ---------- */

export const Push: React.FC<{ children: React.ReactNode; from?: number; to?: number }> = ({
  children,
  from = 1,
  to = 1.04,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ scale: String(interpolate(frame, [0, durationInFrames], [from, to], clamp)) }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ---------- Line reveal: fade up + soft blur ---------- */

export const reveal = (frame: number, start: number, dur = 26) => {
  const p = interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: EASE });
  return {
    opacity: p,
    translate: `0px ${(1 - p) * 40}px`,
    filter: `blur(${(1 - p) * 10}px)`,
  } as React.CSSProperties;
};

export const Line: React.FC<{
  start: number;
  size: number;
  color?: string;
  weight?: number;
  accent?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, size, color = C.ink, weight = 700, accent, children, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: size > 80 ? "-0.05em" : "-0.02em",
        lineHeight: 1.05,
        textAlign: "center",
        color,
        ...(accent
          ? {
              backgroundImage: ACCENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              paddingBottom: "0.1em",
            }
          : {}),
        ...reveal(frame, start),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Hero product: 3D server unit ---------- */

const face = (w: number, h: number, transform: string, background: string, extra?: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  left: "50%",
  top: "50%",
  width: w,
  height: h,
  marginLeft: -w / 2,
  marginTop: -h / 2,
  transform,
  background,
  backfaceVisibility: "hidden",
  ...extra,
});

export const Server3D: React.FC<{
  rotY: number;
  rotX?: number;
  width?: number;
  units?: number;
}> = ({ rotY, rotX = -16, width = 640, units = 3 }) => {
  const frame = useCurrentFrame();
  const uh = width * 0.2;
  const h = uh * units;
  const d = width * 0.75;
  const metalTop = "linear-gradient(135deg, #3A3A3E 0%, #1C1C1F 60%, #2A2A2E 100%)";
  const metalSide = "linear-gradient(180deg, #2B2B2F 0%, #141416 100%)";
  const grill = `radial-gradient(circle, #000 2.2px, transparent 2.8px) 0 0 / 15px 15px, linear-gradient(180deg, #2E2E32, #19191C)`;
  const led = 0.65 + 0.35 * Math.sin(frame / 10);

  return (
    <div style={{ width: width * 1.6, height: h * 2.4, position: "relative", perspective: 2600 }}>
      {/* floor shadow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: width * 1.25,
          height: 90,
          marginLeft: -width * 0.625,
          marginTop: h * 0.62,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.28), transparent)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {/* front */}
        <div style={face(width, h, `translateZ(${d / 2}px)`, metalSide, { borderRadius: 6, overflow: "hidden" })}>
          {Array.from({ length: units }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: i * uh,
                height: uh,
                borderBottom: i < units - 1 ? "3px solid #0A0A0B" : undefined,
                boxShadow: "inset 0 2px 0 rgba(255,255,255,0.08)",
                background: grill,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 34,
                  top: uh / 2 - 5,
                  width: 70,
                  height: 10,
                  borderRadius: 5,
                  background: C.purple,
                  opacity: led,
                  boxShadow: `0 0 18px ${C.purple}`,
                }}
              />
              <div style={{ position: "absolute", left: 34, top: uh / 2 - 7, width: 14, height: 14, borderRadius: 7, background: "#3DDC84", opacity: 0.8 }} />
            </div>
          ))}
        </div>
        {/* back */}
        <div style={face(width, h, `rotateY(180deg) translateZ(${d / 2}px)`, "#111")} />
        {/* right */}
        <div style={face(d, h, `rotateY(90deg) translateZ(${width / 2}px)`, metalSide)} />
        {/* left */}
        <div style={face(d, h, `rotateY(-90deg) translateZ(${width / 2}px)`, metalSide)} />
        {/* top */}
        <div style={face(width, d, `rotateX(90deg) translateZ(${h / 2}px)`, metalTop)} />
        {/* bottom */}
        <div style={face(width, d, `rotateX(-90deg) translateZ(${h / 2}px)`, "#0B0B0C")} />
      </div>
    </div>
  );
};

/* ---------- Cursor ---------- */

export const Cursor: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))" }}>
    <path
      d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.6 L11.7 14.2 L18 14.2 Z"
      fill="#1D1D1F"
      stroke="#fff"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);
