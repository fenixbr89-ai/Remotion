import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Carrega as fontes de public/fonts/ (usado no Studio e na renderização).
 * No site, as mesmas fontes já vêm do Google Fonts, então isto não é chamado.
 */
export const carregarFontes = () => {
  if (typeof FontFace === "undefined") return;
  const fontes = [
    {
      family: "Cormorant Garamond",
      weight: "500 700",
      file: "CormorantGaramond-latin.woff2",
    },
    { family: "Poppins", weight: "300", file: "Poppins-300-latin.woff2" },
    { family: "Poppins", weight: "400", file: "Poppins-400-latin.woff2" },
    { family: "Poppins", weight: "500", file: "Poppins-500-latin.woff2" },
  ];
  const handle = delayRender("Carregando fontes");
  Promise.all(
    fontes.map((f) =>
      new FontFace(
        f.family,
        `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`,
        {
          weight: f.weight,
        },
      )
        .load()
        .then((ff) => document.fonts.add(ff)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};

// Mesmas cores do site (variáveis CSS em :root).
export const C = {
  bk: "#080808",
  gr: "#151515",
  gd: "#C69A50",
  ch: "#D9C49A",
  wh: "#F5F2EB",
  mut: "#a9a399",
};

export const serif = "'Cormorant Garamond', Georgia, serif";
export const sans = "'Poppins', system-ui, sans-serif";

export const goldText: React.CSSProperties = {
  backgroundImage: `linear-gradient(100deg, #a97d3a, ${C.ch}, #a97d3a)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const tagStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: 28,
  letterSpacing: 10,
  textTransform: "uppercase",
  color: C.gd,
};

/**
 * Resolve uma imagem: no Studio usa public/site/, no site usa `baseUrl`
 * (a pasta onde as imagens foram publicadas ao lado do index.html).
 */
export const img = (baseUrl: string, name: string) =>
  baseUrl
    ? `${baseUrl.replace(/\/?$/, "/")}${name}`
    : staticFile(`site/${name}`);
