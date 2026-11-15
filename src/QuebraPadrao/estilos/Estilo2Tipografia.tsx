import React from "react";
import { AbsoluteFill } from "remotion";
import { LogoQuebraPadrao } from "../Logo";
import { cores, fontes } from "../tema";

// ESTILO 2 — Tipografia cinética: o texto é a imagem.
const PalavraQuebrada: React.FC<{ texto: string; tamanho: number }> = ({ texto, tamanho }) => {
  const base: React.CSSProperties = {
    fontFamily: fontes.anton,
    fontSize: tamanho,
    lineHeight: 1,
    color: cores.destaque,
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ ...base, visibility: "hidden" }}>{texto}</div>
      {/* metade de cima no lugar */}
      <div style={{ ...base, position: "absolute", inset: 0, clipPath: "inset(0 0 52% 0)" }}>{texto}</div>
      {/* metade de baixo deslocada: o padrão quebrou */}
      <div
        style={{
          ...base,
          position: "absolute",
          inset: 0,
          clipPath: "inset(48% 0 0 0)",
          transform: "translate(34px, 10px)",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const Estilo2Tipografia: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: cores.fundo, overflow: "hidden" }}>
      {/* rastro de palavras anteriores, em contorno */}
      <div
        style={{
          position: "absolute",
          left: -40,
          top: 40,
          fontFamily: fontes.anton,
          fontSize: 300,
          lineHeight: 0.9,
          color: "transparent",
          WebkitTextStroke: `2px rgba(242,240,235,0.10)`,
          whiteSpace: "nowrap",
        }}
      >
        PORTUGAL ESPANHA PORTUGAL
        <br />
        ESPANHA PORTUGAL ESPANHA
      </div>

      <div style={{ position: "absolute", left: 150, top: 200 }}>
        <div
          style={{
            fontFamily: fontes.inter,
            fontWeight: 300,
            fontSize: 46,
            color: cores.cinza,
            marginBottom: 18,
          }}
        >
          Em 1494, dois reinos
        </div>
        <div
          style={{
            fontFamily: fontes.anton,
            fontSize: 190,
            lineHeight: 1,
            color: cores.branco,
          }}
        >
          RACHARAM
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
          <div
            style={{
              fontFamily: fontes.anton,
              fontSize: 190,
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: `3px ${cores.branco}`,
            }}
          >
            O
          </div>
          <PalavraQuebrada texto="MUNDO" tamanho={300} />
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: fontes.inter,
            fontWeight: 600,
            fontSize: 44,
            color: cores.branco,
          }}
        >
          ao meio. <span style={{ color: cores.cinza, fontWeight: 300 }}>E ninguém perguntou aos povos daqui.</span>
        </div>
      </div>

      {/* legenda / marcador de progresso típico de Reels */}
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 220,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {[1, 1, 1, 0, 0, 0].map((ativo, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 70,
              background: ativo ? cores.branco : "rgba(242,240,235,0.18)",
            }}
          />
        ))}
      </div>

      <div style={{ position: "absolute", left: 150, bottom: 70 }}>
        <LogoQuebraPadrao escala={0.9} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 150,
          bottom: 74,
          fontFamily: fontes.mono,
          fontSize: 20,
          letterSpacing: 4,
          color: cores.cinza,
        }}
      >
        TRATADO DE TORDESILHAS
      </div>
    </AbsoluteFill>
  );
};
