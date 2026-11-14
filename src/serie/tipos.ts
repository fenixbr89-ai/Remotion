import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const negocioSchema = z.object({
  episodio: z.number().int().min(1),
  /** Como aparece no gancho: "uma AÇAITERIA" */
  artigo: z.string(),
  nome: z.string(),
  corDestaque: zColor(),
  corDestaqueClara: zColor(),
  cardapio: z.array(z.object({ nome: z.string(), detalhe: z.string() })).min(1).max(4),
  /** índice do carro-chefe dentro do cardápio */
  carroChefe: z.number().int().min(0),
  itens: z.array(z.object({ nome: z.string(), qtd: z.string(), custo: z.number().min(0) })).min(1).max(10),
  taxa: z.number().min(0).max(1),
  lucro: z.number().min(0).max(1),
  precoErrado: z.number().positive(),
  vendasPorDia: z.number().int().positive(),
  diasPorMes: z.number().int().positive(),
});

export type Negocio = z.infer<typeof negocioSchema>;

export type Numeros = {
  custoTotal: number;
  preco: number;
  taxaValor: number;
  lucroValor: number;
  erro: { precoErrado: number; taxaValor: number; sobra: number };
  mes: { vendas: number; lucro: number; faturamento: number };
};
