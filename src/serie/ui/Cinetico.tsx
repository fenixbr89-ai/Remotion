import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, entra, fontFamily, suave, textoDegrade } from "../tema";

type Props = {
  /** Palavras entre *asteriscos* ganham destaque (degradê + marca-texto). */
  texto: string;
  inicio?: number;
  intervalo?: number;
  tamanho: number;
  peso?: number;
  corTexto?: string;
  alinhar?: "left" | "center";
  /** Cor dos destaques: degradê azul (padrão) ou vermelho para alertas. */
  tom?: "azul" | "vermelho";
  style?: React.CSSProperties;
};

/**
 * Tipografia cinética, palavra a palavra, como se fosse falada:
 * - cada palavra sobe com desfoque e entra em foco;
 * - a palavra recém-"falada" acende em azul e assenta na cor do texto;
 * - destaques ganham marca-texto que se desenha atrás;
 * - destaques com número (R$, %) dão um pulo.
 * Nada fica inclinado.
 */
export const Cinetico: React.FC<Props> = ({ texto, inicio = 0, intervalo = 3, tamanho, peso = 800, corTexto = cor.texto, alinhar = "left", tom = "azul", style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palavras = texto.split(" ");
  const claro = corTexto === cor.branco || corTexto.startsWith("rgba(255");
  return (
    <div
      style={{
        fontFamily,
        fontSize: tamanho,
        fontWeight: peso,
        color: corTexto,
        letterSpacing: tamanho > 60 ? -tamanho * 0.025 : 0,
        lineHeight: 1.16,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: alinhar === "center" ? "center" : "flex-start",
        columnGap: tamanho * 0.26,
        ...style,
      }}
    >
      {palavras.map((bruta, i) => {
        const destaque = bruta.startsWith("*");
        const p = bruta.replace(/\*/g, "");
        const t = inicio + i * intervalo;
        const e = entra(f, fps, t, 16);
        const numero = destaque && /\d/.test(p);
        const pulo = numero ? entra(f, fps, t + 4, 6) : 1;
        const escala = numero ? interpolate(pulo, [0, 1], [1.35, 1]) : 0.9 + e * 0.1;
        const marca = suave(f, t + 4, t + 16);
        const acesa = claro || destaque ? corTexto : interpolateColors(f, [t + 2, t + 12], [cor.azul, corTexto]);
        const estiloDestaque: React.CSSProperties = destaque ? (tom === "azul" ? (claro ? { color: cor.azulCeu } : textoDegrade) : { color: cor.vermelho }) : { color: acesa };
        return (
          <span key={`${p}-${i}`} style={{ display: "inline-block", position: "relative", opacity: Math.min(1, e * 1.6), translate: `0 ${(1 - e) * tamanho * 0.45}px`, filter: `blur(${(1 - Math.min(1, e)) * 8}px)`, scale: `${escala}` }}>
            {destaque && (
              <span
                style={{
                  position: "absolute",
                  left: -tamanho * 0.08,
                  right: -tamanho * 0.08,
                  top: "18%",
                  bottom: "4%",
                  borderRadius: tamanho * 0.16,
                  background: tom === "azul" ? (claro ? "rgba(255,255,255,0.18)" : cor.azulFundo) : cor.vermelhoFundo,
                  scale: `${marca} 1`,
                  transformOrigin: "left center",
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1, display: "inline-block", ...estiloDestaque }}>{p}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Letras caindo uma a uma (retas), preenchidas com o degradê. */
export const Letras: React.FC<{ texto: string; inicio: number; tamanho: number; intervalo?: number }> = ({ texto, inicio, tamanho, intervalo = 2 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily, fontSize: tamanho, fontWeight: 800, letterSpacing: -tamanho * 0.03, lineHeight: 1.1, display: "flex", justifyContent: "center" }}>
      {texto.split("").map((l, i) => {
        const e = entra(f, fps, inicio + i * intervalo, 10);
        return (
          <span key={i} style={{ display: "inline-block", ...textoDegrade, translate: `0 ${(1 - e) * -140}px`, scale: `${0.4 + e * 0.6}`, opacity: Math.min(1, e * 2) }}>
            {l}
          </span>
        );
      })}
    </div>
  );
};
