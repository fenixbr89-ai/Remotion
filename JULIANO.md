# Juliano Pinturas — comercial vertical 9:16

Composição `JulianoPinturas` · 1080×1920 · 30 fps · 45 s (1350 frames).

```bash
npx remotion render JulianoPinturas out/juliano.mp4 --pixel-format=yuv420p --crf=18
# trilha e efeitos: OUT_DIR=juliano BPM=95 DUR=45 DRUMS_IN=5 DROP_START=99 OUTRO=41 node scripts/gerar-audio.mjs
```

- `src/juliano/tema.ts` — cores (laranja #F26A1B) e tempos das 6 cenas.
- `src/juliano/scenes/` — J01 Potencial, J02 Ambientes, J03 Detalhes, J04 Soluções, J05 Contato, J06 Logo.
- `src/juliano/tintaWipe.tsx` — transição de pincelada laranja.
- Fio condutor: a linha laranja de tinta passa por todas as cenas.

## Narração

Grave a locução e salve em `public/juliano/narracao.wav`; renderize com
`--props='{"narracao":true}'`. Para o vídeo seguir a voz palavra por palavra, ajuste `J_START`
em `tema.ts` às pausas da gravação (como foi feito no vídeo da Pixora).
