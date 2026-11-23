import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Bg, Line, reveal, Server3D } from "../components";
import { C, clamp, EASE, EASE_IN_OUT } from "../theme";

// 3 — Gray. Hero product reveal: "Kronic VPS."
export const Product: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [6, 50], [0, 1], { ...clamp, easing: EASE });
  const rotY = interpolate(frame, [0, 150], [-48, 22], { ...clamp, easing: EASE_IN_OUT });
  return (
    <AbsoluteFill>
      <Bg color={C.gray} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Line start={0} size={46} weight={500} color={C.sub}>Apresentando</Line>
        <Line start={40} size={150} style={{ marginTop: 14 }}>Kronic VPS.</Line>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 260 }}>
        <div style={{ opacity: rise, translate: `0px ${(1 - rise) * 260}px` }}>
          <Server3D rotY={rotY} rotX={-14} width={700} units={3} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 230 }}>
        <Img src={staticFile("logo-full.png")} style={{ width: 300, ...reveal(frame, 70) }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
