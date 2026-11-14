import { brl } from "../calc";
import { fontFamily } from "../tema";

/**
 * Valor em reais com dígitos que giram como um contador mecânico.
 * `valor` é o número atual (animado); `final` define o layout (quantos dígitos).
 */
export const Odometro: React.FC<{ valor: number; final: number; tamanho: number; cor: string; peso?: number; style?: React.CSSProperties }> = ({ valor, final, tamanho, cor, peso = 800, style }) => {
  const modelo = brl(final);
  const centavos = Math.max(0, Math.round(valor * 100 * 1000) / 1000);
  // posição decimal de cada dígito, contando da direita
  let casa = 0;
  const casas = modelo
    .split("")
    .reverse()
    .map((ch) => (/\d/.test(ch) ? casa++ : -1))
    .reverse();
  const altura = tamanho * 1.1;
  return (
    <div style={{ display: "flex", fontFamily, fontSize: tamanho, fontWeight: peso, color: cor, letterSpacing: -tamanho * 0.03, lineHeight: `${altura}px`, height: altura, overflow: "hidden", fontVariantNumeric: "tabular-nums", ...style }}>
      {modelo.split("").map((ch, i) => {
        const p = casas[i];
        if (p < 0) {
          // separadores somem enquanto o número ainda não chegou na casa deles
          const vis = ch === "." && centavos < 100000 ? 0 : 1;
          return (
            <span key={i} style={{ display: vis ? "inline" : "none", whiteSpace: "pre" }}>
              {ch}
            </span>
          );
        }
        // dígito de baixo gira contínuo; os de cima só viram quando o de baixo passa do 9
        const base = Math.floor(centavos / 10 ** p) % 10;
        const resto = centavos % 10 ** p;
        const v = p === 0 ? centavos % 10 : base + Math.min(1, Math.max(0, resto - (10 ** p - 1)));
        const ativo = p <= 2 || centavos >= 10 ** p;
        return (
          <span key={i} style={{ display: ativo ? "inline-block" : "none", height: altura, overflow: "hidden" }}>
            <span style={{ display: "flex", flexDirection: "column", translate: `0 ${-v * altura}px` }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, j) => (
                <span key={j} style={{ height: altura }}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};
