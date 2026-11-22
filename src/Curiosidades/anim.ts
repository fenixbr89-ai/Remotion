import { createContext, useContext } from "react";
import { Easing, interpolate } from "remotion";

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
/** gentle overshoot (no "slam") */
export const easeBack = Easing.bezier(0.34, 1.4, 0.64, 1);

export const prog = (f: number, start: number, dur: number, easing = ease) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** scene length in frames, provided by the video so scenes can animate until their last frame */
export const DurCtx = createContext(150);
export const useDur = () => useContext(DurCtx);

/** tiny idle motion */
export const bob = (f: number, seed = 0, amp = 6, speed = 18) => Math.sin((f + seed * 13) / speed) * amp;
export const blinking = (f: number, seed = 0) => (f + seed * 41) % 110 < 4;
