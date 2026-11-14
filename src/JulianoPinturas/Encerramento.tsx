import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Sfx, Shot, T, useEase, useSpring, Wallpaper } from "./kit";
import { C, CLAMP, FONT } from "./theme";

const VALORES = ["Dedicação.", "Responsabilidade.", "Compromisso."];

/** Minimalismo + tipografia: um valor por vez, três pontos indicando o progresso. */
const Valores = () => {
  const frame = useCurrentFrame();
  return (
    <Shot dur={60} bg={C.light}>
      {VALORES.map((v, i) => (
        <Sequence key={v} from={i * 20} durationInFrames={20} layout="none">
          <div style={{ position: "absolute", top: 860, width: "100%" }}>
            <T size={i === 1 ? 110 : 130} gradient={i === 2} dur={8}>
              {v}
            </T>
          </div>
        </Sequence>
      ))}
      <div
        style={{
          position: "absolute",
          top: 1120,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 22,
        }}
      >
        {VALORES.map((v, i) => {
          const active = frame >= i * 20;
          return (
            <div
              key={v}
              style={{
                width: frame >= i * 20 && frame < (i + 1) * 20 ? 60 : 18,
                height: 18,
                borderRadius: 9,
                background: active ? C.orange : C.hair,
              }}
            />
          );
        })}
      </div>
    </Shot>
  );
};

/** UI: cartão de contato sobe como uma "sheet" do iOS. */
const ContactSheet = () => {
  const frame = useCurrentFrame();
  const sheet = useSpring(4, 18, 140);
  const press = interpolate(frame, [70, 74, 82], [1, 0.94, 1], CLAMP);
  const tag = useEase(84, 18);
  return (
    <Shot dur={165} bg="#0B0B0C" out={false}>
      <Wallpaper dark />
      <div
        style={{
          position: "absolute",
          top: 240,
          width: "100%",
          opacity: 1 - tag,
        }}
      >
        <T size={56} weight={600} color={C.grey} delay={2}>
          Precisou de algum serviço?
        </T>
        <T size={96} color={C.white} delay={6}>
          Chame o Juliano.
        </T>
      </div>
      {/* frase final, aparece no lugar do título */}
      <div
        style={{ position: "absolute", top: 240, width: "100%", opacity: tag }}
      >
        <T size={96} color={C.white} delay={84}>
          Várias soluções,
        </T>
        <T size={96} gradient delay={88}>
          em um só lugar.
        </T>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1340,
          background: C.white,
          borderRadius: "70px 70px 0 0",
          translate: `0 ${(1 - sheet) * 1400}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 30,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            width: 110,
            height: 12,
            borderRadius: 6,
            background: C.hair,
          }}
        />
        <Img
          src={staticFile("img/logo.png")}
          style={{
            width: 420,
            marginTop: 60,
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
          }}
        />
        <div style={{ height: 40 }} />
        <T size={72} delay={20}>
          O Juliano Pinturas
        </T>
        <div style={{ height: 14 }} />
        <T size={44} weight={500} color={C.grey} delay={24}>
          Prestadora de serviços
        </T>
        <div style={{ height: 50 }} />
        <div
          style={{
            width: 900,
            borderRadius: 40,
            background: C.light,
            padding: "30px 44px",
            boxSizing: "border-box",
            opacity: useEase(30, 12),
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 34,
              color: C.grey,
            }}
          >
            celular
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 64,
              color: C.text,
              letterSpacing: "-0.02em",
            }}
          >
            (62) 99113-2531
          </div>
        </div>
        <div style={{ height: 34 }} />
        <div
          style={{
            width: 900,
            height: 150,
            borderRadius: 40,
            background: C.orange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            scale: String(press * useSpring(40, 14, 180)),
          }}
        >
          <Img src={staticFile("img/whatsapp.png")} style={{ width: 84 }} />
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 52,
              color: C.white,
              letterSpacing: "-0.02em",
            }}
          >
            Solicite seu orçamento
          </div>
        </div>
      </div>
    </Shot>
  );
};

export const Encerramento: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.light }}>
    <Sequence name="Valores" durationInFrames={60}>
      <Valores />
    </Sequence>
    <Sequence name="Contato (sheet)" from={60} durationInFrames={165}>
      <ContactSheet />
    </Sequence>

    <Sfx at={0} src="click.wav" volume={0.2} />
    <Sfx at={20} src="click.wav" volume={0.2} />
    <Sfx at={40} src="click.wav" volume={0.2} />
    <Sfx at={62} src="whoosh.wav" volume={0.3} />
    <Sfx at={130} src="click.wav" volume={0.5} />
    <Sfx at={134} src="ding.wav" volume={0.3} />
  </AbsoluteFill>
);
