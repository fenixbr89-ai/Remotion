import React from "react";
import { RoundedBox } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Color, Vector2 } from "three";
import { K } from "./theme";
import { Face3D, Mood } from "./Face3D";

type V3 = [number, number, number];

const Clay: React.FC<{ color?: string; glow?: number; opacity?: number }> = ({
  color = K.clay,
  glow = 0,
  opacity = 1,
}) => (
  <meshPhysicalMaterial
    key={opacity < 1 ? "t" : "o"}
    color={glow > 0 ? new Color(color).lerp(new Color(K.pink), Math.min(1, glow)).getStyle() : color}
    roughness={0.42}
    clearcoat={0.6}
    clearcoatRoughness={0.35}
    transparent={opacity < 1}
    opacity={opacity}
  />
);

const V2 = (x: number, y: number) => new Vector2(x, y);
// One continuous profile: root trunk -> cervical neck -> bulging crown -> occlusal top (no seams).
const TOOTH = [
  V2(0.001, -0.5),
  V2(0.22, -0.48),
  V2(0.34, -0.4),
  V2(0.4, -0.25),
  V2(0.42, -0.08),
  V2(0.45, 0.02),
  V2(0.54, 0.12),
  V2(0.64, 0.3),
  V2(0.67, 0.5),
  V2(0.62, 0.68),
  V2(0.48, 0.79),
  V2(0.26, 0.84),
  V2(0.001, 0.82),
];
// Crown only (implant crown): closed at the bottom.
const CROWN = [V2(0.001, 0.02), V2(0.36, 0.0), V2(0.45, 0.02), ...TOOTH.slice(6)];
const ROOT = [V2(0.001, -1.12), V2(0.07, -1.09), V2(0.12, -0.98), V2(0.17, -0.7), V2(0.21, -0.35), V2(0.23, 0), V2(0.22, 0.12), V2(0.001, 0.2)];

/**
 * Anatomical-ish molar: bulging crown with 4 soft cusps, narrow neck, two tapered roots
 * with rounded tips. Origin = neck (crown bottom) centre.
 */
export const Molar: React.FC<{
  glow?: number;
  roots?: boolean;
  opacity?: number;
  shape?: "molar" | "incisor";
  mood?: Mood | null;
  look?: number;
  blink?: boolean;
  flipFace?: boolean; // tooth is upside down (upper jaw) but the face stays upright
}> = ({ glow = 0, roots = true, opacity = 1, shape = "molar", mood = null, look = 0, blink = false, flipFace = false }) => {
  const mat = <Clay glow={glow} opacity={opacity} />;
  const incisor = shape === "incisor";
  return (
    <group scale={incisor ? [0.62, 1.05, 0.55] : [1, 1, 0.86]}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[roots ? TOOTH : CROWN, 64]} />
        {mat}
      </mesh>
      {mood ? (
        <group scale={[1, 1, 1 / 0.86]}>
          <group position={[0, 0.42, 0.5]} rotation={[0, 0, flipFace ? Math.PI : 0]}>
            <group scale={1.4}>
              <Face3D mood={mood} look={look} blink={blink} z={0.04} y={0} />
            </group>
          </group>
        </group>
      ) : null}
      {incisor
        ? null
        : [
            [-0.24, -0.2],
            [0.24, -0.2],
            [-0.24, 0.2],
            [0.24, 0.2],
          ].map(([x, z], i) => (
            <mesh key={i} position={[x, 0.74, z]} scale={[1, 0.5, 1]} castShadow>
              <sphereGeometry args={[0.25, 32, 24]} />
              {mat}
            </mesh>
          ))}
      {roots ? (
        <>
          {(incisor ? [0] : [-0.19, 0.19]).map((x) => (
            <mesh key={x} position={[x, -0.3, 0]} rotation={[0, 0, x === 0 ? 0 : x > 0 ? -0.09 : 0.09]} scale={[1, 1, 1.25]} castShadow>
              <latheGeometry args={[ROOT, 48]} />
              {mat}
            </mesh>
          ))}
        </>
      ) : null}
    </group>
  );
};

/** U-shaped dental arch (crowns only), for inside the head. `missing` = index of a lost tooth. */
export const Arch: React.FC<{
  upper?: boolean;
  missing?: number | null;
  implant?: number | null; // index rendered as a new crown (glowing)
  glow?: number;
}> = ({ upper, missing = null, implant = null, glow = 0 }) => {
  const n = 12;
  const W = 2.3;
  const D = 2.6;
  return (
    <group rotation={[0, 0, upper ? Math.PI : 0]}>
      {/* gum arch */}
      {new Array(n).fill(0).map((_, i) => {
        const u = (i / (n - 1)) * 2 - 1;
        const x = W * u;
        const z = -D * u * u;
        const slope = Math.atan2(-2 * D * u, W);
        const front = Math.abs(u) < 0.4;
        if (i === missing) {
          return (
            <group key={i} position={[x, 0.35, z]}>
              <mesh>
                <sphereGeometry args={[0.42, 32, 32]} />
                <meshBasicMaterial color={K.pink} transparent opacity={0.55} depthWrite={false} />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshBasicMaterial color={K.pink} transparent opacity={0.18} depthWrite={false} />
              </mesh>
            </group>
          );
        }
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -slope, 0]}>
            <Molar roots={false} shape={front ? "incisor" : "molar"} glow={i === implant ? glow : 0} />
          </group>
        );
      })}
    </group>
  );
};

