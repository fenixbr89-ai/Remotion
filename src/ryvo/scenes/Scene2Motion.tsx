import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bubble, Chips, Eyebrow, GlassTile, Headline, glass, useProgress } from "../components";
import { C, FONT } from "../theme";

const PlayIcon: React.FC<{ size: number; color?: string }> = ({ size, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M8 5.5v13l10.5-6.5z" fill={color} />
  </svg>
);

/** Floating 3D glass "editor" interface. */
const MotionInterface: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const enter = useProgress(0.15, 1.2);
  const ry = interpolate(enter, [0, 1], [-42, -16]) + Math.sin(t * 0.8) * 3;
  const rx = 14 + Math.cos(t * 0.7) * 2;
  const play = interpolate(frame, [20, 160], [0.08, 0.86], { extrapolateRight: "clamp" });

  const tracks = [
    { c1: "#7547E8", c2: "#A78BFA", clips: [[0, 0.28], [0.32, 0.62], [0.66, 0.95]] },
    { c1: "#087BFF", c2: "#4FA3FF", clips: [[0.06, 0.4], [0.46, 0.84]] },
    { c1: "#A78BFA", c2: "#F5F3FF", clips: [[0, 0.18], [0.22, 0.52], [0.58, 0.74], [0.78, 1]] },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 870,
        width: 860,
        height: 600,
        transform: `perspective(1800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${(1 - enter) * 140 + Math.sin(t) * 10}px)`,
        opacity: enter,
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ position: "absolute", inset: 0, ...glass(0.25, 44), padding: 32 }}>
        {/* window dots */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {["#7547E8", "#A78BFA", "#087BFF"].map((c) => (
            <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          {/* preview */}
          <div
            style={{
              flex: 1,
              height: 290,
              borderRadius: 26,
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, #080812 0%, #7547E8 55%, #A78BFA 100%)",
              boxShadow: "inset 0 2px 0 rgba(255,255,255,0.4)",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 170,
                  height: 170,
                  borderRadius: 48,
                  left: 60 + i * 120,
                  top: 50 + Math.sin(t * 1.4 + i) * 20,
                  transform: `rotate(${t * 30 + i * 25}deg)`,
                  background: "rgba(255,255,255,0.22)",
                  border: "2px solid rgba(255,255,255,0.55)",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 92,
                height: 92,
                marginLeft: -46,
                marginTop: -46,
                borderRadius: 46,
                background: "rgba(255,255,255,0.35)",
                border: "2px solid rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayIcon size={50} />
            </div>
          </div>
          {/* side panel */}
          <div style={{ width: 190, display: "flex", flexDirection: "column", gap: 14 }}>
            {[0.8, 0.55, 0.7, 0.4].map((w, i) => (
              <div key={i} style={{ height: 58, borderRadius: 16, background: "rgba(245,243,255,0.07)", border: "1px solid rgba(245,243,255,0.12)", padding: 14 }}>
                <div style={{ height: 10, width: `${w * 100}%`, borderRadius: 5, background: "rgba(167,139,250,0.6)" }} />
                <div style={{ height: 8, width: `${w * 60}%`, borderRadius: 4, marginTop: 8, background: "rgba(167,139,250,0.3)" }} />
              </div>
            ))}
          </div>
        </div>
        {/* timeline */}
        <div style={{ position: "relative", marginTop: 26 }}>
          {tracks.map((tr, i) => (
            <div key={i} style={{ position: "relative", height: 40, marginBottom: 12, borderRadius: 12, background: "rgba(245,243,255,0.06)" }}>
              {tr.clips.map(([a, b], j) => (
                <div
                  key={j}
                  style={{
                    position: "absolute",
                    left: `${a * 100}%`,
                    width: `${(b - a) * 100 - 0.8}%`,
                    top: 4,
                    bottom: 4,
                    borderRadius: 10,
                    background: `linear-gradient(90deg, ${tr.c1}, ${tr.c2})`,
                    opacity: 0.85,
                  }}
                />
              ))}
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              top: -14,
              bottom: 0,
              left: `${play * 100}%`,
              width: 4,
              borderRadius: 2,
              background: C.blue,
              boxShadow: `0 0 16px ${C.blue}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const Scene2Motion: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <GlassTile size={190} x={800} y={760} rx={25} ry={35} rz={-14} tint={0.7} floatPhase={0.4} />
      <GlassTile size={120} x={40} y={1400} rx={-20} ry={20} rz={24} tint={0.4} blur={3} floatPhase={2} />
      <Bubble size={90} x={880} y={1380} phase={1} />
      <Bubble size={46} x={70} y={820} phase={3} />
      <MotionInterface />

      <div style={{ position: "absolute", left: 90, top: 230 }}>
        <Eyebrow n="01" label="AUDIOVISUAL" delay={0.1} />
        <div style={{ height: 34 }} />
        <Headline light="Motion" bold="Design." delay={0.2} lightSize={150} boldSize={170} />
        <div style={{ height: 30 }} />
        <Chips items={["Vídeos", "Animações", "Publicidade"]} delay={0.7} />
      </div>
    </AbsoluteFill>
  );
};
