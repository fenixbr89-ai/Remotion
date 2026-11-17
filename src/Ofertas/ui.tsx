import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, FONTE_TEXTO, FONTE_TITULO, LOGO, SELO } from "./config";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Entrada com leve "pulo"
export const usePop = (delay: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 170, mass: 0.8 } });
};

// Saída rápida
export const useOut = (at: number, dur = 8) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [1, 0], { ...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0) });
};

// Fundo azul da marca com raios de luz girando devagar
export const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ background: `radial-gradient(circle at 50% 40%, #3aa6ff 0%, ${COR.azul} 40%, ${COR.azulEscuro} 100%)` }}
    >
      <AbsoluteFill
        style={{
          left: -500,
          right: -500,
          top: -100,
          bottom: -100,
          background:
            "repeating-conic-gradient(from 0deg at 50% 45%, rgba(255,255,255,0.07) 0deg 8deg, rgba(255,255,255,0) 8deg 20deg)",
          rotate: `${frame * 0.15}deg`,
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 40%, rgba(5,20,70,0.45) 100%)" }}
      />
    </AbsoluteFill>
  );
};

// Faixa de texto reta
export const Tag: React.FC<{
  children: React.ReactNode;
  bg: string;
  cor?: string;
  delay: number;
  size?: number;
  saida?: number;
  style?: React.CSSProperties;
}> = ({ children, bg, cor = COR.branco, delay, size = 100, saida, style }) => {
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
        boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Texto que sobe suave
export const Texto: React.FC<{
  children: React.ReactNode;
  delay: number;
  size?: number;
  cor?: string;
  saida?: number;
  style?: React.CSSProperties;
}> = ({ children, delay, size = 60, cor = COR.branco, saida, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 10], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const o = useOut(saida ?? 99999);
  return (
    <div
      style={{
        fontFamily: FONTE_TEXTO,
        fontWeight: 700,
        fontSize: size,
        color: cor,
        textAlign: "center",
        opacity: t * o,
        translate: `0px ${(1 - t) * 30}px`,
        textShadow: "0 4px 12px rgba(0,0,0,0.3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

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

export const Selo: React.FC<{ width: number; delay: number; saida?: number; style?: React.CSSProperties }> = ({
  width,
  delay,
  saida,
  style,
}) => {
  const p = usePop(delay, 10);
  const o = useOut(saida ?? 99999);
  return (
    <Img
      src={SELO}
      style={{ width, scale: String(p * o), filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.4))", ...style }}
    />
  );
};

// Preço no estilo do encarte: caixa vermelha, número amarelo
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
        boxShadow: "0 12px 26px rgba(0,0,0,0.35)",
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
