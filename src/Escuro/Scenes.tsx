import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cam, Floor, Jaw, Lights, Screw, Stage } from "./Models";
import { Caption, Dust, Frame, Tag } from "./Overlay";
import { FollowButton } from "./Follow";
import { Arrow3D, BoneCells, Burst, Crumbs, Food, GapGlow } from "./FX";
import { K } from "./theme";

type V3 = [number, number, number];

/** Pink stimulus rings around a root (front view). */
const Rings: React.FC<{ x: number; y?: number; t: number }> = ({ x, y = -0.9, t }) => (
  <group position={[x, y, 0.2]}>
    {[0, 1, 2].map((k) => {
      const ph = (t * 3 + k / 3) % 1;
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

export type SceneSpec = {
  id: string;
  section: string;
  words: string[];
  strong?: number[];
  sec: number;
  cam: { pos: V3; target: V3 };
  floorY?: number;
  world: (t: number, f: number) => React.ReactNode;
  tags?: (t: number) => React.ReactNode;
};

const jawGroupY = 0.6;

/** eased 0..1 progress of frame f between a and a+d */
const P = (f: number, a: number, d: number, e = Easing.bezier(0.65, 0, 0.35, 1)) =>
  interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const POP = Easing.bezier(0.34, 1.45, 0.64, 1);
/** chewing cycle: 0 open .. 1 biting, period frames */
const bite = (f: number, start: number, period = 30) => {
  if (f < start) return 0;
  const ph = ((f - start) % period) / period;
  return ph < 0.35 ? ph / 0.35 : 1 - (ph - 0.35) / 0.65;
};

const JAW = (children: React.ReactNode, ry = -0.25) => (
  <group position={[0, jawGroupY, 0]} rotation={[0.12, ry, 0]}>
    {children}
  </group>
);

export const SPECS: SceneSpec[] = [
  {
    id: "E01-Gancho",
    section: "O DENTE",
    words: ["Perdeu", "um", "dente?"],
    sec: 3.6,
    cam: JAW_CAM,
    world: (t, f) => {
      const wig = f > 12 && f < 50 ? Math.sin(f * 0.9) * 0.12 * P(f, 12, 30) : 0;
      const lift = P(f, 48, 40, Easing.bezier(0.5, 0, 0.75, 0));
      return JAW(
        <Jaw
          middle="tooth"
          middleLift={lift}
          middleRot={wig}
          mood={f < 50 ? "happy" : f < 80 ? "wow" : "sad"}
          middleMood={f < 20 ? "happy" : "wow"}
          look={f < 50 ? 0 : 1}
          t={f}
        />,
        -0.2 + t * 0.1,
      );
    },
    tags: () => <Tag text="UM DENTE A MENOS" x={780} y={600} neon />,
  },
  {
    id: "E02-Buraco",
    section: "O PROBLEMA",
    words: ["O", "problema", "não", "é", "só", "o", "buraco."],
    sec: 3.2,
    cam: JAW_CAM,
    world: (t, f) =>
      JAW(
        <>
          <Jaw middle="none" mood={f < 40 ? "wow" : "worried"} look={1} t={f} />
          <GapGlow f={f} on={P(f, 5, 15)} />
        </>,
        -0.3 + t * 0.15,
      ),
    tags: () => <Tag text="O BURACO" x={540} y={400} neon />,
  },
  {
    id: "E03-Estimulo",
    section: "O OSSO",
    words: ["O", "osso", "que", "segura", "o", "dente", "vive", "de", "estímulo."],
    sec: 3.8,
    cam: JAW_CAM,
    world: (t, f) => {
      const b = bite(f, 20, 34);
      const on = P(f, 8, 12);
      return JAW(
        <>
          <Jaw middle="tooth" mood={b > 0.6 ? "calm" : "happy"} t={f} />
          {[-1.55, 0, 1.55].map((x) => (
            <Arrow3D key={x} x={x} y={2.1} press={b} on={on} />
          ))}
          {f > 20 ? (
            <>
              <Rings x={-1.55} t={(f - 20) / 102} />
              <Rings x={0} t={(f - 20) / 102 + 0.05} />
              <Rings x={1.55} t={(f - 20) / 102 + 0.1} />
            </>
          ) : null}
        </>,
      );
    },
    tags: () => <Tag text="ESTÍMULO" x={540} y={330} neon />,
  },
  {
    id: "E04-Reabsorcao",
    section: "O OSSO",
    words: ["Sem", "a", "raiz,", "o", "corpo", "reabsorve", "esse", "osso."],
    sec: 3.8,
    cam: JAW_CAM,
    world: (t, f) => {
      const loss = P(f, 15, 80);
      return JAW(
        <>
          <Jaw middle="none" boneLoss={loss} mood={loss < 0.3 ? "worried" : "sad"} look={1} t={f} />
          <Crumbs at={[0, -1.0, 0.1]} p={P(f, 15, 85, Easing.linear)} />
        </>,
      );
    },
    tags: (t) => <Tag text={`ATÉ ${Math.round(50 * Math.min(1, Math.max(0, (t - 0.13) / 0.7)))}%`} sub="DA LARGURA NO 1º ANO" x={540} y={405} neon big />,
  },
  {
    id: "E05-Vizinhos",
    section: "OS VIZINHOS",
    words: ["Os", "vizinhos", "tombam", "pro", "espaço", "vazio"],
    sec: 3.2,
    cam: JAW_CAM,
    world: (t, f) => JAW(<Jaw middle="none" boneLoss={1} tilt={0.24 * P(f, 10, 70)} mood={f < 30 ? "wow" : "worried"} look={1} t={f} />),
    tags: () => <Tag text="INCLINAÇÃO" x={540} y={400} />,
  },
  {
    id: "E06-Extrusao",
    section: "OS VIZINHOS",
    words: ["e", "o", "dente", "de", "cima", "desce."],
    sec: 3.2,
    cam: JAWS_CAM,
    world: (t, f) => (
      <group rotation={[0.1, -0.25 + t * 0.12, 0]}>
        <group position={[0, -1.7, 0]}>
          <Jaw middle="none" boneLoss={1} tilt={0.24} mood="worried" look={1} t={f} />
        </group>
        <group position={[0, 1.9, 0]}>
          <Jaw upper extrude={0.95 * P(f, 12, 70)} mood="calm" middleMood={f < 40 ? "calm" : "wow"} t={f + 20} />
        </group>
      </group>
    ),
    tags: () => <Tag text="EXTRUSÃO" x={760} y={820} neon />,
  },
  {
    id: "E07-Mordida",
    section: "A MORDIDA",
    words: ["A", "mordida", "desencaixa", "e", "você", "mastiga", "de", "um", "lado", "só."],
    strong: [4],
    sec: 3.8,
    cam: JAWS_CAM,
    world: (t, f) => {
      const b = bite(f, 8, 32);
      return (
        <group rotation={[0.1, -0.25 + t * 0.1, 0]}>
          <group position={[0, -1.7, 0]}>
            <Jaw middle="none" boneLoss={1} tilt={0.24} mood={b > 0.6 ? "sad" : "worried"} look={1} t={f} />
            <Food p={P(f, 20, 50, Easing.linear)} />
          </group>
          <group position={[0.35 * b, 1.9 - 0.5 * b, 0]} rotation={[0, 0, 0.06 * b]}>
            <Jaw upper extrude={0.95} mood="worried" middleMood="sad" t={f + 20} />
          </group>
        </group>
      );
    },
    tags: () => <Tag text="UM LADO SÓ" x={300} y={1000} />,
  },
  {
    id: "E08-Virada",
    section: "A VIRADA",
    words: ["Agora,", "a", "virada:"],
    strong: [1, 2],
    sec: 2.8,
    cam: STAGE_CAM,
    world: (t, f) => {
      const drop = P(f, 4, 26, Easing.bezier(0.3, 0, 0.2, 1));
      return (
        <>
          <Stage on={P(f, 0, 18)} />
          <group position={[0, 1.2 + (1 - drop) * 5 + Math.sin(f / 12) * 0.06 * drop, 0]} rotation={[0.1, f * 0.12, 0]}>
            <Screw len={2} />
          </group>
        </>
      );
    },
    tags: () => <Tag text="A VIRADA" x={540} y={400} neon />,
  },
  {
    id: "E09-Pino",
    section: "O IMPLANTE",
    words: ["um", "pino", "de", "titânio", "entra", "no", "osso,"],
    sec: 5,
    cam: JAW_CAM,
    world: (t, f) => {
      // 0-15 drill comes in, 15-55 drills down, 55-70 leaves; 65-80 screw comes; 80-140 screws in
      const dIn = P(f, 0, 14);
      const depth = P(f, 15, 40);
      const dOut = P(f, 55, 15);
      const screwDown = P(f, 62, 18);
      const screwIn = P(f, 80, 60);
      const insert = 0.0 + screwDown * 0.35 + screwIn * 0.65;
      return JAW(
        <Jaw
          middle="implant"
          implant={{ insert, spin: screwIn * Math.PI * 12, abutment: 0, crown: 0, glow: 0 }}
          screwOn={f > 60}
          drill={dOut < 1 ? { depth: depth * (1 - dOut) - dOut * 1.2 + (1 - dIn) * -1.5, spin: f * 0.9, on: dIn * (1 - dOut) } : null}
          hole={depth}
          mood={f < 15 ? "calm" : "wow"}
          look={1}
          t={f}
        />,
      );
    },
    tags: () => <Tag text="TITÂNIO" x={760} y={520} neon />,
  },
  {
    id: "E10-Osseo",
    section: "O IMPLANTE",
    words: ["o", "osso", "se", "une", "a", "ele"],
    sec: 3.8,
    cam: JAW_CAM,
    world: (t, f) => {
      const g = P(f, 10, 85);
      return JAW(
        <>
          <Jaw middle="implant" implant={{ insert: 1, spin: Math.PI * 12, abutment: 0, crown: 0, glow: 0.55 * g }} hole={1 - g} mood={g > 0.6 ? "happy" : "calm"} look={1} t={f} />
          <BoneCells p={g} />
          <Rings x={0} y={-1} t={f / 60} />
        </>,
      );
    },
    tags: () => <Tag text="3 A 6 MESES" sub="OSSEOINTEGRAÇÃO" x={540} y={405} neon big />,
  },
  {
    id: "E11-Coroa",
    section: "O IMPLANTE",
    words: ["e", "depois", "vêm", "o", "pilar", "e", "a", "coroa."],
    sec: 4.4,
    cam: JAW_CAM,
    world: (t, f) => {
      const ab = P(f, 6, 32);
      const cr = P(f, 50, 34, POP);
      return JAW(
        <>
          <Jaw
            middle="implant"
            implant={{ insert: 1, spin: Math.PI * 12, abutment: ab, crown: f < 50 ? 0 : Math.max(0.001, cr), glow: 0 }}
            mood={cr >= 1 ? "happy" : "wow"}
            middleMood={f > 92 ? "happy" : "wow"}
            look={1}
            t={f}
          />
          <Burst at={[0, 0.7, 0]} p={P(f, 82, 30, Easing.linear)} />
        </>,
      );
    },
    tags: (t) => (
      <>
        {t > 0.05 ? <Tag text="PILAR" x={330} y={700} /> : null}
        {t > 0.35 ? <Tag text="COROA" x={760} y={470} neon /> : null}
      </>
    ),
  },
  {
    id: "E12-Resultado",
    section: "O RESULTADO",
    words: ["e", "a", "mordida", "volta", "a", "estimular", "o", "osso."],
    sec: 3.8,
    cam: JAW_CAM,
    world: (t, f) => {
      const b = bite(f, 12, 34);
      return JAW(
        <>
          <Jaw middle="implant" implant={{ insert: 1, spin: 0, abutment: 1, crown: 1, glow: 0 }} mood="happy" middleMood={b > 0.7 ? "wink" : "happy"} t={f} />
          <Arrow3D x={0} y={2.1} press={b} on={P(f, 4, 10)} />
          {f > 12 ? <Rings x={0} y={-1} t={(f - 12) / 102} /> : null}
        </>,
      );
    },
    tags: () => <Tag text="DENTE NOVO" x={540} y={330} neon />,
  },
  {
    id: "E13-Siga",
    section: "SIGA",
    words: ["Siga", "o", "perfil", "pra", "não", "perder", "nenhum", "vídeo!"],
    sec: 3.8,
    cam: STAGE_CAM,
    floorY: -30,
    world: () => null,
    tags: (t) => <FollowButton t={t} />,
  },
];

/** One scene. `t` (0..1) is how far into the scene we are; captions follow it. */
export const EscuroScene: React.FC<{ index: number; still?: number; dur?: number }> = ({ index, still, dur }) => {
  const s = SPECS[index];
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = still ?? Math.min(1, f / (dur ?? durationInFrames));
  const spoken = Math.max(1, Math.ceil(s.words.length * Math.min(1, t * 1.15)));
  const k = 1.05 - 0.09 * Easing.bezier(0.33, 0, 0.2, 1)(t);
  const camPos: V3 = [s.cam.pos[0] + (t - 0.5) * 1.2, s.cam.pos[1], s.cam.pos[2] * k];
  const tagP = interpolate(f, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.4, 0.64, 1) });
  return (
    <Frame>
      <Dust />
      <ThreeCanvas width={1080} height={1920} shadows>
        <Cam pos={still === undefined ? camPos : s.cam.pos} target={s.cam.target} />
        <Lights />
        <Floor y={s.floorY ?? (s.cam === STAGE_CAM ? -1.42 : s.cam === JAWS_CAM ? -3.8 : -1.48)} />
        {s.world(t, f)}
      </ThreeCanvas>
      {s.tags ? (
        <div style={{ position: "absolute", inset: 0, opacity: still === undefined ? Math.min(1, tagP) : 1, scale: still === undefined ? `${0.7 + 0.3 * tagP}` : "1" }}>
          {s.tags(t)}
        </div>
      ) : null}
      <Caption words={s.words} spoken={spoken} strong={s.strong} />
    </Frame>
  );
};
