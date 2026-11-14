import React from "react";
import {
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
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
    opacity={progress <= 0.001 ? 0 : 1}
  />
);

export type KLine = {
  readonly text: string;
  readonly size?: number;
  readonly color?: string;
  readonly weight?: number;
  /** Anima letra por letra em vez de palavra por palavra. */
  readonly chars?: boolean;
  readonly tracking?: string;
};

/**
 * Tipografia cinética: cada palavra (ou letra) sobe por uma máscara com leve rotação
 * e sai para cima no mesmo estilo. O stagger corre por todas as linhas.
 */
export const Kinetic: React.FC<{
  readonly lines: KLine[];
  readonly delay?: number;
  readonly stagger?: number;
  readonly outAt?: number;
  readonly align?: "center" | "flex-start";
  readonly lineHeight?: number;
  /** Elemento extra colado ao fim da última linha (ex.: o ponto que cresce). */
  readonly trailing?: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({
  lines,
  delay = 0,
  stagger = 3,
  outAt,
  align = "center",
  lineHeight = 1.06,
  trailing,
  style,
}) => {
  const frame = useCurrentFrame();
  let idx = 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        fontFamily: FONT,
        ...style,
      }}
    >
      {lines.map((line, li) => {
        const units = line.chars ? Array.from(line.text) : line.text.split(" ");
        const isLast = li === lines.length - 1;
        return (
          <div
            key={li}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: align,
              alignItems: "baseline",
              columnGap: line.chars ? 0 : "0.24em",
              fontSize: line.size ?? 88,
              fontWeight: line.weight ?? 600,
              color: line.color ?? C.ink,
              letterSpacing: line.tracking ?? "-0.03em",
              lineHeight,
            }}
          >
            {units.map((u, ui) => {
              const myIdx = idx++;
              const step = line.chars ? stagger * 0.45 : stagger;
              const t = prog(frame, delay + myIdx * step, 18);
              const o =
                outAt === undefined ? 0 : prog(frame, outAt + myIdx * (step * 0.6), 12, EASE_IN);
              return (
                <span
                  key={ui}
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    padding: "0.2em 0.05em 0.16em",
                    margin: "-0.2em -0.05em -0.16em",
                    whiteSpace: "pre",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      translate: `0% ${(1 - t) * 115 - o * 135}%`,
                      rotate: `${(1 - t) * 7}deg`,
                      transformOrigin: "0% 100%",
                      filter: `blur(${(1 - t) * 5 + o * 5}px)`,
                    }}
                  >
                    {u}
                  </span>
                </span>
              );
            })}
            {isLast ? trailing : null}
          </div>
        );
      })}
    </div>
  );
};

/** Câmera que nunca para: leve aproximação contínua durante toda a cena. */
export const Drift: React.FC<{
  readonly dur: number;
  readonly amount?: number;
  readonly origin?: string;
  readonly children: React.ReactNode;
}> = ({ dur, amount = 0.035, origin = "50% 45%", children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: origin,
        scale: String(interpolate(frame, [0, dur], [1, 1 + amount], CLAMP)),
      }}
    >
      {children}
    </div>
  );
};


// ---------- Som dentro das cenas ----------
export type SfxName = "whoosh" | "tap" | "pop" | "ding" | "impact";

/** Efeito sonoro no frame local da cena. */
export const Sfx: React.FC<{ readonly at: number; readonly name: SfxName; readonly volume?: number }> = ({
  at,
  name,
  volume = 0.5,
}) => (
  <Sequence from={Math.round(at)} layout="none" name={`SFX ${name}`}>
    <Audio src={staticFile(`audio/${name}.wav`)} volume={volume} />
  </Sequence>
);

// ---------- Câmera ----------
export type CamKey = { f: number; z?: number; x?: number; y?: number; r?: number };

const track = (frame: number, keys: CamKey[], prop: "z" | "x" | "y" | "r", base: number) => {
  const pts: [number, number][] = [];
  let last = base;
  for (const k of keys) {
    const v = k[prop];
    if (v !== undefined) last = v;
    pts.push([k.f, last]);
  }
  if (pts.length < 2) return pts.length ? pts[0][1] : base;
  return interpolate(
    frame,
    pts.map((p) => p[0]),
    pts.map((p) => p[1]),
    { ...CLAMP, easing: EASE_IN_OUT },
  );
};

/**
 * Câmera da cena: keyframes de zoom/posição/rotação, tremor de mão contínuo e
 * "punches" (zoom rápido + tremida) nos momentos de impacto.
 */
