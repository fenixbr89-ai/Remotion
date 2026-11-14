import { useCurrentFrame, useVideoConfig } from "remotion";
import { cor, entra, fontFamily, suave, textoDegrade, degrade } from "../tema";

type Props = {
  /** Palavras entre *asteriscos* ganham degradê azul e sublinhado animado. */
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

/** Tipografia cinética: cada palavra sobe de dentro de uma máscara, em sequência. Nada fica inclinado. */
export const Cinetico: React.FC<Props> = ({ texto, inicio = 0, intervalo = 3, tamanho, peso = 800, corTexto = cor.texto, alinhar = "left", tom = "azul", style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palavras = texto.split(" ");
  return (
    <div
      style={{
        fontFamily,
        fontSize: tamanho,
        fontWeight: peso,
        color: corTexto,
        letterSpacing: tamanho > 60 ? -tamanho * 0.025 : 0,
        lineHeight: 1.12,
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
        const e = entra(f, fps, t, 15);
        const linha = suave(f, t + 8, t + 22);
        return (
          <span key={`${p}-${i}`} style={{ display: "inline-block", overflow: "hidden", paddingBottom: tamanho * 0.12, marginBottom: -tamanho * 0.12, position: "relative" }}>
            <span style={{ display: "inline-block", translate: `0 ${(1 - e) * 110}%`, opacity: Math.min(1, e * 1.5), ...(destaque ? (tom === "azul" ? textoDegrade : { color: cor.vermelho }) : {}) }}>{p}</span>
            {destaque && (
              <span style={{ position: "absolute", left: 0, right: 0, bottom: tamanho * 0.06, height: Math.max(6, tamanho * 0.08), borderRadius: 99, background: tom === "azul" ? degrade : cor.vermelho, opacity: 0.3, scale: `${linha} 1`, transformOrigin: "left center" }} />
            )}
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
