import React from "react";
import { useCurrentFrame } from "remotion";
import { easeOut, ip } from "../anim";
import { C, CAPTION_BOTTOM, CAPTION_TOP, FONT, FPS, SAFE, WIDTH } from "../constants";

export type Seg = { text: string; accent?: boolean };

const WORD_GAP = 0.09 * FPS; // ~2,7 frames

const Word: React.FC<{
  children: string;
  start: number;
  accent?: boolean;
  style: React.CSSProperties;
}> = ({ children, start, accent, style }) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [start, start + 12], [0, 1], easeOut);
  return (
    <span
      style={{
        display: "inline-block",
        opacity: p,
        filter: p >= 1 ? undefined : `blur(${(1 - p) * 12}px)`,
        translate: `0px ${(1 - p) * 30}px`,
        marginRight: "0.24em",
        ...(accent
          ? {
              fontFamily: FONT.serif,
              fontStyle: "italic",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              backgroundImage: C.gradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              paddingRight: "0.08em",
              paddingBottom: "0.08em",
            }
          : null),
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/**
 * Legenda em 2 linhas: linha 1 pequena e cinza, linha 2 grande em azul-escuro
 * com a palavra-chave em Lora itálica no degradê. Palavras entram uma a uma.
 */
export const Caption: React.FC<{ line1: string; line2: Seg[]; start: number }> = ({
  line1,
  line2,
  start,
}) => {
  const words1 = line1.split(" ");
  const words2: { w: string; accent?: boolean }[] = line2.flatMap((seg) =>
    seg.text
      .split(" ")
      .filter(Boolean)
      .map((w) => ({ w, accent: seg.accent })),
  );

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE,
        width: WIDTH - SAFE * 2,
        top: CAPTION_TOP,
        height: CAPTION_BOTTOM - CAPTION_TOP,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 500, color: C.gray, lineHeight: 1.2 }}>
        {words1.map((w, i) => (
          <Word key={i} start={start + i * WORD_GAP} style={{}}>
            {w}
          </Word>
        ))}
      </div>
      <div
        style={{
          fontSize: 88,
          fontWeight: 800,
          color: C.navy,
          letterSpacing: "-2.5px",
          lineHeight: 1.15,
          marginTop: 8,
          whiteSpace: "nowrap",
        }}
      >
        {words2.map(({ w, accent }, i) => (
          <Word
            key={i}
            start={start + (words1.length + i) * WORD_GAP}
            accent={accent}
            style={i === words2.length - 1 ? { marginRight: 0 } : {}}
          >
            {w}
          </Word>
        ))}
      </div>
    </div>
  );
};
