import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const oswald = loadOswald("normal", { weights: ["700"], subsets: ["latin"] });
const poppins = loadPoppins("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

export const FONT_TITLE = oswald.fontFamily;
export const FONT_BODY = poppins.fontFamily;

export const COLORS = {
  orange: "#F26A1B",
  black: "#141414",
  white: "#FAFAFA",
  gray: "#9A9A9A",
  whatsapp: "#25D366",
};

export type Theme = "light" | "dark";

export const fg = (theme: Theme) =>
  theme === "dark" ? COLORS.white : COLORS.black;
export const bg = (theme: Theme) =>
  theme === "dark" ? COLORS.black : COLORS.white;
