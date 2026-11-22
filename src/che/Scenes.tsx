import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Aperture,
  Banknote,
  Books,
  Cutout,
  Label,
  Motorcycle,
  Photo,
  PrintFace,
  Star,
  TShirt,
  Yacht,
  has,
} from "./Art";
import { MapArt, LonLat, useProjector } from "./MapArt";
import {
  C,
  Camera,
  Dark,
  Paper,
  RedStroke,
  SANS,
  SERIF,
  SerifWords,
  TYPE,
  TypeCaps,
  clamp,
  ease,
  easeInOut,
  pop,
} from "./lib";

type S = { d: number };
const center: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
};

/* 1 — Existe um rosto que você já viu */
export const S01: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <Camera dur={d} from={1} to={1.1}>
        <div style={{ ...center, top: 300, opacity: ease(f, 30, d, 0, 0.3) }}>
          <Cutout
            k="korda"
            h={1300}
            style={{
              filter: "grayscale(1) contrast(1.3) brightness(0.7) blur(2px)",
            }}
          />
        </div>
        <div style={{ ...center, top: 880 }}>
          <TypeCaps
            text="EXISTE UM ROSTO"
            start={6}
            cps={15}
            size={46}
            color="#f2f2f2"
          />
        </div>
        <div style={{ ...center, top: 960 }}>
          <SerifWords
            text="que você já viu"
            start={42}
            every={5}
            size={76}
            color="#e9e6df"
          />
        </div>
      </Camera>
    </Dark>
  );
};

/* 2 — em camisetas, muros e bandeiras no mundo inteiro */
export const S02: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const face = <PrintFace h={200} />;
  return (
    <Paper>
      <Camera dur={d} from={1.02} to={1.1} rot={-1}>
        <div style={{ ...center, top: 250 }}>
          <SerifWords
            text="em camisetas, muros e bandeiras"
            start={6}
            every={6}
            size={72}
            highlight={["camisetas", "muros", "bandeiras"]}
            style={{ width: 860 }}
          />
        </div>
        {/* t-shirt */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 640,
            rotate: "-6deg",
            ...pop(f, 14),
          }}
        >
          <TShirt w={460}>{face}</TShirt>
        </div>
        {/* wall poster */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 600,
            rotate: "5deg",
            ...pop(f, 30),
          }}
        >
          <div
            style={{
              width: 400,
              height: 520,
              background: "#b9ad97",
              boxShadow: "8px 16px 24px rgba(0,0,0,.35)",
              padding: 26,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#ece6d8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {has("korda") ? (
                <Photo k="korda" w={300} h={360} tint="bw" pos="50% 25%" />
              ) : (
                <Star size={220} color={C.ink} />
              )}
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 40,
                  color: C.red,
                  marginTop: 10,
                  letterSpacing: 4,
                }}
              >
                HASTA
              </div>
            </div>
          </div>
        </div>
        {/* flag */}
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 1200,
            rotate: "-3deg",
            ...pop(f, 48),
          }}
        >
          <div
            style={{
              width: 520,
              height: 320,
              boxShadow: "8px 16px 24px rgba(0,0,0,.35)",
              overflow: "hidden",
            }}
          >
            <div style={{ height: "50%", background: C.red }} />
            <div
              style={{
                height: "50%",
                background: "#151515",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontFamily: TYPE, color: "#eee", fontSize: 44 }}>
                M-26-7
              </span>
            </div>
          </div>
        </div>
        <div style={{ ...center, top: 1640 }}>
          <SerifWords text="no mundo inteiro." start={62} every={5} size={64} />
        </div>
      </Camera>
    </Paper>
  );
};

/* 3 — Mas quase ninguém sabe a história do homem por trás dele */
export const S03: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper>
      <Camera dur={d} from={1.0} to={1.08} y={-20}>
        <div style={{ ...center, top: 230 }}>
          <SerifWords
            text="mas quase ninguém sabe"
            start={4}
            every={5}
            size={70}
            highlight={["ninguém"]}
          />
        </div>
        <div style={{ ...center, top: 520, ...pop(f, 10, 18) }}>
          <div style={{ rotate: "-2deg" }}>
            <Photo k="portrait" w={760} h={980} border={22} pos="50% 20%" />
          </div>
        </div>
        <div style={{ ...center, top: 1590 }}>
          <SerifWords
            text="a história do homem por trás"
            start={40}
            every={5}
            size={62}
          />
        </div>
        <RedStroke
          start={52}
          w={500}
          h={300}
          style={{ left: 200, top: 820 }}
          len={1500}
          d="M250 20 C 420 10, 490 120, 470 190 C 440 280, 120 300, 40 210 C -20 130, 90 20, 270 30"
        />
      </Camera>
    </Paper>
  );
};

