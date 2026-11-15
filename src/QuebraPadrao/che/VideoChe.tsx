import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { LogoQuebraPadrao } from "../Logo";
import { cores } from "../tema";
import { GraoFilme, VERMELHO } from "./base";
import { C1Gancho, C2Titulo, C3Nascimento, C4Moto, C5Guatemala, C6Fidel, C7Granma } from "./cenas1";
import { C8Vitoria, C9LadoEscuro, C10Ministro, C11Exportar, C12Morte, C13Mito, C14Final } from "./cenas2";

// [cena, duração em frames a 30 fps]
export const CENAS_CHE: [React.FC, number][] = [
  [C1Gancho, 240],
  [C2Titulo, 150],
  [C3Nascimento, 240],
  [C4Moto, 330],
  [C5Guatemala, 270],
  [C6Fidel, 240],
  [C7Granma, 300],
  [C8Vitoria, 240],
  [C9LadoEscuro, 330],
  [C10Ministro, 240],
  [C11Exportar, 300],
  [C12Morte, 270],
  [C13Mito, 300],
  [C14Final, 150],
];
export const DURACAO_CHE = CENAS_CHE.reduce((s, [, d]) => s + d, 0);

// Transição: tira de papel rasgado que passa pela tela
const Virada: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 9], [0, 1], { extrapolateRight: "clamp" });
  if (p >= 1) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          width: 700,
          left: -700 + p * 2500,
          background: cores.papel,
          transform: "rotate(8deg)",
          boxShadow: `-30px 0 0 ${VERMELHO}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const VideoChe: React.FC = () => {
  let inicio = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#131110" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,240,210,0.05), rgba(0,0,0,0.5) 85%)" }} />
      {CENAS_CHE.map(([Cena, dur], i) => {
        const de = inicio;
        inicio += dur;
        return (
          <Sequence key={i} from={de} durationInFrames={dur} premountFor={20}>
            <Cena />
            {i > 0 ? <Virada /> : null}
          </Sequence>
        );
      })}
      <Sequence from={CENAS_CHE[0][1]} durationInFrames={DURACAO_CHE - CENAS_CHE[0][1] - CENAS_CHE[CENAS_CHE.length - 1][1]}>
        <div style={{ position: "absolute", top: 120, left: 80 }}>
          <LogoQuebraPadrao escala={1.05} />
        </div>
      </Sequence>
      <GraoFilme />
    </AbsoluteFill>
  );
};
