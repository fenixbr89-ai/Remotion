import React from "react";
import { AbsoluteFill } from "remotion";
import { geoGraticule10 } from "d3-geo";
import { LogoQuebraPadrao, QuadradoQuebrado } from "../Logo";
import { cores, fontes } from "../tema";
import { caminho, criarProjecao, paises, TORDESILHAS_LON } from "../mapa";

// ESTILO 3 — Mapas e dados em linha fina
const W = 1300;
const H = 1080;

const Rotulo: React.FC<{ x: number; y: number; children: React.ReactNode; cor?: string; alinhar?: "esq" | "dir" }> = ({
  x,
  y,
  children,
  cor = cores.branco,
  alinhar = "esq",
}) => (
  <div
    style={{
      position: "absolute",
      left: alinhar === "esq" ? x : undefined,
      right: alinhar === "dir" ? W - x : undefined,
      top: y,
      fontFamily: fontes.mono,
      fontSize: 19,
      letterSpacing: 2,
      color: cor,
      whiteSpace: "nowrap",
      background: cores.fundo,
      padding: "2px 8px",
    }}
  >
    {children}
  </div>
);

export const Estilo3Mapas: React.FC = () => {
  const proj = criarProjecao(W, H, [-32, 4], 560);
  const path = caminho(proj);
  const p = (lon: number, lat: number) => proj([lon, lat]) ?? [0, 0];
  const [lx] = p(TORDESILHAS_LON, 0);
  const caboVerde = p(-23.6, 15.1);
  const tordesilhas = p(-5.0, 41.5);
  const linhaY = caboVerde[1];

  return (
    <AbsoluteFill style={{ backgroundColor: cores.fundo, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
        <svg width={W} height={H}>
          <defs>
            <pattern id="hachura3" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke={cores.destaque} strokeWidth="2" />
            </pattern>
            <clipPath id="leste3">
              <rect x={lx} y={0} width={W} height={H} />
            </clipPath>
            <linearGradient id="fade3" x1="0" x2="1">
              <stop offset="0.75" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor={cores.fundo} stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d={path(geoGraticule10()) ?? ""} fill="none" stroke={cores.linha} strokeWidth={1} />
          {paises.features.map((f, i) => (
            <path key={i} d={path(f) ?? ""} fill="none" stroke="rgba(242,240,235,0.55)" strokeWidth={1.2} />
          ))}
          <g clipPath="url(#leste3)">
            {paises.features
              .filter((f) => f.properties.name === "Brazil")
              .map((f, i) => (
                <path key={i} d={path(f) ?? ""} fill="url(#hachura3)" stroke={cores.destaque} strokeWidth={2} />
              ))}
          </g>
          {/* meridiano */}
          <line x1={lx} y1={0} x2={lx} y2={H} stroke={cores.destaque} strokeWidth={2.5} />
          {/* cota: 370 léguas */}
          <g stroke={cores.branco} strokeWidth={1.4}>
            <line x1={lx} y1={linhaY} x2={caboVerde[0]} y2={linhaY} strokeDasharray="6 6" />
            <line x1={lx} y1={linhaY - 12} x2={lx} y2={linhaY + 12} />
            <line x1={caboVerde[0]} y1={linhaY - 12} x2={caboVerde[0]} y2={linhaY + 12} />
          </g>
          <circle cx={caboVerde[0]} cy={caboVerde[1]} r={7} fill={cores.fundo} stroke={cores.branco} strokeWidth={2} />
          <circle cx={tordesilhas[0]} cy={tordesilhas[1]} r={7} fill={cores.destaque} />
          <rect x={0} y={0} width={W} height={H} fill="url(#fade3)" />
        </svg>
        <Rotulo x={(lx + caboVerde[0]) / 2 - 90} y={linhaY - 46}>370 LÉGUAS</Rotulo>
        <Rotulo x={caboVerde[0] - 10} y={caboVerde[1] + 22} cor={cores.cinza}>CABO VERDE</Rotulo>
        <Rotulo x={tordesilhas[0] + 16} y={tordesilhas[1] - 12} cor={cores.destaque}>TORDESILHAS</Rotulo>
        <Rotulo x={lx + 14} y={60} cor={cores.destaque}>46°37′ O</Rotulo>
        <Rotulo x={lx - 16} y={940} cor={cores.cinza} alinhar="dir">◀ ESPANHA</Rotulo>
        <Rotulo x={lx + 16} y={940} cor={cores.cinza}>PORTUGAL ▶</Rotulo>
      </div>

      {/* painel de dados */}
      <div style={{ position: "absolute", left: 1300, top: 150, width: 500 }}>
        <QuadradoQuebrado tamanho={40} espessura={1.6} cor={cores.destaque} />
        <div
          style={{
            marginTop: 36,
            fontFamily: fontes.inter,
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 1.05,
            color: cores.branco,
          }}
        >
          Quanto do Brasil
          <br />
          era português?
        </div>
        <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 34 }}>
          {[
            { nome: "Pela linha de 1494", valor: 0.33, rotulo: "~1/3", cor: cores.destaque },
            { nome: "Território atual", valor: 1, rotulo: "8,5 mi km²", cor: cores.branco },
          ].map((b) => (
            <div key={b.nome}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: fontes.mono,
                  fontSize: 19,
                  letterSpacing: 2,
                  color: cores.cinza,
                  marginBottom: 12,
                }}
              >
                <span>{b.nome.toUpperCase()}</span>
                <span style={{ color: b.cor }}>{b.rotulo}</span>
              </div>
              <div style={{ height: 22, border: `1.5px solid ${cores.linha}`, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${b.valor * 100}%`, background: b.cor }} />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 50,
            fontFamily: fontes.inter,
            fontWeight: 300,
            fontSize: 26,
            lineHeight: 1.45,
            color: cores.cinza,
          }}
        >
          O resto do mapa foi “quebrado” depois — por bandeirantes, tratados e guerras.
        </div>
      </div>

      <div style={{ position: "absolute", right: 120, bottom: 70 }}>
        <LogoQuebraPadrao escala={0.9} />
      </div>
    </AbsoluteFill>
  );
};
