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
import { Display, Kicker, Object3D, Reveal, Sfx, Shot } from "./components";
import {
  BoltIcon,
  BuildingIcon,
  GrassIcon,
  GutterIcon,
  LotIcon,
  MagnifierIcon,
  PipesIcon,
  PlantIcon,
  PlugIcon,
  RoofIcon,
  SidewalkIcon,
  TankIcon,
  TvIcon,
} from "./icons";
import { Pop } from "./S2Servicos";
import { Particles, ServiceShot } from "./ServiceShot";
import { C, CLAMP, EASE_OUT, SANS } from "./theme";

const Header = () => {
  const frame = useCurrentFrame();
  return (
    <Shot dur={45} bg={C.orange} enter="zoom" exit="left">
      <div
        style={{
          position: "absolute",
          left: 540 - 260,
          top: 300,
          width: 520,
          height: 520,
          rotate: `${interpolate(frame, [0, 45], [-90, 90], { easing: EASE_OUT })}deg`,
          scale: String(interpolate(frame, [0, 10], [0, 1], { ...CLAMP, easing: Easing.spring({ damping: 10 }) })),
        }}
      >
        <div style={{ position: "absolute", left: 200, top: 0, width: 120, height: 520, background: C.white, borderRadius: 20 }} />
        <div style={{ position: "absolute", top: 200, left: 0, height: 120, width: 520, background: C.white, borderRadius: 20 }} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1000 }}>
        <Reveal delay={4}>
          <Display size={150} color={C.black}>
            Também
          </Display>
        </Reveal>
        <Reveal delay={8}>
          <Display size={200} color={C.white}>
            realizamos
          </Display>
        </Reveal>
      </div>
    </Shot>
  );
};

const Telhados = () => (
  <ServiceShot
    dur={50}
    bg="black"
    n="09"
    kicker="Reforma de"
    title={["Telhados"]}
    enter="right"
    visual={
      <Pop size={720} y={720}>
        <RoofIcon size={720} color={C.white} accent={C.orange} delay={2} />
      </Pop>
    }
  />
);

const Calhas = () => (
  <ServiceShot
    dur={50}
    bg="white"
    n="10"
    kicker="Manutenção de"
    title={["Calhas"]}
    enter="up"
    visual={
      <div style={{ position: "absolute", left: 200, top: 340 }}>
        <GutterIcon size={620} color={C.black} accent={C.orange} delay={0} />
      </div>
    }
  />
);

const Vazamentos = () => {
  const frame = useCurrentFrame();
  const fall = (frame % 25) / 25;
  const mx = interpolate(frame, [0, 20], [-300, 330], { ...CLAMP, easing: EASE_OUT });
  return (
    <ServiceShot
      dur={50}
      bg="black"
      n="11"
      kicker="Identificação de"
      title={["Vazamentos", "e goteiras"]}
      hi={0}
      enter="cut"
      visual={
        <>
          <Img
            src={staticFile("img/drop.png")}
            style={{
              position: "absolute",
              left: 540 - 90,
              top: 260 + fall * 600,
              width: 180,
              scale: String(interpolate(fall, [0, 0.15, 1], [0.3, 1, 1])),
            }}
          />
          {[0, 1].map((k) => {
            const r = ((frame + k * 12) % 25) / 25;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 540 - 300 * r,
                  top: 1060 - 60 * r,
                  width: 600 * r,
                  height: 120 * r,
                  borderRadius: "50%",
                  border: "6px solid #4FB3FF",
                  opacity: 1 - r,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: mx, top: 420, rotate: "-10deg" }}>
            <MagnifierIcon size={380} color={C.orange} />
          </div>
        </>
      }
    />
  );
};

const PosObra = () => {
  const frame = useCurrentFrame();
  return (
    <ServiceShot
      dur={50}
      bg="orange"
      n="12"
      kicker="Limpeza"
      title={["Pós-obra"]}
      hi={-1}
      enter="right"
      visual={
        <>
          <div style={{ position: "absolute", inset: 0, rotate: `${Math.sin(frame / 4) * 14}deg`, transformOrigin: "540px 300px" }}>
            <Object3D src="img/broom.png" width={620} y={700} spin={60} />
          </div>
          <Particles x={380} y={920} start={4} color="rgba(255,255,255,0.85)" angle={Math.PI} cone={1.2} count={40} speed={20} seed="po" />
          <Particles x={700} y={920} start={16} color="rgba(255,255,255,0.85)" angle={0} cone={1.2} count={40} speed={20} seed="po2" />
        </>
      }
    />
  );
};

const Televisores = () => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [14, 18], [0, 1], CLAMP);
  return (
    <ServiceShot
      dur={50}
      bg="black"
      n="13"
      kicker="Instalação de"
      title={["Televisores"]}
      enter="left"
      visual={
        <>
          <div
            style={{
              position: "absolute",
              left: 540 - 380,
              top: interpolate(frame, [0, 12], [900, 330], { ...CLAMP, easing: EASE_OUT }),
            }}
          >
            <TvIcon size={760} color={C.white} accent={C.orange} on={on} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 470,
              height: 300,
              background: "radial-gradient(ellipse, rgba(255,107,0,0.35), rgba(0,0,0,0) 65%)",
              opacity: on,
            }}
          />
        </>
      }
    />
  );
};

