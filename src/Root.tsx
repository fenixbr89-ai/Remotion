import { Composition, Folder } from "remotion";
import { EscuroScene, SPECS } from "./Escuro/Scenes";
import { NARRATION_SECONDS, NarradoVideo } from "./Narrado/NarradoVideo";
import { EscuroVideo, escuroTotal } from "./Escuro/EscuroVideo";
import { CuriosidadesVideo, SceneOnly } from "./Curiosidades/CuriosidadesVideo";
import { SCENES, sceneFrames, totalFrames } from "./Curiosidades/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="ImplanteNarrado" component={NarradoVideo} durationInFrames={Math.ceil(NARRATION_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="QuandoODenteCai" component={EscuroVideo} durationInFrames={escuroTotal(30)} fps={30} width={1080} height={1920} />
      <Folder name="Escuro-Cenas">
        {SPECS.map((s, i) => (
          <Composition key={s.id} id={s.id} component={EscuroScene} defaultProps={{ index: i, still: 0.85 }} durationInFrames={Math.round(s.sec * 30)} fps={30} width={1080} height={1920} />
        ))}
      </Folder>
      <Composition
        id="OssoSemDente"
        component={CuriosidadesVideo}
        durationInFrames={totalFrames(30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Cenas">
        {SCENES.map((s, i) => (
          <Composition
            key={s.id}
            id={s.id}
            component={SceneOnly}
            defaultProps={{ index: i }}
            durationInFrames={sceneFrames(s, 30)}
            fps={30}
            width={1080}
            height={1920}
          />
        ))}
      </Folder>
    </>
  );
};
