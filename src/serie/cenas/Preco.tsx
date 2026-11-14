import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Batida } from "../ui/Batida";
import { CopoAcai, Raios } from "../ui/Ilustracoes";
import { Odometro } from "../ui/Odometro";
import { G, naPosicao } from "../geo";
import { cor, degrade, entra, estica, fontFamily, sombra, suave, textoDegrade } from "../tema";
import { destaca, type CenaProps } from "./props";
import { Topo } from "./Topo";

const dec = (v: number) => v.toFixed(2).replace(".", ",");

/** Um termo da fórmula que chega grande e assenta. */
const Termo: React.FC<{ t: string; em: number; tam?: number; destaque?: boolean; cor?: string }> = ({ t, em, tam = 64, destaque, cor: c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entra(f, fps, em, 9);
  return (
    <span style={{ display: "inline-block", fontSize: tam, fontWeight: 800, letterSpacing: -1.5, color: c ?? cor.texto, ...(destaque ? textoDegrade : {}), opacity: f >= em ? Math.min(1, e * 3) : 0, scale: `${interpolate(e, [0, 1], [1.9, 1])}` }}>
      {t}
    </span>
  );
};

export const Formula: React.FC<CenaProps> = ({ n, k, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const etq = entra(f, fps, 92, 8);
  const linha = (children: React.ReactNode, top: number) => (
    <div style={{ position: "absolute", top, left: 40, right: 40, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18 }}>{children}</div>
  );
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="A conta *certa:*" tamanho={80} />
      {f >= ponte.entra && <div style={{ ...naPosicao(G.formulaLinha), background: cor.azulFundo }} />}
      {linha(
        <>
          <Termo t="preço" em={8} destaque />
          <Termo t="=" em={14} />
          <Termo t="custo" em={18} />
          <Termo t="÷" em={24} />
          <Termo t="(1 − taxa − lucro)" em={28} tam={56} />
        </>,
        470,
      )}
      {linha(
        <>
          <Termo t={dec(k.custoTotal)} em={46} cor={cor.preto} />
          <Termo t="÷" em={50} />
          <Termo t={`(1 − ${dec(n.taxa)} − ${dec(n.lucro)})`} em={54} tam={56} cor={cor.preto} />
        </>,
        580,
      )}
      {linha(
        <>
          <Termo t="=" em={70} />
          <Termo t={dec(k.custoTotal)} em={72} cor={cor.textoSuave} />
          <Termo t="÷" em={76} cor={cor.textoSuave} />
          <Termo t={dec(1 - n.taxa - n.lucro)} em={80} destaque />
        </>,
        690,
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 560, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Raios tamanho={860} style={{ opacity: etq }} />
        <div style={{ translate: "-170px 30px", scale: estica(f, fps, 84), transformOrigin: "center bottom" }}>
          <CopoAcai tamanho={300} />
        </div>
      </div>
      {f < ponte.sai && (
        <div style={{ ...naPosicao(G.formulaEtiqueta), scale: `${interpolate(etq, [0, 1], [2, 1])}`, opacity: Math.min(1, etq * 3) }}>
          <div style={{ boxSizing: "border-box", width: "100%", height: "100%", borderRadius: G.formulaEtiqueta.r, padding: "22px 34px", background: degrade, boxShadow: "0 24px 50px rgba(29,78,216,0.35)" }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 28, fontWeight: 800, letterSpacing: 3 }}>VENDER A</div>
            <Odometro valor={k.preco * suave(f, 92, 118)} final={k.preco} tamanho={90} cor={cor.branco} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Divisao: React.FC<CenaProps> = ({ n, k, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const partes = [
    { r: "Custo", v: k.custoTotal, c: "#94A3B8", t: 10 },
    { r: `Taxa ${pct(n.taxa)}`, v: k.taxaValor, c: cor.vermelho, t: 22 },
    { r: `Lucro ${pct(n.lucro)}`, v: k.lucroValor, c: cor.verde, t: 34 },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto={`Em cada copo de ${destaca(brl(k.preco) + ":")}`} />
      <div style={{ ...naPosicao(G.divisaoBarra), overflow: "hidden", display: "flex", background: degrade, boxShadow: sombra, visibility: f >= ponte.entra ? "visible" : "hidden" }}>
        {partes.map((p) => (
          <div key={p.r} style={{ width: `${(p.v / k.preco) * 100 * suave(f, p.t, p.t + 12)}%`, background: p.c, visibility: p.c === cor.verde && f >= ponte.sai ? "hidden" : "visible" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 750, display: "flex", gap: 18 }}>
        {partes.map((p) => {
          const e = entra(f, fps, p.t + 4, 9);
          return (
            <div key={p.r} style={{ flex: 1, borderRadius: 30, padding: "22px 20px", background: cor.branco, border: `3px solid ${p.c}66`, boxShadow: sombra, opacity: f >= p.t ? Math.min(1, e * 2) : 0, scale: estica(f, fps, p.t + 4) }}>
              <div style={{ color: p.c, fontSize: 30, fontWeight: 800 }}>{p.r}</div>
              <Odometro valor={p.v * suave(f, p.t + 4, p.t + 20)} final={p.v} tamanho={48} cor={cor.preto} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060 }}>
        <Batida
          gap={6}
          linhas={[
            { texto: `+${brl(k.lucroValor)}`, em: 56, tamanho: 200, efeito: "slam", corTexto: cor.verde },
            { texto: "de lucro em *cada* copo.", em: 70, tamanho: 54 },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
