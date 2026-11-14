import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cor, suave } from "../tema";
import { Cinetico } from "./Cinetico";

export type Frase = {
  /** frame (da cena) em que a frase começa */
  em: number;
  /** linha principal — *palavras* ganham destaque */
  l1: string;
  /** linha de apoio, menor */
  l2?: string;
  tom?: "azul" | "vermelho";
  /** frame em que a frase sai, se nenhuma outra entrar antes */
  ate?: number;
};

const INTERVALO = 2.5;

/**
 * Legenda narrada no topo, estilo Reels: as palavras surgem uma a uma, como se fossem faladas.
 * Quando a próxima frase chega, a anterior sobe e desfoca.
 */
export const Legenda: React.FC<{ frases: Frase[]; claro?: boolean; topo?: number }> = ({ frases, claro = false, topo = 250 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {frases.map((fr, i) => {
        const prox = Math.min(frases[i + 1]?.em ?? Infinity, fr.ate ?? Infinity);
        if (f < fr.em - 1 || f > prox + 4) return null;
        const saida = Number.isFinite(prox) ? suave(f, prox - 8, prox + 2) : 0;
        const palavras1 = fr.l1.split(" ").length;
        return (
          <div
            key={fr.em}
            style={{
              position: "absolute",
              top: topo,
              left: 70,
              right: 70,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              opacity: 1 - saida,
              translate: `0 ${-saida * 60}px`,
              filter: `blur(${saida * 10}px)`,
            }}
          >
            <Cinetico texto={fr.l1} inicio={fr.em} intervalo={INTERVALO} tamanho={64} alinhar="center" tom={fr.tom} corTexto={claro ? cor.branco : cor.texto} />
            {fr.l2 && (
              <Cinetico texto={fr.l2} inicio={fr.em + palavras1 * INTERVALO + 4} intervalo={INTERVALO} tamanho={42} peso={600} alinhar="center" tom={fr.tom} corTexto={claro ? "rgba(255,255,255,0.85)" : cor.textoSuave} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
