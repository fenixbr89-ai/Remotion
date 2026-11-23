import React from "react";
import { RoundedBox } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { DoubleSide, Vector2 } from "three";
import { K } from "./theme";

type V3 = [number, number, number];

const Clay: React.FC<{ color?: string; emissive?: string; glow?: number; opacity?: number }> = ({
  color = K.clay,
  emissive = K.pink,
  glow = 0,
  opacity = 1,
}) => (
  <meshStandardMaterial
    color={color}
    roughness={0.85}
    emissive={emissive}
    emissiveIntensity={glow}
    transparent={opacity < 1}
    opacity={opacity}
  />
);

const V2 = (x: number, y: number) => new Vector2(x, y);
const CROWN = [V2(0.43, 0), V2(0.55, 0.1), V2(0.65, 0.3), V2(0.67, 0.52), V2(0.6, 0.7), V2(0.46, 0.8), V2(0.25, 0.84), V2(0.001, 0.82)];
const ROOT = [V2(0.001, -1.12), V2(0.07, -1.09), V2(0.12, -0.98), V2(0.16, -0.7), V2(0.2, -0.3), V2(0.23, 0)];
const TRUNK = [V2(0.36, -0.32), V2(0.4, -0.15), V2(0.43, 0)];

/**
 * Anatomical-ish molar: bulging crown with 4 soft cusps, narrow neck, two tapered roots
 * with rounded tips. Origin = neck (crown bottom) centre.
 */
export const Molar: React.FC<{ glow?: number; roots?: boolean; opacity?: number; shape?: "molar" | "incisor" }> = ({
  glow = 0,
  roots = true,
  opacity = 1,
  shape = "molar",
}) => {
  const mat = <Clay glow={glow} opacity={opacity} />;
  const incisor = shape === "incisor";
  return (
    <group scale={incisor ? [0.62, 1.05, 0.55] : [1, 1, 0.86]}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[CROWN, 48]} />
        {mat}
      </mesh>
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
          <mesh castShadow>
            <latheGeometry args={[TRUNK, 40]} />
            {mat}
          </mesh>
          {(incisor ? [0] : [-0.2, 0.2]).map((x) => (
            <mesh key={x} position={[x, -0.28, 0]} rotation={[0, 0, x === 0 ? 0 : x > 0 ? -0.1 : 0.1]} scale={[1, 1, 1.25]} castShadow>
              <latheGeometry args={[ROOT, 32]} />
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
  return (
    <group rotation={[0, spin, 0]}>
      <mesh position={[0, -len / 2, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.17, len, 32]} />
        <meshStandardMaterial color={K.titanium} metalness={0.55} roughness={0.35} emissive={K.pink} emissiveIntensity={glow} />
      </mesh>
      {new Array(threads).fill(0).map((_, i) => {
        const y = -0.12 - i * 0.16;
        const r = 0.26 - (i / threads) * 0.07;
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0.12, 0]} castShadow>
            <torusGeometry args={[r, 0.035, 12, 40]} />
            <meshStandardMaterial color={K.titanium} metalness={0.6} roughness={0.3} emissive={K.pink} emissiveIntensity={glow} />
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
}> = ({ middle = "tooth", middleLift = 0, tilt = 0, boneLoss = 0, implant, middleGlow = 0, upper, extrude = 0 }) => {
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
          <Molar />
        </group>
      </group>
      <group position={[S, 0, 0]} rotation={[0, 0, tilt]}>
        <group position={[0, 0.05, 0]}>
          <Molar />
        </group>
      </group>
      {middle === "tooth" && middleLift < 1 ? (
        <group position={[0, 0.05 + middleLift * 3.5 + extrude, 0]} rotation={[0, 0, middleLift * 0.6]}>
          <Molar glow={middleGlow} opacity={1 - middleLift * 0.6} />
        </group>
      ) : null}
      {middle === "implant" && implant ? (
        <group>
          <group position={[0, 0.25 + (1 - implant.insert) * 2.4, 0]}>
            <Screw len={1.5} spin={implant.spin} glow={implant.glow} />
          </group>
          {implant.abutment > 0 ? (
            <group position={[0, 0.2 + (1 - implant.abutment) * 2, 0]}>
              <Abutment />
            </group>
          ) : null}
          {implant.crown > 0 ? (
            <group position={[0, 0.05 + (1 - implant.crown) * 2.5, 0]}>
              <Molar roots={false} />
            </group>
          ) : null}
        </group>
      ) : null}
    </group>
  );
};

/** Spotlight cone + glowing platform. */
export const Stage: React.FC<{ y?: number; radius?: number; on?: number }> = ({ y = -1.4, radius = 1.8, on = 1 }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <circleGeometry args={[radius, 64]} />
      <meshBasicMaterial color={K.pink} transparent opacity={0.22 * on} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y + 0.01, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.04, 128]} />
      <meshBasicMaterial color={K.pink} transparent opacity={on} />
    </mesh>
    <mesh position={[0, y + 5, 0]}>
      <coneGeometry args={[radius, 10, 64, 1, true]} />
      <meshBasicMaterial color={K.pink} transparent opacity={0.1 * on} depthWrite={false} side={DoubleSide} />
    </mesh>
  </group>
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
