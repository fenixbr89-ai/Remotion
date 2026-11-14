import { Composition, Folder } from "remotion";
import { DURACAO, Episodio } from "./serie/Episodio";
import { negocioSchema } from "./serie/tipos";
import { acaiteria } from "./serie/negocios/acaiteria";

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
    </Folder>
  );
};
