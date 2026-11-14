import React from "react";
import { AbsoluteFill, Series, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { z } from "zod";
import { S1Abertura } from "./S1Abertura";
import { S2Servicos } from "./S2Servicos";
import { S3MaisSolucoes } from "./S3MaisSolucoes";
import { S4Diferencial } from "./S4Diferencial";
import { S5Encerramento } from "./S5Encerramento";
import { C } from "./theme";

export const comercialSchema = z.object({
  /** Arquivo de narração em public/ (ex.: "audio/narracao.mp3"). Vazio = sem narração. */
  narracao: z.string(),
  volumeTrilha: z.number().min(0).max(1),
});

export type ComercialProps = z.infer<typeof comercialSchema>;

// Duração de cada cena (30 fps, 120 BPM => cortes no grid de 15 frames)
export const SCENES = {
  abertura: 240, // 0–8s
  servicos: 510, // 8–25s
  maisSolucoes: 570, // 25–44s
  diferencial: 240, // 44–52s
  encerramento: 240, // 52–60s
};
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);

export const Comercial: React.FC<ComercialProps> = ({ narracao, volumeTrilha }) => {
  // Com narração, a trilha abaixa para manter a voz em primeiro plano
  const musica = narracao ? volumeTrilha * 0.35 : volumeTrilha;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Series>
        <Series.Sequence name="Cena 1 · Abertura" durationInFrames={240}>
          <S1Abertura />
        </Series.Sequence>
        <Series.Sequence name="Cena 2 · Serviços" durationInFrames={510}>
          <S2Servicos />
        </Series.Sequence>
        <Series.Sequence name="Cena 3 · Mais soluções" durationInFrames={570}>
          <S3MaisSolucoes />
        </Series.Sequence>
        <Series.Sequence name="Cena 4 · Diferencial" durationInFrames={240}>
          <S4Diferencial />
        </Series.Sequence>
        <Series.Sequence name="Cena 5 · Encerramento" durationInFrames={240}>
          <S5Encerramento />
        </Series.Sequence>
      </Series>
      <Audio src={staticFile("audio/trilha.mp3")} volume={musica} />
      {narracao ? <Audio src={staticFile(narracao)} volume={1} /> : null}
    </AbsoluteFill>
  );
};
