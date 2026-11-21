import type { FC, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Check, Heart } from "../icons";
import { EI, EIO, EO, LIME, M, OLIVE, SANS, SERIF, SHADOW_DARK, circ, lerp, lerpRect, tw } from "../lib";
import { Box } from "../ui";

type P = { d: number };
const CUT = 9;
const CARD = { x: 100, y: 240, w: 880, h: 1260, r: 64 };

// mini-visuais do teaser (cada um preenche o card)
const Photo: FC = () => <Img src={staticFile("junior-foto.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />;
const Barbell: FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#ECECE6" }}>
    <div style={{ position: "absolute", left: 80, right: 80, top: 620, height: 24, borderRadius: 12, background: "#1b1b1b" }} />
    {[-1, 1].map((s) => [{ dx: 270, w: 56, h: 320, c: "#121212" }, { dx: 336, w: 44, h: 230, c: OLIVE }].map((p) => (
      <div key={`${s}${p.dx}`} style={{ position: "absolute", left: 440 + s * p.dx - p.w / 2, top: 632 - p.h / 2, width: p.w, height: p.h, borderRadius: p.w / 2.6, background: p.c }} />
    )))}
  </div>
);
const Route: FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#121611", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 70px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 70px)" }}>
    <svg width={880} height={1260} style={{ position: "absolute", inset: 0 }}>
      <path d="M120 1000 C 300 1060, 260 640, 460 660 S 620 260, 760 300" fill="none" stroke={LIME} strokeWidth={14} strokeLinecap="round" />
      <circle cx={760} cy={300} r={26} fill={LIME} stroke="#0b0b0b" strokeWidth={6} />
    </svg>
  </div>
);
const Chart: FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#ECECE6" }}>
    {[260, 330, 300, 420, 500, 470, 610, 760].map((h, i) => (
      <div key={i} style={{ position: "absolute", left: 70 + i * 96, top: 1000 - h, width: 70, height: h, borderRadius: 35, background: i >= 6 ? LIME : "#D3D3CB" }} />
    ))}
  </div>
);
const Pulse: FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#151813", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
    <div style={{ width: 200, height: 200, borderRadius: 56, background: LIME, display: "flex", alignItems: "center", justifyContent: "center", color: "#0b0b0b" }}>
      <div style={{ width: 110, height: 110 }}><Heart /></div>
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, color: "#fff", letterSpacing: "-0.05em" }}>142<span style={{ fontSize: 56, color: "#8f8f8f", letterSpacing: 0 }}> bpm</span></div>
  </div>
);
const Checks: FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#F4F5EE", padding: "220px 70px", display: "flex", flexDirection: "column", gap: 40 }}>
    {["Agachamento", "Supino reto", "Corrida leve"].map((t) => (
      <div key={t} style={{ height: 160, borderRadius: 44, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px", fontFamily: SANS, fontSize: 54, fontWeight: 700, color: "#111", boxShadow: "0 16px 40px rgba(60,70,30,0.1)" }}>
        {t}
        <div style={{ width: 86, height: 86, borderRadius: 43, background: LIME, padding: 20, boxSizing: "border-box" }}><Check /></div>
      </div>
    ))}
  </div>
);
const Medal: FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#1a1f14", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 420, height: 420, borderRadius: 210, background: LIME, boxShadow: "inset 0 0 0 22px rgba(0,0,0,0.12), 0 0 120px rgba(212,255,79,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 150, color: "#0b0b0b", letterSpacing: "-0.05em" }}>10K</div>
  </div>
);
const CUTS: ReactNode[] = [<Photo key="p" />, <Barbell key="b" />, <Route key="r" />, <Chart key="c" />, <Pulse key="h" />, <Checks key="k" />, <Medal key="m" />];

const Punch: FC<{ f: number; at: number; out: number; y: number; children: ReactNode }> = ({ f, at, out, y, children }) => {
  const p = tw(f, at, at + 7, 0, 1, EO);
  const e = tw(f, out, out + 8, 0, 1, EI);
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: y, textAlign: "center", whiteSpace: "nowrap",
      opacity: tw(f, at, at + 3) * (1 - e), scale: String(lerp(1.4, 1, p) + e * 0.12), filter: `blur(${(1 - p) * 8 + e * 8}px)`,
    }}>
      {children}
    </div>
  );
};

export const SHook: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const cut = Math.min(CUTS.length - 1, Math.floor(f / CUT));
  const local = f - cut * CUT;
  const mp = tw(f, d, d + M, 0, 1, EIO);
  const rect = lerpRect(CARD, circ(540, 600, 590), mp);
  return (
    <AbsoluteFill>
      <Box rect={rect} shadow={SHADOW_DARK}
        layers={[{ style: { background: "transparent", boxShadow: `inset 0 0 0 ${lerp(0, 52, mp)}px ${LIME}` }, o: 1 }]}
        style={{ opacity: tw(f, 0, 3) * (1 - tw(f, d + 12, d + 22)), scale: String(lerp(1.12, 1, tw(f, 0, 10, 0, 1, EO))) }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - tw(f, d - 2, d + 10), scale: String(lerp(1.1, 1, tw(local, 0, CUT, 0, 1, EO))) }}>
          {CUTS[cut]}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.62) 45%, rgba(0,0,0,0.62) 70%, rgba(0,0,0,0.3) 100%)", opacity: 1 - tw(f, d - 2, d + 10) }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 52px ${LIME}`, borderRadius: rect.r, opacity: tw(f, d, d + 6) }} />
      </Box>
      <Punch f={f} at={2} out={d - 8} y={760}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 120, letterSpacing: "-0.05em", color: "#fff", textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>Treina e não vê</span>
      </Punch>
      <Punch f={f} at={11} out={d - 6} y={880}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 150, color: LIME, textShadow: "0 0 50px rgba(212,255,79,0.45), 0 10px 40px rgba(0,0,0,0.6)" }}>resultado?</span>
      </Punch>
    </AbsoluteFill>
  );
};
