# Juliano Pinturas — comercial vertical 9:16 (estilo Apple/iPhone)

Composição `JulianoPinturas` · 1080×1920 · 30 fps · 45 s (1350 frames). Sem narração por enquanto.

```bash
npx remotion render JulianoPinturas out/juliano.mp4 --pixel-format=yuv420p --crf=18
```

- `src/juliano/JulianoVideo.tsx` — plano-sequência numa linha do tempo contínua (`T` em `tema.ts`),
  sem cortes secos: ponto → logo → cabeçalho; cada serviço aparece grande e encolhe para o seu
  quadradinho até preencher a grade 3×3; o rolo vira o destaque "Pintura."; o preto se espalha a
  partir do rolo, o branco a partir de "Confiança."; o ícone do WhatsApp sai da lista e vira a cena,
  e depois vira a logo.
- `src/juliano/kit.tsx` — vidro iOS, card de notificação, ícone do app, texto em gradiente, fundo aurora.
- `public/juliano/emoji/` — objetos 3D (Microsoft Fluent Emoji 3D, licença MIT).
- `public/juliano/3d/` — logo em placa, rolo e WhatsApp enviados pelo cliente (fundos recortados).

## Narração (por último)

Salve em `public/juliano/narracao.wav` e renderize com `--props='{"narracao":true}'`.
Para o vídeo seguir a voz, ajuste os tempos de `T` em `tema.ts` às pausas da gravação.
