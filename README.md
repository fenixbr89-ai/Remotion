# Série "O que eu faria se abrisse uma…" — Preço Certo

Reels em motion graphics (1080×1920, 30 fps, 62 s) feitos com Remotion.

## Comandos
- `npm run dev` — abre o Remotion Studio (dá pra editar a ficha do episódio no painel de props).
- `npm test` — confere as contas (custo, preço, sobra, lucro do mês).
- `npx remotion render EP01-Acaiteria out/ep01-acaiteria.mp4` — gera o vídeo.

## Novo episódio
1. Copie `src/serie/negocios/acaiteria.ts` para `src/serie/negocios/<negocio>.ts` e troque nome, cor,
   cardápio, itens com custo, taxa, lucro desejado, preço "errado" e vendas por dia.
2. Em `src/Root.tsx`, adicione outro `<Composition id="EP02-…" defaultProps={<negocio>} … />`.

As contas usam `preço = custo ÷ (1 − taxa − lucro)` e são calculadas em `src/serie/calc.ts`.
Os valores aparecem com o selo "valores de exemplo".
