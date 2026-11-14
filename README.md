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

## Comercial — O Juliano Pinturas (9:16, 60s)

Composição `JulianoPinturas` (1080×1920, 30 fps, 1800 frames), em `src/JulianoPinturas/`:

| Cena | Tempo | Arquivo |
| --- | --- | --- |
| 1 · Abertura | 0–8s | `S1Abertura.tsx` |
| 2 · Serviços | 8–25s | `S2Servicos.tsx` |
| 3 · Mais soluções | 25–44s | `S3MaisSolucoes.tsx` |
| 4 · Diferencial | 44–52s | `S4Diferencial.tsx` |
| 5 · Encerramento | 52–60s | `S5Encerramento.tsx` |

- Cortes no grid da trilha (120 BPM = 15 frames por batida).
- Trilha e efeitos sonoros são originais, gerados por `npm run audio` (`scripts/synth_audio.py`).
- Narração: coloque o arquivo em `public/audio/narracao.mp3` e defina a prop `narracao` como `"audio/narracao.mp3"`; a trilha abaixa automaticamente.
- Prévia: `npm run dev` · Render: `npm run render` (saída em `out/`).
