import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EP01 } from "./sincronia";
import { calcular } from "./calc";
import { pontes } from "./pontes";
import type { Negocio } from "./tipos";
import { Fundo } from "./ui/Fundo";
import { Ponte } from "./ui/Ponte";
import { Cardapio, Chute, Gancho, Loja } from "./cenas/Abertura";
import { Custo } from "./cenas/Custo";
import { App, Erro, Sobra } from "./cenas/Taxa";
import { Divisao, Formula } from "./cenas/Preco";
import { Frase, Mes } from "./cenas/Lucro";
import { Comenta, Outro, Produto } from "./cenas/Final";
import type { CenaProps } from "./cenas/props";

/** Linha do tempo: cortes secos entre cenas, costurados por elementos-ponte. */
export const CENAS: { nome: string; dur: number; C: React.FC<CenaProps> }[] = [
  { nome: "Gancho", dur: 95, C: Gancho },
  { nome: "Loja", dur: 100, C: Loja },
  { nome: "Chute", dur: 80, C: Chute },
  { nome: "Cardápio", dur: 75, C: Cardapio },
  { nome: "Custo", dur: 240, C: Custo },
  { nome: "Erro", dur: 70, C: Erro },
  { nome: "App", dur: 150, C: App },
  { nome: "Sobra", dur: 75, C: Sobra },
  { nome: "Fórmula", dur: 150, C: Formula },
  { nome: "Divisão", dur: 105, C: Divisao },
  { nome: "Mês", dur: 170, C: Mes },
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
  return <AbsoluteFill style={{ opacity: saida }}>{children}</AbsoluteFill>;
};

export const Episodio: React.FC<Negocio> = (n) => {
  const k = calcular(n);
  const defs = pontes(k);
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
            {nome === "Outro" ? <C n={n} k={k} dur={dur} ponte={{ entra: entrada, sai }} marcas={EP01.cenas[nome].marcas} /> : (
              <Palco dur={dur}>
                <C n={n} k={k} dur={dur} ponte={{ entra: entrada, sai }} marcas={EP01.cenas[nome].marcas} />
              </Palco>
            )}
          </Sequence>
        );
      })}
      {CENAS.map(({ nome }, i) => (defs[nome] ? <Ponte key={nome} def={defs[nome]} corte={INICIOS[i]} /> : null))}
    </AbsoluteFill>
  );
};
