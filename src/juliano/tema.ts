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

/** Início de cada momento do plano-sequência (frames). */
export const T = {
  intro: 0,
  servicos: 150,
  grade: 450,
  pintura: 560,
  valores: 740,
  reforma: 896,
  passos: 1020,
  whatsapp: 1150,
  final: 1262,
  fim: 1350,
};

export const J_TOTAL = T.fim;

/** Os serviços entram um atrás do outro e preenchem a grade 3×3. */
export const SERVICOS: { src: string; titulo: string; sub: string }[] = [
  { src: "3d/rolo", titulo: "Pintura", sub: "Paredes, fachadas e acabamento" },
  { src: "3d/carro", titulo: "Automotiva", sub: "Pintura automotiva" },
  { src: "3d/lampada", titulo: "Elétrica", sub: "Instalações elétricas" },
  {
    src: "3d/chuveiro",
    titulo: "Hidráulica",
    sub: "Instalações hidráulicas",
  },
  { src: "3d/gota", titulo: "Caixa d'água", sub: "Instalação e manutenção" },
  { src: "3d/casa", titulo: "Telhados", sub: "Telhados e calhas" },
  { src: "3d/tijolos", titulo: "Reformas", sub: "Pequenas reformas" },
  {
    src: "3d/vassoura",
    titulo: "Pós-obra",
    sub: "Limpeza e acabamento final",
  },
  {
    src: "emoji/caixa-ferramentas",
    titulo: "Manutenção",
    sub: "Reparos do dia a dia",
  },
];
