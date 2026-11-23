import React from "react";
import { random } from "remotion";
import { K } from "./theme";

type V3 = [number, number, number];

/** Pink chewing-force arrow pointing down. press 0..1 moves it down. */
export const Arrow3D: React.FC<{ x: number; y: number; press: number; on?: number }> = ({ x, y, press, on = 1 }) => (
  <group position={[x, y - press * 0.35, 0.3]}>
    <mesh position={[0, 0.45, 0]}>
      <cylinderGeometry args={[0.09, 0.09, 0.6, 16]} />
      <meshStandardMaterial color={K.pink} emissive={K.pink} emissiveIntensity={0.35} transparent opacity={on} />
    </mesh>
    <mesh rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.22, 0.32, 24]} />
      <meshStandardMaterial color={K.pink} emissive={K.pink} emissiveIntensity={0.35} transparent opacity={on} />
    </mesh>
  </group>
);

/** Little bone crumbs flying away from a point and fading (resorption). p 0..1 */
export const Crumbs: React.FC<{ at: V3; p: number; n?: number }> = ({ at, p, n = 18 }) => (
  <group position={at}>
    {new Array(n).fill(0).map((_, i) => {
      const start = random(`cs${i}`) * 0.6;
      const q = Math.max(0, Math.min(1, (p - start) / 0.4));
      if (q <= 0 || q >= 1) return null;
      const dx = (random(`cx${i}`) - 0.5) * 1.6;
      const dy = 0.4 + random(`cy${i}`) * 1.2;
      const dz = 0.3 + random(`cz${i}`) * 0.8;
      return (
        <mesh key={i} position={[dx * q, (random(`c0${i}`) - 0.5) * 0.8 + dy * q, dz * q]} scale={1 - q * 0.7}>
          <sphereGeometry args={[0.06 + random(`cr${i}`) * 0.05, 12, 12]} />
          <meshStandardMaterial color={K.bone} transparent opacity={1 - q} />
        </mesh>
      );
    })}
  </group>
);

/** Bone cells popping around the screw (osseointegration). p 0..1 */
export const BoneCells: React.FC<{ p: number }> = ({ p }) => (
  <group>
    {new Array(14).fill(0).map((_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const y = -0.3 - (Math.floor(i / 2) / 7) * 1.2;
      const q = Math.max(0, Math.min(1, p * 14 - i));
      const s = q < 1 ? q * 1.25 : 1;
      return (
        <mesh key={i} position={[side * (0.33 + random(`bx${i}`) * 0.05), y, 0.2]} scale={s}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color="#fff6ea" emissive={K.pink} emissiveIntensity={0.25} />
        </mesh>
      );
    })}
  </group>
);

/** Sparkle burst (little pink diamonds). p 0..1 */
export const Burst: React.FC<{ at: V3; p: number }> = ({ at, p }) =>
  p <= 0 || p >= 1 ? null : (
    <group position={at}>
      {new Array(9).fill(0).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const r = 0.5 + p * 1.1;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r * 0.7 + 0.3, 0.4]} rotation={[0, 0, a + p * 3]} scale={(1 - p) * 0.9}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color={i % 2 ? "#ffffff" : K.pink} emissive={K.pink} emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );

/** Food crumbs stuck between teeth. */
export const Food: React.FC<{ p: number }> = ({ p }) => (
  <group>
    {[
      [-0.8, 0.55, 0.5],
      [-0.66, 0.72, 0.45],
      [0.78, 0.6, 0.5],
      [0.66, 0.78, 0.42],
    ].map((pos, i) => {
      const q = Math.max(0, Math.min(1, p * 4 - i));
      return (
        <mesh key={i} position={[pos[0], pos[1] + (1 - q) * 1.2, pos[2]]} scale={q}>
          <sphereGeometry args={[0.1 + (i % 2) * 0.04, 16, 16]} />
          <meshStandardMaterial color="#e9c79b" roughness={0.9} />
        </mesh>
      );
    })}
  </group>
);

/** Pulsing pink ring on the gum where the tooth is missing. */
export const GapGlow: React.FC<{ f: number; on?: number }> = ({ f, on = 1 }) => {
  const k = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <mesh position={[0, 0.2, -0.3]} rotation={[-Math.PI / 2, 0, 0]} scale={0.9 + k * 0.2}>
      <torusGeometry args={[0.55, 0.05, 12, 48]} />
      <meshBasicMaterial color={K.pink} transparent opacity={(0.5 + 0.5 * k) * on} />
    </mesh>
  );
};
