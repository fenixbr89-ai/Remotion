// Juliano Pinturas — estilo iPhone, guiado pelo roteiro de narração (30 fps, 1065 frames = 35,5 s).
export const J = {
  laranja: "#F26A1B",
  ambar: "#FF9F43",
  preto: "#111111",
  fundo: "#F8F8FA",
  cinza: "#8E8E93",
  cinzaEscuro: "#3A3A3C",
  linha: "#E5E5EA",
  verde: "#34C759",
  verdeEscuro: "#1E9E45",
};

export const GRADIENTE = `linear-gradient(90deg, #E2560B 0%, ${J.laranja} 40%, ${J.ambar} 100%)`;

export const J_TOTAL = 1065; // narração (34 s) + 1,5 s de respiro no final

/** Os serviços na ordem em que são falados. */
export const SERVICOS: {
  src: string;
  titulo: string;
  sub: string;
  filtro?: string;
}[] = [
  { src: "3d/rolo", titulo: "Pintura", sub: "Casas, paredes e fachadas" },
  { src: "3d/carro", titulo: "Pintura automotiva", sub: "Seu carro como novo" },
  { src: "3d/lampada", titulo: "Elétrica", sub: "Instalações elétricas" },
  { src: "3d/bomba", titulo: "Hidráulica", sub: "Instalações hidráulicas" },
  { src: "3d/gota", titulo: "Caixa d'água", sub: "Instalação e manutenção" },
  { src: "3d/casa", titulo: "Telhado", sub: "Telhados e calhas" },
  { src: "3d/tijolos", titulo: "Reformas", sub: "Pequenas reformas" },
  { src: "3d/vassoura", titulo: "Pós-obra", sub: "Limpeza e acabamento final" },
];
