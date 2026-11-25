import { Composition } from "remotion";
import { RyvoComercial, totalShotFrames } from "./ryvo/RyvoComercial";
import { FPS, H, W } from "./ryvo/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RyvoClaro"
        component={RyvoComercial}
        durationInFrames={totalShotFrames()}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ tema: "claro" as const }}
      />
    </>
  );
};