/* 4 — Ernesto Guevara nasceu em 1928, em Rosário, na Argentina */
const SA: [LonLat, LonLat] = [
  [-82, -56],
  [-34, 13],
];
export const S04: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper>
      <Camera dur={d} from={1.0} to={1.12} x={60} y={-120}>
        <div style={{ position: "absolute", left: 40, top: 520 }}>
          <MapArt
            w={1000}
            h={1300}
            fit={SA}
            highlight={[{ name: "Argentina", color: C.red, start: 24 }]}
            pins={[{ at: [-60.64, -32.95], label: "ROSARIO", start: 44 }]}
          />
        </div>
        <div style={{ ...center, top: 210 }}>
          <TypeCaps text="ERNESTO GUEVARA" start={4} cps={16} size={50} />
        </div>
        <div style={{ ...center, top: 300 }}>
          <SerifWords
            text="nasceu na Argentina"
            start={20}
            every={5}
            size={66}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 470,
            rotate: "-8deg",
            opacity: ease(f, 34, 40),
            scale: String(interpolate(f, [34, 44], [1.4, 1], clamp)),
          }}
        >
          <div
            style={{
              border: `6px solid ${C.red}`,
              padding: "6px 22px",
              fontFamily: TYPE,
              fontSize: 92,
              color: C.red,
            }}
          >
            1928
          </div>
        </div>
        {has("kid") ? (
          <div
            style={{
              position: "absolute",
              left: 90,
              top: 1240,
              rotate: "5deg",
              ...pop(f, 64),
            }}
          >
            <Photo k="kid" w={330} h={410} border={16} tint="warm" />
          </div>
        ) : null}
      </Camera>
    </Paper>
  );
};

/* 5 — Era asmático, lia sem parar e estudou medicina em Buenos Aires */
export const S05: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper>
      <Camera dur={d} from={1.03} to={1.1} rot={0.8}>
        <div style={{ ...center, top: 220 }}>
          <SerifWords
            text="asmático,"
            start={4}
            size={110}
            highlight={["asmático"]}
          />
        </div>
        <div style={{ ...center, top: 360 }}>
          <SerifWords text="lia sem parar" start={22} every={5} size={72} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 560,
            rotate: "-4deg",
            ...pop(f, 26),
          }}
        >
          <Books w={560} />
        </div>
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 680,
            rotate: "6deg",
            ...pop(f, 52),
          }}
        >
          <Photo
            k="student"
            w={400}
            h={500}
            border={18}
            tint="warm"
            pos="50% 25%"
            fallback={
              <div
                style={{
                  width: 364,
                  height: 464,
                  background: "#ddd5c4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: SERIF,
                  fontWeight: 800,
                  fontSize: 200,
                  color: C.red,
                }}
              >
                +
              </div>
            }
          />
        </div>
        <div style={{ ...center, top: 1330 }}>
          <SerifWords
            text="e estudou medicina"
            start={60}
            every={6}
            size={84}
          />
        </div>
        <RedStroke
          start={80}
          w={420}
          h={40}
          style={{ left: 520, top: 1440 }}
          d="M5 20 C 120 5, 260 35, 410 15"
        />
        <Label
          text="BUENOS AIRES"
          start={86}
          style={{ left: 380, top: 1530 }}
          size={40}
        />
      </Camera>
    </Paper>
  );
};

