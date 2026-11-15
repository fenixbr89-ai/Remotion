import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Ring } from "./Ring";
import { COLORS } from "../theme";

/** Logo dentro de um círculo; o selo ocupa ~94% da imagem original */
export const LogoCircle: React.FC<{ size: number }> = ({ size }) => {
  const img = size / 0.9;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        background: "#fff",
        boxShadow: "0 30px 80px rgba(20,20,20,0.22)",
      }}
    >
      <Img
        src={staticFile("logo.png")}
        style={{
          position: "absolute",
          width: img,
          height: img,
          left: (size - img) / 2,
          top: (size - img) / 2 - size * 0.003,
        }}
      />
    </div>
  );
};

/** Logo escala 0.6→1 com spring e 2 anéis girando em sentidos opostos */
export const LogoReveal: React.FC<{ size?: number; delay?: number }> = ({
  size = 720,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 11 } });
  const ringIn = spring({ frame: frame - delay - 6, fps, config: { damping: 18 } });
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", inset: 0, scale: `${0.8 + 0.2 * ringIn}`, opacity: ringIn }}>
        <Ring size={size + 90} color={COLORS.orange} speed={1.2} dash="700 60 120 60" strokeWidth={6} />
        <Ring size={size + 170} color={COLORS.black} speed={-0.9} dash="420 80 60 80" strokeWidth={4} />
      </div>
      <div
        style={{
          scale: `${0.6 + 0.4 * s}`,
          opacity: Math.min(1, s * 2),
          filter: `blur(${Math.max(0, 12 * (1 - s))}px)`,
        }}
      >
        <LogoCircle size={size} />
      </div>
    </div>
  );
};
