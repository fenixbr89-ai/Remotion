import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { dissolve, push } from "./transicoes";
import { DUR, TRANS } from "./timeline";
import { EASE_IN_OUT } from "./ui";
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
import { Cena11Espera } from "./scenes/Cena11Espera";
import { Cena12Logo } from "./scenes/Cena12Logo";

export type PixoraVideoProps = {
  /** Toca public/narracao/cena-01.mp3 … cena-10.mp3 quando true. */
  readonly narracao: boolean;
  readonly legendas: boolean;
};

const timing = (k: number) =>
  linearTiming({ durationInFrames: TRANS[k], easing: EASE_IN_OUT });

// Passagens 1→2 (zoom pela tela), 2→3 (ponto que cresce), 3→4 (círculo branco)
// 10→11 (zoom no celular) e 11→12 (preto contínuo) acontecem dentro das próprias cenas.
export const PixoraVideo: React.FC<PixoraVideoProps> = ({ narracao, legendas }) => (
  <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 · Gancho" durationInFrames={DUR.c01}>
        <Cena01Gancho />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="2 · Problema" durationInFrames={DUR.c02}>
        <Cena02Problema />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="3 · Virada" durationInFrames={DUR.c03}>
        <Cena03Virada />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="4 · Apresentação" durationInFrames={DUR.c04}>
        <Cena04Apresentacao />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={push("left")} timing={timing(3)} />
      <TransitionSeries.Sequence name="5 · Estilos" durationInFrames={DUR.c05}>
        <Cena05Estilos />
      </TransitionSeries.Sequence>
      {/* o card "Impacto" já está na posição da tela da cena 6: dissolve puro */}
      <TransitionSeries.Transition presentation={dissolve(1, 1)} timing={timing(4)} />
      <TransitionSeries.Sequence name="6 · Diferencial 1" durationInFrames={DUR.c06}>
        <Cena06Diferencial1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={dissolve()} timing={timing(5)} />
      <TransitionSeries.Sequence name="7 · Diferencial 2" durationInFrames={DUR.c07}>
        <Cena07Diferencial2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={push("up")} timing={timing(6)} />
      <TransitionSeries.Sequence name="8 · Prova social" durationInFrames={DUR.c08}>
        <Cena08ProvaSocial />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={dissolve()} timing={timing(7)} />
      <TransitionSeries.Sequence name="9 · Benefícios" durationInFrames={DUR.c09}>
        <Cena09Beneficios />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={push("up")} timing={timing(8)} />
      <TransitionSeries.Sequence name="10 · Chamada" durationInFrames={DUR.c10}>
        <Cena10Chamada />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="11 · Espera" durationInFrames={DUR.c11}>
        <Cena11Espera />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="12 · Logo" durationInFrames={DUR.c12}>
        <Cena12Logo />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    {legendas ? <Legendas /> : null}
    <Som narracao={narracao} />
  </AbsoluteFill>
);
