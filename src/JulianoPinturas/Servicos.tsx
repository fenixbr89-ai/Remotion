import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Arc,
  Rings,
  Scribble,
  Sfx,
  Shot,
  Sticker,
  Toggle,
  useP,
  Word,
} from "./fx";
import { BACK, C, CLAMP, EASE, FONT } from "./theme";

/** Card de celular sobe, se preenche e revela a logo original. */
const CardLogo = () => {
  const frame = useCurrentFrame();
  const rise = useP(0, 12);
  const fill = useP(14, 10, BACK);
  return (
    <Shot dur={60}>
      <Word size={64} weight={700} delay={2} mode="up">
        Prestadora de serviços
      </Word>
      <div style={{ height: 36 }} />
      <div
        style={{
          width: 560,
          height: 860,
          borderRadius: 60,
          border: `7px solid ${C.ink}`,
          background: C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          translate: `0 ${(1 - rise) * 500}px`,
          rotate: `${(1 - rise) * 8}deg`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 460 * (0.35 + 0.65 * fill),
            height: 460 * (0.35 + 0.65 * fill),
            borderRadius: 40,
            background: C.orange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("img/logo.png")}
            style={{
              width: "92%",
              opacity: interpolate(frame, [18, 24], [0, 1], CLAMP),
            }}
          />
        </div>
      </div>
      <svg
        width={60}
        height={90}
        viewBox="0 0 60 90"
        style={{ marginTop: 30, translate: `0 ${(1 - rise) * 300}px` }}
      >
        <path
          d="M30 85 V10 M8 32 L30 8 L52 32"
          stroke={C.ink}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </Shot>
  );
};

/** Eco tipográfico: a palavra se repete em camadas que somem. */
const Completa = () => {
  const b = useP(16, 10, BACK);
  return (
    <Shot dur={45}>
      <Word size={64} weight={600} color={C.grey} mode="up">
        uma empresa
      </Word>
      <div style={{ position: "relative", marginTop: 10 }}>
        {[0, 1, 2].map((i) => (
          <Word
            key={i}
            size={140}
            weight={800}
            color={i === 0 ? C.ink : i === 1 ? "#BDBDBD" : "#E2E2E2"}
            delay={2 + i * 3}
            mode="up"
            style={{ marginTop: i === 0 ? 0 : -60 }}
          >
            completa
          </Word>
        ))}
      </div>
      <div
        style={{
          marginTop: 30,
          scale: String(b),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.18))",
        }}
      >
        <div
          style={{
            background: C.ink,
            color: C.white,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 50,
            padding: "16px 44px",
            borderRadius: 999,
          }}
        >
          tudo em um só lugar
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderTop: `24px solid ${C.ink}`,
          }}
        />
      </div>
    </Shot>
  );
};

const PinturaRes = () => (
  <Shot dur={45} exit="left">
    <Sticker src="img/house.png" width={460} delay={0} />
    <div style={{ height: 30 }} />
    <Word size={140} weight={800} mode="left" delay={4}>
      pintura
    </Word>
    <div style={{ marginTop: -16 }}>
      <Scribble width={520} delay={10} />
    </div>
    <Word size={56} weight={600} color={C.grey} delay={12} mode="up">
      residencial e comercial
    </Word>
  </Shot>
);

/** Parênteses + barras de "esqueleto", como na referência. */
const Automotiva = () => {
  const p = useP(0, 12);
  const b1 = useP(0, 10);
  const b2 = useP(3, 10);
  const bar = (w: number) => (
    <div
      style={{
        width: w,
        height: 70,
        borderRadius: 10,
        background: C.light,
        margin: "14px auto",
      }}
    />
  );
  return (
    <Shot dur={45}>
      {bar(420 * b1)}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Word
          size={170}
          weight={300}
          color={C.mid}
          style={{ translate: `${-80 * (1 - p)}px 0`, opacity: p }}
          mode="none"
        >
          (
        </Word>
        <div>
          <Word size={84} weight={700} delay={4}>
            pintura
          </Word>
          <Word size={84} weight={800} color={C.orange} delay={8}>
            automotiva
          </Word>
        </div>
        <Word
          size={170}
          weight={300}
          color={C.mid}
          style={{ translate: `${80 * (1 - p)}px 0`, opacity: p }}
          mode="none"
        >
          )
        </Word>
      </div>
      {bar(560 * b2)}
      <div style={{ height: 30 }} />
      <Sticker src="img/car.png" width={440} delay={12} tilt={-20} />
    </Shot>
  );
};

