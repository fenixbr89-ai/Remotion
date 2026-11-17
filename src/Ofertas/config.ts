import { staticFile } from "remotion";

// ====== EDITE AQUI: ofertas, validade e textos ======

export type Produto = {
  nome: string;
  preco: string; // "17,99"
  unidade: string; // "kg", "cada", "un"
  imagem: string; // arquivo em /public
};

export const PRODUTOS: Produto[] = [
  { nome: "Pernil c/ Osso", preco: "17,99", unidade: "kg", imagem: "pernil-com-osso.png" },
  { nome: "Pernil s/ Osso", preco: "19,99", unidade: "kg", imagem: "pernil-sem-osso.png" },
  { nome: "Costelinha", preco: "24,99", unidade: "kg", imagem: "costelinha.png" },
  { nome: "Lombo Suíno", preco: "24,99", unidade: "kg", imagem: "lombo.png" },
  { nome: "Toucinho", preco: "14,99", unidade: "kg", imagem: "toucinho.png" },
  { nome: "Ovos c/30", preco: "14,99", unidade: "cada", imagem: "ovos.png" },
];

export const VALIDADE = "Ofertas válidas em 17/11/26";

export const LOGO = staticFile("logo.png");
export const SELO = staticFile("festival.png");

// Cores (iguais à referência)
export const COR = {
  verde: "#2fbf3e",
  verdeClaro: "#4ee05a",
  verdeEscuro: "#1d6b2c",
  laranja: "#f7a21b",
  laranjaEscuro: "#ee8410",
  creme: "#f3f1ec",
  branco: "#ffffff",
};

export const FONTE_TITULO = "'Baloo 2', sans-serif";
export const FONTE_TEXTO = "'Poppins', sans-serif";
