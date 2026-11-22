import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Clipping,
  CommentCard,
  Diary,
  FollowButton,
  Label,
  Photo,
  Scraps,
  Star,
} from "./Art";
import { MapArt } from "./MapArt";
import {
  C,
  Camera,
  Dark,
  Paper,
  RedStroke,
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

const Stamp: React.FC<{
  text: string;
  start: number;
  style?: React.CSSProperties;
  size?: number;
  color?: string;
}> = ({ text, start, style, size = 90, color = C.red }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        border: `7px solid ${color}`,
        padding: "4px 26px",
        fontFamily: TYPE,
        fontSize: size,
        color,
        opacity: ease(f, start, start + 6) * 0.92,
        scale: String(
          interpolate(f, [start, start + 10], [1.35, 1], {
            ...clamp,
            easing: easeInOut,
          }),
        ),
        rotate: "-9deg",
        mixBlendMode: "multiply",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* family — o mais velho de cinco irmãos */
export const N_Family: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper seed={2}>
      <Camera dur={d} from={1.0} to={1.08} x={-30}>
        <div style={{ ...center, top: 260 }}>
          <SerifWords text="o mais velho" start={4} every={5} size={86} />
        </div>
        <div style={{ ...center, top: 360 }}>
          <SerifWords
            text="de cinco irmãos"
            start={18}
            every={5}
            size={86}
            highlight={["cinco"]}
          />
        </div>
        <div style={{ ...center, top: 640, ...pop(f, 8, 18) }}>
          <div style={{ rotate: "-3deg" }}>
            <Photo
              k="family"
              w={960}
              h={520}
              border={20}
              tint="warm"
              pos="50% 40%"
            />
          </div>
        </div>
        <Stamp
          text="5"
          start={40}
          size={150}
          style={{ right: 80, top: 1160 }}
        />
        <Label
          text="ARGENTINA · ANOS 1940"
          start={50}
          style={{ left: 90, top: 1250 }}
          size={38}
        />
        <div style={{ ...center, top: 1460 }}>
          <SerifWords
            text="uma família de classe média."
            start={60}
            every={5}
            size={62}
          />
        </div>
      </Camera>
    </Paper>
  );
};

/* Guatemala 1954 */
export const N_Guatemala: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper seed={4}>
      <Camera dur={d} from={1.02} to={1.12} rot={-1}>
        <div style={{ ...center, top: 220 }}>
          <TypeCaps
            text="GUATEMALA · 1954"
            start={2}
            cps={16}
            size={50}
            font={TYPE}
            weight={400}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 420,
            rotate: "6deg",
            ...pop(f, 30),
          }}
        >
          <Clipping
            w={460}
            kicker="EDICIÓN EXTRA · 27 JUN 1954"
            headline="ÁRBENZ RENUNCIA"
            start={36}
            paper="#e6dcc4"
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 520,
            rotate: "-4deg",
            ...pop(f, 8),
          }}
        >
          <Clipping
            w={620}
            kicker="DIARIO · GUATEMALA"
            headline="GOLPE DERRUBA GOVERNO ELEITO"
            start={12}
          />
        </div>
        <RedStroke
          start={44}
          w={600}
          h={160}
          style={{ left: 70, top: 600 }}
          len={1700}
          d="M300 10 C 520 0, 600 60, 580 100 C 550 160, 80 160, 30 100 C -10 50, 120 10, 320 14"
        />
        <div style={{ ...center, top: 1320 }}>
          <SerifWords
            text="ele viu um governo eleito"
            start={40}
            every={5}
            size={66}
          />
        </div>
        <div style={{ ...center, top: 1420 }}>
          <SerifWords
            text="cair num golpe"
            start={60}
            every={5}
            size={92}
            highlight={["golpe"]}
          />
        </div>
        <div style={{ ...center, top: 1560 }}>
          <SerifWords
            text="apoiado pelos Estados Unidos."
            start={78}
            every={5}
            size={60}
          />
        </div>
      </Camera>
    </Paper>
  );
};

