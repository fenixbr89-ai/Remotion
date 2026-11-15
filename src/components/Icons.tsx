import React from "react";
import { COLORS } from "../theme";

const K = COLORS.black;
const O = COLORS.orange;

/** Mão apontando (cursor) */
export const HandIcon: React.FC<{ size?: number }> = ({ size = 160 }) => {
  const shapes = (
    <>
      <rect x={34} y={4} width={20} height={70} rx={10} />
      <rect x={52} y={40} width={18} height={44} rx={9} />
      <rect x={68} y={46} width={18} height={40} rx={9} />
      <rect x={84} y={54} width={16} height={34} rx={8} />
      <rect x={30} y={60} width={70} height={60} rx={22} />
      <rect x={6} y={58} width={18} height={44} rx={9} transform="rotate(-35 15 80)" />
    </>
  );
  return (
    <svg width={size} height={size * 1.25} viewBox="-4 -4 112 132">
      <g fill={K} stroke={K} strokeWidth={9} strokeLinejoin="round">
        {shapes}
      </g>
      <g fill="#fff">{shapes}</g>
    </svg>
  );
};

export const HelmetIcon: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M18 66 C 18 36, 82 36, 82 66 Z" fill={O} />
    <rect x={44} y={30} width={12} height={22} rx={4} fill={K} />
    <rect x={8} y={64} width={84} height={12} rx={6} fill={K} />
  </svg>
);

export const HarnessIcon: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {/* mosquetão */}
    <rect
      x={30}
      y={14}
      width={40}
      height={72}
      rx={20}
      fill="none"
      stroke={K}
      strokeWidth={10}
      transform="rotate(20 50 50)"
    />
    <rect x={56} y={30} width={10} height={30} rx={4} fill={O} transform="rotate(20 50 50)" />
  </svg>
);

export const BrushIcon: React.FC<{ size?: number }> = ({ size = 260 }) => (
  <svg width={size * 0.5} height={size} viewBox="0 0 100 200">
    <path d="M14 8 L86 8 L82 70 L18 70 Z" fill={K} />
    {[22, 34, 46, 58, 70].map((x) => (
      <rect key={x} x={x} y={0} width={6} height={20} fill={K} />
    ))}
    <rect x={16} y={68} width={68} height={22} rx={4} fill={O} />
    <path d="M30 90 L70 90 L62 130 L58 190 Q50 198 42 190 L38 130 Z" fill={K} />
    <circle cx={50} cy={180} r={4} fill={COLORS.white} />
  </svg>
);

export const WhatsIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 90,
  color = "#fff",
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 8 A42 42 0 1 1 24 84 L8 92 L16 76 A42 42 0 0 1 50 8 Z"
      fill="none"
      stroke={color}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path
      d="M36 30 C 32 30, 28 36, 30 44 C 34 58, 46 70, 60 72 C 68 73, 72 68, 72 64 L 64 58 L 58 62 C 50 58, 44 52, 40 44 L 44 38 Z"
      fill={color}
    />
  </svg>
);

export const Sparkle: React.FC<{ size?: number; color?: string }> = ({
  size = 60,
  color = O,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 0 C 54 38, 62 46, 100 50 C 62 54, 54 62, 50 100 C 46 62, 38 54, 0 50 C 38 46, 46 38, 50 0 Z" fill={color} />
  </svg>
);
