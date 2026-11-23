import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { NSCENES, NarratedScene, NScene } from "./Scenes";
import { NarrationCaptions } from "./Captions";

export const NARRATION_SECONDS = 65.44;
const FADE = 6;

const Fader: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, FADE], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const sceneFrames = (s: NScene, fps: number) => Math.round(s.start * fps);

export const NarradoVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      {NSCENES.map((s, i) => {
        const from = sceneFrames(s, fps);
        const to = i < NSCENES.length - 1 ? sceneFrames(NSCENES[i + 1], fps) + FADE : durationInFrames;
        return (
          <Sequence key={s.id} name={s.id} from={from} durationInFrames={to - from}>
            <Fader first={i === 0}>
              <NarratedScene scene={s} dur={to - from - FADE} />
            </Fader>
          </Sequence>
        );
      })}
      <NarrationCaptions />
      <Audio src={staticFile("audio/narracao-implante.wav")} />
    </AbsoluteFill>
  );
};