/* 6 — Aos 23 anos, cruzou a América do Sul numa motocicleta velha */
const TRIP: LonLat[] = [
  [-58.4, -34.6],
  [-71.3, -41.1],
  [-71.6, -33.0],
  [-68.9, -22.3],
  [-72.0, -13.5],
  [-77.0, -12.0],
  [-71.98, -3.75],
  [-69.9, -4.2],
  [-74.1, 4.7],
  [-66.9, 10.5],
];
export const S06: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const proj = useProjector(1000, 1300, SA);
  const t = ease(f, 14, d - 8, 0, 1, easeInOut);
  const seg = Math.min(TRIP.length - 2, Math.floor(t * (TRIP.length - 1)));
  const lt = t * (TRIP.length - 1) - seg;
  const a = proj(TRIP[seg]) as [number, number];
  const b = proj(TRIP[seg + 1]) as [number, number];
  const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.18;
  const my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.18;
  const x = (1 - lt) ** 2 * a[0] + 2 * (1 - lt) * lt * mx + lt * lt * b[0];
  const y = (1 - lt) ** 2 * a[1] + 2 * (1 - lt) * lt * my + lt * lt * b[1];
  const km = Math.round(t * 8000);
  return (
    <Paper>
      <Camera dur={d} from={1.0} to={1.06}>
        <div style={{ position: "absolute", left: 40, top: 520 }}>
          <MapArt
            w={1000}
            h={1300}
            fit={SA}
            routes={[{ pts: TRIP, start: 14, dur: d - 22 }]}
          />
          <div
            style={{
              position: "absolute",
              left: x - 70,
              top: y - 80,
              rotate: "-4deg",
            }}
          >
            <Motorcycle w={140} />
          </div>
        </div>
        <div style={{ ...center, top: 200 }}>
          <TypeCaps text="AOS 23 ANOS" start={2} cps={14} size={50} />
        </div>
        <div style={{ ...center, top: 290 }}>
          <SerifWords
            text="numa motocicleta velha"
            start={20}
            every={5}
            size={70}
            highlight={["motocicleta"]}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 1620,
            fontFamily: TYPE,
            fontSize: 64,
            color: C.ink,
          }}
        >
          {km.toLocaleString("pt-BR")} km
        </div>
        {has("moto") ? (
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 1500,
              rotate: "-5deg",
              ...pop(f, 40),
            }}
          >
            <Photo k="moto" w={460} h={330} border={16} tint="warm" />
          </div>
        ) : null}
      </Camera>
    </Paper>
  );
};

/* 7 — mineiros explorados, leprosos isolados, pobreza */
export const S07: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const words: [string, number][] = [
    ["mineiros explorados", 16],
    ["leprosos isolados", 56],
    ["pobreza", 96],
  ];
  return (
    <Dark>
      <Camera dur={d} from={1.05} to={1.18} x={-30}>
        <AbsoluteFill style={{ opacity: 0.85 }}>
          <Photo
            k="leper"
            w={1080}
            h={1920}
            pos="50% 50%"
            tint="warm"
            fallback={<Paper tone="#2a2622" />}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.15) 40%, rgba(0,0,0,.7))",
          }}
        />
      </Camera>
      <div style={{ ...center, top: 240 }}>
        <TypeCaps
          text="NO CAMINHO, ELE VIU"
          start={0}
          cps={18}
          size={40}
          color="#eee"
        />
      </div>
      {words.map(([w, s], i) => (
        <div key={w} style={{ ...center, top: 700 + i * 200 }}>
          <div style={{ position: "relative" }}>
            <SerifWords
              text={w}
              start={s}
              every={5}
              size={i === 2 ? 130 : 84}
              color="#f1ede4"
              highlight={["pobreza"]}
              hlColor={C.redSoft}
            />
          </div>
        </div>
      ))}
      <div style={{ ...center, top: 1480 }}>
        <SerifWords
          text="que mudou tudo o que ele pensava."
          start={130}
          every={4}
          size={58}
          color="#e6e1d6"
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1060,
          height: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 420 * ease(f, 112, 132),
            height: 6,
            background: C.redSoft,
          }}
        />
      </div>
    </Dark>
  );
};

/* 8 — Em 1955, no México, conheceu Fidel Castro */
export const S08: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper>
      <Camera dur={d} from={1.02} to={1.1} rot={-0.8}>
        <div style={{ ...center, top: 200 }}>
          <TypeCaps
            text="CIDADE DO MÉXICO · 1955"
            start={2}
            cps={20}
            size={42}
            font={TYPE}
            weight={400}
          />
        </div>
        <div style={{ ...center, top: 300 }}>
          <SerifWords
            text="um jovem advogado cubano"
            start={22}
            every={5}
            size={66}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 74,
            top: 640,
            translate: `0px ${(1 - ease(f, 8, 40)) * 500}px`,
          }}
        >
          <Cutout k="fidel" h={1320} edge={0} />
        </div>
        <div style={{ ...center, top: 400 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 800,
              fontSize: 120,
              letterSpacing: -3,
              color: C.red,
              opacity: ease(f, 66, 80),
              filter: `blur(${(1 - ease(f, 66, 80)) * 10}px)`,
            }}
          >
            Fidel Castro
          </div>
        </div>
        <RedStroke
          start={82}
          w={620}
          h={40}
          style={{ left: 230, top: 590 }}
          d="M5 25 C 200 5, 420 35, 610 12"
        />
        <Label
          text="↑ CHE"
          start={50}
          style={{ left: 150, top: 1560 }}
          size={40}
        />
      </Camera>
    </Paper>
  );
};

