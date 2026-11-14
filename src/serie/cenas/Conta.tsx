import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Etiqueta } from "../ui/Etiqueta";
import { Titulo } from "../ui/Cartao";
import { cor, entra, fontFamily, sai, suave } from "../tema";
import type { CenaProps } from "./props";

const dec = (v: number) => v.toFixed(2).replace(".", ",");

export const Conta: React.FC<CenaProps> = ({ n, k, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const troca = suave(f, 55, 75); // fórmula com palavras → com números
  const etq = entra(f, fps, 115, 10);
  const contador = suave(f, 120, 160);
  const divisor = 1 - n.taxa - n.lucro;
  const partes = [
    { r: "Custo", v: brl(k.custoTotal), c: "#9CA3AF" },
    { r: `Taxa ${pct(n.taxa)}`, v: brl(k.taxaValor), c: cor.vermelho },
    { r: `Lucro ${pct(n.lucro)}`, v: brl(k.lucroValor), c: cor.verde },
  ];
  const caixa: React.CSSProperties = { fontSize: 56, fontWeight: 800, color: cor.branco, letterSpacing: -1, position: "absolute", left: 0, right: 0, textAlign: "center" };
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: "180px 70px 300px", opacity: sai(f, dur) }}>
      <Titulo style={{ fontSize: 70, opacity: entra(f, fps, 0) }}>
        A conta <span style={{ color: cor.azulClaro }}>certa</span>:
      </Titulo>
      <div style={{ color: cor.cinza, fontSize: 42, fontWeight: 600, marginTop: 16, opacity: entra(f, fps, 8) }}>
        Quero {pct(n.lucro)} de lucro depois da taxa.
      </div>
      <div style={{ marginTop: 50, height: 230, borderRadius: 40, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.14)", position: "relative", opacity: entra(f, fps, 18) }}>
        <div style={{ ...caixa, top: 40, opacity: 1 - troca }}>
          preço = custo ÷ (1 − taxa − lucro)
        </div>
        <div style={{ ...caixa, top: 40, opacity: troca, color: n.corDestaqueClara }}>
          {dec(k.custoTotal)} ÷ (1 − {dec(n.taxa)} − {dec(n.lucro)})
        </div>
        <div style={{ ...caixa, top: 130, fontSize: 52, opacity: suave(f, 80, 100), color: cor.cinza }}>
          = {dec(k.custoTotal)} ÷ {dec(divisor)}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
        <div style={{ opacity: Math.min(1, etq * 2), scale: interpolate(etq, [0, 1], [1.6, 1]), rotate: `${interpolate(etq, [0, 1], [18, -4])}deg`, translate: `0 ${(1 - etq) * -300}px` }}>
          <Etiqueta valor={brl(k.preco * contador)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 80 }}>
        {partes.map((p, i) => {
          const e = entra(f, fps, 175 + i * 10);
          return (
            <div key={p.r} style={{ flex: 1, borderRadius: 30, padding: "26px 24px", background: "rgba(255,255,255,0.06)", border: `2px solid ${p.c}66`, opacity: e, translate: `0 ${(1 - e) * 40}px` }}>
              <div style={{ color: p.c, fontSize: 32, fontWeight: 700 }}>{p.r}</div>
              <div style={{ color: cor.branco, fontSize: 48, fontWeight: 800, marginTop: 6, letterSpacing: -1 }}>{p.v}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
