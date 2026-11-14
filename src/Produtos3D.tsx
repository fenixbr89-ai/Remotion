import React, { useMemo } from "react";
import * as THREE from "three";

// ============================================================
//  Produtos 3D feitos com formas simples (estilo "massinha")
//  Cada produto tem ~1 unidade de altura e fica apoiado em y=0.
// ============================================================

type P = { cor?: string };

const Mat: React.FC<{ cor: string; rough?: number; metal?: number; op?: number }> = ({
  cor,
  rough = 0.55,
  metal = 0,
  op = 1,
}) => (
  <meshStandardMaterial
    color={cor}
    roughness={rough}
    metalness={metal}
    transparent={op < 1}
    opacity={op}
  />
);

const useLathe = (pts: [number, number][]) =>
  useMemo(() => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 48), [pts]);

// ---------- CARNES ----------
const Bife: React.FC = () => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.7, 0);
    s.bezierCurveTo(-0.8, 0.5, -0.2, 0.75, 0.3, 0.6);
    s.bezierCurveTo(0.8, 0.45, 0.85, -0.1, 0.5, -0.4);
    s.bezierCurveTo(0.1, -0.7, -0.6, -0.5, -0.7, 0);
    return new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4 });
  }, []);
  return (
    <group rotation={[-0.55, 0, 0.15]} position={[0, 0.45, 0]} scale={0.62}>
      <mesh geometry={geo} scale={[1.06, 1.06, 0.9]} position={[0, 0, -0.02]}>
        <Mat cor="#F3E2C8" />
      </mesh>
      <mesh geometry={geo}>
        <Mat cor="#B8262C" rough={0.7} />
      </mesh>
      <mesh position={[0.15, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 24]} />
        <Mat cor="#F7EEDC" />
      </mesh>
    </group>
  );
};

const Linguica: React.FC = () => (
  <group position={[0, 0.25, 0]}>
    {[-0.55, 0, 0.55].map((x, i) => (
      <mesh key={i} position={[x, Math.abs(x) * 0.25, 0]} rotation={[0, 0, Math.PI / 2 + x * 0.6]}>
        <capsuleGeometry args={[0.2, 0.42, 8, 16]} />
        <Mat cor="#9B3424" rough={0.4} />
      </mesh>
    ))}
  </group>
);

const Bandeja: React.FC<{ recheio: string; bolinhas?: boolean }> = ({ recheio, bolinhas }) => (
  <group>
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[1.4, 0.2, 0.95]} />
      <Mat cor="#FFFFFF" rough={0.3} />
    </mesh>
    <mesh position={[0, 0.27, 0]} scale={[0.6, 0.18, 0.4]}>
      <sphereGeometry args={[1, 32, 16]} />
      <Mat cor={recheio} rough={0.8} />
    </mesh>
    {bolinhas
      ? [-0.3, 0, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.38, 0.05]} scale={[0.22, 0.12, 0.18]}>
            <sphereGeometry args={[1, 16, 12]} />
            <Mat cor={recheio} rough={0.8} />
          </mesh>
        ))
      : null}
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[1.42, 0.02, 0.97]} />
      <Mat cor="#FFFFFF" op={0.25} rough={0.1} />
    </mesh>
  </group>
);

// ---------- FRIOS ----------
const Queijo: React.FC = () => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.7, 0);
    s.lineTo(0.7, 0);
    s.lineTo(0.7, 0.75);
    s.lineTo(-0.7, 0);
    return new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 });
  }, []);
  return (
    <group position={[0, 0, -0.35]}>
      <mesh geometry={geo}>
        <Mat cor="#F6C843" rough={0.6} />
      </mesh>
      {[
        [0.3, 0.2, 0.74],
        [-0.1, 0.12, 0.74],
        [0.5, 0.45, 0.74],
        [0.71, 0.3, 0.3],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1, 1, 0.35]}>
          <sphereGeometry args={[0.08 + (i % 2) * 0.04, 16, 12]} />
          <Mat cor="#D9A520" />
        </mesh>
      ))}
    </group>
  );
};

