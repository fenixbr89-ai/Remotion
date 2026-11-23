import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
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
  { id: "K1-Hook", component: Hook, durationInFrames: 85 },
  { id: "K2-Wait", component: Wait, durationInFrames: 201 },
  { id: "K3-Distance", component: Distance, durationInFrames: 152 },
  { id: "K4-Reveal", component: Reveal, durationInFrames: 202 },
  { id: "K5-Speed", component: Speed, durationInFrames: 115 },
  { id: "K6-Features", component: Features, durationInFrames: 289 },
  { id: "K7-Offer", component: Offer, durationInFrames: 175 },
  { id: "K8-CTA", component: CTA, durationInFrames: 165 },
] as const;

export const TRANSITION = 16;

export const TOTAL_DURATION =
  SCENES.reduce((a, s) => a + s.durationInFrames, 0) -
  TRANSITION * (SCENES.length - 1);

export const KronicVPS: React.FC = () => (
  <AbsoluteFill>
  <Audio src={staticFile("narracao.wav")} />
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
  </AbsoluteFill>
);
