import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import mundo50 from "world-atlas/countries-50m.json";
import { cores, fontes } from "../tema";
import { poligonoRasgado } from "../papel";

export const W = 1080;
export const H = 1920;
export const VERMELHO = "#E0341E";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = mundo50 as any;
export const paises50 = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;

export const useMola = (atraso: number, config = { damping: 16, stiffness: 140, mass: 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - atraso, fps, config });
};

export const prog = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

// Granulado animado (textura de filme/papel)
export const GraoFilme: React.FC<{ opacidade?: number }> = ({ opacidade = 0.16 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: opacidade, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id="graoFilme">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(frame / 2) % 12} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#graoFilme)" />
    </svg>
  );
};

// Pedaço de papel rasgado que entra deslizando
export const PapelAnim: React.FC<{
  semente: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  atraso?: number;
  de?: "baixo" | "cima" | "esq" | "dir";
  cor?: string;
  children?: React.ReactNode;
}> = ({ semente, x, y, w, h, rot = 0, atraso = 0, de = "baixo", cor = cores.papel, children }) => {
  const p = useMola(atraso);
  const dist = 260;
  const dx = de === "esq" ? -dist : de === "dir" ? dist : 0;
  const dy = de === "baixo" ? dist : de === "cima" ? -dist : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: Math.min(1, p * 2),
        transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${rot + (1 - p) * rot * 3}deg)`,
        filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.6))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: cor,
          clipPath: poligonoRasgado(semente, { topo: true, direita: true, base: true, esquerda: true }, 1.4),
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.4, mixBlendMode: "multiply" }}>
          <filter id={`fibra-${semente}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed={semente.length} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.48  0 0 0 0 0.38  0 0 0 0.55 0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#fibra-${semente})`} />
        </svg>
        {children}
      </div>
    </div>
  );
};

// Texto de máquina de escrever, letra por letra
export const Datilografado: React.FC<{
  texto: string;
  atraso: number;
  velocidade?: number;
  style?: React.CSSProperties;
}> = ({ texto, atraso, velocidade = 1.4, style }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - atraso) * velocidade));
  const cursor = n < texto.length && frame >= atraso && Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{ fontFamily: fontes.maquina, color: cores.tinta, whiteSpace: "pre-wrap", ...style }}>
      {texto.slice(0, n)}
      <span style={{ opacity: cursor ? 1 : 0 }}>▌</span>
    </div>
  );
};

// Marca-texto que pinta da esquerda para a direita (funciona com quebra de linha)
export const MarcaTexto: React.FC<{ atraso: number; dur?: number; cor?: string; children: React.ReactNode }> = ({
  atraso,
  dur = 14,
  cor = VERMELHO,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, atraso, atraso + dur);
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${cor}AA, ${cor}AA)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p * 100}% 52%`,
        backgroundPosition: "0 96%",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
        padding: "0 6px",
      }}
    >
      {children}
    </span>
  );
};

// Carimbo que bate na tela
export const Carimbo: React.FC<{
  texto: string;
  atraso: number;
  x: number;
  y: number;
  rot?: number;
  tam?: number;
  cor?: string;
  redondo?: boolean;
}> = ({ texto, atraso, x, y, rot = -12, tam = 64, cor = VERMELHO, redondo = false }) => {
  const p = useMola(atraso, { damping: 11, stiffness: 260, mass: 0.6 });
  const frame = useCurrentFrame();
  if (frame < atraso) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${2.2 - p * 1.2})`,
        opacity: Math.min(1, p * 1.5) * 0.92,
        border: `6px solid ${cor}`,
        borderRadius: redondo ? "50%" : 6,
        padding: redondo ? 0 : "10px 26px",
        width: redondo ? tam * 3.2 : undefined,
        height: redondo ? tam * 3.2 : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fontes.anton,
        fontSize: tam,
        letterSpacing: 4,
        color: cor,
        textAlign: "center",
        lineHeight: 1,
        whiteSpace: "pre",
        mixBlendMode: "normal",
      }}
    >
      {texto}
    </div>
  );
};

// Rótulo pequeno em mono (o "chapéu" da cena)
export const Chapeu: React.FC<{ children: React.ReactNode; atraso?: number; cor?: string; style?: React.CSSProperties }> = ({
  children,
  atraso = 0,
  cor = VERMELHO,
  style,
}) => {
  const p = useMola(atraso);
  return (
    <div
      style={{
        fontFamily: fontes.mono,
        fontSize: 30,
        letterSpacing: 7,
        color: cor,
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Linha de manchete que sobe por trás de uma máscara
export const Sobe: React.FC<{ atraso: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ atraso, children, style }) => {
  const p = useMola(atraso);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 8 }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, ...style }}>{children}</div>
    </div>
  );
};

export const manchete = (tam: number, cor: string = cores.branco): React.CSSProperties => ({
  fontFamily: fontes.playfair,
  fontWeight: 900,
  fontSize: tam,
  lineHeight: 1.02,
  color: cor,
  letterSpacing: -1,
});

export const corpo = (tam: number, cor: string = cores.branco): React.CSSProperties => ({
  fontFamily: fontes.inter,
  fontWeight: 400,
  fontSize: tam,
  lineHeight: 1.35,
  color: cor,
});

