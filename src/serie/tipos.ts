import { z } from "zod";
import { NOMES_ICONES } from "./ui/Icones";

const icone = z.enum(NOMES_ICONES);

export const negocioSchema = z.object({
  episodio: z.number().int().min(1),
  /** Como aparece no gancho: "uma AÇAITERIA" */
  artigo: z.string(),
  nome: z.string(),
  /** Ícones que flutuam no gancho */
  iconesGancho: z.array(icone).min(1).max(4),
  cardapio: z.array(z.object({ nome: z.string(), detalhe: z.string() })).min(1).max(4),
  /** índice do carro-chefe dentro do cardápio */
  carroChefe: z.number().int().min(0),
  itens: z.array(z.object({ nome: z.string(), qtd: z.string(), custo: z.number().min(0), icone })).min(1).max(10),
  taxa: z.number().min(0).max(1),
  lucro: z.number().min(0).max(1),
  precoErrado: z.number().positive(),
  vendasPorDia: z.number().int().positive(),
  diasPorMes: z.number().int().positive(),
  /** Sugestões que aparecem nos comentários do final */
  proximos: z.array(z.string()).min(1).max(4),
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
