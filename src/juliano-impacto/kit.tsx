import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, EASE, EASE_IN, FONT } from "../pixora/ui";

export const K = {
  laranja: "#F26A1B",
  claro: "#ECEAE6",
  escuro: "#0E0E11",
  preto: "#111111",
  branco: "#FFFFFF",
  cinza: "#5C5C62",
  zap: "#25D366",
};

/** Entrada com impacto: vem grande e desfocada (rastro de movimento) e assenta. Sai desfocando. */
export const pop = (
  f: number,
  at: number,
  out?: number,
  dur = 9,
): React.CSSProperties => {
  const i = interpolate(f, [at, at + dur], [0, 1], { ...CLAMP, easing: EASE });
  const o =
    out === undefined
      ? 0
      : interpolate(f, [out, out + 7], [0, 1], { ...CLAMP, easing: EASE_IN });
  return {
    opacity: Math.min(1, i * 1.6) * (1 - o),
    scale: String(1.35 - 0.35 * i - 0.12 * o),
    filter: `blur(${(1 - i) * 18 + o * 16}px)`,
  };
};

/**
 * Título: entra uma palavra por vez, subindo por dentro de uma máscara (o mesmo movimento do
 * texto das faixas) e sai do mesmo jeito, subindo.
 */
export const Big: React.FC<{
  readonly at: number;
  readonly out?: number;
  readonly size: number;
  readonly color: string;
  readonly weight?: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ at, out, size, color, weight = 800, y, children, style }) => {
  const f = useCurrentFrame();
  const texto = typeof children === "string" ? children : null;
  const base: React.CSSProperties = {
    position: "absolute",
    top: y,
    left: 40,
    right: 40,
    display: "flex",
    justifyContent: "center",
    columnGap: "0.24em",
    fontFamily: FONT,
    fontWeight: weight,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: "-0.03em",
    color,
    whiteSpace: "nowrap",
    ...style,
  };
  if (!texto)
    return <div style={{ ...base, ...pop(f, at, out) }}>{children}</div>;
  const palavras = texto.split(" ");
  return (
    <div style={base}>
      {palavras.map((w, n) => {
        const t0 = at + n * 4;
        const i = interpolate(f, [t0, t0 + 10], [0, 1], {
          ...CLAMP,
          easing: EASE,
        });
        const o =
          out === undefined
            ? 0
            : interpolate(f, [out + n * 2, out + n * 2 + 8], [0, 1], {
                ...CLAMP,
                easing: EASE_IN,
              });
        return (
          <span
            key={n}
            style={{
              display: "inline-block",
              overflow: "hidden",
              padding: "0.12em 0 0.16em",
              margin: "-0.12em 0 -0.16em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0px ${(1 - i) * 105 - o * 105}%`,
                filter: `blur(${(1 - i) * 6 + o * 6}px)`,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Estrela de 4 pontas laranja, desfocada, girando devagar (marca visual do estilo). */
export const Estrela: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly blur?: number;
  readonly opacity?: number;
  readonly spin?: number;
}> = ({ x, y, size, blur = 10, opacity = 1, spin = 0.3 }) => {
  const f = useCurrentFrame();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        rotate: `${f * spin}deg`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    >
      <path
        d="M50 0C54 32 68 46 100 50C68 54 54 68 50 100C46 68 32 54 0 50C32 46 46 32 50 0Z"
        fill={K.laranja}
      />
    </svg>
  );
};

/** Pessoa (ícone simples). */
export const Pessoa: React.FC<{
  readonly size: number;
  readonly color: string;
  readonly style?: React.CSSProperties;
}> = ({ size, color, style }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 80 100" style={style}>
    <circle cx="40" cy="22" r="18" fill={color} />
    <path d="M8 100V70C8 54 22 46 40 46S72 54 72 70V100Z" fill={color} />
  </svg>
);

/**
 * Faixa com fundo (estilo "Parede manchada"). Entrada: a tarja desenrola da esquerda e o texto
 * sobe por dentro; saída: o texto sobe e a tarja recolhe para a direita.
 * `classico` mantém a entrada antiga (voando de lado, com rotação) — usada no final.
 */
export const Adesivo: React.FC<{
  readonly at: number;
  readonly out?: number;
  readonly fundo: string;
  readonly cor: string;
  readonly rot?: number;
  readonly y: number;
  readonly de?: "left" | "right";
  readonly size?: number;
  readonly classico?: boolean;
  /** Frame em que um risco atravessa o texto (dentro da faixa, acompanha a inclinação). */
  readonly risco?: number;
  readonly children: React.ReactNode;
}> = ({
  at,
  out,
  fundo,
  cor,
  rot = 0,
  y,
  de = "left",
  size = 78,
  classico = false,
  risco,
  children,
}) => {
  const f = useCurrentFrame();
  if (classico) {
    const i = interpolate(f, [at, at + 10], [0, 1], { ...CLAMP, easing: EASE });
    const o =
      out === undefined
        ? 0
        : interpolate(f, [out, out + 8], [0, 1], { ...CLAMP, easing: EASE_IN });
    const vel = Math.sin(i * Math.PI);
    return (
      <div
        style={{
          position: "absolute",
          top: y,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: `${size * 0.12}px ${size * 0.4}px`,
            background: fundo,
            color: cor,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: size,
            letterSpacing: "-0.03em",
            rotate: `${rot}deg`,
            translate: `${(1 - i) * (de === "left" ? -900 : 900)}px 0px`,
            filter: `blur(${vel * 12 + o * 16}px)`,
            opacity: (1 - o) * Math.min(1, i * 2),
            boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
  const abre = interpolate(f, [at, at + 9], [0, 1], { ...CLAMP, easing: EASE });
  const texto = interpolate(f, [at + 5, at + 15], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  const sai =
    out === undefined
      ? 0
      : interpolate(f, [out, out + 8], [0, 1], { ...CLAMP, easing: EASE_IN });
  const fecha =
    out === undefined
      ? 0
      : interpolate(f, [out + 4, out + 12], [0, 1], {
          ...CLAMP,
          easing: EASE_IN,
        });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          padding: `${size * 0.12}px ${size * 0.4}px`,
          rotate: `${rot}deg`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: fundo,
            transformOrigin: fecha > 0 ? "100% 50%" : "0% 50%",
            scale: `${abre * (1 - fecha)} 1`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          }}
        />
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              color: cor,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: size,
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
              translate: `0px ${(1 - texto) * 105 - sai * 105}%`,
              filter: `blur(${(1 - texto) * 6 + sai * 6}px)`,
            }}
          >
            {children}
          </div>
          {risco !== undefined ? (
            <div
              style={{
                position: "absolute",
                left: "-2%",
                right: "-2%",
                top: "54%",
                height: Math.max(4, size * 0.08),
                borderRadius: size,
                background: cor,
                transformOrigin: "0% 50%",
                scale: `${interpolate(f, [risco, risco + 12], [0, 1], { ...CLAMP, easing: EASE })} 1`,
                opacity: 1 - sai,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

/** Risco de caneta que se desenha (sublinhado, corte ou círculo). */
export const Risco: React.FC<{
  readonly d: string;
  readonly at: number;
  readonly dur?: number;
  readonly cor: string;
  readonly width?: number;
  readonly length?: number;
  readonly out?: number;
}> = ({ d, at, dur = 14, cor, width = 12, length = 1400, out }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { ...CLAMP, easing: EASE });
  const o =
    out === undefined ? 1 : 1 - interpolate(f, [out, out + 6], [0, 1], CLAMP);
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, opacity: o }}
    >
      <path
        d={d}
        fill="none"
        stroke={cor}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - p)}
        opacity={p > 0 ? 1 : 0}
      />
    </svg>
  );
};

/** Objeto 3D do cliente / Fluent (public/juliano). */
export const Obj3D: React.FC<{
  readonly src: string;
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ src, size, style }) => (
  <Img
    src={staticFile(`juliano/${src}.png`)}
    style={{ width: size, height: size, objectFit: "contain", ...style }}
  />
);
