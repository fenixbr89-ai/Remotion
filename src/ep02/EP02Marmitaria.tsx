import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { easeInOut, ip } from "./anim";
import { C, DURATION, s, SCENES, T, TRANSITION, WIPE } from "./constants";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { S2_TOTAL_END, Scene2Custo } from "./scenes/Scene2Custo";
import { Scene3Erro } from "./scenes/Scene3Erro";
import { S4, S4_PUNCH, Scene4Preco } from "./scenes/Scene4Preco";
import { S5_TOTAL_END, Scene5Sobra } from "./scenes/Scene5Sobra";
import { Scene6CTA } from "./scenes/Scene6CTA";

// ---------------------------------------------------------------------------
// Narração (opcional). Quando houver o arquivo, coloque em public/audio/narracao.mp3
// e mude HAS_NARRATION para true: a trilha faz ducking nas janelas abaixo.
// ---------------------------------------------------------------------------
const HAS_NARRATION = false;
const NARRATION_WINDOWS: [number, number][] = [
  [0.4, 4.2],
  [4.9, 13.5],
  [14.3, 19.4],
  [20.4, 27.6],
  [28.3, 33.7],
  [34.2, 37.8],
];
const MUSIC_VOL = 0.34;
const MUSIC_DUCKED = 0.12;

const musicVolume = (f: number) => {
  if (!HAS_NARRATION) return MUSIC_VOL;
  let duck = 0;
  for (const [a, b] of NARRATION_WINDOWS) {
    duck = Math.max(duck, ip(f, [s(a) - 6, s(a), s(b), s(b) + 8], [0, 1, 1, 0]));
  }
  return MUSIC_VOL - (MUSIC_VOL - MUSIC_DUCKED) * duck;
};

type Sfx = { f: number; file: string; vol: number };

const SFX: Sfx[] = (() => {
  const list: Sfx[] = [];
  const add = (f: number, file: string, vol = 0.6) => list.push({ f: Math.round(f), file, vol });
  // Cena 1
  add(0, "pop", 0.4);
  add(s(T.s1Lid), "whoosh", 0.45);
  add(s(T.s1Food), "pop", 0.5);
  for (let i = 0; i < 9; i++) add(s(T.s1IconsStart + i * T.s1IconsGap), "pop", 0.22);
  // transições
  add(SCENES.s1.to - TRANSITION, "whoosh", 0.35);
  add(SCENES.s2.to - TRANSITION, "whoosh", 0.35);
  add(SCENES.s4.to - TRANSITION, "whoosh", 0.35);
  add(SCENES.s5.to - TRANSITION, "whoosh", 0.35);
  add(WIPE.start, "whoosh", 0.6);
  // Cena 2
  for (let i = 0; i < 6; i++) add(s(T.s2RowsStart + i * T.s2RowGap) + 4, "pop", 0.45);
  add(s(T.s2Total), "tick", 0.5);
  add(SCENES.s2.from + S2_TOTAL_END, "thud", 0.55);
  add(SCENES.s2.from + S2_TOTAL_END, "chime", 0.4);
  // Cena 3
  add(s(T.s3Number) + 4, "thud", 0.6);
  add(s(T.s3Strike), "whoosh", 0.4);
  add(s(T.s3Pois), "thud", 0.6);
  // Cena 4
  for (let f = SCENES.s4.from + S4.typeStart; f < SCENES.s4.from + S4.typeEnd; f += 2) add(f, "key", 0.3);
  add(SCENES.s4.from + S4.click, "click", 0.7);
  add(SCENES.s4.from + S4.click + 2, "pop", 0.45);
  add(SCENES.s4.from + S4.answer, "pop", 0.45);
  add(SCENES.s4.from + S4.balcao, "tick", 0.45);
  add(SCENES.s4.from + S4.ifood, "tick", 0.45);
  add(SCENES.s4.from + S4_PUNCH, "chime", 0.4);
  // Cena 5
  for (const r of T.s5Rows) add(s(r), "pop", 0.45);
  add(s(T.s5BarStart), "rise", 0.45);
  add(s(T.s5BarEnd), "pop", 0.45);
  add(s(T.s5Total), "tick", 0.5);
  add(SCENES.s5.from + S5_TOTAL_END, "thud", 0.55);
  add(SCENES.s5.from + S5_TOTAL_END, "chime", 0.45);
  // Cena 6
  add(s(T.s6Logo), "pop", 0.5);
  add(s(T.s6Click), "click", 0.7);
  add(s(T.s6Click), "sparkle", 0.55);
  return list;
})();

const SoundTrack: React.FC = () => (
  <>
    <Audio src={staticFile("audio/music.wav")} volume={musicVolume} />
    {HAS_NARRATION ? <Audio src={staticFile("audio/narracao.mp3")} /> : null}
    {SFX.map((x, i) => (
      <Sequence key={i} from={x.f} durationInFrames={45} layout="none" name={`sfx ${x.file}`}>
        <Audio src={staticFile(`audio/${x.file}.wav`)} volume={x.vol} />
      </Sequence>
    ))}
  </>
);

/** Wipe circular abrindo do centro, com borda azul. */
const CircleWipe: React.FC<{ children: React.ReactNode; duration: number }> = ({
  children,
  duration,
}) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [0, duration], [0, 1], easeInOut);
  const r = p * 1150;
  const ringOpacity = ip(frame, [duration - 6, duration], [1, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: p >= 1 ? undefined : `circle(${r}px at 50% 50%)` }}>
        {children}
      </AbsoluteFill>
      {p < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - r - 9,
            top: 960 - r - 9,
            width: (r + 9) * 2,
            height: (r + 9) * 2,
            borderRadius: "50%",
            border: `18px solid ${C.blue}`,
            boxShadow: `0 0 50px rgba(56,189,248,.7), inset 0 0 30px rgba(56,189,248,.6)`,
            boxSizing: "border-box",
            opacity: ringOpacity,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const len = (k: keyof typeof SCENES) => SCENES[k].to - SCENES[k].from;

export const EP02Marmitaria: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Sequence from={SCENES.s1.from} durationInFrames={len("s1")} name="1 · Gancho">
        <Scene1Hook />
      </Sequence>
      <Sequence from={SCENES.s2.from} durationInFrames={len("s2")} name="2 · Custo">
        <Scene2Custo />
      </Sequence>
      <Sequence from={SCENES.s3.from} durationInFrames={len("s3")} name="3 · Erro">
        <Scene3Erro />
      </Sequence>
      <Sequence from={SCENES.s4.from} durationInFrames={len("s4")} name="4 · Preço (wipe)">
        <CircleWipe duration={WIPE.end - WIPE.start}>
          <Scene4Preco />
        </CircleWipe>
      </Sequence>
      <Sequence from={SCENES.s5.from} durationInFrames={len("s5")} name="5 · Sobra">
        <Scene5Sobra />
      </Sequence>
      <Sequence from={SCENES.s6.from} durationInFrames={len("s6")} name="6 · CTA">
        <Scene6CTA />
      </Sequence>
      <SoundTrack />
    </AbsoluteFill>
  );
};

export const EP02_DURATION = DURATION;
