import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brl } from "../calc";
import { Cinetico } from "../ui/Cinetico";
import { Icone, IconeChip, type NomeIcone } from "../ui/Icones";
import { cor, degrade, entra, fontFamily, sombra, suave } from "../tema";
import type { CenaProps } from "./props";

const num = new Intl.NumberFormat("pt-BR");

export const Mes: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const conta = suave(f, 80, 140);
  const barras = 12;
  const stats: { v: number; r: string; icone: NomeIcone; destaque?: boolean }[] = [
    { v: n.vendasPorDia, r: "vendas por dia", icone: "sacola" },
    { v: n.diasPorMes, r: "dias abertos", icone: "calendario" },
    { v: k.mes.vendas, r: "vendas no mês", icone: "grafico", destaque: true },
  ];
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 70px 300px" }}>
      <Cinetico texto="E no fim do *mês?*" inicio={8} tamanho={80} />
      <div style={{ display: "flex", gap: 18, marginTop: 50 }}>
        {stats.map((s, i) => {
          const e = entra(f, fps, 20 + i * 14, 11);
          const cnt = suave(f, 20 + i * 14, 50 + i * 14);
          return (
            <div key={s.r} style={{ flex: 1, borderRadius: 34, padding: "26px 24px", background: s.destaque ? degrade : cor.branco, border: s.destaque ? "none" : `2px solid ${cor.azulBorda}`, boxShadow: sombra, opacity: e, scale: `${0.8 + e * 0.2}` }}>
              {s.destaque ? (
                <div style={{ width: 64, height: 64, borderRadius: 20, background: cor.branco, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icone nome={s.icone} tamanho={44} />
                </div>
              ) : (
                <IconeChip nome={s.icone} tamanho={64} />
              )}
              <div style={{ color: s.destaque ? cor.branco : cor.preto, fontSize: 64, fontWeight: 800, letterSpacing: -2, marginTop: 14 }}>{num.format(Math.round(s.v * cnt))}</div>
              <div style={{ color: s.destaque ? cor.branco : cor.textoSuave, fontSize: 28, fontWeight: 700 }}>{s.r}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 300, marginTop: 50 }}>
        {Array.from({ length: barras }).map((_, i) => {
          const h = suave(f, 60 + i * 4, 100 + i * 4);
          return <div key={i} style={{ flex: 1, height: `${(25 + (i / (barras - 1)) * 75) * h}%`, borderRadius: 14, backgroundImage: degrade }} />;
        })}
      </div>

      <div style={{ marginTop: 40, borderRadius: 40, padding: "34px 44px", background: cor.verdeFundo, border: `2px solid ${cor.verde}55`, display: "flex", alignItems: "center", gap: 30, opacity: entra(f, fps, 70), translate: `0 ${(1 - entra(f, fps, 70)) * 60}px` }}>
        <Icone nome="dinheiro" tamanho={110} />
        <div>
          <div style={{ color: cor.texto, fontSize: 40, fontWeight: 700 }}>Lucro estimado no mês</div>
          <div style={{ color: cor.verde, fontSize: 110, fontWeight: 800, letterSpacing: -4, lineHeight: 1.1 }}>{brl(k.mes.lucro * conta)}</div>
          <div style={{ color: cor.textoSuave, fontSize: 32, fontWeight: 600 }}>{brl(k.lucroValor)} por venda × {num.format(k.mes.vendas)}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
