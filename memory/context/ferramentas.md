# Ferramentas e truques do ambiente

| Tarefa | Como |
|--------|------|
| Renderizar | `npx remotion render OfertasMariana out/ofertas-mariana.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --crf=18` (o download do Chrome do Remotion é bloqueado) |
| Tirar fundo de imagens | `rembg` com modelo `birefnet-general-lite` (o `birefnet-general` estoura a memória); logo da Mariana foi recortada manualmente por cor |
| Transcrever narração | `vosk` + modelo `vosk-model-small-pt-0.3` (alphacephei.com); HuggingFace/OpenAI Whisper bloqueados |
| Música | Higgsfield `elevenlabs_music_v2_5` (~8,7 créditos/60s) quando houver créditos; senão sintetizar com numpy |
| Instagram | Download direto é bloqueado; pedir o .mp4 ao usuário |
