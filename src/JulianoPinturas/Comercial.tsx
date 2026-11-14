import React from "react";
import { AbsoluteFill, Series, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { z } from "zod";
import { Abertura } from "./Abertura";
import { Encerramento } from "./Encerramento";
import { Servicos } from "./Servicos";
import { C } from "./theme";

export const comercialSchema = z.object({
  /** Arquivo de narração em public/ (ex.: "audio/narracao.mp3"). Vazio = sem narração. */
  narracao: z.string(),
  volumeTrilha: z.number().min(0).max(1),
});

export type ComercialProps = z.infer<typeof comercialSchema>;

// 30 fps, 120 BPM => cortes no grid de 15 frames
export const SCENES = {
  abertura: 180, // 0–6s
  servicos: 390, // 6–19s
  encerramento: 330, // 19–30s
};
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

export const Comercial: React.FC<ComercialProps> = ({
  narracao,
  volumeTrilha,
}) => {
  // Com narração, a trilha abaixa para manter a voz em primeiro plano
  const musica = narracao ? volumeTrilha * 0.35 : volumeTrilha;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Series>
        <Series.Sequence name="Abertura" durationInFrames={180}>
          <Abertura />
        </Series.Sequence>
        <Series.Sequence name="Serviços" durationInFrames={390}>
          <Servicos />
        </Series.Sequence>
        <Series.Sequence name="Encerramento" durationInFrames={330}>
          <Encerramento />
        </Series.Sequence>
      </Series>
      <Audio src={staticFile("audio/trilha.mp3")} volume={musica} />
      {narracao ? <Audio src={staticFile(narracao)} volume={1} /> : null}
    </AbsoluteFill>
  );
};
