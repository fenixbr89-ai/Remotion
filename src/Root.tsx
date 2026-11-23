import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { KronicVPS, SCENES, TOTAL_DURATION } from "./Kronic/KronicVPS";
import { FPS, H, W } from "./Kronic/theme";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        id="KronicVPS"
        component={KronicVPS}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={W}
        height={H}
      />
      <Folder name="KronicVPS-Scenes">
        {SCENES.map((s) => (
          <Composition
            key={s.id}
            id={s.id}
            component={s.component}
            durationInFrames={s.durationInFrames}
            fps={FPS}
            width={W}
            height={H}
          />
        ))}
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

    </>
  );
};
