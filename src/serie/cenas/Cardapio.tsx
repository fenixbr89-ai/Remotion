import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Titulo } from "../ui/Cartao";
import { cor, entra, fontFamily, sai, suave } from "../tema";
import type { CenaProps } from "./props";

export const Cardapio: React.FC<CenaProps> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const foco = suave(f, 95, 125);
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 80px 300px", opacity: sai(f, dur) }}>
      <Titulo style={{ opacity: entra(f, fps, 0) }}>
        Cardápio <span style={{ color: n.corDestaqueClara }}>enxuto.</span>
      </Titulo>
      <div style={{ color: cor.cinza, fontSize: 44, fontWeight: 600, marginTop: 20, opacity: entra(f, fps, 8) }}>
        Pouca opção = menos desperdício.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 80 }}>
        {n.cardapio.map((c, i) => {
          const e = entra(f, fps, 20 + i * 12);
          const chefe = i === n.carroChefe;
          return (
            <div
              key={c.nome}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "44px 50px",
                borderRadius: 36,
                background: chefe ? `rgba(255,255,255,${0.06 + foco * 0.04})` : "rgba(255,255,255,0.06)",
                border: `3px solid ${chefe ? interpolate(foco, [0, 1], [0, 1]) > 0.5 ? n.corDestaque : "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.14)"}`,
                opacity: e * (chefe ? 1 : 1 - foco * 0.55),
                translate: `${(1 - e) * 300}px 0`,
                scale: chefe ? 1 + foco * 0.06 : 1 - foco * 0.03,
              }}
            >
              <div style={{ color: cor.branco, fontSize: 80, fontWeight: 800, letterSpacing: -2 }}>{c.nome}</div>
              <div style={{ color: chefe && foco > 0.5 ? n.corDestaqueClara : cor.cinza, fontSize: 38, fontWeight: 700 }}>{c.detalhe}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 80, color: cor.branco, fontSize: 52, fontWeight: 700, lineHeight: 1.25, opacity: suave(f, 120, 145), translate: `0 ${(1 - suave(f, 120, 145)) * 30}px` }}>
        Vou fazer a conta do <span style={{ color: n.corDestaqueClara }}>{n.cardapio[n.carroChefe].nome}</span>, que é o que mais vende.
      </div>
    </AbsoluteFill>
  );
};
