import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { cl } from "../Wayfluency/motion";
import { B, F, FPS, K } from "./theme";
import { S1, S2, S3, S4, S5, S6, S7 } from "./scenes";

type Kind = "lime" | "zoomThrough" | "whipLeft" | "zoomOut";
// transition used at B[1..6]
const KINDS: Kind[] = ["lime", "lime", "zoomThrough", "whipLeft", "lime", "zoomOut"];
const HALF = 6;
const SCENES = [S1, S2, S3, S4, S5, S6, S7];

const inStyle = (k: Kind, p: number): React.CSSProperties => {
  switch (k) {
    case "lime":
      return { transform: `scale(${1.15 - 0.15 * p})` };
    case "zoomThrough":
      return { transform: `scale(${1.5 - 0.5 * p})`, filter: `blur(${(1 - p) * 18}px)` };
    case "whipLeft":
      return { transform: `translateX(${(1 - p) * 1080}px)`, filter: `blur(${Math.sin(Math.PI * p) * 24}px)` };
    case "zoomOut":
      return { transform: `scale(${1.35 - 0.35 * p})`, filter: `blur(${(1 - p) * 12}px)` };
  }
};
const outStyle = (k: Kind, p: number): React.CSSProperties => {
  switch (k) {
    case "lime":
      return { transform: `scale(${1 + 0.1 * p})` };
    case "zoomThrough":
      return { transform: `scale(${1 + 2.2 * p})`, opacity: 1 - p, filter: `blur(${p * 20}px)` };
    case "whipLeft":
      return { transform: `translateX(${-p * 1080}px)`, filter: `blur(${Math.sin(Math.PI * p) * 24}px)` };
    case "zoomOut":
      return { transform: `scale(${1 - 0.45 * p})`, opacity: 1 - p, filter: `blur(${p * 14}px)` };
  }
};
const outgoingOnTop: Kind[] = ["zoomThrough", "zoomOut"];

const Slot: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const start = F(B[i]);
  const end = F(B[i + 1]);
  const enterK = i > 0 ? KINDS[i - 1] : null;
  const exitK = i < SCENES.length - 1 ? KINDS[i] : null;
  const from = enterK ? start - HALF : 0;
  const to = exitK ? end + HALF : end;
  if (frame < from || frame >= to) return null;
  // lime transitions: hard swap at the boundary (the lime panel covers it)
  if (enterK === "lime" && frame < start) return null;
  if (exitK === "lime" && frame >= end) return null;
  let style: React.CSSProperties = {};
  let z = i * 10;
  if (enterK && frame < start + HALF) {
    const p = interpolate(frame, [start - HALF, start + HALF], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
    style = inStyle(enterK, p);
    if (outgoingOnTop.includes(enterK)) z -= 15;
  }
  if (exitK && frame >= end - HALF) {
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

/** Lime panel that sweeps up over the cut, like the original. */
const LimeWipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const b = F(at);
  if (f < b - 7 || f > b + 7) return null;
  const y = interpolate(f, [b - 7, b - 1, b + 1, b + 7], [1920, 0, 0, -1920], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const v = f < b ? interpolate(f, [b - 7, b - 1], [1, 0], cl) : interpolate(f, [b + 1, b + 7], [0, 1], cl);
  return (
    <AbsoluteFill style={{ zIndex: 500, transform: `translateY(${y}px)`, background: K.lime, filter: `blur(${Math.sin(v * Math.PI) * 10}px)` }} />
  );
};

type Cue = { at: number; src: string; vol: number; from?: number; to?: number };
const CUES: Cue[] = [
  { at: 0.0, src: "glassy.mp3", vol: 0.35, from: 0.24, to: 1.66 },
  { at: 1.15, src: "ui01.mp3", vol: 0.25 },
  { at: 1.59, src: "ui04.mp3", vol: 0.3 },
  { at: 2.05, src: "open04.mp3", vol: 0.35, to: 0.4 },
  { at: 2.45, src: "swipe.mp3", vol: 0.5, to: 0.3 },
  { at: 2.8, src: "loading.mp3", vol: 0.25, from: 0.24, to: 1.3 },
  { at: 3.95, src: "success.mp3", vol: 0.4, to: 1.27 },
  { at: 5.73, src: "ui06.mp3", vol: 0.35, to: 0.59 },
  { at: 7.02, src: "ui05.mp3", vol: 0.3 },
  { at: 7.3, src: "swipe.mp3", vol: 0.5, to: 0.3 },
  { at: 7.6, src: "open01.mp3", vol: 0.35, to: 0.5 },
  { at: 9.39, src: "ui04.mp3", vol: 0.3 },
  { at: 9.85, src: "ui02.mp3", vol: 0.3, to: 0.43 },
  { at: 11.55, src: "ui02.mp3", vol: 0.3, to: 0.43 },
  { at: 12.45, src: "glitch.mp3", vol: 0.35, from: 0.5, to: 1.06 },
  { at: 14.22, src: "positive.mp3", vol: 0.35, to: 0.49 },
  { at: 16.89, src: "notif.mp3", vol: 0.4, to: 0.42 },
  { at: 17.4, src: "swipe.mp3", vol: 0.5, to: 0.3 },
  { at: 19.62, src: "soft.mp3", vol: 0.35, to: 1.49 },
  { at: 20.25, src: "swipe.mp3", vol: 0.35, to: 0.3 },
  { at: 21.5, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 21.75, src: "swipe.mp3", vol: 0.35, to: 0.3 },
  { at: 23.3, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 23.4, src: "swipe.mp3", vol: 0.35, to: 0.3 },
  { at: 23.6, src: "loading.mp3", vol: 0.2, from: 0.24, to: 1.6 },
  { at: 24.99, src: "confirm.mp3", vol: 0.3, to: 1.14 },
  { at: 25.44, src: "open10.mp3", vol: 0.35, to: 0.6 },
  { at: 26.2, src: "open08.mp3", vol: 0.5, to: 0.4 },
  { at: 27.0, src: "open19.mp3", vol: 0.5, to: 0.4 },
  { at: 27.85, src: "swipe.mp3", vol: 0.5, to: 0.3 },
  { at: 28.95, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 29.7, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 30.48, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 31.11, src: "success.mp3", vol: 0.35, to: 1.27 },
  { at: 31.55, src: "swipe.mp3", vol: 0.45, to: 0.3 },
  { at: 32.25, src: "ui06.mp3", vol: 0.3, to: 0.59 },
  { at: 33.38, src: "clicky.mp3", vol: 0.4, to: 1.02 },
  { at: 33.52, src: "chimes.mp3", vol: 0.3, to: 1.0 },
];

export const MotionAd: React.FC = () => (
  <AbsoluteFill style={{ background: K.black }}>
    {SCENES.map((_, i) => (
      <Slot key={i} i={i} />
    ))}
    {B.slice(1, -1).map((b, i) => (KINDS[i] === "lime" ? <LimeWipe key={i} at={b} /> : null))}
    <Audio src={staticFile("motionad/narracao.wav")} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={Math.ceil(((c.to ?? 2) - (c.from ?? 0)) * FPS) + 2} layout="none">
        <Audio src={staticFile(`sfx/${c.src}`)} volume={c.vol} trimBefore={c.from ? Math.round(c.from * FPS) : undefined} trimAfter={c.to ? Math.round(c.to * FPS) : undefined} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
