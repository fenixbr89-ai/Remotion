import "@fontsource/baloo-2/800.css";
import "@fontsource/poppins/700.css";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COR } from "./config";
import { Abertura, DUR_ABERTURA, DUR_FINAL, DUR_GRADE, DUR_PRODUTOS, Final, Grade, Produtos } from "./Cenas";

// Ordem e duração das cenas (frames a 30fps)
export const CENAS = [
  { nome: "Abertura", dur: DUR_ABERTURA, C: Abertura },
  { nome: "Produtos", dur: DUR_PRODUTOS, C: Produtos },
  { nome: "Imperdíveis", dur: DUR_GRADE, C: Grade },
  { nome: "Final", dur: DUR_FINAL, C: Final },
];

export const DURACAO_TOTAL = CENAS.reduce((s, c) => s + c.dur, 0);

// Faixas vermelha e branca que cruzam a tela entre as cenas
const Transicao: React.FC<{ em: number }> = ({ em }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [em - 9, em + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  if (t <= 0 || t >= 1) return null;
  const x = interpolate(t, [0, 1], [-1500, 1300]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: x, width: 1300, display: "flex" }}>
        <div style={{ width: 70, background: COR.branco }} />
        <div style={{ flex: 1, background: COR.vermelho }} />
        <div style={{ width: 70, background: COR.branco }} />
      </div>
    </AbsoluteFill>
  );
};

export const OfertasVideo: React.FC = () => {
  let inicio = 0;
  const cortes: number[] = [];
  const seqs = CENAS.map(({ nome, dur, C }, i) => {
    const from = inicio;
    inicio += dur;
    if (i > 0) cortes.push(from);
    return (
      <Sequence key={nome} name={nome} from={from} durationInFrames={dur}>
        <C />
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: COR.azul }}>
      {seqs}
      {cortes.map((c) => (
        <Transicao key={c} em={c} />
      ))}
    </AbsoluteFill>
  );
};
