import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE, FONT } from "./ui";
import { NARRACAO, START } from "./timeline";

type Word = { text: string; at: number };
type Page = { words: Word[]; from: number; to: number };

const MAX_CHARS = 24;

/** Distribui as palavras na janela da fala (peso pelo tamanho) e quebra em páginas. */
const buildPages = (): Page[] => {
  const pages: Page[] = [];
  for (const line of NARRACAO) {
    const raw = line.text.split(" ");
    const weights = raw.map((w) => w.length + 3 + (/[…?,.]$/.test(w) ? 5 : 0));
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    const words = raw.map((text, i) => {
      const at = line.from + ((line.to - line.from) * acc) / total;
      acc += weights[i];
      return { text, at: Math.round(at) };
    });
    let current: Word[] = [];
    let chars = 0;
    const flush = () => {
      if (current.length) {
        pages.push({ words: current, from: current[0].at, to: line.to });
      }
      current = [];
      chars = 0;
    };
    for (const w of words) {
      if (chars + w.text.length > MAX_CHARS && current.length) flush();
      current.push(w);
      chars += w.text.length + 1;
      if (/[…?.]$/.test(w.text)) flush();
    }
    flush();
  }
  // cada página termina quando a próxima começa (ou no fim da fala)
  for (let i = 0; i < pages.length - 1; i++) {
    pages[i].to = Math.min(pages[i].to, pages[i + 1].from);
  }
  return pages;
};

const PAGES = buildPages();

// Legendas dinâmicas palavra por palavra no terço inferior.
export const Legendas: React.FC = () => {
  const frame = useCurrentFrame();
  const page = PAGES.find((p) => frame >= p.from && frame < p.to + 6);
  if (!page) return null;
  const dark = frame >= START[2] && frame < START[3];
  const out = interpolate(frame, [page.to, page.to + 6], [0, 1], CLAMP);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 1540,
          left: 90,
          right: 90,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 16,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 56,
          letterSpacing: "-0.015em",
          lineHeight: 1.2,
          textAlign: "center",
          opacity: 1 - out,
          filter: `blur(${out * 10}px)`,
        }}
      >
        {page.words.map((w, i) => {
          const p = interpolate(frame, [w.at, w.at + 6], [0, 1], {
            ...CLAMP,
            easing: EASE,
          });
          return (
            <span
              key={`${w.text}-${i}`}
              style={{
                display: "inline-block",
                opacity: p,
                filter: `blur(${(1 - p) * 12}px)`,
                scale: String(1.08 - 0.08 * p),
                color: dark ? C.white : C.ink,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
