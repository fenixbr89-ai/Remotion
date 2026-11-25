import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { cl, kf, MBlur, punch, shakeXY, Slam, Type } from "../Wayfluency/motion";
import { F, FPS, K, SANS, SERIF } from "./theme";

const SAFE = 0.8;

/* ───────── shared building blocks ───────── */
const Bg: React.FC<{ dark?: boolean; children: React.ReactNode; glow?: [number, number] }> = ({ dark, children, glow = [30, 25] }) => {
  const f = useCurrentFrame();
  const gx = glow[0] + Math.sin(f / 40) * 12;
  const gy = glow[1] + Math.cos(f / 55) * 8;
  const line = dark ? "rgba(255,255,255,.045)" : "rgba(0,0,0,.05)";
  return (
    <AbsoluteFill
      style={{
        fontFamily: SANS,
        letterSpacing: "-0.03em",
        color: dark ? "#fff" : K.black,
        overflow: "hidden",
        background: dark ? K.black : K.light,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${line} 2px,transparent 2px),linear-gradient(90deg,${line} 2px,transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `${(f * 0.6) % 90}px ${(f * 0.4) % 90}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${gx}%`,
          top: `${gy}%`,
          width: 900,
          height: 900,
          transform: "translate(-50%,-50%)",
          background: `radial-gradient(closest-side, rgba(208,248,92,${dark ? 0.22 : 0.35}), transparent)`,
          filter: "blur(40px)",
        }}
      />
      <AbsoluteFill style={{ transform: `scale(${SAFE})`, transformOrigin: "540px 930px" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

type CamV = { x?: number; y?: number; s?: number; r?: number };
const Cam: React.FC<{ fn: (fr: number) => CamV; children: React.ReactNode }> = ({ fn, children }) => {
  const f = useCurrentFrame();
  const c = { x: 0, y: 0, s: 1, r: 0, ...fn(f) };
  const p = { x: 0, y: 0, s: 1, ...fn(f - 1) };
  const vx = Math.abs(c.x - p.x);
  const vy = Math.abs(c.y - p.y);
  const vs = Math.abs(c.s - p.s) * 500;
  return (
    <MBlur
      x={Math.min(34, (vx + vs) * 0.35)}
      y={Math.min(34, (vy + vs) * 0.35)}
      style={{ position: "absolute", inset: 0, transform: `translate(${c.x}px,${c.y}px) scale(${c.s}) rotate(${c.r}deg)`, transformOrigin: "540px 960px" }}
    >
      {children}
    </MBlur>
  );
};

const Row: React.FC<{ y: number; children: React.ReactNode; style?: React.CSSProperties; x?: number }> = ({ y, children, style, x = 0 }) => (
  <div style={{ position: "absolute", top: y, left: x, width: 1080, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 20, ...style }}>{children}</div>
);

/** Leaves upward with blur at `at` (for swapping captions). */
const Out: React.FC<{ at?: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  if (at === undefined) return <>{children}</>;
  const p = interpolate(f, [F(at), F(at) + 6], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  if (p >= 1) return null;
  return (
    <MBlur y={p * 30} style={{ position: "absolute", inset: 0, transform: `translateY(${-p * 260}px)`, opacity: 1 - p }}>
      {children}
    </MBlur>
  );
};

const Small: React.FC<{ y: number; text: string; at: number; dur?: number; dark?: boolean }> = ({ y, text, at, dur, dark }) => (
  <Row y={y} style={{ fontSize: 54, fontWeight: 500, color: dark ? "#9A9A9A" : "#8A8A8A" }}>
    <Type text={text} at={at} dur={dur} />
  </Row>
);

const sansBig: React.CSSProperties = { fontWeight: 800, fontSize: 116, lineHeight: 1 };
const serifBig = (c?: string): React.CSSProperties => ({ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 148, lineHeight: 1, letterSpacing: "-0.01em", color: c });

const Flash: React.FC<{ at: number; max?: number; color?: string }> = ({ at, max = 0.5, color = "#fff" }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [F(at), F(at) + 2, F(at) + 8], [0, max, 0], cl);
  return <div style={{ position: "absolute", inset: -400, background: color, opacity: o, pointerEvents: "none" }} />;
};

const float = (f: number, seed: number, a = 7) => ({ ry: Math.sin(f / 28 + seed) * a, rx: Math.cos(f / 33 + seed) * a * 0.6, y: Math.sin(f / 21 + seed * 2) * 10 });

const Phone: React.FC<{ children: React.ReactNode; w?: number; style?: React.CSSProperties }> = ({ children, w = 440, style }) => (
  <div style={{ width: w, height: w * 2.05, borderRadius: w * 0.16, background: "#050505", padding: w * 0.035, boxShadow: "0 40px 90px rgba(0,0,0,.35), inset 0 0 0 3px #2a2a2a", position: "relative", ...style }}>
    <div style={{ position: "absolute", top: w * 0.06, left: "50%", width: w * 0.26, height: w * 0.07, borderRadius: 99, background: "#000", transform: "translateX(-50%)", zIndex: 3 }} />
    <div style={{ width: "100%", height: "100%", borderRadius: w * 0.13, overflow: "hidden", position: "relative", background: "#111" }}>{children}</div>
  </div>
);

const Check: React.FC<{ at: number; size?: number }> = ({ at, size = 64 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - F(at), fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: K.lime, display: "grid", placeItems: "center", transform: `scale(${f < F(at) ? 0 : s})` }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </div>
  );
};

const Store: React.FC<{ size?: number; dark?: boolean }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <rect x="6" y="18" width="48" height="36" fill="#2b2b2b" />
    <rect x="22" y="32" width="16" height="22" fill="#0a0a0a" />
    <path d="M4 8h52v12H4z" fill="#fff" />
    <path d="M4 8h10v12H4zM24 8h10v12H24zM44 8h12v12H44z" fill={K.lime} />
  </svg>
);

/* ═════════ CENA 1 — "Já imaginou ter um vídeo desse pra sua empresa?" ═════════ */
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: FPS, config: { damping: 15, stiffness: 120 } });
  const ry = interpolate(enter, [0, 1], [-40, 0]) + Math.sin(f / 20) * 6;
  const rz = interpolate(enter, [0, 1], [-12, -4]) + Math.sin(f / 26) * 2;
  const playOut = interpolate(f, [F(1.15), F(1.3)], [1, 0], cl);
  const ad = interpolate(f, [F(1.2), F(1.45)], [0, 1], cl);
  const store = interpolate(f, [F(2.05), F(2.25)], [0, 1], cl);
  const burger = spring({ frame: f - F(1.45), fps: FPS, config: { damping: 10 } });
  return (
    <Bg glow={[25, 30]}>
      <Cam fn={(fr) => ({ s: kf(fr, [[0, 1.5], [0.9, 1.05], [2.6, 1.12]]) + punch(fr, 1.59, 0.07) + punch(fr, 2.4, 0.05), y: kf(fr, [[0, 380], [0.9, 40], [2.6, 0]]), r: Math.sin(fr / 30) })}>
        <div style={{ position: "absolute", left: 320, top: 180, perspective: 1600 }}>
          <div style={{ transform: `translateY(${(1 - enter) * 600}px) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
            <Phone>
              {/* play state */}
              <div style={{ position: "absolute", inset: 0, background: "#E8E8E8", display: "grid", placeItems: "center", opacity: playOut }}>
                <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,.15)", transform: `scale(${1 + Math.sin(f / 5) * 0.05})` }}>
                  <div style={{ width: 0, height: 0, borderLeft: "34px solid #111", borderTop: "22px solid transparent", borderBottom: "22px solid transparent", marginLeft: 8 }} />
                </div>
              </div>
              {/* ad: hamburgueria */}
              <div style={{ position: "absolute", inset: 0, padding: "120px 40px", opacity: ad * (1 - store), color: "#fff" }}>
                <div style={{ fontSize: 22, letterSpacing: "0.12em", fontWeight: 700, opacity: 0.7 }}>HAMBURGUERIA</div>
                <div style={{ fontSize: 66, fontWeight: 900, lineHeight: 0.95, marginTop: 10, transform: `translateX(${(1 - ad) * -80}px)` }}>NOVO<br />SABOR</div>
                <div style={{ width: 190, height: 190, borderRadius: "50%", background: K.lime, margin: "50px auto 0", transform: `scale(${f < F(1.45) ? 0 : burger}) rotate(${f * 2}deg)`, boxShadow: "0 0 60px rgba(208,248,92,.5)" }} />
                <div style={{ marginTop: 60, display: "inline-block", background: "#fff", color: "#111", fontWeight: 800, fontSize: 26, padding: "12px 26px", borderRadius: 99 }}>Peça agora</div>
                <div style={{ position: "absolute", left: 40, right: 40, bottom: 70, height: 6, background: "#333", borderRadius: 9 }}>
                  <div style={{ width: `${interpolate(f, [F(1.2), F(2.6)], [0, 100], cl)}%`, height: "100%", background: "#fff", borderRadius: 9 }} />
                </div>
              </div>
              {/* sua empresa */}
              <div style={{ position: "absolute", inset: 0, background: "#0b0b0b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: store, transform: `scale(${interpolate(store, [0, 1], [1.3, 1])})` }}>
                <Store size={200} />
                <div style={{ color: "#fff", fontSize: 34, fontWeight: 800, textAlign: "center", lineHeight: 1.05 }}>SUA<br />EMPRESA</div>
              </div>
            </Phone>
          </div>
        </div>
        <Out at={2.02}>
          <Small y={1260} text="Já imaginou ter" at={0.21} dur={0.75} />
          <Row y={1340}>
            <Slam at={1.15} dir="up" inline style={sansBig}>um vídeo</Slam>
            <Slam at={1.59} dir="zoom" inline style={serifBig()}>desse?</Slam>
          </Row>
        </Out>
        {f >= F(2.02) && (
          <>
            <Small y={1260} text="pra sua" at={2.07} dur={0.3} />
            <Row y={1340}>
              <Slam at={2.4} dir="right" inline style={serifBig()}>empresa…</Slam>
            </Row>
          </>
        )}
      </Cam>
    </Bg>
  );
};

/* ═════════ CENA 2 — "Por apenas 50 reais. Pois é. Aqui a gente faz isso." ═════════ */
export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const hit = 3.95;
  const cnt = (fr: number) => interpolate(fr, [F(2.75), F(hit)], [0, 50], { ...cl, easing: Easing.out(Easing.cubic) });
  const v = cnt(f);
  const speed = Math.abs(cnt(f) - cnt(f - 1));
  const priceOut = kf(f, [[5.55, 0], [5.8, 1]]);
  const poisOut = kf(f, [[6.3, 0], [6.42, 1]]);
  return (
    <Bg dark glow={[50, 35]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[2.62, 1.25], [hit, 1.05], [5.5, 1.12]]) + punch(fr, hit, 0.18) + punch(fr, 4.59, 0.05) + punch(fr, 5.73, 0.1) + punch(fr, 6.78, 0.06) + punch(fr, 7.02, 0.12),
          x: shakeXY(fr, hit, 24, 10).x,
          y: shakeXY(fr, hit, 24, 10).y,
          r: Math.sin(fr / 25) * 1.4,
        })}
      >
        {f < F(5.8) && (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + priceOut * 6})`, opacity: 1 - priceOut, transformOrigin: "540px 720px", filter: priceOut > 0 ? `blur(${priceOut * 20}px)` : undefined }}>
            <Row y={560} style={{ alignItems: "flex-start", fontWeight: 900 }}>
              <span style={{ fontSize: 110, marginTop: 70 }}>R$</span>
              <MBlur y={Math.min(30, speed * 6)} style={{ display: "flex", alignItems: "flex-start", color: K.lime, fontVariantNumeric: "tabular-nums" }}>
                <span style={{ fontSize: 340, lineHeight: 1, letterSpacing: "-0.05em" }}>{Math.round(v)}</span>
                <span style={{ fontSize: 120, marginTop: 40 }}>,00</span>
              </MBlur>
            </Row>
            <Small dark y={950} text="por apenas" at={3.48} dur={0.4} />
            <Row y={1030} style={{ fontSize: 74, fontWeight: 700 }}>
              <Slam at={4.59} dir="up" inline style={{ color: K.lime }}>reais.</Slam>
            </Row>
          </div>
        )}
        {f >= F(5.6) && f < F(6.45) && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - poisOut, transform: `translateY(${-poisOut * 200}px)` }}>
            <Row y={820} style={{ alignItems: "baseline" }}>
              <Slam at={5.73} dir="zoom" inline style={{ ...sansBig, fontSize: 190 }}>Pois</Slam>
              <Slam at={6.03} dir="right" inline style={{ ...serifBig(K.lime), fontSize: 230 }}>é.</Slam>
            </Row>
          </div>
        )}
        {f >= F(6.38) && (
          <>
            <Small dark y={760} text="Aqui a gente" at={6.42} dur={0.32} />
            <Row y={850}>
              <Slam at={6.78} dir="up" inline style={{ ...sansBig, fontSize: 170 }}>faz</Slam>
              <Slam at={7.02} dir="zoom" inline style={{ ...serifBig(K.lime), fontSize: 210 }}>isso.</Slam>
            </Row>
          </>
        )}
      </Cam>
      <Flash at={hit} max={0.35} color={K.lime} />
    </Bg>
  );
};

