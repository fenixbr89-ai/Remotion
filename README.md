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

## Vídeo do escritório (Woner Protásio & Cândido)

Composição vertical `Escritorio` (1080×1920, 30 fps, 30 s) em `src/Escritorio/`,
com o conteúdo do site do repositório `Advogado`: abertura, áreas de atuação,
o escritório, equipe e contato. Imagens em `public/site/`, fontes em `public/fonts/`.

- Pré-visualizar: `npm run dev`
- Renderizar MP4: `npx remotion render Escritorio out/escritorio.mp4`
- Gerar o script do site: `npm run build:site` e copiar `dist-site/escritorio-player.js`
  e `dist-site/img/` para a pasta `video/` do repositório `Advogado`.
