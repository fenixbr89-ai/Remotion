import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Logo } from "./Abertura";
import { C, CLAMP, EASE, SANS } from "./theme";
import { Sfx, Text } from "./ui";

/** 19–22s: os valores, um por batida dupla. */
const Valores: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.white }}>
    <div style={{ position: "absolute", top: 640, width: "100%" }}>
      <Text size={120} color={C.text}>
        Dedicação.
      </Text>
      <div style={{ height: 30 }} />
      <Text size={120} color={C.text} delay={30}>
        Responsabilidade.
      </Text>
      <div style={{ height: 30 }} />
      <Text size={120} gradient delay={60}>
        Compromisso.
      </Text>
    </div>
  </AbsoluteFill>
);

/** 22–30s: assinatura com logo, contato e frase final. */
const Assinatura: React.FC = () => {
  const frame = useCurrentFrame();
  const cta = interpolate(frame, [40, 56], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <Logo size={540} y={520} dark={false} />
      <div style={{ position: "absolute", top: 880, width: "100%" }}>
        <Text size={60} weight={600} color={C.text} delay={10}>
          O Juliano Pinturas
        </Text>
        <div style={{ height: 40 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Img
            src={staticFile("img/whatsapp.png")}
            style={{
              width: 108,
              opacity: interpolate(frame, [18, 30], [0, 1], {
                ...CLAMP,
                easing: EASE,
              }),
            }}
          />
          <Text size={92} color={C.text} delay={20}>
            (62) 99113-2531
          </Text>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 56 }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: "-0.01em",
              color: "#fff",
              background: C.orange,
              padding: "24px 54px",
              borderRadius: 999,
              opacity: cta,
              scale: String(0.94 + 0.06 * cta),
            }}
          >
            Solicite seu orçamento
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1440, width: "100%" }}>
        <Text size={84} color={C.text} delay={90}>
          Várias soluções,
        </Text>
        <Text size={84} gradient delay={100}>
          em um só lugar.
        </Text>
      </div>
    </AbsoluteFill>
  );
};

export const Encerramento: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.white }}>
    <Sequence name="Valores" durationInFrames={90}>
      <Valores />
    </Sequence>
    <Sequence name="Assinatura" from={90} durationInFrames={240}>
      <Assinatura />
    </Sequence>
    <Sfx at={0} src="click.wav" volume={0.2} />
    <Sfx at={30} src="click.wav" volume={0.2} />
    <Sfx at={60} src="click.wav" volume={0.2} />
    <Sfx at={88} src="whoosh.wav" volume={0.3} />
  </AbsoluteFill>
);
