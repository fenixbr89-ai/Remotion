import { brl, pct } from "./calc";
import { ritmoCustos } from "./cenas/Custos";
import { destaca } from "./cenas/props";
import type { Negocio, Numeros } from "./tipos";
import type { Frase } from "./ui/Legenda";

/**
 * Roteiro do episódio: o que aparece na legenda (e o texto para gravar a narração).
 * `em` é o frame dentro da cena. *palavras* = destaque.
 */
const nb = (s: string) => s.replace(/ /g, " ");

export const ROTEIRO: Record<string, (n: Negocio, k: Numeros, dur: number) => Frase[]> = {
  Loja: (n) => [
    { em: 6, l1: `Se eu abrisse ${n.artigo} *${n.nome.toLowerCase()},*`, l2: "a primeira coisa que eu faria" },
    { em: 110, l1: "é acertar o *preço* de cada copo.", l2: "Antes de vender o primeiro." },
  ],
  Cardápio: (n) => [
    { em: 4, l1: `Cardápio *enxuto:* só ${n.cardapio.length} tamanhos.`, l2: "Pouca opção, menos desperdício." },
    { em: 95, l1: `E a conta começa pelo ${destaca(n.cardapio[n.carroChefe].nome + ",")}`, l2: "o que mais vende." },
  ],
  Custo: (n, k, dur) => [
    { em: 4, l1: "Primeiro, o *custo real*", l2: "item por item, até a colher." },
    { em: ritmoCustos(n.itens.length, dur).fim, l1: `Cada copo me custa *${nb(brl(k.custoTotal))}.*`, l2: "Abaixo disso, é prejuízo." },
  ],
  Taxa: (n, k) => [
    { em: 4, l1: "O erro que eu *não* faria:", l2: `cobrar ${brl(k.erro.precoErrado)} "porque todo mundo cobra".`, tom: "vermelho" },
    { em: 160, l1: "Depois da taxa e do custo,", l2: `sobrava só *${nb(brl(k.erro.sobra))}* por copo.`, tom: "vermelho" },
  ],
  Preço: (n, k) => [
    { em: 4, l1: "A conta *certa* é:", l2: "custo ÷ (1 − taxa − lucro)" },
    { em: 120, l1: `O ${destaca(n.cardapio[n.carroChefe].nome)} sai por ${destaca(brl(k.preco) + ",")}`, l2: `com ${pct(n.lucro)} de lucro garantido.` },
  ],
  Lucro: (n, k) => [
    { em: 4, l1: `Vendendo *${nb(`${n.vendasPorDia} copos`)}* por dia,`, l2: `${n.diasPorMes} dias no mês…` },
    { em: 125, l1: `são *${nb(brl(k.mes.lucro))}* de lucro`, l2: "no fim do mês." },
  ],
  Chamada: () => [{ em: 4, l1: "Eu faço essa conta em segundos", l2: "no *Preço Certo.*" }],
  Comenta: () => [{ em: 4, l1: "*Comente* qual o próximo negócio", l2: "que você quer ver aqui." }],
  Outro: () => [],
};
