import type { Negocio } from "../tipos";

/** Estimativas de preço de mercado — exibidas como "valores de exemplo". */
export const acaiteria: Negocio = {
  episodio: 1,
  artigo: "uma",
  nome: "Açaiteria",
  corDestaque: "#7C3AED",
  corDestaqueClara: "#C4B5FD",
  cardapio: [
    { nome: "300 ml", detalhe: "Pra matar a vontade" },
    { nome: "500 ml", detalhe: "O carro-chefe" },
    { nome: "700 ml", detalhe: "Pra dividir" },
  ],
  carroChefe: 1,
  itens: [
    { nome: "Açaí", qtd: "400 g", custo: 8.0 },
    { nome: "Granola", qtd: "30 g", custo: 0.6 },
    { nome: "Leite em pó", qtd: "20 g", custo: 0.8 },
    { nome: "Leite condensado", qtd: "30 g", custo: 0.5 },
    { nome: "Banana", qtd: "50 g", custo: 0.3 },
    { nome: "Copo + tampa", qtd: "1 un", custo: 0.6 },
    { nome: "Colher", qtd: "1 un", custo: 0.08 },
    { nome: "Sacola e lacre", qtd: "1 un", custo: 0.3 },
  ],
  taxa: 0.27,
  lucro: 0.2,
  precoErrado: 18,
  vendasPorDia: 40,
  diasPorMes: 26,
};
