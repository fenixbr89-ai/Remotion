import type { Negocio, Numeros } from "./tipos";

const c = (v: number) => Math.round(v * 100) / 100;

export const calcular = (n: Negocio): Numeros => {
  if (n.taxa + n.lucro >= 1) {
    throw new Error("taxa + lucro precisa ser menor que 100%");
  }
  const custoTotal = c(n.itens.reduce((s, i) => s + c(i.custo), 0));
  const preco = c(custoTotal / (1 - n.taxa - n.lucro));
  const taxaValor = c(preco * n.taxa);
  const lucroValor = c(preco - taxaValor - custoTotal);
  const errTaxa = c(n.precoErrado * n.taxa);
  const vendas = n.vendasPorDia * n.diasPorMes;
  return {
    custoTotal,
    preco,
    taxaValor,
    lucroValor,
    erro: { precoErrado: n.precoErrado, taxaValor: errTaxa, sobra: c(n.precoErrado - errTaxa - custoTotal) },
    mes: { vendas, lucro: c(lucroValor * vendas), faturamento: c(preco * vendas) },
  };
};

const fmt = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const brl = (v: number) => `R$ ${fmt.format(v)}`;
export const pct = (v: number) => `${Math.round(v * 100)}%`;
