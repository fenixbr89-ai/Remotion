import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { enter } from "./anim";
import { COLORS, FONT_BODY, FONT_TITLE } from "../theme";

/** Cápsula com texto, entra com spring + blur */
export const Pill: React.FC<{
  label: string;
  delay?: number;
  bg?: string;
  color?: string;
  fontSize?: number;
  variant?: "title" | "body";
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  label,
  delay = 0,
  bg = COLORS.orange,
  color = COLORS.white,
  fontSize = 72,
  variant = "title",
  icon,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = enter(frame, fps, delay);
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });
  return (
    <div
      style={{
        ...e.style,
        scale: `${0.7 + 0.3 * pop}`,
        display: "inline-flex",
        alignItems: "center",
        gap: fontSize * 0.35,
        background: bg,
        color,
        borderRadius: 999,
        padding: `${fontSize * 0.28}px ${fontSize * 0.6}px`,
        fontFamily: variant === "title" ? FONT_TITLE : FONT_BODY,
        fontWeight: variant === "title" ? 700 : 600,
        fontSize,
        lineHeight: 1.05,
        textTransform: variant === "title" ? "uppercase" : undefined,
        whiteSpace: "nowrap",
        boxShadow: "0 18px 40px rgba(20,20,20,0.18)",
        ...style,
      }}
    >
      {icon}
      {label}
    </div>
  );
};
