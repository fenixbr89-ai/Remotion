import { continueRender, delayRender, staticFile } from "remotion";

export const fontFamily = "Poppins";

// Load the bundled Poppins weights before rendering any frame
if (typeof window !== "undefined" && "FontFace" in window) {
  const handle = delayRender("Loading Poppins");
  Promise.all(
    [300, 400, 600, 700, 800].map((w) =>
      new FontFace(fontFamily, `url(${staticFile(`fonts/Poppins-${w}.ttf`)})`, { weight: String(w) })
        .load()
        .then((ff) => document.fonts.add(ff)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}

export const C = {
  navy: "#04204C",
  blue: "#0580F8",
  blueL: "#4DB0FF",
  sky: "#BFE1FF",
  light: "#EEF2F7",
  muted: "#3B4E70",
};

export const FPS = 30;
export const F = (sec: number) => Math.round(sec * FPS);

// Scene boundaries (seconds), aligned to pauses in the narration
export const B = [0, 3.45, 9.3, 15.6, 22.9, 29.55, 34.55, 40.9, 50];
export const TOTAL_SEC = 50;

export const bgBlue =
  "radial-gradient(120% 70% at 50% 45%,#0A8CFF 0%,#0566E0 38%,#0450B8 75%,#043E95 100%)";
export const bgLight =
  "radial-gradient(90% 60% at 50% 45%,#FFFFFF 0%,#EEF2F7 60%,#DFE6EF 100%)";
