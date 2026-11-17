/**
 * Números do vídeo "Desafio: marmita a R$ 18,90". Fórmula da série:
 * preço = custo ÷ (1 − taxa − lucro).
 */
export const DADOS = {
  itens: [
    { nome: "Arroz", custo: 0.9, img: "3d/cooked_rice.png" },
    { nome: "Feijão tropeiro", custo: 2.8, img: "3d/beans.png" },
    { nome: "Bife (150 g)", custo: 6.75, img: "3d/cut_of_meat.png" },
    { nome: "Salada", custo: 0.9, img: "3d/green_salad.png" },
    { nome: "Embalagem", custo: 1.6, icone: "package" },
    { nome: "Gás e energia", custo: 0.55, img: "3d/fire.png" },
  ] as { nome: string; custo: number; img?: string; icone?: string }[],
  precoApp: 18.9,
  taxaIfood: 0.27,
  taxaMaquininha: 0.03,
  lucro: 0.2,
  porDia: 30,
  dias: 26,
};

const c = (v: number) => Math.round(v * 100) / 100;

export const conta = (d = DADOS) => {
  const custo = c(d.itens.reduce((s, i) => s + i.custo, 0));
  const taxaApp = c(d.precoApp * d.taxaIfood);
  const sobraApp = c(d.precoApp - custo - taxaApp);
  const precoIfood = c(custo / (1 - d.taxaIfood - d.lucro));
  const precoBalcao = c(custo / (1 - d.taxaMaquininha - d.lucro));
  const taxaCerta = c(precoIfood * d.taxaIfood);
  const sobraCerta = c(precoIfood - custo - taxaCerta);
  const vendasMes = d.porDia * d.dias;
  return { custo, taxaApp, sobraApp, precoIfood, precoBalcao, taxaCerta, sobraCerta, vendasMes, mesErrado: c(sobraApp * vendasMes), mesCerto: c(sobraCerta * vendasMes) };
};

const fmt = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const brl = (v: number) => `R$ ${fmt.format(v)}`;
