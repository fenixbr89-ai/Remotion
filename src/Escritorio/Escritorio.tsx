import { AbsoluteFill, Sequence } from "remotion";
import {
  Abertura,
  Areas,
  Cena,
  Contato,
  Equipe,
  FADE,
  Fundo,
  Sobre,
} from "./Cenas";
import { C } from "./theme";

export type EscritorioProps = {
  /** Pasta das imagens. Vazio = public/site/ do projeto Remotion. */
  readonly baseUrl: string;
};

// Duração de cada cena em frames (30 fps). As cenas se sobrepõem por FADE frames.
const CENAS = [
  { id: "Abertura", dur: 165 },
  { id: "Areas", dur: 270 },
  { id: "Sobre", dur: 165 },
  { id: "Equipe", dur: 180 },
  { id: "Contato", dur: 180 },
] as const;

const inicios = CENAS.reduce<number[]>(
  (acc, c, i) => [...acc, i === 0 ? 0 : acc[i - 1] + CENAS[i - 1].dur - FADE],
  [],
);

export const ESCRITORIO_FPS = 30;
export const ESCRITORIO_DURACAO =
  inicios[inicios.length - 1] + CENAS[CENAS.length - 1].dur;
export const ESCRITORIO_W = 1080;
export const ESCRITORIO_H = 1920;

export const Escritorio: React.FC<EscritorioProps> = ({ baseUrl }) => {
  const conteudo: Record<(typeof CENAS)[number]["id"], React.ReactNode> = {
    Abertura: <Abertura baseUrl={baseUrl} />,
    Areas: <Areas />,
    Sobre: <Sobre baseUrl={baseUrl} />,
    Equipe: <Equipe baseUrl={baseUrl} />,
    Contato: <Contato baseUrl={baseUrl} />,
  };
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bk,
        // Isola o vídeo do CSS da página onde o Player é embutido.
        lineHeight: 1.2,
        fontWeight: 400,
        textTransform: "none",
        letterSpacing: "normal",
        textAlign: "left",
        color: C.wh,
      }}
    >
      <Fundo />
      {CENAS.map((c, i) => (
        <Sequence
          key={c.id}
          name={c.id}
          from={inicios[i]}
          durationInFrames={c.dur}
          premountFor={30}
        >
          <Cena dur={c.dur} entrada={i > 0} saida={i < CENAS.length - 1}>
            {conteudo[c.id]}
          </Cena>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
