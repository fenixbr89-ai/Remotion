import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "./theme";
import { Hero, Sfx, Text } from "./ui";

type Servico = {
  nome: string;
  titulo: string;
  sub: string;
  img: string;
  width: number;
  dark: boolean;
};

// Os 5 serviços principais
const SERVICOS: Servico[] = [
  {
    nome: "Pintura",
    titulo: "Pintura.",
    sub: "Residencial e comercial.",
    img: "img/house.png",
    width: 680,
    dark: false,
  },
  {
    nome: "Automotiva",
    titulo: "Pintura automotiva.",
    sub: "Acabamento de especialista.",
    img: "img/car.png",
    width: 600,
    dark: true,
  },
  {
    nome: "Reformas",
    titulo: "Pequenas reformas.",
    sub: "Do reparo ao acabamento.",
    img: "img/bricks.png",
    width: 660,
    dark: false,
  },
  {
    nome: "Hidráulica",
    titulo: "Hidráulica.",
    sub: "Vazamentos e caixas d'água.",
    img: "img/shower.png",
    width: 600,
    dark: true,
  },
  {
    nome: "Elétrica",
    titulo: "Elétrica.",
    sub: "Instalações e reparos.",
    img: "img/bulb.png",
    width: 560,
    dark: false,
  },
];

const SHOT = 60; // 2s por serviço (4 batidas)

const ServicoShot: React.FC<{ s: Servico }> = ({ s }) => (
  <AbsoluteFill style={{ backgroundColor: s.dark ? C.black : C.white }}>
    <div style={{ position: "absolute", top: 360, left: 80, right: 80 }}>
      <Text
        size={s.titulo.length > 12 ? 104 : 140}
        color={s.dark ? C.white : C.text}
      >
        {s.titulo}
      </Text>
      <div style={{ height: 28 }} />
      <Text size={52} weight={500} color={C.grey} delay={5}>
        {s.sub}
      </Text>
    </div>
    <Hero src={s.img} width={s.width * 1.15} y={1120} delay={3} dark={s.dark} />
  </AbsoluteFill>
);

const MAIS = [
  "Telhados e calhas",
  "Limpeza pós-obra",
  "Instalação de TVs",
  "Calçadas",
  "Capina e jardinagem",
];

const EMuitoMais: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <div style={{ position: "absolute", top: 560, width: "100%" }}>
      <Text size={140}>E muito mais.</Text>
      <div style={{ height: 70 }} />
      {MAIS.map((m, i) => (
        <Text
          key={m}
          size={56}
          weight={500}
          color={C.grey}
          delay={10 + i * 5}
          style={{ marginBottom: 22 }}
        >
          {m}
        </Text>
      ))}
    </div>
  </AbsoluteFill>
);

export const Servicos: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    {SERVICOS.map((s, i) => (
      <Sequence
        key={s.nome}
        name={s.nome}
        from={i * SHOT}
        durationInFrames={SHOT}
      >
        <ServicoShot s={s} />
      </Sequence>
    ))}
    <Sequence
      name="E muito mais"
      from={SERVICOS.length * SHOT}
      durationInFrames={90}
    >
      <EMuitoMais />
    </Sequence>
    {SERVICOS.map((s, i) => (
      <Sfx key={s.nome} at={i * SHOT} src="whoosh.wav" volume={0.22} />
    ))}
    <Sfx at={SERVICOS.length * SHOT} src="whoosh.wav" volume={0.22} />
  </AbsoluteFill>
);
