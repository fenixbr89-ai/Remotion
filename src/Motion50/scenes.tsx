import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { cl, kf, MBlur, punch, shakeXY, Slam, Type } from "../Wayfluency/motion";
import { Bg, Cam, Check, Flash, float, Phone, Row, sansBig, serifBig, Small } from "../MotionAd/scenes";
import { F, FPS, K, SANS } from "../MotionAd/theme";

const avatar = staticFile("motionad/avatar.jpg");
const tick = (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/** Lime background version of Bg */
const LimeBg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: SANS, letterSpacing: "-0.03em", background: K.lime, color: K.black, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(0,0,0,.06) 2px,transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `${(f * 0.8) % 90}px ${(f * 0.5) % 90}px`,
        }}
      />
      <AbsoluteFill style={{ transform: "scale(0.8)", transformOrigin: "540px 930px" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ═════ 1 — "Você tem só três segundos pra prender seu cliente." ═════ */
export const N1: React.FC = () => {
  const f = useCurrentFrame();
  const bar = interpolate(f, [F(1.17), F(3.6)], [0, 100], cl);
  const s3 = spring({ frame: f - F(1.17), fps: FPS, config: { damping: 10, stiffness: 180 } });
  return (
    <Bg dark glow={[50, 40]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[0, 1.3], [1.1, 1.25], [1.35, 1.0], [3.75, 1.08]]) + punch(fr, 1.17, 0.16) + punch(fr, 2.13, 0.07),
          y: kf(fr, [[0, 380], [1.1, 360], [1.35, 0]]) + shakeXY(fr, 1.17, 22, 9).y,
          x: shakeXY(fr, 1.17, 22, 9).x,
          r: Math.sin(fr / 24) * 1.5,
        })}
      >
        <Row y={380} style={{ fontSize: 60, fontWeight: 500, color: "#9a9a9a" }}>
          <Type text="você tem só" at={0.33} dur={0.7} />
        </Row>
        <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center", fontSize: 560, fontWeight: 900, lineHeight: 1, color: K.lime, letterSpacing: "-0.06em", opacity: f < F(1.17) ? 0 : 1, transform: `scale(${interpolate(s3, [0, 1], [2.6, 1])})`, filter: `blur(${interpolate(s3, [0, 1], [18, 0], cl)}px)` }}>
          3s
        </div>
        <div style={{ position: "absolute", left: 240, right: 240, top: 1060, height: 18, borderRadius: 9, background: "#262626", opacity: f < F(1.3) ? 0 : 1 }}>
          <div style={{ width: `${bar}%`, height: "100%", borderRadius: 9, background: bar > 85 ? "#FF5A4E" : K.lime }} />
        </div>
        <Row y={1180}>
          <Slam at={1.95} dir="up" inline style={sansBig}>pra</Slam>
          <Slam at={2.13} dir="zoom" inline style={serifBig(K.lime)}>prender</Slam>
        </Row>
        <Row y={1310}>
          <Slam at={2.64} dir="right" inline style={sansBig}>seu cliente.</Slam>
        </Row>
      </Cam>
    </Bg>
  );
};

