// Juliano Pinturas — estilo Apple/iPhone (30 fps, 1350 frames = 45 s).
export const J = {
  laranja: "#F26A1B",
  ambar: "#FF9F43",
  preto: "#111111",
  fundo: "#F8F8FA",
  cinza: "#8E8E93",
  cinzaEscuro: "#3A3A3C",
  linha: "#E5E5EA",
  verde: "#34C759",
};

export const GRADIENTE = `linear-gradient(90deg, #E2560B 0%, ${J.laranja} 40%, ${J.ambar} 100%)`;

/** Início de cada momento do filme (frames). */
export const T = {
  intro: 0,
  servicos: 150,
  widget: 420,
  pintura: 570,
  valores: 750,
  reforma: 900,
  passos: 1020,
  whatsapp: 1170,
  final: 1260,
  fim: 1350,
};

export const J_TOTAL = T.fim;

export const SERVICOS: { icon: string; titulo: string; sub: string }[] = [
  { icon: "pincel", titulo: "Pintura", sub: "Paredes, fachadas e acabamento" },
  { icon: "casa", titulo: "Telhados", sub: "Telhados e calhas" },
  { icon: "tijolo", titulo: "Reformas", sub: "Pequenas reformas" },
  { icon: "vassoura", titulo: "Pós-obra", sub: "Limpeza e acabamento final" },
  { icon: "lampada", titulo: "Elétrica", sub: "Instalações elétricas" },
  { icon: "chuveiro", titulo: "Hidráulica", sub: "Instalações hidráulicas" },
  { icon: "gota", titulo: "Caixa d'água", sub: "Instalação e manutenção" },
  { icon: "carro", titulo: "Automotiva", sub: "Pintura automotiva" },
];
