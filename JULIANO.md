# Juliano Pinturas — comercial vertical 9:16 (estilo iPhone)

Composição `JulianoPinturas` · 1080×1920 · 30 fps · 35,5 s (1065 frames), com a narração gravada.

```bash
npx remotion render JulianoPinturas out/juliano.mp4 --pixel-format=yuv420p --crf=18
```

## Roteiro de narração

```
Parede descascando? Infiltração? Chuveiro que não esquenta?
Para de procurar um profissional pra cada coisa.
O Juliano resolve tudo.
Pintura de casa e de carro. Elétrica, hidráulica e caixa d'água. Telhado, reforma e pós-obra.
Um só profissional, do pequeno reparo ao acabamento final.
Feito com capricho, do jeito que a sua casa merece.
Chama no WhatsApp e pede seu orçamento agora: (62) 99113-2531.
Juliano Pinturas. Seu espaço, renovado.
```

Os tempos de cada fala estão no comentário de `M` em `src/juliano/JulianoVideo.tsx`.
Quando a narração chegar: `public/juliano/narracao.wav`, ajustar `M` às pausas da gravação e
renderizar com `--props='{"narracao":true}'`.

## Arquivos

- `src/juliano/JulianoVideo.tsx` — linha contínua (tempos em `M`), cada momento nasce de um elemento
  do anterior: ícones → logo → notificações caindo da logo → casa e carro se soltam da lista →
  o ponto de "carro." vira o preto → "Confiança." fica enquanto clareia → WhatsApp pousa na barra final.
  Textos entram/saem palavra por palavra (`Kinetic`) e ficam parados na tela.
- `IconAnim` (em `kit.tsx`) — animação de entrada de cada ícone 3D (carro roda, lâmpada acende,
  bomba solta gotas, gota amassa, casa/tijolos quicam, vassoura varre, WhatsApp com bolinha "1").
- `src/juliano/kit.tsx` — barra de notificação de vidro (`Barra`), fundo aurora, logo.
- `public/juliano/3d/` — logo, carro, lâmpada, bomba, gota, casa, tijolos, vassoura e WhatsApp
  enviados pelo cliente (fundos recortados). `public/juliano/emoji/` — pincel (Fluent Emoji 3D, MIT).

## Versão "Impacto" (estilo tipografia gigante)

Composição `JulianoImpacto` (28,8 s) em `src/juliano-impacto/`: laranja/preto/off-white, títulos
gigantes, estrelas laranja desfocadas, 3 serviços principais em quadrados de vidro e os demais em
etiquetas simples. Tempos estimados até a narração nova chegar (`public/juliano/narracao-impacto.wav`,
renderizar com `--props='{"narracao":true}'`).

```
Sua casa tá precisando de um cuidado?
Parede manchada, infiltração, aquele reparo que você vive adiando…
A Juliano Pinturas resolve pra você.
Pintura residencial. Pintura automotiva. Elétrica.
E ainda: reformas, pós-obra e muito mais.
Tudo com capricho, do início ao acabamento.
Chama no WhatsApp e pede seu orçamento: (62) 99113-2531.
Juliano Pinturas. Seu espaço, renovado.
```
