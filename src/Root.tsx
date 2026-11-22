import { Composition, Folder } from "remotion";
import { ImplanteVideo } from "./Implante/ImplanteVideo";
import { SCENES } from "./Implante/scenes/Scenes";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ImplanteDentario"
        component={ImplanteVideo}
        durationInFrames={SCENES.length * 90}
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
