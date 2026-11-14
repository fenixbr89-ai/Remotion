import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { CLAMP } from "./ui";

// ---------- Empurrão de câmera (as duas cenas se movem juntas) ----------
type PushProps = { direction: "left" | "up" };

const Push: React.FC<TransitionPresentationComponentProps<PushProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps: { direction },
}) => {
  const entering = presentationDirection === "entering";
  const offset = entering ? (1 - p) * 100 : -p * 100;
  const motionBlur = Math.sin(Math.PI * p) * 6;
  return (
    <AbsoluteFill
      style={{
        translate: direction === "left" ? `${offset}% 0%` : `0% ${offset}%`,
        filter: `blur(${motionBlur}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const push = (direction: PushProps["direction"]): TransitionPresentation<PushProps> => ({
  component: Push,
  props: { direction },
});

// ---------- Dissolve com profundidade (a cena nova entra por cima, sem quadro vazio) ----------
type DissolveProps = { exitScale: number; enterScale: number };

const Dissolve: React.FC<TransitionPresentationComponentProps<DissolveProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps: { exitScale, enterScale },
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          scale: String(interpolate(p, [0, 1], [1, exitScale])),
          filter: `blur(${exitScale === 1 ? 0 : p * 6}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(p, [0, 0.85], [0, 1], CLAMP),
        scale: String(interpolate(p, [0, 1], [enterScale, 1])),
        filter: `blur(${enterScale === 1 ? 0 : (1 - p) * 8}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** exitScale/enterScale = 1 → dissolve puro, para elementos que já estão alinhados (match cut). */
export const dissolve = (
  exitScale = 1.08,
  enterScale = 0.96,
): TransitionPresentation<DissolveProps> => ({
  component: Dissolve,
  props: { exitScale, enterScale },
});
