import React from "react";
import { AbsoluteFill } from "remotion";
import { LogoQuebraPadrao, QuadradoQuebrado } from "../Logo";
import { cores, fontes } from "../tema";
import { caminho, criarProjecao, paises, TORDESILHAS_LON } from "../mapa";

// ESTILO 4 — Telejornal moderno / "breaking news"
const MiniMapa: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const proj = criarProjecao(w, h, [-38, 8], 330);
  const path = caminho(proj);
  const [lx] = proj([TORDESILHAS_LON, 0]) ?? [0, 0];
  return (
    <svg width={w} height={h}>
      {paises.features.map((f, i) => (
        <path key={i} d={path(f) ?? ""} fill="rgba(242,240,235,0.06)" stroke="rgba(242,240,235,0.5)" strokeWidth={1} />
      ))}
      <line x1={lx} y1={0} x2={lx} y2={h} stroke={cores.destaque} strokeWidth={3} />
    </svg>
  );
};

export const Estilo4Telejornal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: cores.fundo, overflow: "hidden" }}>
      {/* grade de estúdio */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 96} y1={0} x2={i * 96} y2={1080} stroke="rgba(242,240,235,0.04)" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 96} x2={1920} y2={i * 96} stroke="rgba(242,240,235,0.04)" />
        ))}
      </svg>

      {/* topo: bug do canal e relógio */}
      <div style={{ position: "absolute", left: 90, top: 70 }}>
        <LogoQuebraPadrao escala={1} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 66,
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: fontes.mono,
          fontSize: 22,
          letterSpacing: 3,
          color: cores.branco,
        }}
      >
        <span style={{ width: 14, height: 14, borderRadius: 7, background: cores.destaque }} />
        ARQUIVO · TORDESILHAS · 1494
      </div>

      {/* janela de imagem principal */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 150,
          width: 1100,
          height: 560,
          border: `1.5px solid rgba(242,240,235,0.35)`,
          overflow: "hidden",
        }}
      >
        <MiniMapa w={1100} h={560} />
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 20,
            fontFamily: fontes.mono,
            fontSize: 17,
            letterSpacing: 3,
            color: cores.cinza,
            background: cores.fundo,
            padding: "4px 10px",
          }}
        >
          FIG. 01 — LINHA DE DEMARCAÇÃO
        </div>
      </div>

      {/* painel lateral: números rápidos */}
      <div style={{ position: "absolute", left: 1250, top: 150, width: 580 }}>
        {[
          { n: "370", t: "léguas a oeste de Cabo Verde" },
          { n: "2", t: "reinos assinaram o acordo" },
          { n: "0", t: "povos indígenas consultados" },
        ].map((d, i) => (
          <div
            key={d.n + i}
            style={{
              borderTop: `1.5px solid rgba(242,240,235,0.25)`,
              padding: "26px 0 30px",
              display: "flex",
              alignItems: "baseline",
              gap: 28,
            }}
          >
            <div
              style={{
                fontFamily: fontes.oswald,
                fontWeight: 700,
                fontSize: 96,
                lineHeight: 1,
                width: 180,
                color: i === 2 ? cores.destaque : cores.branco,
              }}
            >
              {d.n}
            </div>
            <div style={{ fontFamily: fontes.inter, fontSize: 26, lineHeight: 1.3, color: cores.cinza }}>{d.t}</div>
          </div>
        ))}
      </div>

      {/* lower third */}
      <div style={{ position: "absolute", left: 90, top: 760, width: 1740 }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              background: cores.destaque,
              color: cores.fundo,
              fontFamily: fontes.oswald,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 4,
              padding: "8px 22px",
            }}
          >
            QUEBRA DE PADRÃO
          </div>
          <div
            style={{
              border: `1.5px solid ${cores.destaque}`,
              color: cores.destaque,
              fontFamily: fontes.mono,
              fontSize: 22,
              letterSpacing: 3,
              padding: "10px 20px",
            }}
          >
            07.06.1494
          </div>
        </div>
        <div
          style={{
            background: cores.branco,
            color: cores.fundo,
            fontFamily: fontes.oswald,
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 1.1,
            padding: "18px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          PORTUGAL E ESPANHA DIVIDEM O NOVO MUNDO
          <QuadradoQuebrado tamanho={44} espessura={3} cor={cores.fundo} />
        </div>
      </div>

      {/* ticker */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 86,
          borderTop: `1.5px solid rgba(242,240,235,0.25)`,
          display: "flex",
          alignItems: "center",
          gap: 40,
          paddingLeft: 90,
          fontFamily: fontes.mono,
          fontSize: 22,
          letterSpacing: 2,
          color: cores.cinza,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: cores.branco, fontWeight: 700 }}>CONTEXTO</span>
        <span>PAPA ALEXANDRE VI JÁ TINHA TRAÇADO OUTRA LINHA EM 1493</span>
        <span style={{ color: cores.destaque }}>■</span>
        <span>PORTUGAL EXIGIU EMPURRAR A FRONTEIRA PARA OESTE</span>
        <span style={{ color: cores.destaque }}>■</span>
        <span>CABRAL CHEGA EM 1500</span>
      </div>
    </AbsoluteFill>
  );
};
