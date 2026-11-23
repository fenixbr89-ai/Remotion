import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { HANDLE, K, TOPIC, mono, sans } from "./theme";

/** floating dust */
export const Dust: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(26).fill(0).map((_, i) => {
        const x = random(`dx${i}`) * 1080;
        const y = (random(`dy${i}`) * 1920 - f * (0.3 + random(`ds${i}`) * 0.5) + 1920) % 1920;
        const r = 2 + random(`dr${i}`) * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin((f + i * 30) / 40) * 10,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: 99,
              background: K.pink,
              opacity: 0.12 + random(`do${i}`) * 0.25,
              filter: r > 4 ? "blur(1.5px)" : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Header: React.FC<{ section: string }> = ({ section }) => (
  <>
    <div style={{ position: "absolute", top: 200, left: 70, fontFamily: mono, fontWeight: 500, fontSize: 26, letterSpacing: 7, color: "rgba(255,255,255,0.55)" }}>
      {TOPIC}
    </div>
    <div
      style={{
        position: "absolute",
        top: 244,
        left: 70,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 26px 12px 18px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.07)",
        fontFamily: mono,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 3,
        color: "#fff",
      }}
    >
      <span style={{ width: 22, height: 22, borderRadius: 99, background: K.pink }} />
      {section}
    </div>
    <div style={{ position: "absolute", top: 206, right: 70, fontFamily: mono, fontWeight: 500, fontSize: 24, letterSpacing: 2, color: "rgba(255,255,255,0.45)" }}>
      {HANDLE}
    </div>
  </>
);

/** Karaoke caption: spoken words in pink, the rest grey. */
export const Caption: React.FC<{ words: string[]; spoken: number; strong?: number[] }> = ({ words, spoken, strong = [] }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 1430, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        padding: "0 10px",
        fontFamily: sans,
        fontWeight: 800,
        fontSize: 74,
        letterSpacing: -1.5,
        lineHeight: 1.12,
        textAlign: "center",
      }}
    >
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 ? " " : null}
          <span style={{ color: i < spoken ? (strong.includes(i) ? K.ink : K.pinkDeep) : "rgba(43,35,38,0.25)" }}>{w}</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

/** Label tag. neon = pink outline + pink text; otherwise dark box with white text. */
export const Tag: React.FC<{ text: string; sub?: string; x: number; y: number; neon?: boolean; big?: boolean }> = ({ text, sub, x, y, neon, big }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", textAlign: "center" }}>
    <div
      style={{
        display: "inline-block",
        padding: big ? "10px 26px" : "10px 24px",
        borderRadius: 12,
        background: "#ffffff",
        border: neon ? `3px solid ${K.pink}` : "none",
        boxShadow: "0 8px 20px rgba(120,60,80,0.10)",
        fontFamily: sans,
        fontWeight: 800,
        fontSize: big ? 84 : 42,
        letterSpacing: big ? -2 : 0.5,
        color: neon ? K.pinkDeep : K.ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
    {sub ? (
      <div style={{ marginTop: 8, fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: "rgba(43,35,38,0.5)" }}>{sub}</div>
    ) : null}
  </div>
);

export const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 42%, #ffffff 0%, ${K.bg} 60%, #f6e6ec 100%)`, overflow: "hidden" }}>
    {children}
  </AbsoluteFill>
);
