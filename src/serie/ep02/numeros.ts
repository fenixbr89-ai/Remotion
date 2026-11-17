import type { NomeIcone } from "../ui/Icones";

/** Ficha do EP. 02 — Marmitaria. Números fixados no roteiro aprovado. */
export const MARMITARIA = {
  itens: [
    { nome: "Arroz", custo: 0.8, icone: "arroz" },
    { nome: "Feijão tropeiro", custo: 2.4, icone: "feijao" },
    { nome: "Carne", custo: 4.5, icone: "carne" },
    { nome: "Salada", custo: 0.6, icone: "salada" },
    { nome: "Embalagem", custo: 1.2, icone: "embalagem" },
    { nome: "Gás e energia", custo: 0.5, icone: "chama" },
  ] as { nome: string; custo: number; icone: NomeIcone }[],
  precoErrado: 13,
  lucro: 0.25,
  taxaIfood: 0.25,
  /** preço de balcão definido no roteiro */
  precoBalcao: 16,
};

const c = (v: number) => Math.round(v * 100) / 100;

export const contaMarmita = (m = MARMITARIA) => {
  const custo = c(m.itens.reduce((s, i) => s + i.custo, 0));
  const precoIfood = c(custo / (1 - m.taxaIfood - m.lucro));
  const taxaValor = c(precoIfood * m.taxaIfood);
  return { custo, precoIfood, taxaValor, sobra: c(precoIfood - custo - taxaValor), precoBalcao: m.precoBalcao };
};
