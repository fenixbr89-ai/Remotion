import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cor } from "../tema";

/** Fundo escuro com brilhos que se movem devagar (azul da marca + cor do negócio). */
export const Fundo: React.FC<{ destaque: string }> = ({ destaque }) => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 90) * 120;
  const b = Math.cos(f / 110) * 140;
  return (
    <AbsoluteFill style={{ background: cor.escuro, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", left: -500 + a, top: -420 + b * 0.5, background: `radial-gradient(circle, ${cor.azul}55 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", width: 1400, height: 1400, borderRadius: "50%", right: -620 - a * 0.6, bottom: -520 + b * 0.4, background: `radial-gradient(circle, ${destaque}55 0%, transparent 65%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${f * 0.6}px`,
        }}
      />
    </AbsoluteFill>
  );
};
