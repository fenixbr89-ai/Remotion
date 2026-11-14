import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlurIn, C, CLAMP, EASE, FONT, Title, WordByWord, prog } from "../ui";

// 4–9s · Contador de views cai de 12 para 3.
export const Cena02Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const views = Math.round(
    interpolate(frame, [34, 78], [12, 3], { ...CLAMP, easing: EASE }),
  );
  // pequeno "piscar" de desfoque a cada troca de número
  const tick = interpolate(frame, [34, 78], [0, 9], CLAMP);
  const flicker = frame > 34 && frame < 80 ? (1 - (tick % 1)) * 4 : 0;
  const cardIn = prog(frame, 4, 16);
  const drop = prog(frame, 34, 44);

  return (
    <AbsoluteFill style={{ background: C.gray }}>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 140,
          right: 140,
          height: 470,
          borderRadius: 48,
          background: C.white,
          boxShadow: "0 30px 80px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: cardIn,
          filter: `blur(${(1 - cardIn) * 20}px)`,
          scale: String(1.08 - 0.08 * cardIn),
        }}
      >
        <svg width="76" height="50" viewBox="0 0 76 50">
          <path
            d="M3 25C14 9 25 3 38 3S62 9 73 25C62 41 51 47 38 47S14 41 3 25Z"
            fill="none"
            stroke={C.sub}
            strokeWidth="5"
          />
          <circle cx="38" cy="25" r="10" fill={C.sub} />
        </svg>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 190,
            letterSpacing: "-0.04em",
            color: interpolate(drop, [0, 1], [0, 1]) > 0.5 ? "#3A3A3C" : C.ink,
            filter: `blur(${flicker}px)`,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {views}
          <svg
            width="60"
            height="70"
            viewBox="0 0 60 70"
            style={{ opacity: drop }}
          >
            <path
              d="M30 6V60M8 40L30 62L52 40"
              fill="none"
              stroke={C.red}
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 44, color: C.sub, fontWeight: 500 }}>
          visualizações
        </div>
      </div>

      <div style={{ position: "absolute", top: 1010, left: 90, right: 90 }}>
        <Title>
          <WordByWord text="Imagem estática não vende mais." delay={72} stagger={6} />
        </Title>
      </div>
      <div style={{ position: "absolute", top: 1240, width: "100%" }}>
        <BlurIn delay={110}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 40,
              color: C.sub,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            O feed não espera.
          </div>
        </BlurIn>
      </div>
    </AbsoluteFill>
  );
};
