import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brl } from "../calc";
import { Icone } from "../ui/Icones";
import { Celular, MaisUm } from "../ui/Ilustracoes";
import { Legenda } from "../ui/Legenda";
import { cor, degrade, entra, fontFamily, suave } from "../tema";
import type { CenaProps } from "./props";

const num = new Intl.NumberFormat("pt-BR");

export const Lucro: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cel = entra(f, fps, 6, 13);
  const p = suave(f, 20, 110) * n.vendasPorDia;
  const pedidos = Math.min(n.vendasPorDia, Math.floor(p));
  const frac = pedidos >= n.vendasPorDia ? 1 : p - pedidos;
  const visiveis = 5;
  const card = entra(f, fps, 125, 11);
  const conta = suave(f, 130, 190);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda
        frases={[
          { em: 4, l1: `Vendendo *${n.vendasPorDia} copos* por dia,`, l2: `${n.diasPorMes} dias no mês…` },
          { em: 125, l1: `são *${brl(k.mes.lucro).replace(" ", " ")}* de lucro`, l2: "no fim do mês." },
        ]}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 300 }}>
        <div style={{ position: "relative", scale: `${(0.8 + cel * 0.2) * (1 - card * 0.18)}`, opacity: cel, translate: `0 ${(1 - cel) * 200 - card * 200}px` }}>
          <Celular largura={520}>
            <div style={{ padding: "86px 30px 0" }}>
              <div style={{ color: cor.texto, fontSize: 36, fontWeight: 800 }}>Pedidos de hoje</div>
              <div style={{ color: cor.textoSuave, fontSize: 24, fontWeight: 600, marginBottom: 16 }}>{num.format(pedidos)} pedidos · valores de exemplo</div>
              {Array.from({ length: visiveis }).map((_, j) => {
                const id = pedidos - j;
                if (id < 1) return null;
                const novo = j === 0 ? Math.min(1, frac * 3) : 1;
                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 14px", marginBottom: 12, borderRadius: 22, background: j === 0 ? cor.azulFundo : cor.gelo, opacity: novo }}>
                    <div style={{ width: 44, height: 44, borderRadius: 22, background: cor.verde, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: cor.texto, fontSize: 26, fontWeight: 800 }}>Pedido #{1000 + id}</div>
                      <div style={{ color: cor.textoSuave, fontSize: 20, fontWeight: 600 }}>{n.cardapio[n.carroChefe].nome}</div>
                    </div>
                    <div style={{ color: cor.verde, fontSize: 26, fontWeight: 800 }}>+{brl(k.lucroValor)}</div>
                  </div>
                );
              })}
            </div>
          </Celular>
          {[0, 1, 2].map((i) => (
            <MaisUm key={i} escala={entra(f, fps, 30 + i * 22, 8) * (1 - suave(f, 50 + i * 22, 60 + i * 22))} style={{ [i % 2 ? "right" : "left"]: -90, top: 200 + i * 180 }} />
          ))}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1180, borderRadius: 40, padding: "34px 40px", background: cor.verdeFundo, border: `2px solid ${cor.verde}55`, display: "flex", alignItems: "center", gap: 28, opacity: card, translate: `0 ${(1 - card) * 120}px` }}>
        <Icone nome="calendario" tamanho={110} />
        <div>
          <div style={{ color: cor.texto, fontSize: 36, fontWeight: 700 }}>
            {n.vendasPorDia} × {n.diasPorMes} dias = {num.format(k.mes.vendas)} copos
          </div>
          <div style={{ color: cor.verde, fontSize: 104, fontWeight: 800, letterSpacing: -4, lineHeight: 1.1 }}>{brl(k.mes.lucro * conta)}</div>
          <div style={{ height: 10, borderRadius: 5, background: degrade, width: `${conta * 100}%` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
