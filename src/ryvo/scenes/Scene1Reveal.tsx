import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { B, Bubble, GlassTile, Headline, Support, useProgress } from "../components";

export const Scene1Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress(0, 1.4);
  const rot = interpolate(frame, [0, 140], [-28, 6]);
  return (
    <AbsoluteFill>
      <GlassTile size={150} x={850} y={210} rx={20} ry={-30} rz={18} tint={0.5} blur={6} floatPhase={1} opacity={0.8} />
      <Bubble size={70} x={930} y={760} phase={2} />

      <div
        style={{
          position: "absolute",
          left: 120,
          top: 900,
          width: 1000,
          height: 900,
          opacity: p,
          transform: `translateY(${(1 - p) * 120}px) scale(${0.82 + p * 0.18}) rotate(${rot}deg)`,
          filter: `blur(${(1 - p) * 20}px)`,
          WebkitMaskImage: "radial-gradient(closest-side, #000 72%, transparent 100%)",
          maskImage: "radial-gradient(closest-side, #000 72%, transparent 100%)",
        }}
      >
        <Img
          src={staticFile("glass-spiral-dark.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <div style={{ position: "absolute", left: 90, top: 260 }}>
        <Headline light={"Sua marca"} bold={"merece\nmais."} delay={0.35} lightSize={150} boldSize={190} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 870 }}>
        <Support delay={1.1} width={620}>
          Uma marca não precisa apenas aparecer. Ela precisa ser <B>lembrada.</B>
        </Support>
      </div>
    </AbsoluteFill>
  );
};
