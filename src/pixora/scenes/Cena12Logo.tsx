import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE, Kinetic, PixoraP, prog, useSpring } from "../ui";

// 56–60s · Vindo da tela escura do celular: o P surge (0.8→1) com brilho diagonal.
// "PIXORA" entra letra por letra fechando o espaçamento. Parado nos 2s finais.
export const Cena12Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const mask = prog(frame, 2, 22);
  const s = useSpring(2, 22);
  const shine = interpolate(frame, [28, 60], [0, 1], CLAMP);
  const tracking = interpolate(frame, [30, 70], [0.7, 0.42], { ...CLAMP, easing: EASE });

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          clipPath: `circle(${mask * 75}% at 50% 50%)`,
          scale: String(0.8 + 0.2 * s),
          filter: `drop-shadow(0 0 ${interpolate(shine, [0, 0.5, 1], [0, 24, 0])}px rgba(255,255,255,0.35))`,
        }}
      >
        <PixoraP size={380} color="#F2F2F2" shine={shine} id="c11" />
      </div>

      <div style={{ position: "absolute", top: 1110, left: 0, right: 0 }}>
        <Kinetic
          delay={30}
          stagger={4}
          lines={[
            {
              text: "PIXORA",
              size: 72,
              color: C.white,
              chars: true,
              tracking: `${tracking}em`,
            },
          ]}
          style={{ paddingLeft: tracking * 72 }}
        />
      </div>
      <div style={{ position: "absolute", top: 1230, left: 0, right: 0 }}>
        <Kinetic
          delay={48}
          lines={[{ text: "@pixora", size: 44, color: C.sub, weight: 500, tracking: "0em" }]}
        />
      </div>
    </AbsoluteFill>
  );
};
