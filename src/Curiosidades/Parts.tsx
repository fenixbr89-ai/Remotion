import React, { useId } from "react";
import { cleanId, fontFamily, C } from "./theme";

/** Titanium screw, centered at x=0, top at y=0. */
export const Screw: React.FC<{ len?: number; phase?: number }> = ({ len = 400, phase = 0 }) => {
  const id = cleanId(useId());
  const topW = 54;
  const botW = 38;
  const wAt = (y: number) => topW + (botW - topW) * (y / len);
  const pitch = 34;
  const threads: React.ReactNode[] = [];
  const off = ((phase % 1) + 1) % 1;
  for (let i = -1; i < len / pitch + 1; i++) {
    const y = 34 + (i + off) * pitch;
    if (y < 26 || y > len - 46) continue;
    const w = wAt(y) + 12;
    threads.push(
      <path
        key={i}
        d={`M${-w} ${y} L${w} ${y + 13}`}
        stroke={`url(#${id}-th)`}
        strokeWidth={13}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4b5563" />
          <stop offset="0.3" stopColor="#eef2f6" />
          <stop offset="0.55" stopColor="#a9b3be" />
          <stop offset="1" stopColor="#3f4955" />
        </linearGradient>
        <linearGradient id={`${id}-th`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#566270" />
          <stop offset="0.32" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#b8c1cb" />
          <stop offset="1" stopColor="#4a5461" />
        </linearGradient>
      </defs>
      <path
        d={`M${-topW} 0 L${topW} 0 L${botW} ${len - 50} Q0 ${len + 14} ${-botW} ${len - 50} Z`}
        fill={`url(#${id}-b)`}
      />
      {threads}
      <rect x={-topW - 4} y={-10} width={(topW + 4) * 2} height={30} rx={8} fill={`url(#${id}-b)`} />
      <rect x={-18} y={-12} width={36} height={10} rx={3} fill="#2f3741" />
      <rect x={-topW * 0.55} y={30} width={10} height={len - 110} rx={5} fill="#fff" opacity={0.45} />
    </g>
  );
};

/** Abutment centered at x=0, top at y=0, height ~90 */
export const Abutment: React.FC = () => {
  const id = cleanId(useId());
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b7280" />
          <stop offset="0.32" stopColor="#f8fafc" />
          <stop offset="0.6" stopColor="#c4ccd5" />
          <stop offset="1" stopColor="#5b6470" />
        </linearGradient>
      </defs>
      <path d="M-34 0 Q0 -10 34 0 L46 70 L58 78 L58 92 L-58 92 L-58 78 L-46 70 Z" fill={`url(#${id}-a)`} />
      <rect x={-22} y={8} width={8} height={56} rx={4} fill="#fff" opacity={0.6} />
    </g>
  );
};

/** label pill with leader line, all in SVG */
export const SvgLabel: React.FC<{
  x: number;
  y: number;
  tx: number;
  ty: number;
  text: string;
  dark?: boolean;
  size?: number;
  center?: boolean;
  sub?: string;
}> = ({ x, y, tx, ty, text, dark, size = 34, center, sub }) => {
  const subSize = size * 0.8;
  const w = Math.max(text.length * size * 0.62, (sub?.length ?? 0) * subSize * 0.56) + 64;
  const h = sub ? size * 3.3 : size * 1.9;
  const left = tx >= x;
  const px = center ? tx - w / 2 : left ? tx : tx - w;
  return (
    <g>
      <path d={`M${x} ${y} L${tx} ${ty}`} stroke={dark ? "#ffffff" : C.ink} strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
      <circle cx={x} cy={y} r={10} fill={C.accent} stroke="#fff" strokeWidth={4} />
      <rect x={px} y={ty - h / 2} width={w} height={h} rx={sub ? 30 : h / 2} fill={dark ? "#ffffff" : C.ink} />
      {sub ? (
        <text
          x={px + w / 2}
          y={ty + size * 1.05}
          textAnchor="middle"
          fontFamily={fontFamily}
          fontWeight={500}
          fontSize={subSize}
          fill={dark ? C.ink : "#fff"}
          opacity={0.85}
        >
          {sub}
        </text>
      ) : null}
      <text
        x={px + w / 2}
        y={ty + size * (sub ? -0.25 : 0.36)}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontWeight={700}
        fontSize={size}
        fill={dark ? C.ink : "#fff"}
      >
        {text}
      </text>
    </g>
  );
};

/** Chewing-force arrow pointing down, tip at (x, y). */
export const ForceArrow: React.FC<{ x: number; y: number; len?: number; opacity?: number }> = ({
  x,
  y,
  len = 110,
  opacity = 1,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <path
      d={`M-15 ${-len} L15 ${-len} L15 -46 L36 -46 L0 0 L-36 -46 L-15 -46 Z`}
      fill={C.accent}
      stroke="#fff"
      strokeWidth={6}
      strokeLinejoin="round"
    />
  </g>
);

/** Concentric "stimulus" rings. */
export const Pulses: React.FC<{ x: number; y: number; rx: number; ry: number; n?: number; color?: string; opacity?: number }> = ({
  x,
  y,
  rx,
  ry,
  n = 3,
  color = C.accent,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    {new Array(n).fill(0).map((_, i) => (
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={rx + i * 34}
        ry={ry + i * 40}
        fill="none"
        stroke={color}
        strokeWidth={7 - i * 1.5}
        opacity={0.75 - i * 0.22}
      />
    ))}
  </g>
);

/** Cute osteoclast cell nibbling bone. */
export const Osteoclast: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => {
  const id = cleanId(useId());
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        <radialGradient id={`${id}-o`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffe3f0" />
          <stop offset="0.55" stopColor="#f7a8c8" />
          <stop offset="1" stopColor="#d97aa6" />
        </radialGradient>
      </defs>
      <path
        d="M-52 4 C-58 -38 -14 -56 18 -46 C52 -36 64 -8 56 14 C62 30 44 50 18 50 C-6 60 -40 52 -50 32 C-62 26 -60 12 -52 4 Z"
        fill={`url(#${id}-o)`}
      />
      <ellipse cx={-22} cy={-30} rx={14} ry={7} fill="#fff" opacity={0.8} transform="rotate(-20 -22 -30)" />
      <ellipse cx={-6} cy={-6} rx={9} ry={11} fill="#fff" />
      <ellipse cx={20} cy={-6} rx={9} ry={11} fill="#fff" />
      <circle cx={-3} cy={-4} r={5.5} fill="#3a1d28" />
      <circle cx={23} cy={-4} r={5.5} fill="#3a1d28" />
      <circle cx={-5} cy={-7} r={2} fill="#fff" />
      <circle cx={21} cy={-7} r={2} fill="#fff" />
      <path d="M30 18 Q48 22 50 32 Q36 40 22 30 Z" fill="#8a2c4a" />
      <circle cx={66} cy={26} r={7} fill={C.bone} stroke={C.boneDeep} strokeWidth={2} />
      <circle cx={78} cy={8} r={5} fill={C.bone} stroke={C.boneDeep} strokeWidth={2} />
      <circle cx={74} cy={44} r={4} fill={C.bone} stroke={C.boneDeep} strokeWidth={2} />
    </g>
  );
};
