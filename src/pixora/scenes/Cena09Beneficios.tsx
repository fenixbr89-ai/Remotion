import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BlurIn, C, DrawPath, EmojiBadge, FONT, Title, prog, useSpring } from "../ui";

/** Frames (locais) dos eventos de som desta cena. */
export const C09 = { check: 22, items: [86, 114, 142] };

const ITEMS: [string, string][] = [
  ["💸", "Preço acessível"],
  ["🔒", "Segurança"],
  ["⚡", "Entrega rápida"],
];

// 43–49s · "Pix enviado" com check desenhado e lista de benefícios.
export const Cena09Beneficios: React.FC = () => {
  const frame = useCurrentFrame();
  const circle = useSpring(C09.check - 8, 16);
  const check = prog(frame, C09.check, 14);
  const pixOut = prog(frame, 70, 10);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* tela "Pix enviado" */}
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          opacity: 1 - pixOut,
          filter: `blur(${pixOut * 20}px)`,
          scale: String(1 - pixOut * 0.05),
        }}
      >
        <svg width="240" height="240" viewBox="0 0 240 240">
          <circle
            cx="120"
            cy="120"
            r={110 * circle}
            fill={C.green}
          />
          <DrawPath
            d="M70 124L105 158L172 88"
            progress={check}
            length={160}
            color={C.white}
            width={18}
          />
        </svg>
        <BlurIn delay={C09.check + 4}>
          <Title size={80}>Pix enviado</Title>
        </BlurIn>
        <BlurIn delay={C09.check + 12}>
          <div style={{ fontFamily: FONT, fontSize: 40, color: C.sub, fontWeight: 500 }}>
            para Pixora · agora
          </div>
        </BlurIn>
      </div>

      {/* benefícios em sequência */}
      <div
        style={{
          position: "absolute",
          top: 480,
          left: 130,
          right: 100,
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        {ITEMS.map(([emoji, label], i) => (
          <BlurIn key={label} delay={C09.items[i]}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <EmojiBadge char={emoji} size={150} />
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 64,
                  letterSpacing: "-0.025em",
                  color: C.ink,
                }}
              >
                {label}
              </div>
            </div>
          </BlurIn>
        ))}
      </div>
    </AbsoluteFill>
  );
};
