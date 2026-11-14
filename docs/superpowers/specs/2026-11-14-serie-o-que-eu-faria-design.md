# Série "O que eu faria se abrisse uma…" — Design

## Intenção
Série de Reels em motion graphics. Em cada episódio, mostro na prática como eu precificaria
um tipo de negócio de delivery (açaiteria, pizzaria, hamburgueria…). O conteúdo ensina de
verdade; o **Preço Certo** (siteprecocerto.vercel.app) aparece como a ferramenta que faz a conta.

## Objetivos
- Vídeo vertical 1080×1920, 30 fps, **mínimo 60 s** (alvo ~62 s).
- Um único molde; cada negócio é uma ficha de dados. Episódio novo = nova ficha.
- Números que batem: `preço = custo ÷ (1 − taxa − lucro desejado)`, calculado no código.
- Selo **"valores de exemplo"** visível o tempo todo.

## Não-objetivos / anti-objetivos
- Sem narração por enquanto (texto + espaço para música; tempos pensados para voz depois).
- Não copiar identidade de programas de TV. Identidade é a do Preço Certo.
- Falha mesmo "funcionando": conta errada na tela, texto pequeno demais para celular,
  ou vídeo com cara de anúncio puro.

## Identidade visual (do site)
Azul `#3B82F6` (claro `#60A5FA`), escuro `#1A1B1D`/`#17181A`, claro `#F4F4F2`, cinza `#6B6F76`,
fonte **Plus Jakarta Sans** (@remotion/google-fonts). Logo: quadrado branco arredondado com ícone de etiqueta.
Elementos reaproveitados: cards Custo/Taxas/Ganho, etiqueta "VENDER A R$ X", card "Quanto sobrou".
Cada negócio tem uma cor de destaque própria (açaí: roxo `#7C3AED`) ao lado do azul da marca.

## Abordagens
- **A) Molde reutilizável + ficha de dados — escolhida.** Série consistente, episódios rápidos.
- B) Cada episódio feito à mão — mais liberdade, muito mais tempo e visual inconsistente.

## Estrutura do episódio (~62 s)
1. **Gancho** (0–5 s): "O que eu faria se abrisse uma AÇAITERIA" + "EP. 01".
2. **Cardápio** (5–12 s): 3 tamanhos (300/500/700 ml); foco no carro-chefe (500 ml).
3. **Custo item por item** (12–28 s): ingredientes e embalagem entram um a um; soma rolando até o custo total.
4. **O erro comum** (28–38 s): "Se eu cobrasse R$ 18 como muita gente…" → taxa do app morde → "sobrava só R$ X".
5. **A conta certa** (38–48 s): fórmula animada com os números → etiqueta "VENDER A R$ Y".
6. **Meta do mês** (48–55 s): N vendas/dia × 26 dias → lucro estimado no mês.
7. **Chamada** (55–62 s): logo Preço Certo, "Faço essa conta no Preço Certo", "Teste grátis", endereço do site.

## Ficha da açaiteria (estimativas de mercado, carro-chefe 500 ml)
| Item | Custo |
|---|---|
| Açaí 400 g (R$ 20/kg) | 8,00 |
| Granola 30 g | 0,60 |
| Leite em pó 20 g | 0,80 |
| Leite condensado 30 g | 0,50 |
| Banana 50 g | 0,30 |
| Copo + tampa | 0,60 |
| Colher | 0,08 |
| Sacola/lacre | 0,30 |
| **Custo total** | **11,18** |
Taxa do app 27%, lucro desejado 20% → preço 11,18 ÷ 0,53 = **R$ 21,09**.
Erro comum: cobrar R$ 18 → 18 − 4,86 − 11,18 = **R$ 1,96**. Meta: 40 copos/dia × 26 dias.

## Construção
- `src/serie/` com: tipos + cálculo (`calc.ts`), ficha por negócio (`negocios/acaiteria.ts`),
  cenas (uma por arquivo), componentes (Etiqueta, Card, Selo, ContadorDinheiro), `Episodio.tsx`.
- Uma `<Composition>` por episódio em `Root.tsx`, schema zod para a ficha (editável no Studio).
- Teste simples do cálculo (valores acima). Render de verificação + frames de conferência.

## Fica a cargo de quem constrói
Easing e transições exatas, ícones (SVG desenhados à mão), tempos finos dentro de cada cena.
