# Juliano Pinturas — comercial vertical 9:16 (estilo Apple/iPhone)

Composição `JulianoPinturas` · 1080×1920 · 30 fps · 45 s (1350 frames). Sem narração por enquanto.

```bash
npx remotion render JulianoPinturas out/juliano.mp4 --pixel-format=yuv420p --crf=18
```

- `src/juliano/JulianoVideo.tsx` — o filme inteiro numa linha do tempo contínua (`T` em `tema.ts`),
  para os elementos passarem de uma cena para a outra: ponto → ícone do app → cabeçalho do card;
  card de notificação → widget com a grade; pincel da grade → destaque "Pintura."; ícone de
  ligação → ícone da marca no final.
- `src/juliano/kit.tsx` — vidro iOS, card de notificação, ícone do app, texto em gradiente, fundo aurora.
- `public/juliano/emoji/` — objetos 3D (Microsoft Fluent Emoji 3D, licença MIT).

## Narração (por último)

Salve em `public/juliano/narracao.wav` e renderize com `--props='{"narracao":true}'`.
Para o vídeo seguir a voz, ajuste os tempos de `T` em `tema.ts` às pausas da gravação.
