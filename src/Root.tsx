import { Composition, Folder } from "remotion";
import { CuriosidadesVideo, SceneOnly } from "./Curiosidades/CuriosidadesVideo";
import { SCENES, sceneFrames, totalFrames } from "./Curiosidades/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
