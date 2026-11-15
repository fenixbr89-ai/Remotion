import { Composition } from "remotion";
import { ServiceVideo } from "./video/ServiceVideo";
import type { ServiceSpec } from "./types";
import pintura from "./services/pintura.json";

const pinturaSpec = pintura as ServiceSpec;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Pintura"
        component={ServiceVideo}
        durationInFrames={pinturaSpec.durationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ spec: pinturaSpec }}
      />
    </>
  );
};
