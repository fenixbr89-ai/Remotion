import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Cam, Floor, Jaw, Lights, Molar, Screw, Stage } from "../Escuro/Models";
import { Dust, Frame, Tag } from "../Escuro/Overlay";
import { Arrow3D, BoneCells, Burst, Crumbs, Food, GapGlow } from "../Escuro/FX";
import { FollowButton } from "../Escuro/Follow";
import { K, sans } from "../Escuro/theme";

type V3 = [number, number, number];

const FPS = 30;
const EIO = Easing.bezier(0.65, 0, 0.35, 1);
const POP = Easing.bezier(0.34, 1.45, 0.64, 1);
/** progress between seconds a and a+d (local scene time) */
const P = (s: number, a: number, d: number, e = EIO) =>
  interpolate(s, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const bite = (s: number, start: number, period = 1.1) => {
  if (s < start) return 0;
  const ph = ((s - start) % period) / period;
  return ph < 0.35 ? ph / 0.35 : 1 - (ph - 0.35) / 0.65;
};

const Rings: React.FC<{ x: number; y?: number; s: number }> = ({ x, y = -0.9, s }) => (
  <group position={[x, y, 0.2]}>
    {[0, 1, 2].map((k) => {
      const ph = (((s / 1.1 + k / 3) % 1) + 1) % 1;
      return (
        <mesh key={k} rotation={[Math.PI / 2.4, 0, 0]} scale={[0.6 + ph * 0.9, 0.6 + ph * 0.9, 1]}>
          <torusGeometry args={[0.6, 0.025, 8, 64]} />
          <meshBasicMaterial color={K.pink} transparent opacity={1 - ph} />
        </mesh>
      );
    })}
  </group>
);

const JAW_CAM = { pos: [0, 3.2, 20] as V3, target: [0, -1.25, 0] as V3 };
const JAWS_CAM = { pos: [0, 2.6, 27] as V3, target: [0, -0.9, 0] as V3 };
const STAGE_CAM = { pos: [0, 2.2, 15] as V3, target: [0, -0.6, 0] as V3 };
const JY = 0.6;

const JAW = (children: React.ReactNode, ry = -0.25) => (
  <group position={[0, JY, 0]} rotation={[0.12, ry, 0]}>
    {children}
  </group>
);

export type NScene = {
  id: string;
  start: number; // seconds in the narration
  end: number;
  cam: { pos: V3; target: V3 };
  floorY?: number;
  /** s = seconds since scene start, t = 0..1 progress, f = local frame */
  world: (s: number, t: number, f: number) => React.ReactNode;
  tags?: (s: number, t: number) => React.ReactNode;
};

/** a 2D checklist card used in the "avaliação" scene */
const Check: React.FC<{ label: string; p: number; y: number }> = ({ label, p, y }) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      right: 150,
      top: y,
      display: "flex",
      alignItems: "center",
      gap: 26,
      padding: "26px 34px",
      borderRadius: 30,
      background: "#fff",
      boxShadow: "0 18px 40px rgba(200,90,140,0.16)",
      opacity: Math.min(1, p * 3),
      translate: `${(1 - Math.min(1, p * 1.4)) * 160}px 0px`,
      fontFamily: sans,
      fontWeight: 800,
      fontSize: 50,
      color: K.ink,
    }}
  >
    <svg width={70} height={70} viewBox="0 0 24 24">
      <circle cx={12} cy={12} r={11} fill={p > 0.5 ? K.pink : "#f6e6ec"} />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        stroke="#fff"
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, (p - 0.5) * 2))}
      />
    </svg>
    {label}
  </div>
);

