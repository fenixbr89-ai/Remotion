import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, Camera, CLAMP, DrawPath, EASE_IN, Kinetic, prog, Sfx } from "../ui";

const END = { x: 930, y: 1150 };

// 5,5–7,6s · A batida entra no "Movimento": "parado" é riscado, "em movimento" chega
// com linhas de velocidade e tremida; a linha termina num círculo que vira o branco.
export const Cena03Virada: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = prog(frame, 3, 6);
  const line = prog(frame, 32, 16);
  const circle = interpolate(frame, [46, 63], [0, 1], { ...CLAMP, easing: EASE_IN });

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Sfx at={0} name="impact" volume={0.6} />
      <Sfx at={3} name="tap" volume={0.5} />
      <Sfx at={9} name="whoosh" volume={0.55} />
      <Sfx at={44} name="whoosh" volume={0.5} />

      {/* linhas de velocidade */}
      {new Array(9).fill(0).map((_, i) => {
        const t = prog(frame, 8 + (i % 4) * 2, 14);
        if (t <= 0 || t >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 300 + i * 150,
              left: interpolate(t, [0, 1], [1200, -900]),
              width: 500 + (i % 3) * 200,
              height: i % 2 ? 4 : 8,
              borderRadius: 4,
              background: "rgba(255,255,255,0.5)",
            }}
          />
        );
      })}

      <Camera
        keys={[{ f: 0, z: 1.0 }, { f: 63, z: 1.1 }]}
        punches={[{ f: 10, amt: 0.09 }]}
      >
        <div style={{ position: "absolute", top: 640, left: 0, right: 0 }}>
          <Kinetic
            delay={-12}
            stagger={3}
            outAt={8}
            lines={[{ text: "parado", size: 150, color: "#48484A", chars: true }]}
          />
          <svg
            width="1080"
            height="200"
            viewBox="0 0 1080 200"
            style={{ position: "absolute", top: 0, left: 0, opacity: 1 - prog(frame, 9, 5) }}
          >
            <DrawPath d="M290 105L790 95" progress={strike} length={500} color={C.white} width={10} />
          </svg>
        </div>

        <div style={{ position: "absolute", top: 650, left: 0, right: 0 }}>
          <Kinetic
            delay={9}
            stagger={1.8}
            lines={[{ text: "em movimento", size: 132, color: C.white, chars: true }]}
          />
        </div>

        <div style={{ position: "absolute", top: 830, left: 0, right: 0 }}>
          <Kinetic
            delay={24}
            stagger={3}
            lines={[{ text: "é o que prende.", size: 64, color: "#AEAEB2", weight: 500 }]}
          />
        </div>

        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <DrawPath
            d={`M150 1160C310 1080 450 1250 600 1170S860 1080 ${END.x} ${END.y}`}
            progress={line}
            length={900}
            color={C.white}
            width={9}
          />
          <circle
            cx={END.x}
            cy={END.y}
            r={interpolate(circle, [0, 1], [4.5, 2600])}
            fill={C.white}
            opacity={line >= 1 ? 1 : 0}
          />
        </svg>
      </Camera>
    </AbsoluteFill>
  );
};
