import { loadFont } from "@remotion/google-fonts/Inter";
import { Easing } from "remotion";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Apple-style neutral palette + Kronic purple as the only accent
export const C = {
  white: "#FFFFFF",
  gray: "#F5F5F7",
  black: "#000000",
  ink: "#1D1D1F",
  sub: "#86868B",
  hair: "#D2D2D7",
  purple: "#8468F9",
  purpleDeep: "#5A3BE8",
  lavender: "#B9A8FF",
};

export const ACCENT = `linear-gradient(90deg, ${C.lavender} 0%, ${C.purple} 50%, ${C.purpleDeep} 100%)`;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Slow, confident easing (Apple keynote feel)
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
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
