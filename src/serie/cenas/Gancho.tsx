import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { cor, entra, fontFamily, sai } from "../tema";
import type { CenaProps } from "./props";

const PALAVRAS = ["O", "que", "eu", "faria", "se", "abrisse"];

export const Gancho: React.FC<CenaProps> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nome = entra(f, fps, 34, 9);
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", opacity: sai(f, dur) }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 26px", width: 900, color: cor.branco, fontSize: 104, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>
        {PALAVRAS.map((p, i) => {
          const e = entra(f, fps, 4 + i * 4, 12);
          return (
            <span key={p} style={{ opacity: e, translate: `0 ${(1 - e) * 60}px`, display: "inline-block" }}>
              {p}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 40, color: "rgba(255,255,255,0.7)", fontSize: 64, fontWeight: 700, opacity: entra(f, fps, 30) }}>{n.artigo}</div>
      <div
        style={{
          marginTop: 4,
          padding: "18px 50px 26px",
          borderRadius: 36,
          background: n.corDestaque,
          color: cor.branco,
          fontSize: n.nome.length > 10 ? 120 : 140,
          fontWeight: 800,
          letterSpacing: -4,
          textTransform: "uppercase",
          scale: interpolate(nome, [0, 1], [0.3, 1]),
          rotate: `${interpolate(nome, [0, 1], [-12, -3])}deg`,
          opacity: Math.min(1, nome * 2),
          boxShadow: `0 30px 80px ${n.corDestaque}88`,
        }}
      >
        {n.nome}?
      </div>
      <div style={{ marginTop: 90, color: cor.azulClaro, fontSize: 44, fontWeight: 700, opacity: entra(f, fps, 70) }}>
        Começando pelo preço.
      </div>
    </AbsoluteFill>
  );
};
