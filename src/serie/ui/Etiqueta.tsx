import { cor, degrade, fontFamily, sombra } from "../tema";

/** Etiqueta de preço no estilo do site: "VENDER A R$ X". Sempre reta. */
export const Etiqueta: React.FC<{ valor: string; rotulo?: string }> = ({ valor, rotulo = "VENDER A" }) => (
  <div style={{ fontFamily, background: cor.branco, borderRadius: 48, padding: "56px 70px 60px", boxShadow: sombra, border: `2px solid ${cor.azulBorda}`, position: "relative", minWidth: 660, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 18, backgroundImage: degrade }} />
    <div style={{ position: "absolute", top: 36, right: 40, width: 30, height: 30, borderRadius: 15, border: `6px solid ${cor.azulBorda}` }} />
    <div style={{ color: cor.textoSuave, fontSize: 44, fontWeight: 700, letterSpacing: 4 }}>{rotulo}</div>
    <div style={{ color: cor.preto, fontSize: 150, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>{valor}</div>
  </div>
);
