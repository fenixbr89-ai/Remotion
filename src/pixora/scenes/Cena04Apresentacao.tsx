import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, Drift, EASE, Kinetic, PixoraP, prog } from "../ui";
import { DUR } from "../timeline";

// 12–18s · Máscara circular revela o P; "Pixora" entra letra por letra ao lado.
export const Cena04Apresentacao: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = prog(frame, 6, 22);
  const slide = prog(frame, 32, 24);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Drift dur={DUR.c04} amount={0.035}>
        <div
          style={{
            position: "absolute",
            top: 720,
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
              scale: String(interpolate(reveal, [0, 1], [0.85, 1])),
              boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
              flexShrink: 0,
            }}
          >
            <PixoraP size={118} id="c04" />
          </div>
          <div
            style={{
              width: interpolate(slide, [0, 1], [0, 420], { ...CLAMP, easing: EASE }),
              whiteSpace: "nowrap",
              paddingLeft: interpolate(slide, [0, 1], [0, 40], CLAMP),
            }}
          >
            <Kinetic
              delay={36}
              stagger={4}
              align="flex-start"
              lines={[{ text: "Pixora", size: 128, chars: true, tracking: "-0.035em" }]}
            />
          </div>
        </div>

        <div style={{ position: "absolute", top: 1010, left: 60, right: 60 }}>
          <Kinetic
            delay={64}
            stagger={3}
            lines={[
              { text: "Vídeos comerciais", size: 54, color: C.sub, weight: 500 },
              { text: "em motion graphics", size: 54, color: C.ink, weight: 500 },
            ]}
            lineHeight={1.2}
          />
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
