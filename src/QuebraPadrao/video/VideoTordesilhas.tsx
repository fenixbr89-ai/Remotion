import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { LogoQuebraPadrao } from "../Logo";
import { cores } from "../tema";
import { Cena1, Cena2, Cena3, Cena4, Cena5, Cena6 } from "./Cenas";
import { GradeFundo } from "./util";

// [cena, duração] de cada cena, em frames (30 fps)
export const CENAS: [React.FC, number][] = [
  [Cena1, 100],
  [Cena2, 85],
  [Cena3, 95],
  [Cena4, 175],
  [Cena5, 120],
  [Cena6, 150],
];
export const DURACAO_TOTAL = CENAS.reduce((s, [, d]) => s + d, 0);

// "Corte com quebra": um flash de faixas no início de cada cena.
const Corte: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5], [1, 0], { extrapolateRight: "clamp" });
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[0.18, 0.47, 0.71].map((y, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${y * 100}%`,
            height: 10 + i * 6,
            background: i === 1 ? cores.destaque : cores.branco,
            opacity: o,
            transform: `translateX(${(1 - o) * (i % 2 ? 300 : -300)}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const VideoTordesilhas: React.FC = () => {
  let inicio = 0;
  const ultima = CENAS.length - 1;
  return (
    <AbsoluteFill style={{ backgroundColor: cores.fundo }}>
      <GradeFundo />
      {CENAS.map(([Cena, dur], i) => {
        const de = inicio;
        inicio += dur;
        return (
          <Sequence key={i} from={de} durationInFrames={dur} premountFor={15}>
            <Cena />
            {i > 0 ? <Corte /> : null}
          </Sequence>
        );
      })}
      {/* marca d'água no topo, some na cena final */}
      <Sequence durationInFrames={DURACAO_TOTAL - CENAS[ultima][1]}>
        <div style={{ position: "absolute", top: 120, left: 90 }}>
          <LogoQuebraPadrao escala={1.1} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
