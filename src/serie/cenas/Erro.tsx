import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Titulo } from "../ui/Cartao";
import { cor, entra, fontFamily, sai, suave } from "../tema";
import type { CenaProps } from "./props";

export const Erro: React.FC<CenaProps> = ({ n, k, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { precoErrado, taxaValor, sobra } = k.erro;
  const linhas = [
    { rotulo: "Vendeu por", valor: brl(precoErrado), c: cor.branco, t: 40 },
    { rotulo: `Taxa do app (${pct(n.taxa)})`, valor: `− ${brl(taxaValor)}`, c: "#FCA5A5", t: 80 },
    { rotulo: "Custo do produto", valor: `− ${brl(k.custoTotal)}`, c: "#FCA5A5", t: 120 },
  ];
  const barraT = suave(f, 80, 110);
  const barraC = suave(f, 120, 150);
  const fim = entra(f, fps, 165, 9);
  const tremor = f > 165 && f < 180 ? Math.sin(f * 2.2) * 8 * (1 - (f - 165) / 15) : 0;
  const w = 920;
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 80px 300px", opacity: sai(f, dur) }}>
      <Titulo style={{ fontSize: 70, opacity: entra(f, fps, 0) }}>
        O erro que eu <span style={{ color: "#FCA5A5" }}>não</span> faria:
      </Titulo>
      <div style={{ color: cor.cinza, fontSize: 44, fontWeight: 600, marginTop: 18, opacity: entra(f, fps, 10) }}>
        Cobrar {brl(precoErrado)} "porque todo mundo cobra".
      </div>

      <div style={{ marginTop: 60, borderRadius: 40, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.14)", padding: "16px 46px" }}>
        {linhas.map((l) => {
          const e = entra(f, fps, l.t);
          return (
            <div key={l.rotulo} style={{ height: 104, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid rgba(255,255,255,0.08)", opacity: e, translate: `0 ${(1 - e) * 30}px` }}>
              <span style={{ color: cor.branco, fontSize: 46, fontWeight: 600 }}>{l.rotulo}</span>
              <span style={{ color: l.c, fontSize: 50, fontWeight: 800 }}>{l.valor}</span>
            </div>
          );
        })}
        {/* barra: o preço inteiro sendo comido pela taxa e pelo custo */}
        <div style={{ margin: "34px 0 24px", height: 54, width: w - 92, borderRadius: 27, background: cor.verde, position: "relative", overflow: "hidden", opacity: entra(f, fps, 40) }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: ((taxaValor / precoErrado) * (w - 92)) * barraT, background: cor.vermelho }} />
          <div style={{ position: "absolute", left: (taxaValor / precoErrado) * (w - 92), top: 0, bottom: 0, width: ((k.custoTotal / precoErrado) * (w - 92)) * barraC, background: "#9CA3AF" }} />
        </div>
      </div>

      <div style={{ marginTop: 60, textAlign: "center", opacity: Math.min(1, fim * 2), scale: interpolate(fim, [0, 1], [0.6, 1]), translate: `${tremor}px 0` }}>
        <div style={{ color: cor.branco, fontSize: 52, fontWeight: 700 }}>Sobrava só</div>
        <div style={{ color: cor.vermelho, fontSize: 190, fontWeight: 800, letterSpacing: -6, lineHeight: 1.05 }}>{brl(sobra)}</div>
        <div style={{ color: cor.cinza, fontSize: 42, fontWeight: 600, marginTop: 10, opacity: suave(f, 200, 225) }}>Um cupom de desconto e já é prejuízo.</div>
      </div>
    </AbsoluteFill>
  );
};
