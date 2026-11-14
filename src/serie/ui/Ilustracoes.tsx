import { useCurrentFrame } from "remotion";
import { cor, degrade, fontFamily, textoDegrade } from "../tema";

/** Ilustrações 2D planas da série (loja, pessoas, copo, raios, celular, cursor). */

export const Raios: React.FC<{ tamanho: number; style?: React.CSSProperties }> = ({ tamanho, style }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        width: tamanho,
        height: tamanho,
        borderRadius: "50%",
        background: `repeating-conic-gradient(from ${f * 0.4}deg, ${cor.azul}2E 0deg 9deg, transparent 9deg 20deg)`,
        maskImage: "radial-gradient(circle, black 18%, transparent 68%)",
        WebkitMaskImage: "radial-gradient(circle, black 18%, transparent 68%)",
        ...style,
      }}
    />
  );
};

/** Fachada da loja. `luz` 0→1 acende as janelas. */
export const Loja: React.FC<{ nome: string; luz: number; largura?: number }> = ({ nome, luz, largura = 780 }) => {
  const listras = 8;
  const janela = (l: number): React.CSSProperties => ({
    flex: 1,
    borderRadius: 18,
    background: l > 0 ? `linear-gradient(180deg, rgba(254,243,199,${l}) 0%, rgba(191,219,254,${0.4 + l * 0.6}) 100%)` : cor.azulBorda,
    boxShadow: l > 0 ? `0 0 ${60 * l}px rgba(253,230,138,${0.7 * l}), inset 0 0 0 6px ${cor.branco}` : `inset 0 0 0 6px ${cor.branco}`,
  });
  return (
    <div style={{ width: largura, fontFamily, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ padding: "14px 46px", borderRadius: 22, background: cor.branco, border: `5px solid ${cor.texto}`, boxShadow: `0 0 ${50 * luz}px rgba(59,130,246,${0.5 * luz})`, marginBottom: 18 }}>
        <span style={{ ...textoDegrade, fontSize: 58, fontWeight: 800, letterSpacing: 4 }}>{nome.toUpperCase()}</span>
      </div>
      <div style={{ width: largura, display: "flex", borderRadius: "22px 22px 0 0", overflow: "hidden" }}>
        {Array.from({ length: listras }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 70, background: i % 2 ? cor.azulFundo : cor.azul }} />
        ))}
      </div>
      <div style={{ width: largura, display: "flex", marginTop: -1 }}>
        {Array.from({ length: listras }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 44, borderRadius: "0 0 999px 999px", background: i % 2 ? cor.azulFundo : cor.azul, boxShadow: i % 2 ? `inset 0 -3px 0 ${cor.azulBorda}` : "none" }} />
        ))}
      </div>
      <div style={{ width: largura - 60, height: 330, background: cor.gelo, border: `4px solid ${cor.azulBorda}`, borderTop: "none", display: "flex", gap: 26, padding: "34px 34px 0", boxSizing: "border-box" }}>
        <div style={{ ...janela(luz), height: 200 }} />
        <div style={{ ...janela(luz), height: 200 }} />
        <div style={{ width: 150, height: 296, borderRadius: "16px 16px 0 0", background: cor.texto, position: "relative" }}>
          <div style={{ position: "absolute", right: 22, top: 140, width: 14, height: 14, borderRadius: 7, background: cor.azulCeu }} />
        </div>
      </div>
      <div style={{ width: largura + 40, height: 20, borderRadius: 10, background: cor.azulBorda }} />
    </div>
  );
};

const PELES = ["#F1C7A5", "#C98E63", "#8D5A3B", "#E8B48F"];
export const Pessoa: React.FC<{ roupa: string; pele?: number; altura?: number; style?: React.CSSProperties }> = ({ roupa, pele = 0, altura = 200, style }) => (
  <svg width={altura * 0.5} height={altura} viewBox="0 0 50 100" style={style}>
    <rect x="15" y="62" width="8" height="34" rx="4" fill={cor.texto} />
    <rect x="27" y="62" width="8" height="34" rx="4" fill={cor.texto} />
    <rect x="8" y="30" width="34" height="40" rx="14" fill={roupa} />
    <circle cx="25" cy="17" r="12" fill={PELES[pele % PELES.length]} />
    <path d="M13 15a12 12 0 0 1 24 0c-4-4-10-5-17-3-3 1-5 2-7 3z" fill={cor.preto} />
  </svg>
);

/** Copo de açaí em destaque (produto herói). */
export const CopoAcai: React.FC<{ tamanho: number; rotulo?: string }> = ({ tamanho, rotulo = "AÇAÍ" }) => (
  <svg width={tamanho} height={tamanho * 1.15} viewBox="0 0 200 230">
    <ellipse cx="100" cy="218" rx="70" ry="9" fill={cor.azulBorda} />
    <path d="M38 78h124l-16 136H54z" fill={cor.branco} stroke={cor.azulBorda} strokeWidth={4} />
    <path d="M44 120h112l-6 52H50z" fill={cor.azul} />
    <text x="100" y="154" textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={26} fill={cor.branco} letterSpacing={2}>
      {rotulo}
    </text>
    <path d="M34 80c0-34 30-56 66-56s66 22 66 56z" fill="#3B2A7A" />
    <path d="M52 62c10-14 28-22 48-22" stroke="#5B47A8" strokeWidth={8} strokeLinecap="round" fill="none" />
    <circle cx="70" cy="50" r="11" fill="#FDE68A" stroke="#F5D06A" strokeWidth={3} />
    <circle cx="124" cy="46" r="11" fill="#FDE68A" stroke="#F5D06A" strokeWidth={3} />
    <circle cx="98" cy="34" r="10" fill="#FDE68A" stroke="#F5D06A" strokeWidth={3} />
    {[[56, 70], [84, 64], [112, 68], [142, 72], [96, 56], [136, 58]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={4.5} fill="#C9935A" />
    ))}
    <rect x="30" y="74" width="140" height="10" rx="5" fill={cor.azulProfundo} />
  </svg>
);

/** Celular (moldura preta só no detalhe), tela branca. */
export const Celular: React.FC<{ largura?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ largura = 540, children, style }) => (
  <div style={{ width: largura, height: largura * 2.02, borderRadius: largura * 0.13, background: cor.preto, padding: largura * 0.025, boxSizing: "border-box", boxShadow: "0 40px 100px rgba(29,78,216,0.25)", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: largura * 0.11, background: cor.branco, overflow: "hidden", position: "relative", fontFamily }}>
      <div style={{ position: "absolute", top: 18, left: "50%", marginLeft: -60, width: 120, height: 32, borderRadius: 16, background: cor.preto, zIndex: 2 }} />
      {children}
    </div>
  </div>
);

export const Cursor: React.FC<{ tamanho?: number; style?: React.CSSProperties }> = ({ tamanho = 70, style }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" style={style}>
    <path d="M4 2l16 9-7 1.6L10 20z" fill={cor.preto} stroke={cor.branco} strokeWidth={1.5} strokeLinejoin="round" />
  </svg>
);

/** Selo "+1" que aparece sobre clientes/pedidos. */
export const MaisUm: React.FC<{ escala: number; style?: React.CSSProperties }> = ({ escala, style }) => (
  <div style={{ position: "absolute", padding: "8px 18px", borderRadius: 16, background: degrade, color: cor.branco, fontFamily, fontWeight: 800, fontSize: 34, scale: `${escala}`, opacity: Math.min(1, escala * 2), boxShadow: "0 10px 24px rgba(29,78,216,0.3)", ...style }}>
    +1
  </div>
);
