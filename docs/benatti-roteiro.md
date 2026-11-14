# Roteiro: Benatti Frios e Embalagens (motion de apresentação)

Formato: vertical 1080×1920 (Reels/Stories), 30fps, 48 segundos, com narração (`public/benatti-narracao.wav`, voz gerada no Higgsfield).
Cores: vermelho, branco e dourado. Cada cena entra com mola e sai com uma faixa dourada diagonal que varre a tela.

| # | Tempo | Cena (o que aparece) | Narração sugerida |
|---|-------|----------------------|-------------------|
| 1 | 0–5,4s | Logo "B" gira e entra num círculo dourado com brilho; "Benatti" letra a letra; faixa dourada "FRIOS E EMBALAGENS"; "~ Atacado e Varejo ~" | "Benatti Frios e Embalagens. Atacado e varejo, com qualidade e preço justo." |
| 2 | 5,4–14,3s | "TUDO NUM SÓ LUGAR!" e 7 cartões com ícones (Carnes, Frios, Frango, Mercearia, Limpeza, Artigos de Festa, Embalagens), que acendem um por vez | "Aqui você encontra carnes, frios, frango, mercearia, produtos de limpeza, artigos de festa e embalagens em geral. Tudo num só lugar!" |
| 3 | 14,3–16,6s | "EMBALAGENS EM GERAL": caixa dourada abre e os produtos saltam de dentro; "Pra sua casa e pro seu negócio" | "Embalagens pra sua casa e pro seu negócio." |
| 4 | 16,6–19s | "O MELHOR PARA SUA MESA": selos Qualidade / Variedade / Confiança girando; etiqueta "OFERTAS TODA SEMANA" balançando | "Qualidade, variedade e confiança, com ofertas toda semana." |
| 5 | 19–28s | Relógio desperta e os ponteiros giram até 6:30; "HORÁRIO DE FUNCIONAMENTO"; SEG A SÁB 06:30 ÀS 21:30 e DOMINGO 07:00 ÀS 21:00 | "Nosso horário: de segunda a sábado, das seis e meia da manhã às nove e meia da noite. E aos domingos, das sete da manhã às nove da noite." |
| 6 | 28–36,6s | "VENHA NOS VISITAR!": mapa se inclina, a rota dourada se desenha e o pino cai; cartão com o endereço | "Venha nos visitar! Estamos na Avenida das Paineiras, quadra noventa e seis, lote doze, próximo à feira de quinta, no Setor Pontakayana, em Trindade, Goiás." |
| 7 | 36,6–48s | Logo; "PEÇA PELO WHATSAPP"; botão verde pulsando; (62) 99376-2140; "ENTREGAS RÁPIDAS"; assinatura | "Faça seu pedido pelo WhatsApp: 62 99376-2140. Benatti Frios e Embalagens: entregas rápidas!" |

Para ajustar o tempo de cada cena à narração gravada, edite `BENATTI_SCENES` no topo de `src/Benatti.tsx` (30 frames = 1s).
Os textos (telefone, horários, endereço) ficam no objeto `INFO`, logo abaixo.

A narração é tocada em 4 trechos, cortados nas pausas da voz (constante `NARRACAO` em `src/Benatti.tsx`).
