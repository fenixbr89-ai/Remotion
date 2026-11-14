import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Atmosphere, Display, fitSize, Flash, Kicker, PaintStroke, Reveal, Sfx, Shot } from "./components";
import { CheckIcon } from "./icons";
import { palette } from "./ServiceShot";
import { C, CLAMP } from "./theme";

const IssoMesmo = () => {
  const frame = useCurrentFrame();
  const word = (d: number) =>
    interpolate(frame, [d, d + 8], [2.2, 1], {
      ...CLAMP,
      easing: Easing.bezier(0.05, 0.9, 0.1, 1),
    });
  return (
    <Shot dur={45} bg={C.orange} enter="cut" exit="zoom">
      <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center" }}>
        <Display size={250} color={C.black} style={{ scale: String(word(0)), opacity: frame >= 0 ? 1 : 0 }}>
          É isso
        </Display>
        <Display
          size={320}
          color={C.white}
          style={{ scale: String(word(8)), opacity: frame >= 8 ? 1 : 0 }}
        >
          mesmo!
        </Display>
      </div>
      <Flash at={0} len={5} />
      <Flash at={8} len={4} />
    </Shot>
  );
};

const Completa = () => (
  <Shot dur={90} bg={C.black} enter="zoom" exit="left">
    <Atmosphere y={55} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 560 }}>
      <Kicker delay={2}>O Juliano Pinturas é</Kicker>
      <div style={{ height: 30 }} />
      <Reveal delay={4}>
        <Display size={120}>Uma prestadora</Display>
      </Reveal>
      <Reveal delay={8}>
        <Display size={120}>de serviços</Display>
      </Reveal>
      <Reveal delay={14}>
        <Display size={fitSize("completa", 900, 270)} color={C.orange}>
          completa
        </Display>
      </Reveal>
    </div>
    <PaintStroke d="M60 1300 C 400 1250, 700 1330, 1040 1270" width={40} start={22} dur={10} seed={21} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 1400 }}>
      <Reveal delay={30}>
        <Display size={70} color={C.grey}>
          preparada para diferentes necessidades
        </Display>
      </Reveal>
    </div>
  </Shot>
);

const Valor: React.FC<{ word: string; bg: "white" | "black" | "orange"; enter: "right" | "up" | "left" }> = ({
  word,
  bg,
  enter,
}) => {
  const pal = palette(bg);
  return (
    <Shot dur={35} bg={pal.bg} enter={enter} exit="cut">
      {bg === "black" ? <Atmosphere /> : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 620,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        <CheckIcon size={220} accent={bg === "orange" ? C.black : C.orange} delay={2} />
        <Kicker color={pal.kick} delay={3}>
          sempre com
        </Kicker>
        <Display size={fitSize(word, 920, 230)} color={bg === "orange" ? C.white : pal.fg}>
          {word}
        </Display>
      </div>
    </Shot>
  );
};

export const S4Diferencial: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <Sequence name="É isso mesmo!" durationInFrames={45}>
      <IssoMesmo />
    </Sequence>
    <Sequence name="Prestadora completa" from={45} durationInFrames={90}>
      <Completa />
    </Sequence>
    <Sequence name="Dedicação" from={135} durationInFrames={35}>
      <Valor word="Dedicação" bg="white" enter="right" />
    </Sequence>
    <Sequence name="Responsabilidade" from={170} durationInFrames={35}>
      <Valor word="Responsabilidade" bg="black" enter="up" />
    </Sequence>
    <Sequence name="Compromisso" from={205} durationInFrames={35}>
      <Valor word="Compromisso" bg="orange" enter="left" />
    </Sequence>

    <Sfx at={0} src="impacto.wav" volume={0.9} />
    <Sfx at={8} src="impacto.wav" volume={0.5} />
    <Sfx at={43} src="whoosh.wav" volume={0.5} />
    <Sfx at={67} src="pincel.wav" volume={0.5} />
    <Sfx at={133} src="whip.wav" volume={0.5} />
    <Sfx at={140} src="pop.wav" volume={0.5} />
    <Sfx at={168} src="whip.wav" volume={0.5} />
    <Sfx at={175} src="pop.wav" volume={0.5} />
    <Sfx at={203} src="whip.wav" volume={0.5} />
    <Sfx at={210} src="pop.wav" volume={0.5} />
  </AbsoluteFill>
);
