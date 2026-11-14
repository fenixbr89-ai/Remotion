import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Batida } from "../ui/Batida";
import { Icone, IconeChip } from "../ui/Icones";
import { Celular } from "../ui/Ilustracoes";
import { Odometro } from "../ui/Odometro";
import { G, naPosicao } from "../geo";
import { cor, degrade, entra, estica, fontFamily, suave } from "../tema";
import { marca, type CenaProps } from "./props";
import { Topo } from "./Topo";

export const Erro: React.FC<CenaProps> = ({ k, ponte, marcas }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 730, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "Muita gente cobra", em: 0, tamanho: 64 }]} />
      </div>
      {f < ponte.sai && (
        <div style={{ ...naPosicao(G.erroValor), display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Batida linhas={[{ texto: brl(k.erro.precoErrado), em: marca(marcas, "valor", 8), tamanho: 230, efeito: "slam", corTexto: cor.preto }]} />
        </div>
      )}
      {f >= ponte.entra && f < ponte.sai && <div style={{ ...naPosicao(G.erroBarra), background: degrade }} />}
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "porque o vizinho cobra.", em: marca(marcas, "vizinho", 22), tamanho: 50, peso: 700, corTexto: cor.textoSuave }]} />
      </div>
    </AbsoluteFill>
  );
};

/** O pedido no app: a taxa e o custo comem o valor e sobra quase nada. */
export const App: React.FC<CenaProps> = ({ n, k, ponte, marcas }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { precoErrado, taxaValor, sobra } = k.erro;
  const notif = estica(f, fps, 2);
  const tT = marca(marcas, "taxa", 34);
  const tC = marca(marcas, "custo", 56);
  const tF = marca(marcas, "final", 80);
  const restante = precoErrado - taxaValor * suave(f, tT, tT + 12) - k.custoTotal * suave(f, tC, tC + 12);
  const final = entra(f, fps, tF, 8);
  const linhas = [
    { r: `Taxa do app (${pct(n.taxa)})`, v: `− ${brl(taxaValor)}`, t: tT },
    { r: "Custo do copo", v: `− ${brl(k.custoTotal)}`, t: tC },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="Mas no app, *sobra quanto?*" tom="vermelho" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 230 }}>
        <div style={{ position: "relative" }}>
          <Celular largura={560}>
            <div style={{ padding: "90px 34px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, color: cor.textoSuave, fontSize: 26, fontWeight: 700 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: degrade }} />
                app de delivery · agora
              </div>
              <div style={{ marginTop: 24, borderRadius: 28, padding: 24, background: cor.gelo, scale: notif }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <IconeChip nome="sacola" tamanho={64} style={{ background: cor.branco }} />
                  <div style={{ color: cor.texto, fontSize: 32, fontWeight: 800 }}>Novo pedido!</div>
                </div>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", color: cor.preto, fontSize: 36, fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ opacity: f >= ponte.entra ? 1 : 0 }}>{brl(precoErrado)}</span>
                </div>
              </div>
              {linhas.map((l) => {
                const e = entra(f, fps, l.t, 10);
                return (
                  <div key={l.r} style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 8px", borderBottom: `2px solid ${cor.gelo}`, opacity: f >= l.t ? e : 0, translate: `${(1 - e) * 80}px 0` }}>
                    <span style={{ color: cor.texto, fontSize: 28, fontWeight: 600 }}>{l.r}</span>
                    <span style={{ color: cor.vermelho, fontSize: 32, fontWeight: 800 }}>{l.v}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: 26, borderRadius: 28, padding: "22px 24px", background: f >= tF ? cor.vermelhoFundo : cor.verdeFundo, visibility: f < ponte.sai ? "visible" : "hidden" }}>
                <div style={{ color: cor.texto, fontSize: 26, fontWeight: 700 }}>Você fica com</div>
                <div style={{ scale: `${interpolate(final, [0, 1], [1, 1.1])}`, transformOrigin: "left center" }}>
                  <Odometro valor={f >= tF ? sobra : restante} final={precoErrado} tamanho={84} cor={f >= tF ? cor.vermelho : cor.verde} />
                </div>
              </div>
            </div>
          </Celular>
          <div style={{ position: "absolute", right: -120, top: 60, scale: `${entra(f, fps, tT, 8)}`, padding: "12px 22px", borderRadius: 20, background: cor.vermelho, color: cor.branco, fontSize: 40, fontWeight: 800 }}>−{pct(n.taxa)}</div>
          <div style={{ position: "absolute", left: -80, top: 700, scale: `${final}` }}>
            <Icone nome="alerta" tamanho={130} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Sobra: React.FC<CenaProps> = ({ k, ponte, marcas }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 600, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "Sobra", em: 0, tamanho: 60, corTexto: cor.textoSuave, peso: 700 }]} />
      </div>
      <div style={{ position: "absolute", top: 690, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: brl(k.erro.sobra), em: marca(marcas, "valor", 4), tamanho: 230, efeito: "slam", corTexto: cor.vermelho }]} />
      </div>
      {f >= ponte.entra && f < ponte.sai && <div style={{ ...naPosicao(G.sobraBarra), background: cor.vermelho }} />}
      <div style={{ position: "absolute", top: 1010, left: 70, right: 70 }}>
        <Batida linhas={[{ texto: "Um cupom de desconto e vira *prejuízo.*", em: marca(marcas, "cupom", 22), tamanho: 50, tom: "vermelho" }]} />
      </div>
    </AbsoluteFill>
  );
};
