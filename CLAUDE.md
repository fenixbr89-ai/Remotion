# Projeto de vídeos da @yasminsr09 (estudante de odontologia)

Vídeos curtos de curiosidades de odontologia, feitos em Remotion. Ela grava a narração.
Perfil: **@yasminsr09**. Fale com ela em português.

## Estilo padrão: "escuro 3D com rosa neon" (aprovado)

Código de referência: `src/Escuro/` (composição `QuandoODenteCai`).
Inspirado num vídeo de referência que ela enviou. Siga o estilo e o ritmo, sem copiar marca, textos ou cenas de terceiros.

### Visual
- Vertical 1080x1920, 30fps.
- Fundo escuro grafite (`#141415`) com vinheta radial e poeirinha branca flutuando.
- Objetos em **3D de verdade** (three.js via `@remotion/three` + `@react-three/drei`), material fosco tipo massinha clara (`#e7e4df`), com luz e sombra no chão.
  - Molar com coroa arredondada, 4 cúspides e 2 raízes cônicas.
  - Arcada em corte: osso claro opaco (`#efe6d6`) com as raízes aparecendo na frente, gengiva rosa (`#e7a5b4`), 3 dentes.
  - Pino de titânio com roscas, pilar, coroa.
  - **Ela quer rosto e gente**, não só dente: busto 3D de cabeça (`public/models/head.glb`, CC BY 3.0, crédito em `public/models/CREDITS.md`), com brilho rosa na região do dente e modo raio-x (cabeça transparente mostrando os dentes dentro da boca). Bonequinho 3D (mannequin) acenando no final.
- Holofote rosa em cone + plataforma redonda com borda neon nas cenas de destaque.
- Cor de destaque: **rosa neon `#ff5fa8`** (ela escolheu rosa em vez do verde da referência).

### Texto e interface
- Topo esquerdo: tema do vídeo em fonte mono espaçada (JetBrains Mono), ex.: "QUANDO O DENTE CAI".
- Abaixo: pílula escura com bolinha rosa e o nome da seção (ex.: "O OSSO", "A VIRADA").
- Topo direito: @yasminsr09 em mono cinza.
- Legenda grande (Inter ExtraBold ~74px) na parte de baixo do meio, numa caixa escura translúcida, **palavra por palavra**: palavra falada em rosa, as próximas em cinza (estilo karaokê), sincronizada com a narração.
- Etiquetas sobre os objetos: rosa neon com contorno brilhante (destaques e números grandes, ex.: "ATÉ 50%", "3 A 6 MESES") ou caixa preta com texto branco (rótulos simples).
- Final: bonequinho no holofote com "SEGUE @YASMINSR09".

### Movimento
- Câmera sempre em movimento suave (aproxima + gira levemente) até o fim da cena.
- Cortes rápidos e suaves entre cenas (fade de ~6 frames), uma cena por frase da narração.
- Objetos animados: dente saindo, osso encolhendo, vizinhos tombando, dente de cima descendo, pino entrando girando, coroa encaixando, brilho pulsando, etiquetas surgindo.
- Nada de tremidas ou "batidas" na tela.

### Fluxo de trabalho
1. Escrever o roteiro/narração em texto corrido.
2. Mandar as **telas estáticas** de cada cena pra ela aprovar antes de animar.
3. Animar e mandar o vídeo. Ela grava a narração; quando mandar o áudio, sincronizar cada palavra da legenda e a duração das cenas com a voz.

### Renderização (ambiente na nuvem)
- 3D precisa de WebGL: usar `chromiumOptions: { gl: "swangle" }` e o Chrome em `/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.
- Fontes locais em `public/fonts/` (o proxy bloqueia Google Fonts no render).
- Animação no Remotion é sempre por frame (`useCurrentFrame` + `interpolate`), nunca CSS `transition`/`@keyframes`.

## Estilos anteriores (guardados, não são o padrão)
- `src/Curiosidades/`: estilo Pixar fofinho pastel (rosa, amarelo claro, branco), 21 cenas, textos em caixas brancas.
