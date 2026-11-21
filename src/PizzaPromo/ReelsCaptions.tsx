import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import type React from "react";
import { useMemo } from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { montserrat } from "./fonts";

type ReelsCaptionsProps = {
  readonly captions: Caption[];
  readonly highlightColor: string;
  readonly textColor: string;
  readonly style?: React.CSSProperties;
};

// Remove vírgula e ponto final para o visual de "reels", mantém ? e !
const cleanWord = (text: string) => text.trim().replace(/[.,;:]+$/g, "");

const ReelsCaptionsInner: React.FC<ReelsCaptionsProps> = ({
  captions,
  highlightColor,
  textColor,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: 700,
        breakOnSilenceAfterMilliseconds: 250,
      }),
    [captions],
  );

  const page = pages.find(
    (p) => timeMs >= p.startMs && timeMs < p.startMs + p.durationMs,
  );

  if (!page) {
    return null;
  }

  const sincePageStart = timeMs - page.startMs;

  return (
    <div
      style={{
        position: "absolute",
        textAlign: "center",
        fontFamily: montserrat,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.1,
        textTransform: "uppercase",
        letterSpacing: -1,
        ...style,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0px 22px",
          scale: interpolate(sincePageStart, [0, 160], [0.82, 1], {
            easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          opacity: interpolate(sincePageStart, [0, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {page.tokens.map((token) => {
          const active = timeMs >= token.fromMs && timeMs < token.toMs;
          const spoken = timeMs >= token.fromMs;
          return (
            <span
              key={token.fromMs}
              style={{
                display: "inline-block",
                color: active ? highlightColor : textColor,
                opacity: spoken ? 1 : 0.55,
                WebkitTextStroke: "14px #111",
                paintOrder: "stroke fill",
                textShadow: "0 8px 24px rgba(0,0,0,0.55)",
                scale: active
                  ? interpolate(timeMs - token.fromMs, [0, 120], [1.18, 1.08], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 1,
                rotate: active ? "-2deg" : "0deg",
              }}
            >
              {cleanWord(token.text)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const ReelsCaptions = Interactive.create({
  Component: ReelsCaptionsInner,
  layout: "none",
  schema: {
    ...Interactive.captionsSchema,
    highlightColor: {
      type: "color",
      default: "#FFD23F",
      description: "Cor da palavra falada",
    },
    textColor: {
      type: "color",
      default: "#FFFFFF",
      description: "Cor do texto",
    },
  },
});
