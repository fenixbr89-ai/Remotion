import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const sans = "Inter";
export const mono = "JetBrains Mono";

for (const w of ["500", "700", "800"]) {
  loadFont({ family: sans, url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w });
}
for (const w of ["500", "700"]) {
  loadFont({ family: mono, url: staticFile(`fonts/jetbrains-mono-latin-${w}-normal.woff2`), weight: w });
}

export const K = {
  bg: "#141415",
  pink: "#ff5fa8",
  pinkSoft: "rgba(255,95,168,0.18)",
  clay: "#e7e4df",
  bone: "#efe6d6",
  gum: "#e7a5b4",
  titanium: "#b9bec6",
  gray: "#8b8b90",
};

export const TOPIC = "QUANDO O DENTE CAI";
export const HANDLE = "@yasminsr09";
