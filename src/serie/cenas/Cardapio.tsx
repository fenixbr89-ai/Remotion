import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Cinetico } from "../ui/Cinetico";
import { Icone } from "../ui/Icones";
import { cor, degrade, entra, fontFamily, sombra, suave } from "../tema";
import { destaca, type CenaProps } from "./props";

export const Cardapio: React.FC<CenaProps> = ({ n }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const foco = suave(f, 100, 130);
  const chefe = n.cardapio[n.carroChefe].nome;
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 80px 300px" }}>
      <Cinetico texto="Cardápio *enxuto.*" inicio={8} tamanho={84} />
      <Cinetico texto="Pouca opção = menos desperdício." inicio={18} intervalo={2} tamanho={42} peso={600} corTexto={cor.textoSuave} style={{ marginTop: 16 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 70 }}>
        {n.cardapio.map((c, i) => {
          const e = entra(f, fps, 28 + i * 10);
          const ehChefe = i === n.carroChefe;
          const tamanhoIcone = 70 + i * 16;
          return (
            <div
              key={c.nome}
              style={{
                padding: 4,
                borderRadius: 40,
                background: ehChefe && foco > 0 ? degrade : cor.azulBorda,
                opacity: e * (ehChefe ? 1 : 1 - foco * 0.5),
                translate: `${(1 - e) * 400}px 0`,
                scale: `${ehChefe ? 1 + foco * 0.05 : 1 - foco * 0.03}`,
                boxShadow: sombra,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "30px 40px", borderRadius: 36, background: cor.branco }}>
                <div style={{ width: 110, display: "flex", justifyContent: "center" }}>
                  <Icone nome="copo" tamanho={tamanhoIcone} style={{ scale: `${entra(f, fps, 34 + i * 10, 8)}` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: cor.texto, fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>{c.nome}</div>
                  <div style={{ color: cor.textoSuave, fontSize: 36, fontWeight: 600 }}>{c.detalhe}</div>
                </div>
                {ehChefe && (
                  <div style={{ padding: "12px 22px", borderRadius: 999, backgroundImage: degrade, color: cor.branco, fontSize: 26, fontWeight: 800, letterSpacing: 1, scale: `${entra(f, fps, 110, 9)}` }}>
                    MAIS VENDIDO
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Cinetico texto={`Vou fazer a conta do ${destaca(chefe + ",")} que é o que mais vende.`} inicio={130} intervalo={3} tamanho={50} peso={700} style={{ marginTop: 70 }} />
    </AbsoluteFill>
  );
};