/* ═════════ CENA 3 — "Criamos o seu vídeo em motion pra propaganda da sua empresa ou dos seus produtos." ═════════ */
const Track3: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    [{ w: 200, c: K.black }, { w: 120, c: "#BDBDBD" }, { w: 220, c: K.black }],
    [{ w: 60, c: "transparent" }, { w: 170, c: K.lime }, { w: 130, c: K.lime }, { w: 170, c: "#BDBDBD" }],
    [{ w: 110, c: "#BDBDBD" }, { w: 250, c: K.black }, { w: 170, c: K.lime }],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 12 }}>
          {r.map((b, j) => {
            const t = 7.7 + i * 0.12 + j * 0.08;
            const p = spring({ frame: f - F(t), fps: FPS, config: { damping: 14 } });
            return <div key={j} style={{ width: b.w, height: 46, borderRadius: 10, background: b.c, transform: `scaleX(${f < F(t) ? 0 : p})`, transformOrigin: "left" }} />;
          })}
        </div>
      ))}
      <div style={{ position: "absolute", top: -14, bottom: -14, left: interpolate(f, [F(8.0), F(12.6)], [20, 540], cl), width: 4, background: K.black }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: K.lime, border: "3px solid #111", marginLeft: -7, marginTop: -10 }} />
      </div>
    </div>
  );
};

