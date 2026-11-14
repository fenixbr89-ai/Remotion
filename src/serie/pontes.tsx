import { brl } from "./calc";
import { G, PONTO_CENTRO, TELA_CHEIA, type Ret } from "./geo";
import type { Numeros } from "./tipos";
import { CopoAcai } from "./ui/Ilustracoes";
import type { PonteDef } from "./ui/Ponte";
import { cor, fontFamily } from "./tema";

const AZUL = cor.azul;

/** Cada ponte liga a cena anterior à cena de mesmo nome. Tempos relativos ao corte (0 = início da cena). */
export const pontes = (k: Numeros): Record<string, PonteDef> => {
  const fatiaLucro: Ret = { ...G.divisaoBarra, x: G.divisaoBarra.x + G.divisaoBarra.w * (1 - k.lucroValor / k.preco), w: (G.divisaoBarra.w * k.lucroValor) / k.preco, r: 0 };
  return {
    // sublinhado do nome estica, cobre a tela e encolhe até virar a porta da loja
    Loja: { chaves: [{ t: -6, ret: G.ganchoBarra, cor: AZUL, degrade: true }, { t: 4, ret: TELA_CHEIA, cor: AZUL, degrade: true }, { t: 16, ret: G.lojaPorta, cor: cor.texto }] },
    // a porta cresce, escurece a tela e vira o risco vermelho no "CHUTE."
    Chute: { chaves: [{ t: -8, ret: G.lojaPorta, cor: cor.texto }, { t: 3, ret: TELA_CHEIA, cor: cor.texto }, { t: 12, ret: { ...G.chuteRisco, x: 300, w: 480 }, cor: cor.texto }, { t: 16, ret: G.chuteRisco, cor: cor.vermelho }] },
    // o sublinhado de "É CONTA." vira um círculo girando e cai como a pílula do 500 ml
    Cardápio: { chaves: [{ t: -10, ret: G.contaBarra, cor: AZUL, degrade: true }, { t: 0, ret: { x: 480, y: 960, w: 120, h: 120, r: 60 }, cor: AZUL, degrade: true, giro: 360 }, { t: 12, ret: G.cardapioPilula, cor: AZUL, degrade: true, giro: 360 }] },
    // o copo de 500 ml voa e vira o copo da conta
    Custo: {
      chaves: [{ t: -8, ret: G.cardapioCopo, cor: AZUL }, { t: -2, ret: { x: 300, y: 640, w: 300, h: 345, r: 0 }, cor: AZUL, giro: -12 }, { t: 10, ret: G.custoCopo, cor: AZUL }],
      conteudo: (r) => <CopoAcai tamanho={r.w} />,
    },
    // o card do total cobre a tela e se fecha num ponto
    Erro: { chaves: [{ t: -8, ret: G.custoTotal, cor: AZUL, degrade: true }, { t: 2, ret: TELA_CHEIA, cor: AZUL, degrade: true }, { t: 14, ret: PONTO_CENTRO, cor: AZUL, degrade: true }] },
    // o "R$ 18,00" encolhe e pousa no total do pedido
    App: {
      chaves: [{ t: -6, ret: G.erroValor, cor: cor.preto }, { t: 10, ret: G.appTotal, cor: cor.preto }],
      conteudo: (r) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", fontFamily, fontWeight: 800, fontSize: r.h * 0.8, letterSpacing: -r.h * 0.03, color: cor.preto, whiteSpace: "nowrap" }}>{brl(k.erro.precoErrado)}</div>
      ),
    },
    // o quadro vermelho do resultado cobre a tela e vira o sublinhado do "R$ 1,96"
    Sobra: { chaves: [{ t: -8, ret: G.appResultado, cor: cor.vermelhoFundo }, { t: 2, ret: TELA_CHEIA, cor: cor.vermelho }, { t: 14, ret: G.sobraBarra, cor: cor.vermelho }] },
    // o sublinhado gira, vira uma bola azul e se abre na faixa da fórmula
    Fórmula: { chaves: [{ t: -8, ret: G.sobraBarra, cor: cor.vermelho }, { t: -2, ret: { x: 430, y: 900, w: 220, h: 120, r: 60 }, cor: cor.vermelho, giro: 150 }, { t: 0, ret: { x: 470, y: 890, w: 140, h: 140, r: 70 }, cor: AZUL, giro: 270 }, { t: 12, ret: G.formulaLinha, cor: cor.azulFundo, giro: 360 }] },
    // a etiqueta do preço estica e vira a barra de divisão
    Divisão: { chaves: [{ t: -8, ret: G.formulaEtiqueta, cor: AZUL, degrade: true }, { t: 10, ret: G.divisaoBarra, cor: AZUL, degrade: true }] },
    // a fatia verde do lucro gira e vira o calendário
    Mês: { chaves: [{ t: -8, ret: fatiaLucro, cor: cor.verde }, { t: 2, ret: { x: 660, y: 470, w: 180, h: 180, r: 90 }, cor: cor.verde, giro: 360 }, { t: 12, ret: G.mesCalendario, cor: cor.branco, giro: 360 }] },
    // o card do lucro cobre a tela e se fecha
    Frase: { chaves: [{ t: -8, ret: G.mesLucro, cor: cor.verdeFundo }, { t: 2, ret: TELA_CHEIA, cor: AZUL, degrade: true }, { t: 14, ret: PONTO_CENTRO, cor: AZUL, degrade: true }] },
    // a barra de "PREÇO CERTO." gira e vira o ícone da marca no celular
    Produto: { chaves: [{ t: -8, ret: G.fraseBarra, cor: AZUL, degrade: true }, { t: 2, ret: { x: 480, y: 900, w: 120, h: 120, r: 34 }, cor: AZUL, degrade: true, giro: 180 }, { t: 14, ret: G.produtoLogo, cor: AZUL, degrade: true, giro: 360 }] },
    // o botão "Teste grátis" estica e vira a faixa do "COMENTE"
    Comenta: { chaves: [{ t: -8, ret: G.produtoBotao, cor: AZUL, degrade: true }, { t: 10, ret: G.comentaFaixa, cor: cor.azulFundo }] },
    // o coração do comentário cresce e vira o fundo azul do final
    Outro: { chaves: [{ t: -6, ret: G.comentaCoracao, cor: cor.vermelho }, { t: -1, ret: { x: 266, y: 962, w: 160, h: 160, r: 80 }, cor: cor.vermelho }, { t: 2, ret: { x: 236, y: 932, w: 220, h: 220, r: 110 }, cor: AZUL, degrade: true }, { t: 12, ret: TELA_CHEIA, cor: AZUL, degrade: true }] },
  };
};
