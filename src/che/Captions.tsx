import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTIONS } from "./captions";
import { C, SANS, ease } from "./lib";

export type Tone = "paper" | "dark" | "blue";
export const TONE_BG: Record<Tone, string> = {
  paper: "#e6e2d9",
  dark: "#0b0b0b",
  blue: "#3a7aa8",
};
const TONE_TEXT: Record<Tone, string> = {
  paper: C.ink,
  dark: "#f3efe6",
  blue: "#ffffff",
};

/** Caption zone: everything below BAND_TOP is plain background, no images. */
export const BAND_TOP = 1330;
export const CAPTION_TOP = 1400;

/** Plain band at the bottom of a scene so captions never sit on images. */
export const CaptionBand: React.FC<{ tone: Tone }> = ({ tone }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: BAND_TOP - 90,
        height: 90,
        background: `linear-gradient(180deg, rgba(0,0,0,0), ${TONE_BG[tone]})`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: BAND_TOP,
        bottom: 0,
        background: TONE_BG[tone],
      }}
    />
  </AbsoluteFill>
);

/** Bottom captions: max 2 lines, words appear as they are spoken. */
export const Captions: React.FC<{ toneAt: (frame: number) => Tone }> = ({
  toneAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const page = CAPTIONS.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const tone = toneAt(frame);
  const pageIn = ease(t, page.start, page.start + 0.15);
  const pageOut = 1 - ease(t, page.end - 0.12, page.end);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: CAPTION_TOP,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.18,
          letterSpacing: -1.2,
          color: TONE_TEXT[tone],
          opacity: Math.min(pageIn, pageOut),
        }}
      >
        {page.words.map((w, i) => {
          const p = ease(t, w.t - 0.06, w.t + 0.16);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 16,
                opacity: 0.18 + 0.82 * p,
                filter: `blur(${(1 - p) * 4}px)`,
                translate: `0px ${(1 - p) * 8}px`,
                color: w.hl
                  ? tone === "paper"
                    ? C.red
                    : C.redSoft
                  : undefined,
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