/** Letra gigante ao fundo + círculo + anéis. */
const Reformas = () => {
  const frame = useCurrentFrame();
  const c = useP(0, 12, BACK);
  return (
    <Shot dur={45}>
      <div
        style={{
          position: "absolute",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 1100,
          color: "#EFEFEF",
          scale: String(interpolate(frame, [0, 45], [1.2, 1])),
        }}
      >
        R
      </div>
      <Rings color={C.light} start={0} speed={45} />
      <div
        style={{
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: "#E9E9E9",
          border: `6px solid ${C.grey}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          scale: String(c),
        }}
      >
        <Word size={58} weight={600} color={C.mid} delay={4}>
          pequenas
        </Word>
        <Word size={100} weight={800} delay={6}>
          reformas
        </Word>
      </div>
      <Sticker src="img/bricks.png" width={380} x={620} y={1240} delay={10} />
    </Shot>
  );
};

const Hidraulica = () => (
  <Shot dur={45}>
    <div
      style={{
        position: "relative",
        width: 760,
        height: 760,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Arc size={760} delay={0} />
      <div>
        <Word
          size={52}
          weight={600}
          color={C.mid}
          delay={3}
          style={{ textAlign: "left" }}
        >
          serviços de
        </Word>
        <Word size={104} weight={800} delay={5} mode="left">
          HIDRÁULICA
        </Word>
      </div>
    </div>
    <Sticker src="img/shower.png" width={320} x={640} y={1260} delay={10} />
  </Shot>
);

const Eletrica = () => {
  const c = useP(0, 12, BACK);
  return (
    <Shot dur={45}>
      <Rings color={C.light} start={0} speed={36} />
      <div
        style={{
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: "#FFD9BF",
          border: `6px solid ${C.orange}`,
          scale: String(c),
          position: "absolute",
        }}
      />
      <Word size={140} weight={800} delay={4} mode="blur">
        elétrica
      </Word>
      <Sticker src="img/bulb.png" width={300} x={620} y={560} delay={8} />
    </Shot>
  );
};

const MAIS = [
  "Telhados e calhas",
  "Limpeza pós-obra",
  "Instalação de TVs",
  "Jardinagem",
];

/** Lista com toggles ligando, no estilo de interface. */
const MuitoMais = () => {
  return (
    <Shot dur={75}>
      <Word size={110} weight={800} mode="up">
        e muito mais
      </Word>
      <div style={{ height: 70 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        {MAIS.map((m, i) => (
          <Row key={m} label={m} delay={8 + i * 7} />
        ))}
      </div>
    </Shot>
  );
};

const Row: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const p = useP(delay, 10, EASE);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 820,
        padding: "22px 34px",
        borderRadius: 30,
        background: C.white,
        boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
        opacity: p,
        translate: `${(1 - p) * 200}px 0`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 52,
          color: C.ink,
        }}
      >
        {label}
      </div>
      <Toggle on={delay + 8} />
    </div>
  );
};

export const Servicos: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence name="Card + logo" durationInFrames={60}>
      <CardLogo />
    </Sequence>
    <Sequence name="completa (eco)" from={60} durationInFrames={45}>
      <Completa />
    </Sequence>
    <Sequence name="Pintura" from={105} durationInFrames={45}>
      <PinturaRes />
    </Sequence>
    <Sequence name="Pintura automotiva" from={150} durationInFrames={45}>
      <Automotiva />
    </Sequence>
    <Sequence name="Pequenas reformas" from={195} durationInFrames={45}>
      <Reformas />
    </Sequence>
    <Sequence name="Hidráulica" from={240} durationInFrames={45}>
      <Hidraulica />
    </Sequence>
    <Sequence name="Elétrica" from={285} durationInFrames={45}>
      <Eletrica />
    </Sequence>
    <Sequence name="E muito mais (toggles)" from={330} durationInFrames={75}>
      <MuitoMais />
    </Sequence>

    <Sfx at={0} src="whoosh.wav" volume={0.3} />
    <Sfx at={14} src="pop.wav" />
    <Sfx at={60} src="whoosh.wav" volume={0.25} />
    <Sfx at={76} src="pop.wav" />
    <Sfx at={105} src="pop.wav" />
    <Sfx at={115} src="whip.wav" volume={0.3} />
    <Sfx at={150} src="whoosh.wav" volume={0.25} />
    <Sfx at={162} src="pop.wav" />
    <Sfx at={195} src="pop.wav" />
    <Sfx at={240} src="whip.wav" volume={0.3} />
    <Sfx at={285} src="pop.wav" />
    <Sfx at={330} src="whoosh.wav" volume={0.25} />
    {MAIS.map((m, i) => (
      <Sfx key={m} at={330 + 16 + i * 7} src="click.wav" volume={0.45} />
    ))}
  </AbsoluteFill>
);
