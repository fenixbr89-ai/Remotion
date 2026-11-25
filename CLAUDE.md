# Memória do projeto — leia antes de qualquer vídeo

Este repositório é o estúdio de vídeos motion do Kayke (motion designer). Ele faz vídeos
comerciais para clientes em Remotion. Responda sempre em **português do Brasil**, de forma
curta e direta.

## ESTILO PADRÃO DOS VÍDEOS (obrigatório)

Todo vídeo deve seguir os dois vídeos de referência em `referencias/`:
- `referencias/ref-A.mp4` (36s, produto "wizebot", azul + cinza claro, verde de destaque)
- `referencias/ref-B.mp4` (48s, produto "cervello", azul-marinho + cinza claro, ciano de destaque)
- Folhas de quadros com tempo marcado: `referencias/ref-*-quadros-*.jpg`
- Detalhe das transições: `referencias/transicoes-whip-pan.jpg`

**Não peça os vídeos de referência de novo.** Eles estão aqui. Abra as folhas de quadros
para relembrar o visual.

### O que define o estilo
1. **Câmera sempre em movimento (o principal).** Quase nenhum quadro fica parado (só ~6–10%
   dos quadros sem movimento). A câmera virtual faz:
   - push-in / zoom lento contínuo em cada plano;
   - **whip pan**: movimento rápido para cima, baixo ou lado com **desfoque de movimento
     direcional forte** entre os planos (o plano sai borrado e o próximo entra borrado);
   - **zoom-through**: um objeto (ícone, logo) passa enorme e borrado na frente da câmera e
     recua até o lugar dele;
   - rotação 3D: telas, cards e dashboards entram girando em perspectiva (rotateX/Y) e se
     assentam com leve balanço;
   - **profundidade de campo**: objetos em primeiro plano desfocados e grandes passando pela
     frente, com o assunto nítido no meio (parallax);
   - travelling acompanhando o texto enquanto ele é escrito.
2. **Cortes rápidos.** Um plano novo a cada **~2–2,5s** (A: 14 transições em 36s; B: 17 em 48s).
   Muitos planos curtos em vez de poucas cenas longas.
3. **Tipografia cinética sincronizada com a locução.** O texto na tela É a fala, palavra por
   palavra. Cada palavra entra com desfoque e escala; a palavra-chave fica em negrito com a
   cor de destaque. Texto centralizado, sem serifa, com espaçamento apertado e tamanho médio
   (não gigante). Às vezes as letras entram embaralhadas ou esticadas por desfoque.
4. **Elementos 3D de interface:** ícones em tile 3D brilhantes orbitando, celulares e
   dashboards em perspectiva, notificações empilhando, contadores subindo (239→250),
   ponteiro de velocímetro, barras crescendo, cards com check, busca sendo digitada.
5. **Alternância de fundo** entre a cor da marca (escura/saturada) e um fundo claro, para
   separar problema e solução. Brilhos suaves e vinheta.
6. **Final:** logo + frase + CTA com **cursor clicando** no botão.
7. Duração: **30 a 40 segundos**, vertical **9:16 (1080x1920)**, 30fps.

## Preferências do Kayke (aprendidas)
- Mandar **fotos de cada cena** antes de animar, quando for um projeto novo.
- Entregar o **roteiro limpo para o cliente** separado do roteiro interno (sem notas técnicas).
- **No máximo 2 fontes.** Hoje usamos só a Inter.
- Fazer versões **fundo escuro e fundo claro** quando a marca permitir.
- Usar só o símbolo/logo oficial do cliente, sem recriar logo com fonte.
- Sem marca d'água do Kayke em vídeo de cliente.
- **Não usar linhas/raios de luz saindo do logo** (ele não gostou). Use só brilho suave.
- **Ritmo um pouco mais calmo que as referências:** planos de ~2,3–3,2s, whip de ~10 quadros,
  texto a ~2,9 palavras/s, e **a marca do cliente aparece devagar** (revelação de ~1,7s).
- Legendas: ele **não gostou** da entrada subindo de trás de uma máscara (v4) nem da revelação
  esquerda→direita no lugar (v5). Gostou da **varredura roxa na palavra-chave**. Entrada ideal
  ainda em aberto.
- Locução: o Kayke gera os áudios por cena (cena01.mp3…) numa IA de voz e manda depois.

## Como renderizar aqui
- Navegador: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
- Foto de um quadro: `npx remotion still src/index.ts <Composição> saida.png --frame=N --browser-executable=...`
- Vídeo: `npx remotion render src/index.ts <Composição> saida.mp4 --codec=h264 --crf=18 --browser-executable=...`
- Entregas ficam em `entrega/`.

## Como o estilo está implementado (reaproveite em vídeos novos)
- `src/ryvo/camera.tsx`: `Shot` (câmera com push-in/órbita + whip pan com desfoque
  direcional via filtro SVG, ou zoom-through), `Kinetic` (texto palavra por palavra,
  `*palavra*` = destaque), `Foreground` (objeto desfocado passando na frente), `useKf`.
- `src/ryvo/icons.tsx`: `Tile3D` (ícone em tile 3D brilhante) e ícones SVG.
- `src/ryvo/RyvoComercial.tsx`: lista de planos (`SHOTS`) com duração, câmera, direção da
  transição e fundo alternado. `src/ryvo/shots.tsx`: o conteúdo de cada plano.

## Projeto atual: RYVO (estúdio criativo)
- Código em `src/ryvo/`. Composições: `RyvoEscuro` e `RyvoClaro` (~36s, 15 planos).
- Paleta oficial: Preto profundo #080812 (base) · Violeta elétrico #7547E8 (identidade) ·
  Lavanda luminosa #A78BFA (luzes/gradientes) · Azul elétrico #087BFF (detalhes tecnológicos) ·
  Branco gelo #F5F3FF (textos).
- Marca: só o símbolo R (`public/ryvo-r.png`). Instagram @ryvocreative. WhatsApp (62) 99523-7527.
- Roteiros: `entrega/ROTEIRO-RYVO-cliente.txt` (cliente) e `entrega/ROTEIRO-RYVO-adaptado.md` (interno).

### Status (RYVO)
- Enviado ao cliente para avaliação: `entrega/claro/RYVO-Claro-v3.mp4` (legenda com desfoque).
- Aguardando a resposta do cliente antes de seguir.
- Texto da narração enviado: `entrega/NARRACAO-RYVO.txt`.
- **Correção pendente (fazer quando chegar a narração):** no plano s02 ("não precisa apenas
  aparecer.") a palavra "aparecer." sai cortada na borda da tela; o travelling tem que terminar
  com a palavra inteira visível.
- Quando os áudios chegarem: ajustar cada plano à fala e exportar com som.
