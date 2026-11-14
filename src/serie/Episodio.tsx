import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { Fragment } from "react";
import { AbsoluteFill } from "remotion";
import { calcular } from "./calc";
import type { Negocio } from "./tipos";
import { Fundo } from "./ui/Fundo";
import { Moldura } from "./ui/Moldura";
import { transicaoSerie } from "./ui/Transicao";
import { Gancho } from "./cenas/Gancho";
import { Cardapio } from "./cenas/Cardapio";
import { Custos } from "./cenas/Custos";
import { Erro } from "./cenas/Erro";
import { Conta } from "./cenas/Conta";
import { Mes } from "./cenas/Mes";
import { Chamada } from "./cenas/Chamada";
import { Comenta } from "./cenas/Comenta";
import type { CenaProps } from "./cenas/props";

export const CENAS: { nome: string; dur: number; C: React.FC<CenaProps> }[] = [
  { nome: "Gancho", dur: 170, C: Gancho },
  { nome: "Cardápio", dur: 220, C: Cardapio },
  { nome: "Custos", dur: 500, C: Custos },
  { nome: "Erro comum", dur: 320, C: Erro },
  { nome: "Conta certa", dur: 330, C: Conta },
  { nome: "Mês", dur: 230, C: Mes },
  { nome: "Chamada", dur: 200, C: Chamada },
  { nome: "Comenta", dur: 210, C: Comenta },
];

export const TRANSICAO = 24;
export const DURACAO = CENAS.reduce((s, c) => s + c.dur, 0) - TRANSICAO * (CENAS.length - 1);

export const Episodio: React.FC<Negocio> = (n) => {
  const k = calcular(n);
  return (
    <AbsoluteFill>
      <Fundo />
      <TransitionSeries>
        {CENAS.map(({ nome, dur, C }, i) => (
          <Fragment key={nome}>
            {i > 0 && <TransitionSeries.Transition presentation={transicaoSerie()} timing={linearTiming({ durationInFrames: TRANSICAO })} />}
            <TransitionSeries.Sequence name={nome} durationInFrames={dur}>
              <C n={n} k={k} dur={dur} />
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
      <Moldura episodio={n.episodio} />
    </AbsoluteFill>
  );
};
