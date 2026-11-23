import React from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type Props = Record<string, never>;

const ZoomBlur: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        scale: String(1.25 - 0.25 * p),
        filter: `blur(${(1 - p) * 40}px)`,
      }
    : {
        opacity: 1 - p * 0.6,
        scale: String(1 + 0.12 * p),
        filter: `blur(${p * 30}px)`,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const zoomBlur = (): TransitionPresentation<Props> => ({
  component: ZoomBlur,
  props: {},
});
