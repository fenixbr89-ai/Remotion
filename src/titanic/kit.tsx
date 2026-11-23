import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { pop } from "../che/lib";

export const RED = "#e0372e";

/* ---------------- glyphs (drawn in a 100x100 box) ---------------- */
export const G: Record<string, string> = {
  eye: '<path d="M6 50 C 24 22, 76 22, 94 50 C 76 78, 24 78, 6 50 Z" fill="F"/><circle cx="50" cy="50" r="17" fill="A"/><circle cx="50" cy="50" r="7" fill="F"/>',
  clock:
    '<circle cx="50" cy="50" r="40" fill="F"/><circle cx="50" cy="50" r="5" fill="A"/>',
  ship: '<path d="M8 60 L92 60 L80 80 L20 80 Z" fill="F"/><rect x="26" y="44" width="48" height="14" rx="3" fill="F"/><rect x="32" y="24" width="8" height="18" fill="F"/><rect x="46" y="24" width="8" height="18" fill="F"/><rect x="60" y="24" width="8" height="18" fill="F"/>',
  ice: '<path d="M50 8 L70 40 L86 44 L94 80 L6 80 L18 50 L34 44 Z" fill="F"/><path d="M50 8 L58 40 L44 80" stroke="A" stroke-width="4" fill="none"/>',
  buoy: '<circle cx="50" cy="50" r="36" fill="none" stroke="F" stroke-width="16"/><path d="M50 12 V28 M50 72 V88 M12 50 H28 M72 50 H88" stroke="A" stroke-width="16"/>',
  bino: '<circle cx="28" cy="64" r="20" fill="F"/><circle cx="72" cy="64" r="20" fill="F"/><rect x="16" y="22" width="22" height="40" rx="8" fill="F"/><rect x="62" y="22" width="22" height="40" rx="8" fill="F"/><rect x="38" y="36" width="24" height="16" fill="F"/><circle cx="28" cy="64" r="9" fill="A"/><circle cx="72" cy="64" r="9" fill="A"/>',
  lock: '<rect x="20" y="44" width="60" height="44" rx="10" fill="F"/><path d="M32 44 V32 a18 18 0 0 1 36 0 V44" stroke="F" stroke-width="10" fill="none"/><circle cx="50" cy="64" r="7" fill="A"/>',
  key: '<circle cx="30" cy="50" r="17" fill="none" stroke="F" stroke-width="10"/><path d="M47 50 H90 M76 50 V64 M88 50 V60" stroke="F" stroke-width="10" stroke-linecap="round"/>',
  warn: '<path d="M50 12 L90 84 L10 84 Z" fill="F" stroke="F" stroke-width="6" stroke-linejoin="round"/><rect x="45" y="36" width="10" height="28" rx="4" fill="A"/><circle cx="50" cy="74" r="6" fill="A"/>',
  shield:
    '<path d="M50 8 L84 20 V48 C84 70, 68 84, 50 92 C32 84, 16 70, 16 48 V20 Z" fill="F"/><path d="M34 50 L46 62 L68 38" stroke="A" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  moon: '<path d="M62 12 A40 40 0 1 0 88 66 A32 32 0 1 1 62 12 Z" fill="F"/>',
  radio:
    '<rect x="18" y="46" width="64" height="40" rx="8" fill="F"/><circle cx="36" cy="66" r="9" fill="A"/><rect x="52" y="58" width="22" height="5" rx="2" fill="A"/><rect x="52" y="68" width="22" height="5" rx="2" fill="A"/><path d="M60 46 L76 14" stroke="F" stroke-width="6" stroke-linecap="round"/>',
  boat: '<path d="M8 52 L92 52 L76 78 L24 78 Z" fill="F"/><path d="M50 14 L50 50 M52 18 L76 46 L52 46 Z" stroke="F" stroke-width="5" fill="F"/>',
  person:
    '<circle cx="50" cy="26" r="16" fill="F"/><path d="M18 92 V66 Q18 48 50 48 Q82 48 82 66 V92 Z" fill="F"/>',
  gauge:
    '<path d="M12 70 A40 40 0 0 1 88 70" fill="none" stroke="F" stroke-width="12" stroke-linecap="round"/><circle cx="50" cy="70" r="9" fill="F"/>',
  chat: '<path d="M14 20 H86 A8 8 0 0 1 94 28 V64 A8 8 0 0 1 86 72 H44 L24 88 V72 H14 A8 8 0 0 1 6 64 V28 A8 8 0 0 1 14 20 Z" fill="F"/><circle cx="32" cy="46" r="6" fill="A"/><circle cx="50" cy="46" r="6" fill="A"/><circle cx="68" cy="46" r="6" fill="A"/>',
};

export type Mat = "silver" | "red" | "dark";
export const MAT: Record<
  Mat,
  { bg: string; shadow: string; f: string; a: string }
