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
import { Display, Flash, Object3D, PaintStroke, Sfx } from "./components";
import {
  BoltIcon,
  BuildingIcon,
  PipesIcon,
  PlugIcon,
  SprayIcon,
  TankIcon,
} from "./icons";
import { palette, Particles, ServiceShot } from "./ServiceShot";
import { C, CLAMP, EASE_OUT, SANS } from "./theme";

/** Positions a square visual centered at (x, y) with a springy pop-in. */
export const Pop: React.FC<{
  size: number;
  x?: number;
  y?: number;
  delay?: number;
  rot?: number;
  children: React.ReactNode;
}> = ({ size, x = 540, y = 700, delay = 0, rot = 0, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], {
    ...CLAMP,
    easing: Easing.spring({ damping: 11, stiffness: 170 }),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        scale: String(p),
        rotate: `${rot * (1 - p)}deg`,
        opacity: frame >= delay ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
};

const Residencial = () => (
  <ServiceShot
    dur={45}
    bg="black"
    n="01"
    kicker="Pintura"
    title={["Residencial"]}
    enter="right"
    visual={
      <>
        <PaintStroke d="M-60 760 C 300 640, 760 860, 1140 700" width={420} dur={12} seed={11} />
        <Object3D src="img/house.png" width={700} y={700} delay={4} />
      </>
    }
  />
);

const Comercial = () => (
  <ServiceShot
    dur={45}
    bg="orange"
    n="02"
    kicker="Pintura"
    title={["Comercial"]}
    hi={-1}
    enter="right"
    visual={
      <Pop size={680} y={700}>
        <BuildingIcon size={680} color={C.black} accent={C.white} delay={2} />
      </Pop>
    }
  />
);

const Automotiva = () => {
  const frame = useCurrentFrame();
  const cx = interpolate(frame, [0, 12], [-500, 600], { ...CLAMP, easing: EASE_OUT });
  return (
    <ServiceShot
      dur={45}
      bg="white"
      n="03"
      kicker="Pintura"
      title={["Automotiva"]}
      enter="cut"
      visual={
        <>
          <div
            style={{
              position: "absolute",
              left: cx - 360,
              top: 420,
              width: 720,
              filter: `blur(${interpolate(frame, [0, 12], [16, 0], CLAMP)}px) drop-shadow(0 40px 40px rgba(0,0,0,0.25))`,
            }}
          >
            <Img src={staticFile("img/car.png")} style={{ width: "100%" }} />
          </div>
          <Pop size={300} x={880} y={330} delay={10} rot={-30}>
            <SprayIcon size={300} color={C.black} accent={C.orange} />
          </Pop>
          <Particles x={740} y={360} start={14} color={C.orange} angle={Math.PI * 0.8} cone={0.8} count={50} seed="spray" />
        </>
      }
    />
  );
};

const Band: React.FC<{
  i: number;
  bg: "black" | "white" | "orange";
  label: string;
  children: React.ReactNode;
}> = ({ i, bg, label, children }) => {
  const frame = useCurrentFrame();
  const pal = palette(bg);
  const d = i * 4;
  const p = interpolate(frame, [d, d + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const dir = i % 2 ? 1 : -1;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: i * 640,
        width: 1080,
        height: 640,
        background: pal.bg,
        translate: `${dir * 1080 * (1 - p)}px 0`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 90px",
        boxSizing: "border-box",
        flexDirection: i % 2 ? "row-reverse" : "row",
      }}
    >
      <Display size={100} color={bg === "black" ? C.white : C.black}>
        {label}
      </Display>
      <div style={{ width: 380, height: 380, position: "relative" }}>{children}</div>
    </div>
  );
};

const RecapPintura = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <Band i={0} bg="black" label="Residencial">
      <Img src={staticFile("img/house.png")} style={{ width: 380 }} />
    </Band>
    <Band i={1} bg="orange" label="Comercial">
      <BuildingIcon size={380} color={C.black} accent={C.white} />
    </Band>
    <Band i={2} bg="white" label="Automotiva">
      <Img src={staticFile("img/car.png")} style={{ width: 380, marginTop: 40 }} />
    </Band>
  </AbsoluteFill>
);

