import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { BgDots, C, Camera, CLAMP, EmojiBadge, Finger, Kinetic, prog, Sfx, useSpring } from "../ui";
import { IDX, NARRACAO_ARQUIVO, sceneFrom } from "../timeline";

const BARS = 25;
const TAP = 8;

const Nota: React.FC<{ readonly at: number; readonly x: number; readonly flip?: boolean }> = ({ at, x, flip }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, at, 40);
  if (frame < at) return null;
  return (
    <svg
      width="70"
      height="90"
      viewBox="0 0 70 90"
      style={{
        position: "absolute",
        left: x + Math.sin(t * 6) * 20,
        top: interpolate(t, [0, 1], [900, 380]),
        opacity: interpolate(t, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
        scale: flip ? "-1 1" : "1 1",
        rotate: `${(flip ? -1 : 1) * t * 30}deg`,
      }}
    >
      <path d="M25 70V12L62 4V60" fill="none" stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
      <ellipse cx="16" cy="72" rx="13" ry="10" fill={C.ink} />
      <ellipse cx="53" cy="62" rx="13" ry="10" fill={C.ink} />
    </svg>
  );
};

// 15,3–17,5s · "Narração e trilha já vêm inclusas": o dedo toca gravar, o botão vira o
// microfone e a onda reage à voz real da narração; notas sobem na "trilha".
export const Cena07Diferencial2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audio = useAudioData(staticFile(NARRACAO_ARQUIVO));
  const rec = prog(frame, TAP, 10);
  const mic = useSpring(TAP + 4, 12);
  const wave = prog(frame, TAP + 6, 10);
  const absFrame = frame + sceneFrom(IDX.c07);
  const levels = audio
    ? visualizeAudio({ fps, frame: absFrame, audioData: audio, numberOfSamples: 32, optimizeFor: "speed" })
    : new Array(32).fill(0);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <BgDots />
      <Sfx at={TAP + 4} name="pop" volume={0.5} />
      <Camera
        keys={[{ f: 0, z: 1.0 }, { f: 30, z: 1.05 }, { f: 76, z: 1.1 }]}
        punches={[{ f: 32, amt: 0.04 }, { f: 50, amt: 0.05 }]}
      >
        {/* botão de gravar → microfone */}
        <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "absolute",
              width: 230,
              height: 230,
              borderRadius: "50%",
              top: 15,
              border: "10px solid #E5E5EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - rec,
              scale: String(1 - rec * 0.3),
            }}
          >
            <div style={{ width: 150, height: 150, borderRadius: "50%", background: C.red }} />
          </div>
          <EmojiBadge char="🎙️" size={260} style={{ scale: String(mic) }} />
          {/* anel pulsando com a voz */}
          <div
            style={{
              position: "absolute",
              top: -20,
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: `6px solid ${C.red}`,
              opacity: wave * 0.35,
              scale: String(1 + Math.min(0.3, (levels[0] ?? 0) * 4)),
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 760,
            left: 0,
            right: 0,
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: wave,
          }}
        >
          {new Array(BARS).fill(0).map((_, i) => {
            const idx = Math.abs(i - (BARS - 1) / 2);
            const v = levels[Math.min(31, Math.round(idx * 1.6))] ?? 0;
            const h = interpolate(wave, [0, 1], [8, 14 + Math.min(200, v * 900)], CLAMP);
            return <div key={i} style={{ width: 16, height: h, borderRadius: 8, background: C.ink }} />;
          })}
        </div>

        <Nota at={30} x={170} />
        <Nota at={36} x={840} flip />
        <Nota at={44} x={260} flip />

        <div style={{ position: "absolute", top: 1080, left: 60, right: 60 }}>
          <Kinetic
            delay={12}
            stagger={4}
            lines={[
              { text: "Narração e trilha", size: 80, color: C.sub },
              { text: "já inclusas.", size: 108 },
            ]}
            lineHeight={1.1}
          />
        </div>

        <Finger
          path={[
            { f: 0, x: 860, y: 1500 },
            { f: TAP - 2, x: 540, y: 520 },
            { f: TAP + 8, x: 560, y: 560 },
            { f: 26, x: 900, y: 1600 },
          ]}
          taps={[TAP]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
