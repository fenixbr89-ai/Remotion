import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, Drift, EASE, FONT, Kinetic, prog } from "../ui";
import { DUR } from "../timeline";
import { SCREEN } from "./Cena05Estilos";

// 26–32s · O card vira a tela do mockup; tudo entra em foco com a barra verde.
export const Cena06Diferencial1: React.FC = () => {
  const frame = useCurrentFrame();
  const frameIn = prog(frame, 8, 22);
  const details = prog(frame, 18, 16);
  const bar = interpolate(frame, [44, 140], [0, 1], { ...CLAMP, easing: EASE });

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Drift dur={DUR.c06} amount={0.03} origin="50% 55%">
        <div style={{ position: "absolute", top: 210, left: 60, right: 60 }}>
          <Kinetic
            delay={12}
            stagger={4}
            lines={[
              { text: "Visual premium.", size: 92 },
              { text: "Limpo. Profissional.", size: 64, color: C.sub },
            ]}
            lineHeight={1.15}
          />
        </div>

        {/* moldura do mockup que aparece em volta da tela */}
        <div
          style={{
            position: "absolute",
            top: SCREEN.top - 44,
            left: SCREEN.left - 44,
            width: SCREEN.width + 88,
            height: 720,
            borderRadius: 52,
            background: C.gray,
            boxShadow: "0 40px 100px rgba(0,0,0,0.10)",
            opacity: frameIn,
            scale: String(1.04 - frameIn * 0.04),
          }}
        />

        {/* tela: mesma posição e cor do card "Impacto" da cena 5 */}
        <div
          style={{
            position: "absolute",
            ...SCREEN,
            borderRadius: SCREEN.radius,
            background: C.black,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="90"
            height="100"
            viewBox="0 0 56 64"
            style={{ opacity: prog(frame, 10, 12), scale: String(0.8 + 0.2 * prog(frame, 10, 12)) }}
          >
            <path d="M8 6L50 32L8 58Z" fill="white" />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            top: SCREEN.top + SCREEN.height + 30,
            left: SCREEN.left,
            width: SCREEN.width,
            display: "flex",
            flexDirection: "column",
            gap: 26,
            opacity: details,
            filter: `blur(${(1 - details) * 14}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 40,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Comercial_Pixora.mp4
          </div>
          <div style={{ height: 16, borderRadius: 8, background: "#E5E5EA", overflow: "hidden" }}>
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
      </Drift>
    </AbsoluteFill>
  );
};
