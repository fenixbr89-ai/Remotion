import React from "react";
import { useCurrentFrame } from "remotion";
import { enterStyle } from "../anim";
import { C, FONT, s, SCENES, T } from "../constants";
import { Caption } from "../components/Caption";
import { Icon3D, IconBadge, LineIcon, Logo } from "../components/Icons";
import { MarmitaTop as Marmita } from "../components/MarmitaTop";
import { SceneShell } from "../components/SceneShell";

const L = (sec: number) => s(sec) - SCENES.s1.from;

/** Mistura de ícones de linha (2D, Lucide) e 3D (Fluent Emoji) ao redor da marmita */
const BADGES: { x: number; y: number; size?: number; node: React.ReactNode }[] = [
  { x: 190, y: 400, node: <LineIcon name="utensils" size={74} /> },
  { x: 890, y: 400, node: <Icon3D src="3d/fire.png" size={96} /> },
  { x: 150, y: 790, size: 130, node: <Icon3D src="3d/leafy_green.png" size={84} /> },
  { x: 930, y: 790, size: 130, node: <LineIcon name="chef-hat" size={64} /> },
  { x: 205, y: 1110, node: <Icon3D src="3d/coin.png" size={92} /> },
  { x: 875, y: 1110, node: <LineIcon name="tag" size={72} /> },
  { x: 380, y: 1200, size: 130, node: <LineIcon name="shopping-bag" size={62} /> },
  { x: 700, y: 1200, size: 130, node: <Icon3D src="3d/motor_scooter.png" size={84} /> },
  {
    x: 540,
    y: 300,
    size: 120,
    node: (
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: "50%",
          background: C.gradientDiag,
          color: "#fff",
          fontWeight: 800,
          fontSize: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-1px",
        }}
      >
        R$
      </div>
    ),
  },
];

const EpBadge: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 34px 16px 22px",
          background: C.white,
          borderRadius: 999,
          boxShadow: C.shadowSm,
          ...enterStyle(frame, start, { dy: -20 }),
        }}
      >
        <Logo size={48} />
        <span style={{ fontSize: 36, fontWeight: 800, color: C.blue, letterSpacing: "1px" }}>
          EP. 02
        </span>
        <span style={{ width: 2, height: 34, background: "#DDE3EC" }} />
        <span style={{ fontSize: 32, fontWeight: 600, color: C.gray }}>E se eu abrisse…</span>
      </div>
    </div>
  );
};

export const Scene1Hook: React.FC = () => {
  return (
    <SceneShell enter={false}>
      <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
        {BADGES.map((b, i) => (
          <IconBadge
            key={i}
            x={b.x}
            y={b.y}
            size={b.size}
            start={L(T.s1IconsStart + i * T.s1IconsGap)}
            seed={i}
          >
            {b.node}
          </IconBadge>
        ))}
        <Marmita
          x={540}
          y={790}
          enterAt={L(T.s1Marmita)}
          lidAt={L(T.s1Lid)}
          foodAt={L(T.s1Food)}
        />
        <EpBadge start={L(T.s1Badge)} />
        <Caption
          start={L(T.s1Caption)}
          line1="E se eu abrisse uma"
          line2={[{ text: "marmitaria?", accent: true }]}
        />
      </div>
    </SceneShell>
  );
};
