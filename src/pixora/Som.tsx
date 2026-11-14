import React from "react";
import { interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  FPS,
  IDX,
  NARRACAO,
  NARRACAO_ARQUIVO,
  NARRACAO_CLIPS,
  START,
  sceneFrom,
} from "./timeline";
import { C01 } from "./scenes/Cena01Gancho";
import { SELECT_AT } from "./scenes/Cena05Estilos";
import { C08 } from "./scenes/Cena08ProvaSocial";
import { C09 } from "./scenes/Cena09Beneficios";
import { ZOOM_AT } from "./scenes/Cena10Chamada";

type Sfx = "whoosh" | "tap" | "pop" | "ding" | "impact";

/** Frame absoluto de um evento local de uma cena. */
const at = (scene: number, local: number) => sceneFrom(scene) + local;

const CUES: { at: number; sfx: Sfx; volume: number }[] = [
  { at: 0, sfx: "whoosh", volume: 0.35 }, // iPhone sobe
  { at: at(IDX.c01, C01.tap), sfx: "tap", volume: 0.7 }, // play no vídeo ruim
  { at: 92, sfx: "whoosh", volume: 0.6 }, // zoom pela tela
  { at: at(IDX.c02, 122), sfx: "whoosh", volume: 0.45 }, // ponto cresce
  { at: START[IDX.c03], sfx: "impact", volume: 0.85 }, // preto
  { at: at(IDX.c03, 16), sfx: "tap", volume: 0.5 }, // risco em "parado"
  { at: at(IDX.c03, 68), sfx: "whoosh", volume: 0.5 }, // círculo branco
  ...[IDX.c06, IDX.c07, IDX.c08, IDX.c09, IDX.c10].map((k) => ({
    at: START[k] - 8,
    sfx: "whoosh" as Sfx,
    volume: 0.4,
  })),
  ...SELECT_AT.map((f) => ({ at: at(IDX.c05, f), sfx: "tap" as Sfx, volume: 0.6 })),
  { at: at(IDX.c07, 12), sfx: "pop", volume: 0.55 }, // 🎙️
  { at: at(IDX.c08, C08.msg1), sfx: "pop", volume: 0.45 },
  { at: at(IDX.c08, C08.msg2), sfx: "pop", volume: 0.45 },
  { at: at(IDX.c08, C08.msg3), sfx: "pop", volume: 0.45 },
  { at: at(IDX.c09, C09.amount), sfx: "ding", volume: 0.6 }, // R$ 50,00
  ...C09.items.map((f) => ({ at: at(IDX.c09, f), sfx: "pop" as Sfx, volume: 0.5 })),
  { at: at(IDX.c10, ZOOM_AT + 4), sfx: "whoosh", volume: 0.6 }, // entra no celular
  { at: START[IDX.c12], sfx: "impact", volume: 0.85 }, // logo
];

/** A trilha abaixa enquanto a voz fala (com rampas suaves de 6 frames). */
const trilhaVolume = (f: number, narracao: boolean) => {
  if (!narracao) return 0.55;
  const speaking = Math.max(
    0,
    ...NARRACAO.map((n) =>
      interpolate(f, [n.from - 6, n.from, n.to, n.to + 6], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );
  return interpolate(speaking, [0, 1], [0.5, 0.2]);
};

export const Som: React.FC<{ readonly narracao: boolean }> = ({ narracao }) => (
  <>
    <Audio
      name="Trilha"
      src={staticFile("audio/trilha.mp3")}
      volume={(f) => trilhaVolume(f, narracao)}
    />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} name={`SFX ${c.sfx}`} layout="none">
        <Audio src={staticFile(`audio/${c.sfx}.wav`)} volume={c.volume * (narracao ? 0.8 : 1)} />
      </Sequence>
    ))}
    {narracao
      ? NARRACAO_CLIPS.map((c, i) => (
          <Sequence
            key={i}
            from={Math.round(c.em * FPS)}
            durationInFrames={Math.ceil((c.ate - c.de) * FPS)}
            name={`Narração ${i + 1}`}
            layout="none"
          >
            <Audio
              src={staticFile(NARRACAO_ARQUIVO)}
              trimBefore={Math.round(c.de * FPS)}
              trimAfter={Math.round(c.ate * FPS)}
              volume={1}
            />
          </Sequence>
        ))
      : null}
  </>
);
