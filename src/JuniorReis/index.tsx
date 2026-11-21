import type { FC } from "react";
import { AbsoluteFill, Sequence, random, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { RoundCursor } from "./cursor";
import { DUR, EO, LIME, M, START, THEME, tw } from "./lib";
import { S01, S02, S03, S04 } from "./scenes/S01_04";
import { S05, S06, S07, S08 } from "./scenes/S05_08";
import { S09, S10, S11, S12 } from "./scenes/S09_12";
import { TextStyleCtx, type TextStyle } from "./ui";

const SCENES = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12];
const NAMES = [
  "01 Treino concluído",
  "02 Eu sou Júnior Reis",
  "03 Superar limites",
  "04 Como a gente chega lá",
  "05 Modalidades",
  "06 Evolução do treino",
  "07 Acompanhamento",
  "08 Consultoria",
  "09 Plano individual",
  "10 Logo",
  "11 Instagram",
  "12 WhatsApp",
];

const sceneAt = (f: number) => {
  let i = 0;
  while (i + 1 < START.length && f >= START[i + 1]) i++;
  return i;
};

/** Câmera viva: drift contínuo + punch-in a cada corte */
const useCamera = () => {
  const f = useCurrentFrame();
  const i = sceneAt(f);
  const t = f - START[i];
  const punch = i === 0 ? 0 : tw(t, 0, 5) * (1 - tw(t, 5, 26));
  const intro = 1 - tw(f, 0, 40, 0, 1, EO);
  return {
    scale: 1.035 + Math.sin(f / 46) * 0.012 + punch * 0.045 + intro * 0.08,
    x: Math.sin(f / 61) * 10,
    y: Math.cos(f / 53) * 12,
    rot: Math.sin(f / 77) * 0.35 + punch * (i % 2 ? 0.6 : -0.6),
  };
};

const Particles: FC = () => {
  const f = useCurrentFrame();
  const i = sceneAt(f);
  const dark = THEME[i] === "d";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(28).fill(0).map((_, k) => {
        const x = random(`px${k}`) * 1080;
        const speed = 0.6 + random(`ps${k}`) * 1.4;
        const y = (((random(`py${k}`) * 2200 - f * speed) % 2200) + 2200) % 2200 - 140;
        const s = 3 + random(`pz${k}`) * 6;
        const tw2 = 0.5 + 0.5 * Math.sin(f / (8 + random(`pt${k}`) * 10) + k);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x + Math.sin(f / 30 + k) * 18,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: dark ? LIME : "#9BCD2F",
              opacity: (dark ? 0.35 : 0.25) * tw2,
              boxShadow: `0 0 ${s * 3}px ${LIME}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Flash verde nos cortes */
const Flash: FC = () => {
  const f = useCurrentFrame();
  const i = sceneAt(f);
  if (i === 0) return null;
  const t = f - START[i];
  const o = tw(t, 0, 4) * (1 - tw(t, 4, 18));
  if (o <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 55% at 50% 45%, rgba(212,255,79,${0.32 * o}) 0%, rgba(212,255,79,0) 70%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

export const JuniorReis: FC<{ textStyle: TextStyle }> = ({ textStyle }) => {
  const cam = useCamera();
  return (
    <TextStyleCtx.Provider value={textStyle}>
      <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            scale: String(cam.scale),
            translate: `${cam.x}px ${cam.y}px`,
            rotate: `${cam.rot}deg`,
          }}
        >
          <Background />
          <Particles />
          {SCENES.map((Scene, i) => {
            const last = i === SCENES.length - 1;
            return (
              <Sequence key={i} name={NAMES[i]} from={START[i]} durationInFrames={last ? DUR[i] : DUR[i] + M} premountFor={30}>
                <Scene d={DUR[i]} />
              </Sequence>
            );
          })}
          <RoundCursor />
        </AbsoluteFill>
        <Flash />
      </AbsoluteFill>
    </TextStyleCtx.Provider>
  );
};
