import React from "react";
import { cores, fontes } from "./tema";

// O quadrado de linhas finas com um pedaço faltando no canto superior direito.
export const QuadradoQuebrado: React.FC<{
  tamanho: number;
  espessura?: number;
  falta?: number; // fração do lado que fica aberta
  cor?: string;
  corPedaco?: string; // se definido, desenha o pedaço "deslocado"
}> = ({ tamanho, espessura = 2, falta = 0.28, cor = cores.branco, corPedaco }) => {
  const s = tamanho;
  const g = s * falta;
  const m = espessura;
  return (
    <svg
      width={s + m * 2 + (corPedaco ? g * 0.6 : 0)}
      height={s + m * 2 + (corPedaco ? g * 0.6 : 0)}
      style={{ overflow: "visible" }}
    >
      <g transform={`translate(${m}, ${m + (corPedaco ? g * 0.6 : 0)})`}>
        <path
          d={`M ${s} ${g} L ${s} ${s} L 0 ${s} L 0 0 L ${s - g} 0`}
          fill="none"
          stroke={cor}
          strokeWidth={espessura}
          strokeLinecap="square"
        />
        {corPedaco ? (
          <path
            d={`M ${s - g} 0 L ${s} 0 L ${s} ${g}`}
            transform={`translate(${g * 0.45}, ${-g * 0.45})`}
            fill="none"
            stroke={corPedaco}
            strokeWidth={espessura}
            strokeLinecap="square"
          />
        ) : null}
      </g>
    </svg>
  );
};

export const LogoQuebraPadrao: React.FC<{
  escala?: number;
  cor?: string;
}> = ({ escala = 1, cor = cores.branco }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 * escala }}>
    <QuadradoQuebrado tamanho={30 * escala} espessura={1.6 * escala} cor={cor} />
    <div
      style={{
        fontFamily: fontes.inter,
        fontWeight: 600,
        fontSize: 18 * escala,
        letterSpacing: 5 * escala,
        color: cor,
      }}
    >
      QUEBRA PADRÃO
    </div>
  </div>
);
