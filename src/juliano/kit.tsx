import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, EASE, EASE_IN, FONT } from "../pixora/ui";
import { GRADIENTE, J } from "./tema";

/** Entrada/saída assinatura: sai do desfoque (blur 20→0, escala 1.06→1) e volta pro desfoque. */
export const blur = (
  frame: number,
  inAt: number,
  outAt?: number,
  dur = 12,
  outDur = 9,
): React.CSSProperties => {
  const i = interpolate(frame, [inAt, inAt + dur], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  const o =
    outAt === undefined
      ? 0
      : interpolate(frame, [outAt, outAt + outDur], [0, 1], {
          ...CLAMP,
          easing: EASE_IN,
        });
  return {
    opacity: i * (1 - o),
    filter: `blur(${(1 - i) * 20 + o * 20}px)`,
    scale: String(1.06 - 0.06 * i - 0.03 * o),
  };
};

/** Texto com gradiente laranja da marca. */
export const Grad: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <span
    style={{
      background: GRADIENTE,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

export const Texto: React.FC<{
  readonly size: number;
  readonly weight?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ size, weight = 700, color = J.preto, style, children }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing: size > 60 ? "-0.035em" : "-0.01em",
      lineHeight: 1.08,
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Ícone do "app" Juliano Pinturas: squircle laranja com rolo de pintura branco. */
export const AppIcon: React.FC<{
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ size, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.23,
      background: `linear-gradient(160deg, ${J.ambar} 0%, ${J.laranja} 55%, #D9500A 100%)`,
      boxShadow: `0 ${size * 0.12}px ${size * 0.3}px rgba(242,106,27,0.35), inset 0 ${size * 0.02}px 0 rgba(255,255,255,0.35)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      ...style,
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 100 100">
      <rect x="10" y="12" width="66" height="26" rx="13" fill="#FFFFFF" />
      <path
        d="M76 25H86V52H48V64"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <rect x="41" y="62" width="14" height="30" rx="7" fill="#FFFFFF" />
    </svg>
  </div>
);

/** Ícone de ligação (verde, genérico). */
export const CallIcon: React.FC<{
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ size, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.23,
      background: `linear-gradient(180deg, #5BE07A 0%, ${J.verde} 100%)`,
      boxShadow: `0 0 ${size * 0.5}px rgba(52,199,89,0.45)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24">
      <path
        d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"
        fill="#FFFFFF"
      />
    </svg>
  </div>
);

/** Objeto 3D (Fluent Emoji 3D, MIT) de public/juliano/emoji. */
export const Icon3D: React.FC<{
  readonly name: string;
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ name, size, style }) => (
  <Img
    src={staticFile(`juliano/emoji/${name}.png`)}
    style={{ width: size, height: size, flexShrink: 0, ...style }}
  />
);

/** Vidro estilo iOS. */
export const vidro: React.CSSProperties = {
  background: "rgba(255,255,255,0.58)",
  backdropFilter: "blur(30px) saturate(180%)",
  WebkitBackdropFilter: "blur(30px) saturate(180%)",
  border: "1.5px solid rgba(255,255,255,0.75)",
  boxShadow: "0 24px 70px rgba(120,60,20,0.12), 0 2px 8px rgba(0,0,0,0.04)",
};

/** Cabeçalho de notificação: ícone do app, nome e "agora". */
export const NotifHeader: React.FC<{ readonly iconOpacity?: number }> = ({
  iconOpacity = 1,
}) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT }}
  >
    <AppIcon size={38} style={{ opacity: iconOpacity, boxShadow: "none" }} />
    <span
      style={{
        fontSize: 25,
        fontWeight: 600,
        color: J.cinzaEscuro,
        letterSpacing: "0.04em",
        flex: 1,
      }}
    >
      JULIANO PINTURAS
    </span>
    <span style={{ fontSize: 25, color: J.cinza }}>agora</span>
  </div>
);

/** Corpo de notificação: objeto 3D + título + subtítulo. */
export const NotifBody: React.FC<{
  readonly icon: string;
  readonly titulo: string;
  readonly sub: string;
}> = ({ icon, titulo, sub }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 26,
      marginTop: 16,
      fontFamily: FONT,
    }}
  >
    <Icon3D name={icon} size={104} />
    <div>
      <div
        style={{
          fontSize: 50,
          fontWeight: 700,
          color: J.preto,
          letterSpacing: "-0.02em",
        }}
      >
        {titulo}
      </div>
      <div style={{ fontSize: 30, color: J.cinza, marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);

/** Fundo "aurora": manchas desfocadas nas cores da marca, sempre em movimento lento. */
export const Aurora: React.FC<{ readonly opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blob = (
    x: number,
    y: number,
    r: number,
    c: string,
    k: number,
  ): React.CSSProperties => ({
    position: "absolute",
    left: x + Math.sin(t * 0.5 + k) * 60 - r,
    top: y + Math.cos(t * 0.4 + k * 2) * 60 - r,
    width: r * 2,
    height: r * 2,
    borderRadius: "50%",
    background: `radial-gradient(closest-side, ${c}, rgba(255,255,255,0))`,
    filter: "blur(40px)",
  });
  return (
    <div
      style={{ position: "absolute", inset: 0, opacity, overflow: "hidden" }}
    >
      <div style={blob(160, 420, 420, "rgba(242,106,27,0.55)", 0)} />
      <div style={blob(900, 300, 380, "rgba(255,190,90,0.55)", 1)} />
      <div style={blob(620, 1250, 460, "rgba(242,106,27,0.45)", 2)} />
      <div style={blob(150, 1600, 360, "rgba(255,159,67,0.45)", 3)} />
    </div>
  );
};
