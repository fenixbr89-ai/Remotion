import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../ThemeContext";
import { Bubble, Chips, Eyebrow, GlassTile, Headline, LogoMark, LogoText, useProgress } from "../components";
import { FONT } from "../theme";

/** Phone with a social post + identity board, fanned in 3D. */
const Visual: React.FC = () => {
  const frame = useCurrentFrame();
  const T = useTheme();
  const glass = T.glass;
  const t = frame / 30;
  const a = useProgress(0.2, 1.1);
  const b = useProgress(0.45, 1.1);
  const c = useProgress(0.7, 1.1);
  const swatches = ["#080812", "#7547E8", "#A78BFA", "#087BFF", "#F5F3FF"];
  const like = interpolate(frame, [60, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", left: 0, top: 820, width: 1080, height: 700 }}>
      {/* identity board (back left) */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 60 + Math.sin(t * 0.9) * 10,
          width: 420,
          height: 520,
          opacity: b,
          transform: `perspective(1600px) rotateY(${22 - (1 - b) * 30}deg) rotateZ(-6deg) translateX(${(1 - b) * -120}px)`,
          ...glass(0.2, 40),
          padding: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 22, letterSpacing: "0.18em", color: T.accentText, fontWeight: 600 }}>
          IDENTIDADE VISUAL
        </div>
        <div style={{ fontFamily: FONT, fontSize: 170, fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.06em", color: T.text, lineHeight: 1 }}>
          Aa
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {swatches.map((s, i) => (
            <div
              key={s}
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: s,
                border: `2px solid ${T.surfaceLine}`,
                transform: `scale(${interpolate(frame, [30 + i * 4, 42 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* phone with social post (front right) */}
      <div
        style={{
          position: "absolute",
          left: 500,
          top: 0 + Math.sin(t * 0.8 + 1) * 12,
          width: 400,
          height: 690,
          opacity: a,
          transform: `perspective(1600px) rotateY(${-18 + (1 - a) * 30}deg) rotateZ(5deg) translateY(${(1 - a) * 160}px)`,
          ...glass(0.3, 64),
          padding: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px 16px" }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: "#080812", border: "2px solid #A78BFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark height={18} />
          </div>
          <LogoText size={20} />
        </div>
        <div
          style={{
            height: 350,
            borderRadius: 30,
            background: "linear-gradient(160deg, #15122E 0%, #2B1B6E 55%, #7547E8 100%)",
            padding: 26,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 300, color: "#F5F3FF", letterSpacing: "-0.04em", lineHeight: 1 }}>
            Sua marca
          </div>
          <div style={{ fontFamily: FONT, fontSize: 46, fontWeight: 900, fontStyle: "italic", color: "#A78BFA", letterSpacing: "-0.06em", lineHeight: 1.05 }}>
            em movimento.
          </div>
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: -30,
              width: 200,
              height: 200,
              borderRadius: 60,
              transform: `rotate(${20 + t * 10}deg)`,
              background: "rgba(245,243,255,0.12)",
              border: "2px solid rgba(245,243,255,0.45)",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 18, padding: "18px 8px" }}>
          <svg width={40} height={40} viewBox="0 0 24 24" style={{ transform: `scale(${1 + like * 0.25 - like * like * 0.25})` }}>
            <path
              d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.3 5 6.6 5c2 0 3.4 1.1 5.4 3 2-1.9 3.4-3 5.4-3 3.3 0 5.6 3.3 4.1 6.8C19.5 16.4 12 21 12 21z"
              fill={like > 0.5 ? "#A78BFA" : "none"}
              stroke="#A78BFA"
              strokeWidth={1.8}
            />
          </svg>
          {[0.7, 0.45].map((w, i) => (
            <div key={i} style={{ flex: w, height: 14, borderRadius: 7, alignSelf: "center", background: "rgba(167,139,250,0.35)" }} />
          ))}
        </div>
        <div style={{ height: 12, width: "80%", borderRadius: 6, margin: "0 8px", background: "rgba(167,139,250,0.25)" }} />
        <div style={{ height: 12, width: "55%", borderRadius: 6, margin: "12px 8px", background: "rgba(167,139,250,0.18)" }} />
      </div>

      {/* floating colour card */}
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 470 + Math.sin(t * 1.1 + 2) * 14,
          opacity: c,
          transform: `scale(${0.7 + c * 0.3}) rotate(-8deg)`,
          padding: "18px 26px",
          fontFamily: FONT,
          fontSize: 24,
          fontWeight: 700,
          color: "#fff",
          borderRadius: 26,
          background: "linear-gradient(135deg,#7547E8,#087BFF)",
          boxShadow: "0 20px 40px rgba(117,71,232,0.5), inset 0 2px 0 rgba(255,255,255,0.4)",
        }}
      >
        #7547E8
      </div>
    </div>
  );
};

export const Scene3Grafico: React.FC = () => (
  <AbsoluteFill>
    <GlassTile size={130} x={900} y={1400} rx={20} ry={-30} rz={20} tint={0.5} floatPhase={2} />
    <Bubble size={60} x={60} y={1440} phase={2} />
    <Visual />
    <div style={{ position: "absolute", left: 90, top: 230 }}>
      <Eyebrow n="02" label="DESIGN GRÁFICO" delay={0.1} />
      <div style={{ height: 34 }} />
      <Headline light="Design" bold="Gráfico." delay={0.2} lightSize={150} boldSize={170} />
      <div style={{ height: 30 }} />
      <Chips items={["Identidade Visual", "Social Media", "Conteúdo Digital"]} delay={0.7} />
    </div>
  </AbsoluteFill>
);