/* 9 — 82 homens, iate Granma, rumo a Cuba */
export const S09: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const n = Math.round(
    interpolate(f, [16, 60], [0, 82], { ...clamp, easing: easeInOut }),
  );
  const bx = interpolate(f, [0, d], [-420, 760]);
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg,#3b7fae 0%,#4f93be 55%,#2f6d97 100%)",
      }}
    >
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const r = ((f * 4 + i * 140) % 1120) + 40;
          return (
            <circle
              key={i}
              cx={540}
              cy={1250}
              r={r}
              fill="none"
              stroke="#fff"
              strokeOpacity={0.35 * (1 - r / 1160)}
              strokeWidth={3}
            />
          );
        })}
      </svg>
      <Camera dur={d} from={1} to={1.08}>
        <div style={{ ...center, top: 300 }}>
          <SerifWords
            text="no ano seguinte,"
            start={0}
            every={4}
            size={60}
            color="#eef4f8"
          />
        </div>
        <div
          style={{
            ...center,
            top: 400,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 300,
            color: "#fff",
            letterSpacing: -8,
          }}
        >
          {n}
        </div>
        <div style={{ ...center, top: 740 }}>
          <SerifWords
            text="homens num iate"
            start={40}
            every={5}
            size={80}
            color="#eef4f8"
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: bx,
            top: 1150,
            rotate: `${Math.sin(f / 9) * 2}deg`,
            translate: `0px ${Math.sin(f / 7) * 8}px`,
          }}
        >
          {has("granma") ? <Cutout k="granma" h={300} /> : <Yacht w={520} />}
        </div>
        <Label
          text="GRANMA → CUBA · 1956"
          start={70}
          style={{ left: 260, top: 1600 }}
          size={44}
        />
      </Camera>
    </AbsoluteFill>
  );
};

/* 10 — O médico virou comandante */
export const S10: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper>
      <Camera dur={d} from={1} to={1.12}>
        <div style={{ ...center, top: 760 }}>
          <div style={{ position: "relative" }}>
            <SerifWords text="o médico" start={4} every={6} size={110} />
            <div
              style={{
                position: "absolute",
                left: 100,
                top: 62,
                height: 7,
                width: 300 * ease(f, 24, 36),
                background: C.red,
                rotate: "-3deg",
              }}
            />
          </div>
        </div>
        <div style={{ ...center, top: 920 }}>
          <SerifWords text="virou" start={30} size={70} />
        </div>
        <div style={{ ...center, top: 1030 }}>
          <TypeCaps
            text="COMANDANTE"
            start={42}
            cps={22}
            size={110}
            weight={800}
            cursor={C.red}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 470,
            top: 1210,
            opacity: ease(f, 62, 72),
            rotate: `${interpolate(f, [62, d], [-30, 10])}deg`,
          }}
        >
          <Star size={140} />
        </div>
      </Camera>
    </Paper>
  );
};

/* 11 — 1959, derrubaram Batista */
export const S11: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <Camera dur={d} from={1.12} to={1.0}>
        <Photo
          k="havana"
          w={1080}
          h={1920}
          pos="50% 50%"
          tint="warm"
          fallback={<Paper tone="#3a352c" />}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,.05) 45%, rgba(0,0,0,.75))",
          }}
        />
      </Camera>
      <div
        style={{
          ...center,
          top: 180,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 280,
          letterSpacing: -6,
          color: "transparent",
          WebkitTextStroke: "3px #f2eee6",
          opacity: ease(f, 4, 18),
          translate: `0px ${(1 - ease(f, 4, 24)) * 40}px`,
        }}
      >
        1959
      </div>
      <div style={{ ...center, top: 1380 }}>
        <SerifWords
          text="os guerrilheiros derrubaram"
          start={20}
          every={5}
          size={66}
          color="#f1ede4"
        />
      </div>
      <div style={{ ...center, top: 1470 }}>
        <SerifWords
          text="a ditadura de Batista"
          start={44}
          every={5}
          size={80}
          color="#f1ede4"
          highlight={["Batista"]}
          hlColor={C.redSoft}
        />
      </div>
      <Label
        text="1º DE JANEIRO DE 1959"
        start={64}
        style={{ left: 300, top: 1640 }}
        size={38}
      />
    </Dark>
  );
};

