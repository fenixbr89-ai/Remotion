import { continueRender, delayRender, staticFile } from "remotion";

export const SANS = "Inter Tight";
export const SERIF = "Instrument Serif";

if (typeof window !== "undefined" && "FontFace" in window) {
  const handle = delayRender("Loading MotionAd fonts");
  const faces = [
    ...[500, 600, 700, 800, 900].map((w) => new FontFace(SANS, `url(${staticFile(`fonts/InterTight-${w}.ttf`)})`, { weight: String(w) })),
    new FontFace(SERIF, `url(${staticFile("fonts/InstrumentSerif-Italic.ttf")})`, { style: "italic", weight: "400" }),
  ];
  Promise.all(faces.map((f) => f.load().then((ff) => document.fonts.add(ff))))
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}

export const K = {
  lime: "#D0F85C",
  black: "#0A0A0A",
  card: "#171717",
  card2: "#202020",
  light: "#F0F2EF",
  grey: "#8C8C8C",
  greyL: "#C9CCC8",
};

export const FPS = 30;
export const F = (s: number) => Math.round(s * FPS);
export const TOTAL = 35;
// scene boundaries (seconds) aligned to pauses in the narration
export const B = [0, 2.62, 7.45, 12.62, 17.55, 27.98, 31.65, TOTAL];
