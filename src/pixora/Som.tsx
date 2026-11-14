import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { HALF, NARRACAO, START } from "./timeline";
import { SELECT_AT } from "./scenes/Cena05Estilos";
import { C08 } from "./scenes/Cena08ProvaSocial";
import { C09 } from "./scenes/Cena09Beneficios";

type Sfx = "whoosh" | "tap" | "pop" | "ding" | "impact";

/** Início absoluto das cenas que entram com desfoque cruzado. */
const abs = (scene: number) => START[scene] - HALF;

const CUES: { at: number; sfx: Sfx; volume: number }[] = [
  { at: 0, sfx: "whoosh", volume: 0.35 }, // iPhone sobe
  { at: 94, sfx: "whoosh", volume: 0.6 }, // zoom pela tela
  { at: START[2], sfx: "impact", volume: 0.9 }, // corte seco para preto
  ...[3, 4, 5, 6, 7, 8, 9].map((s) => ({ at: START[s] - 10, sfx: "whoosh" as Sfx, volume: 0.4 })),
  { at: abs(3) + 14, sfx: "pop", volume: 0.45 }, // P revelado
  ...SELECT_AT.map((f) => ({ at: abs(4) + f, sfx: "tap" as Sfx, volume: 0.6 })),
  { at: abs(6) + 10, sfx: "pop", volume: 0.55 }, // 🎙️
  { at: abs(7) + C08.notif, sfx: "tap", volume: 0.5 },
  { at: abs(7) + C08.msg1, sfx: "pop", volume: 0.45 },
  { at: abs(7) + C08.msg2, sfx: "pop", volume: 0.45 },
  { at: abs(8) + C09.check, sfx: "ding", volume: 0.6 }, // Pix
  ...C09.items.map((f) => ({ at: abs(8) + f, sfx: "pop" as Sfx, volume: 0.5 })),
  { at: START[10], sfx: "impact", volume: 0.9 }, // flash para o logo
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