/** Titanium implant screw. Origin = top centre, extends down by len. */
export const Screw: React.FC<{ len?: number; spin?: number; glow?: number }> = ({ len = 1.4, spin = 0, glow = 0 }) => {
  const threads = Math.floor(len / 0.16);
  const tint = new Color(K.titanium).lerp(new Color("#e98fb5"), Math.min(1, glow * 1.4)).getStyle();
  return (
    <group rotation={[0, spin, 0]}>
      <mesh position={[0, -len / 2, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.17, len, 32]} />
        <meshStandardMaterial color={tint} metalness={0.55} roughness={0.35} />
      </mesh>
      {new Array(threads).fill(0).map((_, i) => {
        const y = -0.12 - i * 0.16;
        const r = 0.26 - (i / threads) * 0.07;
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0.12, 0]} castShadow>
            <torusGeometry args={[r, 0.035, 12, 40]} />
            <meshStandardMaterial color={tint} metalness={0.6} roughness={0.3} />
          </mesh>
        );
      })}
      <mesh position={[0, len * -1 - 0.02, 0]} castShadow>
        <sphereGeometry args={[0.17, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color={K.titanium} metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
};

/** Dental handpiece with a spinning bit. Origin = bit tip. */
export const Drill: React.FC<{ spin: number; on: number }> = ({ spin, on }) => (
  <group>
    <group rotation={[0, spin, 0]}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.035, 1.5, 16]} />
        <meshStandardMaterial color="#c9ced6" metalness={0.7} roughness={0.25} transparent opacity={on} />
      </mesh>
      {new Array(7).fill(0).map((_, i) => (
        <mesh key={i} position={[0, 0.15 + i * 0.13, 0]} rotation={[Math.PI / 2, 0.4, 0]}>
          <torusGeometry args={[0.065, 0.014, 6, 16]} />
          <meshStandardMaterial color="#9aa1ab" metalness={0.7} roughness={0.3} transparent opacity={on} />
        </mesh>
      ))}
    </group>
    <mesh position={[0, 2.1, 0]} castShadow>
      <capsuleGeometry args={[0.28, 1.2, 8, 24]} />
      <meshPhysicalMaterial color="#ffffff" roughness={0.35} clearcoat={0.8} transparent opacity={on} />
    </mesh>
    <mesh position={[0, 2.25, 0]}>
      <cylinderGeometry args={[0.295, 0.295, 0.2, 32]} />
      <meshStandardMaterial color={K.pink} roughness={0.5} transparent opacity={on} />
    </mesh>
  </group>
);

/** Abutment: short tapered post. Origin = bottom centre. */
export const Abutment: React.FC = () => (
  <mesh position={[0, 0.25, 0]} castShadow>
    <cylinderGeometry args={[0.2, 0.3, 0.5, 32]} />
    <meshStandardMaterial color={K.titanium} metalness={0.6} roughness={0.3} />
  </mesh>
);

/**
 * Jaw block seen from the front: bone (translucent so roots show), gum strip and 3 molars.
 * Origin = gum line centre. Upper jaw is the same, mirrored.
 */
