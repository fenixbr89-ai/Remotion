# Créditos — Preço Certo | "E se eu abrisse…" EP. 02: Marmitaria

Todos os assets abaixo têm licença livre para uso comercial. Nenhum contém marca de terceiros.

## Ilustrações 3D — Microsoft Fluent Emoji
- Fonte: https://github.com/microsoft/fluentui-emoji (pasta `assets/<nome>/3D/`)
- Licença: **MIT** — cópia em `public/3d/LICENSE-fluentui-emoji.txt`
- Arquivos em `public/3d/`:

| Arquivo | Emoji original | Onde aparece |
|---|---|---|
| cooked_rice.png | Cooked rice | Cena 2 (Arroz) |
| beans.png | Beans | Cena 1 (feijão tropeiro na marmita), Cena 2 |
| cut_of_meat.png | Cut of meat | Cena 1 (marmita), Cena 2 |
| green_salad.png | Green salad | Cena 2 |
| leafy_green.png | Leafy green | Cena 1 (marmita + badge) |
| tomato.png | Tomato | Cena 1 (marmita) |
| carrot.png | Carrot | Cena 1 (marmita) |
| fire.png | Fire | Cena 1 (badge), Cena 2 (gás e energia) |
| coin.png | Coin | Cena 1 (badge) |
| motor_scooter.png | Motor scooter | Cena 1, 4, 5 (delivery) |
| pot_of_food.png | Pot of food | Cenas 2 e 5 (título do card) |
| shopping_bags.png | Shopping bags | Cena 5 (título do card) |
| money_bag.png | Money bag | Cena 5 ("Sobrou") |
| fork_and_knife_with_plate.png | Fork and knife with plate | Cena 4 (Balcão) |


## Ícones de linha (2D) — Lucide v0.460.0
- Fonte: https://lucide.dev (pacote npm `lucide-static`)
- Licença: **ISC** — cópia em `public/icons/LICENSE-lucide.txt`
- Arquivos em `public/icons/`: utensils, chef-hat, tag, shopping-bag, package, send, check, flame, leaf, coins, bike, soup, wheat, beef, zap
- O logo (etiqueta de preço) é desenhado em SVG a partir do path do ícone `tag` do Lucide, com o degradê da marca.

## Marmita
- Desenhada do zero em SVG (`src/ep02/components/Marmita.tsx`): alumínio, tampa, arroz e farofa do tropeiro são vetores próprios.

## Fontes
- **Inter** (Rasmus Andersson) — SIL Open Font License 1.1 — `public/fonts/LICENSE-Inter-OFL.txt` (via @fontsource/inter)
- **Lora** (Cyreal) — SIL Open Font License 1.1 — `public/fonts/LICENSE-Lora-OFL.txt` (via @fontsource/lora)

## Áudio
- Trilha lo-fi e todos os efeitos (pop, clique, tecla, tique, swoosh, chime, thud, sparkle, subida) foram **sintetizados do zero** por `scripts/synth-audio.py` (numpy, sem samples de terceiros). Uso livre.
- Narração: ainda não fornecida (ver README).
