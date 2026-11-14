import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl } from "../calc";
import { Cinetico } from "../ui/Cinetico";
import { Icone, IconeChip } from "../ui/Icones";
import { cor, degrade, entra, fontFamily, sombra, suave } from "../tema";
import { destaca, type CenaProps } from "./props";

export const Custos: React.FC<CenaProps> = ({ n, k, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = 50;
  const passo = Math.floor((dur - inicio - 130) / n.itens.length);
  const linhaH = n.itens.length > 8 ? 84 : 100;
  const progresso = n.itens.map((_, i) => suave(f, inicio + i * passo + 4, inicio + i * passo + 22));
  const soma = n.itens.reduce((s, it, i) => s + it.custo * progresso[i], 0);
  const fim = inicio + n.itens.length * passo + 10;
  const pop = entra(f, fps, fim, 7);
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 70px 300px" }}>
      <Cinetico texto={`Quanto me custa o ${destaca(n.cardapio[n.carroChefe].nome)}?`} inicio={8} tamanho={72} />
      <Cinetico texto="Item por item. Até a colher." inicio={20} intervalo={2} tamanho={40} peso={600} corTexto={cor.textoSuave} style={{ marginTop: 12 }} />
      <div style={{ marginTop: 44, borderRadius: 40, background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, padding: "14px 36px" }}>
        {n.itens.map((it, i) => {
          const t = inicio + i * passo;
          const e = entra(f, fps, t, 13);
          const v = entra(f, fps, t + 8, 9);
          return (
            <div
              key={it.nome}
              style={{ height: linhaH, display: "flex", alignItems: "center", gap: 22, borderBottom: i < n.itens.length - 1 ? `2px solid ${cor.gelo}` : "none", opacity: Math.min(1, e * 1.4), translate: `${(1 - e) * -120}px 0` }}
            >
              <IconeChip nome={it.icone} tamanho={linhaH - 26} style={{ scale: `${e}` }} />
              <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 14 }}>
                <span style={{ color: cor.texto, fontSize: 42, fontWeight: 700 }}>{it.nome}</span>
                <span style={{ color: cor.textoSuave, fontSize: 30, fontWeight: 600 }}>{it.qtd}</span>
              </div>
              <span style={{ color: cor.preto, fontSize: 44, fontWeight: 800, scale: `${0.6 + v * 0.4}`, opacity: v }}>{brl(it.custo)}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 30,
          borderRadius: 36,
          padding: "30px 40px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          backgroundImage: degrade,
          scale: `${1 + pop * 0.05 - Math.max(0, pop - 1) * 0.05}`,
          boxShadow: `0 24px 60px rgba(29,78,216,${0.25 + pop * 0.2})`,
          opacity: entra(f, fps, inicio - 14),
        }}
      >
        <div style={{ width: 80, height: 80, borderRadius: 24, background: cor.branco, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icone nome="calculadora" tamanho={58} />
        </div>
        <span style={{ flex: 1, color: cor.branco, fontSize: 46, fontWeight: 700 }}>Custo total</span>
        <span style={{ color: cor.branco, fontSize: 80, fontWeight: 800, letterSpacing: -2, scale: `${interpolate(pop, [0, 1], [1, 1.08])}` }}>{brl(f >= fim ? k.custoTotal : soma)}</span>
      </div>
    </AbsoluteFill>
  );
};
