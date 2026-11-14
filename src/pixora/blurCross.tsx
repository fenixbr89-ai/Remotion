import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { CLAMP } from "./ui";

type Props = Record<string, never>;

/** Desfoque cruzado: cena atual sai no blur (8f), a próxima entra do blur (8f). */
const BlurCross: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const t = entering
    ? interpolate(p, [0.5, 1], [1, 0], CLAMP)
    : interpolate(p, [0, 0.5], [0, 1], CLAMP);
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - t,
        filter: `blur(${t * 24}px)`,
        scale: String(entering ? 1 + t * 0.04 : 1 - t * 0.02),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const blurCross = (): TransitionPresentation<Props> => ({
  component: BlurCross,
  props: {},
});