/* ═════ 2 — "Se o seu vídeo é parado... ninguém assiste." ═════ */
export const N2: React.FC = () => {
  const f = useCurrentFrame();
  const skip = kf(f, [[5.25, 0], [5.6, 1]]);
  const vSkip = Math.abs(skip - kf(f - 1, [[5.25, 0], [5.6, 1]])) * 700;
  const arrow = spring({ frame: f - F(5.2), fps: FPS, config: { damping: 11 } });
  return (
    <Bg glow={[75, 20]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[3.75, 1.25], [5.1, 1.18], [5.4, 1.0], [7.2, 1.06]]) + punch(fr, 5.91, 0.08),
          y: kf(fr, [[3.75, 260], [5.1, 240], [5.4, 0]]),
          r: Math.sin(fr / 26) * 1.2,
        })}
      >
        <div style={{ position: "absolute", left: 320, top: 190, transform: "rotate(-5deg)" }}>
          <Phone>
            <div style={{ position: "absolute", inset: 0, background: "#DADDD9" }}>
              <MBlur y={Math.min(40, vSkip * 0.05)} style={{ position: "absolute", inset: 0, transform: `translateY(${-skip * 700}px)` }}>
                {[0, 1].map((k) => (
                  <div key={k} style={{ position: "absolute", left: 0, right: 0, top: k * 700 }}>
                    <div style={{ position: "absolute", left: 30, right: 30, top: 110, display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 22, background: "#b9bdb8" }} />
                      <div style={{ width: 150, height: 14, borderRadius: 7, background: "#b9bdb8" }} />
                    </div>
                    <div style={{ position: "absolute", left: 30, right: 30, top: 180, height: 420, borderRadius: 24, background: "#C6CAC5", display: "grid", placeItems: "center" }}>
                      <div style={{ fontSize: 48, fontWeight: 800, color: "#9fa39e", textAlign: "center", lineHeight: 1.05 }}>
                        PROMOÇÃO
                        <br />
                        <span style={{ fontSize: 30, fontWeight: 600 }}>imagem parada</span>
                      </div>
                    </div>
                    <div style={{ position: "absolute", left: 30, top: 630, width: 300, height: 14, borderRadius: 7, background: "#b9bdb8" }} />
                  </div>
                ))}
              </MBlur>
            </div>
          </Phone>
        </div>
        {f >= F(5.2) && (
          <div style={{ position: "absolute", left: 770, top: 430, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transform: `translateY(${(1 - arrow) * 200}px)`, opacity: Math.min(1, arrow * 2) }}>
            <svg width="120" height="260" viewBox="0 0 60 130">
              <path d="M30 125V15" stroke="#0A0A0A" strokeWidth="7" strokeLinecap="round" />
              <path d="M12 32L30 12l18 20" fill="none" stroke="#0A0A0A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Slam at={5.45} dir="zoom">
              <div style={{ background: "#0A0A0A", color: "#fff", fontSize: 38, fontWeight: 700, padding: "14px 30px", borderRadius: 99 }}>pulou</div>
            </Slam>
          </div>
        )}
        <Small y={1210} text="vídeo parado?" at={4.14} dur={1.0} />
        <Row y={1290}>
          <Slam at={5.91} dir="up" inline style={sansBig}>ninguém</Slam>
          <Slam at={6.35} dir="right" inline style={serifBig()}>assiste.</Slam>
        </Row>
      </Cam>
    </Bg>
  );
};

/* ═════ 3 — "Agora, imagina assim:" (fundo limão) ═════ */
export const N3: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [F(9.2), F(9.55)], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <LimeBg>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[7.2, 1.2], [9.75, 1.0]]) + punch(fr, 8.4, 0.1) + punch(fr, 9.15, 0.14),
          r: kf(fr, [[7.2, -3], [9.75, 2]]),
          x: shakeXY(fr, 9.15, 20, 9).x,
          y: shakeXY(fr, 9.15, 20, 9).y,
        })}
      >
        <Row y={620} style={{ fontSize: 96, fontWeight: 600, color: "rgba(10,10,10,.55)" }}>
          <Type text="agora" at={7.53} dur={0.5} />
        </Row>
        <Row y={770}>
          <Slam at={8.4} dir="up" inline style={{ fontSize: 210, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.05em" }}>imagina</Slam>
        </Row>
        <Row y={980}>
          <Slam at={9.15} dir="zoom" inline style={{ ...serifBig(), fontSize: 270 }}>assim:</Slam>
        </Row>
        <svg style={{ position: "absolute", left: 170, top: 1290 }} width="740" height="40">
          <path d="M10 22 C 200 4, 520 4, 730 22" stroke="#0A0A0A" strokeWidth="10" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - line} />
        </svg>
      </Cam>
    </LimeBg>
  );
};

