# Vídeo Terça-feira Suína (Mariana)

**Composição:** `OfertasMariana` (1080x1920, 30fps, ~54s)
**Código:** `src/Ofertas/` — `config.ts` (produtos, preços, validade, WhatsApp, cores), `Cenas.tsx` (cenas), `ui.tsx` (componentes), `OfertasVideo.tsx` (ordem, transições, áudio)
**Saída:** `out/ofertas-mariana.mp4` (pasta `out/` fica fora do git)

## Estrutura (sincronizada com a narração)
1. Abertura: porquinho entra no centro e sobe em ~0,5s; "Chegou a TERÇA-FEIRA SUÍNA do Mariana Supermercado"; "é dia de aproveitar OFERTAS ESPECIAIS!"
2. Fundo branco: "Aqui você encontra PERNIL / COSTELINHA / LOMBO… fresquinhos!" (selo Terça-feira Suína desenhado no topo)
3. Fundo vermelho: "Confira OS PREÇOS DO DIA!"
4. Produtos um a um (cartão com moldura vermelha, preço com estouro amarelo); tempos em `TEMPOS` no Cenas.tsx, medidos na narração
5. "E TEM MAIS!"
6. Grade "IMPERDÍVEIS" → "ECONOMIZAR" → produtos entram na sacola → logo, "Mais sabor e economia", "pertinho de você!", WhatsApp, validade

## Áudio
- `public/narracao.wav` (locução do cliente, 53,6s)
- `public/trilha.wav` (trilha sintetizada, volume 0.22)

## Como trocar para uma nova semana
1. Editar `PRODUTOS`, `VALIDADE` em `config.ts`; fotos PNG sem fundo em `public/`.
2. Nova narração → transcrever (vosk pt, ver context/ferramentas.md) e reajustar tempos das cenas e `TEMPOS`.
3. Renderizar.
