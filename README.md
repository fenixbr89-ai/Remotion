# Preço Certo — "E se eu abrisse…" EP. 02: Marmitaria

Reel 1080×1920, 30 fps, 38 s (1140 frames). Composition: `EP02Marmitaria`.

## Comandos
```bash
npm install
npm run dev            # Remotion Studio para revisar
npx remotion render EP02Marmitaria out/EP02_marmitaria.mp4 --codec=h264
python3 scripts/synth-audio.py   # regenera trilha e efeitos em public/audio
```

## Estrutura
- `src/ep02/constants.ts` — cores, fontes, safe area, tempos de cada cena e números do roteiro (tudo num lugar só)
- `src/ep02/anim.ts` — easing, entrada desfoque→nítido, punch de zoom, random determinístico
- `src/ep02/components/` — `Caption`, `Card`, `SlotNumber`, `Cursor`, `IconBadge`, `CheckRow`, `ProgressBar`, `Marmita`, `SceneShell`, `Background`
- `src/ep02/scenes/` — `Scene1Hook` … `Scene6CTA`
- `src/ep02/EP02Marmitaria.tsx` — sequência das cenas, wipe circular e trilha/efeitos

## Narração
Coloque o arquivo em `public/audio/narracao.mp3`, mude `HAS_NARRATION` para `true` em
`src/ep02/EP02Marmitaria.tsx` e ajuste `NARRATION_WINDOWS` (segundos) para o ducking da trilha.
Os tempos das legendas ficam em `T` em `constants.ts`.

Créditos e licenças: `CREDITS.md`. Legenda do post: `LEGENDA_POST.md`.
