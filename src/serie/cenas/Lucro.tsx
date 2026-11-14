import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Batida } from "../ui/Batida";
import { Odometro } from "../ui/Odometro";
import { cor, degrade, entra, fontFamily, sombra, suave } from "../tema";
import type { CenaProps } from "./props";
import { Topo } from "./Topo";

const num = new Intl.NumberFormat("pt-BR");

export const Mes: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dia = Math.max(1, Math.min(n.diasPorMes, Math.ceil(suave(f, 30, 80) * n.diasPorMes)));
  const vendas = Math.round(suave(f, 6, 30) * n.vendasPorDia);
  const total = entra(f, fps, 92, 9);
  const flip = (f - 30) % 2 < 1 && f > 30 && f < 80;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="E no fim do *mês?*" tamanho={80} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 480, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <div style={{ borderRadius: 36, padding: "26px 34px", background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, textAlign: "center", scale: `${entra(f, fps, 0, 10)}` }}>
          <div style={{ color: cor.preto, fontSize: 110, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{vendas}</div>
          <div style={{ color: cor.textoSuave, fontSize: 30, fontWeight: 700 }}>copos por dia</div>
        </div>
        <div style={{ color: cor.azul, fontSize: 90, fontWeight: 800, opacity: entra(f, fps, 24) }}>×</div>
        <div style={{ borderRadius: 36, overflow: "hidden", background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, width: 260, textAlign: "center", scale: `${entra(f, fps, 26, 10)}` }}>
          <div style={{ background: degrade, color: cor.branco, fontSize: 30, fontWeight: 800, padding: "12px 0", letterSpacing: 2 }}>DIAS</div>
          <div style={{ color: cor.preto, fontSize: 120, fontWeight: 800, letterSpacing: -4, lineHeight: 1.2, translate: `0 ${flip ? -8 : 0}px` }}>{dia}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", color: cor.texto, fontSize: 48, fontWeight: 700, opacity: suave(f, 80, 90) }}>
        = {num.format(k.mes.vendas)} copos no mês
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 940, borderRadius: 44, padding: "40px 40px", background: cor.verdeFundo, border: `3px solid ${cor.verde}66`, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, total * 3), scale: `${interpolate(total, [0, 1], [1.6, 1])}` }}>
        <div style={{ color: cor.texto, fontSize: 40, fontWeight: 700 }}>Lucro no mês</div>
        <Odometro valor={k.mes.lucro * suave(f, 94, 135)} final={k.mes.lucro} tamanho={124} cor={cor.verde} />
      </div>
      {Array.from({ length: 8 }).map((_, i) => {
        const t = 100 + i * 4;
        const e = suave(f, t, t + 30);
        const x = 540 + Math.cos(i * 0.8) * 420 * e;
        const y = 1150 - Math.sin(i * 1.3 + 1) * 320 * e - e * 180;
        return f > t && e < 1 ? (
          <div key={i} style={{ position: "absolute", left: x - 34, top: y, width: 68, height: 68, borderRadius: 34, background: degrade, color: cor.branco, fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - e }}>
            R$
          </div>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

export const Frase: React.FC<CenaProps> = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Batida
      gap={0}
      linhas={[
        { texto: "Isso é", em: 0, tamanho: 64, corTexto: cor.textoSuave, peso: 700 },
        { texto: "PREÇO", em: 6, tamanho: 220, efeito: "slam", degrade: true },
        { texto: "CERTO.", em: 14, tamanho: 220, efeito: "slam", degrade: true },
      ]}
    />
  </AbsoluteFill>
);

