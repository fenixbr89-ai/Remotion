import React, { useId } from "react";
import { cleanId } from "./theme";

export type Mood = "happy" | "sad" | "worried" | "wow" | "wink" | "calm";

export const toothPath = (R = 100) => {
  const b = 150;
  return `M30 40 C30 10 70 5 100 22 C130 5 170 10 170 40 C175 90 165 130 160 150 C155 ${b + 0.4 * R} 150 ${b + 0.95 * R} 130 ${b + R} C115 ${b + R + 2} 112 ${b + 0.35 * R} 100 ${b + 0.2 * R} C88 ${b + 0.35 * R} 85 ${b + R + 2} 70 ${b + R} C50 ${b + 0.95 * R} 45 ${b + 0.4 * R} 40 150 C35 130 25 90 30 40 Z`;
};

export const crownPath =
  "M30 40 C30 10 70 5 100 22 C130 5 170 10 170 40 C174 90 166 140 160 162 Q100 176 40 162 C34 140 26 90 30 40 Z";

const Eye: React.FC<{ x: number; y: number; wink?: boolean; look?: number }> = ({
  x,
  y,
  wink,
  look = 0,
}) => {
  if (wink) {
    return (
      <path
        d={`M${x - 13} ${y + 2} Q${x} ${y - 12} ${x + 13} ${y + 2}`}
        stroke="#2b1d16"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  return (
    <g>
      <ellipse cx={x} cy={y} rx={15} ry={18} fill="#fff" />
      <ellipse cx={x} cy={y} rx={15} ry={18} fill="none" stroke="#c9d3df" strokeWidth={1.5} />
      <circle cx={x + look} cy={y + 2} r={10.5} fill="#3a2a1f" />
      <circle cx={x + look} cy={y + 2} r={6} fill="#120b07" />
      <circle cx={x + look - 4} cy={y - 3} r={4} fill="#fff" />
      <circle cx={x + look + 4} cy={y + 6} r={1.8} fill="#fff" />
    </g>
  );
};

const Face: React.FC<{ mood: Mood; look?: number; id: string }> = ({ mood, look = 0, id }) => {
  const mouth = (() => {
    switch (mood) {
      case "happy":
      case "wink":
        return (
          <g>
            <path d="M76 106 Q100 146 124 106 Q100 114 76 106 Z" fill="#7a2232" />
            <ellipse cx={100} cy={127} rx={11} ry={6} fill="#ff8fa3" />
          </g>
        );
      case "calm":
        return (
          <path d="M84 112 Q100 126 116 112" stroke="#7a2232" strokeWidth={5} fill="none" strokeLinecap="round" />
        );
      case "sad":
        return (
          <path d="M84 126 Q100 110 116 126" stroke="#7a2232" strokeWidth={5} fill="none" strokeLinecap="round" />
        );
      case "worried":
        return (
          <path
            d="M82 120 Q91 113 100 120 Q109 127 118 120"
            stroke="#7a2232"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        );
      case "wow":
        return <ellipse cx={100} cy={120} rx={10} ry={13} fill="#7a2232" />;
    }
  })();
  const brows =
    mood === "sad" || mood === "worried" ? (
      <g stroke="#6b5444" strokeWidth={4.5} strokeLinecap="round" fill="none">
        <path d="M62 56 Q72 50 84 56" transform="rotate(14 73 54)" />
        <path d="M116 56 Q128 50 138 56" transform="rotate(-14 127 54)" />
      </g>
    ) : mood === "wow" ? (
      <g stroke="#6b5444" strokeWidth={4.5} strokeLinecap="round" fill="none">
        <path d="M62 50 Q73 42 84 50" />
        <path d="M116 50 Q127 42 138 50" />
      </g>
    ) : null;
  return (
    <g>
      <ellipse cx={60} cy={104} rx={13} ry={8} fill="#ff8fa3" opacity={0.55} filter={`url(#${id}-soft)`} />
      <ellipse cx={140} cy={104} rx={13} ry={8} fill="#ff8fa3" opacity={0.55} filter={`url(#${id}-soft)`} />
      {brows}
      <Eye x={77} y={80} look={look} wink={mood === "wink"} />
      <Eye x={123} y={80} look={look} />
      {mouth}
      {mood === "sad" ? <path d="M136 96 Q142 108 136 112 Q130 108 136 96 Z" fill="#7cc4ff" /> : null}
    </g>
  );
};

/** SVG <g> of a cute tooth, in a 200-wide coordinate box. */
export const ToothG: React.FC<{
  mood?: Mood;
  rootLen?: number;
  crownOnly?: boolean;
  face?: boolean;
  look?: number;
  xray?: boolean;
  /** upper-jaw tooth: body flipped (roots up), face stays upright */
  flip?: boolean;
}> = ({ mood = "happy", rootLen = 100, crownOnly, face = true, look = 0, xray, flip }) => {
  const id = cleanId(useId());
  const d = crownOnly ? crownPath : toothPath(rootLen);
  if (xray) {
    return (
      <g>
        <defs>
          <linearGradient id={`${id}-x`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity={0.95} />
            <stop offset="0.45" stopColor="#dbeafe" stopOpacity={0.7} />
            <stop offset="1" stopColor="#93c5fd" stopOpacity={0.25} />
          </linearGradient>
        </defs>
        <path d={d} fill={`url(#${id}-x)`} stroke="#e0f2fe" strokeOpacity={0.5} strokeWidth={3} />
      </g>
    );
  }
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-g`} cx="0.36" cy="0.2" r="0.95">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#f5f8fc" />
          <stop offset="0.78" stopColor="#d9e2ee" />
          <stop offset="1" stopColor="#aebdd0" />
        </radialGradient>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="0.6" stopColor="#c8a77a" stopOpacity={0} />
          <stop offset="1" stopColor="#c8a77a" stopOpacity={crownOnly ? 0 : 0.45} />
        </linearGradient>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={3} />
        </filter>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
      </defs>
      <g transform={flip ? `translate(0 ${155 + rootLen}) scale(1 -1)` : undefined}>
      <path d={d} fill={`url(#${id}-g)`} />
      <path d={d} fill={`url(#${id}-r)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* bounce light from below + core shadow on the right */}
        <ellipse cx={175} cy={110} rx={40} ry={120} fill="#8fa3bd" opacity={0.35} filter={`url(#${id}-blur)`} />
        <ellipse cx={100} cy={crownOnly ? 175 : 165} rx={90} ry={14} fill="#bfe8cf" opacity={0.35} filter={`url(#${id}-blur)`} />
      </g>
      <ellipse
        cx={66}
        cy={38}
        rx={24}
        ry={11}
        transform="rotate(-24 66 38)"
        fill="#fff"
        opacity={0.95}
        filter={`url(#${id}-soft)`}
      />
      <ellipse cx={142} cy={30} rx={9} ry={5} transform="rotate(20 142 30)" fill="#fff" opacity={0.8} />
      </g>
      {face ? (
        <g transform={flip ? `translate(0 ${rootLen - 15})` : undefined}>
          <Face mood={mood} look={look} id={id} />
        </g>
      ) : null}
    </g>
  );
};

/** Standalone HTML-placeable tooth character with a contact shadow. */
export const Tooth: React.FC<{
  size: number;
  mood?: Mood;
  rootLen?: number;
  crownOnly?: boolean;
  face?: boolean;
  look?: number;
  style?: React.CSSProperties;
  shadow?: boolean;
}> = ({ size, rootLen = 100, crownOnly, shadow = true, style, ...rest }) => {
  const h = crownOnly ? 200 : 150 + rootLen + 30;
  return (
    <div style={{ position: "relative", width: size, height: (size * h) / 200, ...style }}>
      {shadow ? (
        <div
          style={{
            position: "absolute",
            left: "15%",
            right: "15%",
            bottom: -size * 0.04,
            height: size * 0.12,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.28)",
            filter: `blur(${size * 0.05}px)`,
          }}
        />
      ) : null}
      <svg viewBox={`0 -5 200 ${h}`} width={size} height={(size * h) / 200} style={{ position: "relative", overflow: "visible" }}>
        <ToothG rootLen={rootLen} crownOnly={crownOnly} {...rest} />
      </svg>
    </div>
  );
};

export const Sparkle: React.FC<{ x: number; y: number; s: number; color?: string; opacity?: number }> = ({
  x,
  y,
  s,
  color = "#fff",
  opacity = 1,
}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 -20 C2 -6 6 -2 20 0 C6 2 2 6 0 20 C-2 6 -6 2 -20 0 C-6 -2 -2 -6 0 -20 Z"
    fill={color}
    opacity={opacity}
  />
);
