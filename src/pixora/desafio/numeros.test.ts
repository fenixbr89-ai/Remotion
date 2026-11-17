import { test } from "node:test";
import assert from "node:assert/strict";
import { conta, brl } from "./numeros";

test("desafio: a R$ 18,90 sobram só R$ 0,30", () => {
  const k = conta();
  assert.equal(k.custo, 13.5);
  assert.equal(k.taxaApp, 5.1);
  assert.equal(k.sobraApp, 0.3);
});

test("desafio: preço certo e mês", () => {
  const k = conta();
  assert.equal(brl(k.precoIfood), "R$ 25,47");
  assert.equal(brl(k.precoBalcao), "R$ 17,53");
  assert.equal(brl(k.sobraCerta), "R$ 5,09");
  assert.equal(k.vendasMes, 780);
  assert.equal(brl(k.mesErrado), "R$ 234,00");
  assert.equal(brl(k.mesCerto), "R$ 3.970,20");
});
