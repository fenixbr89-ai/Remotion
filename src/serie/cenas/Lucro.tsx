import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Batida } from "../ui/Batida";
import { Odometro } from "../ui/Odometro";
import { G, naPosicao } from "../geo";
import { cor, degrade, entra, estica, fontFamily, sombra, suave } from "../tema";
import { marca, type CenaProps } from "./props";
import { Topo } from "./Topo";

const num = new Intl.NumberFormat("pt-BR");

export const Mes: React.FC<CenaProps> = ({ n, k, ponte, marcas }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tv = marca(marcas, "vendas", 6);
  const td = marca(marcas, "dias", 30);
  const tt = marca(marcas, "total", 92);
  const dia = Math.max(1, Math.min(n.diasPorMes, Math.ceil(suave(f, td, td + 40) * n.diasPorMes)));
  const vendas = Math.round(suave(f, tv, tv + 24) * n.vendasPorDia);
  const total = entra(f, fps, tt, 9);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="E no fim do *mês?*" tamanho={80} />
      <div style={{ position: "absolute", left: 190, top: 480, width: 300, height: 230, boxSizing: "border-box", borderRadius: 36, paddingTop: 34, background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, textAlign: "center", scale: estica(f, fps, 4) }}>
        <div style={{ color: cor.preto, fontSize: 110, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{vendas}</div>
        <div style={{ color: cor.textoSuave, fontSize: 30, fontWeight: 700 }}>copos por dia</div>
      </div>
      <div style={{ position: "absolute", left: 500, width: 110, top: 530, textAlign: "center", color: cor.azul, fontSize: 90, fontWeight: 800, scale: estica(f, fps, td - 8), rotate: `${(1 - Math.min(1, entra(f, fps, td - 8, 12))) * 180}deg` }}>×</div>
      {f >= ponte.entra && (
        <div style={{ ...naPosicao(G.mesCalendario), boxSizing: "border-box", overflow: "hidden", background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, textAlign: "center" }}>
          <div style={{ background: degrade, color: cor.branco, fontSize: 30, fontWeight: 800, padding: "12px 0", letterSpacing: 2 }}>DIAS</div>
          <div style={{ color: cor.preto, fontSize: 120, fontWeight: 800, letterSpacing: -4, lineHeight: 1.2 }}>{dia}</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", color: cor.texto, fontSize: 48, fontWeight: 700, opacity: suave(f, tt - 12, tt - 2) }}>
        = {num.format(k.mes.vendas)} copos no mês
      </div>
      <div style={{ ...naPosicao(G.mesLucro), boxSizing: "border-box", display: f < ponte.sai ? "flex" : "none", padding: "40px 40px", background: cor.verdeFundo, border: `3px solid ${cor.verde}66`, flexDirection: "column", alignItems: "center", opacity: Math.min(1, total * 3), scale: `${interpolate(total, [0, 1], [1.6, 1])}` }}>
        <div style={{ color: cor.texto, fontSize: 40, fontWeight: 700 }}>Lucro no mês</div>
        <Odometro valor={k.mes.lucro * suave(f, tt + 2, tt + 50)} final={k.mes.lucro} tamanho={124} cor={cor.verde} />
      </div>
    </AbsoluteFill>
  );
};

export const Frase: React.FC<CenaProps> = ({ ponte, marcas }) => {
  const f = useCurrentFrame();
  const tp = marca(marcas, "preco", 4);
  const tc = marca(marcas, "certo", 10);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 620, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "Isso é", em: 0, tamanho: 64, corTexto: cor.textoSuave, peso: 700 }]} />
      </div>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "PREÇO", em: tp, tamanho: 220, efeito: "slam", degrade: true }]} />
      </div>
      <div style={{ position: "absolute", top: 960, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "CERTO.", em: tc, tamanho: 220, efeito: "slam", degrade: true }]} />
      </div>
      {f >= ponte.entra && f < ponte.sai && <div style={{ ...naPosicao(G.fraseBarra), background: degrade }} />}
    </AbsoluteFill>
  );
};