export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f - F(7.5), fps: FPS, config: { damping: 14, stiffness: 120 } });
  const fl = float(f, 1, 6);
  const scr = (a: number, b: number) => interpolate(f, [F(a), F(a) + 5, F(b) - 3, F(b)], [0, 1, 1, 0], cl);
  return (
    <Bg glow={[20, 30]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[7.45, 1.35], [8.2, 1.1], [9.7, 1.1], [9.95, 1.3], [11.4, 1.3], [11.65, 1.4], [12.6, 1.45]]) + punch(fr, 9.39, 0.08) + punch(fr, 10.8, 0.06) + punch(fr, 11.91, 0.07),
          y: kf(fr, [[7.45, 200], [8.2, 60], [9.7, 60], [9.95, 330], [11.4, 330], [11.65, 360], [12.6, 380]]),
          r: Math.sin(fr / 28) * 1.2,
        })}
      >
        <div style={{ position: "absolute", left: 160, top: 260, perspective: 1600 }}>
          <div style={{ transform: `translateY(${(1 - enter) * 900}px) rotateX(${fl.rx + (1 - enter) * 40}deg) rotateY(${fl.ry}deg)`, width: 760, padding: 34, borderRadius: 40, background: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,.14)" }}>
            <div style={{ height: 380, borderRadius: 24, background: K.black, position: "relative", overflow: "hidden" }}>
              {/* motion. */}
              <div style={{ position: "absolute", inset: 0, opacity: interpolate(f, [F(9.7), F(9.85)], [1, 0], cl) }}>
                <div style={{ position: "absolute", left: 40, bottom: 40, color: "#fff", fontWeight: 800, fontSize: 40 }}>motion.</div>
                <div style={{ position: "absolute", width: 50, height: 50, borderRadius: 25, background: K.lime, left: 200 + Math.sin(f / 8) * 250, top: 90 + Math.abs(Math.sin(f / 6)) * 140 }} />
                <div style={{ position: "absolute", left: 40, top: 40, width: 220, height: 14, borderRadius: 7, background: "#fff" }} />
              </div>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, opacity: scr(9.85, 11.55), transform: `scale(${interpolate(f, [F(9.85), F(10.1)], [1.4, 1], cl)})` }}>
                <Store size={170} />
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 50, lineHeight: 1.05 }}>Sua<br />empresa</div>
              </div>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, opacity: interpolate(f, [F(11.55), F(11.7)], [0, 1], cl), transform: `scale(${interpolate(f, [F(11.55), F(11.8)], [1.4, 1], cl)})` }}>
                <svg width="120" height="190" viewBox="0 0 40 64">
                  <rect x="13" y="2" width="14" height="8" rx="2" fill="#fff" />
                  <rect x="6" y="10" width="28" height="52" rx="8" fill={K.lime} />
                  <rect x="6" y="26" width="28" height="16" fill="#fff" />
                </svg>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 50, lineHeight: 1.05 }}>Seus<br />produtos</div>
              </div>
            </div>
            <div style={{ marginTop: 26 }}>
              <Track3 />
            </div>
          </div>
        </div>
        <Out at={9.62}>
          <Small y={1240} text="Criamos o seu" at={7.83} dur={0.6} />
          <Row y={1320}>
            <Slam at={8.7} dir="up" inline style={sansBig}>vídeo em</Slam>
            <Slam at={9.39} dir="zoom" inline style={serifBig()}>motion</Slam>
          </Row>
        </Out>
        {f >= F(9.62) && (
          <Out at={11.3}>
            <Small y={1240} text="pra propaganda da" at={9.66} dur={0.8} />
            <Row y={1320}>
              <Slam at={10.62} dir="up" inline style={sansBig}>sua</Slam>
              <Slam at={10.8} dir="right" inline style={serifBig()}>empresa</Slam>
            </Row>
          </Out>
        )}
        {f >= F(11.3) && (
          <>
            <Small y={1240} text="ou dos seus" at={11.34} dur={0.5} />
            <Row y={1320}>
              <Slam at={11.91} dir="zoom" inline style={serifBig()}>produtos.</Slam>
            </Row>
          </>
        )}
      </Cam>
    </Bg>
  );
};

