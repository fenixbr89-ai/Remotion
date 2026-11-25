import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { clamp } from "./anim";
import { B, F, FPS } from "./theme";
import { Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8 } from "./scenes";

/* Transition at each boundary B[1..7], timed to pauses in the narration */
type Kind = "whipDown" | "wipeLeft" | "zoomThrough" | "spin" | "cut" | "zoomOut" | "whipUp";
const KINDS: Kind[] = ["whipDown", "wipeLeft", "zoomThrough", "spin", "cut", "zoomOut", "whipUp"];
const HALF = 6; // frames on each side of the boundary
const outgoingOnTop: Kind[] = ["zoomThrough", "spin", "zoomOut"];

const inStyle = (k: Kind, p: number): React.CSSProperties => {
  const b = Math.sin(Math.PI * p) * 22;
  switch (k) {
    case "whipDown":
      return { transform: `translateY(${(1 - p) * 1920}px)`, filter: `blur(${b}px)` };
    case "whipUp":
      return { transform: `translateY(${-(1 - p) * 1920}px)`, filter: `blur(${b}px)` };
    case "wipeLeft":
      return { transform: `translateX(${(1 - p) * 1080}px)`, filter: `blur(${b * 0.6}px)` };
    case "zoomThrough":
      return { transform: `scale(${1.5 - 0.5 * p})`, filter: `blur(${(1 - p) * 18}px)` };
    case "spin":
      return { transform: `rotate(${(1 - p) * 40}deg) scale(${1.5 - 0.5 * p})`, filter: `blur(${(1 - p) * 18}px)` };
    case "cut":
      return { transform: `scale(${1.12 - 0.12 * p})` };
    case "zoomOut":
      return { transform: `scale(${1.35 - 0.35 * p})`, filter: `blur(${(1 - p) * 12}px)` };
  }
};
const outStyle = (k: Kind, p: number): React.CSSProperties => {
  const b = Math.sin(Math.PI * p) * 22;
  switch (k) {
    case "whipDown":
      return { transform: `translateY(${-p * 1920}px)`, filter: `blur(${b}px)` };
    case "whipUp":
      return { transform: `translateY(${p * 1920}px)`, filter: `blur(${b}px)` };
    case "wipeLeft":
      return { transform: `translateX(${-p * 400}px)`, opacity: 1 - p * 0.4 };
    case "zoomThrough":
      return { transform: `scale(${1 + 2.2 * p})`, opacity: 1 - p, filter: `blur(${p * 20}px)` };
    case "spin":
      return { transform: `rotate(${-p * 40}deg) scale(${1 + 0.6 * p})`, opacity: 1 - p, filter: `blur(${p * 20}px)` };
    case "cut":
      return { opacity: p > 0.5 ? 0 : 1 };
    case "zoomOut":
      return { transform: `scale(${1 - 0.45 * p})`, opacity: 1 - p, filter: `blur(${p * 14}px)` };
  }
};

const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8];

