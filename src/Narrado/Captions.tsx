import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { K, sans } from "../Escuro/theme";
import { WORDS } from "./words";

type Chunk = { words: typeof WORDS; start: number; end: number };

/** Group words into short caption chunks: break after punctuation, every 4 words, or when a line would get too long. */
const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const punct = /[,.?!:]$/.test(w.w);
    const chars = cur.map((x) => x.w).join(" ").length;
    const next = WORDS[i + 1];
    const tooLong = next ? chars + 1 + next.w.length > 26 : false;
    if (punct || cur.length >= 4 || tooLong || i === WORDS.length - 1) {
      chunks.push({ words: cur, start: cur[0].s, end: cur[cur.length - 1].e });
      cur = [];
    }
  });
  // each chunk stays until the next one starts (no empty gaps)
  chunks.forEach((c, i) => {
    if (chunks[i + 1]) c.end = chunks[i + 1].start;
    else c.end = c.end + 1;
  });
  return chunks;
};

const CHUNKS = buildChunks();

/** Karaoke captions synced to the narration (global timeline). */
export const NarrationCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const chunk = CHUNKS.find((c) => time >= c.start - 0.05 && time < c.end) ?? (time < CHUNKS[0].start ? CHUNKS[0] : null);
  if (!chunk) return null;
  const pop = Math.min(1, (time - chunk.start + 0.05) / 0.12);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1430, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          padding: "0 10px",
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: -1.5,
          lineHeight: 1.12,
          textAlign: "center",
          scale: `${0.94 + 0.06 * Math.max(0, pop)}`,
        }}
      >
        {chunk.words.map((w, i) => {
          const spoken = time >= w.s - 0.03;
          return (
            <React.Fragment key={i}>
              {i > 0 ? " " : null}
              <span style={{ color: spoken ? K.pinkDeep : "rgba(43,35,38,0.32)" }}>{w.w.replace(/,$/, "")}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
