import { test } from "node:test";
import assert from "node:assert/strict";
import { contaMarmita } from "./numeros";

test("EP02: números do roteiro (10,00 / 13 / 16,00 / 20,00 / 5,00)", () => {
  const k = contaMarmita();
  assert.equal(k.custo, 10);
  assert.equal(k.precoIfood, 20);
  assert.equal(k.taxaValor, 5);
  assert.equal(k.sobra, 5);
  assert.equal(k.precoBalcao, 16);
});
