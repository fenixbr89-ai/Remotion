import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { Fragment } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { calcular } from "./calc";
import type { Negocio } from "./tipos";
import { Fundo } from "./ui/Fundo";
import { Moldura } from "./ui/Moldura";
import { transicaoSerie } from "./ui/Transicao";
import { Loja } from "./cenas/Loja";
import { Cardapio } from "./cenas/Cardapio";
import { Custos } from "./cenas/Custos";
import { Taxa } from "./cenas/Taxa";
import { Preco } from "./cenas/Preco";
import { Lucro } from "./cenas/Lucro";
import { Chamada } from "./cenas/Chamada";
import { Comenta } from "./cenas/Comenta";
import { Outro } from "./cenas/Outro";
import type { CenaProps } from "./cenas/props";

/** `etapa`: qual aba (Custo/Taxa/Preço/Lucro) fica ativa durante a cena. */
export const CENAS: { nome: string; dur: number; C: React.FC<CenaProps>; etapa?: number }[] = [
  { nome: "Loja", dur: 240, C: Loja },
  { nome: "Cardápio", dur: 200, C: Cardapio },
  { nome: "Custo", dur: 480, C: Custos, etapa: 0 },
  { nome: "Taxa", dur: 320, C: Taxa, etapa: 1 },
  { nome: "Preço", dur: 330, C: Preco, etapa: 2 },
  { nome: "Lucro", dur: 260, C: Lucro, etapa: 3 },
  { nome: "Chamada", dur: 180, C: Chamada },
  { nome: "Comenta", dur: 190, C: Comenta },
  { nome: "Outro", dur: 150, C: Outro },
];

export const TRANSICAO = 20;
const INICIOS = CENAS.map((_, i) => CENAS.slice(0, i).reduce((s, c) => s + c.dur, 0) - i * TRANSICAO);
export const DURACAO = INICIOS[INICIOS.length - 1] + CENAS[CENAS.length - 1].dur;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Episodio: React.FC<Negocio> = (n) => {
  const k = calcular(n);
  const f = useCurrentFrame();
  // cena "dona" do frame: a mais recente que já começou (passado o meio da transição)
  const atual = INICIOS.reduce((acc, ini, i) => (f >= ini + TRANSICAO / 2 ? i : acc), 0);
  const etapa = CENAS[atual].etapa ?? (atual > 5 ? 4 : null);
  const iAbas = CENAS.findIndex((c) => c.etapa === 0);
  const iFimAbas = CENAS.findIndex((c) => c.etapa === 3) + 1;
  const abas = Math.min(
    interpolate(f, [INICIOS[iAbas], INICIOS[iAbas] + 15], [0, 1], clamp),
    interpolate(f, [INICIOS[iFimAbas], INICIOS[iFimAbas] + 15], [1, 0], clamp),
  );
  const iOutro = CENAS.length - 1;
  const visivel = interpolate(f, [INICIOS[iOutro], INICIOS[iOutro] + TRANSICAO], [1, 0], clamp);
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
      <Moldura episodio={n.episodio} visivel={visivel} etapa={etapa !== null ? Math.min(etapa, 4) : null} abas={abas} />
    </AbsoluteFill>
  );
};
