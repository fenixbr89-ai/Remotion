import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brl } from "../calc";
import { Titulo } from "../ui/Cartao";
import { cor, entra, fontFamily, sai, suave } from "../tema";
import type { CenaProps } from "./props";

const num = new Intl.NumberFormat("pt-BR");

export const Mes: React.FC<CenaProps> = ({ n, k, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const conta = suave(f, 70, 130);
  const barras = 12;
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 80px 300px", opacity: sai(f, dur) }}>
      <Titulo style={{ fontSize: 72, opacity: entra(f, fps, 0) }}>
        E no fim do <span style={{ color: n.corDestaqueClara }}>mês</span>?
      </Titulo>
      <div style={{ display: "flex", gap: 20, marginTop: 60 }}>
        {[
          { v: `${n.vendasPorDia}`, r: "vendas por dia" },
          { v: `${n.diasPorMes}`, r: "dias abertos" },
          { v: num.format(k.mes.vendas), r: "vendas no mês" },
        ].map((b, i) => {
          const e = entra(f, fps, 12 + i * 14);
          return (
            <div key={b.r} style={{ flex: 1, borderRadius: 32, padding: "30px 26px", background: i === 2 ? n.corDestaque : "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.14)", opacity: e, scale: 0.8 + e * 0.2 }}>
              <div style={{ color: cor.branco, fontSize: 70, fontWeight: 800, letterSpacing: -2 }}>{b.v}</div>
              <div style={{ color: i === 2 ? cor.branco : cor.cinza, fontSize: 32, fontWeight: 700 }}>{b.r}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 380, marginTop: 70 }}>
        {Array.from({ length: barras }).map((_, i) => {
          const h = suave(f, 60 + i * 4, 100 + i * 4);
          return <div key={i} style={{ flex: 1, height: `${(25 + (i / (barras - 1)) * 75) * h}%`, borderRadius: 14, background: `linear-gradient(180deg, ${cor.azulClaro}, ${cor.azul})` }} />;
        })}
      </div>

      <div style={{ marginTop: 60, borderRadius: 40, padding: "40px 50px", background: "rgba(34,197,94,0.12)", border: `2px solid ${cor.verde}88`, opacity: entra(f, fps, 60) }}>
        <div style={{ color: cor.branco, fontSize: 44, fontWeight: 700 }}>Lucro estimado no mês</div>
        <div style={{ color: cor.verde, fontSize: 130, fontWeight: 800, letterSpacing: -4, lineHeight: 1.1 }}>{brl(k.mes.lucro * conta)}</div>
        <div style={{ color: cor.cinza, fontSize: 36, fontWeight: 600 }}>{brl(k.lucroValor)} por venda × {num.format(k.mes.vendas)}</div>
      </div>
    </AbsoluteFill>
  );
};
