import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl } from "../calc";
import { Batida } from "../ui/Batida";
import { Icone } from "../ui/Icones";
import { CopoAcai } from "../ui/Ilustracoes";
import { Odometro } from "../ui/Odometro";
import { G, naPosicao } from "../geo";
import { cor, degrade, entra, estica, fontFamily, sombra, suave } from "../tema";
import { marca, type CenaProps } from "./props";
import { Topo } from "./Topo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const COPO = { x: 270, y: 900 };

/**
 * A conta do copo, rápida: cada ingrediente cai dentro do copo, solta um "+R$" e
 * imprime uma linha no cupom; o total gira como contador mecânico.
 */
export const Custo: React.FC<CenaProps> = ({ n, k, ponte, marcas }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = 24;
  const passo = 13;
  const cai = 9;
  const sinc = Array.isArray(marcas.itens) ? marcas.itens : null;
  // cada ingrediente pousa no copo quando é dito na narração
  const pousa = (i: number) => (sinc && sinc[i] !== undefined ? sinc[i] : inicio + i * passo + cai);
  const ultimo = pousa(n.itens.length - 1);
  const tTotal = marca(marcas, "total", ultimo + 12);
  const total = f >= tTotal ? k.custoTotal : n.itens.reduce((s, it, i) => s + it.custo * suave(f, pousa(i), pousa(i) + 8), 0);
  const fechou = entra(f, fps, tTotal, 8);
  const squash = n.itens.reduce((s, _, i) => {
    const d = f - pousa(i);
    return s + (d >= 0 && d < 8 ? Math.sin((d / 8) * Math.PI) * 0.08 : 0);
  }, 0);
  const recibo = entra(f, fps, 8, 12);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="Quanto custa *1 copo?*" />
      {/* copo */}
      <div style={{ position: "absolute", left: COPO.x, top: COPO.y, translate: "-50% -50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: G.custoCopo.w, height: G.custoCopo.h, scale: `${1 + squash} ${1 - squash * 0.6}`, transformOrigin: "center bottom", opacity: f >= ponte.entra ? 1 : 0 }}>
          <CopoAcai tamanho={G.custoCopo.w} />
        </div>
      </div>
      {/* ingredientes caindo + "+R$" subindo */}
      {n.itens.map((it, i) => {
        const t = pousa(i) - cai;
        if (f < t || f > pousa(i) + 20) return null;
        const queda = interpolate(f, [t, pousa(i)], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        const some = suave(f, pousa(i), pousa(i) + 4);
        const sobe = suave(f, pousa(i), pousa(i) + 20);
        return (
          <div key={it.nome}>
            {some < 1 && (
              <div style={{ position: "absolute", left: COPO.x, top: interpolate(queda, [0, 1], [420, 770]), translate: "-50% -50%", scale: `${1 - some * 0.7}`, opacity: 1 - some }}>
                <Icone nome={it.icone} tamanho={120} />
              </div>
            )}
            <div style={{ position: "absolute", left: COPO.x + 110, top: 720 - sobe * 120, opacity: f >= pousa(i) ? 1 - Math.max(0, sobe - 0.6) * 2.5 : 0, scale: `${entra(f, fps, pousa(i), 7)}`, padding: "8px 16px", borderRadius: 16, background: degrade, color: cor.branco, fontSize: 34, fontWeight: 800, whiteSpace: "nowrap" }}>
              +{brl(it.custo)}
            </div>
          </div>
        );
      })}
      {/* cupom */}
      <div style={{ position: "absolute", left: 500, top: 470, width: 460, borderRadius: 28, scale: estica(f, fps, 8), background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, padding: "22px 26px", opacity: recibo, translate: `${(1 - recibo) * 300}px 0` }}>
        <div style={{ color: cor.textoSuave, fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>CUPOM · 1 COPO {n.cardapio[n.carroChefe].nome.toUpperCase()}</div>
        <div style={{ borderTop: `3px dashed ${cor.azulBorda}`, margin: "14px 0 6px" }} />
        {n.itens.map((it, i) => {
          const e = entra(f, fps, pousa(i), 12);
          return (
            <div key={it.nome} style={{ height: 52, display: "flex", alignItems: "center", gap: 10, opacity: f >= pousa(i) ? e : 0, translate: `${(1 - e) * 40}px 0` }}>
              <span style={{ flex: 1, color: cor.texto, fontSize: 28, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden" }}>{it.nome}</span>
              <span style={{ color: cor.preto, fontSize: 28, fontWeight: 800 }}>{brl(it.custo)}</span>
            </div>
          );
        })}
        <div style={{ borderTop: `3px dashed ${cor.azulBorda}`, margin: "8px 0 0" }} />
      </div>
      {/* total girando */}
      <div style={{ ...naPosicao(G.custoTotal), boxSizing: "border-box", display: f < ponte.sai ? "flex" : "none", flexDirection: "column", alignItems: "center", justifyContent: "center", background: degrade, boxShadow: `0 24px 60px rgba(29,78,216,${0.3 + fechou * 0.25})`, scale: f < 30 ? estica(f, fps, 14) : `${1 + Math.sin(Math.min(1, fechou) * Math.PI) * 0.08}` }}>
        <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>Custo do copo</span>
        <Odometro valor={total} final={k.custoTotal} tamanho={84} cor={cor.branco} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1440 }}>
        <Batida linhas={[{ texto: "Esse é o *piso*. Abaixo disso, *prejuízo.*", em: marca(marcas, "piso", ultimo + 22), tamanho: 50, tom: "azul" }]} />
      </div>
    </AbsoluteFill>
  );
};
