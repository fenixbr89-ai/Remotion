import type React from "react";

export type NomeIcone =
  | "rolo"
  | "pincel"
  | "pistola"
  | "telhado"
  | "calha"
  | "reforma"
  | "posObra"
  | "eletrica"
  | "hidraulica"
  | "caixa"
  | "manutencao"
  | "telefone";

const caminhos: Record<NomeIcone, React.ReactNode> = {
  rolo: (
    <>
      <rect x="8" y="10" width="38" height="14" rx="5" />
      <path d="M46 17 H54 V32 H32 V40" />
      <rect x="28" y="40" width="8" height="18" rx="3" />
    </>
  ),
  pincel: (
    <>
      <path d="M22 6 h20 v18 h-20z" />
      <path d="M24 24 v6 h16 v-6" />
      <path d="M29 30 h6 v26 a3 3 0 0 1 -6 0z" />
    </>
  ),
  pistola: (
    <>
      <path d="M34 6 h14 l-3 12 h-8z" />
      <path d="M14 22 h40 v10 h-40z" />
      <path d="M30 32 l-4 24 h8 l4 -24" />
      <path d="M6 27 h8" />
    </>
  ),
  telhado: (
    <>
      <path d="M6 32 L32 10 L58 32" />
      <path d="M14 26 V56 H50 V26" />
      <path d="M26 56 V42 h12 V56" />
    </>
  ),
  calha: (
    <>
      <path d="M8 16 h48 v6 a6 6 0 0 1 -6 6 H14 a6 6 0 0 1 -6 -6z" />
      <path d="M44 28 v16" />
      <path d="M44 50 q-5 7 0 10 q5 -3 0 -10z" />
    </>
  ),
  reforma: (
    <>
      <path d="M10 16 h24 l8 8 h-32z" />
      <path d="M26 24 L44 56" />
    </>
  ),
  posObra: (
    <>
      <path d="M28 8 L32 26 L50 30 L32 34 L28 52 L24 34 L6 30 L24 26Z" />
      <path d="M50 42 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" />
    </>
  ),
  eletrica: <path d="M36 4 L14 36 h15 l-4 24 l24 -34 h-15 z" />,
  hidraulica: (
    <>
      <path d="M8 22 h26 a10 10 0 0 1 10 10 v6" />
      <path d="M8 14 v16" />
      <path d="M20 22 v-8 M14 14 h12" />
      <path d="M44 46 q-6 8 0 12 q6 -4 0 -12z" />
    </>
  ),
  caixa: (
    <>
      <ellipse cx="32" cy="16" rx="18" ry="6" />
      <path d="M14 16 v32 a18 6 0 0 0 36 0 v-32" />
      <path d="M14 34 q9 -4 18 0 t18 0" />
    </>
  ),
  manutencao: (
    <path d="M44 8 a12 12 0 0 0 -12 16 L10 46 a4.5 4.5 0 0 0 7 7 L39 31 a12 12 0 0 0 16 -12 l-8 5 l-6 -6 l5 -8 z" />
  ),
  telefone: (
    <path d="M18 8 h9 l5 12 -7 5 a30 30 0 0 0 14 14 l5 -7 12 5 v9 a5 5 0 0 1 -5 5 A46 46 0 0 1 13 13 a5 5 0 0 1 5 -5z" />
  ),
};

export const Icone: React.FC<{
  readonly nome: NomeIcone;
  readonly tamanho?: number;
  readonly cor?: string;
  readonly espessura?: number;
}> = ({ nome, tamanho = 64, cor = "currentColor", espessura = 3.5 }) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 64 64"
    fill="none"
    stroke={cor}
    strokeWidth={espessura}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {caminhos[nome]}
  </svg>
);

/** Balão do WhatsApp (preenchido). */
export const IconeWhatsApp: React.FC<{ readonly tamanho?: number }> = ({
  tamanho = 48,
}) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 64 64">
    <path
      d="M32 4 a28 28 0 1 1 -14.6 51.9 L4 60 l4.3 -13 A28 28 0 0 1 32 4z"
      fill="#25D366"
    />
    <g transform="translate(15 15) scale(0.53)" fill="#fff">
      <path d="M18 8 h9 l5 12 -7 5 a30 30 0 0 0 14 14 l5 -7 12 5 v9 a5 5 0 0 1 -5 5 A46 46 0 0 1 13 13 a5 5 0 0 1 5 -5z" />
    </g>
  </svg>
);
