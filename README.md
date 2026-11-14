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

## Comercial — Juliano Pinturas (9:16, 41s, com narração)

Composição `JulianoPinturas` (1080×1920, 30 fps), em `src/JulianoPinturas/`.
A linha do tempo é guiada pela narração: cada cena começa quando a frase correspondente começa.

1. Narração original em `narracao-original/`. `python3 scripts/narration.py` corta as pausas longas,
   acelera a fala em 10% e gera `public/audio/narracao.wav` + `src/JulianoPinturas/timeline.json`.
2. `Comercial.tsx` monta as cenas a partir de `timeline.json`.
3. Trilha/SFX originais: `npm run audio`.

Prévia: `npm run dev` · Render: `npm run render`.
