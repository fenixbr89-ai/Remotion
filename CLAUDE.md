# Vídeos do Preço Certo — padrão de estilo

Série de Reels "O que eu faria se abrisse uma…" para o Preço Certo (siteprecocerto.vercel.app).
**Todo vídeo novo segue quase este mesmo estilo**, o do EP. 01 (Açaiteria), aprovado pelo cliente. Mude só o que ele pedir.

## Formato
- Reels vertical 1080×1920, 30 fps, **mínimo 60 s**.
- Com narração do cliente: o vídeo segue a voz (cortes e marcas em `src/serie/sincronia.ts`).
- Texto e conversa sempre em português do Brasil.

## Visual (obrigatório)
- **Fundo branco liso.** Sem grade de pontos, sem manchas, sem formas decorativas.
- Cores da marca: azul em degradê (#1D4ED8 → #3B82F6 → #60A5FA). Preto só em detalhes (valores, contornos).
- Fonte Plus Jakarta Sans (local, em `public/fonts`).
- Ícones e ilustrações 2D planos, no azul da marca.
- **Topo limpo:** sem logo, sem "EP. 01", sem abas de etapas. Só a frase da cena.
- **Sem selo "valores de exemplo".**
- **Nenhuma palavra inclinada.** Texto e números sempre retos.

## Movimento
- Ritmo rápido, estilo Reels (algo novo a cada 0,5 a 1 s).
- Tipografia cinética: palavras entram uma a uma (desfoque → foco, acendem em azul), destaques com marca-texto, palavra-chave gigante com "slam", valores em contador que gira (Odometro).
- **Elemento-ponte entre cenas:** um elemento da cena atual vira um elemento da próxima, indo direto de um lugar ao outro (estica ou encolhe). Ver `src/serie/pontes.tsx` e `src/serie/geo.ts`.
- Entradas elásticas suaves (esticar) são permitidas.

## Proibido (o cliente pediu para tirar)
- Efeitos tremidos (tremor, pulsar, flutuar, pulinhos).
- Elementos girando na tela (raios, formas, moedas, pontes girando).
- Transições que cobrem a tela inteira (círculo azul, inundação) ou que fecham num ponto.
- Final em tela cheia azul: o final é em fundo branco.

## Revisão obrigatória antes de entregar
Renderize um quadro de cada cena (com uma linha guia no centro) e confira:
- Texto e números **centralizados dentro das caixas** (horizontal e vertical) e grupos centralizados na tela.
- Nada cortado: acentos e **cedilha** (texto em degradê precisa de folga embaixo), bordas da tela, caixas.
- Nada sobreposto: selos, sublinhados e frases não podem cobrir números ou encostar em outros elementos.

## Estrutura do episódio
Gancho → Loja → "Preço não é chute, é conta" → Cardápio → Custo item a item (ingredientes caem no copo, cupom imprime, total gira) → Erro comum (preço "do vizinho") → App de delivery (taxa come o lucro) → Sobra → Fórmula `preço = custo ÷ (1 − taxa − lucro)` → Divisão custo/taxa/lucro → Lucro do mês → "Isso é PREÇO CERTO." → Demo do app (cursor, loading, ✓) + Teste grátis → "Comente qual o próximo negócio" → Curtir e seguir.

## Novo episódio
1. Ficha do negócio em `src/serie/negocios/<negocio>.ts` (custos estimados de mercado; as contas saem de `src/serie/calc.ts`).
2. Narração em `public/audio/`, tempos em `src/serie/sincronia.ts`.
3. Nova `<Composition>` em `src/Root.tsx`.

## Comandos
- `npm test`: confere as contas.
- Render: `npx remotion render EP01-Acaiteria out/ep01-acaiteria.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
