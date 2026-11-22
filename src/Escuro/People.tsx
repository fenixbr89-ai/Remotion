import React from "react";
import { useGLTF } from "@react-three/drei";
import { staticFile } from "remotion";
import type { Mesh } from "three";
import { K } from "./theme";
import { Jaw } from "./Models";

const HEAD_URL = staticFile("models/head.glb");

/**
 * Clay head bust (head scan by Lee Perry-Smith, CC BY 3.0) + simple shoulders.
 * xray: 0 = solid, 1 = see-through with the teeth visible inside.
 */
export const HeadBust: React.FC<{
  xray?: number;
  glow?: number; // pink glow on the mouth area
  glowSide?: number; // -1 left jaw, 1 right jaw, 0 centre
  jaw?: React.ComponentProps<typeof Jaw>;
}> = ({ xray = 0, glow = 0, glowSide = 0, jaw = {} }) => {
  const { nodes } = useGLTF(HEAD_URL);
  const head = nodes.LeePerrySmith as Mesh;
  const solid = 1 - xray * 0.78;
  return (
    <group>
      <mesh geometry={head.geometry} scale={0.42} castShadow={xray < 0.5} receiveShadow>
        <meshStandardMaterial color={K.clay} roughness={0.8} transparent={xray > 0} opacity={solid} depthWrite={xray < 0.5} />
      </mesh>
      {/* teeth inside the mouth */}
      {xray > 0 ? (
        <group position={[0, -0.12, 0.45]} scale={0.2} rotation={[0.1, 0, 0]}>
          <Jaw {...jaw} />
        </group>
      ) : null}
      {glow > 0 ? (
        <mesh position={[glowSide * 0.38, 0.0, 0.72]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial color={K.pink} transparent opacity={0.45 * glow} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
};

useGLTF.preload(HEAD_URL);

/** Simple clay mannequin like a 3D icon. */
export const Mannequin: React.FC<{ wave?: number; shirt?: string }> = ({ wave = 0, shirt = K.pink }) => {
  const clay = <meshStandardMaterial color={K.clay} roughness={0.85} />;
  return (
    <group>
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.36, 32, 32]} />
        {clay}
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.25, 16]} />
        {clay}
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.36, 0.7, 8, 24]} />
        <meshStandardMaterial color={shirt} roughness={0.6} emissive={shirt} emissiveIntensity={0.25} />
      </mesh>
      {/* arms */}
      <group position={[-0.5, 1.35, 0]} rotation={[0, 0, -0.18]}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.75, 6, 16]} />
          {clay}
        </mesh>
      </group>
      <group position={[0.5, 1.35, 0]} rotation={[0, 0, 0.18 + wave * 2.6]}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.75, 6, 16]} />
          {clay}
        </mesh>
      </group>
      {/* legs */}
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, -0.05, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.85, 6, 16]} />
          {clay}
        </mesh>
      ))}
    </group>
  );
};