/* ═════ 4 — "Com motion, ele para o feed." ═════ */
export const N4: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = kf(f, [[9.75, 0], [11.19, 1800]]);
  const vScroll = Math.abs(scroll - kf(f - 1, [[9.75, 0], [11.19, 1800]]));
  const fl = float(f, 2, 5);
  const badge = spring({ frame: f - F(11.19), fps: FPS, config: { damping: 9, stiffness: 200 } });
  return (
    <Bg dark glow={[50, 30]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[9.75, 1.15], [11.1, 1.05], [11.3, 1.2], [12.0, 1.25]]) + punch(fr, 11.19, 0.14),
          y: kf(fr, [[9.75, 100], [11.1, 100], [11.3, 220]]) + shakeXY(fr, 11.19, 24, 10).y,
          x: shakeXY(fr, 11.19, 24, 10).x,
          r: Math.sin(fr / 22) * 1.5,
        })}
      >
        <div style={{ position: "absolute", left: 320, top: 150, perspective: 1600 }}>
          <div style={{ transform: `rotateY(${fl.ry}deg) rotateX(${fl.rx}deg) rotateZ(4deg)` }}>
            <Phone>
              {/* feed scrolling before the stop */}
              {f < F(11.19) && (
                <MBlur y={Math.min(40, vScroll * 0.6)} style={{ position: "absolute", inset: 0, transform: `translateY(${-scroll % 900}px)` }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ margin: "20px 24px", height: 260, borderRadius: 22, background: ["#2a2a2a", "#3a3a3a", "#4a4a4a"][i % 3] }} />
                  ))}
                </MBlur>
              )}
              {f >= F(11.19) && (
                <div style={{ position: "absolute", inset: 0, background: "#0d0d0d", transform: `scale(${interpolate(badge, [0, 1], [1.25, 1])})` }}>
                  <div style={{ position: "absolute", left: 34, top: 120, fontSize: 22, letterSpacing: "0.12em", fontWeight: 700, color: "#888" }}>HAMBURGUERIA</div>
                  <div style={{ position: "absolute", left: 34, top: 156, fontSize: 78, fontWeight: 900, lineHeight: 0.92, color: "#fff" }}>
                    NOVO
                    <br />
                    SABOR
                  </div>
                  <div style={{ position: "absolute", left: 105, top: 380, width: 200, height: 200, borderRadius: 100, background: K.lime, boxShadow: "0 0 80px rgba(208,248,92,.55)", transform: `scale(${1 + Math.sin(f / 4) * 0.06}) rotate(${f * 3}deg)` }} />
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ position: "absolute", left: 20 + ((f * 6 + i * 30) % 80), top: 430 + i * 40, width: 60, height: 10, borderRadius: 5, background: `rgba(208,248,92,${0.5 - i * 0.1})` }} />
                  ))}
                  <div style={{ position: "absolute", left: 34, top: 640, background: "#fff", color: "#111", fontWeight: 800, fontSize: 28, padding: "14px 28px", borderRadius: 99 }}>Peça agora</div>
                  <div style={{ position: "absolute", left: 34, right: 34, bottom: 70, height: 6, borderRadius: 3, background: "#333" }}>
                    <div style={{ width: `${interpolate(f, [F(11.19), F(12.2)], [10, 70], cl)}%`, height: "100%", borderRadius: 3, background: "#fff" }} />
                  </div>
                </div>
              )}
            </Phone>
          </div>
        </div>
        {f >= F(11.19) && (
          <div style={{ position: "absolute", left: 640, top: 250, transform: `rotate(8deg) scale(${badge})`, display: "flex", alignItems: "center", gap: 12, background: K.lime, color: K.black, fontSize: 40, fontWeight: 800, padding: "18px 32px", borderRadius: 99, boxShadow: "0 20px 40px rgba(0,0,0,.4)" }}>
            {tick}parou aqui
          </div>
        )}
        <Small dark y={1210} text="com motion," at={9.87} dur={0.9} />
        <Row y={1290}>
          <Slam at={10.92} dir="up" inline style={sansBig}>ele</Slam>
          <Slam at={11.19} dir="zoom" inline style={serifBig(K.lime)}>para</Slam>
          <Slam at={11.3} dir="right" inline style={sansBig}>o feed.</Slam>
        </Row>
      </Cam>
      <Flash at={11.19} max={0.35} color={K.lime} />
    </Bg>
  );
};

