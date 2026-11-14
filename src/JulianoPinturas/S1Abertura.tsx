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
import {
  Atmosphere,
  Display,
  fitSize,
  Flash,
  Kicker,
  Object3D,
  PaintStroke,
  Reveal,
  Sfx,
  Shot,
} from "./components";
import { WrenchIcon } from "./icons";
import { C, CLAMP, EASE_OUT, SANS } from "./theme";

/** Logo original (sem alterações) revelada com profundidade, luz e anel laranja. */
export const LogoReveal: React.FC<{ size?: number; y?: number; delay?: number }> = ({
  size = 860,
  y = 900,
  delay = 0,
}) => {
  const frame = useCurrentFrame() - delay;
  const p = interpolate(frame, [0, 16], [0, 1], {
    ...CLAMP,
    easing: Easing.spring({ damping: 14, stiffness: 120 }),
  });
  const sweep = interpolate(frame, [8, 30], [-60, 160], CLAMP);
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        perspective: 1600,
      }}
    >
      {/* anel laranja girando atrás */}
      <div
        style={{
          position: "absolute",
          inset: -70,
          borderRadius: "50%",
          background: `conic-gradient(from ${frame * 6}deg, rgba(255,107,0,0) 0deg, ${C.orange} 90deg, rgba(255,107,0,0) 180deg, ${C.orange} 270deg, rgba(255,107,0,0) 360deg)`,
          filter: "blur(40px)",
          opacity: 0.55 * p,
          scale: String(0.6 + 0.4 * p),
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          rotate: `x ${55 * (1 - p)}deg`,
          scale: String(1.5 - 0.5 * p),
          opacity: interpolate(frame, [0, 4], [0, 1], CLAMP),
          filter: `blur(${18 * (1 - p)}px) drop-shadow(0 50px 70px rgba(0,0,0,0.7))`,
          borderRadius: "9%",
          overflow: "hidden",
        }}
      >
        <Img src={staticFile("img/logo.png")} style={{ width: "100%", height: "100%" }} />
        {/* reflexo de luz passando sobre a peça (apenas iluminação, a logo não é alterada) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, rgba(255,255,255,0) ${sweep - 20}%, rgba(255,255,255,0.55) ${sweep}%, rgba(255,255,255,0) ${sweep + 20}%)`,
            mixBlendMode: "screen",
          }}
        />
      </div>
    </div>
  );
};

const ShotPergunta: React.FC = () => {
  const frame = useCurrentFrame();
  const rx = interpolate(frame, [0, 12], [-300, 1300], {
    ...CLAMP,
    easing: Easing.bezier(0.3, 0.6, 0.2, 1),
  });
  return (
    <Shot dur={30} bg={C.black} enter="cut" exit="left">
      <Atmosphere />
      <PaintStroke d="M-80 1180 C 300 1100, 700 1260, 1160 1120" width={190} dur={12} seed={5} />
      <Object3D
        src="img/roller.png"
        width={360}
        x={rx}
        y={1060}
        spin={0}
        style={{ rotate: "-12deg" }}
      />
      <div style={{ position: "absolute", left: 90, top: 560 }}>
        <Kicker delay={2}>Pintura · Reformas</Kicker>
        <div style={{ height: 30 }} />
        <Reveal delay={4}>
          <Display size={150}>Está</Display>
        </Reveal>
        <Reveal delay={7}>
          <Display size={150}>precisando de</Display>
        </Reveal>
      </div>
    </Shot>
  );
};

const BigWordShot: React.FC<{
  word: string;
  bg: string;
  fg: string;
  enter: "left" | "right" | "up" | "zoom";
  children?: React.ReactNode;
  size?: number;
}> = ({ word, bg, fg, enter, children, size = 300 }) => {
  const frame = useCurrentFrame();
  return (
    <Shot dur={30} bg={bg} enter={enter} exit="cut">
      {children}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1180,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Display
          size={fitSize(word, 920, size)}
          color={fg}
          style={{
            scale: String(interpolate(frame, [0, 30], [1.06, 1], CLAMP)),
            letterSpacing: `${interpolate(frame, [0, 10], [0.08, -0.01], { ...CLAMP, easing: EASE_OUT })}em`,
          }}
        >
          {word}
        </Display>
      </div>
    </Shot>
  );
};

const ShotConhecer: React.FC = () => (
  <Shot dur={45} bg={C.black} enter="zoom" exit="zoom">
    <Atmosphere y={60} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 640 }}>
      <Reveal delay={2}>
        <Display size={130}>Então você</Display>
      </Reveal>
      <Reveal delay={6}>
        <Display size={130}>precisa</Display>
      </Reveal>
      <Reveal delay={10}>
        <Display size={230} color={C.orange}>
          conhecer
        </Display>
      </Reveal>
      <PaintStroke d="M90 1190 L 1000 1170" width={26} start={16} dur={10} seed={8} />
    </div>
  </Shot>
);

export const S1Abertura: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Sequence name="Pergunta" durationInFrames={30}>
        <ShotPergunta />
      </Sequence>
      <Sequence name="PINTURA" from={30} durationInFrames={30}>
        <BigWordShot word="Pintura" bg={C.black} fg={C.orange} enter="zoom">
          <Atmosphere y={35} />
          <Object3D src="img/roller.png" width={560} y={760} spin={-90} />
        </BigWordShot>
      </Sequence>
      <Sequence name="REFORMAS" from={60} durationInFrames={30}>
        <BigWordShot word="Reformas" bg={C.orange} fg={C.black} enter="left" size={280}>
          <Object3D src="img/bricks.png" width={720} y={780} spin={70} />
        </BigWordShot>
      </Sequence>
      <Sequence name="MANUTENÇÃO" from={90} durationInFrames={30}>
        <ManutencaoShot />
      </Sequence>
      <Sequence name="Então você precisa conhecer" from={120} durationInFrames={45}>
        <ShotConhecer />
      </Sequence>
      <Sequence name="Logo reveal" from={165} durationInFrames={75}>
        <Shot dur={75} bg={C.black} enter="cut" exit="right">
          <Atmosphere />
          <LogoReveal />
          <div
            style={{
              position: "absolute",
              top: 1440,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Kicker delay={18}>o juliano pinturas</Kicker>
          </div>
          <Flash at={0} len={6} />
        </Shot>
      </Sequence>

      <Sfx at={0} src="whoosh.wav" volume={0.7} />
      <Sfx at={2} src="pincel.wav" volume={0.5} />
      <Sfx at={30} src="impacto.wav" volume={0.55} />
      <Sfx at={58} src="whip.wav" volume={0.6} />
      <Sfx at={60} src="impacto.wav" volume={0.45} />
      <Sfx at={88} src="whip.wav" volume={0.6} />
      <Sfx at={90} src="ferramenta.wav" volume={0.5} />
      <Sfx at={120} src="whoosh.wav" volume={0.5} />
      <Sfx at={163} src="whoosh.wav" volume={0.6} />
      <Sfx at={165} src="impacto.wav" volume={0.9} />
    </AbsoluteFill>
  );
};

const ManutencaoShot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Shot dur={30} bg={C.white} enter="up" exit="zoom">
      <div
        style={{
          position: "absolute",
          left: 540 - 260,
          top: 520,
          rotate: `${interpolate(frame, [0, 14], [-220, 0], { ...CLAMP, easing: EASE_OUT })}deg`,
          scale: String(interpolate(frame, [0, 10], [0.4, 1], { ...CLAMP, easing: EASE_OUT })),
        }}
      >
        <WrenchIcon size={520} color={C.orange} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1180,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Display size={fitSize("Manutenção?", 920, 230)} color={C.black}>
          Manutenção?
        </Display>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 44,
            color: C.black,
            opacity: interpolate(frame, [8, 14], [0, 1], CLAMP),
            marginTop: 20,
          }}
        >
          Hidráulica · Elétrica · Reparos
        </div>
      </div>
    </Shot>
  );
};