export const Camera: React.FC<{
  readonly keys?: CamKey[];
  readonly handheld?: number;
  readonly punches?: { f: number; amt?: number }[];
  readonly origin?: string;
  readonly children: React.ReactNode;
}> = ({ keys = [{ f: 0 }], handheld = 1, punches = [], origin = "50% 50%", children }) => {
  const frame = useCurrentFrame();
  const z = track(frame, keys, "z", 1);
  const x = track(frame, keys, "x", 0);
  const y = track(frame, keys, "y", 0);
  const r = track(frame, keys, "r", 0);
  let pz = 0;
  let shake = 0;
  for (const p of punches) {
    const amt = p.amt ?? 0.05;
    pz += interpolate(frame, [p.f, p.f + 3, p.f + 16], [0, amt, 0], CLAMP);
    shake += interpolate(frame, [p.f, p.f + 2, p.f + 14], [0, amt * 260, 0], CLAMP);
  }
  const hx = handheld * (Math.sin(frame * 0.13) * 5 + Math.sin(frame * 0.071 + 1) * 4);
  const hy = handheld * (Math.cos(frame * 0.11) * 5 + Math.sin(frame * 0.053 + 2) * 3);
  const hr = handheld * Math.sin(frame * 0.09) * 0.25;
  const sx = shake * Math.sin(frame * 2.7);
  const sy = shake * Math.cos(frame * 3.1);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: origin,
        translate: `${x + hx + sx}px ${y + hy + sy}px`,
        scale: String(z + pz),
        rotate: `${r + hr + sx * 0.02}deg`,
      }}
    >
      {children}
    </div>
  );
};

// ---------- Dedo (toque estilo iOS) ----------
export type FingerKey = { f: number; x: number; y: number };

/** Toque na tela: move entre pontos, encolhe no clique, solta uma onda e toca o "tap". */
export const Finger: React.FC<{
  readonly path: FingerKey[];
  readonly taps: number[];
  readonly dark?: boolean;
  readonly volume?: number;
}> = ({ path, taps, dark = false, volume = 0.6 }) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p.f);
  const x = interpolate(frame, fs, path.map((p) => p.x), { ...CLAMP, easing: EASE_IN_OUT });
  const y = interpolate(frame, fs, path.map((p) => p.y), { ...CLAMP, easing: EASE_IN_OUT });
  const first = fs[0];
  const lastF = fs[fs.length - 1];
  const visible =
    interpolate(frame, [first, first + 6], [0, 1], CLAMP) *
    interpolate(frame, [lastF - 6, lastF], [1, 0], CLAMP);
  let press = 0;
  for (const t of taps) press = Math.max(press, interpolate(frame, [t - 3, t, t + 7], [0, 1, 0], CLAMP));
  return (
    <>
      {taps.map((t) => (
        <Sfx key={t} at={t} name="tap" volume={volume} />
      ))}
      {taps.map((t) => {
        const r = prog(frame, t, 16);
        if (frame < t || r >= 1) return null;
        const tx = interpolate(t, fs, path.map((p) => p.x), CLAMP);
        const ty = interpolate(t, fs, path.map((p) => p.y), CLAMP);
        return (
          <div
            key={`r${t}`}
            style={{
              position: "absolute",
              left: tx - 60,
              top: ty - 60,
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `4px solid ${dark ? "rgba(255,255,255,0.8)" : "rgba(10,132,255,0.6)"}`,
              scale: String(0.6 + r * 1.6),
              opacity: 1 - r,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: x - 44,
          top: y - 44,
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.22)",
          border: "4px solid rgba(255,255,255,0.95)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          opacity: visible,
          scale: String(1 - press * 0.22),
        }}
      />
    </>
  );
};

// ---------- Fundo com pontos em movimento ----------
export const BgDots: React.FC<{ readonly color?: string; readonly speed?: number }> = ({
  color = "rgba(0,0,0,0.07)",
  speed = 0.6,
}) => {
  const frame = useCurrentFrame();
  const off = (frame * speed) % 60;
  return (
    <div
      style={{
        position: "absolute",
        inset: -60,
        backgroundImage: `radial-gradient(${color} 3px, transparent 3.5px)`,
        backgroundSize: "60px 60px",
        backgroundPosition: `${off}px ${off * 0.5}px`,
      }}
    />
  );
};

/** Faíscas que explodem de um ponto (momentos de impacto). */
export const Sparkles: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly color?: string;
  readonly count?: number;
}> = ({ at, x, y, color = C.green, count = 12 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 22);
  if (frame < at || p >= 1) return null;
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + 0.3;
        const d = 60 + p * (160 + (i % 3) * 50);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d - 7,
              top: y + Math.sin(a) * d - 7,
              width: 14,
              height: 14,
              borderRadius: i % 2 ? "50%" : 3,
              background: color,
              opacity: 1 - p,
              scale: String(1 - p * 0.6),
            }}
          />
        );
      })}
    </>
  );
};
