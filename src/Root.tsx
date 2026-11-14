import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Comercial, comercialSchema, SCENES, TOTAL } from "./JulianoPinturas/Comercial";
import { S1Abertura } from "./JulianoPinturas/S1Abertura";
import { S2Servicos } from "./JulianoPinturas/S2Servicos";
import { S3MaisSolucoes } from "./JulianoPinturas/S3MaisSolucoes";
import { S4Diferencial } from "./JulianoPinturas/S4Diferencial";
import { S5Encerramento } from "./JulianoPinturas/S5Encerramento";

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
        <Composition id="Cena1-Abertura" component={S1Abertura} durationInFrames={SCENES.abertura} fps={30} width={1080} height={1920} />
        <Composition id="Cena2-Servicos" component={S2Servicos} durationInFrames={SCENES.servicos} fps={30} width={1080} height={1920} />
        <Composition id="Cena3-MaisSolucoes" component={S3MaisSolucoes} durationInFrames={SCENES.maisSolucoes} fps={30} width={1080} height={1920} />
        <Composition id="Cena4-Diferencial" component={S4Diferencial} durationInFrames={SCENES.diferencial} fps={30} width={1080} height={1920} />
        <Composition id="Cena5-Encerramento" component={S5Encerramento} durationInFrames={SCENES.encerramento} fps={30} width={1080} height={1920} />
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
