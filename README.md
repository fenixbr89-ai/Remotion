# Vídeo de ofertas — Mariana Supermercado

Vídeo vertical (1080x1920, 30fps, ~44s) no estilo "motion de ofertas".

## Trocar as ofertas
Edite `src/Ofertas/config.ts`:
- `PRODUTOS`: nome, preço, unidade e imagem de cada oferta (as imagens ficam em `public/`, de preferência PNG sem fundo).
- `VALIDADE`: texto da validade.
- `COR`: cores do vídeo.

Textos das cenas ficam em `src/Ofertas/Cenas.tsx`.

## Ver e exportar
```
npm i
npm run dev                                   # abre o Remotion Studio
npx remotion render OfertasMariana out/ofertas-mariana.mp4
```
