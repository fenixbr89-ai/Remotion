import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Cinetico } from "../ui/Cinetico";
import { CopoAcai, Raios } from "../ui/Ilustracoes";
import { cor, degrade, entra, fontFamily, sombra, suave } from "../tema";
import type { CenaProps } from "./props";

const dec = (v: number) => v.toFixed(2).replace(".", ",");

export const Preco: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copo = entra(f, fps, 30, 12);
  const etq = entra(f, fps, 120, 8);
  const contador = suave(f, 122, 160);
  const itens = [
    { r: "Cobre o custo", v: brl(k.custoTotal) },
    { r: "Paga a taxa do app", v: brl(k.taxaValor) },
    { r: `Sobra ${pct(n.lucro)} de lucro`, v: brl(k.lucroValor) },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 500, left: 90, right: 90, borderRadius: 32, padding: "24px 10px", background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, opacity: entra(f, fps, 6) }}>
        <Cinetico texto={`${dec(k.custoTotal)} ÷ (1 − ${dec(n.taxa)} − ${dec(n.lucro)}) = *${dec(k.preco)}*`} inicio={12} intervalo={3} tamanho={44} alinhar="center" corTexto={cor.preto} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 560, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Raios tamanho={820} style={{ opacity: copo }} />
        <div style={{ scale: `${copo}`, translate: "-120px 20px" }}>
          <CopoAcai tamanho={330} />
        </div>
        <div style={{ position: "absolute", left: "50%", marginLeft: 40, top: 150, scale: `${etq}`, opacity: Math.min(1, etq * 2), translate: `0 ${(1 - etq) * -160}px` }}>
          <div style={{ borderRadius: 30, padding: "22px 34px", background: degrade, boxShadow: "0 24px 50px rgba(29,78,216,0.35)" }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 28, fontWeight: 800, letterSpacing: 3 }}>VENDER A</div>
            <div style={{ color: cor.branco, fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>{brl(k.preco * contador)}</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1220, left: 90, right: 90, borderRadius: 36, padding: "24px 34px", background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, opacity: entra(f, fps, 165) }}>
        <div style={{ color: cor.textoSuave, fontSize: 24, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>EM CADA COPO</div>
        {itens.map((it, i) => {
          const marca = entra(f, fps, 180 + i * 18, 9);
          return (
            <div key={it.r} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", opacity: suave(f, 172 + i * 18, 186 + i * 18) }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: marca > 0.5 ? cor.verde : cor.gelo, display: "flex", alignItems: "center", justifyContent: "center", scale: `${0.7 + marca * 0.3}` }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: marca }}>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <span style={{ flex: 1, color: cor.texto, fontSize: 36, fontWeight: 700 }}>{it.r}</span>
              <span style={{ color: cor.preto, fontSize: 38, fontWeight: 800 }}>{it.v}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
