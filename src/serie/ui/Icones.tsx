import { cor } from "../tema";

/** Ícones 2D planos, duotom no azul da marca, com traço preto só nos detalhes. viewBox 64×64. */
const A = cor.azul;
const C = cor.azulProfundo;
const L = cor.azulCeu;
const K = cor.preto;
const W = cor.branco;

const DESENHOS = {
  acai: (
    <>
      <circle cx="22" cy="24" r="7" fill={C} />
      <circle cx="33" cy="20" r="7" fill={A} />
      <circle cx="43" cy="26" r="6" fill={C} />
      <circle cx="31" cy="20" r="2" fill={W} opacity={0.7} />
      <path d="M8 30h48c0 14-10 24-24 24S8 44 8 30z" fill={A} />
      <path d="M8 30h48" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M16 38c3 6 8 10 14 11" stroke={W} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.6} />
    </>
  ),
  copo: (
    <>
      <rect x="14" y="10" width="36" height="8" rx="4" fill={C} />
      <path d="M17 18h30l-4 38H21z" fill={A} />
      <path d="M19 30h26" stroke={W} strokeWidth={4} opacity={0.5} />
      <path d="M17 18h30l-4 38H21z" stroke={K} strokeWidth={2.5} strokeLinejoin="round" fill="none" />
    </>
  ),
  colher: (
    <>
      <ellipse cx="32" cy="17" rx="10" ry="12" fill={A} />
      <ellipse cx="29" cy="14" rx="3" ry="4" fill={W} opacity={0.6} />
      <rect x="29" y="27" width="6" height="30" rx="3" fill={C} />
      <ellipse cx="32" cy="17" rx="10" ry="12" stroke={K} strokeWidth={2.5} fill="none" />
    </>
  ),
  banana: (
    <>
      <path d="M12 22c4 20 22 32 42 26-2 6-10 10-20 9C18 55 8 40 12 22z" fill={A} />
      <path d="M12 22c6 14 20 24 38 22" stroke={C} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M10 18l4 6" stroke={K} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M50 48l5-1" stroke={K} strokeWidth={3.5} strokeLinecap="round" />
    </>
  ),
  granola: (
    <>
      <path d="M8 30h48c0 14-10 24-24 24S8 44 8 30z" fill={A} />
      <circle cx="20" cy="26" r="4" fill={L} />
      <circle cx="29" cy="23" r="5" fill={C} />
      <circle cx="39" cy="25" r="4" fill={L} />
      <circle cx="46" cy="27" r="3" fill={C} />
      <path d="M8 30h48" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  leitePo: (
    <>
      <rect x="16" y="14" width="32" height="42" rx="6" fill={A} />
      <rect x="14" y="8" width="36" height="9" rx="4" fill={C} />
      <rect x="22" y="28" width="20" height="16" rx="4" fill={W} />
      <path d="M27 36h10" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  leiteCondensado: (
    <>
      <rect x="14" y="20" width="36" height="34" rx="6" fill={A} />
      <ellipse cx="32" cy="20" rx="18" ry="6" fill={C} />
      <ellipse cx="32" cy="20" rx="18" ry="6" stroke={K} strokeWidth={2.5} fill="none" />
      <path d="M40 20c0 8 4 10 4 16a4 4 0 0 1-8 0c0-6 4-8 4-16z" fill={L} />
      <rect x="18" y="34" width="14" height="10" rx="3" fill={W} opacity={0.7} />
    </>
  ),
  sacola: (
    <>
      <path d="M24 22v-4a8 8 0 0 1 16 0v4" stroke={K} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M12 22h40l-3 34H15z" fill={A} />
      <path d="M12 22h40l-1.5 10H13.5z" fill={C} />
      <circle cx="32" cy="42" r="5" fill={W} opacity={0.8} />
    </>
  ),
  app: (
    <>
      <rect x="16" y="6" width="32" height="52" rx="7" fill={C} />
      <rect x="19" y="13" width="26" height="36" rx="3" fill={L} />
      <rect x="23" y="18" width="18" height="6" rx="3" fill={A} />
      <rect x="23" y="28" width="12" height="4" rx="2" fill={A} />
      <rect x="23" y="36" width="15" height="4" rx="2" fill={A} />
      <circle cx="32" cy="53" r="2" fill={K} />
    </>
  ),
  taxa: (
    <>
      <circle cx="32" cy="32" r="24" fill={A} />
      <path d="M22 42L42 22" stroke={W} strokeWidth={5} strokeLinecap="round" />
      <circle cx="23" cy="23" r="5" fill={W} />
      <circle cx="41" cy="41" r="5" fill={W} />
      <circle cx="32" cy="32" r="24" stroke={K} strokeWidth={2.5} fill="none" />
    </>
  ),
  dinheiro: (
    <>
      <rect x="6" y="16" width="52" height="32" rx="6" fill={A} />
      <rect x="10" y="20" width="44" height="24" rx="4" fill={C} />
      <circle cx="32" cy="32" r="8" fill={L} />
      <path d="M32 27v10" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  calendario: (
    <>
      <rect x="8" y="12" width="48" height="44" rx="8" fill={L} />
      <path d="M8 20a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v6H8z" fill={A} />
      <rect x="18" y="6" width="5" height="12" rx="2.5" fill={K} />
      <rect x="41" y="6" width="5" height="12" rx="2.5" fill={K} />
      <rect x="16" y="32" width="8" height="7" rx="2" fill={C} />
      <rect x="28" y="32" width="8" height="7" rx="2" fill={A} />
      <rect x="40" y="32" width="8" height="7" rx="2" fill={A} />
      <rect x="16" y="43" width="8" height="7" rx="2" fill={A} />
      <rect x="28" y="43" width="8" height="7" rx="2" fill={C} />
    </>
  ),
  grafico: (
    <>
      <rect x="10" y="36" width="10" height="18" rx="3" fill={L} />
      <rect x="27" y="26" width="10" height="28" rx="3" fill={A} />
      <rect x="44" y="12" width="10" height="42" rx="3" fill={C} />
      <path d="M8 56h48" stroke={K} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  alerta: (
    <>
      <path d="M32 8l26 46H6z" fill={cor.vermelho} strokeLinejoin="round" />
      <rect x="29.5" y="24" width="5" height="16" rx="2.5" fill={W} />
      <circle cx="32" cy="46" r="3" fill={W} />
    </>
  ),
  comentario: (
    <>
      <path d="M10 14a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H28l-12 10v-10h0a8 8 0 0 1-6-8z" fill={A} />
      <circle cx="22" cy="25" r="3.5" fill={W} />
      <circle cx="32" cy="25" r="3.5" fill={W} />
      <circle cx="42" cy="25" r="3.5" fill={W} />
    </>
  ),
  check: (
    <>
      <circle cx="32" cy="32" r="24" fill={A} />
      <path d="M21 33l7 7 15-16" stroke={W} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  etiqueta: (
    <>
      <path d="M34 6H12a6 6 0 0 0-6 6v22l26 26a5 5 0 0 0 7 0l21-21a5 5 0 0 0 0-7z" fill={A} />
      <circle cx="20" cy="20" r="5" fill={W} />
      <circle cx="20" cy="20" r="2" fill={K} />
    </>
  ),
  calculadora: (
    <>
      <rect x="12" y="6" width="40" height="52" rx="7" fill={C} />
      <rect x="17" y="12" width="30" height="12" rx="3" fill={L} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={17 + c * 11} y={29 + r * 9} width={8} height={6} rx={2} fill={r === 2 && c === 2 ? A : W} />),
      )}
    </>
  ),
  talheres: (
    <>
      <path d="M20 8v18a6 6 0 0 1-4 5.7V56" stroke={C} strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M14 8v14M26 8v14" stroke={C} strokeWidth={4} strokeLinecap="round" />
      <path d="M44 56V34c-6-2-8-10-8-16 0-6 4-10 8-10z" fill={A} />
      <path d="M44 8v48" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  chama: (
    <>
      <path d="M32 6c4 10 16 16 16 30a16 16 0 0 1-32 0c0-8 4-12 8-16 0 6 2 9 5 10-1-9 1-16 3-24z" fill={A} />
      <path d="M32 34c3 4 7 6 7 12a7 7 0 0 1-14 0c0-4 3-7 7-12z" fill={L} />
    </>
  ),
  folha: (
    <>
      <path d="M12 52C10 28 26 10 54 10c2 26-16 44-42 42z" fill={A} />
      <path d="M14 50L44 20" stroke={W} strokeWidth={3.5} strokeLinecap="round" opacity={0.8} />
      <path d="M12 52l-4 6" stroke={K} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  chapeu: (
    <>
      <path d="M18 36c-8 0-12-6-12-11 0-7 7-12 14-10 2-6 7-9 12-9s10 3 12 9c7-2 14 3 14 10 0 5-4 11-12 11z" fill={L} />
      <rect x="18" y="34" width="28" height="18" rx="3" fill={A} />
      <path d="M18 44h28" stroke={W} strokeWidth={3} opacity={0.7} />
      <path d="M18 52h28" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  moto: (
    <>
      <circle cx="16" cy="44" r="9" fill="none" stroke={K} strokeWidth={4} />
      <circle cx="48" cy="44" r="9" fill="none" stroke={K} strokeWidth={4} />
      <path d="M16 44h14l8-14h10l4 14" stroke={C} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="6" y="20" width="20" height="16" rx="4" fill={A} />
      <path d="M38 22h8" stroke={K} strokeWidth={4} strokeLinecap="round" />
    </>
  ),
  arroz: (
    <>
      <path d="M8 32h48c0 13-10 22-24 22S8 45 8 32z" fill={A} />
      <path d="M12 32c0-10 9-16 20-16s20 6 20 16z" fill={W} stroke={L} strokeWidth={3} />
      {[[22, 26], [30, 22], [38, 26], [27, 29], [35, 30]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={3} ry={1.6} fill={L} />
      ))}
      <path d="M8 32h48" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  feijao: (
    <>
      <path d="M8 32h48c0 13-10 22-24 22S8 45 8 32z" fill={A} />
      <path d="M12 32c0-10 9-16 20-16s20 6 20 16z" fill={C} />
      {[[22, 25], [32, 21], [41, 26], [28, 29], [37, 30]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={4} ry={2.6} fill={L} />
      ))}
      <path d="M8 32h48" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  carne: (
    <>
      <path d="M10 30c0-12 14-20 28-18 12 2 18 10 16 20-2 12-16 20-30 18C14 48 10 40 10 30z" fill={A} />
      <path d="M18 30c2-6 10-10 18-9" stroke={W} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.7} />
      <circle cx="40" cy="34" r="6" fill={L} />
      <circle cx="40" cy="34" r="2.5" fill={K} />
    </>
  ),
  salada: (
    <>
      <path d="M8 34h48c0 12-10 20-24 20S8 46 8 34z" fill={A} />
      <path d="M14 34c-2-10 6-16 12-14 2-6 12-6 14 0 6-2 12 4 10 14z" fill={L} />
      <circle cx="24" cy="28" r="4" fill={C} />
      <circle cx="38" cy="27" r="4" fill={C} />
      <path d="M8 34h48" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  embalagem: (
    <>
      <rect x="8" y="22" width="48" height="30" rx="6" fill={A} />
      <rect x="6" y="14" width="52" height="10" rx="5" fill={C} />
      <path d="M32 26v24" stroke={W} strokeWidth={3} opacity={0.7} />
      <path d="M8 52h48" stroke={K} strokeWidth={2.5} strokeLinecap="round" />
    </>
  ),
  seta: (
    <>
      <path d="M32 8v40" stroke={A} strokeWidth={8} strokeLinecap="round" />
      <path d="M16 36l16 18 16-18" stroke={A} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
} satisfies Record<string, React.ReactNode>;

export type NomeIcone = keyof typeof DESENHOS;
export const NOMES_ICONES = Object.keys(DESENHOS) as [NomeIcone, ...NomeIcone[]];

export const Icone: React.FC<{ nome: NomeIcone; tamanho: number; style?: React.CSSProperties }> = ({ nome, tamanho, style }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" fill="none" style={style}>
    {DESENHOS[nome]}
  </svg>
);

/** Ícone dentro de um quadrado arredondado azul-claro (estilo "chip"). */
export const IconeChip: React.FC<{ nome: NomeIcone; tamanho: number; style?: React.CSSProperties }> = ({ nome, tamanho, style }) => (
  <div
    style={{
      width: tamanho,
      height: tamanho,
      borderRadius: tamanho * 0.3,
      background: cor.azulFundo,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      ...style,
    }}
  >
    <Icone nome={nome} tamanho={tamanho * 0.68} />
  </div>
);
