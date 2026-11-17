import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// ---------------------------------------------------------------------------
// Vídeo
// ---------------------------------------------------------------------------
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_S = 38;
export const DURATION = DURATION_S * FPS; // 1140

/** segundos -> frame absoluto */
export const s = (sec: number) => Math.round(sec * FPS);

// ---------------------------------------------------------------------------
// Cores
// ---------------------------------------------------------------------------
export const C = {
  bg: "#F5F7FB",
  bgBlue: "#E6EFFC",
  grid: "rgba(11,31,77,.05)",
  navy: "#0B1F4D",
  blue: "#1D4ED8",
  sky: "#38BDF8",
  gray: "#8A94A6",
  strike: "#C3CAD6",
  white: "#FFFFFF",
  soft: "#EEF3FC",
  ring: "#DCE8FB",
  gradient: "linear-gradient(90deg, #1D4ED8 0%, #38BDF8 100%)",
  gradientDiag: "linear-gradient(135deg, #1D4ED8 0%, #38BDF8 100%)",
  shadow: "0 30px 80px rgba(11,31,77,.12)",
  shadowSm: "0 14px 36px rgba(11,31,77,.12)",
};

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------
// Arquivos locais (OFL) em public/fonts: não dependem de rede na renderização.
for (const w of ["500", "600", "700", "800"]) {
  loadFont({
    family: "Inter",
    url: staticFile(`fonts/inter-latin-${w}-normal.woff2`),
    weight: w,
    style: "normal",
  });
}
for (const w of ["600", "700"]) {
  loadFont({
    family: "Lora",
    url: staticFile(`fonts/lora-latin-${w}-italic.woff2`),
    weight: w,
    style: "italic",
  });
}
export const FONT = {
  sans: "Inter, sans-serif",
  serif: "Lora, serif",
};

// ---------------------------------------------------------------------------
// Layout (safe area)
// ---------------------------------------------------------------------------
export const SAFE = 100;
export const CAPTION_TOP = 1330;
export const CAPTION_BOTTOM = 1550;
export const CARD_W = 840;
export const CARD_X = (WIDTH - CARD_W) / 2; // 120

// ---------------------------------------------------------------------------
// Tempos das cenas (frames absolutos)
// ---------------------------------------------------------------------------
export const SCENES = {
  s1: { from: 0, to: s(4.5) }, // 0–135   gancho
  s2: { from: s(4.5), to: s(14) }, // 135–420 custo
  s3: { from: s(14), to: s(20.35) }, // 420–610 erro (fica embaixo do wipe)
  s4: { from: s(19.55), to: s(28) }, // 586–840 preço (entra com wipe)
  s5: { from: s(28), to: s(34) }, // 840–1020 sobra
  s6: { from: s(34), to: s(38) }, // 1020–1140 CTA
} as const;

export const TRANSITION = Math.round(0.35 * FPS); // ~10 frames de saída/entrada
export const WIPE = { start: s(19.55), end: s(20.35) }; // 586–610

/** Momentos-chave (segundos absolutos) */
export const T = {
  // Cena 1
  s1Badge: -0.3, // negativo: já visível no 1º quadro (thumbnail)
  s1Marmita: -0.35,
  s1Lid: 1.15,
  s1Food: 1.55,
  s1IconsStart: 1.2,
  s1IconsGap: 0.16,
  s1Caption: 0.6,
  // Cena 2
  s2Card: 4.7,
  s2Caption: 4.9,
  s2RowsStart: 5.35,
  s2RowGap: 0.85,
  s2Divider: 10.5,
  s2Total: 11.0,
  // Cena 3
  s3Number: 14.2,
  s3Caption: 14.5,
  s3Strike: 15.6,
  s3Pois: 16.6,
  // Cena 4
  s4Card: 19.6,
  s4Caption: 20.4,
  s4TypeStart: 20.9,
  s4TypeEnd: 22.6,
  s4CursorIn: 22.6,
  s4Click: 23.1,
  s4Answer: 24.9,
  // Cena 5
  s5Card: 28.2,
  s5Caption: 28.4,
  s5Rows: [28.7, 29.15, 29.6],
  s5BarStart: 30.1,
  s5BarEnd: 31.5,
  s5Total: 31.7,
  // Cena 6
  s6Logo: 34.15,
  s6Caption: 34.4,
  s6Button: 34.6,
  s6CursorIn: 34.9,
  s6Click: 35.6,
};

// ---------------------------------------------------------------------------
// Conteúdo
// ---------------------------------------------------------------------------
export const COSTS = [
  { label: "Arroz", value: "R$ 0,80", img: "3d/cooked_rice.png" },
  { label: "Feijão tropeiro", value: "R$ 2,40", img: "3d/beans.png" },
  { label: "Carne", value: "R$ 4,50", img: "3d/cut_of_meat.png" },
  { label: "Salada", value: "R$ 0,60", img: "3d/green_salad.png" },
  { label: "Embalagem", value: "R$ 1,20", icon: "package" },
  { label: "Gás e energia", value: "R$ 0,50", img: "3d/fire.png" },
] as const;

export const NUMBERS = {
  custo: "R$ 10,00",
  errado: "R$ 13",
  balcao: "R$ 16,00",
  ifood: "R$ 20,00",
  taxa: "R$ 5,00",
  sobra: "R$ 5,00",
};

export const TYPED = "Custo R$ 10, quero 25% de lucro";
export const MINUS = "−";
