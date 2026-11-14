import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl } from "../calc";
import { Icone, IconeChip } from "../ui/Icones";
import { CopoAcai, Raios } from "../ui/Ilustracoes";
import { Legenda } from "../ui/Legenda";
import { cor, degrade, entra, fontFamily, sombra, suave } from "../tema";
import type { CenaProps } from "./props";

/** Ingredientes surgem ao lado do copo com o preço e "voam" pra dentro dele; o custo vai somando. */
export const Custos: React.FC<CenaProps> = ({ n, k, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = 50;
  const passo = Math.floor((dur - inicio - 150) / n.itens.length);
  const absorvido = (i: number) => suave(f, inicio + i * passo + 26, inicio + i * passo + 38);
  const soma = n.itens.reduce((s, it, i) => s + it.custo * absorvido(i), 0);
  const fim = inicio + n.itens.length * passo + 10;
  const pop = entra(f, fps, fim, 7);
  // o copo "pula" a cada ingrediente que cai nele
  const pulo = n.itens.reduce((s, _, i) => {
    const t = inicio + i * passo + 38;
    return s + (f >= t && f < t + 12 ? Math.sin(((f - t) / 12) * Math.PI) * 0.06 : 0);
  }, 0);
  const copo = entra(f, fps, 10, 12);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda
        frases={[
          { em: 4, l1: "Primeiro, o *custo real*", l2: "item por item, até a colher." },
          { em: fim, l1: `Cada copo me custa ${"*" + brl(k.custoTotal).replace(" ", " ") + ".*"}`, l2: "Abaixo disso, é prejuízo." },
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 760, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Raios tamanho={900} style={{ opacity: copo }} />
        <div style={{ scale: `${(0.6 + copo * 0.4) * (1 + pulo)}`, opacity: copo, translate: "0 60px" }}>
          <CopoAcai tamanho={340} />
        </div>
        {n.itens.map((it, i) => {
          const t = inicio + i * passo;
          const e = entra(f, fps, t, 12);
          const voa = suave(f, t + 24, t + 38);
          const esq = i % 2 === 0;
          const x0 = esq ? -300 : 300;
          const y0 = -230 + (i % 4) * 120;
          if (f < t - 2 || voa >= 1) return null;
          return (
            <div
              key={it.nome}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                translate: `calc(-50% + ${interpolate(voa, [0, 1], [x0, 0])}px) calc(-50% + ${interpolate(voa, [0, 1], [y0, -60])}px)`,
                scale: `${e * (1 - voa * 0.8)}`,
                opacity: 1 - voa * 0.6,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 26px 16px 16px",
                borderRadius: 30,
                background: cor.branco,
                border: `2px solid ${cor.azulBorda}`,
                boxShadow: sombra,
                whiteSpace: "nowrap",
              }}
            >
              <IconeChip nome={it.icone} tamanho={78} />
              <div>
                <div style={{ color: cor.texto, fontSize: 36, fontWeight: 800 }}>{it.nome}</div>
                <div style={{ color: cor.textoSuave, fontSize: 26, fontWeight: 600 }}>{it.qtd}</div>
              </div>
              <div style={{ marginLeft: 10, color: cor.preto, fontSize: 40, fontWeight: 800 }}>{brl(it.custo)}</div>
            </div>
          );
        })}
      </div>
      {/* contador + bolinhas de progresso */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 1350, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {n.itens.map((it, i) => (
            <div key={it.nome} style={{ width: 22, height: 22, borderRadius: 11, background: absorvido(i) > 0.5 ? degrade : cor.azulBorda }} />
          ))}
        </div>
        <div style={{ alignSelf: "stretch", borderRadius: 36, padding: "26px 36px", display: "flex", alignItems: "center", gap: 22, background: degrade, boxShadow: `0 24px 60px rgba(29,78,216,${0.25 + pop * 0.2})`, scale: `${1 + pop * 0.04 - Math.max(0, pop - 1) * 0.04}`, opacity: entra(f, fps, 30) }}>
          <div style={{ width: 76, height: 76, borderRadius: 22, background: cor.branco, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icone nome="calculadora" tamanho={54} />
          </div>
          <span style={{ flex: 1, color: cor.branco, fontSize: 42, fontWeight: 700 }}>Custo do copo</span>
          <span style={{ color: cor.branco, fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>{brl(f >= fim ? k.custoTotal : soma)}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