const SceneSlot: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const start = F(B[i]);
  const end = F(B[i + 1]);
  const enterK = i > 0 ? KINDS[i - 1] : null;
  const exitK = i < 7 ? KINDS[i] : null;
  const h = (k: Kind | null) => (k === "cut" ? 1 : HALF);
  const visFrom = enterK ? start - h(enterK) : 0;
  const visTo = exitK ? end + h(exitK) : end;
  if (frame < visFrom || frame >= visTo) return null;

  let style: React.CSSProperties = {};
  let z = i * 10;
  if (enterK && frame < start + h(enterK)) {
    const p = interpolate(frame, [start - h(enterK), start + h(enterK)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    style = inStyle(enterK, p);
    if (outgoingOnTop.includes(enterK)) z = i * 10 - 15;
  }
  if (exitK && frame >= end - h(exitK)) {
    const p = interpolate(frame, [end - h(exitK), end + h(exitK)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    style = outStyle(exitK, p);
  }
  const Comp = SCENES[i];
  return (
    <AbsoluteFill style={{ ...style, zIndex: z }}>
      <Comp />
    </AbsoluteFill>
  );
};

/* Sound effects (seconds), all trimmed to their first hit */
type Cue = { at: number; src: string; vol: number; from?: number; to?: number };
const CUES: Cue[] = [
  { at: 0.0, src: "glassy.mp3", vol: 0.5, from: 0.24, to: 1.66 },
  { at: 1.05, src: "chimes.mp3", vol: 0.4, to: 1.0 },
  { at: 1.98, src: "ui04.mp3", vol: 0.3 },
  { at: 3.3, src: "swipe.mp3", vol: 0.55, to: 0.3 },
  { at: 5.22, src: "open01.mp3", vol: 0.45, to: 0.5 },
  { at: 6.15, src: "ui02.mp3", vol: 0.3, to: 0.43 },
  { at: 6.99, src: "positive.mp3", vol: 0.35, to: 0.49 },
  { at: 8.52, src: "ui05.mp3", vol: 0.25 },
  { at: 9.15, src: "swipe.mp3", vol: 0.55, to: 0.3 },
  { at: 10.17, src: "ui04.mp3", vol: 0.3 },
  { at: 11.37, src: "open04.mp3", vol: 0.45, to: 0.4 },
  { at: 12.99, src: "open11.mp3", vol: 0.45, to: 0.4 },
  { at: 14.4, src: "open16.mp3", vol: 0.4, to: 0.4 },
  { at: 15.45, src: "glitch.mp3", vol: 0.4, from: 0.5, to: 1.06 },
  { at: 17.04, src: "ui01.mp3", vol: 0.3 },
  { at: 17.7, src: "ui01.mp3", vol: 0.3 },
  { at: 20.59, src: "open10.mp3", vol: 0.4, to: 0.6 },
  { at: 21.29, src: "open08.mp3", vol: 0.6, to: 0.4 },
  { at: 22.1, src: "open19.mp3", vol: 0.6, to: 0.4 },
  { at: 22.75, src: "swipe.mp3", vol: 0.55, to: 0.3 },
  { at: 23.61, src: "notif.mp3", vol: 0.45, to: 0.42 },
  { at: 24.27, src: "ui09.mp3", vol: 0.35, to: 0.44 },
  { at: 25.77, src: "ui02.mp3", vol: 0.3, to: 0.43 },
  { at: 27.12, src: "open01.mp3", vol: 0.4, to: 0.5 },
  { at: 27.84, src: "open04.mp3", vol: 0.4, to: 0.4 },
  { at: 29.5, src: "ui06.mp3", vol: 0.4, to: 0.59 },
  { at: 30.35, src: "riser.wav", vol: 0.28, from: 0.39, to: 1.94 },
  { at: 31.95, src: "loading.mp3", vol: 0.3, from: 0.24, to: 1.8 },
  { at: 33.51, src: "success.mp3", vol: 0.45, to: 1.27 },
  { at: 34.4, src: "swipe.mp3", vol: 0.55, to: 0.3 },
  { at: 35.2, src: "ui09.mp3", vol: 0.3, to: 0.44 },
  { at: 39.42, src: "soft.mp3", vol: 0.4, to: 1.49 },
  { at: 40.75, src: "swipe.mp3", vol: 0.55, to: 0.3 },
  { at: 42.78, src: "confirm.mp3", vol: 0.35, to: 1.14 },
  { at: 44.1, src: "chimes.mp3", vol: 0.4, to: 1.0 },
  { at: 45.3, src: "open16.mp3", vol: 0.35, to: 0.4 },
  { at: 46.1, src: "clicky.mp3", vol: 0.45, to: 1.02 },
  { at: 46.47, src: "ui02.mp3", vol: 0.3, to: 0.43 },
  { at: 2.7, src: "ui01.mp3", vol: 0.25 },
  { at: 24.02, src: "swipe.mp3", vol: 0.45, to: 0.3 },
  { at: 36.03, src: "ui06.mp3", vol: 0.3, to: 0.59 },
  { at: 43.83, src: "ui04.mp3", vol: 0.25 },
  { at: 45.75, src: "ui05.mp3", vol: 0.25 },
];

export const Wayfluency: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff" }}>
    {SCENES.map((_, i) => (
      <SceneSlot key={i} i={i} />
    ))}
    <Audio src={staticFile("narracao.wav")} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(c.at * FPS))} durationInFrames={Math.ceil(((c.to ?? 2) - (c.from ?? 0)) * FPS) + 2} layout="none">
        <Audio
          src={staticFile(`sfx/${c.src}`)}
          volume={c.vol}
          trimBefore={c.from ? Math.round(c.from * FPS) : undefined}
          trimAfter={c.to ? Math.round(c.to * FPS) : undefined}
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);
