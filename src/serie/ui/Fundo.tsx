import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cor } from "../tema";

/** Fundo branco com manchas de azul bem suaves e grade de pontos que desliza devagar. */
export const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 90) * 120;
  const b = Math.cos(f / 110) * 140;
  return (
    <AbsoluteFill style={{ background: cor.branco, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1200, height: 1200, borderRadius: "50%", left: -560 + a, top: -460 + b * 0.5, background: `radial-gradient(circle, ${cor.azulClaro}38 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", right: -680 - a * 0.6, bottom: -560 + b * 0.4, background: `radial-gradient(circle, ${cor.azul}30 0%, transparent 65%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${cor.azulBorda} 2.5px, transparent 2.5px)`,
          backgroundSize: "56px 56px",
          backgroundPosition: `0 ${f * 0.5}px`,
          opacity: 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
