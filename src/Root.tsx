import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Wayfluency } from "./Wayfluency/Wayfluency";
import { MotionAd } from "./MotionAd/MotionAd";
import { Motion50, M50_TOTAL } from "./Motion50/Motion50";
import { TOTAL as MA_TOTAL } from "./MotionAd/theme";
import { F, TOTAL_SEC } from "./Wayfluency/theme";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Motion50"
        component={Motion50}
        durationInFrames={F(M50_TOTAL)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MotionAd"
        component={MotionAd}
        durationInFrames={F(MA_TOTAL)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Wayfluency"
        component={Wayfluency}
        durationInFrames={F(TOTAL_SEC)}
        fps={30}
        width={1080}
        height={1920}
      />
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
