import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, DrawPath, Drift, EASE_IN, Kinetic, prog } from "../ui";
import { DUR } from "../timeline";

// Ponto final da linha curva (coordenadas da tela) — onde nasce o círculo branco.
const END = { x: 930, y: 1150 };

// 9–12s · "parado" é riscado e vira "em movimento". A linha termina num círculo → branco.
export const Cena03Virada: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = prog(frame, 16, 10);
  const line = prog(frame, 44, 24);
  const circle = interpolate(frame, [68, 90], [0, 1], { ...CLAMP, easing: EASE_IN });

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Drift dur={DUR.c03} amount={0.04}>
        {/* "parado" riscado */}
        <div style={{ position: "absolute", top: 640, left: 0, right: 0 }}>
          <Kinetic
            delay={0}
            stagger={3}
            outAt={26}
            lines={[{ text: "parado", size: 150, color: "#48484A", chars: true }]}
          />
          <svg
            width="1080"
            height="200"
            viewBox="0 0 1080 200"
            style={{ position: "absolute", top: 0, left: 0, opacity: 1 - prog(frame, 28, 8) }}
          >
            <DrawPath
              d="M290 105L790 95"
              progress={strike}
              length={500}
              color={C.white}
              width={10}
            />
          </svg>
        </div>

        {/* "em movimento" entra letra por letra no mesmo lugar */}
        <div style={{ position: "absolute", top: 650, left: 0, right: 0 }}>
          <Kinetic
            delay={28}
            stagger={2.4}
            lines={[{ text: "em movimento", size: 128, color: C.white, chars: true }]}
          />
        </div>

        <div style={{ position: "absolute", top: 830, left: 0, right: 0 }}>
          <Kinetic
            delay={40}
            stagger={3}
            lines={[{ text: "é o que prende.", size: 64, color: "#AEAEB2", weight: 500 }]}
          />
        </div>

        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <DrawPath
            d={`M150 1160C310 1080 450 1250 600 1170S860 1080 ${END.x} ${END.y}`}
            progress={line}
            length={900}
            color={C.white}
            width={9}
          />
          <circle cx={END.x} cy={END.y} r={interpolate(circle, [0, 1], [4.5, 2400])} fill={C.white} opacity={line >= 1 ? 1 : 0} />
        </svg>
      </Drift>
    </AbsoluteFill>
  );
};
