# Che Guevara — vídeo documental em colagem (1080x1920, 30fps, ~89s)

Estilo: recortes de fotos de arquivo sobre papel, texto serifado itálico surgindo palavra por palavra,
legendas datilografadas com cursor, grão de filme, vinheta, acentos em vermelho e transições
(zoom atravessando, papel rasgado subindo, chicote, flash).

- `CheVideo.tsx` — linha do tempo: `SCENE_SECONDS` (duração de cada cena = frase da narração) e `TRANS` (transições).
  Quando a narração gravada chegar, ajuste `SCENE_SECONDS` às pausas do áudio.
- `Scenes.tsx` — as 19 cenas. `Art.tsx` — fotos, recortes e elementos desenhados. `MapArt.tsx` — mapas (world-atlas + d3-geo).
- `assets.ts` — fotos em `public/che/`, todas de domínio público no Wikimedia Commons (PD-Cuba, PD-AR-Photo).

Render (usa o Chromium local):

    npx remotion bundle --out-dir /tmp/bundle
    node scripts/render.mjs /tmp/bundle out/che.mp4
    scripts/watermark.sh out/che.mp4 out/che-marca.mp4
