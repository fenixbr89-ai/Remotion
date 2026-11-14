import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cinetico, Letras } from "../ui/Cinetico";
import { Icone } from "../ui/Icones";
import { cor, degrade, entra, flutua, fontFamily, suave } from "../tema";
import type { CenaProps } from "./props";

const POSICOES = [
  { left: 70, top: 330 },
  { right: 80, top: 380 },
  { left: 110, bottom: 380 },
  { right: 110, bottom: 340 },
];

export const Gancho: React.FC<CenaProps> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nome = n.nome.toUpperCase();
  const tamanhoNome = Math.min(150, Math.floor(1500 / nome.length));
  const inicioNome = 30;
  const fimNome = inicioNome + nome.length * 2 + 10;
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", scale: `${interpolate(f, [0, dur], [1, 1.05])}` }}>
      {n.iconesGancho.map((ic, i) => {
        const e = entra(f, fps, fimNome + i * 6, 9);
        return (
          <div key={ic} style={{ position: "absolute", ...POSICOES[i], scale: `${e}`, translate: `0 ${flutua(f, i * 1.7)}px`, opacity: e }}>
            <div style={{ width: 150, height: 150, borderRadius: 44, background: cor.branco, boxShadow: "0 20px 50px rgba(29,78,216,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icone nome={ic} tamanho={100} />
            </div>
          </div>
        );
      })}
      <Cinetico texto="O que eu faria se abrisse" inicio={4} intervalo={4} tamanho={100} alinhar="center" style={{ width: 900 }} />
      <div style={{ marginTop: 30, color: cor.textoSuave, fontSize: 60, fontWeight: 700, opacity: suave(f, 24, 34), translate: `0 ${(1 - suave(f, 24, 34)) * 20}px` }}>{n.artigo}</div>
      <Letras texto={nome} inicio={inicioNome} tamanho={tamanhoNome} />
      <div style={{ height: 16, width: 620, borderRadius: 99, backgroundImage: degrade, marginTop: 6, scale: `${suave(f, fimNome - 6, fimNome + 14)} 1` }} />
      <div style={{ marginTop: 70 }}>
        <Cinetico texto="Começando pelo *preço*." inicio={fimNome + 20} intervalo={4} tamanho={52} peso={700} corTexto={cor.textoSuave} alinhar="center" />
      </div>
    </AbsoluteFill>
  );
};
