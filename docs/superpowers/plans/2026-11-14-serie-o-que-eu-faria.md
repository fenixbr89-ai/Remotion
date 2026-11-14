# Série "O que eu faria se abrisse uma…" — Plano de implementação

> Execução: nativa (nesta sessão), revisão no fim.

**Goal:** Episódio 01 (Açaiteria) do molde reutilizável, 1080×1920, 30 fps, ~62 s.
**Architecture:** Ficha de dados por negócio (`Negocio`) → `calcular()` gera todos os números → `Episodio` monta 7 cenas em `<Series>`. Cada episódio = uma `<Composition>`.
**Tech Stack:** Remotion 4, React 19, TypeScript, zod, @remotion/google-fonts (Plus Jakarta Sans).
**Spec:** docs/superpowers/specs/2026-11-14-serie-o-que-eu-faria-design.md

## Global Constraints
- 1080×1920, 30 fps, duração ≥ 1800 frames (alvo 1860).
- `preco = custo / (1 - taxa - lucro)`; valores em BRL com vírgula (`R$ 21,09`).
- Selo "valores de exemplo" em todas as cenas.
- Cores: azul #3B82F6, #60A5FA, escuro #17181A, claro #F4F4F2, cinza #6B6F76.

## Review Focus
- taxa + lucro ≥ 1 → `calcular` lança erro (preço infinito/negativo).
- Nomes longos de ingrediente/negócio não estouram a largura (fonte ajustável).
- Quantidade de ingredientes diferente de 8 (ex.: 5 ou 10) ainda cabe na cena de custos.
- Arredondamento: soma exibida dos itens = custo total exibido.
- Texto legível no celular (≥ 40px para corpo).

### Task 1: Cálculo + ficha
Files: `src/serie/tipos.ts`, `src/serie/calc.ts`, `src/serie/negocios/acaiteria.ts`, `src/serie/calc.test.ts`
- `calcular(n: Negocio): Numeros` → { custoTotal, preco, taxaValor, lucroValor, erro: { precoErrado, sobra }, mes: { vendas, lucro } }
- `brl(v: number): string`
- Teste (node --test via tsx): custo 11.18, preço 21.09 (2 casas), sobra ao cobrar 18 = 1.96, erro se taxa+lucro ≥ 1.

### Task 2: Componentes + cenas + composição
Files: `src/serie/ui/*`, `src/serie/cenas/*`, `src/serie/Episodio.tsx`, `src/Root.tsx`
- Verificação: `npx tsc --noEmit`, `npx remotion still` em 1 frame por cena, inspeção visual.

### Task 3: Render final
- `npx remotion render Acaiteria out/ep01-acaiteria.mp4`, conferir duração ≥ 60 s.
