import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl } from "../calc";
import { Titulo } from "../ui/Cartao";
import { cor, entra, fontFamily, sai, suave } from "../tema";
import type { CenaProps } from "./props";

export const Custos: React.FC<CenaProps> = ({ n, k, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = 45;
  const passo = Math.floor((dur - inicio - 130) / n.itens.length);
  const linhaH = n.itens.length > 8 ? 84 : 104;
  // soma acumulada até o item que acabou de entrar
  const progresso = n.itens.map((_, i) => suave(f, inicio + i * passo, inicio + i * passo + 18));
  const soma = n.itens.reduce((s, it, i) => s + it.custo * progresso[i], 0);
  const fim = inicio + n.itens.length * passo + 10;
  const destaqueTotal = entra(f, fps, fim, 8);
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 70px 300px", opacity: sai(f, dur) }}>
      <Titulo style={{ fontSize: 70, opacity: entra(f, fps, 0) }}>
        Quanto me custa o <span style={{ color: n.corDestaqueClara }}>{n.cardapio[n.carroChefe].nome}</span>?
      </Titulo>
      <div style={{ color: cor.cinza, fontSize: 40, fontWeight: 600, marginTop: 14, opacity: entra(f, fps, 8) }}>Item por item. Até a colher.</div>
      <div style={{ marginTop: 50, borderRadius: 40, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.14)", padding: "20px 46px" }}>
        {n.itens.map((it, i) => {
          const e = entra(f, fps, inicio + i * passo, 13);
          return (
            <div
              key={it.nome}
              style={{
                height: linhaH,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: i < n.itens.length - 1 ? "1.5px solid rgba(255,255,255,0.08)" : "none",
                opacity: e,
                translate: `${(1 - e) * -80}px 0`,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <span style={{ color: cor.branco, fontSize: 46, fontWeight: 700 }}>{it.nome}</span>
                <span style={{ color: cor.cinza, fontSize: 32, fontWeight: 600 }}>{it.qtd}</span>
              </div>
              <span style={{ color: cor.branco, fontSize: 46, fontWeight: 800 }}>{brl(it.custo)}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 34,
          borderRadius: 36,
          padding: "34px 46px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: `linear-gradient(90deg, ${cor.azulEscuro}, ${cor.azul})`,
          scale: interpolate(destaqueTotal, [0, 1], [1, 1.05]),
          boxShadow: `0 20px 60px rgba(59,130,246,${0.2 + destaqueTotal * 0.3})`,
          opacity: entra(f, fps, inicio - 10),
        }}
      >
        <span style={{ color: cor.branco, fontSize: 48, fontWeight: 700 }}>Custo total</span>
        <span style={{ color: cor.branco, fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>{brl(f >= fim ? k.custoTotal : soma)}</span>
      </div>
    </AbsoluteFill>
  );
};
