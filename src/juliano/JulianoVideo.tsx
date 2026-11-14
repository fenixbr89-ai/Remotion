import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { EASE_IN_OUT } from "../pixora/ui";
import { tinta } from "./tintaWipe";
import { J_DUR, J_TOTAL, J_TRANS } from "./tema";
import { J01Potencial } from "./scenes/J01Potencial";
import { J02Ambientes } from "./scenes/J02Ambientes";
import { J03Detalhes } from "./scenes/J03Detalhes";
import { J04Solucoes } from "./scenes/J04Solucoes";
import { J05Contato } from "./scenes/J05Contato";
import { J06Logo } from "./scenes/J06Logo";

export type JulianoVideoProps = {
  /** Toca public/juliano/narracao.wav quando true. */
  readonly narracao: boolean;
};

const timing = (k: number) =>
  linearTiming({ durationInFrames: J_TRANS[k], easing: EASE_IN_OUT });

export const JulianoVideo: React.FC<JulianoVideoProps> = ({ narracao }) => (
  <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence
        name="1 · Potencial"
        durationInFrames={J_DUR.j01}
      >
        <J01Potencial />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={tinta("left")}
        timing={timing(0)}
      />
      <TransitionSeries.Sequence
        name="2 · Ambientes"
        durationInFrames={J_DUR.j02}
      >
        <J02Ambientes />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={tinta("right")}
        timing={timing(1)}
      />
      <TransitionSeries.Sequence
        name="3 · Detalhes"
        durationInFrames={J_DUR.j03}
      >
        <J03Detalhes />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={tinta("left")}
        timing={timing(2)}
      />
      <TransitionSeries.Sequence
        name="4 · Soluções"
        durationInFrames={J_DUR.j04}
      >
        <J04Solucoes />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={tinta("right")}
        timing={timing(3)}
      />
      <TransitionSeries.Sequence
        name="5 · Contato"
        durationInFrames={J_DUR.j05}
      >
        <J05Contato />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={tinta("left")}
        timing={timing(4)}
      />
      <TransitionSeries.Sequence name="6 · Logo" durationInFrames={J_DUR.j06}>
        <J06Logo />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio
      name="Trilha"
      src={staticFile("juliano/trilha.mp3")}
      volume={(f) =>
        interpolate(
          f,
          [0, 20, J_TOTAL - 45, J_TOTAL],
          [0, narracao ? 0.3 : 0.6, narracao ? 0.3 : 0.6, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      }
    />
    {narracao ? (
      <Audio name="Narração" src={staticFile("juliano/narracao.wav")} />
    ) : null}
  </AbsoluteFill>
);
