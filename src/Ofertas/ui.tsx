import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COR, FONTE_TEXTO, FONTE_TITULO, LOGO, SELO } from "./config";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Pop com leve "overshoot", como nos tags da referência
export const usePop = (delay: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 170, mass: 0.8 } });
};

// Saída rápida (escala para 0)
export const useOut = (at: number, dur = 8) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [1, 0], {
    ...clamp,
    easing: Easing.bezier(0.5, 0, 0.75, 0),
  });
};

// ---------- Fundos ----------
export const Fundo: React.FC<{ tipo: "verde" | "laranja" | "creme" }> = ({ tipo }) => {
  const bg =
    tipo === "verde"
      ? `radial-gradient(circle at 50% 42%, ${COR.verdeClaro} 0%, ${COR.verde} 45%, #229a31 100%)`
      : tipo === "laranja"
        ? `radial-gradient(circle at 50% 48%, #ffc23a 0%, ${COR.laranja} 45%, ${COR.laranjaEscuro} 100%)`
        : `radial-gradient(circle at 50% 40%, #ffffff 0%, ${COR.creme} 55%, #e4e1d9 100%)`;
  return <AbsoluteFill style={{ background: bg }} />;
};

// ---------- Folhas decorativas ----------
const Folha: React.FC<{ cor: string; style: React.CSSProperties }> = ({ cor, style }) => (
  <svg viewBox="0 0 200 110" style={{ position: "absolute", ...style }}>
    <path
      d="M5 55 C 50 -5, 150 -5, 195 55 C 150 115, 50 115, 5 55 Z"
      fill={cor}
      style={{ filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.25))" }}
    />
    <path d="M15 55 C 70 45, 130 45, 185 55" stroke="rgba(0,0,0,0.18)" strokeWidth="5" fill="none" />
  </svg>
);

export const Folhas: React.FC<{ delay?: number; claro?: boolean }> = ({ delay = 0, claro }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay, 14);
  const sway = Math.sin((frame - delay) / 14) * 4;
  const base = (rot: number, extra = 0): React.CSSProperties => ({
    scale: String(p),
    rotate: `${rot + sway + extra}deg`,
  });
  return (
    <AbsoluteFill>
      <Folha cor={claro ? COR.verde : "#e9f3e2"} style={{ left: 40, top: 90, width: 170, ...base(-35) }} />
      <Folha cor={COR.laranja} style={{ right: 50, top: 120, width: 200, ...base(12) }} />
      <Folha cor={COR.laranja} style={{ left: -30, bottom: 120, width: 200, ...base(25, -sway * 2) }} />
      <Folha cor={claro ? COR.verde : "#e9f3e2"} style={{ right: -20, bottom: 70, width: 170, ...base(-20, -sway * 2) }} />
    </AbsoluteFill>
  );
};

// ---------- Tag (caixinha de texto inclinada) ----------
export const Tag: React.FC<{
  children: React.ReactNode;
  bg: string;
  cor?: string;
  delay: number;
  rot?: number;
  size?: number;
  saida?: number;
  style?: React.CSSProperties;
}> = ({ children, bg, cor = COR.branco, delay, rot = -3, size = 110, saida, style }) => {
  const p = usePop(delay);
  const o = useOut(saida ?? 99999);
  return (
    <div
      style={{
        display: "inline-block",
        background: bg,
        color: cor,
        fontFamily: FONTE_TITULO,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        padding: `${size * 0.16}px ${size * 0.28}px ${size * 0.06}px`,
        borderRadius: size * 0.18,
        rotate: `${rot}deg`,
        scale: String(p * o),
        boxShadow: "0 10px 0 rgba(0,0,0,0.18), 0 18px 30px rgba(0,0,0,0.25)",
        textShadow: "0 4px 0 rgba(0,0,0,0.15)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------- Texto que aparece palavra por palavra ----------
export const Palavras: React.FC<{
  texto: string;
  delay: number;
  cor?: string;
  size?: number;
  porPalavra?: number;
  saida?: number;
  style?: React.CSSProperties;
}> = ({ texto, delay, cor = COR.branco, size = 58, porPalavra = 5, saida, style }) => {
  const frame = useCurrentFrame();
  const o = useOut(saida ?? 99999);
  return (
    <div
      style={{
        fontFamily: FONTE_TEXTO,
        fontWeight: 700,
        fontSize: size,
        color: cor,
        rotate: "-3deg",
        display: "flex",
        gap: size * 0.28,
        justifyContent: "center",
        opacity: o,
        textShadow: cor === COR.branco ? "0 3px 8px rgba(0,0,0,0.2)" : undefined,
        ...style,
      }}
    >
      {texto.split(" ").map((w, i) => {
        const t = interpolate(frame, [delay + i * porPalavra, delay + i * porPalavra + 6], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <span key={i} style={{ opacity: t, translate: `0px ${(1 - t) * 20}px` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Logo do mercado em cartão ----------
export const LogoCard: React.FC<{ delay: number; width?: number; saida?: number; style?: React.CSSProperties }> = ({
  delay,
  width = 520,
  saida,
  style,
}) => {
  const p = usePop(delay, 12);
  const o = useOut(saida ?? 99999);
  return (
    <div
      style={{
        width,
        borderRadius: width * 0.09,
        overflow: "hidden",
        border: `${width * 0.025}px solid white`,
        boxShadow: "0 14px 0 rgba(0,0,0,0.15), 0 24px 50px rgba(0,0,0,0.3)",
        scale: String(p * o),
        rotate: `${(1 - p) * -10 - 2}deg`,
        ...style,
      }}
    >
      <Img src={LOGO} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

// ---------- Selo da campanha (Festival Suíno) ----------
export const Selo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <Img
    src={SELO}
    style={{ width, filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.35))", ...style }}
  />
);

// ---------- Preço estilo encarte ----------
export const Preco: React.FC<{ preco: string; unidade: string; size?: number; style?: React.CSSProperties }> = ({
  preco,
  unidade,
  size = 150,
  style,
}) => {
  const [int, cent] = preco.split(",");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        background: COR.laranja,
        color: COR.verdeEscuro,
        fontFamily: FONTE_TITULO,
        fontWeight: 800,
        borderRadius: size * 0.16,
        padding: `${size * 0.1}px ${size * 0.16}px ${size * 0.02}px`,
        lineHeight: 0.9,
        boxShadow: "0 8px 0 rgba(0,0,0,0.15), 0 14px 24px rgba(0,0,0,0.25)",
        border: "6px solid white",
        ...style,
      }}
    >
      <span style={{ fontSize: size }}>{int},</span>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: size * 0.08 }}>
        <span style={{ fontSize: size * 0.48 }}>{cent}</span>
        <span style={{ fontSize: size * 0.22, fontFamily: FONTE_TEXTO, fontWeight: 700 }}>{unidade}</span>
      </span>
    </div>
  );
};
