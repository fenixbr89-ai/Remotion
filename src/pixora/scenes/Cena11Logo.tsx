import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BlurIn, C, CLAMP, FONT, PixoraP, prog, useSpring } from "../ui";

// 55–60s · Flash para preto, P surge (0.8→1) com brilho diagonal. Parado nos 2s finais.
export const Cena11Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 4], [0.9, 0], CLAMP);
  const mask = prog(frame, 4, 20);
  const s = useSpring(4, 22);
  const shine = interpolate(frame, [30, 62], [0, 1], CLAMP);

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

      <div style={{ position: "absolute", top: 1120, width: "100%" }}>
        <BlurIn delay={34}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 72,
              letterSpacing: "0.42em",
              paddingLeft: "0.42em",
              color: C.white,
              textAlign: "center",
            }}
          >
            PIXORA
          </div>
        </BlurIn>
      </div>
      <div style={{ position: "absolute", top: 1230, width: "100%" }}>
        <BlurIn delay={44}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 44,
              color: C.sub,
              textAlign: "center",
            }}
          >
            @pixora
          </div>
        </BlurIn>
      </div>

      <AbsoluteFill style={{ background: C.white, opacity: flash }} />
    </AbsoluteFill>
  );
};