export const Jaw: React.FC<{
  middle?: "tooth" | "none" | "implant";
  middleLift?: number; // tooth leaving (0..1)
  tilt?: number; // radians the neighbours lean into the gap
  boneLoss?: number; // 0..1 middle bone shrinks
  implant?: { insert: number; spin: number; abutment: number; crown: number; glow: number };
  middleGlow?: number;
  upper?: boolean;
  extrude?: number; // only for the middle tooth (upper jaw)
  mood?: Mood; // neighbours
  middleMood?: Mood;
  look?: number; // neighbours look toward the middle by this much
  t?: number; // frame, for blinking
  middleRot?: number; // wiggle of the middle tooth (radians)
  drill?: { depth: number; spin: number; on: number } | null;
  hole?: number; // 0..1 depth of the drilled bed
  screwOn?: boolean;
}> = ({
  middle = "tooth",
  middleLift = 0,
  tilt = 0,
  boneLoss = 0,
  implant,
  middleGlow = 0,
  upper,
  extrude = 0,
  mood = "happy",
  middleMood,
  look = 0,
  t = 0,
  middleRot = 0,
  drill = null,
  hole = 0,
  screwOn = true,
}) => {
  const blink = (k: number) => (t + k * 37) % 95 < 4;
  const S = 1.55;
  const sideH = 1.9;
  const midH = sideH * (1 - boneLoss * 0.45);
  return (
    <group rotation={[0, 0, upper ? Math.PI : 0]}>
      {/* bone: 3 blocks so the middle one can shrink */}
      {[-S, S].map((x) => (
        <RoundedBox key={x} args={[S * 1.0, sideH, 1.2]} radius={0.12} position={[x, -0.15 - sideH / 2, -0.55]} castShadow receiveShadow>
          <meshStandardMaterial color={K.bone} roughness={0.95} />
        </RoundedBox>
      ))}
      <RoundedBox args={[S * 1.02, midH, 1.2 - boneLoss * 0.45]} radius={0.12} position={[0, -0.15 - sideH + midH / 2, -0.55 - boneLoss * 0.2]} castShadow receiveShadow>
        <meshStandardMaterial color={K.bone} roughness={0.95} />
      </RoundedBox>
      {/* gum */}
      <RoundedBox args={[S * 3, 0.42, 1.25]} radius={0.18} position={[0, -0.05, -0.45]} castShadow receiveShadow>
        <meshStandardMaterial color={K.gum} roughness={0.75} />
      </RoundedBox>
      {/* neighbours */}
      <group position={[-S, 0, 0]} rotation={[0, 0, -tilt]}>
        <group position={[0, 0.05, 0]}>
          <Molar mood={mood} look={upper ? 0 : look} blink={blink(1)} flipFace={upper} />
        </group>
      </group>
      <group position={[S, 0, 0]} rotation={[0, 0, tilt]}>
        <group position={[0, 0.05, 0]}>
          <Molar mood={mood} look={upper ? 0 : -look} blink={blink(2)} flipFace={upper} />
        </group>
      </group>
      {middle === "tooth" && middleLift < 1 ? (
        <group position={[0, 0.05 + middleLift * 3.5 + extrude, 0]} rotation={[0, 0, middleLift * 0.9 + middleRot]}>
          <Molar glow={middleGlow} mood={middleMood ?? mood} blink={blink(3)} flipFace={upper} />
        </group>
      ) : null}
      {hole > 0 ? (
        <mesh position={[0, -0.15 - (hole * 1.45) / 2, 0.02]}>
          <cylinderGeometry args={[0.27, 0.24, hole * 1.45, 32]} />
          <meshStandardMaterial color="#cdb89a" roughness={1} />
        </mesh>
      ) : null}
      {drill && drill.on > 0 ? (
        <group position={[0, 0.1 - drill.depth * 1.35, 0.05]}>
          <Drill spin={drill.spin} on={drill.on} />
        </group>
      ) : null}
      {middle === "implant" && implant ? (
        <group>
          {screwOn ? (
            <group position={[0, 0.25 + (1 - implant.insert) * 2.4, 0]}>
              <Screw len={1.5} spin={implant.spin} glow={implant.glow} />
            </group>
          ) : null}
          {implant.abutment > 0 ? (
            <group position={[0, 0.2 + (1 - implant.abutment) * 2, 0]}>
              <Abutment />
            </group>
          ) : null}
          {implant.crown > 0 ? (
            <group position={[0, 0.05 + (1 - implant.crown) * 2.5, 0]}>
              <Molar roots={false} mood={implant.crown >= 1 ? (middleMood ?? "happy") : "wow"} blink={implant.crown >= 1 && blink(3)} />
            </group>
          ) : null}
        </group>
      ) : null}
    </group>
  );
};

/** Soft pink floor disc (no neon rim, no light cone). */
export const Stage: React.FC<{ y?: number; radius?: number; on?: number }> = ({ y = -1.4, radius = 1.8, on = 1 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <circleGeometry args={[radius, 64]} />
    <meshStandardMaterial color="#f6dde6" roughness={1} transparent opacity={0.9 * on} />
  </mesh>
);

export const Floor: React.FC<{ y?: number }> = ({ y = -1.42 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <planeGeometry args={[60, 60]} />
    <shadowMaterial color="#b06a88" opacity={0.28} />
  </mesh>
);

export const Lights: React.FC<{ pinkSpot?: number }> = ({ pinkSpot = 0 }) => (
  <>
    <ambientLight intensity={0.85} />
    <directionalLight position={[-4, 7, 5]} intensity={2.3} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />
    <directionalLight position={[5, 2, -3]} intensity={0.5} />
    {pinkSpot > 0 ? <spotLight position={[0, 9, 0]} angle={0.3} penumbra={0.7} intensity={40 * pinkSpot} color={K.pink} /> : null}
  </>
);

/** Points the camera at a target every frame. */
export const Cam: React.FC<{ pos: V3; target?: V3; fov?: number }> = ({ pos, target = [0, 0, 0], fov = 30 }) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(...pos);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (camera as any).fov = fov;
  camera.lookAt(...target);
  camera.updateProjectionMatrix();
  return null;
};
