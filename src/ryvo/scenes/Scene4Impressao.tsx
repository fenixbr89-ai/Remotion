import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bubble, Chips, Eyebrow, GlassTile, Headline, LogoMark, LogoText, useProgress } from "../components";
import { FONT } from "../theme";

const Card: React.FC<{ front?: boolean }> = ({ front }) => (
  <div
    style={{
      width: 420,
      height: 240,
      borderRadius: 18,
      padding: 32,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: front
        ? "linear-gradient(135deg, #7547E8 0%, #A78BFA 70%, #087BFF 140%)"
        : "linear-gradient(160deg, #F5F3FF 0%, #E4DEFF 100%)",
      boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(117,71,232,0.3), inset 0 1px 0 rgba(255,255,255,0.6)",
    }}
  >
    {front ? (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LogoMark height={44} white />
          <span style={{ fontFamily: "'Archivo Variable'", fontStretch: "125%", fontWeight: 800, fontSize: 40, letterSpacing: "0.1em", color: "#fff" }}>
            RYVO
          </span>
        </div>
        <span style={{ fontFamily: FONT, fontSize: 16, letterSpacing: "0.2em", color: "rgba(255,255,255,0.85)" }}>ESTÚDIO CRIATIVO</span>
      </>
    ) : (
      <>
        <LogoText size={26} style={{ background: "linear-gradient(90deg, #7547E8, #087BFF)", WebkitBackgroundClip: "text", backgroundClip: "text" }} />
        <div>
          <div style={{ height: 9, width: 180, borderRadius: 5, background: "rgba(117,71,232,0.45)" }} />
          <div style={{ height: 9, width: 130, borderRadius: 5, marginTop: 10, background: "rgba(117,71,232,0.25)" }} />
        </div>
      </>
    )}
  </div>
);

const Visual: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const poster = useProgress(0.2, 1.2);
  const c1 = useProgress(0.5, 1.0);
  const c2 = useProgress(0.65, 1.0);
  const bag = useProgress(0.8, 1.1);

  return (
    <div style={{ position: "absolute", left: 0, top: 820, width: 1080, height: 700 }}>
      {/* poster */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 10 + Math.sin(t * 0.8) * 10,
          width: 400,
          height: 566,
          borderRadius: 10,
          opacity: poster,
          transform: `perspective(1600px) rotateY(${20 + (1 - poster) * 40}deg) rotateZ(-5deg) translateY(${(1 - poster) * 140}px)`,
          background: "linear-gradient(170deg, #110E26 0%, #241868 55%, #7547E8 100%)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(117,71,232,0.3), inset 0 1px 0 rgba(245,243,255,0.25)",
          padding: 36,
          overflow: "hidden",
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 300, color: "#F5F3FF", letterSpacing: "-0.04em", lineHeight: 1 }}>Criatividade</div>
        <div style={{ fontFamily: FONT, fontSize: 58, fontWeight: 900, fontStyle: "italic", color: "#A78BFA", letterSpacing: "-0.06em", lineHeight: 1.05 }}>
          impressa.
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 120 + i * 60,
              top: 260 + i * 30,
              width: 200,
              height: 200,
              borderRadius: 56,
              transform: `rotate(${30 + i * 12}deg)`,
              background: `rgba(${167 - i * 25},${139 - i * 34},${250 - i * 9},0.3)`,
              border: "2px solid rgba(245,243,255,0.45)",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 36, bottom: 30 }}>
          <LogoText size={24} />
        </div>
      </div>

      {/* business cards */}
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 120 + Math.sin(t * 1.0 + 1) * 12,
          opacity: c2,
          transform: `perspective(1400px) rotateX(18deg) rotateY(-20deg) rotateZ(${10 + (1 - c2) * 20}deg) translateX(${(1 - c2) * 200}px)`,
        }}
      >
        <Card />
      </div>
      <div
        style={{
          position: "absolute",
          left: 480,
          top: 300 + Math.sin(t * 1.0 + 2) * 12,
          opacity: c1,
          transform: `perspective(1400px) rotateX(18deg) rotateY(-20deg) rotateZ(${-6 - (1 - c1) * 20}deg) translateX(${(1 - c1) * 200}px)`,
        }}
      >
        <Card front />
      </div>

      {/* sticker / tag */}
      <div
        style={{
          position: "absolute",
          left: 820,
          top: 520 + Math.sin(t * 1.2) * 10,
          width: 150,
          height: 150,
          borderRadius: 75,
          opacity: bag,
          transform: `scale(${0.6 + bag * 0.4}) rotate(${-10 + Math.sin(t * 1.5) * 6}deg)`,
          background: "linear-gradient(135deg, #087BFF, #7547E8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 40px rgba(8,123,255,0.45), inset 0 2px 0 rgba(255,255,255,0.5)",
          fontFamily: "'Archivo Variable'",
          fontStretch: "125%",
          fontWeight: 800,
          fontSize: 30,
          color: "#fff",
          letterSpacing: "0.08em",
        }}
      >
        <LogoMark height={64} white />
      </div>
    </div>
  );
};

export const Scene4Impressao: React.FC = () => (
  <AbsoluteFill>
    <GlassTile size={150} x={880} y={780} rx={25} ry={-35} rz={-12} tint={0.6} floatPhase={1} />
    <GlassTile size={110} x={30} y={1380} rx={-15} ry={30} rz={30} tint={0.4} blur={3} floatPhase={3} />
    <Bubble size={56} x={960} y={1300} phase={0.5} />
    <Visual />
    <div style={{ position: "absolute", left: 90, top: 230 }}>
      <Eyebrow n="03" label="IMPRESSOS" delay={0.1} />
      <div style={{ height: 34 }} />
      <Headline light="Design para" bold="Impressão." delay={0.2} lightSize={150} boldSize={170} />
      <div style={{ height: 30 }} />
      <Chips items={["Materiais gráficos", "Publicidade", "Comunicação visual"]} delay={0.7} />
    </div>
  </AbsoluteFill>
);
