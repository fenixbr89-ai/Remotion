import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Camera,
  CLAMP,
  DrawPath,
  EASE,
  Finger,
  FONT,
  Kinetic,
  prog,
  Sfx,
  useSpring,
} from "../../pixora/ui";
import { J, J_SFX } from "../tema";

const LOGO = { size: 820, cx: 540, cy: 840 };
const TAP = 112;
const BTN = { x: 540, y: 1470 };

// 37–45s · A linha laranja desenha o círculo da logo, que se revela por dentro.
// O dedo toca "Solicite seu orçamento" e aparece o WhatsApp. Parado no fim.
export const J06Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const ring = prog(frame, 4, 30);
  const reveal = interpolate(frame, [22, 52], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  const btn = useSpring(84, 16);
  const open = prog(frame, TAP + 2, 14);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <Sfx at={24} name="impact" volume={0.35} dir={J_SFX} />
      <Camera
        keys={[
          { f: 0, z: 1.08 },
          { f: 60, z: 1.0 },
        ]}
        origin="50% 44%"
      >
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <g opacity={1 - prog(frame, 48, 12)}>
            <DrawPath
              d={`M${LOGO.cx} ${LOGO.cy - 350}A350 350 0 1 1 ${LOGO.cx - 0.1} ${LOGO.cy - 350}`}
              progress={ring}
              length={2200}
              color={J.laranja}
              width={10}
            />
          </g>
        </svg>
        <Img
          src={staticFile("juliano/logo.jpg")}
          style={{
            position: "absolute",
            left: LOGO.cx - LOGO.size / 2,
            top: LOGO.cy - LOGO.size / 2,
            width: LOGO.size,
            height: LOGO.size,
            clipPath: `circle(${reveal * 46}% at 50% 50%)`,
            scale: String(interpolate(reveal, [0, 1], [0.92, 1])),
          }}
        />

        <div style={{ position: "absolute", top: 1290, left: 60, right: 60 }}>
          <Kinetic
            delay={58}
            stagger={4}
            lines={[
              {
                text: "Qualidade e soluções para o seu espaço",
                size: 46,
                weight: 300,
                color: J.cinzaMedio,
              },
            ]}
          />
        </div>

        {/* botão → contato */}
        <div
          style={{
            position: "absolute",
            left: BTN.x - 380,
            width: 760,
            top: BTN.y - 70,
            height: interpolate(open, [0, 1], [140, 220]),
            borderRadius: 70,
            background: J.laranja,
            boxShadow: "0 24px 60px rgba(242,106,27,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            color: "#FFFFFF",
            scale: String(
              btn * (1 - Math.sin(prog(frame, TAP - 2, 8) * Math.PI) * 0.05),
            ),
            overflow: "hidden",
          }}
        >
          {open < 0.5 ? (
            <div
              style={{ fontSize: 52, fontWeight: 600, opacity: 1 - open * 2 }}
            >
              Solicite seu orçamento
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                opacity: (open - 0.5) * 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 38,
                  fontWeight: 500,
                }}
              >
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <path
                    d="M22 4C12 4 4 11 4 20C4 25 6.5 29 10 32L8 40L16 36C18 36.7 20 37 22 37C32 37 40 29 40 20C40 11 32 4 22 4Z"
                    fill="#FFFFFF"
                  />
                </svg>
                WhatsApp
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                (62) 99113-2531
              </div>
            </div>
          )}
        </div>

        <Finger
          path={[
            { f: 90, x: 920, y: 1800 },
            { f: TAP - 2, x: BTN.x + 120, y: BTN.y },
            { f: TAP + 8, x: BTN.x + 150, y: BTN.y + 40 },
            { f: 140, x: 960, y: 1850 },
          ]}
          taps={[TAP]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
