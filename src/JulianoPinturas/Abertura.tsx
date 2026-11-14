import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, CLAMP, EASE } from "./theme";
import { Sfx, Text } from "./ui";

const WORDS = ["pintura?", "reformas?", "manutenção?"];

/** 0–3s: "Precisando de" fixo, palavras trocando no ritmo da batida. */
const Pergunta: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <div style={{ position: "absolute", top: 760, width: "100%" }}>
      <Text size={64} weight={600} color={C.grey}>
        Precisando de
      </Text>
    </div>
    {WORDS.map((w, i) => (
      <Sequence key={w} from={i * 30} durationInFrames={30} layout="none">
        <div style={{ position: "absolute", top: 860, width: "100%" }}>
          <Text size={150} gradient={i === 2} dur={10}>
            {w}
          </Text>
        </div>
      </Sequence>
    ))}
  </AbsoluteFill>
);

/** Logo original, sem alterações: surge com profundidade e um brilho laranja suave atrás. */
export const Logo: React.FC<{ size: number; y: number; dark?: boolean }> = ({
  size,
  y,
  dark = true,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 26], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        perspective: 1800,
      }}
    >
      {dark ? (
        <div
          style={{
            position: "absolute",
            inset: -160,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,107,0,0.35) 0%, rgba(255,107,0,0) 65%)",
            opacity: p,
          }}
        />
      ) : null}
      <Img
        src={staticFile("img/logo.png")}
        style={{
          width: "100%",
          height: "100%",
          opacity: p,
          scale: String(0.88 + 0.12 * p),
          rotate: `x ${18 * (1 - p)}deg`,
          filter: `blur(${(1 - p) * 16}px) drop-shadow(0 40px 60px rgba(0,0,0,${dark ? 0.6 : 0.18}))`,
        }}
      />
    </div>
  );
};

const Conheca: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <div style={{ position: "absolute", top: 380, width: "100%" }}>
      <Text size={60} weight={600} color={C.grey}>
        Então conheça
      </Text>
    </div>
    <Logo size={720} y={940} />
    <div style={{ position: "absolute", top: 1420, width: "100%" }}>
      <Text size={72} delay={14}>
        O Juliano Pinturas.
      </Text>
    </div>
  </AbsoluteFill>
);

export const Abertura: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <Sequence name="Precisando de…" durationInFrames={90}>
      <Pergunta />
    </Sequence>
    <Sequence name="Conheça + logo" from={90} durationInFrames={90}>
      <Conheca />
    </Sequence>
    <Sfx at={0} src="click.wav" volume={0.25} />
    <Sfx at={30} src="click.wav" volume={0.25} />
    <Sfx at={60} src="click.wav" volume={0.25} />
    <Sfx at={88} src="whoosh.wav" volume={0.3} />
  </AbsoluteFill>
);