export const NSCENES: NScene[] = [
  {
    // "Perder um dente, quando ele sai,"
    id: "N01-DenteSai",
    start: 0,
    end: 2.4,
    cam: JAW_CAM,
    world: (s, t, f) => {
      const wig = s > 0.2 && s < 1.6 ? Math.sin(s * 28) * 0.13 * P(s, 0.2, 0.8) : 0;
      const lift = P(s, 1.5, 0.9, Easing.bezier(0.5, 0, 0.75, 0));
      return JAW(
        <Jaw
          middle="tooth"
          middleLift={lift}
          middleRot={wig}
          mood={s < 1.6 ? "happy" : "wow"}
          middleMood={s < 0.5 ? "happy" : "wow"}
          look={s < 1.6 ? 0 : 1}
          t={f}
        />,
        -0.2 + t * 0.1,
      );
    },
  },
  {
    // "fica um espaço vazio, e os dentes vizinhos logo percebem essa mudança."
    id: "N02-Espaco",
    start: 2.4,
    end: 7.0,
    cam: JAW_CAM,
    world: (s, t, f) =>
      JAW(
        <>
          <Jaw middle="none" mood={s < 1.4 ? "wow" : "worried"} look={s < 1.4 ? 0 : 1} t={f} />
          <GapGlow f={f} on={P(s, 0.1, 0.4)} />
        </>,
        -0.3 + t * 0.2,
      ),
    tags: (s) => (s > 0.3 ? <Tag text="ESPAÇO VAZIO" x={540} y={400} neon /> : null),
  },
  {
    // "Sem a raiz para receber estímulo, o osso daquela região começa a ser reabsorvido."
    id: "N03-Reabsorcao",
    start: 7.0,
    end: 12.4,
    cam: JAW_CAM,
    world: (s, t, f) => {
      const loss = P(s, 2.3, 3, Easing.linear) * 0.6;
      return JAW(
        <>
          <Jaw middle="none" boneLoss={loss} mood={s < 2.3 ? "worried" : "sad"} look={1} t={f} />
          {/* no root = no stimulus: faint crossed rings in the gap */}
          <group position={[0, -0.9, 0.3]} scale={1 - P(s, 0.3, 1.6)}>
            <mesh rotation={[Math.PI / 2.4, 0, 0]}>
              <torusGeometry args={[0.6, 0.03, 8, 48]} />
              <meshBasicMaterial color={K.pink} transparent opacity={0.8} />
            </mesh>
          </group>
          <Crumbs at={[0, -1.0, 0.1]} p={P(s, 2.3, 3, Easing.linear)} n={24} />
        </>,
      );
    },
    tags: (s) => (s > 2.3 ? <Tag text="REABSORÇÃO" x={540} y={400} neon /> : null),
  },
  {
    // "Em alguns casos, essa perda pode chegar até 50%."
    id: "N04-Cinquenta",
    start: 12.4,
    end: 15.9,
    cam: JAW_CAM,
    world: (s, t, f) => {
      const loss = 0.6 + P(s, 0.3, 2.2) * 0.4;
      return JAW(
        <>
          <Jaw middle="none" boneLoss={loss} mood="sad" look={1} t={f} />
          <Crumbs at={[0, -1.1, 0.1]} p={P(s, 0.3, 2.4, Easing.linear)} n={14} />
        </>,
        -0.25 + t * 0.15,
      );
    },
    tags: (s) => <Tag text={`ATÉ ${Math.round(50 * P(s, 0.3, 2.0))}%`} sub="DA LARGURA DO OSSO" x={540} y={405} neon big />,
  },
  {
    // "Enquanto isso, os dentes ao lado podem tombar para dentro do buraco,"
    id: "N05-Tombam",
    start: 15.9,
    end: 20.6,
    cam: JAW_CAM,
    world: (s, t, f) =>
      JAW(<Jaw middle="none" boneLoss={1} tilt={0.26 * P(s, 2.6, 1.6)} mood={s < 2.6 ? "worried" : "wow"} look={1} t={f} />, -0.3 + t * 0.15),
    tags: (s) => (s > 2.6 ? <Tag text="INCLINAÇÃO" x={540} y={400} /> : null),
  },
  {
    // "e o dente de cima pode descer."
    id: "N06-Desce",
    start: 20.6,
    end: 22.6,
    cam: JAWS_CAM,
    world: (s, t, f) => (
      <group rotation={[0.1, -0.25 + t * 0.12, 0]}>
        <group position={[0, -1.7, 0]}>
          <Jaw middle="none" boneLoss={1} tilt={0.26} mood="worried" look={1} t={f} />
        </group>
        <group position={[0, 1.9, 0]}>
          <Jaw upper extrude={0.95 * P(s, 0.3, 1.5)} mood="calm" middleMood={s < 0.6 ? "calm" : "wow"} t={f + 20} />
        </group>
      </group>
    ),
    tags: () => <Tag text="EXTRUSÃO" x={760} y={820} neon />,
  },
  {
    // "Aos poucos, a mordida perde o encaixe, facilitando o acúmulo de restos de comida e dificultando a mastigação."
    id: "N07-Mordida",
    start: 22.6,
    end: 29.4,
    cam: JAWS_CAM,
    world: (s, t, f) => {
      const b = bite(s, 0.9, 1.05);
      return (
        <group rotation={[0.1, -0.3 + t * 0.25, 0]}>
          <group position={[0, -1.7, 0]}>
            <Jaw middle="none" boneLoss={1} tilt={0.26} mood={s > 4.8 ? "sad" : "worried"} look={1} t={f} />
            <Food p={P(s, 2.6, 1.6, Easing.linear)} />
          </group>
          <group position={[0.35 * b, 1.9 - 0.5 * b, 0]} rotation={[0, 0, 0.07 * b]}>
            <Jaw upper extrude={0.95} mood="worried" middleMood="sad" t={f + 20} />
          </group>
        </group>
      );
    },
    tags: (s) => (
      <>
        {s > 1.4 ? <Tag text="SEM ENCAIXE" x={760} y={560} /> : null}
        {s > 2.8 ? <Tag text="COMIDA PRESA" x={300} y={1010} /> : null}
      </>
    ),
  },
  {
    // "Mas existe uma solução, o implante dentário."
    id: "N08-Solucao",
    start: 29.4,
    end: 32.8,
    cam: STAGE_CAM,
    world: (s, t, f) => {
      const drop = P(s, 0.9, 0.9, Easing.bezier(0.3, 0, 0.2, 1));
      return (
        <>
          <Stage on={P(s, 0.1, 0.6)} />
          <group position={[0, 1.2 + (1 - drop) * 5 + Math.sin(f / 12) * 0.06 * drop, 0]} rotation={[0.1, f * 0.1, 0]}>
            <Screw len={2} />
          </group>
        </>
      );
    },
    tags: (s) => (s > 1.9 ? <Tag text="IMPLANTE DENTÁRIO" x={540} y={400} neon /> : null),
  },
  {
    // "Primeiro, o espaço é preparado no osso."
    id: "N09-Broca",
    start: 32.8,
    end: 35.3,
    cam: JAW_CAM,
    world: (s, t, f) => {
      const dIn = P(s, 0, 0.5);
      const depth = P(s, 0.6, 1.4);
      const dOut = P(s, 2.05, 0.45);
      return JAW(
        <Jaw
          middle="none"
          boneLoss={0}
          drill={{ depth: depth * (1 - dOut) - dOut * 1.2 - (1 - dIn) * 1.5, spin: f * 0.9, on: dIn * (1 - dOut) }}
          hole={depth}
          mood={s < 0.6 ? "calm" : "wow"}
          look={1}
          t={f}
        />,
      );
    },
    tags: (s) => (s > 0.7 ? <Tag text="PREPARO DO OSSO" x={760} y={520} neon /> : null),
  },
  {
    // "Depois, um pino de titânio é colocado com precisão."
    id: "N10-Pino",
    start: 35.3,
    end: 39.0,
    cam: JAW_CAM,
    world: (s, t, f) => {
      const down = P(s, 0.5, 0.6);
      const into = P(s, 1.1, 2.2);
      const insert = down * 0.35 + into * 0.65;
      return JAW(
        <Jaw
          middle="implant"
          implant={{ insert, spin: into * Math.PI * 14, abutment: 0, crown: 0, glow: 0 }}
          screwOn={s > 0.45}
          hole={1}
          mood="wow"
          look={1}
          t={f}
        />,
      );
    },
    tags: (s) => (s > 0.9 ? <Tag text="PINO DE TITÂNIO" x={760} y={520} neon /> : null),
  },
  {
    // "Com o tempo, o osso se une ao pino, um processo chamado osseointegração."
    id: "N11-Osseo",
    start: 39.0,
    end: 44.2,
    cam: JAW_CAM,
    world: (s, t, f) => {
      const g = P(s, 0.9, 2.6);
      return JAW(
        <>
          <Jaw middle="implant" implant={{ insert: 1, spin: 0, abutment: 0, crown: 0, glow: 0.55 * g }} hole={1 - g} mood={g > 0.6 ? "happy" : "calm"} look={1} t={f} />
          <BoneCells p={g} />
          {s > 0.9 ? <Rings x={0} y={-1} s={s} /> : null}
        </>,
        -0.25 + t * 0.15,
      );
    },
    tags: (s) => (s > 3.2 ? <Tag text="OSSEOINTEGRAÇÃO" x={540} y={405} neon big /> : null),
  },
  {
    // "Em seguida, o pilar é encaixado e recebe a coroa, que devolve a forma e a função do dente."
    id: "N12-Coroa",
    start: 44.2,
    end: 50.2,
    cam: JAW_CAM,
    world: (s, t, f) => {
      const ab = P(s, 0.9, 1.0);
      const cr = P(s, 2.5, 1.0, POP);
      return JAW(
        <>
          <Jaw
            middle="implant"
            implant={{ insert: 1, spin: 0, abutment: ab, crown: s < 2.5 ? 0 : Math.max(0.001, cr), glow: 0 }}
            mood={s > 3.5 ? "happy" : "wow"}
            middleMood={s > 3.6 ? "happy" : "wow"}
            look={1}
            t={f}
          />
          <Burst at={[0, 0.7, 0]} p={P(s, 3.4, 1.0, Easing.linear)} />
        </>,
        -0.25 + t * 0.15,
      );
    },
    tags: (s) => (
      <>
        {s > 1.1 ? <Tag text="PILAR" x={330} y={700} /> : null}
        {s > 2.8 ? <Tag text="COROA" x={760} y={470} neon /> : null}
      </>
    ),
  },
  {
    // "Assim, a mordida volta a funcionar melhor, e o novo dente também volta a receber estímulo."
    id: "N13-Estimulo",
    start: 50.2,
    end: 55.3,
    cam: JAW_CAM,
    world: (s, t, f) => {
      const b = bite(s, 0.6, 1.1);
      return JAW(
        <>
          <Jaw middle="implant" implant={{ insert: 1, spin: 0, abutment: 1, crown: 1, glow: 0 }} mood="happy" middleMood={b > 0.7 ? "wink" : "happy"} t={f} />
          {[-1.55, 0, 1.55].map((x) => (
            <Arrow3D key={x} x={x} y={2.1} press={b} on={P(s, 0.2, 0.4)} />
          ))}
          {s > 2.8 ? <Rings x={0} y={-1} s={s - 2.8} /> : null}
        </>,
        -0.3 + t * 0.2,
      );
    },
    tags: (s) => (s > 2.8 ? <Tag text="ESTÍMULO DE VOLTA" x={540} y={330} neon /> : null),
  },
  {
    // "Cada caso precisa de avaliação profissional, planejamento e acompanhamento do dentista."
    id: "N14-Avaliacao",
    start: 55.3,
    end: 61.0,
    cam: { pos: [0, 2.2, 15], target: [0, -2.4, 0] },
    world: (s, t, f) => (
      <>
        <Stage y={-1.4} on={P(s, 0, 0.5)} />
        <group position={[0, 0.25 + Math.sin(f / 14) * 0.08, 0]} rotation={[0.15, -0.5 + t * 1.0, 0]}>
          <Molar mood={s < 1.6 ? "calm" : "happy"} blink={f % 80 < 4} />
        </group>
      </>
    ),
    tags: (s) => (
      <>
        <Check label="Avaliação profissional" p={P(s, 1.7, 0.6)} y={980} />
        <Check label="Planejamento" p={P(s, 3.0, 0.6)} y={1110} />
        <Check label="Acompanhamento" p={P(s, 4.0, 0.6)} y={1240} />
      </>
    ),
  },
  {
    // "Gostou? Toque em seguir para acompanhar mais conteúdo sobre saúde bucal."
    id: "N15-Seguir",
    start: 61.0,
    end: 65.44,
    cam: STAGE_CAM,
    floorY: -30,
    world: () => null,
    tags: (s, t) => <FollowButton t={t} tap={(62.32 - 61.0) / (65.44 - 61.0)} />,
  },
];

/** One narrated scene. */
export const NarratedScene: React.FC<{ scene: NScene; dur: number }> = ({ scene, dur }) => {
  const f = useCurrentFrame();
  const s = f / FPS;
  const t = Math.min(1, f / dur);
  const k = 1.05 - 0.09 * Easing.bezier(0.33, 0, 0.2, 1)(t);
  const camPos: V3 = [scene.cam.pos[0] + (t - 0.5) * 1.2, scene.cam.pos[1], scene.cam.pos[2] * k];
  const tagP = interpolate(f, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: POP });
  return (
    <Frame>
      <Dust />
      <ThreeCanvas width={1080} height={1920} shadows>
        <Cam pos={camPos} target={scene.cam.target} />
        <Lights />
        <Floor y={scene.floorY ?? (scene.cam === STAGE_CAM ? -1.42 : scene.cam === JAWS_CAM ? -3.8 : -1.48)} />
        {scene.world(s, t, f)}
      </ThreeCanvas>
      {scene.tags ? (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, tagP), scale: `${0.85 + 0.15 * tagP}` }}>{scene.tags(s, t)}</div>
      ) : null}
    </Frame>
  );
};
