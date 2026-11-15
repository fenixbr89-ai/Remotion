import React from "react";
import { AbsoluteFill } from "remotion";
import { LogoQuebraPadrao, QuadradoQuebrado } from "../Logo";
import { Granulado, Papel } from "../papel";
import { cores, fontes } from "../tema";
import { caminho, criarProjecao, paises, TORDESILHAS_LON } from "../mapa";

// ESTILO 1 — Colagem editorial (inspiração Vox, adaptada ao fundo preto)
const MapaPapel: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const proj = criarProjecao(w, h, [-42, -8], 520);
  const path = caminho(proj);
  const [lx] = proj([TORDESILHAS_LON, 0]) ?? [0, 0];
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="hachura1" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke={cores.destaque} strokeWidth="3" />
        </pattern>
        <clipPath id="ladoLeste">
          <rect x={lx} y={0} width={w} height={h} />
        </clipPath>
      </defs>
      {paises.features.map((f, i) => (
        <path key={i} d={path(f) ?? ""} fill="rgba(26,23,20,0.10)" stroke={cores.tinta} strokeWidth={1.4} />
      ))}
      <g clipPath="url(#ladoLeste)">
        {paises.features
          .filter((f) => f.properties.name === "Brazil")
          .map((f, i) => (
            <path key={i} d={path(f) ?? ""} fill="url(#hachura1)" opacity={0.9} />
          ))}
      </g>
      <line x1={lx} y1={0} x2={lx} y2={h} stroke={cores.destaque} strokeWidth={4} strokeDasharray="14 8" />
    </svg>
  );
};

export const Estilo1Colagem: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#121110", overflow: "hidden" }}>
      {/* Mapa em papel envelhecido */}
      <Papel semente="mapa" x={980} y={70} w={800} h={760} rot={3.5}>
        <MapaPapel w={800} h={760} />
        <div
          style={{
            position: "absolute",
            right: 50,
            top: 46,
            fontFamily: fontes.maquina,
            fontSize: 24,
            color: cores.tinta,
          }}
        >
          fig. 2 — meridiano de Tordesilhas
        </div>
      </Papel>

      {/* Trecho do tratado */}
      <Papel semente="doc" x={700} y={600} w={560} h={360} rot={-6} cor="#F3EEDF">
        <div
          style={{
            padding: "48px 50px",
            fontFamily: fontes.maquina,
            fontSize: 25,
            lineHeight: 1.55,
            color: cores.tinta,
          }}
        >
          “...se faça e assinale pelo dito mar oceano uma raia ou linha direita de polo a polo...
          <span style={{ background: "rgba(255,77,31,0.55)", padding: "0 4px" }}>
            a trezentas e setenta léguas das ilhas de Cabo Verde
          </span>
          ...”
        </div>
      </Papel>

      {/* Manchete */}
      <div style={{ position: "absolute", left: 120, top: 210, width: 860 }}>
        <div
          style={{
            fontFamily: fontes.mono,
            fontSize: 22,
            letterSpacing: 6,
            color: cores.destaque,
            marginBottom: 26,
          }}
        >
          07 · JUNHO · 1494
        </div>
        <div
          style={{
            fontFamily: fontes.playfair,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1.0,
            color: cores.branco,
          }}
        >
          O mundo
          <br />
          dividido por{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span
              style={{
                position: "absolute",
                left: -10,
                right: -10,
                top: "68%",
                height: "26%",
                background: cores.destaque,
                transform: "rotate(-1.5deg)",
                zIndex: 0,
              }}
            />
            <span style={{ position: "relative" }}>uma linha</span>
          </span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: fontes.inter,
            fontSize: 28,
            lineHeight: 1.45,
            color: cores.cinza,
            width: 560,
          }}
        >
          Seis anos antes de Cabral chegar, o Brasil já tinha dono no papel.
        </div>
      </div>

      {/* Carimbo */}
      <div
        style={{
          position: "absolute",
          left: 1610,
          top: 760,
          width: 190,
          height: 190,
          borderRadius: "50%",
          border: `5px solid ${cores.destaque}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(-14deg)",
          fontFamily: fontes.anton,
          fontSize: 58,
          color: cores.destaque,
          opacity: 0.92,
        }}
      >
        1494
      </div>

      <div style={{ position: "absolute", left: 120, top: 90 }}>
        <QuadradoQuebrado tamanho={46} espessura={2} cor={cores.branco} />
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 70 }}>
        <LogoQuebraPadrao escala={0.9} />
      </div>
      <Granulado id="g-fundo1" opacidade={0.22} />
    </AbsoluteFill>
  );
};
