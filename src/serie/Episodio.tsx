import { AbsoluteFill, Series } from "remotion";
import { calcular } from "./calc";
import type { Negocio } from "./tipos";
import { Fundo } from "./ui/Fundo";
import { Moldura } from "./ui/Moldura";
import { Gancho } from "./cenas/Gancho";
import { Cardapio } from "./cenas/Cardapio";
import { Custos } from "./cenas/Custos";
import { Erro } from "./cenas/Erro";
import { Conta } from "./cenas/Conta";
import { Mes } from "./cenas/Mes";
import { Chamada } from "./cenas/Chamada";
import type { CenaProps } from "./cenas/props";

export const CENAS: { nome: string; dur: number; C: React.FC<CenaProps> }[] = [
  { nome: "Gancho", dur: 150, C: Gancho },
  { nome: "Cardápio", dur: 210, C: Cardapio },
  { nome: "Custos", dur: 480, C: Custos },
  { nome: "Erro comum", dur: 300, C: Erro },
  { nome: "Conta certa", dur: 300, C: Conta },
  { nome: "Mês", dur: 210, C: Mes },
  { nome: "Chamada", dur: 210, C: Chamada },
];

export const DURACAO = CENAS.reduce((s, c) => s + c.dur, 0);

export const Episodio: React.FC<Negocio> = (n) => {
  const k = calcular(n);
  return (
    <AbsoluteFill>
      <Fundo destaque={n.corDestaque} />
      <Series>
        {CENAS.map(({ nome, dur, C }) => (
          <Series.Sequence key={nome} name={nome} durationInFrames={dur}>
            <C n={n} k={k} dur={dur} />
          </Series.Sequence>
        ))}
      </Series>
      <Moldura episodio={n.episodio} destaque={n.corDestaque} />
    </AbsoluteFill>
  );
};
