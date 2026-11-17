# Memória do projeto — Quebra Padrão ("Te Explicando Coisas em 1 Minuto")

Leia também `QUEBRA.md` (fluxo e peças do motor de partículas em `src/quebra/`).

## Paleta — REGRA FIXA (pedido do dono do canal)
- **Os vídeos são PRETO E BRANCO.** Fundo preto, partículas, linhas e rótulos em branco.
- Cor só em **detalhes pequenos**, nunca no objeto principal inteiro nem na cena toda:
  - **Vermelho** (`tone: "accent"`) = coisa **negativa**: falso, mito, erro, perigo, "menos", "nunca".
  - **Verde** (`tone: "good"`) = coisa **positiva**: certo, verdade, "mais", "sim".
- Nada de cor de tema (azul, laranja, violeta etc.), mesmo que o assunto seja uma cor
  (ex.: "céu azul" continua preto e branco). Use `theme: THEMES.pb`.

## Outras regras do canal
- 1080×1920, 60 fps, duração = narração + 1,5 s (sempre > 1 min).
- Narração é do próprio autor (.wav em `public/<video>/`); não gerar voz.
- Tudo feito de partículas que se desmontam/remontam; nenhuma cena parada > ~4 s; cada cena entra na palavra falada.
- Proibido girar/inclinar elementos (só zoom lento, pan, subir/descer; rotação só se for física).
- Legenda estilo Pixora embaixo (Inter Display SemiBold 56 px, top ≈ 1540).
- Fatos conferidos; sem personagens com direitos autorais nem pessoas reais; final com pergunta para comentar.
- Mostrar stills de cada cena para aprovação antes de renderizar o vídeo inteiro.

## Ambiente (sessões na nuvem)
- huggingface bloqueado → transcrição com Vosk (`vosk-model-small-pt-0.3` de alphacephei.com) e
  `node scripts/align.mjs <wav> <roteiro> --whisper caps.json` (alinhamento de sequência com o roteiro).
- Download do Chrome do Remotion bloqueado → `remotion.config.ts` usa o Chromium local.
