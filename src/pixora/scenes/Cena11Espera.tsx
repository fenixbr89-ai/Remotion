import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, Camera, Emoji, Finger, FONT, Kinetic, PixoraP, prog, Sfx, useSpring } from "../ui";

const TAP = 14;

// 28,2–30,6s · "Chama a Pixora." → o dedo toca "Chamar a Pixora";
// "Tô te esperando!" → a frase entra sozinha.
export const Cena11Espera: React.FC = () => {
  const frame = useCurrentFrame();
  const btn = useSpring(0, 14);
  const fly = prog(frame, TAP + 6, 10);
  const eyes = useSpring(44, 10);
  const out = prog(frame, 64, 8);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Sfx at={TAP + 6} name="whoosh" volume={0.45} />
      <Camera keys={[{ f: 0, z: 1 }, { f: 72, z: 1.08 }]} punches={[{ f: TAP, amt: 0.05 }, { f: 44, amt: 0.04 }]}>
        <div
          style={{
            position: "absolute",
            left: 190,
            width: 700,
            top: 880,
            height: 140,
            borderRadius: 70,
            background: C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 600,
            color: C.ink,
            scale: String(btn * (1 - Math.sin(prog(frame, TAP - 2, 8) * Math.PI) * 0.08)),
            translate: `0px ${fly * -500}px`,
            opacity: 1 - fly,
            filter: `blur(${fly * 14}px)`,
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: C.black,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PixoraP size={50} id="c11" />
          </div>
          Chamar a Pixora
        </div>

        <div style={{ position: "absolute", top: 800, left: 60, right: 60 }}>
          <Kinetic
            delay={30}
            stagger={4}
            outAt={64}
            lines={[
              { text: "Tô te esperando", size: 100, color: C.white },
              { text: "aqui", size: 100, color: C.white },
            ]}
            trailing={
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 24,
                  opacity: (1 - out) * Math.min(1, eyes * 2),
                  scale: String(eyes),
                }}
              >
                <Emoji char="👀" size={100} />
              </span>
            }
          />
        </div>

        <Finger
          path={[
            { f: 0, x: 900, y: 1500 },
            { f: TAP - 2, x: 600, y: 950 },
            { f: TAP + 8, x: 640, y: 1000 },
            { f: 28, x: 920, y: 1600 },
          ]}
          taps={[TAP]}
          dark
        />
      </Camera>
    </AbsoluteFill>
  );
};
