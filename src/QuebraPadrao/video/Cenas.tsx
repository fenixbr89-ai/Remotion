import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { geoGraticule10 } from "d3-geo";
import { cores, fontes } from "../tema";
import { caminho, criarProjecao, paises, TORDESILHAS_LON } from "../mapa";
import { QuadradoQuebrado } from "../Logo";
import { H, Palavra, progresso, Rotulo, useEntrada, W } from "./util";

const anton = (tam: number, cor: string = cores.branco): React.CSSProperties => ({
  fontFamily: fontes.anton,
  fontSize: tam,
  lineHeight: 0.98,
  color: cor,
  textTransform: "uppercase",
});

const Centro: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px", ...style }}>{children}</AbsoluteFill>
);

// CENA 1 — o que te ensinaram
export const Cena1: React.FC = () => {
  const frame = useCurrentFrame();
  const risco = progresso(frame, 58, 72);
  return (
    <Centro>
      <Rotulo style={{ marginBottom: 40 }}>
        <Palavra atraso={0}>O QUE TE ENSINARAM</Palavra>
      </Rotulo>
      <div style={anton(150)}>
        <Palavra atraso={6}>O BRASIL</Palavra>
        <br />
        <Palavra atraso={12}>FOI</Palavra>
        <br />
        <Palavra atraso={18}>DESCOBERTO</Palavra>
        <br />
        <Palavra atraso={26}>EM</Palavra>{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <Palavra atraso={32} style={{ color: risco > 0 ? cores.cinza : cores.branco }}>
            1500.
          </Palavra>
          <span
            style={{
              position: "absolute",
              left: -10,
              top: "46%",
              height: 14,
              width: `${risco * 108}%`,
              background: cores.destaque,
              transform: "rotate(-4deg)",
            }}
          />
        </span>
      </div>
    </Centro>
  );
};

// Palavra rachada: metade de baixo escorrega para o lado.
const Rachada: React.FC<{ texto: string; tam: number; atraso: number; quebra: number }> = ({ texto, tam, atraso, quebra }) => {
  const frame = useCurrentFrame();
  const entrada = useEntrada(atraso);
  const q = useEntrada(quebra, { damping: 9, stiffness: 220, mass: 0.6 });
  const tremor = frame >= quebra && frame < quebra + 6 ? (random(`t${frame}`) - 0.5) * 18 : 0;
  const base: React.CSSProperties = { ...anton(tam, cores.destaque), whiteSpace: "nowrap" };
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transform: `scale(${0.7 + entrada * 0.3}) translateX(${tremor}px)`,
        transformOrigin: "left center",
        opacity: entrada,
      }}
    >
      <div style={{ ...base, visibility: "hidden" }}>{texto}</div>
      <div style={{ ...base, position: "absolute", inset: 0, clipPath: "inset(0 0 50% 0)" }}>{texto}</div>
      <div
        style={{
          ...base,
          position: "absolute",
          inset: 0,
          clipPath: "inset(50% 0 0 0)",
          transform: `translate(${q * 46}px, ${q * 12}px)`,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// CENA 2 — mas ele já tinha dono
export const Cena2: React.FC = () => (
  <Centro>
    <div style={anton(130)}>
      <Palavra atraso={0}>MAS ELE</Palavra>
      <br />
      <Palavra atraso={6}>JÁ TINHA</Palavra>
    </div>
    <Rachada texto="DONO." tam={400} atraso={14} quebra={40} />
  </Centro>
);

// CENA 3 — contagem regressiva 1500 → 1494
export const Cena3: React.FC = () => {
  const frame = useCurrentFrame();
  const passos = Math.floor(interpolate(frame, [10, 52], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const ano = 1500 - passos;
  const chegou = ano === 1494;
  const pulso = useEntrada(52, { damping: 10, stiffness: 200, mass: 0.6 });
  const topo = useEntrada(56);
  return (
    <Centro style={{ alignItems: "center", textAlign: "center" }}>
      <Rotulo cor={cores.destaque} style={{ opacity: topo, transform: `translateY(${(1 - topo) * 30}px)` }}>
        SEIS ANOS ANTES
      </Rotulo>
      <div
        style={{
          ...anton(380, chegou ? cores.destaque : cores.branco),
          transform: `scale(${1 + (chegou ? pulso * 0.08 : 0)})`,
          fontVariantNumeric: "tabular-nums",
          margin: "20px 0",
        }}
      >
        {ano}
      </div>
      <Rotulo style={{ opacity: topo }}>07 · JUNHO · TORDESILHAS</Rotulo>
    </Centro>
  );
};

// CENA 4 — o mapa e a linha
export const Cena4: React.FC = () => {
  const frame = useCurrentFrame();
  const proj = criarProjecao(W, H, [-49, -12], 1050);
  const path = caminho(proj);
  const [lx] = proj([TORDESILHAS_LON, 0]) ?? [0, 0];
  const desenho = progresso(frame, 0, 40);
  const linha = progresso(frame, 34, 62);
  const preenche = progresso(frame, 62, 92);
  const rotulos = useEntrada(80);
  const titulo = useEntrada(4);
  const zoom = interpolate(frame, [0, 180], [1.0, 1.12]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${lx}px 55%` }}>
        <svg width={W} height={H}>
          <defs>
            <pattern id="hachV" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="16" stroke={cores.destaque} strokeWidth="4" />
            </pattern>
            <clipPath id="lesteV">
              <rect x={lx} y={0} width={preenche * (W - lx)} height={H} />
            </clipPath>
          </defs>
          <path d={path(geoGraticule10()) ?? ""} fill="none" stroke="rgba(242,240,235,0.08)" strokeWidth={1.2} />
          {paises.features.map((f, i) => (
            <path
              key={i}
              d={path(f) ?? ""}
              fill="none"
              stroke="rgba(242,240,235,0.6)"
              strokeWidth={2}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - desenho}
            />
          ))}
          <g clipPath="url(#lesteV)">
            {paises.features
              .filter((f) => f.properties.name === "Brazil")
              .map((f, i) => (
                <path key={i} d={path(f) ?? ""} fill="url(#hachV)" stroke={cores.destaque} strokeWidth={4} />
              ))}
          </g>
          <line x1={lx} y1={0} x2={lx} y2={linha * H} stroke={cores.destaque} strokeWidth={5} />
        </svg>
        <div style={{ position: "absolute", left: lx - 30, top: 1480, transform: "translateX(-100%)", opacity: rotulos }}>
          <Rotulo style={{ background: cores.fundo, padding: "4px 10px" }}>◀ ESPANHA</Rotulo>
        </div>
        <div style={{ position: "absolute", left: lx + 30, top: 1480, opacity: rotulos }}>
          <Rotulo cor={cores.destaque} style={{ background: cores.fundo, padding: "4px 10px" }}>
            PORTUGAL ▶
          </Rotulo>
        </div>
      </AbsoluteFill>
      {/* título por cima */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          padding: "230px 90px 140px",
          background: `linear-gradient(${cores.fundo} 70%, rgba(10,10,10,0))`,
        }}
      >
        <Rotulo cor={cores.destaque} style={{ opacity: titulo }}>
          UMA LINHA · DE POLO A POLO
        </Rotulo>
        <div style={{ ...anton(118), marginTop: 20 }}>
          <Palavra atraso={4}>TRATADO DE</Palavra>
          <br />
          <Palavra atraso={10}>TORDESILHAS</Palavra>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CENA 5 — os números
const Linha: React.FC<{ n: string; texto: string; cor: string; atraso: number }> = ({ n, texto, cor, atraso }) => {
  const p = useEntrada(atraso);
  const frame = useCurrentFrame();
  const traco = progresso(frame, atraso - 4, atraso + 14);
  return (
    <div style={{ position: "relative", padding: "40px 0" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: `${traco * 100}%`, background: "rgba(242,240,235,0.3)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 50, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
        <div style={{ ...anton(300, cor), width: 230 }}>{n}</div>
        <div style={{ fontFamily: fontes.inter, fontWeight: 600, fontSize: 58, lineHeight: 1.15, color: cores.branco }}>
          {texto}
        </div>
      </div>
    </div>
  );
};

export const Cena5: React.FC = () => (
  <Centro>
    <Linha n="2" texto="reinos dividiram o mundo" cor={cores.branco} atraso={4} />
    <Linha n="0" texto="povos daqui foram consultados" cor={cores.destaque} atraso={40} />
  </Centro>
);

// CENA 6 — a grade quebra e vira o logo
const COLS = 8;
const LINHAS = 14;
const CEL = 96;
const GAP = 22;

export const Cena6: React.FC = () => {
  const frame = useCurrentFrame();
  const larg = COLS * CEL + (COLS - 1) * GAP;
  const alt = LINHAS * CEL + (LINHAS - 1) * GAP;
  const ox = (W - larg) / 2;
  const oy = (H - alt) / 2;
  const qc = (COLS - 1) / 2;
  const ql = (LINHAS - 1) / 2;
  const quebra = progresso(frame, 26, 56);
  const logo = progresso(frame, 50, 80);
  const textoP = useEntrada(74);
  const chamada = useEntrada(96);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: COLS * LINHAS }).map((_, i) => {
          const c = i % COLS;
          const l = Math.floor(i / COLS);
          const dx0 = c - qc;
          const dy0 = l - ql;
          const d = Math.hypot(dx0, dy0 * 0.8);
          const aparece = progresso(frame, d * 2, d * 2 + 14);
          const r = random(`c6-${i}`);
          const forca = Math.max(0, 1 - d / 7) * quebra;
          const voa = d < 2.4 ? quebra : 0; // os do centro somem
          const x = ox + c * (CEL + GAP) + dx0 * 140 * forca;
          const y = oy + l * (CEL + GAP) + dy0 * 90 * forca;
          const rot = (r - 0.5) * 120 * forca;
          const acento = r > 0.7 && forca > 0.2;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={CEL}
              height={CEL}
              fill="none"
              stroke={acento ? cores.destaque : "rgba(242,240,235,0.22)"}
              strokeWidth={acento ? 3 : 1.6}
              opacity={aparece * (1 - voa) * (1 - forca * 0.6)}
              transform={`rotate(${rot} ${x + CEL / 2} ${y + CEL / 2})`}
            />
          );
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: logo, transform: `scale(${0.6 + logo * 0.4}) rotate(${(1 - logo) * -25}deg)` }}>
          <QuadradoQuebrado tamanho={260} espessura={5} cor={cores.branco} />
        </div>
        <div
          style={{
            marginTop: 70,
            fontFamily: fontes.inter,
            fontWeight: 800,
            fontSize: 74,
            letterSpacing: 14,
            color: cores.branco,
            opacity: textoP,
            transform: `translateY(${(1 - textoP) * 30}px)`,
          }}
        >
          QUEBRA PADRÃO
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: fontes.inter,
            fontWeight: 400,
            fontSize: 40,
            color: cores.cinza,
            opacity: chamada,
            background: cores.fundo,
            padding: "6px 16px",
          }}
        >
          Siga pra ver o que <span style={{ color: cores.destaque }}>não te contaram</span>.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
