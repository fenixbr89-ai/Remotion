import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Camera,
  CLAMP,
  EASE,
  EASE_IN_OUT,
  Kinetic,
  prog,
  Sfx,
} from "../../pixora/ui";
import { J, J_SFX } from "../tema";

const WALL = { left: 90, top: 640, width: 900, height: 760 };
const MID = WALL.top + WALL.height / 2;

// 0–5s · Uma linha laranja nasce devagar, a câmera acompanha; ela se abre e
// revela a parede transformada. "Todo espaço tem potencial."
export const J01Potencial: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [8, 62], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const open = interpolate(frame, [64, 104], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  const wallIn = prog(frame, 0, 20);
  const tipX = WALL.left + line * WALL.width;

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <Sfx at={64} name="brush" volume={0.4} dir={J_SFX} />
      <Camera
        keys={[
          { f: 0, z: 1.5, x: 360, y: -150 },
          { f: 62, z: 1.35, x: -300, y: -120 },
          { f: 104, z: 1.0, x: 0, y: 0 },
          { f: 170, z: 1.04 },
        ]}
        origin="50% 54%"
      >
        {/* parede gasta */}
        <div
          style={{
            position: "absolute",
            ...WALL,
            borderRadius: 12,
            background: J.parede,
            opacity: wallIn,
            overflow: "hidden",
          }}
        >
          <svg
            width={WALL.width}
            height={WALL.height}
            style={{ position: "absolute", inset: 0 }}
          >
            <path
              d="M120 80L170 160L150 230L210 300M640 520L700 590L680 660M760 120L720 190L760 250"
              fill="none"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="3"
            />
            <circle cx="300" cy="560" r="40" fill="rgba(0,0,0,0.05)" />
            <circle cx="620" cy="220" r="60" fill="rgba(0,0,0,0.04)" />
          </svg>
          {/* área já pintada que se abre a partir da linha */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (WALL.height / 2) * (1 - open),
              height: WALL.height * open,
              background: J.tinta,
            }}
          />
        </div>

        {/* bordas laranja: a linha que se divide em duas e abre a parede */}
        {[-1, 1].map((dir) => (
          <div
            key={dir}
            style={{
              position: "absolute",
              left: WALL.left,
              width: tipX - WALL.left,
              top: MID - 3 + dir * (WALL.height / 2) * open,
              height: 6,
              borderRadius: 3,
              background: J.laranja,
              opacity:
                open > 0.98
                  ? interpolate(frame, [104, 120], [1, 0.0], CLAMP)
                  : 1,
            }}
          />
        ))}
        {/* ponta da linha */}
        <div
          style={{
            position: "absolute",
            left: tipX - 9,
            top: MID - 9,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: J.laranja,
            opacity: line > 0 && open < 0.2 ? 1 : 0,
            boxShadow: `0 0 24px ${J.laranja}`,
          }}
        />
      </Camera>
      <div style={{ position: "absolute", top: 300, left: 60, right: 60 }}>
        <Kinetic
          delay={70}
          stagger={5}
          lines={[
            {
              text: "Todo espaço",
              size: 92,
              weight: 300,
              color: J.cinzaMedio,
            },
            {
              text: "tem potencial.",
              size: 104,
              weight: 600,
              color: J.preto,
            },
          ]}
          lineHeight={1.1}
        />
      </div>
    </AbsoluteFill>
  );
};
