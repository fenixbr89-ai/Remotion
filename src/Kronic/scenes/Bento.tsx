import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Line } from "../components";
import { ACCENT, C, clamp, EASE, fontFamily } from "../theme";

const ic = { fill: "none", stroke: C.ink, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const TILES: { big: React.ReactNode; label: string; accent?: boolean }[] = [
  { big: "99,9%", label: "de uptime", accent: true },
  {
    big: (
      <svg width="110" height="110" viewBox="0 0 24 24" {...ic}>
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    ),
    label: "Infraestrutura\nno Brasil",
  },
  {
    big: (
      <svg width="110" height="110" viewBox="0 0 24 24" {...ic}>
        <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
        <rect x="3" y="13" width="4" height="6" rx="1.5" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" />
      </svg>
    ),
    label: "Suporte técnico\npróximo",
  },
  {
    big: (
      <svg width="110" height="110" viewBox="0 0 24 24" {...ic}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </svg>
    ),
    label: "Alta\nperformance",
  },
];

// 5 — Gray. Bento grid of benefits.
export const Bento: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg color={C.gray} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <Line start={0} size={110}>Feita para</Line>
        <Line start={8} size={110} accent>performar.</Line>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 720 }}>
        <div style={{ display: "grid", gridTemplateColumns: "430px 430px", gap: 30 }}>
          {TILES.map((t, i) => {
            const s = 22 + i * 8;
            const p = interpolate(frame, [s, s + 30], [0, 1], { ...clamp, easing: EASE });
            return (
              <div
                key={t.label}
                style={{
                  height: 430,
                  borderRadius: 44,
                  background: C.white,
                  padding: 46,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  fontFamily,
                  opacity: p,
                  translate: `0px ${(1 - p) * 60}px`,
                  scale: String(0.96 + 0.04 * p),
                }}
              >
                <div
                  style={{
                    fontSize: 120,
                    fontWeight: 600,
                    letterSpacing: "-0.06em",
                    lineHeight: 1,
                    ...(t.accent
                      ? { backgroundImage: ACCENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                      : { color: C.ink }),
                  }}
                >
                  {t.big}
                </div>
                <div style={{ fontSize: 40, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.15, whiteSpace: "pre-line" }}>
                  {t.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
