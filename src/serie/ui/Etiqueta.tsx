import { cor, fontFamily } from "../tema";

/** Etiqueta de preço no estilo do site: "VENDER A R$ X". */
export const Etiqueta: React.FC<{ valor: string; rotulo?: string }> = ({ valor, rotulo = "VENDER A" }) => (
  <div
    style={{
      fontFamily,
      background: "linear-gradient(180deg, #FFFFFF 0%, #ECEEF2 100%)",
      borderRadius: 48,
      padding: "56px 70px 60px",
      boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
      position: "relative",
      minWidth: 640,
    }}
  >
    <div style={{ position: "absolute", top: 34, left: 38, width: 34, height: 34, borderRadius: 17, background: "#D4D6DB" }} />
    <div style={{ color: "#6B6F76", fontSize: 44, fontWeight: 700, letterSpacing: 4, marginLeft: 30 }}>{rotulo}</div>
    <div style={{ color: cor.escuro, fontSize: 150, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>{valor}</div>
  </div>
);
