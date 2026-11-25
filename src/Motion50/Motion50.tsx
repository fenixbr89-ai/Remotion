import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { cl } from "../Wayfluency/motion";
import { F, FPS, K } from "../MotionAd/theme";
import { N1, N2, N3, N4, N5, N6, N7, N8, N9 } from "./scenes";

/* Time-warp: the animation was timed on a guide voice ("old" seconds).
 * Each anchor maps a guide-voice moment to the same word in the recorded narration ("new" seconds). */
const WARP: [number, number][] = [
  [0, 0], [0.33, 0.9], [1.17, 1.44], [2.13, 2.4], [2.64, 2.76], [3.53, 3.4], [3.75, 4.3],
  [4.14, 4.75], [5.2, 5.25], [5.91, 6.54], [6.35, 6.9], [7.2, 7.95],
  [7.53, 8.4], [8.4, 9.09], [9.15, 9.54], [9.75, 10.5],
  [9.87, 11.12], [10.92, 11.97], [11.19, 12.21], [11.3, 12.57], [12.0, 13.35],
  [12.18, 13.74], [13.45, 15.0], [13.86, 16.35], [14.2, 16.68], [14.8, 17.45],
  [15.06, 17.79], [15.76, 18.62], [16.47, 19.44], [17.16, 20.16], [17.7, 21.03], [18.51, 22.23], [19.08, 22.44], [20.0, 23.25],
  [20.28, 23.67], [21.88, 24.92], [24.48, 26.37], [24.84, 26.7], [25.08, 26.9], [25.95, 27.5],
  [26.43, 28.08], [27.21, 28.59], [28.08, 29.88], [29.6, 31.38], [30.09, 31.68], [30.9, 32.4],
  [31.14, 32.85], [32.1, 33.9], [32.85, 34.38], [33.51, 34.75], [35.2, 36.4],
];
const lerp = (x: number, xs: number[], ys: number[]) => interpolate(x, xs, ys, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const oldFromNew = (t: number) => lerp(t, WARP.map((w) => w[1]), WARP.map((w) => w[0]));
const newFromOld = (t: number) => lerp(t, WARP.map((w) => w[0]), WARP.map((w) => w[1]));
export const M50_TOTAL = 36.4;
const OLD_TOTAL = 35.2;
// scene boundaries, aligned to pauses in the narration
const B = [0, 3.75, 7.2, 9.75, 12.0, 14.8, 20.0, 25.95, 30.9, OLD_TOTAL];
type Kind = "whipLeft" | "cut" | "zoomThrough" | "whipUp" | "zoomOut" | "lime";
const KINDS: Kind[] = ["whipLeft", "cut", "zoomThrough", "whipUp", "zoomOut", "whipLeft", "zoomThrough", "lime"];
const SCENES = [N1, N2, N3, N4, N5, N6, N7, N8, N9];
const HALF = 6;
const outgoingOnTop: Kind[] = ["zoomThrough", "zoomOut"];

const inStyle = (k: Kind, p: number): React.CSSProperties => {
  const b = Math.sin(Math.PI * p) * 24;
  switch (k) {
    case "whipLeft":
      return { transform: `translateX(${(1 - p) * 1080}px)`, filter: `blur(${b}px)` };
    case "whipUp":
      return { transform: `translateY(${(1 - p) * 1920}px)`, filter: `blur(${b}px)` };
    case "cut":
    case "lime":
      return { transform: `scale(${1.15 - 0.15 * p})` };
    case "zoomThrough":
      return { transform: `scale(${1.5 - 0.5 * p})`, filter: `blur(${(1 - p) * 18}px)` };
    case "zoomOut":
      return { transform: `scale(${1.35 - 0.35 * p})`, filter: `blur(${(1 - p) * 12}px)` };
  }
};
const outStyle = (k: Kind, p: number): React.CSSProperties => {
  const b = Math.sin(Math.PI * p) * 24;
  switch (k) {
    case "whipLeft":
      return { transform: `translateX(${-p * 1080}px)`, filter: `blur(${b}px)` };
    case "whipUp":
      return { transform: `translateY(${-p * 1920}px)`, filter: `blur(${b}px)` };
    case "cut":
    case "lime":
      return {};
    case "zoomThrough":
      return { transform: `scale(${1 + 2.2 * p})`, opacity: 1 - p, filter: `blur(${p * 20}px)` };
    case "zoomOut":
      return { transform: `scale(${1 - 0.45 * p})`, opacity: 1 - p, filter: `blur(${p * 14}px)` };
  }
};

const Slot: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const start = F(B[i]);
  const end = F(B[i + 1]);
  const enterK = i > 0 ? KINDS[i - 1] : null;
  const exitK = i < SCENES.length - 1 ? KINDS[i] : null;
  const hard = (k: Kind | null) => k === "cut" || k === "lime";
  const from = enterK && !hard(enterK) ? start - HALF : start;
  const to = exitK && !hard(exitK) ? end + HALF : end;
  if (frame < from || frame >= to) return null;
  let style: React.CSSProperties = {};
  let z = i * 10;
  if (enterK && frame < start + HALF) {
    const p = interpolate(frame, [start - HALF, start + HALF], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
    style = inStyle(enterK, hard(enterK) ? Math.max(0.5, p) * 2 - 1 : p);
    if (outgoingOnTop.includes(enterK)) z -= 15;
  }
  if (exitK && !hard(exitK) && frame >= end - HALF) {
    const p = interpolate(frame, [end - HALF, end + HALF], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
    style = outStyle(exitK, p);
  }
  const C = SCENES[i];
  return (
    <AbsoluteFill style={{ ...style, zIndex: z }}>
      <C />
    </AbsoluteFill>
  );
};

const LimeWipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const b = F(at);
  if (f < b - 7 || f > b + 7) return null;
  const y = interpolate(f, [b - 7, b - 1, b + 1, b + 7], [1920, 0, 0, -1920], { ...cl, easing: Easing.inOut(Easing.cubic) });
  return <AbsoluteFill style={{ zIndex: 500, transform: `translateY(${y}px)`, background: K.lime }} />;
};

type Cue = { at: number; src: string; vol: number; from?: number; to?: number };
const CUES: Cue[] = [
  { at: 1.17, src: "positive.mp3", vol: 0.35, to: 0.49 },
  { at: 1.3, src: "loading.mp3", vol: 0.18, from: 0.24, to: 2.4 },
  { at: 2.13, src: "ui04.mp3", vol: 0.3 },
  { at: 3.6, src: "swipe.mp3", vol: 0.5, to: 0.3 },
  { at: 5.3, src: "swipe.mp3", vol: 0.4, to: 0.3 },
  { at: 5.45, src: "ui02.mp3", vol: 0.3, to: 0.43 },
  { at: 7.2, src: "ui06.mp3", vol: 0.4, to: 0.59 },
  { at: 8.4, src: "ui01.mp3", vol: 0.3 },
  { at: 9.15, src: "ui05.mp3", vol: 0.35 },
  { at: 9.6, src: "glitch.mp3", vol: 0.35, from: 0.5, to: 1.06 },
  { at: 11.19, src: "success.mp3", vol: 0.35, to: 1.27 },
  { at: 11.85, src: "swipe.mp3", vol: 0.5, to: 0.3 },
  { at: 12.18, src: "open04.mp3", vol: 0.35, to: 0.4 },
  { at: 13.45, src: "open11.mp3", vol: 0.35, to: 0.4 },
  { at: 13.86, src: "open16.mp3", vol: 0.35, to: 0.4 },
  { at: 14.65, src: "glassy.mp3", vol: 0.3, from: 0.24, to: 1.2 },
  { at: 15.06, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 15.76, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 16.47, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 17.16, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 17.7, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 18.51, src: "open19.mp3", vol: 0.5, to: 0.4 },
  { at: 19.08, src: "confirm.mp3", vol: 0.3, to: 1.14 },
  { at: 19.85, src: "swipe.mp3", vol: 0.5, to: 0.3 },
  { at: 20.28, src: "open01.mp3", vol: 0.35, to: 0.5 },
  { at: 21.88, src: "open10.mp3", vol: 0.35, to: 0.6 },
  { at: 24.48, src: "soft.mp3", vol: 0.35, to: 1.49 },
  { at: 25.8, src: "glitch.mp3", vol: 0.3, from: 0.5, to: 1.06 },
  { at: 26.9, src: "riser.wav", vol: 0.22, from: 0.6, to: 1.94 },
  { at: 27.0, src: "loading.mp3", vol: 0.22, from: 0.24, to: 1.3 },
  { at: 28.08, src: "success.mp3", vol: 0.4, to: 1.27 },
  { at: 30.09, src: "ui05.mp3", vol: 0.3 },
  { at: 30.75, src: "swipe.mp3", vol: 0.5, to: 0.3 },
  { at: 32.05, src: "clicky.mp3", vol: 0.4, to: 1.02 },
  { at: 32.9, src: "notif.mp3", vol: 0.4, to: 0.42 },
  { at: 33.4, src: "chimes.mp3", vol: 0.3, to: 1.0 },
];

const Warped: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Freeze frame={oldFromNew(f / FPS) * FPS}>
      {SCENES.map((_, i) => (
        <Slot key={i} i={i} />
      ))}
      {B.slice(1, -1).map((b, i) => (KINDS[i] === "lime" ? <LimeWipe key={i} at={b} /> : null))}
    </Freeze>
  );
};

export const Motion50: React.FC = () => (
  <AbsoluteFill style={{ background: K.black }}>
    <Warped />
    <Audio src={staticFile("motionad/locucao-feminina.wav")} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.round(newFromOld(c.at) * FPS)} durationInFrames={Math.ceil(((c.to ?? 2) - (c.from ?? 0)) * FPS) + 2} layout="none">
        <Audio src={staticFile(`sfx/${c.src}`)} volume={c.vol} trimBefore={c.from ? Math.round(c.from * FPS) : undefined} trimAfter={c.to ? Math.round(c.to * FPS) : undefined} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
