import { Composition, Folder } from "remotion";
import { Cena01Abertura } from "./Comercial/Cena01Abertura";
import { Cena02Pintura } from "./Comercial/Cena02Pintura";
import { Cena03Telhados } from "./Comercial/Cena03Telhados";
import { Cena04Instalacoes } from "./Comercial/Cena04Instalacoes";
import { Cena05Versatilidade } from "./Comercial/Cena05Versatilidade";
import { Cena06Logo } from "./Comercial/Cena06Logo";
import { Comercial, DURACAO_TOTAL } from "./Comercial/Comercial";

const base = { fps: 30, width: 1920, height: 1080 } as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JulianoPinturas"
        component={Comercial}
        durationInFrames={DURACAO_TOTAL}
        {...base}
      />
      <Folder name="Cenas">
        <Composition
          id="Cena01-Abertura"
          component={Cena01Abertura}
          durationInFrames={160}
          {...base}
        />
        <Composition
          id="Cena02-Pintura"
          component={Cena02Pintura}
          durationInFrames={230}
          {...base}
        />
        <Composition
          id="Cena03-Telhados"
          component={Cena03Telhados}
          durationInFrames={260}
          {...base}
        />
        <Composition
          id="Cena04-Instalacoes"
          component={Cena04Instalacoes}
          durationInFrames={290}
          {...base}
        />
        <Composition
          id="Cena05-Versatilidade"
          component={Cena05Versatilidade}
          durationInFrames={260}
          {...base}
        />
        <Composition
          id="Cena06-Logo"
          component={Cena06Logo}
          durationInFrames={250}
          {...base}
        />
      </Folder>
    </>
  );
};