/* 12 — ministro, presidente do Banco Nacional, rosto da revolução */
export const S12: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const titles: [string, number][] = [
    ["PRESIDENTE DO BANCO NACIONAL", 6],
    ["MINISTRO DA INDÚSTRIA", 34],
    ["ROSTO DA REVOLUÇÃO", 70],
  ];
  return (
    <Paper>
      <Camera dur={d} from={1.0} to={1.08} rot={0.6}>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 260,
            rotate: "-5deg",
            ...pop(f, 8),
          }}
        >
          <Banknote w={640} />
        </div>
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 620,
            rotate: "4deg",
            ...pop(f, 40),
          }}
        >
          <Photo k="official" w={520} h={660} border={18} pos="50% 25%" />
        </div>
        {titles.map(([t, s], i) => (
          <Label
            key={t}
            text={t}
            start={s}
            size={i === 2 ? 50 : 36}
            bg={i === 2 ? C.red : "#f4f1ea"}
            color={i === 2 ? "#fff" : C.ink}
            style={{
              left: 70 + i * 20,
              top: 1380 + i * 110,
              rotate: `${i % 2 ? 2 : -2}deg`,
            }}
          />
        ))}
      </Camera>
    </Paper>
  );
};

/* 13 — tribunais e fuzilamentos em La Cabaña */
export const S13: React.FC<S> = ({ d }) => (
  <Dark glow="rgba(150,20,15,0.45)">
    <Camera dur={d} from={1.0} to={1.1} y={30}>
      <div style={{ ...center, top: 380 }}>
        <div style={{ rotate: "-2deg", opacity: 0.92 }}>
          <Photo
            k="sierra"
            w={900}
            h={640}
            border={16}
            tint="bw"
            pos="50% 50%"
          />
        </div>
      </div>
      <div style={{ ...center, top: 230 }}>
        <TypeCaps
          text="FORTALEZA DE LA CABAÑA · 1959"
          start={4}
          cps={22}
          size={38}
          color="#eee"
          cursor={C.redSoft}
          font={TYPE}
          weight={400}
        />
      </div>
      <div style={{ ...center, top: 1130 }}>
        <SerifWords
          text="mas também comandou"
          start={24}
          every={5}
          size={66}
          color="#e9e4da"
        />
      </div>
      <div style={{ ...center, top: 1240 }}>
        <SerifWords text="tribunais" start={46} size={120} color={C.redSoft} />
      </div>
      <div style={{ ...center, top: 1390 }}>
        <SerifWords
          text="e fuzilamentos"
          start={66}
          every={6}
          size={120}
          color={C.redSoft}
        />
      </div>
    </Camera>
  </Dark>
);

