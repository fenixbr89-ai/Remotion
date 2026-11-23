import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as A from "./Scenes";
import * as B from "./Scenes2";
import { Scraps } from "./Art";
import { FilmLook, clamp, easeInOut, loadFonts, tornPath } from "./lib";

loadFonts();

/** The 27 scenes, in order. */
const SCENES = [
  A.S01,
  A.S02,
  A.S03,
  A.S04,
  B.N_Family,
  A.S05,
  A.S06,
  A.S07,
  B.N_Guatemala,
  B.N_Armas,
  A.S08,
  A.S09,
  B.N_Sierra,
  A.S10,
  B.N_SantaClara,
  B.N_Batista,
  A.S12,
  A.S13,
  A.S14,
  A.S15,
  B.N_Congo,
  B.N_Bolivia,
  B.N_Captured,
  B.N_1997,
  A.S18,
  A.S19,
  B.N_CTA,
];
/** Seconds per scene, cut from the recorded narration: each scene starts
 * 0.25s before its sentence's first word, so transitions fall in the pauses. */
export const SCENE_SECONDS = [
  2.77, 4.24, 4.2, 5.58, 3.74, 4.92, 4.68, 8.06, 7.38, 4.4, 6.82, 5.8, 5.86,
  2.46, 6.08, 6.26, 4.94, 4.42, 6.6, 4.86, 9.04, 7.16, 11.63, 6.25, 3.64, 5.42,
  7.39,
];
/** Scenes that get blurred foreground scraps for depth. */
const SCRAPS = new Set([1, 4, 5, 10, 16, 19, 21]);

type T = "fade" | "zoom" | "whipL" | "whipU" | "tear" | "flash";
/** Transition INTO scene i+1 (index i = between scene i and i+1). */
const TRANS: T[] = [
  "zoom",
  "tear",
  "whipL",
  "tear",
  "whipU",
  "zoom",
  "fade",
  "tear",
  "flash",
  "zoom",
  "whipU",
  "fade",
  "flash",
  "zoom",
  "whipL",
  "tear",
  "whipL",
  "fade",
  "flash",
  "zoom",
  "tear",
  "fade",
  "fade",
  "whipU",
  "fade",
  "tear",
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
          {SCRAPS.has(i) ? <Scraps seed={i} /> : null}
        </Wrap>
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ background: "#0b0b0b" }}>
      {items}
      <FilmLook />
      <Audio src={staticFile("che/narracao.m4a")} />
    </AbsoluteFill>
  );
};
