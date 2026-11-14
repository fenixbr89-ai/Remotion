import { AbsoluteFill } from "remotion";
import { cor, fontFamily } from "../tema";
import { IconeEtiqueta } from "./Logo";

/** Elementos fixos do episódio: série/EP no topo, selo "valores de exemplo" embaixo. */
export const Moldura: React.FC<{ episodio: number; destaque: string }> = ({ episodio, destaque }) => (
  <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 90, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(255,255,255,0.75)", fontSize: 30, fontWeight: 700 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: cor.branco, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconeEtiqueta tamanho={28} />
        </div>
        Preço Certo
      </div>
      <div style={{ padding: "10px 22px", borderRadius: 999, background: destaque, color: cor.branco, fontSize: 28, fontWeight: 800, letterSpacing: 2 }}>
        EP. {String(episodio).padStart(2, "0")}
      </div>
    </div>
    <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 26px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", fontSize: 26, fontWeight: 700 }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: cor.azulClaro }} />
        valores de exemplo
      </div>
    </div>
  </AbsoluteFill>
);
