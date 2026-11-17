import { G2 } from "./geo";
import { Marmita } from "./Marmita";
import type { PonteDef } from "../ui/Ponte";
import { cor } from "../tema";

/** Pontes do EP. 02 (nome = cena que recebe). Tempos relativos ao corte. Nada cobre a tela, nada gira. */
export const PONTES02: Record<string, PonteDef> = {
  // a marmita encolhe e vira o ícone do card de custo
  custo: { chaves: [{ t: -6, ret: G2.marmita, cor: cor.branco }, { t: 14, ret: G2.custoMini, cor: cor.branco }], conteudo: (r) => <Marmita largura={r.w} /> },
  // o total "R$ 10,00" encolhe e vira a etiqueta "Custo: R$ 10,00"
  erro: { chaves: [{ t: -6, ret: G2.custoTotal, cor: cor.azul, degrade: true }, { t: 12, ret: G2.erroCusto, cor: cor.azul, degrade: true }] },
  // o risco que cortou o R$ 13 vira o campo de digitação do chat
  preco: { chaves: [{ t: -6, ret: G2.erroRisco, cor: cor.azul, degrade: true }, { t: 12, ret: G2.chatEntrada, cor: cor.gelo }] },
  // a linha "iFood R$ 20,00" vira a primeira linha do card de sobra
  sobra: { chaves: [{ t: -6, ret: G2.chatIfood, cor: cor.branco }, { t: 12, ret: G2.sobraVendeu, cor: cor.gelo }] },
  // o "Sobrou" vira o círculo do logo
  cta: { chaves: [{ t: -6, ret: G2.sobraSobrou, cor: cor.verdeFundo }, { t: 12, ret: G2.ctaLogo, cor: cor.branco }] },
};
