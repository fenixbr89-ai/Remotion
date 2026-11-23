import React from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type Props = Record<string, never>;

// Apple-style soft crossfade: incoming scene settles from a tiny scale-up.
const SoftFade: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const style: React.CSSProperties =
    presentationDirection === "entering"
      ? { opacity: p, scale: String(1.03 - 0.03 * p) }
      : { opacity: 1 };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const softFade = (): TransitionPresentation<Props> => ({
  component: SoftFade,
  props: {},
});
