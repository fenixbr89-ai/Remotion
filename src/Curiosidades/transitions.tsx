import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type ZoomProps = { x: number; y: number; scale?: number };

/** Camera dives into a point of the outgoing scene; the next scene settles in from slightly smaller. */
const ZoomThrough: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          transformOrigin: `${passedProps.x}px ${passedProps.y}px`,
          scale: interpolate(p, [0, 1], [1, passedProps.scale ?? 3.4]),
          opacity: interpolate(p, [0.45, 1], [1, 0], clamp),
          filter: `blur(${p * 16}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        scale: interpolate(p, [0, 1], [0.86, 1]),
        opacity: interpolate(p, [0.35, 0.85], [0, 1], clamp),
        filter: `blur(${(1 - p) * 14}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const zoomThrough = (props: ZoomProps): TransitionPresentation<ZoomProps> => ({ component: ZoomThrough, props });

type CircleProps = { x: number; y: number };

/** A circle grows from an element of the outgoing scene and becomes the next scene. */
const CircleReveal: React.FC<TransitionPresentationComponentProps<CircleProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ scale: interpolate(p, [0, 1], [1, 1.06]) }}>{children}</AbsoluteFill>;
  }
  const r = interpolate(p, [0, 1], [0, 2300]);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at ${passedProps.x}px ${passedProps.y}px)` }}>{children}</AbsoluteFill>
  );
};

export const circleReveal = (props: CircleProps): TransitionPresentation<CircleProps> => ({ component: CircleReveal, props });

type WhipProps = { dir: "left" | "up" | "down" };

/** Smooth whip pan with motion blur. */
const Whip: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const out = presentationDirection === "exiting";
  const d = out ? -p : 1 - p;
  const blur = Math.sin(Math.PI * p) * 18;
  const tx = passedProps.dir === "left" ? d * 1080 : 0;
  const ty = passedProps.dir === "up" ? d * 1920 : passedProps.dir === "down" ? -d * 1920 : 0;
  return (
    <AbsoluteFill style={{ translate: `${tx}px ${ty}px`, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>
  );
};

export const whip = (props: WhipProps): TransitionPresentation<WhipProps> => ({ component: Whip, props });
