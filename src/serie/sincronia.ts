/**
 * Sincronia do EP. 01 com a narração (public/audio/ep01-narracao.wav, 67,2 s).
 * `inicio`: segundo em que a cena começa (alinhado ao começo da fala).
 * `marcas`: frames DENTRO da cena em que cada coisa é dita.
 * Tempos medidos pelas pausas do áudio (silencedetect) e conferidos com o roteiro.
 */
export type Marcas = Record<string, number | number[]>;

export const EP01 = {
  audio: "audio/ep01-narracao.wav",
  fim: 68.0,
  cenas: {
    Gancho: { inicio: 0, marcas: {} },
    Loja: { inicio: 2.25, marcas: { preco: 46 } },
    Chute: { inicio: 4.95, marcas: { conta: 44 } },
    Cardápio: { inicio: 7.5, marcas: { foco: 48 } },
    Custo: { inicio: 10.5, marcas: { itens: [37, 52, 67, 87, 128, 154, 166, 180], total: 208, piso: 272 } },
    Erro: { inicio: 22.3, marcas: { valor: 26, vizinho: 50 } },
    App: { inicio: 25.3, marcas: { taxa: 40, custo: 100, final: 108 } },
    Sobra: { inicio: 29.35, marcas: { valor: 12, cupom: 76 } },
    Fórmula: { inicio: 34.35, marcas: { l1: 36, passo1: 16, l2: 112, l3: 128, preco: 143 } },
    Divisão: { inicio: 41.0, marcas: { custo: 46, taxa: 96, lucro: 176, slam: 200 } },
    Mês: { inicio: 49.45, marcas: { vendas: 4, dias: 60, total: 106 } },
    Frase: { inicio: 56.75, marcas: { preco: 18, certo: 26 } },
    Produto: { inicio: 58.45, marcas: { clique: 34, botao: 74 } },
    Comenta: { inicio: 62.25, marcas: {} },
    Outro: { inicio: 65.2, marcas: { curtir: 24, seguir: 40 } },
  } as Record<string, { inicio: number; marcas: Marcas }>,
};
