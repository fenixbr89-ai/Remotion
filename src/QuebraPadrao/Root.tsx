import React from "react";
import { Composition, Folder, Still } from "remotion";
import { DURACAO_TOTAL, VideoTordesilhas } from "./video/VideoTordesilhas";
import { Estilo1Colagem } from "./estilos/Estilo1Colagem";
import { Estilo2Tipografia } from "./estilos/Estilo2Tipografia";
import { Estilo3Mapas } from "./estilos/Estilo3Mapas";
import { Estilo4Telejornal } from "./estilos/Estilo4Telejornal";
import { Estilo5Geometrico } from "./estilos/Estilo5Geometrico";

export const QuebraPadraoEstilos: React.FC = () => (
  <Folder name="QuebraPadrao-Estilos">
    <Still id="QP-Estilo1-Colagem" component={Estilo1Colagem} width={1920} height={1080} />
    <Still id="QP-Estilo2-Tipografia" component={Estilo2Tipografia} width={1920} height={1080} />
    <Still id="QP-Estilo3-Mapas" component={Estilo3Mapas} width={1920} height={1080} />
    <Still id="QP-Estilo4-Telejornal" component={Estilo4Telejornal} width={1920} height={1080} />
    <Still id="QP-Estilo5-Geometrico" component={Estilo5Geometrico} width={1920} height={1080} />
    <Composition
      id="QP-Video-Tordesilhas"
      component={VideoTordesilhas}
      durationInFrames={DURACAO_TOTAL}
      fps={30}
      width={1080}
      height={1920}
    />
  </Folder>
);
