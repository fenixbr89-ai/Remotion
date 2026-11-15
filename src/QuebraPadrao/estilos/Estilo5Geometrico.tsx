import React from "react";
import { AbsoluteFill, random } from "remotion";
import { LogoQuebraPadrao } from "../Logo";
import { cores, fontes } from "../tema";

// ESTILO 5 — Geométrico minimalista: o padrão (grade) e a quebra.
const COLS = 16;
const LINHAS = 9;
const CEL = 64;
const GAP = 14;

export const Estilo5Geometrico: React.FC = () => {
  const ox = 1920 - 120 - COLS * (CEL + GAP) + GAP;
  const oy = 140;
  // centro da "quebra"
  const qc = 11.5;
  const ql = 4.5;
  return (
    <AbsoluteFill style={{ backgroundColor: cores.fundo, overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: COLS * LINHAS }).map((_, i) => {
          const c = i % COLS;
          const l = Math.floor(i / COLS);
          const d = Math.hypot(c - qc, (l - ql) * 1.2);
          const x = ox + c * (CEL + GAP);
          const y = oy + l * (CEL + GAP);
          const r = random(`q-${i}`);
          if (d < 1.2) return null; // o pedaço que falta
          if (d < 3.2) {
            // quadrados deslocados, girados, abertos
            const forca = (3.2 - d) / 2;
            const dx = (c - qc) * 18 * forca + (r - 0.5) * 30;
            const dy = (l - ql) * 18 * forca + (random(`y-${i}`) - 0.5) * 30;
            const rot = (r - 0.5) * 70 * forca;
            const acento = r > 0.55;
            const g = CEL * 0.3;
            return (
              <g key={i} transform={`translate(${x + dx + CEL / 2} ${y + dy + CEL / 2}) rotate(${rot})`}>
                <path
                  d={`M ${CEL / 2} ${-CEL / 2 + g} L ${CEL / 2} ${CEL / 2} L ${-CEL / 2} ${CEL / 2} L ${-CEL / 2} ${-CEL / 2} L ${CEL / 2 - g} ${-CEL / 2}`}
                  fill="none"
                  stroke={acento ? cores.destaque : cores.branco}
                  strokeWidth={acento ? 2.4 : 1.6}
                />
              </g>
            );
          }
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={CEL}
              height={CEL}
              fill="none"
              stroke={d < 4.5 ? "rgba(242,240,235,0.35)" : "rgba(242,240,235,0.16)"}
              strokeWidth={1.2}
            />
          );
        })}
      </svg>

      {/* texto à esquerda, sobre a parte "em ordem" da grade */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 0,
          bottom: 0,
          width: 760,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: `linear-gradient(90deg, ${cores.fundo} 82%, rgba(10,10,10,0))`,
          paddingRight: 80,
        }}
      >
        <div
          style={{
            fontFamily: fontes.mono,
            fontSize: 20,
            letterSpacing: 6,
            color: cores.cinza,
            marginBottom: 40,
          }}
        >
          O QUE TE ENSINARAM
        </div>
        <div
          style={{
            fontFamily: fontes.inter,
            fontWeight: 300,
            fontSize: 54,
            lineHeight: 1.2,
            color: cores.cinza,
            textDecoration: "line-through",
            textDecorationThickness: 2,
          }}
        >
          “O Brasil foi descoberto em 1500.”
        </div>
        <div
          style={{
            width: 80,
            height: 2,
            background: cores.destaque,
            margin: "56px 0",
          }}
        />
        <div
          style={{
            fontFamily: fontes.mono,
            fontSize: 20,
            letterSpacing: 6,
            color: cores.destaque,
            marginBottom: 28,
          }}
        >
          O QUE QUEBRA O PADRÃO
        </div>
        <div
          style={{
            fontFamily: fontes.inter,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.05,
            color: cores.branco,
            letterSpacing: -1.5,
          }}
        >
          Ele já tinha sido dividido{" "}
          <span style={{ color: cores.destaque }}>seis anos antes.</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 120, bottom: 70 }}>
        <LogoQuebraPadrao escala={0.9} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 74,
          fontFamily: fontes.mono,
          fontSize: 20,
          letterSpacing: 4,
          color: cores.cinza,
        }}
      >
        EP. 01 — TORDESILHAS
      </div>
    </AbsoluteFill>
  );
};
