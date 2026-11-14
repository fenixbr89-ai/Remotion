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

## Comercial — O Juliano Pinturas (9:16, 32s)

Composição `JulianoPinturas` (1080×1920, 30 fps, 960 frames), em `src/JulianoPinturas/`.
Mistura: 40% Apple UI Motion · 30% Apple Product Showcase · 20% Minimalist Motion · 10% Kinetic Typography.

| Cena | Tempo | Arquivo |
| --- | --- | --- |
| Roleta de palavras → tela de bloqueio com notificações → vitrine da logo | 0–8,5s | `Abertura.tsx` |
| Tela de apps → 5 vitrines de serviço → widgets "E muito mais" | 8,5–24,5s | `Servicos.tsx` |
| Valores → cartão de contato (sheet) e frase final | 24,5–32s | `Encerramento.tsx` |

Componentes de interface em `kit.tsx`. Trilha/SFX originais: `npm run audio`.
Narração: coloque em `public/audio/narracao.mp3` e defina a prop `narracao`.
Prévia: `npm run dev` · Render: `npm run render`.
