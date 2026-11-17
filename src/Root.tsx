import { Composition } from "remotion";
import { DURATION, FPS, HEIGHT, WIDTH } from "./ep02/constants";
import { EP02Marmitaria } from "./ep02/EP02Marmitaria";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="EP02Marmitaria"
      component={EP02Marmitaria}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
