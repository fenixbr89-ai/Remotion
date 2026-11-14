import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CopoAcai, Raios } from "../ui/Ilustracoes";
import { cor, degrade, entra, fontFamily, suave } from "../tema";
import type { CenaProps } from "./props";

export const Cardapio: React.FC<CenaProps> = ({ n }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const foco = suave(f, 95, 125);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 320 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
          {n.cardapio.map((c, i) => {
            const e = entra(f, fps, 4 + i * 6, 11);
            const ehChefe = i === n.carroChefe;
            const base = 190 + i * 50;
            return (
              <div key={c.nome} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", opacity: e * (ehChefe ? 1 : 1 - foco * 0.6), translate: `0 ${(1 - e) * 200}px`, scale: `${ehChefe ? 1 + foco * 0.25 : 1 - foco * 0.1}`, zIndex: ehChefe ? 2 : 1 }}>
                {ehChefe && <Raios tamanho={700} style={{ top: -200, opacity: foco }} />}
                <CopoAcai tamanho={base} />
                <div style={{ marginTop: 16, padding: "12px 26px", borderRadius: 999, background: ehChefe && foco > 0.5 ? degrade : cor.branco, border: `2px solid ${cor.azulBorda}`, color: ehChefe && foco > 0.5 ? cor.branco : cor.texto, fontSize: 40, fontWeight: 800 }}>
                  {c.nome}
                </div>
                {ehChefe && (
                  <div style={{ position: "absolute", top: -60, padding: "10px 20px", borderRadius: 999, background: cor.preto, color: cor.branco, fontSize: 24, fontWeight: 800, letterSpacing: 1, scale: `${entra(f, fps, 115, 9)}` }}>
                    MAIS VENDIDO
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