const Reformas = () => (
  <ServiceShot
    dur={45}
    bg="black"
    n="04"
    kicker="Pequenas"
    title={["Reformas"]}
    enter="zoom"
    visual={
      <>
        <Object3D src="img/bricks.png" width={780} y={720} spin={80} />
        <Particles x={760} y={560} start={8} color="#C9B8A6" count={30} angle={-Math.PI / 2} cone={2.2} speed={12} seed="dust" />
      </>
    }
  />
);

const Hidraulica = () => {
  const frame = useCurrentFrame();
  return (
    <ServiceShot
      dur={60}
      bg="white"
      n="05"
      kicker="Serviços de"
      title={["Hidráulica"]}
      enter="up"
      visual={
        <>
          <div style={{ position: "absolute", left: 120, top: 330 }}>
            <PipesIcon size={640} color={C.black} accent={C.orange} delay={2} />
          </div>
          <Object3D src="img/shower.png" width={460} x={760} y={380} delay={10} spin={-60} shadow={false} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = (frame - 18 - i * 5) % 30;
            if (frame < 18 + i * 5) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 780 + ((i * 47) % 130) - 40,
                  top: 520 + t * 22,
                  width: 22,
                  height: 32,
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  background: "#4FB3FF",
                  opacity: interpolate(t, [0, 20, 30], [1, 1, 0], CLAMP),
                }}
              />
            );
          })}
        </>
      }
    />
  );
};

const Eletrica = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [4, 10], [0, 1], { ...CLAMP, easing: Easing.bezier(0.2, 1.4, 0.4, 1) });
  const pulse = 0.6 + 0.4 * Math.abs(Math.cos((frame / 15) * Math.PI));
  return (
    <ServiceShot
      dur={60}
      bg="black"
      n="06"
      kicker="Serviços de"
      title={["Elétrica"]}
      enter="cut"
      visual={
        <>
          <div
            style={{
              position: "absolute",
              left: 540 - 450,
              top: 250,
              width: 900,
              height: 900,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,107,0,0.55) 0%, rgba(255,107,0,0) 60%)",
              opacity: strike * pulse,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 300,
              scale: String(3 - 2 * strike),
              opacity: strike,
              rotate: "-8deg",
            }}
          >
            <BoltIcon size={520} accent={C.orange} />
          </div>
          <Object3D src="img/bulb.png" width={460} x={760} y={560} delay={14} spin={50} />
          <Flash at={6} color={C.orange} len={6} />
        </>
      }
    />
  );
};

const Instalacoes = () => {
  const frame = useCurrentFrame();
  return (
    <ServiceShot
      dur={60}
      bg="orange"
      n="07"
      kicker="Serviços de"
      title={["Instalações"]}
      hi={-1}
      enter="right"
      visual={
        <>
          <Object3D src="img/pump.png" width={640} x={600} y={680} delay={2} spin={-70} />
          <div
            style={{
              position: "absolute",
              left: 90,
              top: interpolate(frame, [6, 18], [1100, 360], { ...CLAMP, easing: EASE_OUT }),
              rotate: "180deg",
            }}
          >
            <PlugIcon size={280} color={C.black} accent={C.white} />
          </div>
        </>
      }
    />
  );
};

const CaixasDagua = () => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [14, 60], [0.05, 0.85], { ...CLAMP, easing: EASE_OUT });
  const dropY = interpolate(frame, [0, 14], [-200, 640], { ...CLAMP, easing: Easing.in(Easing.quad) });
  return (
    <ServiceShot
      dur={75}
      bg="black"
      n="08"
      kicker="Manutenção de"
      title={["Caixas d'água"]}
      enter="zoom"
      visual={
        <>
          <Pop size={700} y={760}>
            <TankIcon size={700} color={C.white} accent={C.orange} level={level} />
          </Pop>
          {frame < 15 ? (
            <Img
              src={staticFile("img/drop.png")}
              style={{ position: "absolute", left: 540 - 70, top: dropY - 200, width: 140 }}
            />
          ) : null}
          <Particles x={540} y={720} start={14} color="#4FB3FF" angle={-Math.PI / 2} cone={1.6} count={36} speed={26} seed="splash" />
        </>
      }
    />
  );
};

