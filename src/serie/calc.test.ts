import { test } from "node:test";
import assert from "node:assert/strict";
import { calcular, brl } from "./calc";
import { acaiteria } from "./negocios/acaiteria";

test("açaiteria: custo, preço, erro e mês batem com o design", () => {
  const n = calcular(acaiteria);
  assert.equal(n.custoTotal.toFixed(2), "11.18");
  assert.equal(n.preco.toFixed(2), "21.09");
  assert.equal(n.erro.sobra.toFixed(2), "1.96");
  assert.equal(n.erro.taxaValor.toFixed(2), "4.86");
  assert.equal(n.mes.vendas, 40 * 26);
});

test("soma dos itens arredondados = custo total exibido", () => {
  const n = calcular(acaiteria);
  const soma = acaiteria.itens.reduce((s, i) => s + Math.round(i.custo * 100), 0) / 100;
  assert.equal(brl(soma), brl(n.custoTotal));
});

test("lucro do preço certo = margem desejada sobre o preço", () => {
  const n = calcular(acaiteria);
  assert.equal(n.lucroValor.toFixed(2), (n.preco - n.taxaValor - n.custoTotal).toFixed(2));
});

test("taxa + lucro >= 100% lança erro", () => {
  assert.throws(() => calcular({ ...acaiteria, taxa: 0.6, lucro: 0.4 }));
});

test("brl formata no padrão brasileiro", () => {
  assert.equal(brl(21.09), "R$ 21,09");
  assert.equal(brl(4388.4), "R$ 4.388,40");
});
