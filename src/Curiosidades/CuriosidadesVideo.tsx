import React from "react";
import { Easing, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { DurCtx } from "./anim";
import { DEFAULT_T, SCENES, sceneFrames } from "./timeline";

export const CuriosidadesVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      {SCENES.map((s) => {
        const dur = sceneFrames(s, fps);
        return (
          <React.Fragment key={s.id}>
            <TransitionSeries.Sequence name={s.id} durationInFrames={dur}>
              <DurCtx.Provider value={dur}>
                <s.C />
              </DurCtx.Provider>
            </TransitionSeries.Sequence>
            {s.next ? (
              <TransitionSeries.Transition
                presentation={s.next.p}
                timing={linearTiming({
                  durationInFrames: s.next.frames ?? DEFAULT_T,
                  easing: Easing.bezier(0.65, 0, 0.35, 1),
                })}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};

/** A single scene for previewing in Studio. */
export const SceneOnly: React.FC<{ index: number }> = ({ index }) => {
  const s = SCENES[index];
  const { fps } = useVideoConfig();
  return (
    <DurCtx.Provider value={sceneFrames(s, fps)}>
      <s.C />
    </DurCtx.Provider>
  );
};
