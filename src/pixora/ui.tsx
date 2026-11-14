import React from "react";
import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

// Inter Display local (public/fonts) — SF Pro Display é usada se estiver instalada.
const FAMILY = "Inter Display";
for (const [file, weight] of [
  ["Regular", "400"],
  ["Medium", "500"],
  ["SemiBold", "600"],
  ["Bold", "700"],
] as const) {
  loadFont({
    family: FAMILY,
    url: staticFile(`fonts/InterDisplay-${file}.otf`),
    weight,
  });
}

export const FONT = `"SF Pro Display", "${FAMILY}", -apple-system, sans-serif`;

/** Emojis 3D (Fluent Emoji 3D, MIT) em public/emoji. */
const EMOJI_FILES: Record<string, string> = {
  "💸": "money",
  "🔒": "lock",
  "⚡": "zap",
  "🎬": "clapper",
  "🎙️": "mic",
  "🔥": "fire",
  "👀": "eyes",
};

export const C = {
  white: "#FFFFFF",
  gray: "#F2F2F7",
  black: "#000000",
  ink: "#111111",
  sub: "#8E8E93",
  blue: "#0A84FF",
  bubble: "#E9E9EB",
  green: "#34C759",
  red: "#FF3B30",
};

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN = Easing.bezier(0.64, 0, 0.78, 0);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 0→1 entre start e start+dur, com ease-out da marca. */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = EASE,
) => interpolate(frame, [start, start + dur], [0, 1], { ...CLAMP, easing });

/** Spring sem quique exagerado. */
export const useSpring = (delay: number, damping = 18, mass = 0.9) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, mass, stiffness: 120 },
  });
};

type BlurInProps = {
  readonly delay?: number;
  readonly duration?: number;
  /** Frame em que o elemento começa a sair (blur out). */
  readonly outAt?: number;
  readonly outDuration?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
};

/** Entrada assinatura: blur 20→0, opacidade 0→1, escala 1.08→1 em 12 frames. */
export const BlurIn: React.FC<BlurInProps> = ({
  delay = 0,
  duration = 12,
  outAt,
  outDuration = 8,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, duration);
  const q = outAt === undefined ? 0 : prog(frame, outAt, outDuration, EASE_IN);
  return (
    <div
      style={{
        opacity: p * (1 - q),
        filter: `blur(${20 * (1 - p) + 20 * q}px)`,
        scale: String(1.08 - 0.08 * p - 0.04 * q),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Texto que entra palavra por palavra, cada uma saindo do desfoque. */
export const WordByWord: React.FC<{
  readonly text: string;
  readonly delay?: number;
  readonly stagger?: number;
  readonly outAt?: number;
  readonly style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 4, outAt, style }) => {
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: "0.26em",
        ...style,
      }}
    >
      {words.map((w, i) => (
        <BlurIn
          key={`${w}-${i}`}
          delay={delay + i * stagger}
          outAt={outAt}
          style={{ display: "inline-block" }}
        >
          {w}
        </BlurIn>
      ))}
    </div>
  );
};

export const Title: React.FC<{
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ children, color = C.ink, size = 84, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: "-0.025em",
      color,
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Emoji: React.FC<{
  readonly char: string;
  readonly size: number;
}> = ({ char, size }) => (
  <Img
    src={staticFile(`emoji/${EMOJI_FILES[char]}.png`)}
    style={{
      width: size,
      height: size,
      display: "inline-block",
      verticalAlign: "-0.15em",
    }}
  />
);

/** Emoji dentro de círculo branco com sombra suave. */
export const EmojiBadge: React.FC<{
  readonly char: string;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ char, size = 200, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: C.white,
      boxShadow:
        "0 24px 60px rgba(0,0,0,0.10), 0 4px 14px rgba(0,0,0,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      ...style,
    }}
  >
    <Emoji char={char} size={size * 0.58} />
  </div>
);

/** Mockup de iPhone flat: cantos 60px, ilha em pílula e sombra suave. */
export const IPhone: React.FC<{
  readonly width?: number;
  readonly height?: number;
  readonly screen?: string;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ width = 470, height = 960, screen = C.white, style, children }) => {
  const bezel = Math.round(width * 0.03);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 60,
        background: "#1C1C1E",
        padding: bezel,
        boxShadow:
          "0 50px 100px rgba(0,0,0,0.14), 0 10px 30px rgba(0,0,0,0.08)",
        position: "relative",
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 60 - bezel,
          background: screen,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: "50%",
            translate: "-50% 0",
            width: width * 0.3,
            height: 36,
            borderRadius: 18,
            background: "#000",
          }}
        />
      </div>
    </div>
  );
};

/** Logo PIXORA: P geométrico com corte diagonal (recriado em vetor). */
export const PixoraP: React.FC<{
  readonly size: number;
  readonly color?: string;
  /** Posição do brilho diagonal (0→1); undefined = sem brilho. */
  readonly shine?: number;
  readonly id?: string;
}> = ({ size, color = C.white, shine, id = "p" }) => {
  const shineX = shine === undefined ? -1 : -300 + shine * 1100;
  return (
    <svg
      width={size}
      height={size * (475 / 500)}
      viewBox="385 410 500 475"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={`${id}-fold`}
          x1="680"
          y1="650"
          x2="740"
          y2="700"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${id}-shine`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientTransform="rotate(25)"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d="M398 428H735A137.5 137.5 0 0 1 735 703H618L563 752V608H725A45 45 0 0 0 725 518H492Z" />
          <path d="M525 637V778L420 867V730Z" />
        </clipPath>
      </defs>
      <path
        fill={color}
        d="M398 428H735A137.5 137.5 0 0 1 735 703H618L563 752V608H725A45 45 0 0 0 725 518H492Z"
      />
      <path fill={color} d="M525 637V778L420 867V730Z" />
      <polygon
        points="725,608 618,703 760,703 780,640"
        fill={`url(#${id}-fold)`}
        clipPath={`url(#${id}-clip)`}
      />
      {shine !== undefined ? (
        <g clipPath={`url(#${id}-clip)`}>
          <rect
            x={shineX}
            y="300"
            width="120"
            height="700"
            fill={`url(#${id}-shine)`}
            transform={`rotate(25 ${shineX + 60} 650)`}
            opacity={0.9}
          />
        </g>
      ) : null}
    </svg>
  );
};

/** Traço SVG que se desenha (stroke animado). */
export const DrawPath: React.FC<{
  readonly d: string;
  readonly progress: number;
  readonly length: number;
  readonly color: string;
  readonly width: number;
}> = ({ d, progress, length, color, width }) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={length}
    strokeDashoffset={length * (1 - progress)}
  />
);
