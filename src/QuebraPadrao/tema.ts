import { continueRender, delayRender, staticFile } from "remotion";

// Fontes guardadas em public/fonts (baixadas do Google Fonts, licença OFL).
const arquivos: { familia: string; peso: string; arquivo: string }[] = [
  { familia: "QP Anton", peso: "400", arquivo: "anton-400.woff2" },
  { familia: "QP Inter", peso: "300", arquivo: "inter-300.woff2" },
  { familia: "QP Inter", peso: "400", arquivo: "inter-400.woff2" },
  { familia: "QP Inter", peso: "600", arquivo: "inter-600.woff2" },
  { familia: "QP Inter", peso: "800", arquivo: "inter-800.woff2" },
  { familia: "QP Mono", peso: "400", arquivo: "jetbrains-400.woff2" },
  { familia: "QP Mono", peso: "700", arquivo: "jetbrains-700.woff2" },
  { familia: "QP Oswald", peso: "500", arquivo: "oswald-500.woff2" },
  { familia: "QP Oswald", peso: "700", arquivo: "oswald-700.woff2" },
  { familia: "QP Playfair", peso: "700", arquivo: "playfair-700.woff2" },
  { familia: "QP Playfair", peso: "900", arquivo: "playfair-900.woff2" },
  { familia: "QP Maquina", peso: "400", arquivo: "specialelite-400.woff2" },
];

if (typeof document !== "undefined") {
  const handle = delayRender("Carregando fontes do Quebra Padrão");
  Promise.all(
    arquivos.map(async ({ familia, peso, arquivo }) => {
      const face = new FontFace(familia, `url(${staticFile(`fonts/${arquivo}`)}) format("woff2")`, {
        weight: peso,
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const fontes = {
  anton: "QP Anton",
  inter: "QP Inter",
  mono: "QP Mono",
  oswald: "QP Oswald",
  playfair: "QP Playfair",
  maquina: "QP Maquina",
};

export const cores = {
  fundo: "#0A0A0A",
  branco: "#F2F0EB",
  cinza: "#8A8780",
  linha: "rgba(242, 240, 235, 0.14)",
  destaque: "#FF4D1F",
  papel: "#E9E2D0",
  tinta: "#1A1714",
};
