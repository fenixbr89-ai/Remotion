import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Icone, IconeChip } from "../ui/Icones";
import { Celular } from "../ui/Ilustracoes";
import { Legenda } from "../ui/Legenda";
import { cor, degrade, entra, flutua, fontFamily, suave } from "../tema";
import type { CenaProps } from "./props";

/** O erro comum, mostrado no celular: pedido de R$ 18 que vira R$ 1,96 depois da taxa e do custo. */
export const Taxa: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { precoErrado, taxaValor, sobra } = k.erro;
  const cel = entra(f, fps, 6, 13);
  const notif = entra(f, fps, 40, 10);
  const linhas = [
    { r: `Taxa do app (${pct(n.taxa)})`, v: `− ${brl(taxaValor)}`, t: 95 },
    { r: "Custo do copo", v: `− ${brl(k.custoTotal)}`, t: 125 },
  ];
  const final = entra(f, fps, 160, 9);
  const restante = precoErrado - taxaValor * suave(f, 95, 115) - k.custoTotal * suave(f, 125, 145);
  const tremor = f > 160 && f < 182 ? Math.sin(f * 2.4) * 12 * (1 - (f - 160) / 22) : 0;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda
        frases={[
          { em: 4, l1: "O erro que eu *não* faria:", l2: `cobrar ${brl(precoErrado)} "porque todo mundo cobra".`, tom: "vermelho" },
          { em: 160, l1: "Depois da taxa e do custo,", l2: `sobrava só *${brl(sobra).replace(" ", " ")}* por copo.`, tom: "vermelho" },
        ]}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 330 }}>
        <div style={{ position: "relative", scale: `${0.8 + cel * 0.2}`, opacity: cel, translate: `${tremor}px ${(1 - cel) * 200}px` }}>
          <Celular largura={560}>
            <div style={{ padding: "90px 34px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, color: cor.textoSuave, fontSize: 26, fontWeight: 700 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: degrade }} />
                app de delivery · agora
              </div>
              <div style={{ marginTop: 26, borderRadius: 28, padding: 26, background: cor.gelo, scale: `${notif}`, opacity: notif }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <IconeChip nome="sacola" tamanho={64} style={{ background: cor.branco }} />
                  <div>
                    <div style={{ color: cor.texto, fontSize: 32, fontWeight: 800 }}>Novo pedido!</div>
                    <div style={{ color: cor.textoSuave, fontSize: 24, fontWeight: 600 }}>1× {n.nome === "Açaiteria" ? "Açaí" : n.nome} {n.cardapio[n.carroChefe].nome}</div>
                  </div>
                </div>
                <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", color: cor.preto, fontSize: 36, fontWeight: 800 }}>
                  <span>Total</span>
                  <span>{brl(precoErrado)}</span>
                </div>
              </div>
              {linhas.map((l) => {
                const e = entra(f, fps, l.t, 12);
                return (
                  <div key={l.r} style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 10px", borderBottom: `2px solid ${cor.gelo}`, opacity: e, translate: `${(1 - e) * 60}px 0` }}>
                    <span style={{ color: cor.texto, fontSize: 28, fontWeight: 600 }}>{l.r}</span>
                    <span style={{ color: cor.vermelho, fontSize: 32, fontWeight: 800 }}>{l.v}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: 30, borderRadius: 28, padding: "24px 26px", background: f >= 150 ? cor.vermelhoFundo : cor.verdeFundo, opacity: entra(f, fps, 60) }}>
                <div style={{ color: cor.texto, fontSize: 26, fontWeight: 700 }}>Você fica com</div>
                <div style={{ color: f >= 150 ? cor.vermelho : cor.verde, fontSize: 84, fontWeight: 800, letterSpacing: -3, scale: `${interpolate(final, [0, 1], [1, 1.08])}`, transformOrigin: "left center" }}>
                  {brl(f >= 150 ? sobra : restante)}
                </div>
              </div>
            </div>
          </Celular>
          <div style={{ position: "absolute", right: -70, top: 330, scale: `${entra(f, fps, 95, 9)}`, translate: `0 ${flutua(f, 1, 10)}px`, padding: "12px 22px", borderRadius: 20, background: cor.vermelho, color: cor.branco, fontSize: 38, fontWeight: 800, boxShadow: "0 14px 30px rgba(239,68,68,0.35)" }}>
            −{pct(n.taxa)}
          </div>
          <div style={{ position: "absolute", left: -80, top: 690, scale: `${final}` }}>
            <Icone nome="alerta" tamanho={130} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