/* ═════ 5 — "Mais atenção, mais cliques... mais vendas." ═════ */
const Metric: React.FC<{ at: number; label: string; icon: React.ReactNode; dark?: boolean; from: "left" | "right"; rot: number; dx: number }> = ({ at, label, icon, dark, from, rot, dx }) => {
  const f = useCurrentFrame();
  const arrowUp = interpolate(spring({ frame: f - F(at + 0.15), fps: FPS, config: { damping: 9 } }), [0, 1], [40, 0]);
  return (
    <Slam at={at} dir={from} dist={500}>
      <div style={{ width: 780, height: 150, borderRadius: 36, background: dark ? K.black : "#fff", color: dark ? "#fff" : K.black, display: "flex", alignItems: "center", gap: 28, padding: "0 36px", boxShadow: dark ? "0 24px 60px rgba(0,0,0,.25)" : "0 24px 60px rgba(0,0,0,.08)", transform: `rotate(${rot}deg) translateX(${dx}px)` }}>
        <div style={{ width: 84, height: 84, borderRadius: 24, background: dark ? K.lime : K.black, display: "grid", placeItems: "center" }}>{icon}</div>
        <div style={{ flex: 1, fontSize: 50, fontWeight: 700 }}>{label}</div>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={dark ? K.lime : K.black} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `translate(${-arrowUp * 0.6}px,${arrowUp}px)` }}>
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      </div>
    </Slam>
  );
};

export const N5: React.FC = () => (
  <Bg glow={[80, 22]}>
    <Cam
      fn={(fr) => ({
        s: kf(fr, [[12.0, 1.3], [12.9, 1.3], [13.4, 1.22], [13.85, 1.15], [14.8, 1.05]]) + punch(fr, 12.18, 0.05) + punch(fr, 13.45, 0.05) + punch(fr, 13.86, 0.06) + punch(fr, 14.2, 0.1),
        y: kf(fr, [[12.0, 620], [12.9, 600], [13.4, 420], [13.85, 250], [14.8, 160]]),
        r: Math.sin(fr / 26) * 1.2,
      })}
    >
      <div style={{ position: "absolute", left: 150, top: 250, display: "flex", flexDirection: "column", gap: 34 }}>
        <Metric at={12.18} from="left" rot={-2} dx={-20} label="mais atenção" icon={<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={K.lime} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>} />
        <Metric at={13.45} from="right" rot={1.5} dx={30} label="mais cliques" icon={<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={K.lime} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M9 3l1 9 3-3 5 8-3 2-5-8-3 3z" /></svg>} />
        <Metric at={13.86} from="left" rot={-1} dx={0} dark label="mais vendas" icon={<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={K.black} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6L5 2H2" /></svg>} />
      </div>
      <Small y={1060} text="mais atenção, mais cliques…" at={12.18} dur={1.6} />
      <Row y={1140}>
        <Slam at={13.86} dir="up" inline style={sansBig}>mais</Slam>
        <Slam at={14.2} dir="zoom" inline style={serifBig()}>vendas.</Slam>
      </Row>
    </Cam>
  </Bg>
);

/* ═════ 6 — "Roteiro, animação, narração, efeitos e trilha. Tudo incluso." ═════ */
const tiles = [
  { t: "Roteiro", at: 15.06 },
  { t: "Animação", at: 15.76 },
  { t: "Narração", at: 16.47 },
  { t: "Efeitos sonoros", at: 17.16 },
  { t: "Trilha", at: 17.7 },
  { t: "Pronto pra postar", at: 18.51, lime: true },
];
const TileIcon: React.FC<{ i: number; on: boolean }> = ({ i, on }) => {
  const f = useCurrentFrame();
  const c = "#fff";
  if (i === 0)
    return (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </svg>
    );
  if (i === 1)
    return (
      <svg width="60" height="60" viewBox="0 0 24 24" style={{ transform: `rotate(${on ? f * 4 : 0}deg)` }}>
        <rect x="2" y="3" width="13" height="13" rx="3" fill="#fff" />
        <rect x="9" y="9" width="13" height="13" rx="3" fill={K.lime} />
      </svg>
    );
  if (i === 2)
    return (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.4} strokeLinecap="round">
        <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff" />
        <path d="M19 11a7 7 0 0 1-14 0M12 18v4" />
      </svg>
    );
  if (i === 3)
    return (
      <div style={{ display: "flex", gap: 6, alignItems: "center", height: 60 }}>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <div key={k} style={{ width: 6, borderRadius: 3, background: k === 3 ? K.lime : "#fff", height: on ? 16 + Math.abs(Math.sin(f / 3 + k * 1.3)) * 40 : 20 }} />
        ))}
      </div>
    );
  if (i === 4)
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `translateY(${on ? Math.sin(f / 4) * 4 : 0}px)` }}>
        <path d="M24 48V14l30-6v34" />
        <circle cx="17" cy="48" r="7" fill="#fff" />
        <circle cx="47" cy="42" r="7" fill={K.lime} stroke={K.lime} />
      </svg>
    );
  return (
    <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
    </svg>
  );
};

