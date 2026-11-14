import { cor, fontFamily } from "../tema";

export const IconeEtiqueta: React.FC<{ tamanho: number; cor?: string }> = ({ tamanho, cor: c = cor.azul }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z" />
    <circle cx="7.5" cy="7.5" r="1.2" fill={c} />
  </svg>
);

export const Logo: React.FC<{ escala?: number }> = ({ escala = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22 * escala, fontFamily }}>
    <div
      style={{
        width: 84 * escala,
        height: 84 * escala,
        borderRadius: 22 * escala,
        background: cor.branco,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 ${10 * escala}px ${30 * escala}px rgba(59,130,246,0.35)`,
      }}
    >
      <IconeEtiqueta tamanho={48 * escala} />
    </div>
    <div style={{ color: cor.branco, fontSize: 56 * escala, fontWeight: 800, letterSpacing: -1.5 * escala }}>Preço Certo</div>
  </div>
);
