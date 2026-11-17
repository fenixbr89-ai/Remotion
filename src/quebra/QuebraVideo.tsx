import React, { useMemo } from "react";
import type { VideoDef } from "./timing";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Legendas } from "./Legendas";
import { Overlays } from "./Overlays";
import { FieldScene, ParticleField, glowAt, useShapes } from "./ParticleField";
import { resolveScenes, Scene } from "./timing";
import { ACCENT_RED, BASE, BG, BG_TOP, DETAIL_BLUE, DETAIL_YELLOW, GOOD_GREEN } from "./theme";

const PALETTE = { base: BASE, accent: ACCENT_RED, good: GOOD_GREEN, blue: DETAIL_BLUE, yellow: DETAIL_YELLOW };

const PAN: Record<NonNullable<Scene["pan"]>, [number, number]> = {
  left: [-36, 0],
  right: [36, 0],
  up: [0, -36],
  down: [0, 36],
};

export const QuebraVideo: React.FC<{ def: VideoDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const count = def.count ?? 12000;
  const resolved = useMemo(() => resolveScenes(def.scenes, def.words), [def]);
  const field: FieldScene[] = useMemo(
    () => resolved.map((s) => ({ from: s.from, shape: s.shape, theme: s.theme ?? def.theme })),
    [resolved, def.theme],
  );
  const shapes = useShapes(field, count);
  if (!shapes) return <AbsoluteFill style={{ background: BG }} />;

  const g = glowAt(field, shapes, frame);
  const cur = resolved[g.index];
  const next = resolved[g.index + 1];
  const end = next ? next.from : def.durationInFrames;
  const k = interpolate(frame, [cur.from, end], [0, 1], { extrapolateRight: "clamp" });
  // câmera contínua: parte de onde a cena anterior terminou e converge durante o morph
  const prev = resolved[g.index - 1];
  const [ppx, ppy] = prev?.pan ? PAN[prev.pan] : [0, 0];
  const [cpx, cpy] = cur.pan ? PAN[cur.pan] : [0, 0];
  const b = prev ? interpolate(frame, [cur.from, cur.from + 0.85 * 60], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 1;
  const mix = (a: number, c: number) => a + (c - a) * b;
  const zoom = mix(prev ? 1.03 : 1, 1 + 0.03 * k);
  const tx = mix(ppx, cpx * k);
  const ty = mix(ppy, cpy * k);
  const theme = cur.theme ?? def.theme;
  const colors = { ...PALETTE, theme };
  // brilho radial: bem sutil quando o tema é branco (padrão preto e branco)
  const [ga, gb] = theme === BASE ? ["1C", "08"] : ["3A", "14"];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG} 55%, ${BG_TOP} 100%)` }}>
      {/* brilho radial atrás do objeto principal */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 620px at ${g.x}px ${g.y}px, ${theme}${ga} 0%, ${theme}${gb} 45%, transparent 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
          transformOrigin: `${g.x}px ${g.y}px`,
        }}
      >
        <ParticleField scenes={field} shapes={shapes} count={count} palette={PALETTE} />
        {resolved.map((s, i) =>
          s.overlays?.length ? (
            <Overlays
              key={i}
              items={s.overlays}
              from={s.from}
              to={resolved[i + 1]?.from ?? def.durationInFrames}
              colors={colors}
            />
          ) : null,
        )}
      </AbsoluteFill>
      {/* vinheta */}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, transparent 55%, rgba(0,0,0,0.85) 100%)" }}
      />
      <Legendas words={def.words} />
      {def.audio ? <Audio src={staticFile(def.audio)} /> : null}
    </AbsoluteFill>
  );
};

export type { Scene, VideoDef } from "./timing";
export { durationFor } from "./timing";
