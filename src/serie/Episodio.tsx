import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EP01 } from "./sincronia";
import { calcular } from "./calc";
import { pontes } from "./pontes";
import type { Negocio } from "./tipos";
import { Formas } from "./ui/Formas";
import { Fundo } from "./ui/Fundo";
import { Moldura } from "./ui/Moldura";
import { Ponte } from "./ui/Ponte";
import { Cardapio, Chute, Gancho, Loja } from "./cenas/Abertura";
import { Custo } from "./cenas/Custo";
import { App, Erro, Sobra } from "./cenas/Taxa";
import { Divisao, Formula } from "./cenas/Preco";
import { Frase, Mes } from "./cenas/Lucro";
import { Comenta, Outro, Produto } from "./cenas/Final";
import type { CenaProps } from "./cenas/props";

/** Linha do tempo: cortes secos entre cenas, costurados por elementos-ponte. `etapa` = aba ativa. */
export const CENAS: { nome: string; dur: number; C: React.FC<CenaProps>; etapa?: number }[] = [
  { nome: "Gancho", dur: 95, C: Gancho },
  { nome: "Loja", dur: 100, C: Loja },
  { nome: "Chute", dur: 80, C: Chute },
  { nome: "Cardápio", dur: 75, C: Cardapio },
  { nome: "Custo", dur: 240, C: Custo, etapa: 0 },
  { nome: "Erro", dur: 70, C: Erro, etapa: 1 },
  { nome: "App", dur: 150, C: App, etapa: 1 },
  { nome: "Sobra", dur: 75, C: Sobra, etapa: 1 },
  { nome: "Fórmula", dur: 150, C: Formula, etapa: 2 },
  { nome: "Divisão", dur: 105, C: Divisao, etapa: 2 },
  { nome: "Mês", dur: 170, C: Mes, etapa: 3 },
  { nome: "Frase", dur: 65, C: Frase },
  { nome: "Produto", dur: 165, C: Produto },
  { nome: "Comenta", dur: 150, C: Comenta },
  { nome: "Outro", dur: 130, C: Outro },
];

// cortes nos tempos da narração: cada cena começa quando a fala dela começa
const FPS = 30;
const INICIOS = CENAS.map((c) => Math.round(EP01.cenas[c.nome].inicio * FPS));
export const DURACAO = Math.round(EP01.fim * FPS);
CENAS.forEach((c, i) => {
  c.dur = (INICIOS[i + 1] ?? DURACAO) - INICIOS[i];
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Entrada/saída do miolo da cena: os elementos que não são ponte somem um instante antes do corte. */
const Palco: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const saida = interpolate(f, [dur - 7, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  return <AbsoluteFill style={{ opacity: saida, scale: `${0.97 + saida * 0.03}` }}>{children}</AbsoluteFill>;
};

export const Episodio: React.FC<Negocio> = (n) => {
  const k = calcular(n);
  const f = useCurrentFrame();
  const defs = pontes(k);
  const atual = INICIOS.reduce((acc, ini, i) => (f >= ini ? i : acc), 0);
  const iAbas = CENAS.findIndex((c) => c.etapa === 0);
  const iFimAbas = CENAS.findIndex((c, i) => i > iAbas && c.etapa === undefined);
  const etapa = CENAS[atual].etapa ?? (atual >= iFimAbas ? 4 : null);
  const abas = Math.min(interpolate(f, [INICIOS[iAbas], INICIOS[iAbas] + 10], [0, 1], clamp), interpolate(f, [INICIOS[iFimAbas], INICIOS[iFimAbas] + 10], [1, 0], clamp));
  const iOutro = CENAS.length - 1;
  const visivel = interpolate(f, [INICIOS[iOutro], INICIOS[iOutro] + 6], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Fundo />
      <Audio src={staticFile(EP01.audio)} />
      {CENAS.map(({ nome, dur, C }, i) => {
        const ch = defs[nome]?.chaves;
        const entrada = ch ? ch[ch.length - 1].t : 0;
        const proxima = CENAS[i + 1] ? defs[CENAS[i + 1].nome]?.chaves[0].t : undefined;
        const sai = proxima !== undefined ? dur + proxima : dur;
        return (
          <Sequence key={nome} name={nome} from={INICIOS[i]} durationInFrames={dur}>
            {nome !== "Outro" && <Formas semente={i + 1} dur={dur} />}
            {nome === "Outro" ? <C n={n} k={k} dur={dur} ponte={{ entra: entrada, sai }} marcas={EP01.cenas[nome].marcas} /> : (
              <Palco dur={dur}>
                <C n={n} k={k} dur={dur} ponte={{ entra: entrada, sai }} marcas={EP01.cenas[nome].marcas} />
              </Palco>
            )}
          </Sequence>
        );
      })}
      <Moldura episodio={n.episodio} visivel={visivel} etapa={etapa} abas={abas} />
      {CENAS.map(({ nome }, i) => (defs[nome] ? <Ponte key={nome} def={defs[nome]} corte={INICIOS[i]} /> : null))}
    </AbsoluteFill>
  );
};
