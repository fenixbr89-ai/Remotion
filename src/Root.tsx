import { Composition } from "remotion";
import { RyvoComercial } from "./ryvo/RyvoComercial";
import { FPS, H, W, totalFrames } from "./ryvo/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="RyvoComercial"
      component={RyvoComercial}
      durationInFrames={totalFrames()}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
