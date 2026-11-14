import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, entra, fontFamily, suave, textoDegrade } from "../tema";
import { Cinetico } from "./Cinetico";

export type Linha = {
  texto: string;
  em: number;
  tamanho?: number;
  peso?: number;
  corTexto?: string;
  /** "sobe": palavra a palavra; "slam": a linha inteira chega grande e assenta com impacto */
  efeito?: "sobe" | "slam";
  /** preenche com o degradê azul (só no slam) */
  degrade?: boolean;
  /** frame em que um risco vermelho atravessa a linha */
  risca?: number;
  tom?: "azul" | "vermelho";
};

/** Batida de tipografia cinética no centro da tela: linhas que entram em sequência rápida. */
export const Batida: React.FC<{ linhas: Linha[]; gap?: number; style?: React.CSSProperties }> = ({ linhas, gap = 10, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap, fontFamily, ...style }}>
      {linhas.map((l, i) => {
        const tam = l.tamanho ?? 64;
        const conteudo =
          l.efeito === "slam" ? (
            (() => {
              const e = entra(f, fps, l.em, 9);
              return (
                <div
                  style={{
                    fontSize: tam,
                    fontWeight: l.peso ?? 800,
                    letterSpacing: -tam * 0.035,
                    lineHeight: 1.02,
                    color: l.corTexto ?? cor.texto,
                    ...(l.degrade ? textoDegrade : {}),
                    opacity: Math.min(1, e * 3),
                    scale: `${interpolate(e, [0, 1], [2.2, 1])}`,
                    filter: `blur(${Math.max(0, 1 - e * 1.4) * 14}px)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {l.texto}
                </div>
              );
            })()
          ) : (
            <Cinetico texto={l.texto} inicio={l.em} intervalo={2} tamanho={tam} peso={l.peso ?? 800} corTexto={l.corTexto} alinhar="center" tom={l.tom} />
          );
        return (
          <div key={i} style={{ position: "relative", display: f >= l.em - 1 ? "block" : "none" }}>
            {conteudo}
            {l.risca !== undefined && (
              <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: Math.max(8, tam * 0.09), borderRadius: 99, background: cor.vermelho, scale: `${suave(f, l.risca, l.risca + 8)} 1`, transformOrigin: "left center" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};
