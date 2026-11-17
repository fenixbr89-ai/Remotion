import { Composition, Folder } from "remotion";
import { DURACAO, Episodio } from "./serie/Episodio";
import { negocioSchema } from "./serie/tipos";
import { acaiteria } from "./serie/negocios/acaiteria";
import { EP02Marmitaria } from "./serie/ep02/EP02Marmitaria";
import { EstiloA, EstiloB, EstiloC } from "./serie/ep02/Estilos";
import { M1Gancho, M2Custo, M3Prejuizo, M4PrecoCerto, M5Cta } from "./serie/ep02/Manchete";
import { DURACAO as DURACAO_EP02 } from "./serie/ep02/geo";

// Série "O que eu faria se abrisse uma…" — um <Composition> por episódio.
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Serie-O-que-eu-faria">
      <Composition
        id="EP01-Acaiteria"
        component={Episodio}
        schema={negocioSchema}
        durationInFrames={DURACAO}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={acaiteria}
      />
      <Composition id="EstiloA" component={EstiloA} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="EstiloB" component={EstiloB} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="EstiloC" component={EstiloC} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="M1Gancho" component={M1Gancho} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="M2Custo" component={M2Custo} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="M3Prejuizo" component={M3Prejuizo} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="M4PrecoCerto" component={M4PrecoCerto} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="M5Cta" component={M5Cta} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="EP02Marmitaria" component={EP02Marmitaria} durationInFrames={DURACAO_EP02} fps={30} width={1080} height={1920} />
    </Folder>
  );
};