export const N6: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  // camera walks the grid, tile by tile
  const pos = (i: number) => ({ x: i % 2 === 0 ? 320 : 770, y: 345 + Math.floor(i / 2) * 260 });
  const keysX: [number, number][] = [[14.8, 540]];
  const keysY: [number, number][] = [[14.8, 600]];
  tiles.forEach((tl, i) => {
    keysX.push([tl.at - 0.1, pos(i).x], [tl.at + 0.35, pos(i).x]);
    keysY.push([tl.at - 0.1, pos(i).y], [tl.at + 0.35, pos(i).y]);
  });
  keysX.push([18.9, 540]);
  keysY.push([18.9, 760]);
  return (
    <Bg dark glow={[25, 30]}>
      <Cam
        fn={(fr) => {
          const s = kf(fr, [[14.8, 1.2], [15.0, 1.45], [18.4, 1.45], [18.9, 1.0], [20, 1.05]]);
          return {
            s: s + punch(fr, 19.08, 0.12),
            x: (540 - kf(fr, keysX)) * s,
            y: (960 - kf(fr, keysY)) * s * 0.85,
            r: Math.sin(fr / 24) * 1.2,
          };
        }}
      >
        <div style={{ position: "absolute", left: 110, top: 230, display: "grid", gridTemplateColumns: "repeat(2,420px)", gap: 30 }}>
          {tiles.map((tl, i) => {
            const on = t >= tl.at;
            const s = spring({ frame: f - F(tl.at), fps: FPS, config: { damping: 10, stiffness: 200 } });
            return (
              <div key={tl.t} style={{ height: 230, borderRadius: 36, background: tl.lime && on ? K.lime : K.card, color: tl.lime && on ? K.black : "#fff", border: `2px solid ${on ? (tl.lime ? K.lime : "#3a3a3a") : "#222"}`, padding: 30, display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: on ? 1 : 0.35, transform: `scale(${on ? interpolate(s, [0, 1], [0.85, 1]) : 0.92})` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <TileIcon i={i} on={on} />
                  {!tl.lime && <Check at={tl.at + 0.1} />}
                </div>
                <div style={{ fontSize: tl.lime ? 44 : 46, fontWeight: tl.lime ? 800 : 700, lineHeight: 1 }}>{tl.t}</div>
              </div>
            );
          })}
        </div>
        <Small dark y={1100} text="o pacote completo:" at={15.0} dur={0.8} />
        <Row y={1180}>
          <Slam at={18.51} dir="up" inline style={sansBig}>tudo</Slam>
          <Slam at={19.08} dir="zoom" inline style={{ ...serifBig(K.lime), fontSize: 160 }}>incluso.</Slam>
        </Row>
      </Cam>
      <Flash at={19.08} max={0.3} color={K.lime} />
    </Bg>
  );
};

/* ═════ 7 — "Você manda a ideia, a gente cria e anima, e você só posta." ═════ */
const steps = [
  { at: 20.28, n: "01", a: "você", b: "manda a ideia" },
  { at: 21.88, n: "02", a: "a gente", b: "cria e anima" },
  { at: 24.48, n: "✓", a: "você", b: "só posta", lime: true },
];
export const N7: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const rowY = (i: number) => 260 + i * 230;
  return (
    <Bg glow={[20, 25]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[20.0, 1.4], [21.7, 1.4], [22.0, 1.4], [24.3, 1.4], [24.6, 1.4], [25.2, 1.05]]) + punch(fr, 20.28, 0.05) + punch(fr, 21.88, 0.05) + punch(fr, 24.48, 0.08) + punch(fr, 25.08, 0.08),
          y: kf(fr, [[20.0, (960 - rowY(0) - 60) * 1.4], [21.7, (960 - rowY(0) - 60) * 1.4], [22.0, (960 - rowY(1) - 60) * 1.4], [24.3, (960 - rowY(1) - 60) * 1.4], [24.6, (960 - rowY(2) - 60) * 1.4], [25.2, 60]]),
          x: kf(fr, [[20.0, 40], [25.2, 0]]),
          r: Math.sin(fr / 26) * 1.2,
        })}
      >
        <div style={{ position: "absolute", left: 150, top: 220, width: 780, height: 760, borderRadius: 40, background: "#fff", boxShadow: "0 30px 70px rgba(0,0,0,.08)", transform: "rotate(-1.5deg)" }}>
          {steps.map((s, i) => {
            const on = t >= s.at;
            const sp = spring({ frame: f - F(s.at), fps: FPS, config: { damping: 11, stiffness: 200 } });
            return (
              <div key={s.n} style={{ position: "absolute", left: 44, top: 40 + i * 230, display: "flex", gap: 30, alignItems: "center", opacity: on ? 1 : 0.25 }}>
                <div style={{ width: 110, height: 110, borderRadius: 30, background: s.lime && on ? K.lime : K.black, color: s.lime ? K.black : K.lime, display: "grid", placeItems: "center", fontSize: 44, fontWeight: 800, transform: `scale(${on ? interpolate(sp, [0, 1], [0.5, 1]) : 0.9}) rotate(${on ? (1 - sp) * -30 : 0}deg)` }}>
                  {s.lime ? tick : s.n}
                </div>
                <div style={{ transform: `translateX(${on ? (1 - sp) * 80 : 0}px)` }}>
                  <div style={{ fontSize: 34, color: K.grey, fontWeight: 600 }}>{s.a}</div>
                  <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1 }}>{s.b}</div>
                </div>
              </div>
            );
          })}
          {[0, 1].map((i) => (
            <div key={i} style={{ position: "absolute", left: 97, top: 160 + i * 230, width: 4, height: 100, background: "#E2E5E1" }}>
              <div style={{ width: 4, height: `${interpolate(f, [F(steps[i + 1].at - 0.4), F(steps[i + 1].at)], [0, 100], cl)}%`, background: K.black }} />
            </div>
          ))}
        </div>
        <Small y={1080} text="sem complicação." at={20.4} dur={0.8} />
        <Row y={1160}>
          <Slam at={24.84} dir="up" inline style={sansBig}>simples</Slam>
          <Slam at={25.08} dir="zoom" inline style={serifBig()}>assim.</Slam>
        </Row>
      </Cam>
    </Bg>
  );
};

