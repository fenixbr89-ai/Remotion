import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Celular } from "../ui/Ilustracoes";
import { Logo } from "../ui/Logo";
import { cor, degrade, entra, fontFamily, suave } from "../tema";
import type { CenaProps } from "./props";

/** Produto em ação: a mesma conta, feita na tela do Preço Certo. */
export const Chamada: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cel = entra(f, fps, 8, 13);
  const botao = entra(f, fps, 95, 10);
  const pulso = f > 115 ? 1 + Math.sin((f - 115) / 6) * 0.025 : 1;
  const linhas = [
    { r: "Custo", v: brl(k.custoTotal) },
    { r: "Taxas", v: pct(n.taxa) },
    { r: "Ganho", v: pct(n.lucro) },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 470 }}>
        <div style={{ scale: `${0.8 + cel * 0.2}`, opacity: cel, translate: `0 ${(1 - cel) * 200}px` }}>
          <Celular largura={500}>
            <div style={{ height: "100%", background: degrade, padding: "90px 34px 0" }}>
              <div style={{ scale: "0.62", transformOrigin: "left center" }}>
                <Logo claro />
              </div>
              {linhas.map((l, i) => {
                const e = entra(f, fps, 24 + i * 10);
                return (
                  <div key={l.r} style={{ marginTop: 16, display: "flex", justifyContent: "space-between", padding: "20px 24px", borderRadius: 22, background: "rgba(255,255,255,0.16)", border: "2px solid rgba(255,255,255,0.3)", opacity: e, translate: `${(1 - e) * -60}px 0` }}>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 30, fontWeight: 600 }}>{l.r}</span>
                    <span style={{ color: cor.branco, fontSize: 32, fontWeight: 800 }}>{l.v}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: 34, borderRadius: 30, padding: "26px 28px", background: cor.branco, scale: `${entra(f, fps, 60, 9)}` }}>
                <div style={{ color: cor.textoSuave, fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>VENDER A</div>
                <div style={{ color: cor.preto, fontSize: 76, fontWeight: 800, letterSpacing: -3 }}>{brl(k.preco * suave(f, 62, 92))}</div>
              </div>
            </div>
          </Celular>
        </div>
        <div style={{ marginTop: -60, padding: "32px 90px", borderRadius: 999, background: degrade, color: cor.branco, fontSize: 52, fontWeight: 800, boxShadow: "0 24px 60px rgba(29,78,216,0.4)", opacity: botao, scale: `${interpolate(botao, [0, 1], [0.6, 1]) * pulso}`, border: `6px solid ${cor.branco}` }}>
          Teste grátis
        </div>
        <div style={{ marginTop: 22, color: cor.azulProfundo, fontSize: 38, fontWeight: 700, opacity: entra(f, fps, 105) }}>siteprecocerto.vercel.app</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
