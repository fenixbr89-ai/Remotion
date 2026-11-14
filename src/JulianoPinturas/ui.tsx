import React from "react";
import {
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { C, CLAMP, EASE, ORANGE_GRADIENT, SANS } from "./theme";

/** Texto que entra com fade + desfoque + leve subida (padrão Apple). */
export const Text: React.FC<{
  children: React.ReactNode;
  size: number;
  weight?: number;
  color?: string;
  gradient?: boolean;
  delay?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  size,
  weight = 700,
  color = C.white,
  gradient = false,
  delay = 0,
  dur = 14,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: size > 80 ? "-0.045em" : "-0.015em",
        lineHeight: 1.05,
        textAlign: "center",
        color,
        opacity: p,
        translate: `0 ${(1 - p) * size * 0.35}px`,
        filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
        ...(gradient
          ? {
              backgroundImage: ORANGE_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Objeto em destaque: centralizado, com sombra de contato e um giro 3D sutil e contínuo. */
export const Hero: React.FC<{
  src: string;
  width: number;
  y: number;
  delay?: number;
  dark?: boolean;
}> = ({ src, width, y, delay = 0, dark = false }) => {
  const frame = useCurrentFrame();
  const f = frame - delay;
  const p = interpolate(f, [0, 22], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - width / 2,
        top: y,
        width,
        translate: "0 -50%",
        perspective: 1600,
        opacity: p,
      }}
    >
      {/* sombra de contato (só no fundo claro) */}
      {dark ? null : (
        <div
          style={{
            position: "absolute",
            left: "15%",
            right: "15%",
            bottom: -40,
            height: 60,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.16)",
            filter: "blur(28px)",
          }}
        />
      )}
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          scale: String(
            (0.86 + 0.14 * p) * interpolate(f, [0, 60], [1, 1.04], CLAMP),
          ),
          rotate: `y ${-14 * (1 - p) + f * 0.12}deg`,
          translate: `0 ${(1 - p) * 60}px`,
        }}
      />
    </div>
  );
};

export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({
  at,
  src,
  volume = 0.35,
}) => (
  <Sequence from={at} layout="none" name={`SFX ${src}`}>
    <Audio src={staticFile(`audio/${src}`)} volume={volume} />
  </Sequence>
);
