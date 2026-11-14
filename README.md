# Juliano Pinturas — Comercial (45 s)

Comercial em motion graphics feito com Remotion, seguindo o roteiro de 6 cenas e a identidade da logo (branco/cinza-claro, preto e laranja).

| Cena | Tempo | Arquivo |
| --- | --- | --- |
| 01 Abertura — a linha laranja revela a parede | 0–5 s | `src/Comercial/Cena01Abertura.tsx` |
| 02 Pintura — rolo pintando em 3 passadas | 5–12 s | `src/Comercial/Cena02Pintura.tsx` |
| 03 Telhados, calhas e pós-obra | 12–20 s | `src/Comercial/Cena03Telhados.tsx` |
| 04 Hidráulica, elétrica, caixa d’água, manutenção | 20–29 s | `src/Comercial/Cena04Instalacoes.tsx` |
| 05 Um só contato, muitas soluções | 29–37 s | `src/Comercial/Cena05Versatilidade.tsx` |
| 06 Logo, WhatsApp e chamada | 37–45 s | `src/Comercial/Cena06Logo.tsx` |

O texto da locução aparece na tela em cada cena. A trilha e os efeitos sonoros (`public/audio`) são gerados por `scripts/gerar-audio.py`; para usar uma locução gravada, adicione o arquivo em `public/` e um `<Audio>` em `src/Comercial/Comercial.tsx`.

```bash
npm i
npm run dev                                        # pré-visualizar no Remotion Studio
npx remotion render JulianoPinturas out/juliano-pinturas.mp4
```
