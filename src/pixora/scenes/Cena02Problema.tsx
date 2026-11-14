import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  C,
  Camera,
  CLAMP,
  DrawPath,
  EASE,
  EASE_IN,
  FONT,
  Kinetic,
  prog,
} from "../ui";

// 3,4–5,5s · "Imagem parada não prende ninguém": views despencam, gráfico cai,
// e o ponto final cresce até virar o preto da cena 3.
export const Cena02Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const views = Math.round(
    interpolate(frame, [2, 30], [12, 3], { ...CLAMP, easing: EASE }),
  );
  const cardIn = prog(frame, -4, 12);
  const cardOut = prog(frame, 40, 10, EASE_IN);
  const graph = prog(frame, 4, 26);
  const dotIn = prog(frame, 34, 6);
  const dotGrow = interpolate(frame, [44, 63], [1, 190], {
    ...CLAMP,
    easing: EASE_IN,
  });

  return (
    <AbsoluteFill style={{ background: C.gray }}>
      <Camera
        keys={[
          { f: 0, z: 1.12, r: -1 },
          { f: 30, z: 1.02, r: 0 },
          { f: 63, z: 1.05 },
        ]}
        punches={[{ f: 30, amt: 0.05 }]}
      >
        <div
          style={{
            position: "absolute",
            top: 360,
            left: 140,
            right: 140,
            height: 520,
            borderRadius: 48,
            background: C.white,
            boxShadow: "0 30px 80px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            overflow: "hidden",
            opacity: cardIn * (1 - cardOut),
            filter: `blur(${(1 - cardIn) * 20 + cardOut * 16}px)`,
            translate: `0px ${cardOut * -80}px`,
          }}
        >
          <svg
            width="800"
            height="200"
            viewBox="0 0 800 200"
            style={{ position: "absolute", bottom: 0, left: 0 }}
          >
            <DrawPath
              d="M0 30L120 50L220 40L330 90L450 80L560 140L680 150L800 190"
              progress={graph}
              length={900}
              color="rgba(255,59,48,0.35)"
              width={8}
            />
          </svg>
          <div
            style={{
              position: "relative",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 200,
              letterSpacing: "-0.05em",
              color: views <= 5 ? "#3A3A3C" : C.ink,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              gap: 20,
              scale: String(1 + Math.sin(prog(frame, 30, 10) * Math.PI) * 0.08),
            }}
          >
            {views}
            <svg
              width="60"
              height="70"
              viewBox="0 0 60 70"
              style={{ opacity: graph }}
            >
              <path
                d="M30 6V60M8 40L30 62L52 40"
                fill="none"
                stroke={C.red}
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              position: "relative",
              fontFamily: FONT,
              fontSize: 44,
              color: C.sub,
              fontWeight: 500,
            }}
          >
            visualizações
          </div>
        </div>

        <div style={{ position: "absolute", top: 980, left: 60, right: 60 }}>
          <Kinetic
            delay={6}
            stagger={3}
            lines={[
              { text: "Imagem parada", size: 92, color: C.sub },
              { text: "não prende", size: 116 },
            ]}
            trailing={
              <span
                style={{
                  display: "inline-block",
                  width: "0.2em",
                  height: "0.2em",
                  marginLeft: "0.04em",
                  borderRadius: "50%",
                  background: C.black,
                  opacity: dotIn,
                  scale: String(dotGrow * (0.4 + 0.6 * dotIn)),
                  position: "relative",
                  zIndex: 5,
                }}
              />
            }
          />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
