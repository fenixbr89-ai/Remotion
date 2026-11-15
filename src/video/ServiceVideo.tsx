import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { clamp } from "../components/anim";
import { CircleWipe } from "../components/CircleWipe";
import { PaintStroke } from "../components/PaintStroke";
import { Scene } from "../scenes/Scene";
import { COLORS } from "../theme";
import type { ServiceSpec } from "../types";

const TRANSITION = { circle: 24, stroke: 30 };

const hasFile = (name?: string) =>
  Boolean(name) && getStaticFiles().some((f) => f.name === name);

/** Vídeo de serviço genérico: tudo vem do JSON */
export const ServiceVideo: React.FC<{ spec: ServiceSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const total = spec.durationInFrames;

  const starts: number[] = [];
  spec.scenes.reduce((acc, s) => {
    starts.push(acc);
    return acc + s.duration;
  }, 0);

  const fadeOut = interpolate(frame, [total - 15, total], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: COLORS.black }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {spec.scenes.map((scene, i) => (
          <Sequence key={scene.name} name={scene.name} from={starts[i]} durationInFrames={scene.duration}>
            <Scene scene={scene} index={i} />
          </Sequence>
        ))}
        {spec.scenes.map((scene, i) => {
          if (!scene.transition) return null;
          const d = TRANSITION[scene.transition.type];
          const cut = starts[i] + scene.duration;
          const color = scene.transition.color ?? COLORS.orange;
          return (
            <Sequence
              key={`t-${scene.name}`}
              name={`Transição ${scene.transition.type}`}
              from={cut - d / 2}
              durationInFrames={d}
            >
              {scene.transition.type === "circle" ? (
                <CircleWipe color={color} duration={d} />
              ) : (
                <PaintStroke color={color} duration={d} />
              )}
            </Sequence>
          );
        })}
      </AbsoluteFill>

      {hasFile(spec.music) ? (
        <Audio
          src={staticFile(spec.music!)}
          volume={(f) => interpolate(f, [0, 15, total - 15, total], [0, 0.3, 0.3, 0], clamp)}
        />
      ) : null}
      {hasFile(spec.voice) ? <Audio src={staticFile(spec.voice!)} /> : null}
    </AbsoluteFill>
  );
};
