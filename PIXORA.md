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

A narração não foi gerada (nenhum serviço de voz disponível). Para incluir:

1. Grave ou gere com TTS (ex.: ElevenLabs, voz masculina jovem PT-BR) uma faixa por fala, usando os textos de `NARRACAO` em `timeline.ts`.
2. Salve como `public/narracao/cena-01.mp3` … `cena-10.mp3`.
3. Renderize com `--props='{"narracao":true,"legendas":true}'` (a trilha abaixa automaticamente).

Se a duração das falas diferir, ajuste `from`/`to` em `NARRACAO` — as legendas seguem esses valores.

## Créditos de assets

- Emojis 3D: Microsoft Fluent Emoji (MIT) — `public/emoji/`.
- Fonte: Inter Display (SIL OFL) — `public/fonts/`. SF Pro Display é usada se estiver instalada.
- Trilha e SFX: sintetizados por `scripts/gerar-audio.mjs`.

## Exportar para celular

Para tocar liso no iPhone/Instagram, re-encode com um quadro-chave por segundo:

```bash
ffmpeg -i out/pixora.mp4 -c:v libx264 -crf 18 -pix_fmt yuv420p -g 30 -c:a aac -b:a 192k -movflags +faststart out/pixora-final.mp4
```