const Calcadas = () => (
  <ServiceShot
    dur={50}
    bg="white"
    n="14"
    kicker="Construção de"
    title={["Calçadas"]}
    enter="zoom"
    visual={
      <div style={{ position: "absolute", left: 140, top: 340, perspective: 900 }}>
        <div style={{ rotate: "x 55deg" }}>
          <SidewalkIcon size={800} delay={2} />
        </div>
      </div>
    }
  />
);

const Capina = () => {
  const frame = useCurrentFrame();
  const sx = interpolate(frame, [8, 30], [80, 1000], CLAMP);
  const cut = interpolate(frame, [8, 30], [0, 1], CLAMP);
  return (
    <ServiceShot
      dur={50}
      bg="black"
      n="15"
      kicker="Serviço de"
      title={["Capina"]}
      enter="right"
      visual={
        <>
          <div style={{ position: "absolute", left: 120, top: 330 }}>
            <GrassIcon size={840} cut={cut} />
          </div>
          <div
            style={{
              position: "absolute",
              left: sx,
              top: 880,
              width: 200,
              height: 12,
              background: C.orange,
              borderRadius: 6,
              boxShadow: `0 0 30px ${C.orange}`,
              opacity: frame > 8 && frame < 32 ? 1 : 0,
            }}
          />
          <Particles x={540} y={900} start={10} color="#3DBE5A" angle={-Math.PI / 2} cone={2.5} count={30} speed={18} seed="grass" size={10} />
        </>
      }
    />
  );
};

const Lotes = () => (
  <ServiceShot
    dur={50}
    bg="orange"
    n="16"
    kicker="Limpeza de"
    title={["Lotes"]}
    hi={-1}
    enter="up"
    visual={
      <Pop size={760} y={700}>
        <LotIcon size={760} color={C.black} accent={C.black} delay={2} />
      </Pop>
    }
  />
);

const Jardins = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [4, 20], [0, 1], { ...CLAMP, easing: Easing.spring({ damping: 9 }) });
  return (
    <ServiceShot
      dur={50}
      bg="white"
      n="17"
      kicker="Cuidados com"
      title={["Jardins"]}
      enter="left"
      visual={
        <Pop size={720} y={700}>
          <PlantIcon size={720} accent={C.orange} grow={grow} />
        </Pop>
      }
    />
  );
};

