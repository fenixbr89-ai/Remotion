import { Composition, Folder } from "remotion";
import { CuriosidadesVideo } from "./Curiosidades/CuriosidadesVideo";
import { SCENES } from "./Curiosidades/scenes/Scenes";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OssoSemDente"
        component={CuriosidadesVideo}
        durationInFrames={SCENES.reduce((t, s) => t + Math.round(s.sec * 30), 0)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Cenas">
        {SCENES.map(({ id, C }) => (
          <Composition key={id} id={id} component={C} durationInFrames={90} fps={30} width={1080} height={1920} />
        ))}
      </Folder>
    </>
  );
};
