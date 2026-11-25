import "@fontsource-variable/inter";
import "@fontsource-variable/inter/wght-italic.css";
import "@fontsource-variable/archivo/wdth.css";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// Paleta oficial RYVO
export const P = {
  black: "#080812", // Preto profundo · base principal
  violet: "#7547E8", // Violeta elétrico · cor de identidade
  lavender: "#A78BFA", // Lavanda luminosa · luzes e gradientes
  blue: "#087BFF", // Azul elétrico · detalhes tecnológicos
  ice: "#F5F3FF", // Branco gelo · textos e contraste
};

export const C = {
  bg: P.black,
  text: P.ice,
  textSoft: "rgba(245,243,255,0.72)",
  accent: P.lavender,
  violet: P.violet,
  blue: P.blue,
};

export const FONT = "'Inter Variable', Inter, sans-serif";
export const LOGO_FONT = "'Archivo Variable', Archivo, sans-serif";

export const headlineGradient = `linear-gradient(90deg, ${P.ice} 0%, ${P.lavender} 45%, ${P.violet} 100%)`;
export const logoGradient = `linear-gradient(90deg, ${P.ice} 0%, ${P.lavender} 100%)`;

// Scene durations in seconds. Total ~33s (target 30–40s); narration ~21s at ~3.4 words/s.
export const SCENES = [
  { id: "reveal", dur: 5.8 },
  { id: "motion", dur: 6.8 },
  { id: "grafico", dur: 6.6 },
  { id: "impressao", dur: 7.2 },
  { id: "final", dur: 8.0 },
] as const;

export const OVERLAP = 0.3;

export const sceneFrames = () => {
  let from = 0;
  return SCENES.map((s) => {
    const dur = Math.round(s.dur * FPS);
    const out = { ...s, from, dur };
    from += dur - Math.round(OVERLAP * FPS);
    return out;
  });
};

export const totalFrames = () => {
  const f = sceneFrames();
  const last = f[f.length - 1];
  return last.from + last.dur;
};
