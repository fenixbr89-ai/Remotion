import type { CSSProperties, FC } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EIO, LIME, START, THEME, tw } from "./lib";

type Trans =
  | { type: "circle"; x: number; y: number; len: number }
  | { type: "fade"; len: number }
  | { type: "lime"; x: number; y: number; len: number };

// Transição de fundo ao ENTRAR em cada cena (índice da cena)
const TRANS: Record<number, Trans> = {
  4: { type: "circle", x: 170, y: 1220, len: 28 }, // ponto inicial do caminho abre a cena clara
  5: { type: "fade", len: 22 },
  6: { type: "fade", len: 22 },
  7: { type: "circle", x: 540, y: 950, len: 26 }, // celular abre a cena escura
  8: { type: "lime", x: 666, y: 1085, len: 30 }, // botão "Presencial" abre a cena clara
  10: { type: "circle", x: 267, y: 597, len: 28 }, // logo vira avatar
};

const Layer: FC<{ theme: "d" | "l"; f: number; style?: CSSProperties }> = ({ theme, f, style }) => {
  const dx = Math.sin(f / 70) * 3;
  const dy = Math.cos(f / 90) * 2;
  const bg =
    theme === "d"
      ? `radial-gradient(ellipse 80% 42% at ${0 + dx}% ${27 + dy}%, rgba(106,128,34,0.95) 0%, rgba(66,82,24,0.62) 34%, rgba(20,24,10,0) 74%),
         radial-gradient(ellipse 60% 32% at ${100 - dx}% ${64 - dy}%, rgba(60,60,60,0.85) 0%, rgba(30,30,30,0) 70%),
         radial-gradient(ellipse 42% 18% at ${58 + dx}% 69%, rgba(40,54,34,0.75) 0%, rgba(0,0,0,0) 70%),
         linear-gradient(160deg, #222a12 0%, #0a0a08 45%, #050505 100%)`
      : `radial-gradient(ellipse 62% 40% at ${0 + dx}% ${28 + dy}%, rgba(214,250,110,0.95) 0%, rgba(225,240,170,0.5) 40%, rgba(236,236,230,0) 75%),
         radial-gradient(ellipse 32% 22% at ${100 - dx}% ${55 - dy}%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%),
         radial-gradient(ellipse 36% 15% at ${58 + dx}% 67%, rgba(196,200,180,0.75) 0%, rgba(236,236,230,0) 70%),
         #ECECE6`;
  return <AbsoluteFill style={{ background: bg, ...style }} />;
};

export const Background: FC = () => {
  const f = useCurrentFrame();
  let i = 0;
  while (i + 1 < START.length && f >= START[i + 1]) i++;
  const t = f - START[i];
  const tr = TRANS[i];
  const cur = THEME[i];
  if (!tr || t >= tr.len || i === 0) return <Layer theme={cur} f={f} />;
  const prev = THEME[i - 1];

  if (tr.type === "fade") {
    return (
      <>
        <Layer theme={prev} f={f} />
        <Layer theme={cur} f={f} style={{ opacity: tw(t, 0, tr.len, 0, 1, EIO) }} />
      </>
    );
  }
  if (tr.type === "circle") {
    const r = tw(t, 0, tr.len, 0, 2300, EIO);
    return (
      <>
        <Layer theme={prev} f={f} />
        <Layer theme={cur} f={f} style={{ clipPath: `circle(${r}px at ${tr.x}px ${tr.y}px)` }} />
      </>
    );
  }
  const r1 = tw(t, 0, tr.len * 0.62, 0, 2300, EIO);
  const r2 = tw(t, tr.len * 0.28, tr.len, 0, 2300, EIO);
  return (
    <>
      <Layer theme={prev} f={f} />
      <AbsoluteFill style={{ background: LIME, clipPath: `circle(${r1}px at ${tr.x}px ${tr.y}px)` }} />
      <Layer theme={cur} f={f} style={{ clipPath: `circle(${r2}px at ${tr.x}px ${tr.y}px)` }} />
    </>
  );
};