const Cell: React.FC<{
  i: number;
  bg: "black" | "white" | "orange";
  label: string;
  children: React.ReactNode;
}> = ({ i, bg, label, children }) => {
  const frame = useCurrentFrame();
  const pal = palette(bg);
  const d = i * 3;
  const p = interpolate(frame, [d, d + 9], [0, 1], {
    ...CLAMP,
    easing: Easing.spring({ damping: 13, stiffness: 180 }),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: (i % 2) * 540,
        top: Math.floor(i / 2) * 960,
        width: 540,
        height: 960,
        background: pal.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        clipPath: `inset(${50 * (1 - p)}% ${50 * (1 - p)}%)`,
      }}
    >
      <div style={{ width: 340, height: 340, scale: String(0.6 + 0.4 * p) }}>{children}</div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: pal.fg,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const GridHidraulica = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <Cell i={0} bg="white" label="Hidráulica">
      <PipesIcon size={340} color={C.black} accent={C.orange} />
    </Cell>
    <Cell i={1} bg="black" label="Elétrica">
      <BoltIcon size={340} accent={C.orange} />
    </Cell>
    <Cell i={2} bg="orange" label="Instalações">
      <PlugIcon size={340} color={C.black} accent={C.white} />
    </Cell>
    <Cell i={3} bg="black" label="Caixas d'água">
      <TankIcon size={340} color={C.white} accent={C.orange} level={0.8} />
    </Cell>
  </AbsoluteFill>
);

export const S2Servicos: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Sequence name="Residencial" durationInFrames={45}>
        <Residencial />
      </Sequence>
      <Sequence name="Comercial" from={45} durationInFrames={45}>
        <Comercial />
      </Sequence>
      <Sequence name="Automotiva" from={90} durationInFrames={45}>
        <Automotiva />
      </Sequence>
      <Sequence name="Recap pintura (split screen)" from={135} durationInFrames={30}>
        <RecapPintura />
      </Sequence>
      <Sequence name="Pequenas reformas" from={165} durationInFrames={45}>
        <Reformas />
      </Sequence>
      <Sequence name="Hidráulica" from={210} durationInFrames={60}>
        <Hidraulica />
      </Sequence>
      <Sequence name="Elétrica" from={270} durationInFrames={60}>
        <Eletrica />
      </Sequence>
      <Sequence name="Instalações" from={330} durationInFrames={60}>
        <Instalacoes />
      </Sequence>
      <Sequence name="Caixas d'água" from={390} durationInFrames={75}>
        <CaixasDagua />
      </Sequence>
      <Sequence name="Grid 2x2" from={465} durationInFrames={45}>
        <GridHidraulica />
      </Sequence>

      <Sfx at={0} src="whip.wav" />
      <Sfx at={2} src="pincel.wav" volume={0.6} />
      <Sfx at={45} src="whip.wav" />
      <Sfx at={90} src="whoosh.wav" />
      <Sfx at={104} src="pincel.wav" volume={0.5} />
      <Sfx at={135} src="click.wav" volume={0.5} />
      <Sfx at={139} src="click.wav" volume={0.5} />
      <Sfx at={143} src="click.wav" volume={0.5} />
      <Sfx at={165} src="impacto.wav" volume={0.5} />
      <Sfx at={210} src="whip.wav" />
      <Sfx at={214} src="ferramenta.wav" volume={0.4} />
      <Sfx at={228} src="agua.wav" volume={0.5} />
      <Sfx at={274} src="eletrico.wav" volume={0.6} />
      <Sfx at={330} src="whip.wav" />
      <Sfx at={340} src="click.wav" volume={0.6} />
      <Sfx at={390} src="whoosh.wav" volume={0.5} />
      <Sfx at={403} src="agua.wav" volume={0.7} />
      <Sfx at={465} src="pop.wav" volume={0.5} />
      <Sfx at={468} src="pop.wav" volume={0.5} />
      <Sfx at={471} src="pop.wav" volume={0.5} />
      <Sfx at={474} src="pop.wav" volume={0.5} />
    </AbsoluteFill>
  );
};