/* ═════ 8 — "Tudo isso por apenas... cinquenta reais. Cabe no bolso." ═════ */
export const N8: React.FC = () => {
  const f = useCurrentFrame();
  const hit = 28.08;
  const cnt = (fr: number) => interpolate(fr, [F(27.0), F(hit)], [0, 50], { ...cl, easing: Easing.out(Easing.cubic) });
  const v = cnt(f);
  const speed = Math.abs(cnt(f) - cnt(f - 1));
  const tilt = kf(f, [[26.9, 30], [hit, 0]]);
  const ry = f > F(hit) ? Math.sin((f - F(hit)) / 20) * 5 : kf(f, [[26.9, -20], [hit, 0]]);
  return (
    <Bg dark glow={[50, 42]}>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[25.95, 1.3], [26.9, 1.3], [27.2, 1.0], [hit - 0.05, 1.12], [hit + 0.6, 1.02], [30.9, 1.08]]) + punch(fr, hit, 0.2) + punch(fr, 30.09, 0.08),
          y: kf(fr, [[25.95, 600], [26.9, 600], [27.2, 0], [hit, -60]]) + shakeXY(fr, hit, 24, 10).y,
          x: shakeXY(fr, hit, 24, 10).x,
          r: kf(fr, [[27.2, -2], [hit, 1]]),
        })}
      >
        <Small dark y={470} text="tudo isso por apenas…" at={26.43} dur={1.1} />
        <div style={{ position: "absolute", left: 110, top: 580, perspective: 1600 }}>
          <Slam at={26.9} dir="up" dist={700}>
            <div style={{ transform: `rotateX(${tilt}deg) rotateY(${ry}deg)`, width: 860, padding: "70px 50px 60px", borderRadius: 48, background: "linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.03))", border: "2px solid rgba(255,255,255,.12)", boxShadow: "0 40px 90px rgba(0,0,0,.5)", textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: -34, right: 60, background: K.lime, color: K.black, fontSize: 34, fontWeight: 700, padding: "12px 30px", borderRadius: 99 }}>por vídeo</div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", fontWeight: 900, lineHeight: 0.9 }}>
                <span style={{ fontSize: 110, marginTop: 70, marginRight: 16 }}>R$</span>
                <MBlur y={Math.min(30, speed * 6)} style={{ display: "flex", alignItems: "flex-start", color: K.lime, fontVariantNumeric: "tabular-nums" }}>
                  <span style={{ fontSize: 380, letterSpacing: "-0.06em" }}>{String(Math.round(v)).padStart(2, "0")}</span>
                  <span style={{ fontSize: 120, marginTop: 40 }}>,00</span>
                </MBlur>
              </div>
            </div>
          </Slam>
        </div>
        <Row y={1200}>
          <Slam at={29.6} dir="up" inline style={sansBig}>cabe no</Slam>
          <Slam at={30.09} dir="zoom" inline style={serifBig(K.lime)}>bolso.</Slam>
        </Row>
      </Cam>
      <Flash at={hit} max={0.45} color={K.lime} />
    </Bg>
  );
};

