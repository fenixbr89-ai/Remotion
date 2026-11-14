import { fontFamily } from "../tema";

export const Cartao: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      fontFamily,
      background: "rgba(255,255,255,0.06)",
      border: "1.5px solid rgba(255,255,255,0.14)",
      borderRadius: 40,
      padding: 44,
      backdropFilter: "blur(10px)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Titulo: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily, color: "#fff", fontSize: 76, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, ...style }}>{children}</div>
);