/* Ali ele decidiu: a mudança viria pelas armas */
export const N_Armas: React.FC<S> = ({ d }) => (
  <Dark glow="rgba(160,25,20,0.5)">
    <Scraps dark seed={3} />
    <Camera dur={d} from={1.0} to={1.14}>
      <div style={{ ...center, top: 700 }}>
        <SerifWords
          text="ali, ele decidiu:"
          start={2}
          every={5}
          size={66}
          color="#cfc8bb"
        />
      </div>
      <div style={{ ...center, top: 820 }}>
        <SerifWords
          text="a mudança viria"
          start={20}
          every={5}
          size={100}
          color="#f3efe6"
        />
      </div>
      <div style={{ ...center, top: 950 }}>
        <SerifWords
          text="pelas armas."
          start={40}
          every={7}
          size={150}
          color={C.redSoft}
        />
      </div>
    </Camera>
  </Dark>
);

/* Landing disaster, Sierra Maestra */
export const N_Sierra: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const n = Math.round(
    interpolate(f, [26, 70], [82, 20], { ...clamp, easing: easeInOut }),
  );
  return (
    <Dark>
      <Camera dur={d} from={1.12} to={1.0} y={-20}>
        <AbsoluteFill style={{ opacity: 0.75 }}>
          <Photo k="sierra" w={1080} h={1920} pos="50% 50%" tint="warm" />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.75), rgba(0,0,0,.2) 45%, rgba(0,0,0,.8))",
          }}
        />
      </Camera>
      <div style={{ ...center, top: 220 }}>
        <SerifWords
          text="o desembarque foi um desastre."
          start={2}
          every={5}
          size={62}
          color="#eee"
        />
      </div>
      <div
        style={{
          ...center,
          top: 330,
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: 260,
          color: n < 82 ? C.redSoft : "#fff",
          letterSpacing: -8,
        }}
      >
        {n}
      </div>
      <div style={{ ...center, top: 620 }}>
        <SerifWords
          text="só uns vinte sobreviveram"
          start={50}
          every={5}
          size={64}
          color="#eee"
        />
      </div>
      <Label
        text="SIERRA MAESTRA · 1956–1958"
        start={74}
        style={{ left: 220, top: 1600 }}
        size={42}
      />
    </Dark>
  );
};

/* Santa Clara, end of 1958 */
const CUBA: [[number, number], [number, number]] = [
  [-85, 19.5],
  [-74, 23.5],
];
export const N_SantaClara: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper seed={5}>
      <Camera dur={d} from={1.0} to={1.1} x={30}>
        <div style={{ position: "absolute", left: 0, top: 300 }}>
          <MapArt
            w={1080}
            h={560}
            fit={CUBA}
            highlight={[{ name: "Cuba", color: "#d9cdb4", start: 0 }]}
            routes={[
              {
                pts: [
                  [-77.0, 20.0],
                  [-78.5, 21.3],
                  [-79.96, 22.4],
                ],
                start: 14,
                dur: 30,
              },
            ]}
            pins={[
              {
                at: [-79.96, 22.4],
                label: "SANTA CLARA",
                start: 40,
                side: "l",
              },
              { at: [-82.36, 23.13], label: "HAVANA", start: 56, side: "r" },
            ]}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 860,
            rotate: "-4deg",
            ...pop(f, 30),
          }}
        >
          <Photo k="havana" w={600} h={720} border={18} pos="40% 40%" />
        </div>
        <Label
          text="TREM BLINDADO · DEZ 1958"
          start={60}
          style={{ left: 480, top: 1520 }}
          size={36}
        />
        <div style={{ ...center, top: 160 }}>
          <SerifWords
            text="Che comandou a batalha de"
            start={2}
            every={4}
            size={56}
          />
        </div>
        <div style={{ ...center, top: 1660 }}>
          <SerifWords
            text="que decidiu a guerra."
            start={70}
            every={5}
            size={70}
            highlight={["guerra"]}
          />
        </div>
      </Camera>
    </Paper>
  );
};

/* 1 Jan 1959 — Batista flees */
export const N_Batista: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <Camera dur={d} from={1.1} to={1.0}>
        <AbsoluteFill style={{ opacity: 0.55 }}>
          <Photo k="green" w={1080} h={1920} pos="50% 30%" tint="warm" />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.65), rgba(0,0,0,.1) 40%, rgba(0,0,0,.85))",
          }}
        />
      </Camera>
      <div
        style={{
          ...center,
          top: 170,
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: 260,
          letterSpacing: -6,
          color: "transparent",
          WebkitTextStroke: "3px #f2eee6",
          opacity: ease(f, 2, 16),
        }}
      >
        1959
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 1000,
          rotate: "-5deg",
          ...pop(f, 20),
        }}
      >
        <Clipping
          w={860}
          kicker="LA HABANA · 1º DE ENERO DE 1959"
          headline="BATISTA FOGE DE CUBA"
          start={26}
        />
      </div>
    </Dark>
  );
};

