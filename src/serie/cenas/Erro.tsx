import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Cinetico } from "../ui/Cinetico";
import { Icone, IconeChip, type NomeIcone } from "../ui/Icones";
import { cor, entra, fontFamily, sombra, suave } from "../tema";
import type { CenaProps } from "./props";

export const Erro: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { precoErrado, taxaValor, sobra } = k.erro;
  const linhas: { rotulo: string; valor: string; c: string; t: number; icone: NomeIcone }[] = [
    { rotulo: "Vendeu por", valor: brl(precoErrado), c: cor.preto, t: 50, icone: "dinheiro" },
    { rotulo: `Taxa do app (${pct(n.taxa)})`, valor: `− ${brl(taxaValor)}`, c: cor.vermelho, t: 85, icone: "app" },
    { rotulo: "Custo do produto", valor: `− ${brl(k.custoTotal)}`, c: cor.vermelho, t: 120, icone: "copo" },
  ];
  const barraT = suave(f, 90, 118);
  const barraC = suave(f, 125, 155);
  // o valor que sobra vai encolhendo conforme taxa e custo são descontados
  const restante = precoErrado - taxaValor * barraT - k.custoTotal * barraC;
  const fim = entra(f, fps, 165, 9);
  const tremor = f > 165 && f < 185 ? Math.sin(f * 2.4) * 10 * (1 - (f - 165) / 20) : 0;
  const larg = 836;
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 80px 300px" }}>
      <Cinetico texto="O erro que eu *não* faria:" inicio={8} tamanho={76} tom="vermelho" />
      <Cinetico texto={`Cobrar ${brl(precoErrado)} "porque todo mundo cobra".`} inicio={22} intervalo={2} tamanho={42} peso={600} corTexto={cor.textoSuave} style={{ marginTop: 14 }} />

      <div style={{ marginTop: 50, borderRadius: 40, background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, padding: "14px 40px 30px" }}>
        {linhas.map((l) => {
          const e = entra(f, fps, l.t);
          return (
            <div key={l.rotulo} style={{ height: 104, display: "flex", alignItems: "center", gap: 22, borderBottom: `2px solid ${cor.gelo}`, opacity: Math.min(1, e * 1.4), translate: `0 ${(1 - e) * 40}px` }}>
              <IconeChip nome={l.icone} tamanho={72} style={{ scale: `${e}` }} />
              <span style={{ flex: 1, color: cor.texto, fontSize: 42, fontWeight: 600 }}>{l.rotulo}</span>
              <span style={{ color: l.c, fontSize: 46, fontWeight: 800 }}>{l.valor}</span>
            </div>
          );
        })}
        <div style={{ marginTop: 30, height: 50, width: larg, borderRadius: 25, background: cor.verde, position: "relative", overflow: "hidden", opacity: entra(f, fps, 50) }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (taxaValor / precoErrado) * larg * barraT, background: cor.vermelho }} />
          <div style={{ position: "absolute", left: (taxaValor / precoErrado) * larg, top: 0, bottom: 0, width: (k.custoTotal / precoErrado) * larg * barraC, background: "#CBD5E1" }} />
        </div>
      </div>

      <div style={{ marginTop: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, opacity: Math.min(1, entra(f, fps, 90) * 2) }}>
        <Icone nome="alerta" tamanho={130} style={{ scale: `${fim}`, translate: `${tremor}px 0` }} />
        <div>
          <div style={{ color: cor.texto, fontSize: 46, fontWeight: 700 }}>{f < 160 ? "Sobra…" : "Sobrava só"}</div>
          <div style={{ color: cor.vermelho, fontSize: 150, fontWeight: 800, letterSpacing: -5, lineHeight: 1.05, scale: `${interpolate(fim, [0, 1], [1, 1.06])}`, transformOrigin: "left center" }}>
            {brl(f >= 160 ? sobra : restante)}
          </div>
        </div>
      </div>
      <Cinetico texto="Um *cupom* de desconto e já é *prejuízo.*" inicio={200} intervalo={3} tamanho={42} peso={700} tom="vermelho" alinhar="center" style={{ marginTop: 26 }} />
    </AbsoluteFill>
  );
};
