import { staticFile } from "remotion";

// ====== EDITE AQUI: ofertas, validade e textos ======

export type Produto = {
  nome: string;
  preco: string; // "17,99"
  unidade: string; // "kg", "cada", "un"
  imagem: string; // PNG sem fundo em /public
};

export const PRODUTOS: Produto[] = [
  { nome: "Pernil com Osso", preco: "17,99", unidade: "kg", imagem: "pernil-com-osso.png" },
  { nome: "Pernil sem Osso", preco: "19,99", unidade: "kg", imagem: "pernil-sem-osso.png" },
  { nome: "Costelinha Suína", preco: "24,99", unidade: "kg", imagem: "costelinha.png" },
  { nome: "Lombo Suíno", preco: "24,99", unidade: "kg", imagem: "lombo.png" },
  { nome: "Toucinho", preco: "14,99", unidade: "kg", imagem: "toucinho.png" },
  { nome: "Ovos Brancos c/30", preco: "14,99", unidade: "cada", imagem: "ovos.png" },
];

export const CHAMADA = "TODA TERÇA";
export const VALIDADE = "17 de Novembro"; // "Ofertas válidas para ..."
export const WHATSAPP = "(62) 9 9852-4291";

export const LOGO = staticFile("logo.png");
export const SELO_CARNE = staticFile("carne-suina.png");
export const SELO_TERCA = staticFile("terca-suina.png");

// Cores da marca Mariana
export const COR = {
  azul: "#1a8ae6",
  azulEscuro: "#0b4aa8",
  marinho: "#1f1c5c",
  vermelho: "#d71f27",
  amarelo: "#ffd400",
  branco: "#ffffff",
};

export const FONTE_TITULO = "'Baloo 2', sans-serif";
export const FONTE_TEXTO = "'Poppins', sans-serif";