/* Congo 1965 */
export const N_Congo: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper seed={6}>
      <Camera dur={d} from={1.0} to={1.1} x={-20}>
        <div style={{ position: "absolute", left: 0, top: 440 }}>
          <MapArt
            w={1080}
            h={760}
            world
            fit={[
              [-90, -20],
              [45, 30],
            ]}
            highlight={[
              { name: "Cuba", color: C.red, start: 10 },
              { name: "Dem. Rep. Congo", color: C.red, start: 52 },
            ]}
            routes={[
              {
                pts: [
                  [-82.4, 23.1],
                  [29.2, -4.9],
                ],
                start: 22,
                dur: 32,
              },
            ]}
            pins={[
              { at: [-82.4, 23.1], label: "CUBA", start: 10, side: "r" },
              { at: [29.2, -4.9], label: "CONGO · 1965", start: 52, side: "l" },
            ]}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 1170,
            rotate: "-5deg",
            ...pop(f, 60),
          }}
        >
          <Photo k="congo" w={360} h={460} border={16} pos="50% 30%" />
        </div>
        <Stamp
          text="FRACASSO"
          start={96}
          size={84}
          style={{ left: 480, top: 1360 }}
        />
        <div style={{ ...center, top: 200 }}>
          <SerifWords text="em 1965, ele sumiu" start={0} every={5} size={72} />
        </div>
        <div style={{ ...center, top: 300 }}>
          <SerifWords
            text="e foi lutar no Congo."
            start={18}
            every={5}
            size={72}
            highlight={["Congo"]}
          />
        </div>
      </Camera>
    </Paper>
  );
};

/* Bolivia, diary */
export const N_Bolivia: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Paper seed={7} tone="#e4dfd3">
      <Camera dur={d} from={1.02} to={1.1} rot={0.8}>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 420,
            rotate: "-3deg",
            ...pop(f, 6),
          }}
        >
          <Photo k="bolivia" w={760} h={580} border={18} pos="50% 40%" />
        </div>
        <div
          style={{
            position: "absolute",
            right: 50,
            top: 900,
            rotate: "6deg",
            ...pop(f, 40),
          }}
        >
          <Diary w={400} start={46} />
        </div>
        <Label
          text="BOLÍVIA · 1966–1967"
          start={20}
          style={{ left: 80, top: 1110 }}
          size={40}
        />
        <div style={{ ...center, top: 200 }}>
          <SerifWords
            text="depois, a Bolívia."
            start={0}
            every={5}
            size={80}
            highlight={["Bolívia"]}
          />
        </div>
        <div style={{ position: "absolute", left: 80, top: 1300, width: 560 }}>
          <SerifWords
            text="fome, doença e o exército"
            start={60}
            every={5}
            size={64}
            align="left"
          />
          <SerifWords
            text="cada vez mais perto."
            start={84}
            every={5}
            size={64}
            align="left"
            highlight={["perto"]}
          />
        </div>
      </Camera>
    </Paper>
  );
};

/* capture & execution */
export const N_Captured: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <Camera dur={d} from={1.0} to={1.1}>
        <AbsoluteFill style={{ opacity: 0.16 * ease(f, 0, 30) }}>
          <Photo k="bolivia" w={1080} h={1920} tint="bw" pos="50% 40%" />
        </AbsoluteFill>
        <div style={{ ...center, top: 520 }}>
          <TypeCaps
            text="8 · OUTUBRO · 1967"
            start={4}
            cps={14}
            size={84}
            color="#f1f1f1"
            font={TYPE}
            weight={400}
            cursor={C.redSoft}
          />
        </div>
        <RedStroke
          start={44}
          w={760}
          h={240}
          color={C.redSoft}
          style={{ left: 160, top: 460 }}
          len={2200}
          d="M380 15 C 650 5, 760 80, 740 130 C 710 220, 100 230, 30 150 C -10 90, 120 20, 400 22"
        />
        <div style={{ ...center, top: 760 }}>
          <SerifWords
            text="capturado pelo exército boliviano,"
            start={30}
            every={4}
            size={60}
            color="#e9e4da"
          />
        </div>
        <div style={{ ...center, top: 850 }}>
          <SerifWords
            text="com apoio da CIA."
            start={52}
            every={5}
            size={60}
            color="#e9e4da"
            highlight={["CIA"]}
            hlColor={C.redSoft}
          />
        </div>
        <div style={{ ...center, top: 1050 }}>
          <SerifWords
            text="no dia seguinte, executado"
            start={80}
            every={5}
            size={72}
            color="#f3efe6"
          />
        </div>
        <div style={{ ...center, top: 1150 }}>
          <SerifWords
            text="em La Higuera."
            start={104}
            every={5}
            size={72}
            color="#bdb7ab"
          />
        </div>
        <div style={{ ...center, top: 1420, opacity: ease(f, 140, 160) }}>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 800,
              fontSize: 76,
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

