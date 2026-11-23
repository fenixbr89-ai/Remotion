import React from "react";
import { K } from "./theme";

export type Mood = "happy" | "sad" | "worried" | "wow" | "calm" | "wink";

const DARK = "#3a2530";

/** Cute Pixar-like face placed on the front of a crown (origin = crown base centre, front = +z). */
export const Face3D: React.FC<{ mood?: Mood; look?: number; blink?: boolean; z?: number; y?: number }> = ({
  mood = "happy",
  look = 0,
  blink = false,
  z = 0.6,
  y = 0.42,
}) => {
  const eye = (x: number, closed: boolean) =>
    closed ? (
      <mesh position={[x, y + 0.03, z + 0.02]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.075, 0.018, 8, 24, Math.PI]} />
        <meshStandardMaterial color={DARK} roughness={0.5} />
      </mesh>
    ) : (
      <group position={[x, y + 0.04, z]}>
        <mesh scale={[1, 1.15, 0.6]}>
          <sphereGeometry args={[0.105, 32, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[look * 0.03, -0.01, 0.055]} scale={[1, 1.1, 0.5]}>
          <sphereGeometry args={[0.068, 32, 32]} />
          <meshPhysicalMaterial color={DARK} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[look * 0.03 - 0.024, 0.026, 0.09]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[look * 0.03 + 0.02, -0.03, 0.088]}>
          <sphereGeometry args={[0.009, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    );
  const brows =
    mood === "sad" || mood === "worried" ? (
      <>
        <mesh position={[-0.17, y + 0.2, z + 0.01]} rotation={[0, 0, -0.35]}>
          <capsuleGeometry args={[0.014, 0.08, 4, 8]} />
          <meshStandardMaterial color={DARK} />
        </mesh>
        <mesh position={[0.17, y + 0.2, z + 0.01]} rotation={[0, 0, 0.35]}>
          <capsuleGeometry args={[0.014, 0.08, 4, 8]} />
          <meshStandardMaterial color={DARK} />
        </mesh>
      </>
    ) : null;
  const mouth = (() => {
    switch (mood) {
      case "happy":
      case "wink":
        return (
          <group position={[0, y - 0.15, z + 0.0]}>
            <mesh rotation={[0, 0, Math.PI]} scale={[1, 0.9, 0.5]}>
              <sphereGeometry args={[0.085, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#8a2c45" roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.045, 0.02]} scale={[1, 0.5, 0.5]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="#ff8fab" />
            </mesh>
          </group>
        );
      case "wow":
        return (
          <mesh position={[0, y - 0.16, z]} scale={[0.8, 1, 0.4]}>
            <sphereGeometry args={[0.06, 24, 24]} />
            <meshStandardMaterial color="#8a2c45" />
          </mesh>
        );
      case "sad":
        return (
          <mesh position={[0, y - 0.19, z + 0.01]}>
            <torusGeometry args={[0.06, 0.016, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#8a2c45" />
          </mesh>
        );
      case "worried":
        return (
          <mesh position={[0, y - 0.15, z + 0.01]} rotation={[0, 0, Math.PI + 0.15]}>
            <torusGeometry args={[0.05, 0.015, 8, 24, Math.PI * 0.7]} />
            <meshStandardMaterial color="#8a2c45" />
          </mesh>
        );
      case "calm":
        return (
          <mesh position={[0, y - 0.12, z + 0.01]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.06, 0.016, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#8a2c45" />
          </mesh>
        );
    }
  })();
  return (
    <group>
      {eye(-0.17, blink || mood === "wink")}
      {eye(0.17, blink)}
      {brows}
      {mouth}
      {/* blush */}
      {[-0.27, 0.27].map((x) => (
        <mesh key={x} position={[x, y - 0.08, z - 0.07]} scale={[1, 0.6, 0.3]}>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshBasicMaterial color={K.pink} transparent opacity={0.55} depthWrite={false} />
        </mesh>
      ))}
      {mood === "sad" ? (
        <mesh position={[0.2, y - 0.08, z + 0.03]} scale={[0.7, 1, 0.5]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshPhysicalMaterial color="#9fd3ff" roughness={0.05} clearcoat={1} transparent opacity={0.9} />
        </mesh>
      ) : null}
    </group>
  );
};
