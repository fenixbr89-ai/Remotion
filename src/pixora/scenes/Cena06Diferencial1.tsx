import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlurIn, C, CLAMP, EASE, FONT, Title, prog } from "../ui";

// 26–32s · Tela desfocada entra em foco com barra verde animada.
export const Cena06Diferencial1: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = prog(frame, 30, 36);
  const bar = interpolate(frame, [62, 150], [0, 1], { ...CLAMP, easing: EASE });

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div style={{ position: "absolute", top: 330, width: "100%" }}>
        <BlurIn delay={10}>
          <Title>Tudo no estilo Apple</Title>
        </BlurIn>
      </div>

      <div
        style={{
          position: "absolute",
          top: 560,
          left: 150,
          right: 150,
          height: 720,
          borderRadius: 52,
          background: C.gray,
          boxShadow: "0 40px 100px rgba(0,0,0,0.10)",
          padding: 44,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          filter: `blur(${(1 - focus) * 26}px)`,
          opacity: interpolate(frame, [12, 30], [0, 1], CLAMP),
          scale: String(1.06 - focus * 0.06),
        }}
      >
        <div
          style={{
            height: 400,
            borderRadius: 32,
            background: "linear-gradient(150deg, #1C1C1E 0%, #3A3A3C 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="90" height="100" viewBox="0 0 56 64">
            <path d="M8 6L50 32L8 58Z" fill="white" />
          </svg>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>
          Comercial_Pixora.mp4
        </div>
        <div
          style={{
            height: 16,
            borderRadius: 8,
            background: "#E5E5EA",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${bar * 100}%`,
              height: "100%",
              borderRadius: 8,
              background: C.green,
            }}
          />
        </div>
        <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 500, color: C.sub }}>
          {bar >= 0.999 ? "Pronto ✓" : `Renderizando… ${Math.round(bar * 100)}%`}
        </div>
      </div>
    </AbsoluteFill>
  );
};
