import React from "react";
import {
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, sans, useEntrada } from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/**
 * Espaço para meme / foto / vídeo. Passe `src` com um arquivo da pasta public/
 * (ex.: "memes/bob.mp4"). Sem `src`, mostra um card com emoji.
 */
export const Midia: React.FC<{
  src?: string;
  emoji?: string;
  fundo?: string;
  largura?: number;
  altura?: number;
  delay?: number;
}> = ({
  src,
  emoji = "✨",
  fundo = "linear-gradient(145deg,#2b2b2b,#0e0e0e)",
  largura = 560,
  altura = 560,
  delay = 4,
}) => {
  const anim = useEntrada(delay);
  const box: React.CSSProperties = {
    width: largura,
    height: altura,
    borderRadius: 36,
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
    ...anim,
  };
  if (src) {
    const url = src.startsWith("http") ? src : staticFile(src);
    const ehVideo = /\.(mp4|mov|webm)$/i.test(src);
    return (
      <div style={box}>
        {ehVideo ? (
          <OffthreadVideo
            src={url}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Img
            src={url}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
    );
  }
  return (
    <div
      style={{
        ...box,
        background: fundo,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: largura * 0.42,
      }}
    >
      {emoji}
    </div>
  );
};

/** Roleta preta e branca que gira e para no segmento `alvo`. */
export const Roleta: React.FC<{
  opcoes: string[];
  alvo: string;
  duracao: number;
}> = ({ opcoes, alvo, duracao }) => {
  const frame = useCurrentFrame();
  const n = opcoes.length;
  const passo = 360 / n;
  const i = Math.max(0, opcoes.indexOf(alvo));
  const final = 360 * 5 - (i * passo + passo / 2);
  const rot = interpolate(frame, [0, duracao], [0, final], {
    ...clamp,
    easing: Easing.bezier(0.15, 0.6, 0.15, 1),
  });
  const R = 300;
  const fatia = (k: number) => {
    const a0 = ((k * passo - 90) * Math.PI) / 180;
    const a1 = (((k + 1) * passo - 90) * Math.PI) / 180;
    return `M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${
      R * Math.cos(a1)
    } ${R * Math.sin(a1)} Z`;
  };
  return (
    <div style={{ position: "relative", width: 640, height: 680 }}>
      <svg
        width={60}
        height={60}
        viewBox="0 0 60 60"
        style={{ position: "absolute", left: 290, top: 0, zIndex: 2 }}
      >
        <path d="M6 4 H54 L30 52 Z" fill={C.preto} />
      </svg>
      <svg
        width={640}
        height={640}
        viewBox="-320 -320 640 640"
        style={{ position: "absolute", top: 40, rotate: `${rot}deg` }}
      >
        <circle r={312} fill={C.preto} />
        {opcoes.map((op, k) => {
          const meio = k * passo + passo / 2;
          return (
            <g key={op}>
              <path d={fatia(k)} fill={k % 2 ? C.preto : C.branco} />
              <text
                transform={`rotate(${meio}) translate(0 -${R * 0.68}) rotate(90)`}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={k % 2 ? C.branco : C.preto}
                style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: "-0.03em",
                }}
              >
                {op}
              </text>
            </g>
          );
        })}
        <circle r={34} fill={C.preto} />
        <circle r={20} fill={C.branco} />
      </svg>
    </div>
  );
};

/** Card estilo "ficha da empresa no Google", sem botão de site. */
export const FichaGoogle: React.FC<{
  nome: string;
  nota: string;
  avaliacoes: number;
  categoria: string;
  foto?: string;
}> = ({ nome, nota, avaliacoes, categoria, foto }) => {
  const anim = useEntrada(2);
  const notaNum = parseFloat(nota.replace(",", "."));
  return (
    <div
      style={{
        width: 720,
        background: C.branco,
        borderRadius: 40,
        boxShadow: "0 30px 90px rgba(0,0,0,0.18)",
        border: "1px solid #e6e6e6",
        overflow: "hidden",
        fontFamily: sans,
        color: "#202124",
        ...anim,
      }}
    >
      <div style={{ padding: "36px 40px 24px" }}>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {nome}
        </div>
        <div style={{ fontSize: 28, color: "#5f6368", marginTop: 10 }}>
          {nota}{" "}
          <span style={{ color: "#f4b400" }}>
            {"★".repeat(Math.round(notaNum))}
          </span>{" "}
          ({avaliacoes}) · {categoria} ·{" "}
          <span style={{ color: "#188038" }}>Aberto</span>
        </div>
      </div>
      <div style={{ height: 330, display: "flex", gap: 8, padding: "0 40px" }}>
        {foto ? (
          <Img
            src={foto.startsWith("http") ? foto : staticFile(foto)}
            style={{ flex: 1, objectFit: "cover", borderRadius: 20 }}
          />
        ) : (
          <>
            <div
              style={{
                flex: 2,
                borderRadius: 20,
                background: "linear-gradient(135deg,#3a2a1c,#120d09)",
              }}
            />
            <div
              style={{
                flex: 1,
                borderRadius: 20,
                background: "linear-gradient(135deg,#5a4630,#1c140d)",
              }}
            />
          </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "30px 30px 40px",
        }}
      >
        {[
          ["📞", "Ligar"],
          ["🧭", "Rotas"],
          ["📤", "Compartilhar"],
          ["🔖", "Salvar"],
        ].map(([ic, t]) => (
          <div key={t} style={{ textAlign: "center", fontSize: 24, color: "#1a73e8" }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                border: "2px solid #dadce0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                margin: "0 auto 10px",
              }}
            >
              {ic}
            </div>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};