/* 14 — Alberto Korda, 1960, um instante */
export const S14: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const open = interpolate(f, [0, 30, d - 26, d - 12], [0.15, 1, 1, 0], {
    ...clamp,
    easing: easeInOut,
  });
  return (
    <Dark>
      <Camera dur={d} from={0.95} to={1.12}>
        <div style={{ ...center, top: 560 }}>
          <div
            style={{
              position: "absolute",
              width: 760,
              height: 760,
              top: 20,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Photo k="korda_walk" w={760} h={760} pos="45% 40%" />
          </div>
          <div style={{ rotate: `${f * 0.3}deg` }}>
            <Aperture size={800} open={open} />
          </div>
        </div>
        <div style={{ ...center, top: 260 }}>
          <TypeCaps
            text="5 DE MARÇO DE 1960"
            start={4}
            cps={18}
            size={44}
            color="#eee"
            font={TYPE}
            weight={400}
          />
        </div>
        <div style={{ ...center, top: 1450 }}>
          <SerifWords
            text="o fotógrafo Alberto Korda"
            start={24}
            every={5}
            size={70}
            color="#eee"
            highlight={["Korda"]}
            hlColor={C.redSoft}
          />
        </div>
        <div style={{ ...center, top: 1560 }}>
          <SerifWords
            text="por um instante."
            start={62}
            every={5}
            size={70}
            color="#bbb"
          />
        </div>
      </Camera>
    </Dark>
  );
};

/* 15 — uma das imagens mais reproduzidas da história */
export const S15: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [10, d], [1, 0.34], { ...clamp, easing: easeInOut });
  const tiles = [];
  for (let r = -2; r <= 2; r++)
    for (let c = -2; c <= 2; c++) {
      const isC = r === 0 && c === 0;
      const dist = Math.abs(r) + Math.abs(c);
      const op = isC ? 1 : ease(f, 20 + dist * 8, 32 + dist * 8);
      const red = (r + c + 10) % 2 === 1;
      tiles.push(
        <div
          key={`${r}${c}`}
          style={{
            position: "absolute",
            left: 540 - 430 + c * 900,
            top: 960 - 560 + r * 1160,
            opacity: op,
          }}
        >
          <Photo
            k="korda"
            w={860}
            h={1120}
            tint={isC ? "bw" : red ? "red" : "bw"}
            pos="50% 30%"
            fallback={
              <div
                style={{
                  width: 860,
                  height: 1120,
                  background: red ? C.red : C.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Star size={500} color={red ? C.ink : C.red} />
              </div>
            }
          />
        </div>,
      );
    }
  return (
    <Paper>
      <AbsoluteFill style={{ scale: String(z) }}>{tiles}</AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(233,230,223,0) 60%, rgba(233,230,223,.95) 80%)",
        }}
      />
      <div style={{ ...center, top: 1560 }}>
        <SerifWords
          text="uma das imagens mais reproduzidas"
          start={34}
          every={5}
          size={64}
        />
      </div>
      <div style={{ ...center, top: 1650 }}>
        <SerifWords
          text="da história."
          start={66}
          every={6}
          size={86}
          highlight={["história"]}
        />
      </div>
    </Paper>
  );
};

/* 16 — Congo e Bolívia */
export const S16: React.FC<S> = ({ d }) => (
  <Paper>
    <Camera dur={d} from={1.0} to={1.1} x={-20}>
      <div style={{ position: "absolute", left: 0, top: 560 }}>
        <MapArt
          w={1080}
          h={900}
          world
          fit={[
            [-100, -40],
            [45, 30],
          ]}
          highlight={[
            { name: "Cuba", color: C.red, start: 30 },
            { name: "Dem. Rep. Congo", color: C.red, start: 80 },
            { name: "Bolivia", color: C.red, start: 128 },
          ]}
          routes={[
            {
              pts: [
                [-82.4, 23.1],
                [29.2, -4.9],
              ],
              start: 50,
              dur: 34,
            },
            {
              pts: [
                [29.2, -4.9],
                [-63.2, -17.8],
              ],
              start: 100,
              dur: 34,
            },
          ]}
          pins={[
            { at: [-82.4, 23.1], label: "CUBA", start: 30, side: "l" },
            { at: [29.2, -4.9], label: "CONGO · 1965", start: 80, side: "l" },
            {
              at: [-63.2, -17.8],
              label: "BOLÍVIA · 1966",
              start: 128,
              side: "r",
            },
          ]}
        />
      </div>
      <div style={{ ...center, top: 230 }}>
        <SerifWords text="mas ele não queria" start={0} every={4} size={66} />
      </div>
      <div style={{ ...center, top: 320 }}>
        <SerifWords
          text="um escritório."
          start={16}
          every={5}
          size={96}
          highlight={["escritório"]}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 650,
          top: 1150,
          rotate: "5deg",
          ...pop(useCurrentFrame(), 92),
        }}
      >
        <Photo k="congo" w={300} h={380} border={14} pos="50% 30%" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1170,
          rotate: "-4deg",
          ...pop(useCurrentFrame(), 138),
        }}
      >
        <Photo k="bolivia" w={380} h={300} border={14} pos="50% 40%" />
      </div>
      <div style={{ ...center, top: 1580 }}>
        <SerifWords
          text="tentou levar a revolução adiante"
          start={56}
          every={5}
          size={60}
        />
      </div>
    </Camera>
  </Paper>
);

