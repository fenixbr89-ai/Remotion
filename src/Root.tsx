import { Composition, Folder } from "remotion";
import { QuebraVideo } from "./quebra/QuebraVideo";
import { demo } from "./quebra/demo/scenes";
import { FPS, H, W } from "./quebra/theme";

// As cenas contêm funções (formas desenhadas), então não passam por props serializadas.
const Demo: React.FC = () => <QuebraVideo def={demo} />;

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
    </Folder>
  );
};
