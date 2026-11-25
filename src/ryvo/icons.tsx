import React from "react";
import { P } from "./theme";

type IconName =
  | "bulb"
  | "play"
  | "layers"
  | "megaphone"
  | "eye"
  | "heart"
  | "userPlus"
  | "trend"
  | "palette"
  | "print"
  | "whatsapp";

const PATHS: Record<IconName, React.ReactNode> = {
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  layers: (
    <>
      <path d="M12 3 2 8l10 5 10-5-10-5z" />
      <path d="M2 12.5l10 5 10-5" />
      <path d="M2 17l10 5 10-5" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4h3l7 4V6l-7 4H3z" />
      <path d="M16 9a3 3 0 0 1 0 6M18.5 6.5a7 7 0 0 1 0 11" />
    </>
  ),
  eye: (
    <>
      <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-9-8.8C1.6 7.9 3.8 5 6.9 5c1.9 0 3.2 1 5.1 2.9C13.9 6 15.2 5 17.1 5c3.1 0 5.3 2.9 3.9 6.2C19 15.6 12 20 12 20z" />
  ),
  userPlus: (
    <>
      <path d="M15 20a6 6 0 0 0-12 0" />
      <circle cx="9" cy="8" r="4" />
      <path d="M19 8v6M16 11h6" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.2-1.8-.5-1-.2-2.2 1.1-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z" />
      <circle cx="7.5" cy="11" r="1.2" fill="currentColor" />
      <circle cx="10.5" cy="7" r="1.2" fill="currentColor" />
      <circle cx="15" cy="7.5" r="1.2" fill="currentColor" />
    </>
  ),
  print: (
    <>
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <path d="M7 14h10v7H7z" />
    </>
  ),
  whatsapp: (
    <path
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z"
      fill="currentColor"
      stroke="none"
    />
  ),
};

export const Icon: React.FC<{ name: IconName; size: number; color?: string; stroke?: number }> = ({
  name,
  size,
  color = P.ice,
  stroke = 1.9,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color, display: "block" }}
  >
    {PATHS[name]}
  </svg>
);

/** Glossy 3D app-style tile (like the reference icons), violet or blue. */
export const Tile3D: React.FC<{
  size: number;
  children: React.ReactNode;
  variant?: "violet" | "blue" | "lavender";
  style?: React.CSSProperties;
}> = ({ size, children, variant = "violet", style }) => {
  const g =
    variant === "blue"
      ? `linear-gradient(150deg, #5AA8FF 0%, ${P.blue} 45%, #0550C8 100%)`
      : variant === "lavender"
        ? `linear-gradient(150deg, #D6C8FF 0%, ${P.lavender} 45%, #7E5FE6 100%)`
        : `linear-gradient(150deg, #A98BFF 0%, ${P.violet} 45%, #4A23B8 100%)`;
  const glow = variant === "blue" ? "rgba(8,123,255,0.5)" : "rgba(117,71,232,0.55)";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: g,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `inset 0 ${size * 0.03}px ${size * 0.04}px rgba(255,255,255,0.55), inset 0 -${size * 0.06}px ${size * 0.1}px rgba(20,0,80,0.35), 0 ${size * 0.12}px ${size * 0.3}px ${glow}`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          top: "5%",
          height: "42%",
          borderRadius: size * 0.22,
          background: "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0))",
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};
