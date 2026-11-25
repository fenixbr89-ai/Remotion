import "@fontsource-variable/inter";
import "@fontsource-variable/inter/wght-italic.css";
import "@fontsource-variable/archivo/wdth.css";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  bg1: "#F2F5FF",
  bg2: "#E6E6FB",
  indigo: "#6366F1",
  ink: "#3B2A6B",
  body: "#8E4BD0",
  bodySoft: "#9C7BC9",
  blue: "#2F6BFF",
  lilac: "#E3C5FB",
  purple: "#A855F7",
  violet: "#9333EA",
  pink: "#E879F9",
};

export const FONT = "'Inter Variable', Inter, sans-serif";
export const LOGO_FONT = "'Archivo Variable', Archivo, sans-serif";

export const headlineGradient = `linear-gradient(90deg, ${C.lilac} 0%, #CC8BF8 45%, ${C.purple} 80%, ${C.violet} 100%)`;

// Scene durations in seconds (estimated from the narration: ~3.4 words/s + padding).
export const SCENES = [
  { id: "reveal", dur: 4.6 },
  { id: "motion", dur: 5.6 },
  { id: "grafico", dur: 5.4 },
  { id: "impressao", dur: 6.0 },
  { id: "final", dur: 6.4 },
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
