import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { softFade } from "./softFade";
import { Open } from "./scenes/Open";
import { Millis } from "./scenes/Millis";
import { Product } from "./scenes/Product";
import { Brasil } from "./scenes/Brasil";
import { Bento } from "./scenes/Bento";
import { Price } from "./scenes/Price";
import { End } from "./scenes/End";

export const SCENES = [
  { id: "K1-Open", component: Open, durationInFrames: 105 },
  { id: "K2-Millis", component: Millis, durationInFrames: 115 },
  { id: "K3-Product", component: Product, durationInFrames: 150 },
  { id: "K4-Brasil", component: Brasil, durationInFrames: 120 },
  { id: "K5-Bento", component: Bento, durationInFrames: 140 },
  { id: "K6-Price", component: Price, durationInFrames: 130 },
  { id: "K7-End", component: End, durationInFrames: 130 },
] as const;

export const TRANSITION = 14;

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
              presentation={softFade()}
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