/** Mosaico final com todos os serviços: mostra a amplitude em um único quadro. */
const Mosaico = () => {
  const frame = useCurrentFrame();
  const tiles: { el: React.ReactNode; bg: string }[] = [
    { el: <Img src={staticFile("img/roller.png")} style={{ width: "80%" }} />, bg: C.ink },
    { el: <BuildingIcon size={170} color={C.black} accent={C.white} />, bg: C.orange },
    { el: <Img src={staticFile("img/car.png")} style={{ width: "90%" }} />, bg: C.white },
    { el: <Img src={staticFile("img/bricks.png")} style={{ width: "85%" }} />, bg: C.ink },
    { el: <PipesIcon size={170} color={C.black} accent={C.orange} />, bg: C.white },
    { el: <BoltIcon size={170} accent={C.orange} />, bg: C.ink },
    { el: <PlugIcon size={170} color={C.black} accent={C.white} />, bg: C.orange },
    { el: <TankIcon size={170} color={C.white} accent={C.orange} level={0.8} />, bg: C.ink },
    { el: <RoofIcon size={170} color={C.white} accent={C.orange} />, bg: C.ink },
    { el: <GutterIcon size={170} color={C.black} accent={C.orange} />, bg: C.white },
    { el: <Img src={staticFile("img/drop.png")} style={{ width: "45%" }} />, bg: C.ink },
    { el: <Img src={staticFile("img/broom.png")} style={{ width: "80%" }} />, bg: C.orange },
    { el: <TvIcon size={170} color={C.white} accent={C.orange} on={1} />, bg: C.ink },
    { el: <SidewalkIcon size={170} />, bg: C.white },
    { el: <GrassIcon size={170} cut={0} />, bg: C.ink },
    { el: <PlantIcon size={170} accent={C.orange} grow={1} />, bg: C.white },
  ];
  // the whole wall pushes into camera on the riser, ready for the drop
  const push = interpolate(frame, [30, 75], [1, 2.6], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  const blur = interpolate(frame, [55, 75], [0, 18], CLAMP);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ scale: String(push), filter: `blur(${blur}px)` }}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 520,
            width: 900,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {tiles.map((t, i) => {
            const d = (i % 4) * 2 + Math.floor(i / 4) * 2;
            const p = interpolate(frame, [d, d + 8], [0, 1], {
              ...CLAMP,
              easing: Easing.spring({ damping: 12, stiffness: 200 }),
            });
            return (
              <div
                key={i}
                style={{
                  height: 210,
                  borderRadius: 28,
                  background: t.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: String(p),
                  opacity: p > 0 ? 1 : 0,
                  overflow: "hidden",
                }}
              >
                {t.el}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 300,
          opacity: interpolate(frame, [50, 62], [1, 0], CLAMP),
        }}
      >
        <Kicker delay={6}>Tudo isso com</Kicker>
        <Reveal delay={8}>
          <Display size={130}>um só contato</Display>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1480,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 44,
          color: C.grey,
          opacity: interpolate(frame, [14, 22, 50, 60], [0, 1, 1, 0], CLAMP),
        }}
      >
        E muito mais.
      </div>
    </AbsoluteFill>
  );
};

export const S3MaisSolucoes: React.FC = () => {
  const shots: [string, React.FC][] = [
    ["Telhados", Telhados],
    ["Calhas", Calhas],
    ["Vazamentos e goteiras", Vazamentos],
    ["Limpeza pós-obra", PosObra],
    ["Televisores", Televisores],
    ["Calçadas", Calcadas],
    ["Capina", Capina],
    ["Limpeza de lotes", Lotes],
    ["Jardins", Jardins],
  ];
  const sfx = ["whip.wav", "agua.wav", "agua.wav", "pincel.wav", "click.wav", "pop.wav", "whoosh.wav", "click.wav", "pop.wav"];
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Sequence name="Também realizamos" durationInFrames={45}>
        <Header />
      </Sequence>
      {shots.map(([name, Comp], i) => (
        <Sequence key={name} name={name} from={45 + i * 50} durationInFrames={50}>
          <Comp />
        </Sequence>
      ))}
      <Sequence name="Mosaico + riser" from={495} durationInFrames={75}>
        <Mosaico />
      </Sequence>

      <Sfx at={0} src="impacto.wav" volume={0.5} />
      {shots.map(([name], i) => (
        <React.Fragment key={name}>
          <Sfx at={45 + i * 50 - 2} src="whip.wav" volume={0.45} />
          <Sfx at={45 + i * 50 + 8} src={sfx[i]} volume={0.45} />
        </React.Fragment>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={i} at={495 + i * 2} src="pop.wav" volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};
