# Estilo de vídeo – aprendido no projeto Júnior Reis (nov/2026)

Referência aprovada pelo cliente: composição `JuniorReis` (src/JuniorReis). Use como padrão para novos vídeos verticais de anúncio.

## Estrutura
- Vertical 1080x1920, 30fps, ~50–55s, 15 cenas de ~3–4s, sincronizadas com a narração.
- **Gancho**: só a frase, em impacto, sem nada ao fundo (ex.: "Treina e não vê *resultado?*"). A frase desce para o lugar do texto da cena seguinte e é substituída pela resposta. O gancho precisa se ligar visualmente à cena 1 (ex.: anéis vazios que enchem 0%→100%).
- Cada cena abre a próxima a partir de um elemento dela (morph: notificação vira card, card vira celular, ícone vira card, nó do caminho vira card, botão vira logo…).
- Roteiro vem do cliente; transformar em cenas com mockups animados ricos (cards, notificações empilhando, gráficos, mapa com rota, contadores, checks, celular com app). Vídeo "simplório" foi reprovado.

## Texto
- **No máximo 2 linhas** por cena.
- Entrada **"linha suave"**: a linha inteira sobe poucos pixels com fade, a 2ª logo depois. Sem quique, sem giro, sem letra a letra, sem palavra por palavra, sem máscara com impacto (todos reprovados).
- Fonte Inter (extra bold, tracking apertado) + Lora itálico na palavra de destaque (verde em fundo escuro, oliva em fundo claro). Ajuste automático de tamanho para não encostar na borda.

## Movimento
- Câmera com drift lento contínuo. **Sem** zoom de "batida" nos cortes, **sem** flash nos cortes, **sem** giro de câmera.
- **Nada tremido**: sem shake, sem vibração de notificação.
- Efeitos aprovados: brilho varrendo os cards ao chegar, partículas sutis, glow pulsando devagar, contadores subindo, barras enchendo, checks aparecendo.
- **Cursor só no CTA** (Instagram: "Seguir" e "Mensagem"). Em nenhuma outra cena.

## Cores (deste cliente)
- Fundo escuro com brilho oliva + cenas claras (#ECECE6); verde-limão #D4FF4F, oliva #5B6B2E. Alternar escuro/claro com transições em círculo ou "wipe" verde.

## Narração
- Cliente gera a voz em IA (ElevenLabs v3) a partir do roteiro com direção de cada bloco (tom, pausas, pronúncia) — entregar tudo num único bloco copiável.
- Ao receber o .wav: transcrever com timestamps por palavra (faster-whisper) e ajustar a duração de cada cena e os detalhes internos para entrarem na palavra falada.

## Entrega
- Prévia com marca d'água **Kayke.hs** (diagonal cinza ~17% + selo "PRÉVIA · Kayke.hs") → composição `JuniorReis`.
- Final sem marca → composição `JuniorReis-SemMarca`, qualidade máxima:
  `npx remotion render JuniorReis-SemMarca out/final.mp4 --image-format=png --crf=12 --x264-preset=slower --audio-bitrate=320k --pixel-format=yuv420p`
- Sempre perguntar antes de mudar textos/estrutura aprovados.
