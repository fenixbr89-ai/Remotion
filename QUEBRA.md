# Quebra Padrão — vídeos de partículas (Remotion)

1080×1920 · 60 fps · h264 CRF 14 · AAC 320k. Duração = áudio + 1,5 s.

## Fluxo de um vídeo novo
1. Coloque `public/<video>/narracao.wav` e `public/<video>/roteiro.txt` (uma frase por linha).
2. Gere os tempos das palavras:
   `node scripts/align.mjs public/<video>/narracao.wav public/<video>/roteiro.txt`
   (com transcrição whisper: acrescente `--whisper caps.json`). Saída: `words.json` e `meta.json`.
3. Crie `src/quebra/<video>/scenes.ts` (veja `src/quebra/demo/scenes.ts`): cada cena tem
   `cue` (palavra falada em que entra), `offset`, `shape` (forma-alvo das partículas), `theme`, `overlays`, `pan`.
4. Registre a composição em `src/Root.tsx` (envolva em um componente: as formas têm funções e não passam por props).
5. Stills para aprovação: `npx remotion still <id> out/stills/x.png --frame=<n>`.
6. Render: `npx remotion render <id> out/<video>.mp4`.

## Peças
- `src/quebra/ParticleField.tsx` — ~12 mil partículas em canvas, morph 0,6 s com atraso aleatório até 0,25 s, redemoinho e tremor; bloom por blur somado.
- `src/quebra/shapes.ts` — formas a partir de texto, SVG path, círculos, retângulos ou desenho livre em canvas.
- `src/quebra/Overlays.tsx` — rótulos mono maiúsculos, setas, arcos, linhas, anéis, colchetes, velocímetro.
- `src/quebra/Legendas.tsx` — legenda Pixora (Inter Display SemiBold 56 px, top 1540, palavra por palavra).
- `src/quebra/timing.ts` — resolve cue words → frames.

Regras: fundo preto + brilho radial; branco + 1 cor de tema + vermelho só para mito/falso; nada de girar/inclinar
(só zoom 1→1,03 e pan); nenhuma cena parada > ~4 s; fatos conferidos; final com pergunta.
