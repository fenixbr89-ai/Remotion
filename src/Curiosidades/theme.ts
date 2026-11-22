import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontFamily = "Poppins";

for (const weight of ["500", "600", "700", "800"]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/poppins-latin-${weight}-normal.woff2`),
    weight,
  });
}

/** Pastel palette: pinks, light yellows, whites. */
export const C = {
  ink: "#4a2433",
  inkSoft: "rgba(74,36,51,0.68)",
  accent: "#ec6f9b",
  accentDeep: "#d14d7e",
  accentSoft: "#ffd6e4",
  yellow: "#ffe48a",
  yellowSoft: "#fff4cc",
  cream: "#fffaf0",
  gum: "#f4919f",
  gumDeep: "#d9677e",
  bone: "#fbeccb",
  boneDeep: "#e6cb94",
  sinus: "#e4ecff",
  sinusDeep: "#b7c6ee",
};

export type Bg = "white" | "yellow" | "pink";

export const W = 1080;
export const H = 1920;

/** remove ':' from React ids so they work in url(#id) */
export const cleanId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");
