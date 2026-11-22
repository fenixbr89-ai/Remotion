import React from "react";
import { useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { EscuroScene, SPECS } from "./Scenes";

const T = 6; // quick soft cut, like the reference

export const escuroTotal = (fps: number) => SPECS.reduce((n, s) => n + Math.round(s.sec * fps), 0) - (SPECS.length - 1) * T;

export const EscuroVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      {SPECS.map((s, i) => (
        <React.Fragment key={s.id}>
          <TransitionSeries.Sequence name={s.id} durationInFrames={Math.round(s.sec * fps)}>
            <EscuroScene index={i} dur={Math.round(s.sec * fps)} />
          </TransitionSeries.Sequence>
          {i < SPECS.length - 1 ? <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} /> : null}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};
