import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Fundo } from "../ui/Fundo";
import { Ponte } from "../ui/Ponte";
import { Cta, Custo, Erro, Gancho, Preco, Sobra, type Cena02Props } from "./cenas";
import { CENAS02, DURACAO } from "./geo";
import { contaMarmita } from "./numeros";
import { PONTES02 } from "./pontes";

/** Troque para true quando houver public/audio/ep02/narracao.mp3 (a trilha abaixa sozinha). */
export const HAS_NARRATION = false;

const LISTA: { nome: keyof typeof CENAS02; C: React.FC<Cena02Props> }[] = [
  { nome: "gancho", C: Gancho },
  { nome: "custo", C: Custo },
  { nome: "erro", C: Erro },
  { nome: "preco", C: Preco },
  { nome: "sobra", C: Sobra },
  { nome: "cta", C: Cta },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Palco: React.FC<{ dur: number; ultima: boolean; children: React.ReactNode }> = ({ dur, ultima, children }) => {
  const f = useCurrentFrame();
  const saida = ultima ? 1 : interpolate(f, [dur - 7, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  return <AbsoluteFill style={{ opacity: saida }}>{children}</AbsoluteFill>;
};

/** Efeitos sonoros (frame absoluto → arquivo). Todos gerados por scripts/synth-audio.py. */
const SFX: [number, string, number?][] = [
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => [14 + i * 4, "pop", 0.35] as [number, string, number]),
  [26, "rise", 0.4],
  [40, "pop"],
  [46, "pop"],
  [52, "pop"],
  [129, "whoosh"],
  ...[0, 1, 2, 3, 4, 5].map((i) => [135 + 26 + i * 22, "pop", 0.45] as [number, string, number]),
  [300, "tick", 0.5],
  [330, "chime"],
  [414, "whoosh"],
  [426, "thud"],
  [468, "whoosh", 0.6],
  [498, "thud"],
  [594, "whoosh"],
  ...Array.from({ length: 17 }).map((_, i) => [627 + i * 3, "key", 0.35] as [number, string, number]),
  [693, "click"],
  [696, "pop"],
  [742, "tick", 0.5],
  [762, "chime"],
  [834, "whoosh"],
  [862, "pop"],
  [880, "pop"],
  [902, "rise", 0.4],
  [952, "chime"],
  [1014, "whoosh"],
  [1082, "click"],
  [1085, "sparkle"],
];

export const EP02Marmitaria: React.FC = () => {
  const k = contaMarmita();
  return (
    <AbsoluteFill>
      <Fundo />
      {LISTA.map(({ nome, C }, i) => {
        const { de, ate } = CENAS02[nome];
        const dur = ate - de;
        const ch = PONTES02[nome]?.chaves;
        const entra = ch ? ch[ch.length - 1].t : 0;
        const prox = LISTA[i + 1] ? PONTES02[LISTA[i + 1].nome]?.chaves[0].t : undefined;
        const sai = prox !== undefined ? dur + prox : dur;
        return (
          <Sequence key={nome} name={nome} from={de} durationInFrames={dur}>
            <Palco dur={dur} ultima={i === LISTA.length - 1}>
              <C k={k} dur={dur} ponte={{ entra, sai }} />
            </Palco>
          </Sequence>
        );
      })}
      {LISTA.map(({ nome }) => (PONTES02[nome] ? <Ponte key={nome} def={PONTES02[nome]} corte={CENAS02[nome].de} /> : null))}
      <Audio
        src={staticFile("audio/ep02/music.wav")}
        volume={(f) => interpolate(f, [0, 15, DURACAO - 30, DURACAO], [0, 1, 1, 0], clamp) * (HAS_NARRATION ? 0.12 : 0.35)}
      />
      {HAS_NARRATION && <Audio src={staticFile("audio/ep02/narracao.mp3")} />}
      {SFX.map(([t, som, vol], i) => (
        <Sequence key={i} from={t} durationInFrames={45} layout="none">
          <Audio src={staticFile(`audio/ep02/${som}.wav`)} volume={vol ?? 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
