import { AbsoluteFill } from "remotion";
import { cor, degrade, fontFamily } from "../tema";
import { Abas } from "./Abas";
import { IconeEtiqueta } from "./Logo";

/**
 * Elementos fixos: marca + EP no topo, abas de etapa (quando houver) e selo "valores de exemplo".
 * `visivel` e `abas` (0→1) controlam as entradas/saídas.
 */
export const Moldura: React.FC<{ episodio: number; visivel: number; etapa: number | null; abas: number }> = ({ episodio, visivel, etapa, abas }) => (
  <AbsoluteFill style={{ fontFamily, pointerEvents: "none", opacity: visivel }}>
    <div style={{ position: "absolute", top: 80, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, color: cor.texto, fontSize: 32, fontWeight: 800 }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, backgroundImage: degrade, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconeEtiqueta tamanho={30} />
        </div>
        Preço Certo
      </div>
      <div style={{ padding: "10px 24px", borderRadius: 999, backgroundImage: degrade, color: cor.branco, fontSize: 28, fontWeight: 800, letterSpacing: 2 }}>
        EP. {String(episodio).padStart(2, "0")}
      </div>
    </div>
    {etapa !== null && <Abas ativa={etapa} style={{ position: "absolute", top: 160, left: 0, right: 0, opacity: abas, translate: `0 ${(1 - abas) * -30}px` }} />}
  </AbsoluteFill>
);
