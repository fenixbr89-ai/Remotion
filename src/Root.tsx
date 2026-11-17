import { Composition } from "remotion";
import { DURACAO_TOTAL, OfertasVideo } from "./Ofertas/OfertasVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OfertasMariana"
      component={OfertasVideo}
      durationInFrames={DURACAO_TOTAL}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
