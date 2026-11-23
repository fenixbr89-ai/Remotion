import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { zoomBlur } from "./zoomBlur";
import { Hook } from "./scenes/Hook";
import { Wait } from "./scenes/Wait";
import { Distance } from "./scenes/Distance";
import { Reveal } from "./scenes/Reveal";
import { Speed } from "./scenes/Speed";
import { Features } from "./scenes/Features";
import { Offer } from "./scenes/Offer";
import { CTA } from "./scenes/CTA";

export const SCENES = [
  { id: "K1-Hook", component: Hook, durationInFrames: 120 },
  { id: "K2-Wait", component: Wait, durationInFrames: 120 },
  { id: "K3-Distance", component: Distance, durationInFrames: 115 },
  { id: "K4-Reveal", component: Reveal, durationInFrames: 125 },
  { id: "K5-Speed", component: Speed, durationInFrames: 115 },
  { id: "K6-Features", component: Features, durationInFrames: 150 },
  { id: "K7-Offer", component: Offer, durationInFrames: 140 },
  { id: "K8-CTA", component: CTA, durationInFrames: 140 },
] as const;

export const TRANSITION = 16;

export const TOTAL_DURATION =
  SCENES.reduce((a, s) => a + s.durationInFrames, 0) -
  TRANSITION * (SCENES.length - 1);

export const KronicVPS: React.FC = () => (
  <TransitionSeries>
    {SCENES.map((s, i) => {
      const Comp = s.component;
      return (
        <React.Fragment key={s.id}>
          {i > 0 ? (
            <TransitionSeries.Transition
              presentation={zoomBlur()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />
          ) : null}
          <TransitionSeries.Sequence name={s.id} durationInFrames={s.durationInFrames}>
            <Comp />
          </TransitionSeries.Sequence>
        </React.Fragment>
      );
    })}
  </TransitionSeries>
);
