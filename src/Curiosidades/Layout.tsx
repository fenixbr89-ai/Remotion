import React, { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";
import { Bg, C, fontFamily } from "./theme";

const BgCtx = createContext<Bg>("white");
export const useBg = () => useContext(BgCtx);

const BG: Record<Bg, string> = {
  white: "radial-gradient(ellipse 90% 55% at 50% 60%, #ffffff 0%, #fffdf8 50%, #fff3ea 100%)",
  yellow: "radial-gradient(ellipse 90% 55% at 50% 60%, #fffdf2 0%, #fff4cf 55%, #ffeaa8 100%)",
  pink: "radial-gradient(ellipse 90% 55% at 50% 60%, #fff6f9 0%, #ffe1eb 55%, #ffcadb 100%)",
};

/** marker colour behind keywords depends on the background */
const MARK: Record<Bg, string> = { white: "#ffc2d6", yellow: "#ffb8cf", pink: "#ffe27a" };

export const SeriesTag: React.FC = () => (
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
      fontSize: 28,
      letterSpacing: 1.5,
      color: C.ink,
      opacity: 0.85,
    }}
  >
    <div style={{ width: 48, height: 48, borderRadius: 16, background: C.accent, display: "grid", placeItems: "center" }}>
      <svg viewBox="0 0 200 200" width={30} height={30}>
        <path
          d="M30 40 C30 10 70 5 100 22 C130 5 170 10 170 40 C175 90 165 130 160 150 C155 190 150 245 130 250 C115 252 112 185 100 170 C88 185 85 252 70 250 C50 245 45 190 40 150 C35 130 25 90 30 40 Z"
          transform="translate(0 -20) scale(1 0.85)"
          fill="#fff"
        />
      </svg>
    </div>
    CURIOSIDADES DE ODONTO
  </div>
);

export const Chip: React.FC<{ n: number }> = ({ n }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 30px 12px 14px",
      borderRadius: 999,
      background: "#fff",
      boxShadow: "0 10px 30px rgba(170,70,110,0.14)",
      fontFamily,
      fontWeight: 700,
      fontSize: 30,
      color: C.ink,
    }}
  >
    <span
      style={{
        width: 48,
        height: 48,
        borderRadius: 999,
        background: C.accent,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontSize: 26,
      }}
    >
      {n}
    </span>
    CURIOSIDADE #{n}
  </div>
);

/** Title: lines of text, words wrapped in *asterisks* get a marker underline. */
export const Title: React.FC<{ lines: string[]; size?: number }> = ({ lines, size = 96 }) => {
  const bg = useBg();
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: -2,
        textAlign: "center",
        color: C.ink,
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>
          {line.split(/(\*[^*]+\*)/).map((part, j) =>
            part.startsWith("*") ? (
              <span key={j} style={{ position: "relative", display: "inline-block" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -10,
                    right: -10,
                    bottom: size * 0.05,
                    height: size * 0.45,
                    background: MARK[bg],
                    borderRadius: 14,
                  }}
                />
                <span style={{ position: "relative" }}>{part.slice(1, -1)}</span>
              </span>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

export const Small: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      fontFamily,
      fontWeight: 500,
      fontSize: 38,
      lineHeight: 1.35,
      textAlign: "center",
      color: C.inkSoft,
      whiteSpace: "pre-line",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Scene: React.FC<{ bg: Bg; children: React.ReactNode }> = ({ bg, children }) => (
  <BgCtx.Provider value={bg}>
    <AbsoluteFill style={{ overflow: "hidden", background: BG[bg] }}>
      {children}
      <SeriesTag />
    </AbsoluteFill>
  </BgCtx.Provider>
);

export const Top: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 180 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 60,
      right: 60,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 30,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      background: "#fff",
      borderRadius: 36,
      boxShadow: "0 30px 60px rgba(170,70,110,0.16), 0 6px 14px rgba(170,70,110,0.1)",
      padding: "26px 34px",
      fontFamily,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);
