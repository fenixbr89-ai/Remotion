import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Atmosphere, Display, fitSize, Index, Kicker, Reveal, Shot } from "./components";
import { C, CLAMP } from "./theme";

type Bg = "black" | "white" | "orange";

export const palette = (bg: Bg) => {
  if (bg === "black") return { bg: C.black, fg: C.white, hi: C.orange, kick: C.orange, idx: C.grey };
  if (bg === "white") return { bg: C.white, fg: C.black, hi: C.orange, kick: C.orange, idx: "#9A9A9A" };
  return { bg: C.orange, fg: C.black, hi: C.white, kick: C.black, idx: "rgba(0,0,0,0.5)" };
};

/**
 * Layout padrão de um serviço: visual animado na metade de cima,
 * tipografia cinética embaixo, índice no canto.
 */
export const ServiceShot: React.FC<{
  dur: number;
  bg: Bg;
  kicker: string;
  title: string[];
  /** index of the title line rendered in the highlight color */
  hi?: number;
  n?: string;
  enter?: "left" | "right" | "up" | "down" | "zoom" | "cut";
  exit?: "left" | "right" | "up" | "down" | "zoom" | "cut";
  visual: React.ReactNode;
}> = ({ dur, bg, kicker, title, hi = title.length - 1, n, enter = "right", exit = "cut", visual }) => {
  const pal = palette(bg);
  const frame = useCurrentFrame();
  const size = Math.min(...title.map((t) => fitSize(t, 900, 190)));
  return (
    <Shot dur={dur} bg={pal.bg} enter={enter} exit={exit}>
      {bg === "black" ? <Atmosphere y={35} /> : null}
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, dur], [1, 1.06])),
        }}
      >
        {visual}
      </AbsoluteFill>
      {n ? <Index n={n} color={pal.idx} /> : null}
      <div style={{ position: "absolute", left: 90, right: 90, top: 1250 }}>
        <Kicker color={pal.kick} delay={3}>
          {kicker}
        </Kicker>
        <div style={{ height: 24 }} />
        {title.map((t, i) => (
          <Reveal key={t} delay={4 + i * 3}>
            <Display size={size} color={i === hi ? pal.hi : pal.fg}>
              {t}
            </Display>
          </Reveal>
        ))}
      </div>
    </Shot>
  );
};

/** Deterministic particle burst (paint spray, dust, splashes). */
export const Particles: React.FC<{
  x: number;
  y: number;
  count?: number;
  color: string;
  start?: number;
  spread?: number;
  angle?: number;
  cone?: number;
  speed?: number;
  size?: number;
  seed?: string;
  life?: number;
}> = ({
  x,
  y,
  count = 40,
  color,
  start = 0,
  angle = 0,
  cone = Math.PI * 2,
  speed = 22,
  size = 14,
  seed = "p",
  life = 26,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const born = start + random(`${seed}b${i}`) * 10;
        const t = frame - born;
        if (t < 0 || t > life) return null;
        const a = angle + (random(`${seed}a${i}`) - 0.5) * cone;
        const v = speed * (0.4 + random(`${seed}v${i}`));
        const d = v * t * (1 - t / (life * 2.2));
        const s = size * (0.4 + random(`${seed}s${i}`));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d,
              top: y + Math.sin(a) * d + t * t * 0.15,
              width: s,
              height: s,
              borderRadius: "50%",
              background: color,
              opacity: interpolate(t, [0, life * 0.6, life], [1, 1, 0], CLAMP),
            }}
          />
        );
      })}
    </>
  );
};
