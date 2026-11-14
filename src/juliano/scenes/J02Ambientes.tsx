import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Camera,
  CLAMP,
  EASE_IN_OUT,
  Kinetic,
  prog,
  Sfx,
  useSpring,
} from "../../pixora/ui";
import { J, J_SFX } from "../tema";

const WALL = { left: 90, top: 560, width: 900, height: 960 };
const STRIP = WALL.width / 3;
const PASS = [20, 52, 84];
const PASS_DUR = 30;

/** Rolo de pintura (cilindro laranja + cabo preto), centrado no cilindro. */
const Rolo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly spin: number;
}> = ({ x, y, spin }) => (
  <svg
    width="340"
    height="440"
    viewBox="0 0 340 440"
    style={{ position: "absolute", left: x - 160, top: y - 40 }}
  >
    <rect x="10" y="0" width="300" height="80" rx="40" fill={J.laranja} />
    {[0, 1, 2, 3, 4].map((i) => (
      <line
        key={i}
        x1={40 + ((i * 60 + spin) % 260)}
        y1="10"
        x2={40 + ((i * 60 + spin) % 260)}
        y2="70"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    ))}
    <rect
      x="10"
      y="10"
      width="300"
      height="18"
      rx="9"
      fill="rgba(255,255,255,0.25)"
    />
    <path
      d="M310 40H332V170H160V230"
      fill="none"
      stroke={J.preto}
      strokeWidth="12"
      strokeLinejoin="round"
    />
    <rect x="144" y="226" width="32" height="200" rx="16" fill={J.preto} />
  </svg>
);

// 5–12s · O rolo pinta a parede em três passadas; a câmera se afasta e revela o
// ambiente renovado. "Transformamos ambientes."
export const J02Ambientes: React.FC = () => {
  const frame = useCurrentFrame();
  const active = PASS.findIndex((p) => frame >= p && frame < p + PASS_DUR + 4);
  const quadro = useSpring(128, 16);
  const sofa = useSpring(138, 18);
  const planta = useSpring(148, 14);
  const luz = useSpring(156, 14);
  const rodape = prog(frame, 118, 16);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      {PASS.map((p) => (
        <Sfx key={p} at={p} name="brush" volume={0.4} dir={J_SFX} />
      ))}
      <Camera
        keys={[
          { f: 0, z: 1.22 },
          { f: PASS[2] + PASS_DUR, z: 1.2 },
          { f: 150, z: 1.0, y: 0 },
          { f: 230, z: 1.03 },
        ]}
        origin="50% 30%"
      >
        <div
          style={{
            position: "absolute",
            ...WALL,
            background: J.parede,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {PASS.map((p, i) => {
            const t = interpolate(frame, [p, p + PASS_DUR], [0, 1], {
              ...CLAMP,
              easing: EASE_IN_OUT,
            });
            return (
              <div
                key={p}
                style={{
                  position: "absolute",
                  left: i * STRIP - 2,
                  width: STRIP + 4,
                  top: 0,
                  height: WALL.height * t,
                  background: J.tinta,
                }}
              />
            );
          })}
          {/* quadro na parede */}
          <div
            style={{
              position: "absolute",
              left: 330,
              top: 170,
              width: 240,
              height: 180,
              borderRadius: 6,
              border: `10px solid ${J.preto}`,
              background: "#FFFFFF",
              overflow: "hidden",
              scale: String(quadro),
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 40,
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: J.laranja,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 100,
                top: 20,
                width: 160,
                height: 6,
                background: J.preto,
                rotate: "-20deg",
              }}
            />
          </div>
        </div>

        {/* rodapé e piso */}
        <div
          style={{
            position: "absolute",
            left: WALL.left,
            top: WALL.top + WALL.height - 8,
            width: WALL.width * rodape,
            height: 8,
            background: J.laranja,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: WALL.left,
            top: WALL.top + WALL.height,
            width: WALL.width,
            height: 160,
            background:
              "repeating-linear-gradient(90deg, #E9DED2 0px, #E9DED2 148px, #DDD0C2 148px, #DDD0C2 150px)",
            opacity: rodape,
          }}
        />

        {/* sofá */}
        <div
          style={{
            position: "absolute",
            left: 250,
            top: 1260,
            width: 580,
            height: 240,
            translate: `0px ${(1 - sofa) * 200}px`,
            opacity: sofa,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              top: 0,
              height: 150,
              borderRadius: 40,
              background: "#3A3A3C",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 90,
              height: 120,
              borderRadius: 40,
              background: "#1C1C1E",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 30,
              width: 130,
              height: 90,
              borderRadius: 24,
              background: J.laranja,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 200,
              width: 14,
              height: 40,
              background: J.preto,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 40,
              top: 200,
              width: 14,
              height: 40,
              background: J.preto,
            }}
          />
        </div>

        {/* planta */}
        <svg
          width="170"
          height="360"
          viewBox="0 0 170 360"
          style={{
            position: "absolute",
            left: 100,
            top: 1180,
            scale: String(planta),
            transformOrigin: "50% 100%",
          }}
        >
          <path
            d="M85 250C80 170 40 120 10 80M85 250C90 160 130 110 160 60M85 250C85 170 85 90 85 20"
            fill="none"
            stroke="#2F6B3B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <ellipse
            cx="22"
            cy="92"
            rx="26"
            ry="12"
            fill="#3D8A4C"
            transform="rotate(40 22 92)"
          />
          <ellipse
            cx="148"
            cy="72"
            rx="26"
            ry="12"
            fill="#3D8A4C"
            transform="rotate(-40 148 72)"
          />
          <ellipse cx="85" cy="30" rx="12" ry="28" fill="#3D8A4C" />
          <path d="M40 250H130L118 350H52Z" fill={J.preto} />
        </svg>

        {/* luminária */}
        <svg
          width="200"
          height="700"
          viewBox="0 0 200 700"
          style={{ position: "absolute", left: 800, top: 880, opacity: luz }}
        >
          <circle
            cx="100"
            cy="150"
            r={150 * luz}
            fill="rgba(255,178,122,0.25)"
          />
          <path d="M40 60H160L130 150H70Z" fill={J.preto} />
          <line
            x1="100"
            y1="150"
            x2="100"
            y2="640"
            stroke={J.preto}
            strokeWidth="8"
          />
          <path
            d="M50 640H150"
            stroke={J.preto}
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>

        {active >= 0 ? (
          <Rolo
            x={WALL.left + STRIP * active + STRIP / 2}
            y={
              WALL.top +
              WALL.height *
                interpolate(
                  frame,
                  [PASS[active], PASS[active] + PASS_DUR],
                  [0, 1],
                  { ...CLAMP, easing: EASE_IN_OUT },
                ) -
              40
            }
            spin={frame * 12}
          />
        ) : null}
      </Camera>

      <div style={{ position: "absolute", top: 230, left: 60, right: 60 }}>
        <Kinetic
          delay={24}
          stagger={5}
          lines={[
            {
              text: "Transformamos",
              size: 88,
              weight: 300,
              color: J.cinzaMedio,
            },
            { text: "ambientes.", size: 108, weight: 600, color: J.preto },
          ]}
          lineHeight={1.1}
        />
      </div>
    </AbsoluteFill>
  );
};
