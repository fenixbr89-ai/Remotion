import "@fontsource/baloo-2/800.css";
import "@fontsource/poppins/700.css";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COR, PRODUTOS } from "./config";
import { Abertura, ConfiraPrecos, Final, ParaLevarMais, POR_PRODUTO, Produtos, TemMais, VoceEncontra } from "./Cenas";

// Duração de cada cena (frames a 30fps)
export const CENAS = [
  { nome: "Abertura", dur: 200, C: Abertura },
  { nome: "Você encontra", dur: 170, C: VoceEncontra },
  { nome: "Para levar mais", dur: 120, C: ParaLevarMais },
  { nome: "Confira os preços", dur: 195, C: ConfiraPrecos },
  { nome: "Produtos", dur: PRODUTOS.length * POR_PRODUTO, C: Produtos },
  { nome: "E tem mais", dur: 45, C: TemMais },
  { nome: "Final", dur: 300, C: Final },
];

export const DURACAO_TOTAL = CENAS.reduce((s, c) => s + c.dur, 0);

// Faixa laranja diagonal que varre a tela entre as cenas
const Varredura: React.FC<{ em: number }> = ({ em }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [em - 10, em + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  if (t <= 0 || t >= 1) return null;
  const x = interpolate(t, [0, 1], [-3200, 2400]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -1200,
          left: x,
          width: 2800,
          height: 4400,
          rotate: "18deg",
          display: "flex",
        }}
      >
        <div style={{ width: 160, background: "#ffd04a" }} />
        <div style={{ flex: 1, background: `linear-gradient(90deg, ${COR.laranja}, ${COR.laranjaEscuro})` }} />
        <div style={{ width: 160, background: "#ffd04a" }} />
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
    <AbsoluteFill style={{ backgroundColor: COR.verde }}>
      {seqs}
      {cortes.map((c) => (
        <Varredura key={c} em={c} />
      ))}
    </AbsoluteFill>
  );
};
