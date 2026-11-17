import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { easeInOut, easeOut, ip, punch } from "../anim";
import { C, TRANSITION } from "../constants";
import { Background } from "./Background";

/**
 * Casca de cada cena: fundo, câmera com push-in contínuo (+3,5%),
 * punches de zoom, entrada desfocada e saída com desfoque + leve zoom.
 */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  bg?: string;
  punches?: number[]; // frames locais
  enter?: boolean;
  exit?: boolean;
}> = ({ children, bg = C.bg, punches = [], enter = true, exit = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const push = ip(frame, [0, durationInFrames], [1, 1.035]);
  const punchSum = punches.reduce((acc, p) => acc + punch(frame, p), 0);

  const enterP = enter ? ip(frame, [0, TRANSITION], [0, 1], easeOut) : 1;
  const exitP = exit
    ? ip(frame, [durationInFrames - TRANSITION, durationInFrames], [0, 1], easeInOut)
    : 0;

  const blur = (1 - enterP) * 18 + exitP * 22;
  const opacity = Math.min(enterP, 1 - exitP);

  return (
    <AbsoluteFill>
      <Background color={bg} />
      <AbsoluteFill
        style={{
          scale: String(push + punchSum + exitP * 0.07 + (1 - enterP) * -0.03),
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
