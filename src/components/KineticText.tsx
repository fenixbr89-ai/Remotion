import React from "react";
import {
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, enter } from "./anim";
import { COLORS, FONT_BODY, FONT_TITLE, fg, Theme } from "../theme";
import type { Word } from "../types";
import { HandUnderline } from "./HandUnderline";

const STAGGER = 3;

/** Bordas recortadas para o efeito "rasgando" */
const TEAR_TOP =
  "polygon(0% 0%, 100% 0%, 100% 52%, 92% 60%, 84% 50%, 76% 58%, 68% 47%, 60% 57%, 52% 49%, 44% 59%, 36% 48%, 28% 56%, 20% 46%, 12% 55%, 4% 47%, 0% 53%)";
const TEAR_BOTTOM =
  "polygon(0% 53%, 4% 47%, 12% 55%, 20% 46%, 28% 56%, 36% 48%, 44% 59%, 52% 49%, 60% 57%, 68% 47%, 76% 58%, 84% 50%, 92% 60%, 100% 52%, 100% 100%, 0% 100%)";

const AccentWord: React.FC<{
  word: Word;
  size: number;
  frame: number;
  color: string;
}> = ({ word, size, frame, color }) => {
  const base: React.CSSProperties = {
    fontFamily: FONT_TITLE,
    fontWeight: 700,
    fontSize: size,
    lineHeight: 1,
    textTransform: "uppercase",
    color,
    letterSpacing: 1,
    whiteSpace: "nowrap",
    position: "relative",
    display: "inline-block",
  };

  if (word.effect === "shake-tear") {
    const amp = interpolate(frame, [12, 18, 40, 50], [0, 7, 7, 2], clamp);
    const shake = `${Math.sin(frame * 2.7) * amp}px ${Math.cos(frame * 3.3) * amp * 0.6}px`;
    const tear = interpolate(frame, [26, 44], [0, 1], clamp);
    return (
      <span style={{ ...base, translate: shake }}>
        <span style={{ clipPath: TEAR_TOP, display: "block", rotate: `${-1.5 * tear}deg` }}>
          {word.t}
        </span>
        <span
          style={{
            position: "absolute",
            inset: 0,
            clipPath: TEAR_BOTTOM,
            translate: `${8 * tear}px ${18 * tear}px`,
            rotate: `${3 * tear}deg`,
            transformOrigin: "100% 50%",
          }}
        >
          {word.t}
        </span>
      </span>
    );
  }

  if (word.effect === "desaturate") {
    const p = interpolate(frame, [22, 55], [0, 1], clamp);
    return (
      <span
        style={{
          ...base,
          color: interpolateColors(p, [0, 1], [color, COLORS.gray]),
          filter: `saturate(${1 - p})`,
          opacity: 1 - 0.45 * p,
        }}
      >
        {word.t}
      </span>
    );
  }

  if (word.effect === "dots") {
    const text = word.t.replace(/\.+$/, "");
    const n = Math.max(0, Math.floor((frame - 14) / 7) % 4);
    return (
      <span style={base}>
        {text}
        <span style={{ display: "inline-block", width: size * 0.45, textAlign: "left" }}>
          {".".repeat(n)}
        </span>
      </span>
    );
  }

  if (word.effect === "underline") {
    return (
      <span style={base}>
        {word.t}
        <HandUnderline delay={18} />
      </span>
    );
  }

  return <span style={base}>{word.t}</span>;
};

export const KineticText: React.FC<{
  words: Word[];
  theme: Theme;
  size?: number;
  delay?: number;
}> = ({ words, theme, size = 150, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // agrupa em linhas
  const lines: { word: Word; index: number }[][] = [];
  words.forEach((w, i) => {
    if (i === 0 || w.br) lines.push([]);
    lines[lines.length - 1].push({ word: w, index: i });
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: size * 0.2,
        textAlign: "center",
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            gap: size * 0.22,
            alignItems: "baseline",
            justifyContent: "center",
          }}
        >
          {line.map(({ word, index }) => {
            const d = delay + index * STAGGER;
            const e = enter(frame, fps, d);
            const local = frame - d;
            return (
              <span key={index} style={{ ...e.style, display: "inline-block" }}>
                {word.accent ? (
                  <AccentWord word={word} size={size} frame={local} color={COLORS.orange} />
                ) : (
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 600,
                      fontSize: size * 0.6,
                      lineHeight: 1.1,
                      color: fg(theme),
                      whiteSpace: "nowrap",
                    }}
                  >
                    {word.t}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