/* body hidden for 30 years */
export const N_1997: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const y = Math.round(
    interpolate(f, [30, 90], [1967, 1997], { ...clamp, easing: easeInOut }),
  );
  return (
    <Dark>
      <Camera dur={d} from={1.0} to={1.1}>
        <div style={{ ...center, top: 520 }}>
          <SerifWords
            text="seu corpo ficou escondido"
            start={2}
            every={5}
            size={66}
            color="#e9e4da"
          />
        </div>
        <div
          style={{
            ...center,
            top: 700,
            fontFamily: TYPE,
            fontSize: 250,
            color: y === 1997 ? C.redSoft : "#f1f1f1",
          }}
        >
          {y}
        </div>
        <div style={{ ...center, top: 1060 }}>
          <SerifWords
            text="só foi encontrado 30 anos depois."
            start={96}
            every={4}
            size={58}
            color="#cfc8bb"
          />
        </div>
      </Camera>
    </Dark>
  );
};

/* final hook: comment + follow */
export const N_CTA: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const arrowY = Math.sin(f / 7) * 12;
  return (
    <Paper seed={1}>
      <Camera dur={d} from={1.0} to={1.06}>
        <div style={{ ...center, top: 170 }}>
          <SerifWords
            text="e pra você, ele foi"
            start={2}
            every={5}
            size={64}
          />
        </div>
        <div style={{ ...center, top: 270, gap: 30 }}>
          <SerifWords text="herói" start={18} size={150} />
          <SerifWords
            text="ou"
            start={26}
            size={80}
            style={{ alignSelf: "center" }}
          />
          <SerifWords text="vilão?" start={32} size={150} color={C.red} />
        </div>
        <div style={{ ...center, top: 560, ...pop(f, 50, 16) }}>
          <CommentCard
            start={54}
            name="você"
            text="eu acho que ele foi..."
            likes="12 mil"
          />
        </div>
        <div style={{ ...center, top: 860, opacity: ease(f, 80, 92) }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: SERIF,
              fontWeight: 800,
              fontSize: 56,
              color: C.ink,
            }}
          >
            comenta aqui embaixo
            <svg
              width={60}
              height={80}
              viewBox="0 0 30 40"
              style={{ translate: `0px ${arrowY}px` }}
            >
              <path
                d="M15 2 V34 M4 24 L15 36 L26 24"
                fill="none"
                stroke={C.red}
                strokeWidth={4.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 1080,
            height: 4,
            background: "rgba(0,0,0,.15)",
            opacity: ease(f, 110, 120),
          }}
        />
        <div style={{ ...center, top: 1180, ...pop(f, 120, 16) }}>
          <div
            style={{
              width: 230,
              height: 230,
              borderRadius: "50%",
              background: C.ink,
              border: `8px solid ${C.red}`,
              boxShadow: "0 18px 40px rgba(0,0,0,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star size={130} />
          </div>
        </div>
        <div style={{ ...center, top: 1450 }}>
          <FollowButton start={130} pressAt={170} />
        </div>
        <div style={{ ...center, top: 1640 }}>
          <SerifWords
            text="pra mais histórias como essa."
            start={150}
            every={5}
            size={56}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 1220,
            opacity: ease(f, 175, 185),
            rotate: `${f}deg`,
          }}
        >
          <Star size={80} />
        </div>
      </Camera>
    </Paper>
  );
};
