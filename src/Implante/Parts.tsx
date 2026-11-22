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
}> = ({ x, y, tx, ty, text, dark, size = 34 }) => {
  const w = text.length * size * 0.58 + 56;
  const h = size * 1.9;
  const left = tx >= x;
  const px = left ? tx : tx - w;
  return (
    <g>
      <path d={`M${x} ${y} L${tx} ${ty}`} stroke={dark ? "#ffffff" : C.ink} strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
      <circle cx={x} cy={y} r={10} fill={C.green} stroke="#fff" strokeWidth={4} />
      <rect x={px} y={ty - h / 2} width={w} height={h} rx={h / 2} fill={dark ? "#ffffff" : C.ink} />
      <text
        x={px + w / 2}
        y={ty + size * 0.36}
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
