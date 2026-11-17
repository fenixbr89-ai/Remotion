import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, FONTE_TEXTO, FONTE_TITULO, LOGO, SELO_TERCA } from "./config";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Entrada com leve "pulo"
export const usePop = (delay: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 170, mass: 0.8 } });
};

// Saída rápida
export const useOut = (at: number, dur = 8) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [1, 0], { ...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0) });
};

// ---------- Fundos (azul, branco ou vermelho) com raios girando ----------
export type TipoFundo = "azul" | "branco" | "vermelho";

export const Fundo: React.FC<{ tipo?: TipoFundo }> = ({ tipo = "azul" }) => {
  const frame = useCurrentFrame();
  const base =
    tipo === "azul"
      ? `radial-gradient(circle at 50% 42%, #3aa6ff 0%, ${COR.azul} 42%, ${COR.azulEscuro} 100%)`
      : tipo === "vermelho"
        ? `radial-gradient(circle at 50% 42%, #ff4a4f 0%, ${COR.vermelho} 45%, #9e0f15 100%)`
        : "radial-gradient(circle at 50% 42%, #ffffff 0%, #f3f7fc 55%, #d9e6f5 100%)";
  const brilho = tipo === "branco" ? "rgba(26,138,230,0.10)" : "rgba(255,255,255,0.16)";
  // dois brilhos suaves que passeiam devagar pela tela inteira
  const b1x = 30 + Math.sin(frame / 50) * 25;
  const b1y = 30 + Math.cos(frame / 60) * 15;
  const b2x = 70 + Math.cos(frame / 55) * 25;
  const b2y = 75 + Math.sin(frame / 45) * 15;
  return (
    <AbsoluteFill
      style={{
        background: [
          `radial-gradient(circle at ${b1x}% ${b1y}%, ${brilho} 0%, rgba(0,0,0,0) 35%)`,
          `radial-gradient(circle at ${b2x}% ${b2y}%, ${brilho} 0%, rgba(0,0,0,0) 35%)`,
          base,
        ].join(", "),
      }}
    />
  );
};

// ---------- Caixinha de destaque (reta) ----------
export const Tag: React.FC<{
  children: React.ReactNode;
  bg: string;
  cor?: string;
  delay: number;
  size?: number;
  saida?: number;
  style?: React.CSSProperties;
}> = ({ children, bg, cor = COR.branco, delay, size = 110, saida, style }) => {
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
        padding: `${size * 0.16}px ${size * 0.3}px ${size * 0.06}px`,
        borderRadius: size * 0.18,
        scale: String(p * o),
        boxShadow: "0 10px 0 rgba(0,0,0,0.15), 0 18px 30px rgba(0,0,0,0.25)",
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
}> = ({ texto, delay, cor = COR.branco, size = 64, porPalavra = 5, saida }) => {
  const frame = useCurrentFrame();
  const o = useOut(saida ?? 99999);
  return (
    <div
      style={{
        fontFamily: FONTE_TEXTO,
        fontWeight: 700,
        fontSize: size,
        color: cor,
        display: "flex",
        gap: size * 0.28,
        justifyContent: "center",
        opacity: o,
        textShadow: cor === COR.branco ? "0 3px 10px rgba(0,0,0,0.25)" : undefined,
      }}
    >
      {texto.split(" ").map((w, i) => {
        const t = interpolate(frame, [delay + i * porPalavra, delay + i * porPalavra + 7], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <span key={i} style={{ opacity: t, translate: `0px ${(1 - t) * 24}px` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Logo (PNG sem fundo) ----------
export const Logo: React.FC<{ width: number; delay: number; saida?: number; style?: React.CSSProperties }> = ({
  width,
  delay,
  saida,
  style,
}) => {
  const p = usePop(delay, 11);
  const o = useOut(saida ?? 99999);
  return (
    <Img
      src={LOGO}
      style={{ width, scale: String(p * o), filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.35))", ...style }}
    />
  );
};

// ---------- Selo da campanha ----------
export const Selo: React.FC<{ width: number; src?: string; style?: React.CSSProperties }> = ({
  width,
  src = SELO_TERCA,
  style,
}) => (
  <Img src={src} style={{ width, filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.4))", ...style }} />
);

// ---------- Estouro amarelo atrás do preço ----------
export const Estouro: React.FC<{ size: number; cor?: string }> = ({ size, cor = COR.amarelo }) => {
  const frame = useCurrentFrame();
  const pts = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 41;
    const a = (i / 32) * Math.PI * 2;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, rotate: `${frame * 0.8}deg` }}>
      <polygon points={pts} fill={cor} />
    </svg>
  );
};

// ---------- Preço estilo encarte: caixa vermelha, número amarelo ----------
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
        display: "inline-flex",
        alignItems: "flex-start",
        background: COR.vermelho,
        color: COR.amarelo,
        fontFamily: FONTE_TITULO,
        fontWeight: 800,
        borderRadius: size * 0.14,
        padding: `${size * 0.12}px ${size * 0.18}px ${size * 0.02}px`,
        lineHeight: 0.9,
        boxShadow: "0 10px 0 rgba(0,0,0,0.15), 0 16px 28px rgba(0,0,0,0.35)",
        border: `${Math.max(3, size * 0.035)}px solid white`,
        ...style,
      }}
    >
      <span style={{ fontSize: size }}>{int}</span>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: size * 0.06 }}>
        <span style={{ fontSize: size * 0.5 }}>,{cent}</span>
        <span style={{ fontSize: size * 0.2, fontFamily: FONTE_TEXTO, fontWeight: 700, color: COR.branco }}>
          {unidade}
        </span>
      </span>
    </div>
  );
};