const Presunto: React.FC = () => (
  <group position={[0, 0.05, 0]}>
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[i * 0.12 - 0.12, i * 0.09, i * 0.05]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.07, 48]} />
        <Mat cor={i % 2 ? "#F4A7A3" : "#EF9590"} rough={0.65} />
      </mesh>
    ))}
  </group>
);

const Salame: React.FC = () => (
  <group position={[0, 0.32, 0]} rotation={[0, 0.5, Math.PI / 2]}>
    <mesh>
      <cylinderGeometry args={[0.3, 0.3, 1.3, 32]} />
      <Mat cor="#7E1A1F" rough={0.85} />
    </mesh>
    <mesh position={[0, 0.66, 0]}>
      <cylinderGeometry args={[0.29, 0.29, 0.02, 32]} />
      <Mat cor="#C2464C" />
    </mesh>
    {[
      [0.1, 0.05],
      [-0.12, 0.1],
      [0.05, -0.15],
      [-0.08, -0.08],
      [0.17, -0.05],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.68, z]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <Mat cor="#FFF3E6" />
      </mesh>
    ))}
  </group>
);

// ---------- FRANGO ----------
const Coxa: React.FC = () => (
  <group position={[0, 0.4, 0]} rotation={[0, 0, -0.6]}>
    <mesh scale={[0.42, 0.58, 0.42]}>
      <sphereGeometry args={[1, 32, 24]} />
      <Mat cor="#D9893A" rough={0.45} />
    </mesh>
    <mesh position={[0, -0.7, 0]}>
      <cylinderGeometry args={[0.07, 0.08, 0.5, 16]} />
      <Mat cor="#F3E6D0" />
    </mesh>
    {[-0.07, 0.07].map((x) => (
      <mesh key={x} position={[x, -0.97, 0]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <Mat cor="#F3E6D0" />
      </mesh>
    ))}
  </group>
);

const FrangoInteiro: React.FC = () => (
  <group position={[0, 0.45, 0]}>
    <mesh scale={[0.75, 0.48, 0.55]}>
      <sphereGeometry args={[1, 32, 24]} />
      <Mat cor="#E3A157" rough={0.4} />
    </mesh>
    {[-0.35, 0.35].map((z) => (
      <group key={z} position={[0.55, 0.1, z]} rotation={[0, 0, -1]} scale={0.55}>
        <mesh scale={[0.42, 0.58, 0.42]}>
          <sphereGeometry args={[1, 24, 16]} />
          <Mat cor="#D98C3A" rough={0.4} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
          <Mat cor="#F3E6D0" />
        </mesh>
      </group>
    ))}
  </group>
);

// ---------- MERCEARIA ----------
const Pacote: React.FC<{ cor: string; faixa: string }> = ({ cor, faixa }) => (
  <group position={[0, 0.6, 0]}>
    <mesh>
      <boxGeometry args={[0.85, 1.2, 0.45]} />
      <Mat cor={cor} rough={0.5} />
    </mesh>
    <mesh position={[0, 0.05, 0.231]}>
      <boxGeometry args={[0.86, 0.32, 0.01]} />
      <Mat cor={faixa} />
    </mesh>
    <mesh position={[0, -0.32, 0.231]}>
      <boxGeometry args={[0.4, 0.14, 0.01]} />
      <Mat cor="#F2B820" />
    </mesh>
    <mesh position={[0, 0.66, 0]}>
      <boxGeometry args={[0.85, 0.12, 0.08]} />
      <Mat cor={cor} />
    </mesh>
  </group>
);

const Garrafa: React.FC<{ cor: string; tampa: string; op?: number }> = ({ cor, tampa, op = 1 }) => {
  const geo = useLathe([
    [0, 0],
    [0.32, 0],
    [0.36, 0.1],
    [0.36, 0.85],
    [0.3, 1.0],
    [0.14, 1.15],
    [0.12, 1.3],
    [0, 1.3],
  ]);
  return (
    <group>
      <mesh geometry={geo}>
        <Mat cor={cor} rough={0.15} op={op} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.365, 0.365, 0.34, 32]} />
        <Mat cor="#FFFFFF" />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.14, 24]} />
        <Mat cor={tampa} />
      </mesh>
    </group>
  );
};

