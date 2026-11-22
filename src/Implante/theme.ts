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

export const C = {
  green: "#22c55e",
  greenDeep: "#15803d",
  greenSoft: "#bbf7d0",
  ink: "#0b1220",
  dark: "#07120c",
  light: "#f3fbf6",
  white: "#ffffff",
  gum: "#f2899b",
  gumDeep: "#cf5670",
  bone: "#f6e6c4",
  boneDeep: "#dcbf88",
};

export const W = 1080;
export const H = 1920;

/** remove ':' from React ids so they work in url(#id) */
export const cleanId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");
