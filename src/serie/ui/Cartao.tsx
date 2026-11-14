import { cor, fontFamily, sombra } from "../tema";

export const Cartao: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily, background: cor.branco, border: `2px solid ${cor.azulBorda}`, borderRadius: 40, boxShadow: sombra, ...style }}>{children}</div>
);