const Lata: React.FC<{ cor: string }> = ({ cor }) => (
  <group position={[0, 0.5, 0]}>
    <mesh>
      <cylinderGeometry args={[0.38, 0.38, 0.9, 40]} />
      <Mat cor={cor} rough={0.35} metal={0.3} />
    </mesh>
    {[0.46, -0.46].map((y) => (
      <mesh key={y} position={[0, y, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.06, 40]} />
        <Mat cor="#D7D7D7" rough={0.25} metal={0.9} />
      </mesh>
    ))}
    <mesh>
      <cylinderGeometry args={[0.385, 0.385, 0.3, 40]} />
      <Mat cor="#FFFFFF" />
    </mesh>
  </group>
);

// ---------- LIMPEZA ----------
const Detergente: React.FC = () => {
  const geo = useLathe([
    [0, 0],
    [0.3, 0],
    [0.33, 0.1],
    [0.3, 0.6],
    [0.34, 1.0],
    [0.16, 1.2],
    [0, 1.2],
  ]);
  return (
    <group>
      <mesh geometry={geo} scale={[1, 1, 0.6]}>
        <Mat cor="#2DB36A" rough={0.2} op={0.92} />
      </mesh>
      <mesh position={[0, 1.27, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.18, 20]} />
        <Mat cor="#FFFFFF" />
      </mesh>
    </group>
  );
};

const Borrifador: React.FC = () => (
  <group>
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[0.6, 0.9, 0.38]} />
      <Mat cor="#3B8FD9" rough={0.25} />
    </mesh>
    <mesh position={[0, 0.55, 0.2]}>
      <boxGeometry args={[0.45, 0.4, 0.01]} />
      <Mat cor="#FFFFFF" />
    </mesh>
    <mesh position={[0, 1.0, 0]}>
      <cylinderGeometry args={[0.12, 0.16, 0.2, 20]} />
      <Mat cor="#FFFFFF" />
    </mesh>
    <mesh position={[0.12, 1.18, 0]}>
      <boxGeometry args={[0.5, 0.18, 0.2]} />
      <Mat cor="#1F5FA3" />
    </mesh>
    <mesh position={[0.08, 1.0, 0]} rotation={[0, 0, 0.3]}>
      <boxGeometry args={[0.08, 0.25, 0.12]} />
      <Mat cor="#1F5FA3" />
    </mesh>
  </group>
);

const Esponja: React.FC = () => (
  <group position={[0, 0.2, 0]} rotation={[0, 0.4, 0]}>
    <mesh>
      <boxGeometry args={[1.0, 0.3, 0.6]} />
      <Mat cor="#F6D33C" rough={0.95} />
    </mesh>
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[1.0, 0.1, 0.6]} />
      <Mat cor="#2E9E57" rough={0.95} />
    </mesh>
  </group>
);

// ---------- FESTA ----------
const Baloes: React.FC = () => (
  <group>
    {[
      { x: -0.3, y: 1.0, c: "#D7191F", s: 0.38 },
      { x: 0.3, y: 1.15, c: "#F2B820", s: 0.34 },
      { x: 0.0, y: 1.35, c: "#FFFFFF", s: 0.3 },
    ].map((b, i) => (
      <group key={i} position={[b.x, b.y, i * 0.05]}>
        <mesh scale={[b.s, b.s * 1.2, b.s]}>
          <sphereGeometry args={[1, 32, 24]} />
          <Mat cor={b.c} rough={0.15} />
        </mesh>
        <mesh position={[0, -b.s * 1.2 - 0.04, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.06, 0.1, 12]} />
          <Mat cor={b.c} />
        </mesh>
        <mesh position={[-b.x * 0.5, -b.s * 1.2 - (b.y - b.s * 1.2) / 2, 0]} rotation={[0, 0, b.x * 0.5]}>
          <cylinderGeometry args={[0.008, 0.008, b.y - b.s * 1.2, 6]} />
          <Mat cor="#555555" />
        </mesh>
      </group>
    ))}
  </group>
);

