import React from "react";
import { useCurrentFrame } from "remotion";

/** Anel fino girando — lembra a borda do selo */
export const Ring: React.FC<{
  size: number;
  color: string;
  speed?: number; // graus por frame (negativo = anti-horário)
  dash?: string;
  strokeWidth?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ size, color, speed = 0.6, dash, strokeWidth = 3, opacity = 1, style }) => {
  const frame = useCurrentFrame();
  const r = size / 2 - strokeWidth;
  return (
    <svg
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        rotate: `${frame * speed}deg`,
        opacity,
        ...style,
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    </svg>
  );
};

/** Par padrão de anéis (laranja e preto) girando em sentidos opostos */
export const RingPair: React.FC<{ size?: number; dark?: boolean; opacity?: number }> = ({
  size = 860,
  dark = false,
  opacity = 0.5,
}) => (
  <>
    <Ring size={size} color="#F26A1B" speed={0.5} dash="520 90 40 90" opacity={opacity} />
    <Ring
      size={size + 70}
      color={dark ? "#FAFAFA" : "#141414"}
      speed={-0.35}
      dash="300 60 900 120"
      opacity={opacity * 0.6}
    />
  </>
);
