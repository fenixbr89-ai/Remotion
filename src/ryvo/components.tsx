import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT, P } from "./theme";
import { useTheme } from "./ThemeContext";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** 0→1 progress starting at `delay` seconds, lasting `dur` seconds. */
export const useProgress = (delay: number, dur = 0.7) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [delay * fps, (delay + dur) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

/** Text/element entrance: opacity, blur 16→0, rise 26px. */
export const Reveal: React.FC<{
  delay: number;
  dur?: number;
  rise?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay, dur = 0.75, rise = 26, style, children }) => {
  const p = useProgress(delay, dur);
  return (
    <div
      style={{
        opacity: p,
        filter: `blur(${(1 - p) * 16}px)`,
        transform: `translateY(${(1 - p) * rise}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Scene wrapper: soft blur crossfade in and out. */
export const SceneWrap: React.FC<{
  durationInFrames: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  children: React.ReactNode;
}> = ({ durationInFrames, fadeIn = true, fadeOut = true, children }) => {
  const frame = useCurrentFrame();
  const f = 9;
  const inP = fadeIn ? interpolate(frame, [0, f], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const outP = fadeOut
    ? interpolate(frame, [durationInFrames - f, durationInFrames], [1, 0], { extrapolateLeft: "clamp" })
    : 1;
  const o = Math.min(inP, outP);
  const scale = interpolate(frame, [durationInFrames - f, durationInFrames], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        filter: o < 1 ? `blur(${(1 - o) * 14}px)` : undefined,
        transform: fadeOut ? `scale(${scale})` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Deep black background with drifting violet / blue light and a faint tech grid. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const T = useTheme();
  const t = frame / 30;
  const orb = (x: number, y: number, size: number, color: string, phase: number, o: number) => (
    <div
      style={{
        position: "absolute",
        left: x + Math.sin(t * 0.35 + phase) * 70,
        top: y + Math.cos(t * 0.3 + phase) * 60,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(160px)",
        opacity: o,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: T.bg, overflow: "hidden" }}>
      {orb(520, 1000, 780, T.orbs[0].color, 0, T.orbs[0].o)}
      {orb(-300, 1380, 620, T.orbs[1].color, 2, T.orbs[1].o)}
      {orb(560, -260, 600, T.orbs[2].color, 4, T.orbs[2].o)}
      {orb(-260, 260, 460, T.orbs[3].color, 1, T.orbs[3].o)}
      {/* perspective grid floor */}
      <div
        style={{
          position: "absolute",
          left: -600,
          right: -600,
          bottom: -200,
          height: 900,
          transform: "perspective(900px) rotateX(68deg)",
          transformOrigin: "bottom",
          backgroundImage: `linear-gradient(${T.grid} 2px, transparent 2px), linear-gradient(90deg, ${T.grid} 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${(t * 40) % 120}px`,
          WebkitMaskImage: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 85%)",
          maskImage: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 85%)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{ background: T.vignette }}
      />
    </AbsoluteFill>
  );
};

/** Frosted glass surface for the current theme. */
export const useGlass = () => useTheme().glass;

/** Thick rounded glass "petal" like the reference renders. */
export const GlassTile: React.FC<{
  size: number;
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  rz?: number;
  tint?: number;
  blur?: number;
  floatPhase?: number;
  opacity?: number;
}> = ({ size, x, y, rx = 0, ry = 0, rz = 0, tint = 0.6, blur = 0, floatPhase = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const glass = useGlass();
  const t = frame / 30;
  const fy = Math.sin(t * 0.9 + floatPhase) * 14;
  const frz = Math.sin(t * 0.5 + floatPhase) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + fy,
        width: size,
        height: size,
        transform: `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz + frz}deg)`,
        filter: blur ? `blur(${blur}px)` : undefined,
        opacity,
        ...glass(tint, size * 0.28),
        background: `linear-gradient(150deg, rgba(245,243,255,0.35) 0%, rgba(167,139,250,${
          0.25 + tint * 0.2
        }) 45%, rgba(117,71,232,${0.35 + tint * 0.35}) 100%)`,
        border: "2px solid rgba(245,243,255,0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: size * 0.08,
          borderRadius: size * 0.22,
          background: "radial-gradient(120% 80% at 30% 20%, rgba(245,243,255,0.4), rgba(245,243,255,0) 60%)",
        }}
      />
    </div>
  );
};

/** Glass sphere accent. */
export const Bubble: React.FC<{ size: number; x: number; y: number; phase?: number; blur?: number }> = ({
  size,
  x,
  y,
  phase = 0,
  blur = 0,
}) => {
  const frame = useCurrentFrame();
  const fy = Math.sin(frame / 30 + phase) * 18;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + fy,
        width: size,
        height: size,
        borderRadius: "50%",
        filter: blur ? `blur(${blur}px)` : undefined,
        background:
          "radial-gradient(circle at 32% 28%, rgba(245,243,255,0.9) 0%, rgba(245,243,255,0.2) 20%, rgba(167,139,250,0.25) 55%, rgba(117,71,232,0.6) 100%)",
        border: "1.5px solid rgba(245,243,255,0.45)",
        boxShadow: "0 0 40px rgba(117,71,232,0.45), inset -8px -10px 20px rgba(8,123,255,0.25)",
      }}
    />
  );
};

/** Official RYVO "R" symbol (PNG with transparency, aspect 1348:1060). */
export const LogoMark: React.FC<{ height: number; white?: boolean; style?: React.CSSProperties }> = ({
  height,
  white,
  style,
}) => (
  <Img
    src={staticFile(white ? "ryvo-r-white.png" : "ryvo-r.png")}
    style={{ height, width: (height * 1348) / 1060, display: "block", ...style }}
  />
);

/** Glass pill: RYVO left, ESTÚDIO CRIATIVO right. */
export const BrandBar: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const T = useTheme();
  return (
  <div
    style={{
      position: "absolute",
      left: 80,
      right: 80,
      top: 1540,
      height: 128,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 64px",
      opacity,
      ...T.glass(0.15, 64),
      background: T.brandBarBg,
    }}
  >
    <LogoMark height={60} />
    <span style={{ fontFamily: FONT, fontSize: 26, letterSpacing: "0.12em", color: T.accentText, fontWeight: 500 }}>
      ESTÚDIO CRIATIVO
    </span>
  </div>
  );
};

/** Two-weight headline: thin ice line + heavy italic gradient line. */
export const Headline: React.FC<{
  light: string;
  bold: string;
  delay: number;
  lightSize?: number;
  boldSize?: number;
  boldItalic?: boolean;
  align?: "left" | "center";
}> = ({ light, bold, delay, lightSize = 132, boldSize = 150, boldItalic = true, align = "left" }) => {
  const T = useTheme();
  return (
  <div style={{ fontFamily: FONT, textAlign: align }}>
    {light.split("\n").map((l, i) => (
      <Reveal key={l} delay={delay + i * 0.08}>
        <div style={{ fontSize: lightSize, fontWeight: 300, color: T.text, letterSpacing: "-0.045em", lineHeight: 0.98 }}>
          {l}
        </div>
      </Reveal>
    ))}
    {bold.split("\n").map((l, i) => (
      <Reveal key={l} delay={delay + 0.16 + i * 0.08}>
        <div
          style={{
            fontSize: boldSize,
            fontWeight: 900,
            fontStyle: boldItalic ? "italic" : "normal",
            letterSpacing: "-0.06em",
            lineHeight: 1.0,
            paddingRight: 20,
            paddingBottom: 6,
            display: "inline-block",
            background: T.headlineGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {l}
        </div>
      </Reveal>
    ))}
  </div>
  );
};

export const Eyebrow: React.FC<{ n: string; label: string; delay: number }> = ({ n, label, delay }) => {
  const T = useTheme();
  return (
  <Reveal delay={delay}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 30px",
        fontFamily: FONT,
        fontSize: 26,
        fontWeight: 600,
        letterSpacing: "0.16em",
        color: T.accentText,
        ...T.glass(0.1, 40),
      }}
    >
      <span style={{ color: P.blue }}>{n}</span>
      <span style={{ width: 2, height: 24, background: "rgba(167,139,250,0.35)" }} />
      {label}
    </div>
  </Reveal>
  );
};

export const Chips: React.FC<{ items: string[]; delay: number }> = ({ items, delay }) => {
  const T = useTheme();
  return (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
    {items.map((it, i) => (
      <Reveal key={it} delay={delay + i * 0.1} rise={18}>
        <div
          style={{
            padding: "14px 28px",
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 500,
            color: T.name === "escuro" ? P.ice : P.black,
            ...T.glass(0.35, 40),
          }}
        >
          {it}
        </div>
      </Reveal>
    ))}
  </div>
  );
};

/** Supporting line with the blue accent bar. */
export const Support: React.FC<{ children: React.ReactNode; delay: number; width?: number }> = ({
  children,
  delay,
  width = 820,
}) => {
  const p = useProgress(delay, 0.8);
  const T = useTheme();
  return (
    <div style={{ display: "flex", gap: 26, width }}>
      <div
        style={{
          width: 5,
          borderRadius: 3,
          background: `linear-gradient(180deg, rgba(8,123,255,0) 0%, ${P.blue} 100%)`,
          boxShadow: `0 0 14px ${P.blue}`,
          transform: `scaleY(${p})`,
          transformOrigin: "top",
        }}
      />
      <Reveal delay={delay + 0.1}>
        <div style={{ fontFamily: FONT, fontSize: 36, lineHeight: 1.45, color: T.textSoft, fontWeight: 400 }}>
          {children}
        </div>
      </Reveal>
    </div>
  );
};

export const B: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <b style={{ fontWeight: 800, fontStyle: "italic", color: useTheme().accentText }}>{children}</b>
);
