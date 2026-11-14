import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Cinetico } from "../ui/Cinetico";
import { Etiqueta } from "../ui/Etiqueta";
import { IconeChip, type NomeIcone } from "../ui/Icones";
import { cor, entra, fontFamily, sombra, suave } from "../tema";
import type { CenaProps } from "./props";

const dec = (v: number) => v.toFixed(2).replace(".", ",");

export const Conta: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const etq = entra(f, fps, 135, 9);
  const contador = suave(f, 138, 175);
  const divisor = 1 - n.taxa - n.lucro;
  const partes: { r: string; v: string; c: string; icone: NomeIcone; peso: number }[] = [
    { r: "Custo", v: brl(k.custoTotal), c: "#94A3B8", icone: "copo", peso: k.custoTotal },
    { r: `Taxa ${pct(n.taxa)}`, v: brl(k.taxaValor), c: cor.vermelho, icone: "taxa", peso: k.taxaValor },
    { r: `Lucro ${pct(n.lucro)}`, v: brl(k.lucroValor), c: cor.verde, icone: "dinheiro", peso: k.lucroValor },
  ];
  const barra = suave(f, 200, 240);
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 70px 300px" }}>
      <Cinetico texto="A conta *certa:*" inicio={8} tamanho={80} />
      <Cinetico texto={`Quero ${pct(n.lucro)} de lucro depois da taxa.`} inicio={18} intervalo={2} tamanho={42} peso={600} corTexto={cor.textoSuave} style={{ marginTop: 14 }} />
      <div style={{ marginTop: 44, borderRadius: 40, background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, padding: "36px 20px", display: "flex", flexDirection: "column", gap: 18, opacity: entra(f, fps, 24) }}>
        <Cinetico texto="*preço* = custo ÷ (1 − taxa − lucro)" inicio={34} intervalo={3} tamanho={50} alinhar="center" />
        <Cinetico texto={`*${dec(k.custoTotal)}* ÷ (1 − ${dec(n.taxa)} − ${dec(n.lucro)})`} inicio={70} intervalo={3} tamanho={50} alinhar="center" corTexto={cor.preto} />
        <Cinetico texto={`= ${dec(k.custoTotal)} ÷ *${dec(divisor)}*`} inicio={100} intervalo={3} tamanho={50} alinhar="center" corTexto={cor.textoSuave} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 56 }}>
        <div style={{ opacity: Math.min(1, etq * 2), translate: `0 ${(1 - etq) * -260}px`, scale: `${0.7 + etq * 0.3}` }}>
          <Etiqueta valor={brl(k.preco * contador)} />
        </div>
      </div>

      <div style={{ display: "flex", height: 26, borderRadius: 13, overflow: "hidden", marginTop: 50, opacity: entra(f, fps, 195) }}>
        {partes.map((p) => (
          <div key={p.r} style={{ width: `${(p.peso / k.preco) * 100 * barra}%`, background: p.c }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
        {partes.map((p, i) => {
          const e = entra(f, fps, 200 + i * 10);
          return (
            <div key={p.r} style={{ flex: 1, borderRadius: 30, padding: "22px 20px", background: cor.branco, border: `2px solid ${p.c}55`, boxShadow: sombra, opacity: e, translate: `0 ${(1 - e) * 50}px` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconeChip nome={p.icone} tamanho={52} />
                <span style={{ color: p.c, fontSize: 30, fontWeight: 800 }}>{p.r}</span>
              </div>
              <div style={{ color: cor.preto, fontSize: 46, fontWeight: 800, marginTop: 10, letterSpacing: -1 }}>{p.v}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