const Chapeu: React.FC = () => (
  <group>
    <mesh position={[0, 0.55, 0]}>
      <coneGeometry args={[0.42, 1.1, 40]} />
      <Mat cor="#F2B820" rough={0.35} />
    </mesh>
    {[0.25, 0.55, 0.85].map((y) => (
      <mesh key={y} position={[0, y, 0]}>
        <torusGeometry args={[0.42 * (1 - y / 1.1) + 0.01, 0.025, 8, 40]} />
        <Mat cor="#D7191F" />
      </mesh>
    ))}
    <mesh position={[0, 1.15, 0]}>
      <sphereGeometry args={[0.12, 16, 12]} />
      <Mat cor="#D7191F" />
    </mesh>
  </group>
);

const Copo: React.FC<{ cor: string }> = ({ cor }) => {
  const geo = useLathe([
    [0, 0],
    [0.25, 0],
    [0.38, 1.0],
    [0.36, 1.0],
    [0.23, 0.04],
    [0, 0.04],
  ]);
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial color={cor} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.335, 0.31, 0.16, 32, 1, true]} />
        <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ---------- EMBALAGENS ----------
const Caixa: React.FC = () => (
  <group position={[0, 0.5, 0]} rotation={[0, 0.5, 0]}>
    <mesh>
      <boxGeometry args={[1.1, 1.0, 0.9]} />
      <Mat cor="#C8925A" rough={0.9} />
    </mesh>
    <mesh position={[0, 0.501, 0]}>
      <boxGeometry args={[0.25, 0.01, 0.92]} />
      <Mat cor="#E8C79A" rough={0.4} />
    </mesh>
    <mesh position={[0, 0.2, 0.451]}>
      <boxGeometry args={[0.25, 0.6, 0.01]} />
      <Mat cor="#E8C79A" rough={0.4} />
    </mesh>
    <mesh position={[0.3, -0.25, 0.452]}>
      <boxGeometry args={[0.3, 0.2, 0.01]} />
      <Mat cor="#D7191F" />
    </mesh>
  </group>
);

const Marmitex: React.FC = () => (
  <group position={[0, 0.2, 0]}>
    <mesh>
      <cylinderGeometry args={[0.65, 0.55, 0.35, 8]} />
      <Mat cor="#C9CDD2" rough={0.25} metal={0.85} />
    </mesh>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.7, 0.7, 0.06, 8]} />
      <Mat cor="#FFFFFF" rough={0.4} />
    </mesh>
  </group>
);

const Sacola: React.FC = () => (
  <group position={[0, 0.5, 0]} rotation={[0, -0.4, 0]}>
    <mesh>
      <boxGeometry args={[0.9, 1.0, 0.45]} />
      <Mat cor="#FFFFFF" rough={0.6} />
    </mesh>
    <mesh position={[0, 0.0, 0.226]}>
      <circleGeometry args={[0.22, 32]} />
      <Mat cor="#D7191F" />
    </mesh>
    {[-0.22, 0.22].map((x) => (
      <mesh key={x} position={[x, 0.6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.12, 0.025, 8, 24, Math.PI]} />
        <Mat cor="#D7191F" />
      </mesh>
    ))}
  </group>
);

// ============================================================
//  Catálogo por categoria (3 produtos cada)
// ============================================================
export const PRODUTOS_3D: Record<string, React.FC<P>[]> = {
  carnes: [() => <Bandeja recheio="#C2343A" bolinhas />, Bife, Linguica],
  frios: [Presunto, Queijo, Salame],
  frango: [Coxa, FrangoInteiro, () => <Bandeja recheio="#F4B6A6" />],
  mercearia: [() => <Pacote cor="#FFFFFF" faixa="#D7191F" />, () => <Garrafa cor="#F5C542" tampa="#D7191F" op={0.9} />, () => <Lata cor="#D7191F" />],
  limpeza: [Detergente, Borrifador, Esponja],
  festa: [Chapeu, Baloes, () => <Copo cor="#D7191F" />],
  embalagens: [Marmitex, Caixa, Sacola],
};
