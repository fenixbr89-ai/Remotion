import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { montserrat } from "./fonts";

type StickerProps = {
  readonly children: string;
  readonly emoji: string;
  readonly style?: React.CSSProperties;
};

// Selo animado: entra com "pop" e balança levemente enquanto está na tela.
const StickerInner: React.FC<StickerProps> = ({ children, emoji, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "22px 40px",
          borderRadius: 999,
          backgroundColor: "#7A1426",
          border: "6px solid #FFD23F",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          color: "white",
          fontFamily: montserrat,
          fontWeight: 900,
          fontSize: 58,
          textTransform: "uppercase",
          letterSpacing: -0.5,
          whiteSpace: "nowrap",
          scale: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            easing: Easing.spring({ damping: 11, mass: 0.6 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          rotate: `${interpolate(Math.sin(frame / 6), [-1, 1], [-3, 3])}deg`,
        }}
      >
        <span style={{ fontSize: 66 }}>{emoji}</span>
        <span>{children}</span>
      </div>
    </div>
  );
};

export const Sticker = Interactive.create({
  Component: StickerInner,
  layout: "none",
  schema: {
    children: { type: "string", default: "Texto", description: "Texto" },
    emoji: { type: "string", default: "🍕", description: "Emoji" },
  },
});
