import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { NARRACAO, START, sceneFrom } from "./timeline";
import { C01 } from "./scenes/Cena01Gancho";
import { SELECT_AT } from "./scenes/Cena05Estilos";
import { C08 } from "./scenes/Cena08ProvaSocial";
import { C09 } from "./scenes/Cena09Beneficios";
import { ZOOM_AT } from "./scenes/Cena10Chamada";

type Sfx = "whoosh" | "tap" | "pop" | "ding" | "impact";

/** Frame absoluto de um evento local da cena n (1-based). */
const at = (n: number, local: number) => sceneFrom(n - 1) + local;

const CUES: { at: number; sfx: Sfx; volume: number }[] = [
  { at: 0, sfx: "whoosh", volume: 0.35 }, // iPhone sobe
  { at: at(1, C01.tap), sfx: "tap", volume: 0.7 }, // play no vídeo ruim
  { at: 92, sfx: "whoosh", volume: 0.6 }, // zoom pela tela
  { at: at(2, 122), sfx: "whoosh", volume: 0.45 }, // ponto cresce
  { at: START[2], sfx: "impact", volume: 0.85 }, // preto
  { at: at(3, 16), sfx: "tap", volume: 0.5 }, // risco em "parado"
  { at: at(3, 68), sfx: "whoosh", volume: 0.5 }, // círculo branco
  { at: at(4, 6), sfx: "pop", volume: 0.45 }, // P revelado
  ...[4, 5, 6, 7, 8].map((k) => ({ at: START[k] - 8, sfx: "whoosh" as Sfx, volume: 0.4 })),
  ...SELECT_AT.map((f) => ({ at: at(5, f), sfx: "tap" as Sfx, volume: 0.6 })),
  { at: at(7, 12), sfx: "pop", volume: 0.55 }, // 🎙️
  { at: at(8, C08.msg1), sfx: "pop", volume: 0.45 },
  { at: at(8, C08.msg2), sfx: "pop", volume: 0.45 },
  { at: at(8, C08.msg3), sfx: "pop", volume: 0.45 },
  { at: at(9, C09.amount), sfx: "ding", volume: 0.6 }, // R$ 50,00
  ...C09.items.map((f) => ({ at: at(9, f), sfx: "pop" as Sfx, volume: 0.5 })),
  { at: at(10, ZOOM_AT + 4), sfx: "whoosh", volume: 0.6 }, // entra no celular
  { at: START[11], sfx: "impact", volume: 0.85 }, // logo
];

export const Som: React.FC<{ readonly narracao: boolean }> = ({ narracao }) => (
  <>
    <Audio
      name="Trilha"
      src={staticFile("audio/trilha.mp3")}
      volume={narracao ? 0.32 : 0.55}
    />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} name={`SFX ${c.sfx}`} layout="none">
        <Audio src={staticFile(`audio/${c.sfx}.wav`)} volume={c.volume} />
      </Sequence>
    ))}
    {narracao
      ? NARRACAO.map((n, i) => (
          <Sequence key={i} from={n.from} name={`Narração ${i + 1}`} layout="none">
            <Audio
              src={staticFile(`narracao/cena-${String(i + 1).padStart(2, "0")}.mp3`)}
            />
          </Sequence>
        ))
      : null}
  </>
);
