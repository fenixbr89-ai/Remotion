import { cor, degrade, fontFamily } from "../tema";

export const ETAPAS = ["Custo", "Taxa", "Preço", "Lucro"] as const;

/** Abas de etapas fixas no topo: a atual em degradê, as concluídas com ✓ verde. */
export const Abas: React.FC<{ ativa: number; style?: React.CSSProperties }> = ({ ativa, style }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 14, fontFamily, ...style }}>
    {ETAPAS.map((e, i) => {
      const feita = i < ativa;
      const atual = i === ativa;
      return (
        <div
          key={e}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 22px",
            borderRadius: 999,
            background: atual ? degrade : cor.branco,
            border: atual ? "none" : `2px solid ${cor.azulBorda}`,
            color: atual ? cor.branco : feita ? cor.texto : cor.textoSuave,
            fontSize: 28,
            fontWeight: 800,
            boxShadow: atual ? "0 10px 24px rgba(29,78,216,0.3)" : "none",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: feita ? cor.verde : atual ? "rgba(255,255,255,0.25)" : cor.gelo,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {feita ? (
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <span style={{ fontSize: 18, color: atual ? cor.branco : cor.textoSuave }}>{i + 1}</span>
            )}
          </div>
          {e}
        </div>
      );
    })}
  </div>
);
