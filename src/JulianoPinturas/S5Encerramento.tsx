import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Atmosphere, Display, Flash, Kicker, PaintStroke, Reveal, Sfx, Shot } from "./components";
import { LogoReveal } from "./S1Abertura";
import { C, CLAMP, EASE_OUT, SANS } from "./theme";

const Precisou = () => (
  <Shot dur={30} bg={C.white} enter="zoom" exit="cut">
    <div style={{ position: "absolute", left: 90, right: 90, top: 680 }}>
      <Reveal delay={1}>
        <Display size={150} color={C.black}>
          Precisou de
        </Display>
      </Reveal>
      <Reveal delay={4}>
        <Display size={150} color={C.black}>
          algum
        </Display>
      </Reveal>
      <Reveal delay={7}>
        <Display size={190} color={C.orange}>
          serviço?
        </Display>
      </Reveal>
    </div>
  </Shot>
);

const Chame = () => (
  <Shot dur={30} bg={C.black} enter="up" exit="zoom">
    <Atmosphere />
    <div style={{ position: "absolute", left: 90, right: 90, top: 700 }}>
      <Reveal delay={1}>
        <Display size={120}>Chame o</Display>
      </Reveal>
      <Reveal delay={4}>
        <Display size={170}>Juliano</Display>
      </Reveal>
      <Reveal delay={7}>
        <Display size={190} color={C.orange}>
          Pinturas!
        </Display>
      </Reveal>
    </div>
  </Shot>
);

const PHONE = "(62) 99113-2531";

const Contato = () => {
  const frame = useCurrentFrame();
  const LOGO = 600;
  const LOGO_Y = 470;
  const trace = interpolate(frame, [12, 40], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const wa = interpolate(frame, [26, 38], [0, 1], {
    ...CLAMP,
    easing: Easing.spring({ damping: 9, stiffness: 180 }),
  });
  const punch = interpolate(frame, [120, 124, 134], [1, 1.08, 1], CLAMP);
  return (
    <Shot dur={180} bg={C.black} enter="cut" exit="cut">
      <Atmosphere y={25} />
      <LogoReveal size={LOGO} y={LOGO_Y} />
      {/* contorno laranja percorrendo a peça */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={540 - LOGO / 2 - 22}
          y={LOGO_Y - LOGO / 2 - 22}
          width={LOGO + 44}
          height={LOGO + 44}
          rx={70}
          fill="none"
          stroke={C.orange}
          strokeWidth={8}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - trace}
        />
      </svg>

      {/* WhatsApp + telefone */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <Img
          src={staticFile("img/whatsapp.png")}
          style={{
            width: 150,
            scale: String(wa),
            rotate: `${(1 - wa) * -40}deg`,
          }}
        />
        <div style={{ display: "flex" }}>
          {PHONE.split("").map((ch, i) => {
            const d = 30 + i * 1.2;
            const p = interpolate(frame, [d, d + 6], [0, 1], { ...CLAMP, easing: EASE_OUT });
            return (
              <Display
                key={i}
                size={112}
                style={{
                  opacity: p,
                  translate: `0 ${30 * (1 - p)}px`,
                  whiteSpace: "pre",
                }}
              >
                {ch}
              </Display>
            );
          })}
        </div>
      </div>

      {/* chamada comercial */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 44,
            color: C.white,
            opacity: interpolate(frame, [48, 56], [0, 1], CLAMP),
          }}
        >
          Entre em contato e
        </div>
        <div
          style={{
            background: C.orange,
            color: C.black,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 50,
            padding: "26px 56px",
            borderRadius: 999,
            scale: String(
              interpolate(frame, [52, 62], [0, 1], {
                ...CLAMP,
                easing: Easing.spring({ damping: 10, stiffness: 170 }),
              }),
            ),
          }}
        >
          solicite seu orçamento!
        </div>
      </div>

      {/* assinatura */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1380,
          textAlign: "center",
          scale: String(punch),
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Kicker delay={70}>O Juliano Pinturas</Kicker>
        </div>
        <div style={{ height: 20 }} />
        <Reveal delay={74}>
          <Display size={130}>Várias soluções,</Display>
        </Reveal>
        <Reveal delay={79}>
          <Display size={130} color={C.orange}>
            em um só lugar.
          </Display>
        </Reveal>
      </div>
      <PaintStroke d="M200 1745 C 420 1725, 660 1760, 880 1735" width={22} start={86} dur={10} seed={33} />
      <Flash at={120} color={C.orange} len={8} />
    </Shot>
  );
};

export const S5Encerramento: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <Sequence name="Precisou de algum serviço?" durationInFrames={30}>
      <Precisou />
    </Sequence>
    <Sequence name="Chame o Juliano Pinturas" from={30} durationInFrames={30}>
      <Chame />
    </Sequence>
    <Sequence name="Contato + assinatura" from={60} durationInFrames={180}>
      <Contato />
    </Sequence>

    <Sfx at={0} src="whoosh.wav" volume={0.5} />
    <Sfx at={30} src="whip.wav" volume={0.5} />
    <Sfx at={60} src="impacto.wav" volume={0.7} />
    <Sfx at={86} src="notificacao.wav" volume={0.6} />
    <Sfx at={112} src="pop.wav" volume={0.5} />
    <Sfx at={146} src="pincel.wav" volume={0.4} />
  </AbsoluteFill>
);
