import type { FC } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { RoundCursor } from "./cursor";
import { DUR, EO, LIME, M, SANS, START, THEME, tw } from "./lib";
import { SHook } from "./scenes/Hook";
import { S01, S02, S03, S04 } from "./scenes/A";
import { S05, S06, S07, S08 } from "./scenes/B";
import { S09, S10, S11, S12 } from "./scenes/C";
import { S13, S14, S15 } from "./scenes/D";

const SCENES = [SHook, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15];
const NAMES = [
  "00 Gancho",
  "01 Treinamento com estratégia",
  "02 Olá, sou Júnior Reis",
  "03 Saúde e performance",
  "04 Meus serviços",
  "05 Musculação",
  "06 Corrida",
  "07 Condicionamento",
  "08 Consultoria online",
  "09 Personal presencial",
  "10 Compromisso com a evolução",
  "11 Objetivo → Constância",
  "12 Começando ou evoluindo",
  "13 Instagram",
  "14 WhatsApp",
  "15 Logo",
];

const sceneAt = (f: number) => {
  let i = 0;
  while (i + 1 < START.length && f >= START[i + 1]) i++;
  return i;
};

/** Câmera viva: drift contínuo + punch-in a cada corte */
const useCamera = () => {
  const f = useCurrentFrame();
  const intro = 1 - tw(f, 0, 40, 0, 1, EO);
  return {
    scale: 1.02 + Math.sin(f / 46) * 0.01 + intro * 0.08,
    x: Math.sin(f / 61) * 10,
    y: Math.cos(f / 53) * 12,
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

/** Marca d'água de prévia: discreta, mas visível em todo o vídeo */
const Watermark: FC = () => {
  const rows = new Array(9).fill(0);
  const cols = new Array(3).fill(0);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -500, top: -300, width: 2100, height: 2600, rotate: "-28deg", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
        {rows.map((_, r) => (
          <div key={r} style={{ display: "flex", justifyContent: "space-around", translate: `${r % 2 ? 180 : 0}px 0px` }}>
            {cols.map((__, c) => (
              <span key={c} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: "-0.02em", color: "rgba(150,150,150,0.17)", whiteSpace: "nowrap" }}>
                Kayke.hs
              </span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 48, padding: "10px 22px", borderRadius: 30, background: "rgba(0,0,0,0.35)", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "rgba(255,255,255,0.75)" }}>
        PRÉVIA · Kayke.hs
      </div>
    </AbsoluteFill>
  );
};

export const JuniorReis: FC<{ watermark: boolean }> = ({ watermark }) => {
  const cam = useCamera();
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            scale: String(cam.scale),
            translate: `${cam.x}px ${cam.y}px`,
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
        <Audio src={staticFile("narracao.wav")} />
        {watermark ? <Watermark /> : null}
      </AbsoluteFill>
    </>
  );
};
