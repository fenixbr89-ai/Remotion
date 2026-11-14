import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, Drift, EASE, EASE_IN, FONT, Kinetic, prog } from "../ui";
import { DUR } from "../timeline";

// 4–9s · Contador de views cai de 12 para 3. O ponto final cresce e vira o preto da cena 3.
export const Cena02Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const views = Math.round(
    interpolate(frame, [30, 74], [12, 3], { ...CLAMP, easing: EASE }),
  );
  const tick = interpolate(frame, [30, 74], [0, 9], CLAMP);
  const flicker = frame > 30 && frame < 76 ? (1 - (tick % 1)) * 4 : 0;
  const cardIn = prog(frame, 2, 16);
  const cardOut = prog(frame, 112, 14, EASE_IN);
  const drop = prog(frame, 30, 44);
  const dotIn = prog(frame, 92, 10);
  const dotGrow = interpolate(frame, [124, 150], [1, 190], {
    ...CLAMP,
    easing: EASE_IN,
  });

  return (
    <AbsoluteFill style={{ background: C.gray }}>
      <Drift dur={DUR.c02} amount={0.03}>
        <div
          style={{
            position: "absolute",
            top: 380,
            left: 140,
            right: 140,
            height: 470,
            borderRadius: 48,
            background: C.white,
            boxShadow: "0 30px 80px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: cardIn * (1 - cardOut),
            filter: `blur(${(1 - cardIn) * 20 + cardOut * 16}px)`,
            scale: String(1.08 - 0.08 * cardIn - cardOut * 0.06),
            translate: `0px ${cardOut * -60}px`,
          }}
        >
          <svg width="76" height="50" viewBox="0 0 76 50">
            <path
              d="M3 25C14 9 25 3 38 3S62 9 73 25C62 41 51 47 38 47S14 41 3 25Z"
              fill="none"
              stroke={C.sub}
              strokeWidth="5"
            />
            <circle cx="38" cy="25" r="10" fill={C.sub} />
          </svg>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 190,
              letterSpacing: "-0.04em",
              color: drop > 0.5 ? "#3A3A3C" : C.ink,
              filter: `blur(${flicker}px)`,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            {views}
            <svg width="60" height="70" viewBox="0 0 60 70" style={{ opacity: drop }}>
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
          <div style={{ fontFamily: FONT, fontSize: 44, color: C.sub, fontWeight: 500 }}>
            visualizações
          </div>
        </div>

        <div style={{ position: "absolute", top: 980, left: 60, right: 60 }}>
          <Kinetic
            delay={64}
            stagger={4}
            lines={[
              { text: "Imagem estática", size: 88, color: C.sub },
              { text: "não vende mais", size: 104 },
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
      </Drift>
    </AbsoluteFill>
  );
};
