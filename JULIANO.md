# Juliano Pinturas — comercial vertical 9:16 (estilo iPhone)

Composição `JulianoPinturas` · 1080×1920 · 30 fps · 33 s (990 frames). Sem narração por enquanto.

```bash
npx remotion render JulianoPinturas out/juliano.mp4 --pixel-format=yuv420p --crf=18
```

## Roteiro de narração

```
Precisa pintar, reformar ou consertar alguma coisa?
Chama o Juliano.
Pintura, pintura automotiva, elétrica, hidráulica, caixa d'água, telhado, reformas e pós-obra.
Tudo com um só contato.
Da parede da sua casa à pintura do seu carro.
Com qualidade, capricho e confiança.
Peça seu orçamento pelo WhatsApp.
Juliano Pinturas. Transformando seus espaços.
```

As cenas (A–E) e as falas que cada uma cobre estão em `src/juliano/tema.ts` (`START`).
Quando a narração chegar: `public/juliano/narracao.wav`, ajustar `START` e os tempos de entrada
(ex.: `CHEGA` dos serviços) às pausas da gravação, e renderizar com `--props='{"narracao":true}'`.

## Arquivos

- `src/juliano/JulianoVideo.tsx` — as 5 cenas; textos entram/saem palavra por palavra (`Kinetic`)
  e ficam parados na tela; transições suaves (chicote e dissolve) entre cenas.
- `src/juliano/kit.tsx` — barra de notificação de vidro (`Barra`), fundo aurora, logo.
- `public/juliano/3d/` — logo, carro, lâmpada, bomba, gota, casa, tijolos, vassoura e WhatsApp
  enviados pelo cliente (fundos recortados). `public/juliano/emoji/` — pincel (Fluent Emoji 3D, MIT).