> = {
  silver: {
    bg: "linear-gradient(160deg,#ffffff 0%,#d9d9de 45%,#7d7d86 100%)",
    shadow:
      "0 30px 60px rgba(0,0,0,.6), 0 0 40px rgba(255,255,255,.08), inset 0 -10px 24px rgba(0,0,0,.35), inset 0 8px 14px rgba(255,255,255,.8)",
    f: "#17171b",
    a: "#8a8a92",
  },
  red: {
    bg: "linear-gradient(160deg,#ff8a7e 0%,#e0372e 45%,#8a1410 100%)",
    shadow:
      "0 30px 60px rgba(224,55,46,.4), inset 0 -10px 24px rgba(80,0,0,.45), inset 0 8px 14px rgba(255,255,255,.5)",
    f: "#ffffff",
    a: "#a3140f",
  },
  dark: {
    bg: "linear-gradient(160deg,#4a4a52 0%,#23232a 55%,#0f0f12 100%)",
    shadow:
      "0 30px 60px rgba(0,0,0,.6), inset 0 -10px 24px rgba(0,0,0,.6), inset 0 8px 14px rgba(255,255,255,.25)",
    f: "#ffffff",
    a: "rgba(255,255,255,.4)",
  },
};

export const Glyph: React.FC<{
  g: string;
  f: string;
  a: string;
  size: string | number;
}> = ({ g, f, a, size }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    dangerouslySetInnerHTML={{
      __html: G[g].split('"F"').join(`"${f}"`).split('"A"').join(`"${a}"`),
    }}
  />
);

/** Glossy 3D squircle icon; floats gently. */
export const Icon: React.FC<{
  g: string;
  x: number;
  y: number;
  s: number;
  mat?: Mat;
  rot?: number;
  blur?: boolean;
  at?: number;
  slash?: number; // 0..1 red slash drawn over it
}> = ({ g, x, y, s, mat = "silver", rot = 0, blur, at = 0, slash = 0 }) => {
  const f = useCurrentFrame();
  const m = MAT[mat];
  const bob = Math.sin(f / 18 + x * 0.01) * 14;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s,
        height: s,
        translate: `0px ${bob}px`,
        rotate: `${rot + Math.sin(f / 30 + y) * 2}deg`,
        filter: blur ? "blur(10px)" : undefined,
        opacity: (blur ? 0.7 : 1) * pop(f, at, 16).opacity,
        scale: pop(f, at, 16).scale,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "28%",
          background: m.bg,
          boxShadow: m.shadow,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "12%",
            right: "12%",
            top: "6%",
            height: "34%",
            borderRadius: "50%",
            background:
              "linear-gradient(180deg,rgba(255,255,255,.6),rgba(255,255,255,0))",
          }}
        />
      </div>
      <div style={{ position: "absolute", inset: "22%" }}>
        <Glyph g={g} f={m.f} a={m.a} size="100%" />
      </div>
      {slash > 0 ? (
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: "10%",
            width: "80%",
            height: "80%",
          }}
        >
          <line
            x1={14}
            y1={14}
            x2={14 + 72 * slash}
            y2={14 + 72 * slash}
            stroke={RED}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </div>
  );
};

/** Frosted glass card, facing the camera (tiny tilt only). */
export const Glass: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  tilt?: number;
  children?: React.ReactNode;
  radius?: number;
}> = ({ x, y, w, h, at = 0, tilt = 0, children, radius = 44 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        background:
          "linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.04) 55%,rgba(255,255,255,.08))",
        border: "1.5px solid rgba(255,255,255,.22)",
        boxShadow:
          "0 50px 90px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.35)",
        overflow: "hidden",
        rotate: `${tilt + Math.sin(f / 40) * 0.6}deg`,
        scale: p.scale,
        opacity: p.opacity,
      }}
    >
      {children}
    </div>
  );
};

export const PhotoIn: React.FC<{
  src: string;
  pos?: string;
  inset?: number;
}> = ({ src, pos = "50% 45%", inset = 20 }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        inset,
        borderRadius: 28,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(`titanic/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          filter: "grayscale(1) contrast(1.12)",
          scale: String(1.04 + f * 0.0007),
        }}
      />
    </div>
  );
};

export const Glow: React.FC<{
  x?: number;
  y?: number;
  r?: number;
  a?: number;
  color?: string;
}> = ({ x = 540, y = 640, r = 460, a = 0.08, color = "255,255,255" }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(${color},${a}), rgba(${color},0) 70%)`,
    }}
  />
);

/** Slow push-in; no sideways camera. */
export const Cam: React.FC<{
  d: number;
  children: React.ReactNode;
  from?: number;
  to?: number;
}> = ({ d, children, from = 1, to = 1.13 }) => {
  const f = useCurrentFrame();
  const t = f / d;
  return (
    <AbsoluteFill
      style={{
        scale: String(from + (to - from) * t),
        translate: `0px ${-24 * t}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{ children: React.ReactNode; glow?: number }> = ({
  children,
  glow = 0.08,
}) => (
  <AbsoluteFill style={{ background: "#050506" }}>
    <Glow a={glow} />
    {children}
  </AbsoluteFill>
);
