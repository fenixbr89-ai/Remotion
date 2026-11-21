import type { FC, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EI, EIO, EO, LIME, SANS, SERIF, lerp, tw } from "../lib";

type P = { d: number };

const Punch: FC<{ f: number; at: number; out: number; y: number; move: number; dy: number; toScale: number; children: ReactNode }> = ({ f, at, out, y, move, dy, toScale, children }) => {
  const p = tw(f, at, at + 7, 0, 1, EO);
  const m = tw(f, move, move + 18, 0, 1, EIO);
  const e = tw(f, out, out + 10, 0, 1, EI);
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: y, textAlign: "center", whiteSpace: "nowrap",
      opacity: tw(f, at, at + 3) * (1 - e), scale: String(lerp(1.4, 1, p) * lerp(1, toScale, m)),
      translate: `0px ${m * dy - e * 30}px`, filter: `blur(${(1 - p) * 8 + e * 6}px)`,
    }}>
      {children}
    </div>
  );
};

/** Gancho: só a pergunta, que depois desce para o lugar do texto da cena 1 */
export const SHook: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Punch f={f} at={2} out={d - 1} y={760} move={d - 16} dy={700} toScale={0.66}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 120, letterSpacing: "-0.05em", color: "#fff" }}>Treina e não vê</span>
      </Punch>
      <Punch f={f} at={11} out={d + 1} y={880} move={d - 16} dy={655} toScale={0.6}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 150, color: LIME, textShadow: `0 0 ${lerp(60, 24, tw(f, 11, 40))}px rgba(212,255,79,0.45)` }}>resultado?</span>
      </Punch>
    </AbsoluteFill>
  );
};
