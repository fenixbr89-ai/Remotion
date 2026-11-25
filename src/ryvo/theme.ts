import "@fontsource-variable/inter";
import "@fontsource-variable/inter/wght-italic.css";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// Tipografia: uma família só (Inter). A marca aparece apenas pelo símbolo R.

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

// ---------- Temas (mesma paleta oficial, fundo escuro ou claro) ----------
export type ThemeName = "escuro" | "claro";

export type Theme = {
  name: ThemeName;
  bg: string;
  text: string;
  textSoft: string;
  accentText: string;
  headlineGradient: string;
  logoGradient: string;
  orbs: { color: string; o: number }[];
  grid: string;
  vignette: string;
  surface: string;
  surfaceLine: string;
  watermark: string;
  spiral: string;
  ring: string;
  glass: (tint?: number, radius?: number) => import("react").CSSProperties;
  brandBarBg: string;
};

const darkGlass = (tint = 0, radius = 48) => ({
  borderRadius: radius,
  background: `linear-gradient(145deg, rgba(245,243,255,${0.14 + tint * 0.04}) 0%, rgba(167,139,250,${
    0.08 + tint * 0.1
  }) 50%, rgba(117,71,232,${0.1 + tint * 0.2}) 100%)`,
  border: "1.5px solid rgba(245,243,255,0.22)",
  boxShadow: `inset 0 1.5px 0 rgba(245,243,255,0.45), inset 0 -20px 40px rgba(117,71,232,${
    0.15 + tint * 0.2
  }), 0 40px 90px rgba(0,0,0,0.55), 0 0 60px rgba(117,71,232,${0.12 + tint * 0.15})`,
  backdropFilter: "blur(22px) saturate(140%)",
  WebkitBackdropFilter: "blur(22px) saturate(140%)",
});

const lightGlass = (tint = 0, radius = 48) => ({
  borderRadius: radius,
  background: `linear-gradient(145deg, rgba(255,255,255,${0.72 - tint * 0.2}) 0%, rgba(167,139,250,${
    0.14 + tint * 0.14
  }) 55%, rgba(117,71,232,${0.1 + tint * 0.18}) 100%)`,
  border: "2px solid rgba(255,255,255,0.85)",
  boxShadow: `inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -18px 40px rgba(117,71,232,${
    0.1 + tint * 0.12
  }), 0 36px 80px rgba(117,71,232,0.2), 0 8px 24px rgba(8,8,18,0.08)`,
  backdropFilter: "blur(22px) saturate(140%)",
  WebkitBackdropFilter: "blur(22px) saturate(140%)",
});

export const THEMES: Record<ThemeName, Theme> = {
  escuro: {
    name: "escuro",
    bg: P.black,
    text: P.ice,
    textSoft: "rgba(245,243,255,0.72)",
    accentText: P.lavender,
    headlineGradient: `linear-gradient(90deg, ${P.ice} 0%, ${P.lavender} 45%, ${P.violet} 100%)`,
    logoGradient: `linear-gradient(90deg, ${P.ice} 0%, ${P.lavender} 100%)`,
    orbs: [
      { color: P.violet, o: 0.55 },
      { color: P.blue, o: 0.3 },
      { color: P.lavender, o: 0.22 },
      { color: P.violet, o: 0.3 },
    ],
    grid: "rgba(8,123,255,0.22)",
    vignette: "radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(8,8,18,0.85) 100%)",
    surface: "rgba(245,243,255,0.07)",
    surfaceLine: "rgba(245,243,255,0.12)",
    watermark: P.lavender,
    spiral: "glass-spiral-dark.png",
    ring: "glass-ring-dark.png",
    glass: darkGlass,
    brandBarBg:
      "linear-gradient(90deg, rgba(245,243,255,0.16) 0%, rgba(245,243,255,0.06) 35%, rgba(117,71,232,0.22) 75%, rgba(117,71,232,0.35) 100%)",
  },
  claro: {
    name: "claro",
    bg: P.ice,
    text: P.black,
    textSoft: "rgba(8,8,18,0.68)",
    accentText: P.violet,
    headlineGradient: `linear-gradient(90deg, ${P.lavender} 0%, ${P.violet} 65%, ${P.blue} 130%)`,
    logoGradient: `linear-gradient(90deg, ${P.violet} 0%, ${P.lavender} 100%)`,
    orbs: [
      { color: P.lavender, o: 0.5 },
      { color: P.blue, o: 0.16 },
      { color: P.lavender, o: 0.35 },
      { color: P.violet, o: 0.14 },
    ],
    grid: "rgba(117,71,232,0.12)",
    vignette: "radial-gradient(120% 80% at 50% 45%, transparent 60%, rgba(167,139,250,0.18) 100%)",
    surface: "rgba(255,255,255,0.6)",
    surfaceLine: "rgba(117,71,232,0.12)",
    watermark: P.violet,
    spiral: "glass-spiral-light.png",
    ring: "glass-ring-light.png",
    glass: lightGlass,
    brandBarBg:
      "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.5) 35%, rgba(167,139,250,0.3) 75%, rgba(117,71,232,0.3) 100%)",
  },
};
