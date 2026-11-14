# PIXORA — vídeo vertical 9:16

Composição `Pixora` · 1080×1920 · 30 fps · 54 s (1620 frames).

## Comandos

```bash
npm i
npm run dev                                   # Studio (cada cena também está em "Pixora-Cenas")
npx remotion render Pixora out/pixora.mp4 --pixel-format=yuv420p --crf=18   # render final
node scripts/gerar-audio.mjs                  # regenera trilha e SFX em public/audio
```

## Estrutura

- `src/pixora/timeline.ts` — tempos das cenas, durações e falas da narração (fonte das legendas).
- `src/pixora/scenes/` — uma cena por arquivo (Cena01Gancho … Cena11Logo).
- `src/pixora/ui.tsx` — tema, tipografia cinética (`Kinetic`), câmera contínua (`Drift`), iPhone, logo P em vetor, emojis.
- `src/pixora/transicoes.tsx` — empurrão de câmera e dissolve com profundidade. As passagens 1→2, 2→3, 3→4 e 10→11 acontecem dentro das cenas (zoom, ponto que cresce, círculo, zoom no celular).
- `src/pixora/Legendas.tsx` — legendas palavra por palavra no terço inferior.
- `src/pixora/Som.tsx` — trilha, efeitos sonoros e narração.

## Narração

A narração gravada está em `public/narracao/pixora_narracao.wav` e é dividida em trechos por
`NARRACAO_CLIPS` em `src/pixora/timeline.ts` (`de`/`ate` = trecho do arquivo, `em` = momento no vídeo).
A trilha abaixa automaticamente enquanto a voz fala. Para trocar a gravação, substitua o arquivo e
ajuste os tempos dos trechos. Para exportar sem voz: `--props='{"narracao":false,"legendas":false}'`.

Para o arquivo final, normalize o áudio para redes sociais:

```bash
ffmpeg -i out/pixora.mp4 -c:v libx264 -crf 18 -pix_fmt yuv420p -g 30 \
  -af "alimiter=limit=0.8:level=false,loudnorm=I=-14:TP=-1.5:LRA=11" \
  -c:a aac -b:a 192k -movflags +faststart out/pixora-final.mp4
```

## Créditos de assets

- Emojis 3D: Microsoft Fluent Emoji (MIT) — `public/emoji/`.
- Fonte: Inter Display (SIL OFL) — `public/fonts/`. SF Pro Display é usada se estiver instalada.
- Trilha e SFX: sintetizados por `scripts/gerar-audio.mjs`.

## Exportar para celular

Para tocar liso no iPhone/Instagram, re-encode com um quadro-chave por segundo:

```bash
ffmpeg -i out/pixora.mp4 -c:v libx264 -crf 18 -pix_fmt yuv420p -g 30 -c:a aac -b:a 192k -movflags +faststart out/pixora-final.mp4
```
