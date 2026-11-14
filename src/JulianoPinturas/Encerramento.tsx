import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Scribble, Sfx, Shot, useP, Word } from "./fx";
import { BACK, C, CLAMP, FONT } from "./theme";

/** Duas palavras desencontradas sobre uma sombra difusa. */
const Valores = () => {
  const blob = useP(0, 14);
  return (
    <Shot dur={60}>
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,0,0,0.13) 0%, rgba(0,0,0,0) 65%)",
          scale: String(0.5 + 0.5 * blob),
        }}
      />
      <Word size={64} weight={600} color={C.grey} mode="up">
        sempre com
      </Word>
      <div style={{ alignSelf: "center", translate: "-90px 0", marginTop: 10 }}>
        <Word size={120} weight={800} delay={4} mode="left">
          dedicação
        </Word>
      </div>
      <div style={{ alignSelf: "center", translate: "90px 0", marginTop: -20 }}>
        <Word size={120} weight={800} color={C.orange} delay={14} mode="right">
          compromisso
        </Word>
      </div>
    </Shot>
  );
};

/** Palavras se juntam e viram um botão. */
const EntreEmContato = () => {
  const frame = useCurrentFrame();
  const pill = useP(12, 10, BACK);
  return (
    <Shot dur={45}>
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          padding: "30px 64px",
          borderRadius: 999,
          background: `rgba(28,28,28,${pill})`,
          scale: String(0.9 + 0.1 * pill),
        }}
      >
        {["Entre", "em", "contato"].map((w, i) => (
          <div
            key={w}
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 84,
              color: pill > 0.5 ? C.white : C.ink,
              translate: `0 ${interpolate(frame, [i * 3, i * 3 + 10], [i % 2 ? 120 : -120, 0], CLAMP)}px`,
              opacity: interpolate(frame, [i * 3, i * 3 + 6], [0, 1], CLAMP),
            }}
          >
            {w}
          </div>
        ))}
      </div>
    </Shot>
  );
};

const Assinatura = () => {
  const frame = useCurrentFrame();
  const logo = useP(0, 14, BACK);
  const wa = useP(20, 12, BACK);
  return (
    <Shot dur={135} exit="none">
      <Img
        src={staticFile("img/logo.png")}
        style={{
          width: 520,
          scale: String(logo),
          rotate: `${(1 - logo) * -12}deg`,
          filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.18))",
        }}
      />
      <div style={{ height: 40 }} />
      <Word size={72} weight={800} delay={10} mode="up">
        O Juliano Pinturas
      </Word>
      <div style={{ height: 40 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          background: C.ink,
          borderRadius: 999,
          padding: "18px 46px 18px 22px",
          scale: String(wa),
        }}
      >
        <Img src={staticFile("img/whatsapp.png")} style={{ width: 96 }} />
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 70,
            color: C.white,
            letterSpacing: "-0.01em",
          }}
        >
          (62) 99113-2531
        </div>
      </div>
      <div style={{ height: 70 }} />
      <Word size={64} weight={600} color={C.mid} delay={40} mode="up">
        Várias soluções,
      </Word>
      <Word size={84} weight={800} color={C.orange} delay={46} mode="up">
        em um só lugar.
      </Word>
      <div
        style={{
          marginTop: -10,
          opacity: interpolate(frame, [52, 54], [0, 1], CLAMP),
        }}
      >
        <Scribble width={560} delay={54} />
      </div>
    </Shot>
  );
};

export const Encerramento: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence name="dedicação · compromisso" durationInFrames={60}>
      <Valores />
    </Sequence>
    <Sequence name="Entre em contato" from={60} durationInFrames={45}>
      <EntreEmContato />
    </Sequence>
    <Sequence name="Assinatura" from={105} durationInFrames={135}>
      <Assinatura />
    </Sequence>

    <Sfx at={4} src="whip.wav" volume={0.3} />
    <Sfx at={14} src="whip.wav" volume={0.3} />
    <Sfx at={60} src="whoosh.wav" volume={0.25} />
    <Sfx at={72} src="pop.wav" />
    <Sfx at={105} src="pop.wav" volume={0.5} />
    <Sfx at={125} src="click.wav" volume={0.5} />
    <Sfx at={159} src="whoosh.wav" volume={0.25} />
  </AbsoluteFill>
);