/* ═════ 9 — "Quer o seu? Chama no direct!" (fundo limão + foto) ═════ */
export const N9: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const msg = "Quero o meu vídeo!";
  const typed = Math.floor(interpolate(f, [F(31.2), F(31.95)], [0, msg.length], cl));
  const sent = t >= 32.05;
  const sentS = spring({ frame: f - F(32.05), fps: FPS, config: { damping: 11 } });
  const reply = spring({ frame: f - F(32.9), fps: FPS, config: { damping: 11 } });
  const cardIn = spring({ frame: f - F(30.95), fps: FPS, config: { damping: 14, stiffness: 130 } });
  const fl = float(f, 4, 4);
  return (
    <LimeBg>
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[30.9, 1.35], [32.0, 1.3], [32.4, 1.0], [35.2, 1.06]]) + punch(fr, 32.05, 0.06) + punch(fr, 32.85, 0.1),
          y: kf(fr, [[30.9, 470], [32.0, 440], [32.4, 0]]),
          r: Math.sin(fr / 26) * 1.2,
        })}
      >
        <div style={{ position: "absolute", left: 150, top: 260, width: 780, perspective: 1600 }}>
          <div style={{ transform: `translateY(${(1 - cardIn) * 900}px) rotateX(${fl.rx + (1 - cardIn) * 30}deg) rotateY(${fl.ry}deg) rotate(-2deg)`, borderRadius: 44, background: K.black, color: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,.25)", height: 600, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: 32, borderBottom: "2px solid #222" }}>
              <Img src={avatar} style={{ width: 84, height: 84, borderRadius: 42, objectFit: "cover", border: `3px solid ${K.lime}` }} />
              <div>
                <div style={{ fontSize: 40, fontWeight: 800 }}>kayke.hs</div>
                <div style={{ fontSize: 26, color: "#8a8a8a" }}>Ativo agora</div>
              </div>
            </div>
            {sent && (
              <div style={{ position: "absolute", right: 34, top: 180, background: K.lime, color: K.black, fontWeight: 700, fontSize: 38, padding: "22px 30px", borderRadius: "30px 30px 8px 30px", transform: `translateY(${(1 - sentS) * 120}px) scale(${interpolate(sentS, [0, 1], [0.6, 1])})`, transformOrigin: "right bottom" }}>{msg}</div>
            )}
            {t >= 32.9 && (
              <div style={{ position: "absolute", left: 34, top: 310, background: "#262626", fontWeight: 600, fontSize: 36, padding: "22px 30px", borderRadius: "30px 30px 30px 8px", transform: `translateY(${(1 - reply) * 100}px) scale(${interpolate(reply, [0, 1], [0.6, 1])})`, transformOrigin: "left bottom" }}>Bora! Me conta a ideia 🚀</div>
            )}
            <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 96, borderRadius: 48, background: K.card2, display: "flex", alignItems: "center", padding: "0 30px", justifyContent: "space-between" }}>
              <span style={{ color: "#ddd", fontSize: 32, fontWeight: 500 }}>
                {sent ? "" : msg.slice(0, typed)}
                {!sent && Math.floor(f / 8) % 2 === 0 ? "|" : ""}
              </span>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: typed > 0 ? K.lime : "#3a3a3a", display: "grid", placeItems: "center", transform: `scale(${t >= 31.98 && t < 32.1 ? 0.8 : 1})` }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#111">
                  <path d="M4 12l16-8-6 16-2-6z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Row y={980} style={{ fontSize: 64, fontWeight: 600, color: "rgba(10,10,10,.6)" }}>
          <Type text="quer o seu?" at={31.14} dur={0.7} />
        </Row>
        <Row y={1070}>
          <Slam at={32.1} dir="up" inline style={{ ...sansBig, fontSize: 130 }}>chama no</Slam>
          <Slam at={32.85} dir="zoom" inline style={{ ...serifBig(), fontSize: 175 }}>direct.</Slam>
        </Row>
        <Row y={1300}>
          <Slam at={33.4} dir="up" dist={200}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: K.black, color: "#fff", fontSize: 48, fontWeight: 700, padding: "16px 44px 16px 16px", borderRadius: 99 }}>
              <Img src={avatar} style={{ width: 76, height: 76, borderRadius: 38, objectFit: "cover" }} />
              @kayke.hs
            </div>
          </Slam>
        </Row>
      </Cam>
    </LimeBg>
  );
};


