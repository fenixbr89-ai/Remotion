import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlurIn, C, CLAMP, EASE, FONT, PixoraP, prog } from "../ui";

// 12–18s · Máscara circular revela o P; "Pixora" entra ao lado.
export const Cena04Apresentacao: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = prog(frame, 14, 22);
  const slide = prog(frame, 42, 22);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: "50%",
            background: C.black,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            clipPath: `circle(${reveal * 72}% at 50% 50%)`,
            boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
          }}
        >
          <PixoraP size={118} id="c04" />
        </div>
        <div
          style={{
            width: interpolate(slide, [0, 1], [0, 400], {
              ...CLAMP,
              easing: EASE,
            }),
            overflow: "visible",
            whiteSpace: "nowrap",
          }}
        >
          <BlurIn delay={48} style={{ paddingLeft: 40 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 120,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: C.ink,
              }}
            >
              Pixora
            </div>
          </BlurIn>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1000, left: 100, right: 100 }}>
        <BlurIn delay={78}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 48,
              fontWeight: 500,
              color: C.sub,
              textAlign: "center",
              lineHeight: 1.25,
            }}
          >
            Vídeos comerciais
            <br />
            em motion graphics
          </div>
        </BlurIn>
      </div>
    </AbsoluteFill>
  );
};
