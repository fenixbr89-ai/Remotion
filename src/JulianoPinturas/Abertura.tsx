import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import {
  Hand,
  Pill,
  Rings,
  Sfx,
  Shot,
  Sticker,
  Typewriter,
  useP,
  Word,
} from "./fx";
import { C, CLAMP } from "./theme";

const TaPrecisando = () => (
  <Shot dur={30}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Word size={190} weight={800} mode="zoom" dur={7}>
        Tá
      </Word>
      <Pill delay={5} size={96} style={{ marginTop: -20, marginLeft: 30 }}>
        precisando
      </Pill>
    </div>
  </Shot>
);

const Pintura = () => {
  const frame = useCurrentFrame();
  const clicked = frame >= 20;
  return (
    <Shot dur={45}>
      <Word size={64} weight={600} color={C.grey} mode="up">
        de uma
      </Word>
      <div style={{ height: 30 }} />
      <Pill
        delay={2}
        size={110}
        tilt={-5}
        outline={!clicked}
        bg={C.orange}
        style={{
          scale: clicked
            ? String(interpolate(frame, [20, 24, 30], [0.9, 1.08, 1], CLAMP))
            : undefined,
        }}
      >
        pintura
      </Pill>
      <Hand x={640} y={1000} delay={8} click={12} />
    </Shot>
  );
};

const Reforma = () => {
  const p = useP(0, 10);
  const frame = useCurrentFrame();
  return (
    <Shot dur={45}>
      <div
        style={{
          border: `6px dashed ${C.ink}`,
          borderRadius: 16,
          padding: "30px 46px",
          opacity: p,
          scale: String(0.9 + 0.1 * p),
          // the dashed frame "marches" like a selection box
          outline: "none",
          backgroundImage: `linear-gradient(90deg, rgba(255,107,0,${0.06 * p}) 0%, rgba(255,107,0,0) 100%)`,
        }}
      >
        <Word size={84} weight={700} delay={2}>
          reforma ou
        </Word>
        <Word size={104} weight={800} color={C.orange} delay={8} mode="left">
          manutenção?
        </Word>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1180,
          opacity: interpolate(frame, [14, 20], [0, 1], CLAMP),
        }}
      >
        <Word size={44} weight={500} color={C.grey} mode="none" delay={14}>
          hidráulica · elétrica · reparos
        </Word>
      </div>
    </Shot>
  );
};

const EntaoVoce = () => (
  <Shot dur={45} exit="left">
    <div style={{ position: "relative" }}>
      <Word size={140} weight={800} mode="right" dur={8}>
        Então
      </Word>
      <Word
        size={140}
        weight={800}
        mode="left"
        delay={4}
        dur={8}
        style={{ marginTop: -20 }}
      >
        você
      </Word>
      <Sticker
        src="img/roller.png"
        width={250}
        x={330}
        y={-210}
        delay={10}
        tilt={-40}
      />
    </div>
  </Shot>
);

const ChegouAo = () => {
  const p = useP(0, 20);
  return (
    <Shot dur={30}>
      <div
        style={{
          position: "absolute",
          right: -260,
          top: 120,
          width: 620,
          height: 620,
          borderRadius: "50%",
          border: `4px solid ${C.light}`,
          scale: String(0.6 + 0.4 * p),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -300,
          bottom: 60,
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: `4px solid ${C.light}`,
          scale: String(0.6 + 0.4 * p),
        }}
      />
      <Word size={110} weight={700} mode="blur">
        chegou ao
      </Word>
    </Shot>
  );
};

const LugarCerto = () => {
  const p = useP(0, 12);
  return (
    <Shot dur={60} bg={C.ink}>
      <Rings start={2} color="rgba(255,255,255,0.55)" />
      <div
        style={{
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: C.mid,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(p),
        }}
      >
        <Word size={92} weight={700} color={C.white} delay={6}>
          {"lugar\ncerto"}
        </Word>
      </div>
    </Shot>
  );
};

const Conheca = () => {
  const frame = useCurrentFrame();
  return (
    <Shot dur={60}>
      <AbsoluteFill
        style={{
          background: C.mid,
          opacity: interpolate(frame, [0, 4], [1, 0], CLAMP),
        }}
      />
      <Typewriter text="Conheça o" size={84} delay={3} speed={1.4} />
      <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
        <Word size={120} weight={800} mode="left" delay={20}>
          Juliano
        </Word>
        <Word size={120} weight={800} color={C.orange} mode="right" delay={24}>
          Pinturas
        </Word>
      </div>
    </Shot>
  );
};

export const Abertura: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence name="Tá precisando" durationInFrames={30}>
      <TaPrecisando />
    </Sequence>
    <Sequence name="de uma pintura (clique)" from={30} durationInFrames={45}>
      <Pintura />
    </Sequence>
    <Sequence name="reforma ou manutenção?" from={75} durationInFrames={45}>
      <Reforma />
    </Sequence>
    <Sequence name="Então você" from={120} durationInFrames={45}>
      <EntaoVoce />
    </Sequence>
    <Sequence name="chegou ao" from={165} durationInFrames={30}>
      <ChegouAo />
    </Sequence>
    <Sequence name="lugar certo" from={195} durationInFrames={60}>
      <LugarCerto />
    </Sequence>
    <Sequence
      name="Conheça o Juliano Pinturas"
      from={255}
      durationInFrames={60}
    >
      <Conheca />
    </Sequence>

    <Sfx at={0} src="whoosh.wav" volume={0.3} />
    <Sfx at={5} src="pop.wav" />
    <Sfx at={32} src="pop.wav" />
    <Sfx at={50} src="click.wav" volume={0.6} />
    <Sfx at={75} src="whoosh.wav" volume={0.3} />
    <Sfx at={120} src="whip.wav" volume={0.35} />
    <Sfx at={130} src="pop.wav" />
    <Sfx at={165} src="whoosh.wav" volume={0.3} />
    <Sfx at={195} src="pop.wav" />
    <Sfx at={258} src="click.wav" volume={0.25} />
    <Sfx at={262} src="click.wav" volume={0.25} />
    <Sfx at={266} src="click.wav" volume={0.25} />
    <Sfx at={275} src="whip.wav" volume={0.35} />
  </AbsoluteFill>
);
