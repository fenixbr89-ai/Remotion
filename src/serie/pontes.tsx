import { brl } from "./calc";
import { G, type Ret } from "./geo";
import type { Numeros } from "./tipos";
import { CopoAcai } from "./ui/Ilustracoes";
import type { PonteDef } from "./ui/Ponte";
import { cor, fontFamily } from "./tema";

const AZUL = cor.azul;

/**
 * Cada ponte liga a cena anterior à cena de mesmo nome: o elemento vai direto de um lugar ao outro,
 * esticando ou encolhendo. Nada cobre a tela e nada gira. Tempos relativos ao corte (0 = início da cena).
 */
export const pontes = (k: Numeros): Record<string, PonteDef> => {
  const fatiaLucro: Ret = { ...G.divisaoBarra, x: G.divisaoBarra.x + G.divisaoBarra.w * (1 - k.lucroValor / k.preco), w: (G.divisaoBarra.w * k.lucroValor) / k.preco, r: 0 };
  return {
    // sublinhado do nome desce e vira a porta da loja
    Loja: { chaves: [{ t: -6, ret: G.ganchoBarra, cor: AZUL, degrade: true }, { t: 12, ret: G.lojaPorta, cor: cor.texto }] },
    // a porta afina e vira o risco vermelho do "CHUTE."
    Chute: { chaves: [{ t: -6, ret: G.lojaPorta, cor: cor.texto }, { t: 12, ret: G.chuteRisco, cor: cor.vermelho }] },
    // o sublinhado de "É CONTA." encolhe e vira a pílula do 500 ml
    Cardápio: { chaves: [{ t: -6, ret: G.contaBarra, cor: AZUL, degrade: true }, { t: 12, ret: G.cardapioPilula, cor: AZUL, degrade: true }] },
    // o copo de 500 ml desliza e vira o copo da conta
    Custo: { chaves: [{ t: -6, ret: G.cardapioCopo, cor: AZUL }, { t: 12, ret: G.custoCopo, cor: AZUL }], conteudo: (r) => <CopoAcai tamanho={r.w} /> },
    // o card do total encolhe e vira o sublinhado do "R$ 18,00"
    Erro: { chaves: [{ t: -6, ret: G.custoTotal, cor: AZUL, degrade: true }, { t: 12, ret: G.erroBarra, cor: AZUL, degrade: true }] },
    // o "R$ 18,00" encolhe e pousa no total do pedido
    App: {
      chaves: [{ t: -6, ret: G.erroValor, cor: cor.preto }, { t: 12, ret: G.appTotal, cor: cor.preto }],
      conteudo: (r) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", fontFamily, fontWeight: 800, fontSize: r.h * 0.8, letterSpacing: -r.h * 0.03, color: cor.preto, whiteSpace: "nowrap" }}>{brl(k.erro.precoErrado)}</div>
      ),
    },
    // o quadro "Você fica com" encolhe e vira o sublinhado vermelho do "R$ 1,96"
    Sobra: { chaves: [{ t: -6, ret: G.appResultado, cor: cor.vermelhoFundo }, { t: 12, ret: G.sobraBarra, cor: cor.vermelho }] },
    // o sublinhado sobe e se abre na faixa da fórmula
    Fórmula: { chaves: [{ t: -6, ret: G.sobraBarra, cor: cor.azulCeu }, { t: 12, ret: G.formulaLinha, cor: cor.azulFundo }] },
    // a etiqueta do preço estica e vira a barra de divisão
    Divisão: { chaves: [{ t: -6, ret: G.formulaEtiqueta, cor: AZUL, degrade: true }, { t: 12, ret: G.divisaoBarra, cor: AZUL, degrade: true }] },
    // a fatia verde do lucro vira o calendário
    Mês: { chaves: [{ t: -6, ret: fatiaLucro, cor: cor.verde }, { t: 12, ret: G.mesCalendario, cor: cor.branco }] },
    // o card do lucro encolhe e vira o sublinhado de "PREÇO CERTO."
    Frase: { chaves: [{ t: -6, ret: G.mesLucro, cor: cor.verdeFundo }, { t: 12, ret: G.fraseBarra, cor: AZUL, degrade: true }] },
    // o sublinhado vira o ícone da marca no celular
    Produto: { chaves: [{ t: -6, ret: G.fraseBarra, cor: AZUL, degrade: true }, { t: 12, ret: G.produtoLogo, cor: AZUL, degrade: true }] },
    // o botão "Teste grátis" estica e vira a faixa do "COMENTE"
    Comenta: { chaves: [{ t: -6, ret: G.produtoBotao, cor: AZUL, degrade: true }, { t: 12, ret: G.comentaFaixa, cor: cor.azulFundo }] },
    // o coração do comentário cresce e vira o botão de curtir
    Outro: { chaves: [{ t: -6, ret: G.comentaCoracao, cor: cor.vermelho }, { t: 12, ret: G.outroCoracao, cor: cor.azulFundo }] },
  };
};
