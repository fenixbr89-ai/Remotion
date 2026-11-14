import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Batida } from "../ui/Batida";
import { CopoAcai } from "../ui/Ilustracoes";
import { Odometro } from "../ui/Odometro";
import { G, naPosicao } from "../geo";
import { cor, degrade, entra, estica, fontFamily, sombra, suave, textoDegrade } from "../tema";
import { destaca, marca, type CenaProps } from "./props";
import { Topo } from "./Topo";

const dec = (v: number) => v.toFixed(2).replace(".", ",");

/** Um termo da fórmula que chega grande e assenta. */
const Termo: React.FC<{ t: string; em: number; tam?: number; destaque?: boolean; cor?: string }> = ({ t, em, tam = 64, destaque, cor: c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entra(f, fps, em, 9);
  return (
    <span style={{ display: "inline-block", lineHeight: 1, fontSize: tam, fontWeight: 800, letterSpacing: -1.5, color: c ?? cor.texto, ...(destaque ? textoDegrade : {}), opacity: f >= em ? Math.min(1, e * 3) : 0, scale: `${interpolate(e, [0, 1], [1.9, 1])}` }}>
      {t}
    </span>
  );
};

export const Formula: React.FC<CenaProps> = ({ n, k, ponte, marcas }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = marca(marcas, "l1", 8);
  const p1 = marca(marcas, "passo1", 5);
  const l2 = marca(marcas, "l2", 46);
  const l3 = marca(marcas, "l3", 70);
  const tp = marca(marcas, "preco", 92);
  const etq = entra(f, fps, tp, 8);
  // cada linha da fórmula fica centralizada (na horizontal e na vertical) numa faixa de 110 px
  const linha = (children: React.ReactNode, top: number) => (
    <div style={{ position: "absolute", top, left: G.formulaLinha.x, width: G.formulaLinha.w, height: G.formulaLinha.h, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>{children}</div>
  );
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="A conta *certa:*" tamanho={80} />
      {f >= ponte.entra && <div style={{ ...naPosicao(G.formulaLinha), background: cor.azulFundo }} />}
      {linha(
        <>
          <Termo t="preço" em={l1} destaque />
          <Termo t="=" em={l1 + p1} />
          <Termo t="custo" em={l1 + p1 * 2} />
          <Termo t="÷" em={l1 + p1 * 3} />
          <Termo t="(1 − taxa − lucro)" em={l1 + p1 * 4} tam={56} />
        </>,
        G.formulaLinha.y,
      )}
      {linha(
        <>
          <Termo t={dec(k.custoTotal)} em={l2} cor={cor.preto} />
          <Termo t="÷" em={l2 + 4} />
          <Termo t={`(1 − ${dec(n.taxa)} − ${dec(n.lucro)})`} em={l2 + 8} tam={56} cor={cor.preto} />
        </>,
        G.formulaLinha.y + 120,
      )}
      {linha(
        <>
          <Termo t="=" em={l3} />
          <Termo t={dec(k.custoTotal)} em={l3 + 2} cor={cor.textoSuave} />
          <Termo t="÷" em={l3 + 6} cor={cor.textoSuave} />
          <Termo t={dec(1 - n.taxa - n.lucro)} em={l3 + 10} destaque />
        </>,
        G.formulaLinha.y + 230,
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 560, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ translate: "-170px 30px", scale: estica(f, fps, tp - 8), transformOrigin: "center bottom" }}>
          <CopoAcai tamanho={300} />
        </div>
      </div>
      {f < ponte.sai && (
        <div style={{ ...naPosicao(G.formulaEtiqueta), scale: `${interpolate(etq, [0, 1], [2, 1])}`, opacity: Math.min(1, etq * 3) }}>
          <div style={{ boxSizing: "border-box", width: "100%", height: "100%", borderRadius: G.formulaEtiqueta.r, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: degrade, boxShadow: "0 24px 50px rgba(29,78,216,0.35)" }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 28, fontWeight: 800, letterSpacing: 3 }}>VENDER A</div>
            <Odometro valor={k.preco * suave(f, tp, tp + 26)} final={k.preco} tamanho={90} cor={cor.branco} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Divisao: React.FC<CenaProps> = ({ n, k, ponte, marcas }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const partes = [
    { r: "Custo", v: k.custoTotal, c: "#94A3B8", t: marca(marcas, "custo", 10) },
    { r: `Taxa ${pct(n.taxa)}`, v: k.taxaValor, c: cor.vermelho, t: marca(marcas, "taxa", 22) },
    { r: `Lucro ${pct(n.lucro)}`, v: k.lucroValor, c: cor.verde, t: marca(marcas, "lucro", 34) },
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
            <div key={p.r} style={{ flex: 1, borderRadius: 30, padding: "22px 12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: cor.branco, border: `3px solid ${p.c}66`, boxShadow: sombra, opacity: f >= p.t ? Math.min(1, e * 2) : 0, scale: estica(f, fps, p.t + 4) }}>
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
            { texto: `+${brl(k.lucroValor)}`, em: marca(marcas, "slam", 56), tamanho: 200, efeito: "slam", corTexto: cor.verde },
            { texto: "de lucro em *cada* copo.", em: marca(marcas, "slam", 56) + 14, tamanho: 54 },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
