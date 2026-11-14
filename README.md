# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm install
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

## Comercial — O Juliano Pinturas (9:16, 32s, tipografia cinética)

Composição `JulianoPinturas` (1080×1920, 30 fps, 960 frames), em `src/JulianoPinturas/`.
Estilo: fundo claro, Poppins, frases palavra por palavra, pílulas inclinadas, cursor clicando,
anéis, eco de texto, sublinhado à mão, toggles e laranja da marca como destaque.

| Cena | Tempo | Arquivo |
| --- | --- | --- |
| Abertura (pergunta → "Conheça o Juliano Pinturas") | 0–10,5s | `Abertura.tsx` |
| Logo, 5 serviços e "e muito mais" | 10,5–24s | `Servicos.tsx` |
| Valores, "Entre em contato" e assinatura | 24–32s | `Encerramento.tsx` |

Efeitos reutilizáveis em `fx.tsx`. Trilha/SFX originais: `npm run audio`.
Narração: coloque em `public/audio/narracao.mp3` e defina a prop `narracao`.
Prévia: `npm run dev` · Render: `npm run render`.
