import React from "react";
import { Series } from "remotion";
import {
  Abertura,
  Achei,
  Chamada,
  Desenvolvendo,
  FraseMidia,
  Google,
  Sorteio,
  Vitrine,
} from "./Cenas";

import type { CriandoSitesProps } from "./schema";

// Duração de cada cena em frames (30 fps)
export const T = {
  abertura: 75,
  sorteio: 120,
  categoria: 45,
  vouAtras: 60,
  achei: 75,
  google: 105,
  pesquisa: 60,
  desenvolvendo: 80,
  resultado: 55,
  porSecao: 85,
  chamada: 160,
};
export const DURACAO_TOTAL =
  T.abertura +
  T.sorteio +
  T.categoria +
  T.vouAtras +
  T.achei +
  T.google +
  T.pesquisa +
  T.desenvolvendo +
  T.resultado +
  T.porSecao * 4 +
  T.chamada;

export const CriandoSites: React.FC<CriandoSitesProps> = (p) => {
  const cat = p.categoria.toLowerCase();
  const artigo = /a$|ia$/.test(cat) ? "uma" : "um";
  return (
    <Series>
      <Series.Sequence name="Abertura" durationInFrames={T.abertura}>
        <Abertura p={p} />
      </Series.Sequence>
      <Series.Sequence name="Sorteio" durationInFrames={T.sorteio}>
        <Sorteio p={p} duracao={T.sorteio} />
      </Series.Sequence>
      <Series.Sequence name="Categoria" durationInFrames={T.categoria}>
        <FraseMidia texto={`*${p.categoria}*`} tamanho={110} midia={p.midias.categoria} emoji="💈" />
      </Series.Sequence>
      <Series.Sequence name="Vou atrás" durationInFrames={T.vouAtras}>
        <FraseMidia
          texto={`agora vou atrás\nde ${artigo} *${cat}*`}
          midia={p.midias.vouAtras}
          emoji="🕵️"
        />
      </Series.Sequence>
      <Series.Sequence name="Achei" durationInFrames={T.achei}>
        <Achei p={p} />
      </Series.Sequence>
      <Series.Sequence name="Google" durationInFrames={T.google}>
        <Google p={p} />
      </Series.Sequence>
      <Series.Sequence name="Pesquisa" durationInFrames={T.pesquisa}>
        <FraseMidia
          texto={"depois de pesquisar\num pouco mais\nsobre eles"}
          tamanho={84}
          midia={p.midias.pesquisa}
          emoji="🧐"
        />
      </Series.Sequence>
      <Series.Sequence name="Desenvolvendo" durationInFrames={T.desenvolvendo}>
        <Desenvolvendo />
      </Series.Sequence>
      <Series.Sequence name="Resultado" durationInFrames={T.resultado}>
        <FraseMidia
          texto={"e depois de\ndesenvolver\n*o resultado foi esse*"}
          tamanho={88}
          cor="#7a7a7a"
          midia={p.midias.resultado}
          emoji="👇"
        />
      </Series.Sequence>
      <Series.Sequence name="Vitrine do site" durationInFrames={T.porSecao * 4}>
        <Vitrine p={p} porSecao={T.porSecao} />
      </Series.Sequence>
      <Series.Sequence name="Chamada" durationInFrames={T.chamada}>
        <Chamada p={p} />
      </Series.Sequence>
    </Series>
  );
};

