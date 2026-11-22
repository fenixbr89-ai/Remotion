import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SCENES } from "./Scenes";
import { FilmLook, clamp, easeInOut, loadFonts, tornPath } from "./lib";

loadFonts();

/** Seconds per scene, matched to the narration sentence it covers. */
export const SCENE_SECONDS = [
  2.8, 3.4, 3.8, 4.4, 4.4, 4.4, 6.2, 5.2, 5.4, 2.8, 5.0, 5.0, 5.0, 4.6, 4.6,
  6.2, 6.0, 3.8, 5.6,
];

type T = "fade" | "zoom" | "whipL" | "whipU" | "tear" | "flash";
/** Transition INTO scene i+1 (index i = between scene i and i+1). */
const TRANS: T[] = [
  "zoom",
  "tear",
  "whipL",
  "tear",
  "zoom",
  "fade",
  "tear",
  "whipU",
  "flash",
  "zoom",
  "tear",
  "whipL",
  "fade",
  "flash",
  "zoom",
  "tear",
  "whipU",
  "fade",
];
const TF = 16; // transition length in frames

export const totalFrames = (fps: number) =>
  Math.round(SCENE_SECONDS.reduce((a, b) => a + b, 0) * fps);

const Wrap: React.FC<{
  len: number;
  tin?: T;
  tout?: T;
  children: React.ReactNode;
}> = ({ len, tin, tout, children }) => {
  const f = useCurrentFrame();
  const pin = tin
    ? interpolate(f, [0, TF], [0, 1], { ...clamp, easing: easeInOut })
    : 1;
  const pout = tout
    ? interpolate(f, [len - TF, len], [0, 1], { ...clamp, easing: easeInOut })
    : 0;
  const s: React.CSSProperties = {};
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let blur = 0;
  let opacity = 1;
  let flash = 0;
  let torn = false;
  // entering
  if (tin && pin < 1) {
    if (tin === "fade") opacity *= pin;
    if (tin === "zoom") {
      scale *= 0.75 + 0.25 * pin;
      opacity *= pin;
      blur += (1 - pin) * 10;
    }
    if (tin === "whipL") {
      tx += (1 - pin) * 1080;
      blur += Math.sin(pin * Math.PI) * 14;
    }
    if (tin === "whipU") {
      ty += (1 - pin) * 1920;
      blur += Math.sin(pin * Math.PI) * 14;
    }
    if (tin === "tear") {
      ty += (1 - pin) * 2000;
      torn = true;
    }
    if (tin === "flash") {
      opacity *= interpolate(pin, [0.45, 0.55], [0, 1], clamp);
      flash = 1 - Math.abs(pin * 2 - 1);
    }
  }
  // leaving
  if (tout && pout > 0) {
    if (tout === "zoom") {
      scale *= 1 + pout * 1.6;
      blur += pout * 10;
    }
    if (tout === "whipL") {
      tx -= pout * 1080;
      blur += Math.sin(pout * Math.PI) * 14;
    }
    if (tout === "whipU") {
      ty -= pout * 1920;
      blur += Math.sin(pout * Math.PI) * 14;
    }
    if (tout === "tear") {
      scale *= 1 - pout * 0.06;
      s.filter = `brightness(${1 - pout * 0.35})`;
    }
  }
  return (
    <>
      <AbsoluteFill style={{ opacity }}>
        <AbsoluteFill
          style={{
            ...s,
            scale: String(scale),
            translate: `${tx}px ${ty}px`,
            filter:
              [s.filter, blur > 0.2 ? `blur(${blur}px)` : ""]
                .filter(Boolean)
                .join(" ") || undefined,
          }}
        >
          {torn ? (
            <svg
              width={1080}
              height={70}
              style={{ position: "absolute", top: -50, left: 0, zIndex: 5 }}
            >
              <path d={tornPath(1080, 70, "tear", 18, 24)} fill="#e9e6df" />
            </svg>
          ) : null}
          <AbsoluteFill style={{ overflow: "hidden" }}>{children}</AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      {flash > 0 ? (
        <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      ) : null}
    </>
  );
};

export const CheVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  let acc = 0;
  const items = SCENES.map((Scene, i) => {
    const start = Math.round(acc * fps);
    acc += SCENE_SECONDS[i];
    const end = Math.round(acc * fps);
    const from = i === 0 ? 0 : start - TF / 2;
    const to = i === SCENES.length - 1 ? end : end + TF / 2;
    const len = to - from;
    return (
      <Sequence
        key={i}
        from={from}
        durationInFrames={len}
        name={`Cena ${i + 1}`}
      >
        <Wrap
          len={len}
          tin={i > 0 ? TRANS[i - 1] : undefined}
          tout={i < SCENES.length - 1 ? TRANS[i] : undefined}
        >
          <Scene d={len} />
        </Wrap>
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ background: "#0b0b0b" }}>
      {items}
      <FilmLook />
    </AbsoluteFill>
  );
};
