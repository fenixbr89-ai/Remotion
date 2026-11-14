import React from "react";
import { interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { FALA, FPS, NARRACAO_ARQUIVO } from "./timeline";

/** A trilha abaixa enquanto a voz fala (rampas suaves de 5 frames). */
const trilhaVolume = (f: number, narracao: boolean) => {
  if (!narracao) return 0.6;
  const speaking = Math.max(
    0,
    ...FALA.map(([a, b]) =>
      interpolate(
        f,
        [a * FPS - 5, a * FPS, b * FPS, b * FPS + 5],
        [0, 1, 1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      ),
    ),
  );
  return interpolate(speaking, [0, 1], [0.55, 0.24]);
};

// Os efeitos sonoros ficam dentro de cada cena, colados às animações (<Sfx> e <Finger>).
export const Som: React.FC<{ readonly narracao: boolean }> = ({ narracao }) => (
  <>
    <Audio
      name="Trilha"
      src={staticFile("audio/trilha.mp3")}
      volume={(f) => trilhaVolume(f, narracao)}
    />
    {narracao ? (
      <Audio name="Narração" src={staticFile(NARRACAO_ARQUIVO)} />
    ) : null}
  </>
);
