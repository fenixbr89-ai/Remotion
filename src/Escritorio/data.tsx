// Conteúdo copiado do site (Advogado/index.html).

const iconProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const AREAS: { titulo: string; icone: React.ReactNode }[] = [
  {
    titulo: "Direito Previdenciário",
    icone: (
      <svg {...iconProps}>
        <circle cx="17" cy="15" r="6" />
        <circle cx="33" cy="17" r="5" />
        <path d="M5 40c0-8 5-13 12-13s12 5 12 13M29 28c8-2 14 3 14 11" />
      </svg>
    ),
  },
  {
    titulo: "Sucessões e Inventário",
    icone: (
      <svg {...iconProps}>
        <path d="M12 5h18l8 8v30H12zM30 5v8h8M18 22h14M18 29h14M18 36h9" />
      </svg>
    ),
  },
  {
    titulo: "Assessoria Empresarial",
    icone: (
      <svg {...iconProps}>
        <rect x="6" y="15" width="36" height="25" rx="3" />
        <path d="M17 15v-4a2 2 0 012-2h10a2 2 0 012 2v4M6 26h36M22 26v4h4v-4" />
      </svg>
    ),
  },
  {
    titulo: "Assessoria Imobiliária",
    icone: (
      <svg {...iconProps}>
        <path d="M5 23L24 7l19 16M10 20v22h28V20M20 42V30h8v12" />
      </svg>
    ),
  },
  {
    titulo: "Cível e Contratual",
    icone: (
      <svg {...iconProps}>
        <path d="M12 5h18l8 8v30H12zM30 5v8h8" />
        <path d="M18 30l5 5 9-11" />
      </svg>
    ),
  },
  {
    titulo: "Consumidor, Trabalhista e mais",
    icone: (
      <svg {...iconProps}>
        <path d="M6 17L24 7l18 10zM10 20v18M20 20v18M28 20v18M38 20v18M6 42h36" />
      </svg>
    ),
  },
];

export const EQUIPE = [
  {
    nome: "Woner Martins Protásio",
    cargo: "Sócio fundador",
    foto: "woner.jpg",
  },
  {
    nome: "Arthur Cândido de Souza",
    cargo: "Sócio administrativo",
    foto: "arthur.jpg",
  },
  {
    nome: "Athila Cândido de Souza",
    cargo: "CEO jurídico",
    foto: "athila.jpg",
  },
  {
    nome: "Helusca Franciane Silva Veloso",
    cargo: "Advogada associada",
    foto: "helusca.jpg",
  },
  {
    nome: "Gleicy Kelly da Silva Lima",
    cargo: "Advogada associada",
    foto: "gleicy.jpg",
  },
];

export const CONTATO = {
  telefone: "(64) 3671-3290",
  endereco: "Av. Aporé, nº 151, Centro",
  cidade: "São Luís de Montes Belos – GO",
};
