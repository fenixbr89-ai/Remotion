import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Montserrat (fonte variável, pesos 100–900) embutida no projeto em public/fonts
export const montserrat = "Montserrat";

loadFont({
  family: montserrat,
  url: staticFile("fonts/Montserrat-Variable-latin.woff2"),
  weight: "100 900",
  format: "woff2",
});
