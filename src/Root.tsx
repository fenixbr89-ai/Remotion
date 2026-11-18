import { Composition, Folder } from "remotion";
import { QuebraVideo } from "./quebra/QuebraVideo";
import { demo } from "./quebra/demo/scenes";
import { ceuAzul } from "./quebra/ceu-azul/scenes";
import { escovar } from "./quebra/escovar/scenes";
import { FPS, H, W } from "./quebra/theme";

// As cenas contêm funções (formas desenhadas), então não passam por props serializadas.
const Demo: React.FC = () => <QuebraVideo def={demo} />;
const CeuAzul: React.FC = () => <QuebraVideo def={ceuAzul} />;
const Escovar: React.FC = () => <QuebraVideo def={escovar} />;

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="QuebraPadrao">
      <Composition
        id="QP-Demo"
        component={Demo}
        durationInFrames={demo.durationInFrames}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="QP-CeuAzul"
        component={CeuAzul}
        durationInFrames={ceuAzul.durationInFrames}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="QP-Escovar" component={Escovar} durationInFrames={escovar.durationInFrames} fps={FPS} width={W} height={H} />
    </Folder>
  );
};