// Movimento lento de câmera (zoom/pan) para a cena inteira
export const Camera: React.FC<{ de?: number; ate?: number; dur: number; origem?: string; children: React.ReactNode }> = ({
  de = 1,
  ate = 1.07,
  dur,
  origem = "50% 50%",
  children,
}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, dur], [de, ate], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origem }}>{children}</AbsoluteFill>;
};

// ---------- MAPA EM PAPEL ----------
export type Pino = { lon: number; lat: number; rotulo: string; atraso: number; lado?: "esq" | "dir"; grande?: boolean };
export type Rota = { pontos: [number, number][]; inicio: number; fim: number; tracejada?: boolean };

export const MapaPapel: React.FC<{
  id: string;
  w: number;
  h: number;
  centro: [number, number];
  escala: number;
  destaques?: { nome: string; atraso: number; hachura?: boolean }[];
  rotas?: Rota[];
  pinos?: Pino[];
  tinta?: string;
  desenho?: [number, number]; // frames em que os contornos se desenham
}> = ({ id, w, h, centro, escala, destaques = [], rotas = [], pinos = [], tinta = cores.tinta, desenho }) => {
  const frame = useCurrentFrame();
  const proj = geoEquirectangular().center(centro).scale(escala).translate([w / 2, h / 2]);
  const path = geoPath(proj);
  const pd = desenho ? prog(frame, desenho[0], desenho[1]) : 1;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={`hach-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={VERMELHO} strokeWidth="5" />
          </pattern>
        </defs>
        <path d={path(geoGraticule10()) ?? ""} fill="none" stroke={tinta} strokeOpacity={0.12} strokeWidth={1} />
        {paises50.features.map((f, i) => {
          const d = destaques.find((x) => x.nome === f.properties.name);
          const pf = d ? prog(frame, d.atraso, d.atraso + 14) : 0;
          return (
            <g key={i}>
              <path d={path(f) ?? ""} fill={tinta} fillOpacity={0.07 * pd} stroke={tinta} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pd} />
              {d ? (
                <path d={path(f) ?? ""} fill={d.hachura ? `url(#hach-${id})` : VERMELHO} fillOpacity={d.hachura ? pf : 0.85 * pf} stroke={VERMELHO} strokeOpacity={pf} strokeWidth={3} />
              ) : null}
            </g>
          );
        })}
        {rotas.map((r, i) => {
          const pr = prog(frame, r.inicio, r.fim);
          const d = path({ type: "LineString", coordinates: r.pontos }) ?? "";
          const fimPt = proj(r.pontos[r.pontos.length - 1]) ?? [0, 0];
          return (
            <g key={i}>
              <mask id={`m-${id}-${i}`}>
                <path d={d} fill="none" stroke="white" strokeWidth={30} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pr} />
              </mask>
              <path
                d={d}
                fill="none"
                stroke={VERMELHO}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={r.tracejada === false ? undefined : "2 14"}
                mask={`url(#m-${id}-${i})`}
              />
              {pr >= 1 ? <circle cx={fimPt[0]} cy={fimPt[1]} r={10} fill={VERMELHO} /> : null}
            </g>
          );
        })}
      </svg>
      {pinos.map((p, i) => {
        const [x, y] = proj([p.lon, p.lat]) ?? [0, 0];
        const a = prog(frame, p.atraso, p.atraso + 10);
        if (a <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: a }}>
            <div
              style={{
                position: "absolute",
                left: -12,
                top: -12,
                width: 24,
                height: 24,
                borderRadius: 12,
                background: VERMELHO,
                border: `4px solid ${cores.papel}`,
                transform: `scale(${0.4 + a * 0.6})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -24,
                left: p.lado === "esq" ? undefined : 24,
                right: p.lado === "esq" ? 24 : undefined,
                whiteSpace: "nowrap",
                fontFamily: fontes.maquina,
                fontSize: p.grande ? 44 : 34,
                color: tinta,
                background: "rgba(233,226,208,0.85)",
                padding: "2px 10px",
              }}
            >
              {p.rotulo}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Ícone da boina com estrela (símbolo pop, sem retratar a pessoa)
export const Boina: React.FC<{ tam: number; cor?: string; estrela?: string }> = ({ tam, cor = cores.tinta, estrela = VERMELHO }) => {
  const pts = Array.from({ length: 10 })
    .map((_, i) => {
      const r = i % 2 === 0 ? 20 : 8;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      return `${112 + r * Math.cos(a)},${66 + r * Math.sin(a)}`;
    })
    .join(" ");
  return (
    <svg width={tam} height={tam * 0.62} viewBox="0 0 200 124">
      <path d="M14 98 Q 4 40 96 26 Q 196 16 190 80 Q 160 106 14 98 Z" fill={cor} />
      <path d="M18 104 Q 100 122 184 92" fill="none" stroke={cor} strokeWidth={9} strokeLinecap="round" />
      <polygon points={pts} fill={estrela} />
    </svg>
  );
};

// número aleatório determinístico
export const rnd = (s: string) => random(s);
