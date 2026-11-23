import { loadFont } from "@remotion/google-fonts/Inter";
import { Easing } from "remotion";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

// Kronic Host brand palette (from logo + Instagram feed)
export const C = {
  purple: "#8468F9",
  purpleDeep: "#5A3BE8",
  lavender: "#C8BBFF",
  lilac: "#EEEAFF",
  dark: "#07060D",
  darkSoft: "#120F22",
  light: "#F5F4FA",
  ink: "#16131F",
  inkSoft: "#6B6880",
  alert: "#FF5C7A",
  ok: "#34D399",
};

export const GRADIENT = `linear-gradient(135deg, ${C.lavender} 0%, ${C.purple} 45%, ${C.purpleDeep} 100%)`;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

// Editable offer data
export const OFFER = {
  price: 29.93,
  site: "kronichostbrasil.com",
  latencyFar: 186, // illustrative
  latencyNear: 12, // illustrative
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;
