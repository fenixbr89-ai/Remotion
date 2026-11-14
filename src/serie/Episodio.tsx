import { TransitionSeries, linearTiming } from "@remotion/transitions";
import type { TransitionPresentation } from "@remotion/transitions";
import { Fragment } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { calcular } from "./calc";
import type { Negocio } from "./tipos";
import { Fundo } from "./ui/Fundo";
import { Moldura } from "./ui/Moldura";
import { flood, whip } from "./ui/Transicao";
import { Cardapio, Chute, Gancho, Loja } from "./cenas/Abertura";
import { Custo } from "./cenas/Custo";
import { App, Erro, Sobra } from "./cenas/Taxa";
import { Divisao, Formula } from "./cenas/Preco";
import { Frase, Mes } from "./cenas/Lucro";
import { Comenta, Outro, Produto } from "./cenas/Final";
import type { CenaProps } from "./cenas/props";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Entrada = { tipo: TransitionPresentation<any>; dur: number } | null;

const FLOOD: Entrada = { tipo: flood(), dur: 16 };
const WHIP: Entrada = { tipo: whip("esquerda"), dur: 10 };
const WHIP_CIMA: Entrada = { tipo: whip("cima"), dur: 10 };
const CORTE: Entrada = null;

/**
 * Linha do tempo em ritmo de Reels: cenas curtas (2–9 s), transição na entrada de cada cena.
 * `etapa` = aba ativa (Custo/Taxa/Preço/Lucro).
 */
export const CENAS: { nome: string; dur: number; C: React.FC<CenaProps>; entrada: Entrada; etapa?: number }[] = [
  { nome: "Gancho", dur: 100, C: Gancho, entrada: CORTE },
  { nome: "Loja", dur: 105, C: Loja, entrada: FLOOD },
  { nome: "Chute", dur: 75, C: Chute, entrada: CORTE },
  { nome: "Cardápio", dur: 85, C: Cardapio, entrada: WHIP },
  { nome: "Custo", dur: 260, C: Custo, entrada: CORTE, etapa: 0 },
  { nome: "Erro", dur: 80, C: Erro, entrada: FLOOD, etapa: 1 },
  { nome: "App", dur: 165, C: App, entrada: WHIP, etapa: 1 },
  { nome: "Sobra", dur: 80, C: Sobra, entrada: WHIP_CIMA, etapa: 1 },
  { nome: "Fórmula", dur: 165, C: Formula, entrada: FLOOD, etapa: 2 },
  { nome: "Divisão", dur: 115, C: Divisao, entrada: WHIP, etapa: 2 },
  { nome: "Mês", dur: 185, C: Mes, entrada: FLOOD, etapa: 3 },
  { nome: "Frase", dur: 70, C: Frase, entrada: WHIP_CIMA },
  { nome: "Produto", dur: 175, C: Produto, entrada: FLOOD },
  { nome: "Comenta", dur: 165, C: Comenta, entrada: WHIP },
  { nome: "Outro", dur: 145, C: Outro, entrada: FLOOD },
];

const sobreposicao = (i: number) => CENAS[i].entrada?.dur ?? 0;
const INICIOS = CENAS.map((_, i) => CENAS.slice(0, i).reduce((s, c, j) => s + c.dur - (j + 1 <= i ? sobreposicao(j + 1) : 0), 0));
export const DURACAO = INICIOS[INICIOS.length - 1] + CENAS[CENAS.length - 1].dur;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Episodio: React.FC<Negocio> = (n) => {
  const k = calcular(n);
  const f = useCurrentFrame();
  const atual = INICIOS.reduce((acc, ini, i) => (f >= ini + sobreposicao(i) / 2 ? i : acc), 0);
  const etapaCena = CENAS[atual].etapa;
  const iAbas = CENAS.findIndex((c) => c.etapa === 0);
  const iFimAbas = CENAS.findIndex((c, i) => i > iAbas && c.etapa === undefined);
  const etapa = etapaCena ?? (atual >= iFimAbas ? 4 : null);
  const abas = Math.min(interpolate(f, [INICIOS[iAbas], INICIOS[iAbas] + 10], [0, 1], clamp), interpolate(f, [INICIOS[iFimAbas], INICIOS[iFimAbas] + 10], [1, 0], clamp));
  const iOutro = CENAS.length - 1;
  const visivel = interpolate(f, [INICIOS[iOutro], INICIOS[iOutro] + 8], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Fundo />
      <TransitionSeries>
        {CENAS.map(({ nome, dur, C, entrada }, i) => (
          <Fragment key={nome}>
            {i > 0 && entrada && <TransitionSeries.Transition presentation={entrada.tipo} timing={linearTiming({ durationInFrames: entrada.dur })} />}
            <TransitionSeries.Sequence name={nome} durationInFrames={dur}>
              <C n={n} k={k} dur={dur} />
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
      <Moldura episodio={n.episodio} visivel={visivel} etapa={etapa} abas={abas} />
    </AbsoluteFill>
  );
};
