import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { blurCross } from "./blurCross";
import { BLUR_T, DUR } from "./timeline";
import { Legendas } from "./Legendas";
import { Som } from "./Som";
import { Cena01Gancho } from "./scenes/Cena01Gancho";
import { Cena02Problema } from "./scenes/Cena02Problema";
import { Cena03Virada } from "./scenes/Cena03Virada";
import { Cena04Apresentacao } from "./scenes/Cena04Apresentacao";
import { Cena05Estilos } from "./scenes/Cena05Estilos";
import { Cena06Diferencial1 } from "./scenes/Cena06Diferencial1";
import { Cena07Diferencial2 } from "./scenes/Cena07Diferencial2";
import { Cena08ProvaSocial } from "./scenes/Cena08ProvaSocial";
import { Cena09Beneficios } from "./scenes/Cena09Beneficios";
import { Cena10Chamada } from "./scenes/Cena10Chamada";
import { Cena11Logo } from "./scenes/Cena11Logo";

export type PixoraVideoProps = {
  /** Toca public/narracao/cena-01.mp3 … cena-10.mp3 quando true. */
  readonly narracao: boolean;
  readonly legendas: boolean;
};

const blur = (
  <TransitionSeries.Transition
    presentation={blurCross()}
    timing={linearTiming({ durationInFrames: BLUR_T })}
  />
);

export const PixoraVideo: React.FC<PixoraVideoProps> = ({ narracao, legendas }) => (
  <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <TransitionSeries>
      {/* corte com zoom pela tela (feito dentro da cena 1) */}
      <TransitionSeries.Sequence name="1 · Gancho" durationInFrames={DUR.c01}>
        <Cena01Gancho />
      </TransitionSeries.Sequence>
      {/* corte seco com flash para preto */}
      <TransitionSeries.Sequence name="2 · Problema" durationInFrames={DUR.c02}>
        <Cena02Problema />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="3 · Virada" durationInFrames={DUR.c03}>
        <Cena03Virada />
      </TransitionSeries.Sequence>
      {blur}
      <TransitionSeries.Sequence name="4 · Apresentação" durationInFrames={DUR.c04}>
        <Cena04Apresentacao />
      </TransitionSeries.Sequence>
      {blur}
      <TransitionSeries.Sequence name="5 · Estilos" durationInFrames={DUR.c05}>
        <Cena05Estilos />
      </TransitionSeries.Sequence>
      {blur}
      <TransitionSeries.Sequence name="6 · Diferencial 1" durationInFrames={DUR.c06}>
        <Cena06Diferencial1 />
      </TransitionSeries.Sequence>
      {blur}
      <TransitionSeries.Sequence name="7 · Diferencial 2" durationInFrames={DUR.c07}>
        <Cena07Diferencial2 />
      </TransitionSeries.Sequence>
      {blur}
      <TransitionSeries.Sequence name="8 · Prova social" durationInFrames={DUR.c08}>
        <Cena08ProvaSocial />
      </TransitionSeries.Sequence>
      {blur}
      <TransitionSeries.Sequence name="9 · Benefícios" durationInFrames={DUR.c09}>
        <Cena09Beneficios />
      </TransitionSeries.Sequence>
      {blur}
      <TransitionSeries.Sequence name="10 · Chamada" durationInFrames={DUR.c10}>
        <Cena10Chamada />
      </TransitionSeries.Sequence>
      {/* corte seco com flash para preto */}
      <TransitionSeries.Sequence name="11 · Logo" durationInFrames={DUR.c11}>
        <Cena11Logo />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    {legendas ? <Legendas /> : null}
    <Som narracao={narracao} />
  </AbsoluteFill>
);