/* ═════════ CENA 4 — "Aquele vídeo que faz a pessoa parar de rolar o feed e prestar atenção no que você vende." ═════════ */
const FeedPost: React.FC<{ i: number }> = ({ i }) => (
  <div style={{ margin: "18px 22px", borderRadius: 22, background: "#262626", padding: 20 }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 34, height: 34, borderRadius: 17, background: i % 2 ? "#666" : K.lime }} />
      <div style={{ width: 120, height: 12, borderRadius: 6, background: "#555" }} />
    </div>
    <div style={{ height: 200, borderRadius: 14, background: i % 3 === 0 ? "#4a4a4a" : i % 3 === 1 ? "#3a3a3a" : "#5a5a5a", marginTop: 16 }} />
  </div>
);

export const S4: React.FC = () => {
  const f = useCurrentFrame();
  // fast feed scroll, then it STOPS on "parar"
  const scroll = kf(f, [[12.7, 0], [14.22, 2600]]);
  const vScroll = Math.abs(scroll - kf(f - 1, [[12.7, 0], [14.22, 2600]]));
  const adS = spring({ frame: f - F(14.22), fps: FPS, config: { damping: 9, stiffness: 160 } });
  const fl = float(f, 3, 5);
  const tap = f >= F(16.89) && f < F(16.89) + 5 ? 0.9 : 1;
  const ripple = interpolate(f, [F(16.89), F(16.89) + 16], [0, 1], cl);
  return (
    <Bg dark glow={[22, 30]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[12.62, 1.15], [14.1, 1.0], [14.3, 1.25], [15.4, 1.2], [16.4, 1.35], [17.55, 1.4]]) + punch(fr, 14.22, 0.12) + punch(fr, 14.67, 0.06) + punch(fr, 16.89, 0.1),
          y: kf(fr, [[12.62, 120], [14.1, 120], [14.3, 260], [16.4, 330], [17.55, 340]]) + shakeXY(fr, 14.22, 20, 9).y,
          x: shakeXY(fr, 14.22, 20, 9).x,
          r: Math.sin(fr / 25) * 1.4,
        })}
      >
        <div style={{ position: "absolute", left: 320, top: 150, perspective: 1600 }}>
          <div style={{ transform: `rotateY(${fl.ry}deg) rotateX(${fl.rx}deg) rotateZ(-3deg)` }}>
            <Phone>
              <MBlur y={Math.min(40, vScroll * 0.6)} style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-scroll % 1560}px)` }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <FeedPost key={i} i={i} />
                ))}
              </MBlur>
              {/* the ad that makes you stop */}
              {f >= F(14.22) && (
                <div style={{ position: "absolute", left: 22, right: 22, top: 180, borderRadius: 26, background: "#0d0d0d", border: "2px solid #2a2a2a", padding: 28, transform: `scale(${interpolate(adS, [0, 1], [0.6, 1]) * (1 + Math.sin(f / 6) * 0.015)})`, color: "#fff", boxShadow: "0 0 80px rgba(208,248,92,.25)" }}>
                  <div style={{ fontSize: 18, letterSpacing: "0.12em", fontWeight: 700, opacity: 0.6 }}>SUA MARCA</div>
                  <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 0.95, marginTop: 8 }}>NOVO<br />PRODUTO</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 60 }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", inset: 0, borderRadius: 99, background: K.lime, opacity: ripple > 0 ? 0.5 * (1 - ripple) : 0, transform: `scale(${1 + ripple * 0.8})` }} />
                      <div style={{ position: "relative", background: f >= F(16.89) ? K.lime : "#fff", color: "#111", fontWeight: 800, fontSize: 24, padding: "12px 24px", borderRadius: 99, transform: `scale(${tap})` }}>Saiba mais</div>
                    </div>
                    <div style={{ width: 90, height: 90, borderRadius: 45, background: K.lime, transform: `scale(${1 + Math.sin(f / 4) * 0.08})` }} />
                  </div>
                </div>
              )}
            </Phone>
          </div>
        </div>
        <Out at={15.42}>
          <Small dark y={1260} text="Faz a pessoa parar" at={13.0} dur={1.2} />
          <Row y={1340}>
            <Slam at={14.61} dir="up" inline style={sansBig}>de</Slam>
            <Slam at={14.67} dir="zoom" inline style={serifBig(K.lime)}>rolar</Slam>
            <Slam at={14.94} dir="right" inline style={sansBig}>o feed</Slam>
          </Row>
        </Out>
        {f >= F(15.42) && (
          <>
            <Small dark y={1260} text="e prestar atenção" at={15.48} dur={0.9} />
            <Row y={1340}>
              <Slam at={16.41} dir="up" inline style={sansBig}>no que você</Slam>
              <Slam at={16.89} dir="zoom" inline style={serifBig(K.lime)}>vende.</Slam>
            </Row>
          </>
        )}
      </Cam>
    </Bg>
  );
};

/* ═════════ CENA 5 — os 4 passos (carrossel com câmera seguindo) ═════════ */
const StepCard: React.FC<{ n: string; children: React.ReactNode; done?: number }> = ({ n, children, done }) => (
  <div style={{ width: 640, height: 600, borderRadius: 40, background: K.card, border: "2px solid #262626", padding: 40, position: "relative", boxShadow: "0 40px 90px rgba(0,0,0,.5)" }}>
    <div style={{ fontSize: 26, letterSpacing: "0.14em", fontWeight: 700, color: "#9a9a9a" }}>PASSO {n}</div>
    {done !== undefined && (
      <div style={{ position: "absolute", top: 32, right: 32 }}>
        <Check at={done} size={70} />
      </div>
    )}
    {children}
  </div>
);

export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const GAP = 820;
  // carousel camera: card i centered right as its step is spoken
  const cx = kf(f, [[17.55, 0], [20.2, 0], [20.45, GAP], [21.7, GAP], [21.95, GAP * 2], [23.35, GAP * 2], [23.6, GAP * 3]]);
  const vx = Math.abs(cx - kf(f - 1, [[17.55, 0], [20.2, 0], [20.45, GAP], [21.7, GAP], [21.95, GAP * 2], [23.35, GAP * 2], [23.6, GAP * 3]]));
  const msg = "Quero um vídeo pra minha loja";
  const typed = Math.floor(interpolate(f, [F(18.4), F(19.45)], [0, msg.length], cl));
  const sent = t >= 19.62;
  const sentS = spring({ frame: f - F(19.62), fps: FPS, config: { damping: 11 } });
  const prog = interpolate(f, [F(23.6), F(24.95)], [0, 100], { ...cl, easing: Easing.inOut(Easing.quad) });
  const chips = [
    { t: "Instagram", at: 25.44 },
    { t: "WhatsApp", at: 26.2 },
    { t: "Onde quiser", at: 27.0, lime: true },
  ];
  const kfx = kf(f, [[21.9, 0], [23.4, 1]]);
  return (
    <Bg dark glow={[30, 30]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[17.55, 1.5], [18.3, 1.35], [25.2, 1.35], [25.4, 1.42], [27.98, 1.5]]) + punch(fr, 19.62, 0.08) + punch(fr, 21.06, 0.06) + punch(fr, 22.83, 0.06) + punch(fr, 24.99, 0.1) + punch(fr, 27.6, 0.08),
          y: kf(fr, [[17.55, 200], [18.3, 120], [25.2, 120], [25.4, 160]]),
          r: Math.sin(fr / 26) * 1.2,
        })}
      >
        <MBlur x={Math.min(40, vx * 0.4)} style={{ position: "absolute", left: 220 - cx, top: 250, display: "flex", gap: GAP - 640, perspective: 1600 }}>
          {/* PASSO 01 — ideia */}
          <div style={{ transform: `rotateY(${Math.sin(f / 30) * 5}deg)` }}>
            <StepCard n="01">
              <div style={{ position: "absolute", left: 40, right: 40, top: 110, display: "flex", justifyContent: "flex-end" }}>
                {sent && (
                  <div style={{ background: K.lime, color: "#111", fontWeight: 700, fontSize: 34, padding: "20px 26px", borderRadius: "26px 26px 6px 26px", maxWidth: 460, transform: `translateY(${(1 - sentS) * 120}px) scale(${interpolate(sentS, [0, 1], [0.6, 1])})`, transformOrigin: "right bottom" }}>{msg}</div>
                )}
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, height: 96, borderRadius: 48, background: K.card2, display: "flex", alignItems: "center", padding: "0 30px", justifyContent: "space-between" }}>
                <span style={{ color: "#ddd", fontSize: 30, fontWeight: 500 }}>
                  {sent ? "" : msg.slice(0, typed)}
                  {!sent && Math.floor(f / 8) % 2 === 0 ? "|" : ""}
                </span>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: typed > 0 ? K.lime : "#3a3a3a", display: "grid", placeItems: "center", transform: `scale(${t >= 19.55 && t < 19.7 ? 0.8 : 1})` }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="#111"><path d="M4 12l16-8-6 16-2-6z" /></svg>
                </div>
              </div>
            </StepCard>
          </div>
          {/* PASSO 02 — roteiro */}
          <div style={{ transform: `rotateY(${Math.sin(f / 30 + 1) * 5}deg)` }}>
            <StepCard n="02" done={21.5}>
              <div style={{ marginTop: 50, fontSize: 44, fontWeight: 800 }}>Roteiro</div>
              {[0.95, 0.8, 0.9, 0.6, 0.85, 0.7].map((w, i) => {
                const p = interpolate(f, [F(20.5 + i * 0.15), F(20.75 + i * 0.15)], [0, 1], cl);
                return <div key={i} style={{ height: 18, borderRadius: 9, background: i === 0 ? "#fff" : "#3a3a3a", width: `${w * 100 * p}%`, marginTop: 26 }} />;
              })}
            </StepCard>
          </div>
          {/* PASSO 03 — animação */}
          <div style={{ transform: `rotateY(${Math.sin(f / 30 + 2) * 5}deg)` }}>
            <StepCard n="03" done={23.3}>
              <div style={{ position: "absolute", left: 60 + kfx * 400, top: 200 - Math.sin(kfx * Math.PI) * 60, width: 110, height: 110, borderRadius: interpolate(kfx, [0, 1], [18, 55]), background: interpolate(kfx, [0, 0.5, 1], [0, 1, 1]) > 0.5 ? K.lime : "#fff", transform: `rotate(${kfx * 180}deg)` }} />
              <div style={{ position: "absolute", left: 60, right: 60, bottom: 110, height: 4, background: "#3a3a3a" }} />
              {[0, 0.33, 0.66, 1].map((p, i) => (
                <div key={i} style={{ position: "absolute", left: 60 + p * 460 - 14, bottom: 98, width: 28, height: 28, transform: `rotate(45deg) scale(${kfx >= p ? 1.15 : 0.8})`, background: kfx >= p ? K.lime : "#666" }} />
              ))}
            </StepCard>
          </div>
          {/* PASSO 04 — entrega */}
          <div style={{ transform: `rotateY(${Math.sin(f / 30 + 3) * 5}deg)` }}>
            <StepCard n="04" done={24.99}>
              <div style={{ position: "absolute", left: "50%", top: 90, transform: "translateX(-50%)", width: 160, height: 250, borderRadius: 26, background: "#0a0a0a", border: "3px solid #333", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30 }}>
                <div style={{ width: 90, height: 12, borderRadius: 6, background: "#fff" }} />
                <div style={{ width: 60, height: 10, borderRadius: 5, background: "#555", marginTop: 10 }} />
                <div style={{ width: 54, height: 54, borderRadius: 27, background: K.lime, marginTop: 60, transform: `scale(${1 + Math.sin(f / 5) * 0.1})` }} />
              </div>
              {t < 25.3 ? (
                <div style={{ position: "absolute", left: 40, right: 40, bottom: 60 }}>
                  <div style={{ height: 16, borderRadius: 8, background: "#2c2c2c" }}>
                    <div style={{ width: `${prog}%`, height: "100%", borderRadius: 8, background: K.lime }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#bbb", fontSize: 26, marginTop: 14, fontWeight: 600 }}>
                    <span>{Math.round(prog)}%</span>
                    <span>{prog >= 100 ? "Pronto!" : "Exportando"}</span>
                  </div>
                </div>
              ) : (
                <div style={{ position: "absolute", left: 40, right: 40, bottom: 50, display: "flex", gap: 14, justifyContent: "center" }}>
                  {chips.map((c) => {
                    const s = spring({ frame: f - F(c.at), fps: FPS, config: { damping: 10, stiffness: 200 } });
                    return (
                      <div key={c.t} style={{ background: c.lime ? K.lime : "#2c2c2c", color: c.lime ? "#111" : "#fff", fontWeight: 700, fontSize: 28, padding: "14px 22px", borderRadius: 99, transform: `scale(${f < F(c.at) ? 0 : s})` }}>
                        {c.t}
                      </div>
                    );
                  })}
                </div>
              )}
            </StepCard>
          </div>
        </MBlur>
        {/* captions per step */}
        <Out at={20.3}>
          <Small dark y={1050} text="Funciona assim: você manda" at={17.79} dur={1.7} />
          <Row y={1130}>
            <Slam at={19.5} dir="up" inline style={sansBig}>a</Slam>
            <Slam at={19.62} dir="zoom" inline style={serifBig(K.lime)}>ideia.</Slam>
          </Row>
        </Out>
        {t >= 20.3 && (
          <Out at={21.82}>
            <Small dark y={1050} text="A gente cria" at={20.4} dur={0.55} />
            <Row y={1130}>
              <Slam at={21.0} dir="up" inline style={sansBig}>o</Slam>
              <Slam at={21.06} dir="right" inline style={serifBig(K.lime)}>roteiro,</Slam>
            </Row>
          </Out>
        )}
        {t >= 21.82 && (
          <Out at={23.5}>
            <Small dark y={1050} text="anima cada" at={21.87} dur={0.9} />
            <Row y={1130}>
              <Slam at={22.83} dir="zoom" inline style={serifBig(K.lime)}>detalhe</Slam>
            </Row>
          </Out>
        )}
        {t >= 23.5 && (
          <Out at={25.3}>
            <Small dark y={1050} text="e entrega pronto" at={23.55} dur={0.9} />
            <Row y={1130}>
              <Slam at={24.48} dir="up" inline style={sansBig}>pra</Slam>
              <Slam at={24.6} dir="right" inline style={serifBig(K.lime)}>postar.</Slam>
            </Row>
          </Out>
        )}
        {t >= 25.3 && (
          <>
            <Small dark y={1050} text="no Instagram, no WhatsApp" at={25.35} dur={1.5} />
            <Row y={1130}>
              <Slam at={26.9} dir="up" inline style={sansBig}>ou onde</Slam>
              <Slam at={27.6} dir="zoom" inline style={serifBig(K.lime)}>quiser.</Slam>
            </Row>
          </>
        )}
      </Cam>
    </Bg>
  );
};

/* ═════════ CENA 6 — "Transições, efeitos e narração. Tudo incluso." ═════════ */
const Item: React.FC<{ at: number; check: number; icon: React.ReactNode; label: string; from: "left" | "right" }> = ({ at, check, icon, label, from }) => (
  <Slam at={at} dir={from} dist={500}>
    <div style={{ width: 760, height: 130, borderRadius: 34, background: "#fff", display: "flex", alignItems: "center", padding: "0 34px", gap: 26, boxShadow: "0 24px 60px rgba(0,0,0,.08)" }}>
      <div style={{ width: 60, display: "grid", placeItems: "center" }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 46, fontWeight: 700 }}>{label}</div>
      <Check at={check} size={72} />
    </div>
  </Slam>
);

export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <Bg glow={[25, 22]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[27.98, 1.4], [28.7, 1.25], [29.4, 1.2], [30.2, 1.1], [31.65, 1.18]]) + punch(fr, 28.41, 0.05) + punch(fr, 29.16, 0.05) + punch(fr, 29.94, 0.07) + punch(fr, 31.11, 0.14),
          y: kf(fr, [[27.98, 560], [28.7, 520], [29.4, 360], [30.2, 230], [31.65, 230]]) + shakeXY(fr, 31.11, 18, 9).y,
          x: shakeXY(fr, 31.11, 18, 9).x,
          r: Math.sin(fr / 26) * 1.2,
        })}
      >
        <div style={{ position: "absolute", left: 160, top: 300, display: "flex", flexDirection: "column", gap: 34 }}>
          <Item
            at={28.41}
            check={28.95}
            from="left"
            label="Transições"
            icon={
              <svg width="56" height="56" viewBox="0 0 24 24">
                <rect x="2" y="3" width="13" height="13" rx="3" fill="#111" />
                <rect x="9" y="9" width="13" height="13" rx="3" fill={K.lime} />
              </svg>
            }
          />
          <Item
            at={29.16}
            check={29.7}
            from="right"
            label="Efeitos sonoros"
            icon={
              <div style={{ display: "flex", gap: 5, alignItems: "center", height: 56 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ width: 5, borderRadius: 3, background: "#111", height: 14 + Math.abs(Math.sin(f / 3 + i * 1.3)) * 38 }} />
                ))}
              </div>
            }
          />
          <Item
            at={29.94}
            check={30.48}
            from="left"
            label="Narração"
            icon={
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth={2.4} strokeLinecap="round">
                <rect x="9" y="2" width="6" height="12" rx="3" fill="#111" />
                <path d="M19 11a7 7 0 0 1-14 0M12 18v4" />
              </svg>
            }
          />
        </div>
        <Out at={30.75}>
          <Small y={900} text="Transições, efeitos" at={28.41} dur={1.3} />
          <Row y={980}>
            <Slam at={29.82} dir="up" inline style={sansBig}>e</Slam>
            <Slam at={29.94} dir="zoom" inline style={serifBig()}>narração.</Slam>
          </Row>
        </Out>
        {t >= 30.75 && (
          <>
            <Small y={900} text="Tudo" at={30.84} dur={0.2} />
            <Row y={980}>
              <Slam at={31.11} dir="zoom" inline style={{ ...serifBig(), fontSize: 200 }}>incluso.</Slam>
            </Row>
          </>
        )}
      </Cam>
      <Flash at={31.11} max={0.5} color={K.lime} />
    </Bg>
  );
};

/* ═════════ CENA 7 — "Quer o seu? Chama a gente no WhatsApp." ═════════ */
export const S7: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const qOut = kf(f, [[32.68, 0], [32.85, 1]]);
  const chatIn = spring({ frame: f - F(32.75), fps: FPS, config: { damping: 14, stiffness: 140 } });
  const msg = "Quero o meu vídeo!";
  const typed = Math.floor(interpolate(f, [F(32.85), F(33.3)], [0, msg.length], cl));
  const sent = t >= 33.38;
  const sentS = spring({ frame: f - F(33.38), fps: FPS, config: { damping: 11 } });
  const fl = float(f, 5, 4);
  return (
    <Bg dark glow={[70, 30]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[31.65, 1.3], [32.0, 1.15], [32.7, 1.25], [33.0, 1.05], [35, 1.12]]) + punch(fr, 32.25, 0.12) + punch(fr, 33.48, 0.08),
          y: kf(fr, [[32.7, 0], [33.0, 80]]),
          r: Math.sin(fr / 26) * 1.2,
        })}
      >
        {f < F(32.85) && (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + qOut * 5})`, opacity: 1 - qOut, transformOrigin: "540px 900px" }}>
            <Row y={820}>
              <Slam at={32.01} dir="up" inline style={{ ...sansBig, fontSize: 170 }}>Quer o</Slam>
              <Slam at={32.25} dir="zoom" inline style={{ ...serifBig(K.lime), fontSize: 220 }}>seu?</Slam>
            </Row>
          </div>
        )}
        {f >= F(32.75) && (
          <>
            <div style={{ position: "absolute", left: 180, top: 260, width: 720, perspective: 1600 }}>
              <div style={{ transform: `translateY(${(1 - chatIn) * 900}px) rotateX(${fl.rx + (1 - chatIn) * 30}deg) rotateY(${fl.ry}deg)`, height: 620, borderRadius: 40, background: K.card, border: "2px solid #262626", position: "relative", boxShadow: "0 40px 90px rgba(0,0,0,.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, padding: 32, borderBottom: "2px solid #222" }}>
                  <div style={{ width: 70, height: 70, borderRadius: 35, background: "linear-gradient(135deg,#555,#222)", border: `3px solid ${K.lime}` }} />
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 800 }}>kayke.hs</div>
                    <div style={{ fontSize: 24, color: "#8a8a8a" }}>Ativo agora</div>
                  </div>
                </div>
                {sent && (
                  <div style={{ position: "absolute", right: 34, top: 180, background: K.lime, color: "#111", fontWeight: 700, fontSize: 36, padding: "20px 28px", borderRadius: "28px 28px 6px 28px", transform: `translateY(${(1 - sentS) * 140}px) scale(${interpolate(sentS, [0, 1], [0.6, 1])})`, transformOrigin: "right bottom" }}>{msg}</div>
                )}
                {t >= 33.9 && (
                  <div style={{ position: "absolute", left: 34, top: 300, background: "#2a2a2a", borderRadius: 24, padding: "18px 24px", display: "flex", gap: 8 }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: "#999", transform: `translateY(${Math.sin(f / 3 + i) * 5}px)` }} />
                    ))}
                  </div>
                )}
                <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 96, borderRadius: 48, background: K.card2, display: "flex", alignItems: "center", padding: "0 30px", justifyContent: "space-between" }}>
                  <span style={{ color: "#ddd", fontSize: 32, fontWeight: 500 }}>
                    {sent ? "" : msg.slice(0, typed)}
                    {!sent && Math.floor(f / 8) % 2 === 0 ? "|" : ""}
                  </span>
                  <div style={{ width: 64, height: 64, borderRadius: 32, background: typed > 0 ? K.lime : "#3a3a3a", display: "grid", placeItems: "center" }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="#111"><path d="M4 12l16-8-6 16-2-6z" /></svg>
                  </div>
                </div>
              </div>
            </div>
            <Small dark y={1000} text="Chama a gente" at={32.88} dur={0.55} />
            <Row y={1080}>
              <Slam at={33.45} dir="up" inline style={sansBig}>no</Slam>
              <Slam at={33.52} dir="zoom" inline style={serifBig(K.lime)}>WhatsApp.</Slam>
            </Row>
          </>
        )}
      </Cam>
    </Bg>
  );
};
