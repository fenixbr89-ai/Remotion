import { Composition } from "remotion";
import { FPS, Pixora, TOTAL_FRAMES } from "./Pixora";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Pixora"
      component={Pixora}
      durationInFrames={TOTAL_FRAMES} // 1590 = 53s × 30fps
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
