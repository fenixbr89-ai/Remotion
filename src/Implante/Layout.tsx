import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily } from "./theme";

export const Background: React.FC<{ dark?: boolean; glowY?: number }> = ({ dark, glowY = 62 }) => (
  <AbsoluteFill
    style={{
      background: dark
        ? `radial-gradient(ellipse 85% 45% at 50% ${glowY}%, rgba(34,197,94,0.42) 0%, rgba(21,128,61,0.18) 40%, rgba(7,18,12,0) 75%), linear-gradient(180deg, #0a1a12 0%, ${C.dark} 100%)`
        : `radial-gradient(ellipse 90% 50% at 50% ${glowY}%, #ffffff 0%, #eefaf3 45%, #dff3e7 100%)`,
    }}
  />
);

export const LogoCorner: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div
    style={{
      position: "absolute",
      top: 70,
      left: 70,
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontFamily,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 1,
      color: dark ? "#fff" : C.ink,
      opacity: 0.9,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        background: C.green,
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg viewBox="0 0 200 200" width={34} height={34}>
        <path
          d="M30 40 C30 10 70 5 100 22 C130 5 170 10 170 40 C175 90 165 130 160 150 C155 190 150 245 130 250 C115 252 112 185 100 170 C88 185 85 252 70 250 C50 245 45 190 40 150 C35 130 25 90 30 40 Z"
          transform="translate(0 -20) scale(1 0.85)"
          fill="#fff"
        />
      </svg>
    </div>
    SUA CLÍNICA
  </div>
);

export const StepChip: React.FC<{ n: number; total?: number; dark?: boolean }> = ({ n, total = 6, dark }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 30px 14px 16px",
      borderRadius: 999,
      background: dark ? "rgba(255,255,255,0.1)" : "#fff",
      boxShadow: dark ? "none" : "0 10px 30px rgba(15,60,35,0.12)",
      fontFamily,
      fontWeight: 700,
      fontSize: 32,
      color: dark ? "#fff" : C.ink,
    }}
  >
    <span
      style={{
        width: 50,
        height: 50,
        borderRadius: 999,
        background: C.green,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontSize: 28,
      }}
    >
      {n}
    </span>
    PASSO {n} DE {total}
  </div>
);

/** Title: lines of text, words wrapped in *asterisks* are the keyword. */
export const Title: React.FC<{ lines: string[]; dark?: boolean; size?: number; align?: "center" | "left" }> = ({
  lines,
  dark,
  size = 96,
  align = "center",
}) => (
  <div
    style={{
      fontFamily,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: -2,
      textAlign: align,
      color: dark ? "#fff" : C.ink,
    }}
  >
    {lines.map((line, i) => (
      <div key={i}>
        {line.split(/(\*[^*]+\*)/).map((part, j) => {
          if (part.startsWith("*")) {
            const t = part.slice(1, -1);
            return dark ? (
              <span key={j} style={{ color: C.green }}>
                {t}
              </span>
            ) : (
              <span key={j} style={{ position: "relative", display: "inline-block" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -8,
                    right: -8,
                    bottom: size * 0.06,
                    height: size * 0.42,
                    background: C.green,
                    opacity: 0.45,
                    borderRadius: 10,
                  }}
                />
                <span style={{ position: "relative" }}>{t}</span>
              </span>
            );
          }
          return <span key={j}>{part}</span>;
        })}
      </div>
    ))}
  </div>
);

export const Scene: React.FC<{
  dark?: boolean;
  glowY?: number;
  children: React.ReactNode;
}> = ({ dark, glowY, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Background dark={dark} glowY={glowY} />
    {children}
    <LogoCorner dark={dark} />
  </AbsoluteFill>
);

export const Top: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 190 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 60,
      right: 60,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 34,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }> = ({
  children,
  style,
  dark,
}) => (
  <div
    style={{
      position: "absolute",
      background: dark ? "#13261b" : "#fff",
      borderRadius: 36,
      boxShadow: "0 30px 60px rgba(10,40,25,0.22), 0 6px 14px rgba(10,40,25,0.12)",
      padding: "26px 34px",
      fontFamily,
      color: dark ? "#fff" : C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);
