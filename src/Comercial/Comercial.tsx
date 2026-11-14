import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Cena01Abertura } from "./Cena01Abertura";
import { Cena02Pintura } from "./Cena02Pintura";
import { Cena03Telhados } from "./Cena03Telhados";
import { Cena04Instalacoes } from "./Cena04Instalacoes";
import { Cena05Versatilidade } from "./Cena05Versatilidade";
import { Cena06Logo } from "./Cena06Logo";
import { clamp } from "./tema";

/** Duração de cada cena (inclui a sobreposição das transições). */
export const DURACOES = {
  abertura: 160,
  pintura: 230,
  telhados: 260,
  instalacoes: 290,
  versatilidade: 260,
  logo: 250,
};
export const TRANSICAO = 20;
export const DURACAO_TOTAL =
  Object.values(DURACOES).reduce((a, b) => a + b, 0) - TRANSICAO * 5; // 1350 = 45 s

const transicao = linearTiming({ durationInFrames: TRANSICAO });

// início de cada cena na linha do tempo principal
const inicios = Object.values(DURACOES).reduce<number[]>(
  (acc, d, i) => [
    ...acc,
    i === 0 ? 0 : acc[i - 1] + Object.values(DURACOES)[i - 1] - TRANSICAO,
  ],
  [],
);

export const Comercial: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAF9" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Cena 01 — Abertura"
          durationInFrames={160}
        >
          <Cena01Abertura />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={transicao}
        />
        <TransitionSeries.Sequence
          name="Cena 02 — Pintura"
          durationInFrames={230}
        >
          <Cena02Pintura />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transicao} />
        <TransitionSeries.Sequence
          name="Cena 03 — Telhados"
          durationInFrames={260}
        >
          <Cena03Telhados />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transicao} />
        <TransitionSeries.Sequence
          name="Cena 04 — Instalações"
          durationInFrames={290}
        >
          <Cena04Instalacoes />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transicao} />
        <TransitionSeries.Sequence
          name="Cena 05 — Versatilidade"
          durationInFrames={260}
        >
          <Cena05Versatilidade />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transicao} />
        <TransitionSeries.Sequence name="Cena 06 — Logo" durationInFrames={250}>
          <Cena06Logo />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Trilha */}
      <Audio
        src={staticFile("audio/trilha.wav")}
        volume={(f) =>
          0.32 *
          interpolate(
            f,
            [0, 30, DURACAO_TOTAL - 45, DURACAO_TOTAL],
            [0, 1, 1, 0],
            clamp,
          )
        }
      />
      {/* Efeitos discretos */}
      {inicios.slice(1).map((inicio) => (
        <Sequence
          key={inicio}
          from={inicio - 8}
          durationInFrames={30}
          name="Whoosh"
        >
          <Audio src={staticFile("audio/whoosh.wav")} volume={0.22} />
        </Sequence>
      ))}
      <Sequence from={8} durationInFrames={60} name="Linha">
        <Audio src={staticFile("audio/pincelada.wav")} volume={0.12} />
      </Sequence>
      {[0, 1, 2].map((i) => (
        <Sequence
          key={i}
          from={inicios[1] + 22 + i * 52}
          durationInFrames={45}
          name="Rolo"
        >
          <Audio src={staticFile("audio/pincelada.wav")} volume={0.2} />
        </Sequence>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Sequence
          key={i}
          from={inicios[3] + 25 + i * 32}
          durationInFrames={10}
          name="Pop"
        >
          <Audio src={staticFile("audio/pop.wav")} volume={0.18} />
        </Sequence>
      ))}
      <Sequence
        from={inicios[4] + 132}
        durationInFrames={10}
        name="Pop contato"
      >
        <Audio src={staticFile("audio/pop.wav")} volume={0.22} />
      </Sequence>
      <Sequence from={inicios[5] + 30} durationInFrames={105} name="Chime logo">
        <Audio src={staticFile("audio/chime.wav")} volume={0.25} />
      </Sequence>
    </AbsoluteFill>
  );
};
