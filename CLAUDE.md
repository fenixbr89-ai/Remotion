# Preferências do projeto

## Marca d'água padrão (aplicar em todo vídeo novo)

Todo vídeo deve levar a marca d'água **"Kayke.hs"**, exatamente assim:

- **Uma só** marca no vídeo, **bem pequena** (texto ~26px num vídeo de 1080px de largura).
- Estilo: texto branco `rgba(255,255,255,0.85)`, peso 600, dentro de uma pílula escura translúcida
  (`background: rgba(20,16,36,0.28)`, `padding: 6px 16px`, `borderRadius: 999`), para aparecer em fundo
  claro e escuro sem atrapalhar o vídeo.
- Movimento: a duração do vídeo é dividida em 4 partes iguais; ela fica parada em cada posição e
  desliza suavemente (~30 frames, easing in-out) para a próxima:
  1. canto superior esquerdo
  2. canto superior direito
  3. canto inferior esquerdo
  4. centro (um pouco abaixo do meio, ~56% da altura, para não cobrir textos)
- Conferir em stills que ela não cobre nenhum texto; se cobrir, ajustar a posição.

Implementação de referência: `src/Kronic/Watermark.tsx` (componente `<Watermark />`, colocado por último
dentro do `AbsoluteFill` da composição principal, acima de todas as cenas).

## Renderização

O Chromium do ambiente às vezes gera quadros "ladrilhados" em renders paralelos. Renderizar sempre com:

```
npx remotion render <Composição> out/<arquivo>.mp4 --concurrency=1 --image-format=png --crf=18 \
  --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
```
