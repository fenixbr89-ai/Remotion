# Memória do projeto — Quebra Padrão ("Te Explicando Coisas em 1 Minuto")

Leia também `QUEBRA.md` (fluxo e peças do motor de partículas em `src/quebra/`).

## Paleta — REGRA FIXA (pedido do dono do canal)
- **Base PRETO E BRANCO**: fundo preto; o objeto principal, linhas e rótulos em branco na maior parte.
- **Mas não é tudo P&B**: use **detalhezinhos coloridos** sempre que a cor ajudar a explicar —
  um rótulo, uma seta, raios, pontinhos, uma onda específica, um anel. Nunca a cena inteira colorida.
- Cores permitidas nos detalhes (tones em `src/quebra/shapes.ts`):
  - **Vermelho** (`"accent"`) = coisa **negativa**: falso, mito, erro, perigo, "menos", "nunca".
  - **Verde** (`"good"`) = coisa **positiva**: certo, verdade, "mais", "sim".
  - **Azul** (`"blue"`) e **amarelo** (`"yellow"`) = detalhes ligados ao assunto (ex.: luz azul, raios do Sol).
- Não usar outras cores (laranja, violeta etc.) nem cor de tema na cena toda. `theme: THEMES.pb`.

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
