import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import {
  Comercial,
  comercialSchema,
  SCENES,
  TOTAL,
} from "./JulianoPinturas/Comercial";
import { Abertura } from "./JulianoPinturas/Abertura";
import { Servicos } from "./JulianoPinturas/Servicos";
import { Encerramento } from "./JulianoPinturas/Encerramento";
import {
  StoryboardFrame,
  storyboardSchema,
} from "./JulianoPinturas/Storyboard";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JulianoPinturas"
        component={Comercial}
        schema={comercialSchema}
        durationInFrames={TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ narracao: "", volumeTrilha: 0.9 }}
      />
      <Folder name="JulianoPinturas-Cenas">
        <Composition
          id="Abertura"
          component={Abertura}
          durationInFrames={SCENES.abertura}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Servicos"
          component={Servicos}
          durationInFrames={SCENES.servicos}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Encerramento"
          component={Encerramento}
          durationInFrames={SCENES.encerramento}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Storyboard"
          component={StoryboardFrame}
          schema={storyboardSchema}
          durationInFrames={61}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ quadro: "final-1" }}
        />
      </Folder>
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
