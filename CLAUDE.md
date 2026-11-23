# Projeto de vídeos da @yasminsr09 (estudante de odontologia)

Vídeos curtos de curiosidades de odontologia, feitos em Remotion. Ela grava a narração.
Perfil: **@yasminsr09**. Fale com ela em português.

## Estilo padrão: "3D claro com rosa" (aprovado)

Código de referência: `src/Escuro/` (composição `QuandoODenteCai`).
Inspirado num vídeo de referência que ela enviou. Siga o estilo e o ritmo, sem copiar marca, textos ou cenas de terceiros.

### Visual
- Vertical 1080x1920, 30fps.
- **Cores claras**: fundo off-white (`#faf6f3`) com brilho branco no centro e rosa claro nas bordas, poeirinha rosa clara flutuando. Paleta: rosa claro, branco e off-white (ela pediu para tirar o fundo escuro).
- Objetos em **3D de verdade** (three.js via `@remotion/three` + `@react-three/drei`), material fosco tipo massinha clara (`#f3f0ec`), com luz e sombra rosada suave no chão.
  - Molar com coroa arredondada, 4 cúspides e 2 raízes cônicas.
  - Arcada em corte: osso claro opaco (`#efe6d6`) com as raízes aparecendo na frente, gengiva rosa (`#e7a5b4`), 3 dentes.
  - Pino de titânio com roscas, pilar, coroa.
  - **Ela quer rosto e gente**, não só dente: busto 3D de cabeça (`public/models/head.glb`, CC BY 3.0, crédito em `public/models/CREDITS.md`), com brilho rosa na bochecha feito por uma luz pontual rosa colada ao rosto (não usar esfera flutuante, ela se descola quando a cabeça gira) e modo raio-x (cabeça transparente mostrando os dentes dentro da boca). Ela **não gostou do bonequinho nem do rosto no final**: a cena final fica **sem nenhum objeto 3D**: legenda "Siga o perfil pra não perder nenhum vídeo!" e, no centro, @yasminsr09 + botão "Seguir" que leva um toque (sem dedinho/cursor, ela não gostou) e vira "Seguindo ✓" (`src/Escuro/Follow.tsx`).
- Holofote rosa em cone + plataforma redonda com borda neon nas cenas de destaque.
- Cor de destaque: rosa claro `#f27cb0`; texto rosa legível `#d9488a`; texto escuro `#2b2326`.

### Texto e interface
- **Sem cabeçalho**: ela pediu para retirar o tema no topo esquerdo, a pílula da seção e o @ no topo direito.
- Legenda grande (Inter ExtraBold ~74px) mais para baixo (y≈1430 de 1920), **sem caixa de fundo** (só um brilho branco suave em volta das letras) e **sem vírgula no fim dos trechos**, **palavra por palavra**: palavra falada em rosa, as próximas em cinza claro (estilo karaokê), sincronizada com a narração. Já começa com a primeira palavra acesa no primeiro quadro.
- Etiquetas **nunca em cima dos dentes**: em cenas de uma arcada ficam entre a arcada e a legenda (y≈1170); em cenas de duas arcadas, no alto (y≈215). Conferir no fim da cena (câmera mais perto).
- Dente 3D é **uma peça contínua** (um só perfil de lathe da coroa ao colo, raízes saindo de dentro), sem emenda visível.
- Etiquetas: caixa branca com contorno rosa brilhante e texto rosa (destaques e números grandes, ex.: "ATÉ 50%", "3 A 6 MESES") ou caixa branca com texto escuro (rótulos simples).
- Final: sem objeto 3D; botão "Seguir" → "Seguindo ✓" com onda rosa, sem dedinho; legenda "Siga o perfil pra não perder nenhum vídeo!".

### Movimento
- Câmera sempre em movimento suave (aproxima + gira levemente) até o fim da cena.
- Cortes rápidos e suaves entre cenas (fade de ~6 frames), uma cena por frase da narração.
- Objetos animados: dente saindo, osso encolhendo, vizinhos tombando, dente de cima descendo, pino entrando girando, coroa encaixando, brilho pulsando, etiquetas surgindo.
- Nada de tremidas ou "batidas" na tela.
- **Ela quer animação rica em todas as cenas** ("não quero um vídeo qualquer"): cada ação tem que ser bem visível e durar o suficiente (ex.: o pino entrando no osso girando de verdade, com broca antes; coroa descendo e encaixando; dentes tombando aos poucos), como na versão 2D de `src/Curiosidades/`. Nada de cena quase parada.

### Fluxo de trabalho
1. Escrever o roteiro/narração em texto corrido.
2. Mandar as **telas estáticas** de cada cena pra ela aprovar antes de animar.
3. Animar e mandar o vídeo. Ela grava a narração; quando mandar o áudio, sincronizar cada palavra da legenda e a duração das cenas com a voz.

### Sincronizar com a narração
- Vídeo narrado atual: `src/Narrado/` (composição `ImplanteNarrado`), áudio em `public/audio/narracao-implante.wav`.
- Transcrever com `faster-whisper` (modelo `small`, `word_timestamps=True`, idioma pt), passando o áudio já decodificado pelo ffmpeg como array 16 kHz (o `av` instalado não aceita o arquivo direto). Corrigir erros da transcrição à mão (ex.: "titânia" → "titânio é", "ósseo e integração" → "osseointegração").
- Cada cena começa no início da frase dela (`start`/`end` em segundos); as ações acontecem no tempo das palavras. Legenda global em pedaços de até 4 palavras, palavra acende no tempo exato.

### Renderização (ambiente na nuvem)
- 3D precisa de WebGL: usar `chromiumOptions: { gl: "swangle" }` e o Chrome em `/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.
- Fontes locais em `public/fonts/` (o proxy bloqueia Google Fonts no render).
- Material que muda entre sólido e transparente (ex.: cabeça no raio-x) precisa de materiais separados com `key` diferente; senão alguma aba do render fica com o material antigo e a cena pisca. Depois de renderizar, medir a diferença entre quadros para achar piscadas.
- Animação no Remotion é sempre por frame (`useCurrentFrame` + `interpolate`), nunca CSS `transition`/`@keyframes`.

## Estilos anteriores (guardados, não são o padrão)
- `src/Curiosidades/`: estilo Pixar fofinho pastel (rosa, amarelo claro, branco), 21 cenas, textos em caixas brancas.
