import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT_SANS, FPS } from "./theme";

/**
 * Legenda estilo Pixora (adaptada de src/pixora/Legendas.tsx do branch
 * claude/pixora-vertical-video-*): uma palavra por vez, blur 12→0,
 * escala 1,08→1, opacidade 0→1; blocos de até ~24 caracteres; o bloco some com blur.
 * Aqui as palavras vêm com timestamp real (words.json) em vez de distribuídas.
 */
export type Word = { palavra: string; inicio: number; fim: number; linha: number };

type W = { text: string; at: number };
type Page = { words: W[]; from: number; to: number };

const MAX_CHARS = 24;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

export const buildPages = (words: Word[]): Page[] => {
  const pages: Page[] = [];
  let cur: W[] = [];
  let chars = 0;
  let lastEnd = 0;
  let line = words[0]?.linha ?? 0;
  const flush = () => {
    if (cur.length) pages.push({ words: cur, from: cur[0].at, to: Math.round((lastEnd + 0.35) * FPS) });
    cur = [];
    chars = 0;
  };
  for (const w of words) {
    if (w.linha !== line) {
      flush();
      line = w.linha;
    }
    if (chars + w.palavra.length > MAX_CHARS && cur.length) flush();
    cur.push({ text: w.palavra, at: Math.round(w.inicio * FPS) });
    chars += w.palavra.length + 1;
    lastEnd = w.fim;
    if (/[…?!.]$/.test(w.palavra)) flush();
  }
  flush();
  for (let i = 0; i < pages.length - 1; i++) {
    pages[i].to = Math.min(pages[i].to, pages[i + 1].from);
  }
  return pages;
};

export const Legendas: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const pages = useMemo(() => buildPages(words), [words]);
  const page = pages.find((p) => frame >= p.from && frame < p.to + 6);
  if (!page) return null;
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
          fontFamily: FONT_SANS,
          fontWeight: 600,
          fontSize: 56,
          letterSpacing: "-0.015em",
          lineHeight: 1.2,
          textAlign: "center",
          color: "#FFFFFF",
          opacity: 1 - out,
          filter: `blur(${out * 10}px)`,
        }}
      >
        {page.words.map((w, i) => {
          const p = interpolate(frame, [w.at, w.at + 0.2 * FPS], [0, 1], { ...CLAMP, easing: EASE });
          return (
            <span
              key={`${w.text}-${i}`}
              style={{
                display: "inline-block",
                opacity: p,
                filter: `blur(${(1 - p) * 12}px)`,
                scale: String(1.08 - 0.08 * p),
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
