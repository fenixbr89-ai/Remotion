import { cor, degrade, fontFamily } from "../tema";

export const IconeEtiqueta: React.FC<{ tamanho: number; cor?: string }> = ({ tamanho, cor: c = cor.branco }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z" />
    <circle cx="7.5" cy="7.5" r="1.2" fill={c} />
  </svg>
);

/** Marca: quadrado em degradê azul com a etiqueta branca + nome. */
export const Logo: React.FC<{ escala?: number; claro?: boolean }> = ({ escala = 1, claro = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22 * escala, fontFamily }}>
    <div
      style={{
        width: 84 * escala,
        height: 84 * escala,
        borderRadius: 24 * escala,
        background: claro ? cor.branco : degrade,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 ${12 * escala}px ${30 * escala}px rgba(29,78,216,0.35)`,
      }}
    >
      <IconeEtiqueta tamanho={48 * escala} cor={claro ? cor.azul : cor.branco} />
    </div>
    <div style={{ color: claro ? cor.branco : cor.texto, fontSize: 56 * escala, fontWeight: 800, letterSpacing: -1.5 * escala, whiteSpace: "nowrap" }}>Preço Certo</div>
  </div>
);
