import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { PixoraVideo } from "./pixora/PixoraVideo";
import { DUR, FPS, HEIGHT, TOTAL, WIDTH } from "./pixora/timeline";
import { Cena01Gancho } from "./pixora/scenes/Cena01Gancho";
import { Cena02Problema } from "./pixora/scenes/Cena02Problema";
import { Cena03Virada } from "./pixora/scenes/Cena03Virada";
import { Cena04Apresentacao } from "./pixora/scenes/Cena04Apresentacao";
import { Cena05Estilos } from "./pixora/scenes/Cena05Estilos";
import { Cena06Diferencial1 } from "./pixora/scenes/Cena06Diferencial1";
import { Cena07Diferencial2 } from "./pixora/scenes/Cena07Diferencial2";
import { Cena08ProvaSocial } from "./pixora/scenes/Cena08ProvaSocial";
import { Cena09Beneficios } from "./pixora/scenes/Cena09Beneficios";
import { Cena10Chamada } from "./pixora/scenes/Cena10Chamada";
import { Cena11Logo } from "./pixora/scenes/Cena11Logo";

const V = { fps: FPS, width: WIDTH, height: HEIGHT } as const;

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Pixora"
        component={PixoraVideo}
        durationInFrames={TOTAL}
        {...V}
        defaultProps={{ narracao: false, legendas: false }}
      />
      <Folder name="Pixora-Cenas">
        <Composition id="Cena01-Gancho" component={Cena01Gancho} durationInFrames={DUR.c01} {...V} />
        <Composition id="Cena02-Problema" component={Cena02Problema} durationInFrames={DUR.c02} {...V} />
        <Composition id="Cena03-Virada" component={Cena03Virada} durationInFrames={DUR.c03} {...V} />
        <Composition id="Cena04-Apresentacao" component={Cena04Apresentacao} durationInFrames={DUR.c04} {...V} />
        <Composition id="Cena05-Estilos" component={Cena05Estilos} durationInFrames={DUR.c05} {...V} />
        <Composition id="Cena06-Diferencial1" component={Cena06Diferencial1} durationInFrames={DUR.c06} {...V} />
        <Composition id="Cena07-Diferencial2" component={Cena07Diferencial2} durationInFrames={DUR.c07} {...V} />
        <Composition id="Cena08-ProvaSocial" component={Cena08ProvaSocial} durationInFrames={DUR.c08} {...V} />
        <Composition id="Cena09-Beneficios" component={Cena09Beneficios} durationInFrames={DUR.c09} {...V} />
        <Composition id="Cena10-Chamada" component={Cena10Chamada} durationInFrames={DUR.c10} {...V} />
        <Composition id="Cena11-Logo" component={Cena11Logo} durationInFrames={DUR.c11} {...V} />
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
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />
    </>
  );
};