/* 17 — Outubro de 1967, La Higuera, 39 anos */
export const S17: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <Camera dur={d} from={1.0} to={1.1}>
        {has("bolivia") ? (
          <AbsoluteFill style={{ opacity: 0.18 * ease(f, 0, 30) }}>
            <Photo k="bolivia" w={1080} h={1920} tint="bw" pos="50% 40%" />
          </AbsoluteFill>
        ) : null}
        <div style={{ ...center, top: 640 }}>
          <TypeCaps
            text="9 · OUTUBRO · 1967"
            start={6}
            cps={14}
            size={84}
            color="#f1f1f1"
            font={TYPE}
            weight={400}
            cursor={C.redSoft}
          />
        </div>
        <RedStroke
          start={50}
          w={760}
          h={240}
          color={C.redSoft}
          style={{ left: 160, top: 580 }}
          len={2200}
          d="M380 15 C 650 5, 760 80, 740 130 C 710 220, 100 230, 30 150 C -10 90, 120 20, 400 22"
        />
        <div style={{ ...center, top: 880 }}>
          <SerifWords
            text="capturado e executado"
            start={40}
            every={6}
            size={78}
            color="#e9e4da"
          />
        </div>
        <div style={{ ...center, top: 990 }}>
          <SerifWords
            text="em La Higuera, Bolívia"
            start={66}
            every={5}
            size={62}
            color="#bdb7ab"
          />
        </div>
        <div style={{ ...center, top: 1300, opacity: ease(f, 110, 130) }}>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 800,
              fontSize: 74,
              letterSpacing: -2,
              color: "#f1ede4",
            }}
          >
            tinha <span style={{ color: C.redSoft }}>39</span> anos.
          </div>
        </div>
      </Camera>
    </Dark>
  );
};

/* 18 — Herói para uns, violência para outros */
export const S18: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const split = ease(f, 30, 50, 0, 1, easeInOut);
  return (
    <Paper>
      <Camera dur={d} from={1.0} to={1.06}>
        <div style={{ ...center, top: 360 }}>
          <SerifWords text="herói" start={2} size={200} />
        </div>
        <div style={{ ...center, top: 600 }}>
          <SerifWords text="para uns." start={14} every={5} size={66} />
        </div>
      </Camera>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 960 + (1 - split) * 1000,
          height: 1000,
        }}
      >
        <svg
          width={1080}
          height={60}
          style={{ position: "absolute", top: -40 }}
        >
          <path
            d={`M0 40 ${Array.from({ length: 28 })
              .map((_, i) => `L${i * 40} ${20 + ((i * 37) % 23)}`)
              .join(" ")} L1080 30 L1080 60 L0 60 Z`}
            fill="#141414"
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "#141414" }}>
          <div style={{ ...center, top: 160 }}>
            <SerifWords
              text="violência"
              start={46}
              size={170}
              color={C.redSoft}
            />
          </div>
          <div style={{ ...center, top: 380 }}>
            <SerifWords
              text="para outros."
              start={60}
              every={5}
              size={66}
              color="#e9e4da"
            />
          </div>
        </div>
      </div>
    </Paper>
  );
};

/* 19 — virou aquilo que nunca controlou: uma imagem */
export const S19: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 70], [2.6, 1], { ...clamp, easing: easeInOut });
  const fadeOut = interpolate(f, [d - 26, d - 2], [0, 1], clamp);
  return (
    <Paper>
      <Camera dur={d} from={1} to={1.06}>
        <div style={{ ...center, top: 360 }}>
          <div
            style={{ scale: String(z), translate: `0px ${(z - 1) * 120}px` }}
          >
            <TShirt w={720} color="#f6f4ee">
              <PrintFace h={330} />
            </TShirt>
          </div>
        </div>
        <div style={{ ...center, top: 1180 }}>
          <SerifWords
            text="aquilo que ele nunca controlou:"
            start={56}
            every={5}
            size={60}
          />
        </div>
        <div style={{ ...center, top: 1290 }}>
          <SerifWords
            text="uma imagem."
            start={96}
            every={8}
            size={150}
            highlight={["imagem"]}
          />
        </div>
      </Camera>
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
    </Paper>
  );
};

export const SCENES = [
  S01,
  S02,
  S03,
  S04,
  S05,
  S06,
  S07,
  S08,
  S09,
  S10,
  S11,
  S12,
  S13,
  S14,
  S15,
  S16,
  S17,
  S18,
  S19,
];
