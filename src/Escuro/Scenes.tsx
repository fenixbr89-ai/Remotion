import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cam, Floor, Jaw, Lights, Screw, Stage } from "./Models";
import { Caption, Dust, Frame, Header, Tag } from "./Overlay";
import { HeadBust, Mannequin } from "./People";
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

const JAW_CAM = { pos: [0, 4, 28] as V3, target: [0, -1.6, 0] as V3 };
const JAWS_CAM = { pos: [0, 3, 33] as V3, target: [0, -1.2, 0] as V3 };
const HEAD_CAM = { pos: [1.5, 0.9, 15] as V3, target: [0, -1.3, 0] as V3 };
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

export const SPECS: SceneSpec[] = [
  {
    id: "E01-Gancho",
    section: "O DENTE",
    words: ["Perdeu", "um", "dente?"],
    sec: 2,
    cam: HEAD_CAM,
    floorY: -1.68,
    world: (t) => (
      <group rotation={[0, -0.45 + t * 0.35, 0]}>
        <HeadBust glow={0.55 + 0.45 * Math.sin(t * 12)} glowSide={0.5} />
      </group>
    ),
    tags: () => <Tag text="UM DENTE A MENOS" x={790} y={600} neon />,
  },
  {
    id: "E02-Buraco",
    section: "O PROBLEMA",
    words: ["O", "problema", "não", "é", "só", "o", "buraco."],
    sec: 2.6,
    cam: HEAD_CAM,
    floorY: -1.68,
    world: (t) => (
      <group rotation={[0, -0.1 + t * 0.2, 0]}>
        <HeadBust xray={Math.min(1, t * 3)} jaw={{ middle: "none" }} />
      </group>
    ),
    tags: () => <Tag text="O BURACO" x={800} y={700} neon />,
  },
  {
    id: "E03-Estimulo",
    section: "O OSSO",
    words: ["O", "osso", "que", "segura", "o", "dente", "vive", "de", "estímulo."],
    sec: 3.2,
    cam: JAW_CAM,
    world: (t) => (
      <group position={[0, jawGroupY, 0]} rotation={[0.12, -0.25, 0]}>
        <Jaw middle="tooth" />
        <Rings x={-1.55} t={t} />
        <Rings x={0} t={t + 0.1} />
        <Rings x={1.55} t={t + 0.2} />
      </group>
    ),
    tags: () => <Tag text="ESTÍMULO" x={540} y={380} neon />,
  },
  {
    id: "E04-Reabsorcao",
    section: "O OSSO",
    words: ["Sem", "a", "raiz,", "o", "corpo", "reabsorve", "esse", "osso."],
    sec: 3,
    cam: JAW_CAM,
    world: (t) => (
      <group position={[0, jawGroupY, 0]} rotation={[0.12, -0.25, 0]}>
        <Jaw middle="none" boneLoss={t} />
      </group>
    ),
    tags: () => <Tag text="ATÉ 50%" sub="DA LARGURA NO 1º ANO" x={540} y={405} neon big />,
  },
  {
    id: "E05-Vizinhos",
    section: "OS VIZINHOS",
    words: ["Os", "vizinhos", "tombam", "pro", "espaço", "vazio"],
    sec: 2.6,
    cam: JAW_CAM,
    world: (t) => (
      <group position={[0, jawGroupY, 0]} rotation={[0.12, -0.25, 0]}>
        <Jaw middle="none" boneLoss={1} tilt={0.22 * t} />
      </group>
    ),
    tags: () => <Tag text="INCLINAÇÃO" x={540} y={400} />,
  },
  {
    id: "E06-Extrusao",
    section: "OS VIZINHOS",
    words: ["e", "o", "dente", "de", "cima", "desce."],
    sec: 2.4,
    cam: JAWS_CAM,
    world: (t) => (
      <group rotation={[0.1, -0.25, 0]}>
        <group position={[0, -1.7, 0]}>
          <Jaw middle="none" boneLoss={1} tilt={0.22} />
        </group>
        <group position={[0, 1.9, 0]}>
          <Jaw upper extrude={0.9 * t} />
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
    sec: 3.2,
    cam: HEAD_CAM,
    floorY: -1.68,
    world: (t) => (
      <group rotation={[0, 0.5 - t * 0.2, 0]}>
        <HeadBust glow={1} glowSide={-1} />
      </group>
    ),
    tags: () => <Tag text="UM LADO SÓ" x={270} y={720} />,
  },
  {
    id: "E08-Virada",
    section: "A VIRADA",
    words: ["Agora,", "a", "virada:"],
    strong: [1, 2],
    sec: 2,
    cam: STAGE_CAM,
    world: (t, f) => (
      <>
        <Stage />
        <group position={[0, 1.2 + Math.sin(f / 15) * 0.06, 0]} rotation={[0.1, t * 2, 0]}>
          <Screw len={2} />
        </group>
      </>
    ),
    tags: () => <Tag text="A VIRADA" x={540} y={400} neon />,
  },
  {
    id: "E09-Pino",
    section: "O IMPLANTE",
    words: ["um", "pino", "de", "titânio", "entra", "no", "osso,"],
    sec: 2.6,
    cam: JAW_CAM,
    world: (t) => (
      <group position={[0, jawGroupY, 0]} rotation={[0.12, -0.25, 0]}>
        <Jaw middle="implant" implant={{ insert: t, spin: t * 12, abutment: 0, crown: 0, glow: 0 }} />
      </group>
    ),
    tags: () => <Tag text="TITÂNIO" x={760} y={520} neon />,
  },
  {
    id: "E10-Osseo",
    section: "O IMPLANTE",
    words: ["o", "osso", "se", "une", "a", "ele"],
    sec: 2.4,
    cam: JAW_CAM,
    world: (t) => (
      <group position={[0, jawGroupY, 0]} rotation={[0.12, -0.25, 0]}>
        <Jaw middle="implant" implant={{ insert: 1, spin: 0, abutment: 0, crown: 0, glow: 0.6 * t }} />
        <Rings x={0} y={-1} t={t} />
      </group>
    ),
    tags: () => <Tag text="3 A 6 MESES" sub="OSSEOINTEGRAÇÃO" x={540} y={405} neon big />,
  },
  {
    id: "E11-Coroa",
    section: "O IMPLANTE",
    words: ["e", "depois", "vêm", "o", "pilar", "e", "a", "coroa."],
    sec: 3,
    cam: JAW_CAM,
    world: (t) => (
      <group position={[0, jawGroupY, 0]} rotation={[0.12, -0.25, 0]}>
        <Jaw middle="implant" implant={{ insert: 1, spin: 0, abutment: Math.min(1, t * 2), crown: Math.max(0, t * 2 - 1) * 0.7, glow: 0 }} />
      </group>
    ),
    tags: () => (
      <>
        <Tag text="COROA" x={760} y={470} neon />
        <Tag text="PILAR" x={330} y={700} />
      </>
    ),
  },
  {
    id: "E12-Resultado",
    section: "O RESULTADO",
    words: ["e", "a", "mordida", "volta", "a", "estimular", "o", "osso."],
    sec: 3,
    cam: HEAD_CAM,
    floorY: -1.68,
    world: (t) => (
      <group rotation={[0, -0.1 + t * 0.2, 0]}>
        <HeadBust xray={1} jaw={{ middle: "implant", implant: { insert: 1, spin: 0, abutment: 1, crown: 1, glow: 0.5 } }} />
      </group>
    ),
    tags: () => <Tag text="DENTE NOVO" x={800} y={700} neon />,
  },
  {
    id: "E13-Siga",
    section: "SIGA",
    words: ["Segue", "que", "eu", "te", "ensino", "muito", "mais."],
    sec: 3,
    cam: STAGE_CAM,
    world: (t, f) => (
      <>
        <Stage />
        <group position={[0, -1.35, 0]} scale={1.05} rotation={[0, -0.3, 0]}>
          <group position={[0, 0.55, 0]}>
            <Mannequin wave={0.95 + Math.sin(f / 5) * 0.08} />
          </group>
        </group>
      </>
    ),
    tags: () => <Tag text="SEGUE @YASMINSR09" x={540} y={360} neon />,
  },
];

/** One scene. `t` (0..1) is how far into the scene we are; captions follow it. */
export const EscuroScene: React.FC<{ index: number; still?: number; dur?: number }> = ({ index, still, dur }) => {
  const s = SPECS[index];
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = still ?? Math.min(1, f / (dur ?? durationInFrames));
  const spoken = Math.ceil(s.words.length * Math.min(1, t * 1.15));
  const k = 1.05 - 0.09 * Easing.bezier(0.33, 0, 0.2, 1)(t);
  const camPos: V3 = [s.cam.pos[0] + (t - 0.5) * 1.2, s.cam.pos[1], s.cam.pos[2] * k];
  const tagP = interpolate(f, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.4, 0.64, 1) });
  return (
    <Frame>
      <Dust />
      <ThreeCanvas width={1080} height={1920} shadows>
        <Cam pos={still === undefined ? camPos : s.cam.pos} target={s.cam.target} />
        <Lights />
        <Floor y={s.floorY ?? (s.cam === STAGE_CAM ? -1.42 : -4.2)} />
        {s.world(t, f)}
      </ThreeCanvas>
      {s.tags ? (
        <div style={{ position: "absolute", inset: 0, opacity: still === undefined ? Math.min(1, tagP) : 1, scale: still === undefined ? `${0.7 + 0.3 * tagP}` : "1" }}>
          {s.tags(t)}
        </div>
      ) : null}
      <Header section={s.section} />
      <Caption words={s.words} spoken={spoken} strong={s.strong} />
    </Frame>
  );
};
