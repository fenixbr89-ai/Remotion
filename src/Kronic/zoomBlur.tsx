import React from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type Props = Record<string, never>;

// Whip-pan: the camera snaps sideways with heavy motion blur.
const Whip: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const style: React.CSSProperties = entering
    ? {
        opacity: Math.min(1, p * 2.2),
        translate: `${(1 - p) * 38}% 0%`,
        scale: String(1.08 - 0.08 * p),
        filter: `blur(${(1 - p) * 34}px)`,
      }
    : {
        opacity: 1,
        translate: `${-p * 38}% 0%`,
        scale: String(1 + 0.08 * p),
        filter: `blur(${p * 34}px)`,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const zoomBlur = (): TransitionPresentation<Props> => ({
  component: Whip,
  props: {},
});
