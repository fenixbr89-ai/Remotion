import { AbsoluteFill } from "remotion";
import { cor, degrade, fontFamily } from "../tema";
import { IconeEtiqueta } from "./Logo";

/** Elementos fixos: marca + EP no topo, selo "valores de exemplo" embaixo. */
export const Moldura: React.FC<{ episodio: number }> = ({ episodio }) => (
  <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 90, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
    <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 26px", borderRadius: 999, background: cor.branco, border: `2px solid ${cor.azulBorda}`, color: cor.textoSuave, fontSize: 26, fontWeight: 700 }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: cor.azul }} />
        valores de exemplo
      </div>
    </div>
  </AbsoluteFill>
);
