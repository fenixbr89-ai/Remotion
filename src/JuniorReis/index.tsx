import type { FC } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./Background";
import { DUR, M, START } from "./lib";
import { S01, S02, S03, S04 } from "./scenes/S01_04";
import { S05, S06, S07, S08 } from "./scenes/S05_08";
import { S09, S10, S11, S12 } from "./scenes/S09_12";

const SCENES = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12];
const NAMES = [
  "01 Treino concluído",
  "02 Eu sou Júnior Reis",
  "03 Superar limites",
  "04 Como a gente chega lá",
  "05 Modalidades",
  "06 Evolução do treino",
  "07 Acompanhamento",
  "08 Consultoria",
  "09 Plano individual",
  "10 Logo",
  "11 Instagram",
  "12 WhatsApp",
];

export const JuniorReis: FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#050505" }}>
    <Background />
    {SCENES.map((Scene, i) => {
      const last = i === SCENES.length - 1;
      return (
        <Sequence
          key={i}
          name={NAMES[i]}
          from={START[i]}
          durationInFrames={last ? DUR[i] : DUR[i] + M}
          premountFor={30}
        >
          <Scene d={DUR[i]} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
