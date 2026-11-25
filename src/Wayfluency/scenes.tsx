import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { cl, kf, MBlur, punch, shakeXY, Slam, Track, Type } from "./motion";
import { C, F, FPS, fontFamily } from "./theme";
import * as Ic from "./icons";

const logo = staticFile("wayfluency-logo.svg");
const logoW = staticFile("wayfluency-logo-branca.svg");

const base: React.CSSProperties = { fontFamily, letterSpacing: "-0.02em" };
const L: React.CSSProperties = { fontWeight: 300 };
const Bd: React.CSSProperties = { fontWeight: 700 };
const XB: React.CSSProperties = { fontWeight: 800 };

/* Background with a slowly drifting light — never fully static */
const Bg: React.FC<{ kind: "blue" | "light"; children: React.ReactNode }> = ({ kind, children }) => {
  const f = useCurrentFrame();
  const cx = 50 + Math.sin(f / 37) * 14;
  const cy = 45 + Math.cos(f / 53) * 10;
  const bg =
    kind === "blue"
      ? `radial-gradient(120% 70% at ${cx}% ${cy}%,#1A97FF 0%,#0574EE 30%,#0558C8 70%,#043E95 100%)`
      : `radial-gradient(90% 60% at ${cx}% ${cy}%,#FFFFFF 0%,#EEF2F7 60%,#DCE4EE 100%)`;
  return (
    <AbsoluteFill style={{ ...base, background: bg, color: kind === "blue" ? "#fff" : C.navy, overflow: "hidden" }}>
      {children}
    </AbsoluteFill>
  );
};

type CamV = { x?: number; y?: number; s?: number; r?: number; rx?: number; ry?: number };

/** Camera with motion blur derived from its own speed. */
const Cam: React.FC<{ fn: (fr: number) => CamV; children: React.ReactNode }> = ({ fn, children }) => {
  const f = useCurrentFrame();
  const c = { x: 0, y: 0, s: 1, r: 0, rx: 0, ry: 0, ...fn(f) };
  const p = { x: 0, y: 0, s: 1, ...fn(f - 1) };
  const vx = Math.abs(c.x - p.x);
  const vy = Math.abs(c.y - p.y);
  const vs = Math.abs(c.s - p.s) * 500;
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <MBlur
        x={Math.min(34, (vx + vs) * 0.35)}
        y={Math.min(34, (vy + vs) * 0.35)}
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${c.x}px,${c.y}px) scale(${c.s}) rotate(${c.r}deg) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`,
          transformOrigin: "540px 960px",
        }}
      >
        {children}
      </MBlur>
    </AbsoluteFill>
  );
};

const Center: React.FC<{ y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ y, children, style }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, textAlign: "center", ...style }}>
    {children}
  </div>
);

/** Fly-away helper: element leaves upward with blur at `sec`. */
const flyOut = (f: number, sec: number, dist = -420) => {
  const p = interpolate(f, [F(sec), F(sec) + 6], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  return { transform: `translateY(${p * dist}px)`, opacity: 1 - p, blur: p * 30 };
};

const Flash: React.FC<{ at: number; max?: number }> = ({ at, max = 0.6 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [F(at), F(at) + 2, F(at) + 8], [0, max, 0], cl);
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
};

/* Continuous 3D float for cards */
const float = (f: number, seed: number, a = 7) => ({
  ry: Math.sin(f / 28 + seed) * a,
  rx: Math.cos(f / 33 + seed) * a * 0.6,
  y: Math.sin(f / 21 + seed * 2) * 8,
});

/* ═════════════ CENA 1 — logo + "já pensou em finalmente destravar o seu inglês?" ═════════════ */
export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, F(0.75)], [9, 1], { ...cl, easing: Easing.bezier(0.8, 0, 0.2, 1) });
  const zb = interpolate(f, [0, F(0.6), F(0.75)], [16, 8, 0], cl);
  const upK: [number, number][] = [[0.95, 0], [1.3, 1]];
  const up = kf(f, upK);
  const vUp = Math.abs(up - kf(f - 1, upK)) * 420;
  return (
    <Bg kind="blue">
      <Cam fn={(fr) => ({ s: 1 + fr / 900 + punch(fr, 1.98, 0.1) + punch(fr, 2.7, 0.06), r: interpolate(fr, [0, F(3.45)], [-1.5, 1.5]) })}>
        <MBlur y={Math.min(30, vUp * 0.5)} style={{ position: "absolute", inset: 0, transform: `translateY(${up * -420}px) scale(${1 - up * 0.38})`, transformOrigin: "540px 900px" }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "37.6% 47%", filter: zb > 0.3 ? `blur(${zb}px)` : undefined }}>
            <Img src={logoW} style={{ position: "absolute", width: 900, left: 90, top: 820 }} />
          </div>
        </MBlur>
        <Center y={980} style={{ fontSize: 60 }}>
          <Type text="já pensou em" at={0.21} dur={0.5} style={L} />
          <Type text="finalmente" at={0.84} dur={0.8} style={L} />
        </Center>
        <Center y={1070}>
          <Slam at={1.98} dir="up" style={{ ...XB, fontSize: 190, color: C.sky, lineHeight: 1 }}>destravar</Slam>
        </Center>
        <Center y={1290} style={{ fontSize: 90 }}>
          <Type text="o seu" at={2.49} dur={0.2} style={L} />
          <Slam at={2.7} dir="right" inline style={Bd}>inglês?</Slam>
        </Center>
      </Cam>
      <Flash at={0.75} max={0.45} />
    </Bg>
  );
};

/* ═════════════ CENA 2 — matrículas abertas ═════════════ */
export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const o1 = flyOut(f, 4.92);
  return (
    <Bg kind="light">
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[3.45, 1.15], [4.9, 1.05], [5.1, 1], [7.6, 1], [8.3, 0.95]]) + punch(fr, 6.99, 0.14) + punch(fr, 8.52, 0.08) + punch(fr, 5.22, 0.05),
          y: kf(fr, [[7.6, 0], [8.3, -110]]) + shakeXY(fr, 6.99, 22, 10).y,
          x: shakeXY(fr, 6.99, 22, 10).x,
          r: interpolate(fr, [F(3.45), F(9.3)], [1.2, -1.2], cl),
        })}
      >
        <div style={{ position: "absolute", inset: 0, transform: o1.transform, opacity: o1.opacity, filter: o1.blur > 0.3 ? `blur(${o1.blur}px)` : undefined }}>
          <Center y={760} style={{ fontSize: 80, color: C.muted }}>
            <Type text="então," at={3.75} dur={0.3} style={L} />
          </Center>
          <Center y={860} style={{ fontSize: 110 }}>
            <Type text="chegou a hora:" at={4.08} dur={0.55} style={Bd} />
          </Center>
        </div>
        <Track
          y={800}
          size={170}
          color={C.navy}
          items={[
            { t: "as", at: 5.04, w: 300 },
            { t: "matrículas", at: 5.22, w: 700 },
            { t: "da", at: 5.79, w: 300 },
            { img: logo, imgW: 820, at: 6.15 },
            { t: "estão", at: 6.7, w: 300 },
            { t: "abertas!", at: 6.99, w: 800, color: C.blue, size: 230 },
          ]}
        />
        <Center y={1150} style={{ fontSize: 60, color: C.muted }}>
          <Type text="e começar é muito" at={7.89} dur={0.55} style={L} />
        </Center>
        <Center y={1240}>
          <Slam at={8.52} dir="up" style={{ ...XB, fontSize: 150, color: C.navy, lineHeight: 1 }}>simples</Slam>
        </Center>
      </Cam>
      <Flash at={6.99} max={0.35} />
    </Bg>
  );
};

/* ═════════════ CENA 3 — como funciona ═════════════ */
const Glass: React.FC<{ icon: React.ReactNode; label: string; value: string; seed: number }> = ({ icon, label, value, seed }) => {
  const f = useCurrentFrame();
  const fl = float(f, seed);
  return (
    <div
      style={{
        width: 820,
        padding: "40px 48px",
        display: "flex",
        alignItems: "center",
        gap: 38,
        borderRadius: 46,
        textAlign: "left",
        background: "linear-gradient(160deg,rgba(255,255,255,.36),rgba(255,255,255,.1))",
        border: "2px solid rgba(255,255,255,.45)",
        boxShadow: "0 30px 80px rgba(2,20,51,.3), inset 0 2px 0 rgba(255,255,255,.45)",
        transform: `perspective(1400px) rotateX(${fl.rx}deg) rotateY(${fl.ry}deg) translateY(${fl.y}px)`,
      }}
    >
      <div style={{ width: 124, height: 124, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", flex: "none" }}>{icon}</div>
      <div>
        <div style={{ ...L, fontSize: 38, opacity: 0.85 }}>{label}</div>
        <div style={{ ...Bd, fontSize: 66, lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => (
  <Bg kind="blue">
    <Cam
      fn={(fr) => ({
        s: kf(fr, [[9.3, 1.25], [10.7, 1.3], [11.2, 1.28], [14.9, 1.28], [15.35, 0.95]]) + punch(fr, 10.17, 0.1) + punch(fr, 11.37, 0.05) + punch(fr, 12.99, 0.05) + punch(fr, 14.4, 0.05),
        y: kf(fr, [[9.3, 830], [10.7, 800], [11.2, 260], [12.8, 260], [13.05, 0], [14.2, 0], [14.45, -260], [14.9, -260], [15.35, 0]]),
        x: kf(fr, [[11.2, 60], [12.6, -20], [13.05, -60], [14.2, 20], [14.45, 0]]),
        r: Math.sin(fr / 30) * 1.2,
      })}
    >
      <Center y={250} style={{ fontSize: 90 }}>
        <Type text="funciona" at={9.72} dur={0.4} style={L} />
      </Center>
      <Center y={380}>
        <Slam at={10.17} dir="up" style={{ ...XB, fontSize: 170, lineHeight: 1 }}>
          assim<span style={{ color: C.sky }}>:</span>
        </Slam>
      </Center>
      <Center y={680}>
        <Slam at={11.37} dir="right" dist={500}>
          <Glass seed={0} icon={<Ic.Monitor color={C.blue} />} label="aulas" value="100% online" />
        </Slam>
      </Center>
      <Center y={900}>
        <Slam at={12.99} dir="left" dist={500}>
          <Glass seed={2} icon={<Ic.Calendar color={C.blue} />} label="frequência" value="1x por semana" />
        </Slam>
      </Center>
      <Center y={1120}>
        <Slam at={14.4} dir="up" dist={700}>
          <Glass seed={4} icon={<Ic.Clock color={C.blue} />} label="duração" value="1 hora de aula" />
        </Slam>
      </Center>
    </Cam>
  </Bg>
);

/* ═════════════ CENA 4 — gramática, conversação, 3 pilares ═════════════ */
const Pillar: React.FC<{ icon: React.ReactNode; en: string; pt: string; seed: number }> = ({ icon, en, pt, seed }) => {
  const f = useCurrentFrame();
  const fl = float(f, seed, 6);
  return (
    <div style={{ width: 860, background: "#fff", borderRadius: 42, padding: "34px 40px", display: "flex", alignItems: "center", gap: 36, boxShadow: "0 24px 50px rgba(2,20,51,.25)", transform: `perspective(1400px) rotateX(${fl.rx}deg) rotateY(${fl.ry}deg)` }}>
      <div style={{ width: 132, height: 132, flex: "none", borderRadius: "30%", background: C.blue, display: "grid", placeItems: "center" }}>{icon}</div>
      <div style={{ color: C.navy, textAlign: "left" }}>
        <div style={{ ...Bd, fontSize: 76, lineHeight: 1 }}>{en}</div>
        <div style={{ ...L, fontSize: 40, color: "#5A6B8A", marginTop: 6 }}>{pt}</div>
      </div>
    </div>
  );
};

export const Scene4: React.FC = () => (
  <Bg kind="blue">
    <Cam
      fn={(fr) => ({
        s: kf(fr, [[15.6, 1.2], [18.3, 1.15], [18.8, 1.0], [20.3, 1.0], [20.55, 1.1], [22.4, 1.1], [22.8, 1.0]]) + punch(fr, 17.04, 0.08) + punch(fr, 17.7, 0.08) + punch(fr, 20.59, 0.05) + punch(fr, 21.29, 0.05) + punch(fr, 22.1, 0.05),
        y: kf(fr, [[15.6, 760], [16.9, 740], [17.6, 600], [18.3, 520], [18.8, 220], [20.3, 220], [20.55, 0], [21.05, 0], [21.3, -240], [21.85, -240], [22.1, -480], [22.4, -480], [22.8, -100]]),
        x: kf(fr, [[20.3, 0], [20.55, 20], [21.05, 10], [21.3, -20], [21.85, -10], [22.1, 20], [22.8, 0]]),
        r: Math.sin(fr / 26) * 1.4,
      })}
    >
      <Center y={210} style={{ fontSize: 76 }}>
        <Type text="aulas de" at={15.93} dur={0.5} style={L} />
      </Center>
      <Center y={300}>
        <Slam at={17.04} dir="up" style={{ ...XB, fontSize: 150, lineHeight: 1 }}>gramática</Slam>
      </Center>
      <Center y={470} style={{ alignItems: "center" }}>
        <Type text="e" at={17.67} dur={0.05} style={{ ...L, fontSize: 100 }} />
        <Slam at={17.7} dir="right" inline style={{ ...XB, fontSize: 130, color: C.sky, lineHeight: 1 }}>conversação</Slam>
      </Center>
      <Center y={700} style={{ fontSize: 50 }}>
        <Type text="praticando os" at={18.57} dur={0.55} style={L} />
        <Slam at={19.17} dir="zoom" inline style={Bd}>3 pilares</Slam>
        <Type text="do idioma" at={19.83} dur={0.3} style={L} />
      </Center>
      <Center y={850}>
        <Slam at={20.59} dir="left" dist={600}>
          <Pillar seed={1} icon={<Ic.Headphones />} en="listening" pt="ouvir" />
        </Slam>
      </Center>
      <Center y={1120}>
        <Slam at={21.29} dir="right" dist={600}>
          <Pillar seed={3} icon={<Ic.Mic />} en="speaking" pt="falar" />
        </Slam>
      </Center>
      <Center y={1390}>
        <Slam at={22.1} dir="left" dist={600}>
          <Pillar seed={5} icon={<Ic.Pen />} en="writing" pt="escrever" />
        </Slam>
      </Center>
    </Cam>
  </Bg>
);

/* ═════════════ CENA 5 — e tem mais / módulos complementares ═════════════ */
export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const thru = kf(f, [[24.0, 1], [24.28, 9]]);
  const thruO = interpolate(f, [F(24.12), F(24.28)], [1, 0], cl);
  const sh = shakeXY(f, 23.61, 20, 9);
  return (
    <Bg kind="light">
      {f < F(24.3) && (
        <div style={{ position: "absolute", inset: 0, transform: `translate(${sh.x}px,${sh.y}px) scale(${thru + punch(f, 23.61, 0.12)})`, transformOrigin: "540px 1020px", opacity: thruO, filter: thru > 1.2 ? `blur(${(thru - 1) * 3}px)` : undefined }}>
          <Center y={780} style={{ fontSize: 120 }}>
            <Type text="e tem" at={23.2} dur={0.35} style={L} />
          </Center>
          <Center y={900}>
            <Slam at={23.61} dir="zoom" style={{ ...XB, fontSize: 280, color: C.blue, lineHeight: 1 }}>mais</Slam>
          </Center>
        </div>
      )}
      {f >= F(24.12) && (
        <Cam
          fn={(fr) => ({
            s: kf(fr, [[24.12, 1.6], [24.5, 1.3], [26.8, 1.3], [27.05, 1.2], [28.3, 1.2], [28.8, 0.95]]) + punch(fr, 25.77, 0.07) + punch(fr, 27.12, 0.05) + punch(fr, 27.84, 0.05),
            y: kf(fr, [[24.12, 700], [25.0, 700], [25.6, 560], [26.8, 520], [27.05, -170], [28.3, -170], [28.8, 40]]),
            x: kf(fr, [[26.8, 0], [27.05, 300], [27.6, 300], [27.85, -300], [28.3, -300], [28.8, 0]]),
            r: Math.sin(fr / 24) * 1.2,
          })}
        >
          <Center y={300}>
            <Slam at={24.27} dir="down" dist={200}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 18, borderRadius: 999, background: C.navy, color: "#fff", fontSize: 46, padding: "22px 50px", fontWeight: 600, boxShadow: "0 16px 40px rgba(4,32,76,.25)" }}>
                <Ic.Calendar size={48} color={C.blueL} />
                todo mês
              </div>
            </Slam>
          </Center>
          <Center y={440} style={{ fontSize: 86 }}>
            <Type text="módulos" at={25.26} dur={0.45} style={L} />
          </Center>
          <Center y={540}>
            <Slam at={25.77} dir="up" style={{ ...XB, fontSize: 124, color: C.blue, lineHeight: 1 }}>complementares</Slam>
          </Center>
          {[
            { at: 27.12, x: 290, icon: <Ic.Shadow />, a: "prática de", b: "shadowing", navy: false, dir: "left" as const, seed: 1 },
            { at: 27.84, x: 790, icon: <Ic.Music />, a: "inglês com", b: "músicas", navy: true, dir: "right" as const, seed: 4 },
          ].map((it) => {
            const fl = float(f, it.seed, 9);
            return (
              <div key={it.b} style={{ position: "absolute", left: it.x - 210, top: 900, width: 420 }}>
                <Slam at={it.at} dir={it.dir} dist={400}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36, transform: `perspective(1200px) rotateY(${fl.ry}deg) rotateX(${fl.rx}deg) translateY(${fl.y}px)` }}>
                    <div style={{ width: 280, height: 280, borderRadius: "30%", display: "grid", placeItems: "center", background: it.navy ? C.navy : C.blue, boxShadow: it.navy ? "0 18px 40px rgba(4,32,76,.25)" : "0 18px 40px rgba(5,128,248,.3)" }}>{it.icon}</div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ ...L, fontSize: 44 }}>{it.a}</div>
                      <div style={{ ...Bd, fontSize: 70, lineHeight: 1 }}>{it.b}</div>
                    </div>
                  </div>
                </Slam>
              </div>
            );
          })}
        </Cam>
      )}
    </Bg>
  );
};

/* ═════════════ CENA 6 — preço ═════════════ */
export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const hit = 33.51;
  const cnt = (fr: number) => interpolate(fr, [F(31.95), F(hit)], [0, 6990], { ...cl, easing: Easing.out(Easing.quad) });
  const count = cnt(f);
  const speed = Math.abs(cnt(f) - cnt(f - 1));
  const reais = Math.floor(count / 100);
  const cents = Math.floor(count % 100);
  const ap = interpolate(f, [F(31.05), F(31.9)], [0, 0.14], cl);
  const tilt = kf(f, [[31.4, 28], [hit, 0]]);
  const cardRy = f > F(hit) ? Math.sin((f - F(hit)) / 20) * 5 : kf(f, [[31.4, -18], [hit, 0]]);
  return (
    <Bg kind="blue">
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[29.55, 1.35], [30.9, 1.4], [31.35, 1.0], [hit - 0.05, 1.14], [hit + 0.6, 1.02]]) + punch(fr, hit, 0.2) + (fr > F(hit) ? Math.sin((fr - F(hit)) / 9) * 0.012 : 0),
          y: kf(fr, [[29.55, 500], [30.9, 470], [31.35, 0], [hit, -110], [hit + 0.6, -40]]) + shakeXY(fr, hit, 22, 10).y,
          x: shakeXY(fr, hit, 22, 10).x,
          r: kf(fr, [[31.35, -2], [hit, 1]]),
        })}
      >
        <Center y={560} style={{ fontSize: 76 }}>
          <Type text="e tudo isso por" at={29.88} dur={0.9} style={L} />
        </Center>
        <Center y={660} style={{ fontSize: 120 }}>
          <Type text="apenas…" at={31.05} dur={0.75} style={{ ...Bd, letterSpacing: `${ap}em` }} />
        </Center>
        <Center y={880}>
          <Slam at={31.4} dir="up" dist={700}>
            <div style={{ transform: `perspective(1400px) rotateX(${tilt}deg) rotateY(${cardRy}deg)` }}>
              <div style={{ width: 880, padding: "74px 60px 60px", textAlign: "center", position: "relative", borderRadius: 46, background: "linear-gradient(160deg,rgba(255,255,255,.38),rgba(255,255,255,.1))", border: "2px solid rgba(255,255,255,.45)", boxShadow: "0 30px 80px rgba(2,20,51,.3), inset 0 2px 0 rgba(255,255,255,.45)" }}>
                <div style={{ position: "absolute", top: -34, right: 60, background: "#fff", color: C.blue, fontWeight: 700, fontSize: 34, padding: "12px 30px", borderRadius: 999, boxShadow: "0 10px 30px rgba(2,20,51,.3)" }}>mensalidade</div>
                <MBlur y={Math.min(26, speed * 0.25)} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", fontWeight: 800, lineHeight: 0.9, fontVariantNumeric: "tabular-nums" }}>
                  <span style={{ fontSize: 100, marginTop: 64, marginRight: 18, opacity: 0.9 }}>R$</span>
                  <span style={{ fontSize: 310, letterSpacing: "-0.06em" }}>{String(reais).padStart(2, "0")}</span>
                  <span style={{ fontSize: 134, marginTop: 34, color: C.sky }}>,{String(cents).padStart(2, "0")}</span>
                </MBlur>
                <div style={{ height: 4, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)", margin: "40px 40px 30px" }} />
                <div style={{ fontSize: 60 }}>
                  <Type text="por " at={33.84} dur={0.1} style={L} />
                  <Slam at={33.96} dir="up" inline dist={80} style={Bd}>mês</Slam>
                </div>
              </div>
            </div>
          </Slam>
        </Center>
      </Cam>
      <Flash at={hit} max={0.6} />
    </Bg>
  );
};

/* ═════════════ CENA 7 — horários ═════════════ */
type Slot = { id: string; label: string; flex?: number };
const rows: { name: string; icon: React.ReactNode; slots: Slot[]; fs: number }[] = [
  { name: "manhã", icon: <Ic.Sunrise />, fs: 38, slots: [{ id: "m1", label: "08h às 09h" }, { id: "m2", label: "09h30 às 10h30" }] },
  { name: "tarde", icon: <Ic.Sun />, fs: 31, slots: [{ id: "t1", label: "13h às 14h" }, { id: "t2", label: "14h30 às 15h30", flex: 1.3 }, { id: "t3", label: "16h às 17h" }] },
  { name: "noite", icon: <Ic.Moon />, fs: 38, slots: [{ id: "n1", label: "19h às 20h" }, { id: "n2", label: "20h30 às 21h30" }] },
];
const clicks = [
  { at: 36.72, id: "m1", x: 228, y: 152 },
  { at: 37.44, id: "t2", x: 422, y: 356 },
  { at: 38.28, id: "n1", x: 214, y: 562 },
];
const PX = 90;
const PY = 760;

export const Scene7: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const active = [...clicks].reverse().find((c) => t >= c.at)?.id;
  const pts = [{ at: 35.7, x: 680, y: 700 }, ...clicks];
  let cx = pts[0].x;
  let cy = pts[0].y;
  for (let i = 1; i < pts.length; i++) {
    const p = kf(f, [[pts[i].at - 0.4, 0], [pts[i].at - 0.04, 1]]);
    if (p > 0) {
      cx = interpolate(p, [0, 1], [pts[i - 1].x, pts[i].x]);
      cy = interpolate(p, [0, 1], [pts[i - 1].y, pts[i].y]);
    }
  }
  const press = clicks.some((c) => t >= c.at && t < c.at + 0.12) ? 0.82 : 1;
  const fl = float(f, 2, 5);
  const focus = (x: number, y: number, s: number) => ({ x: (540 - (PX + x + 30)) * s, y: (960 - (PY + y + 30)) * s });
  const m1 = focus(clicks[0].x, clicks[0].y, 1.5);
  const t2 = focus(clicks[1].x, clicks[1].y, 1.5);
  const n1 = focus(clicks[2].x, clicks[2].y, 1.5);
  return (
    <Bg kind="light">
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[34.55, 1.3], [35.5, 1.3], [35.9, 1.0], [36.25, 1.0], [36.5, 1.5], [38.45, 1.5], [38.8, 1.12], [40.9, 1.18]]) + punch(fr, 36.03, 0.08) + punch(fr, 39.42, 0.1),
          x: kf(fr, [[36.25, 0], [36.5, m1.x], [37.05, m1.x], [37.35, t2.x], [37.9, t2.x], [38.2, n1.x], [38.45, n1.x], [38.8, 0]]),
          y: kf(fr, [[34.55, 760], [35.5, 700], [35.9, 0], [36.25, 0], [36.5, m1.y], [37.05, m1.y], [37.35, t2.y], [37.9, t2.y], [38.2, n1.y], [38.45, n1.y], [38.8, 500], [40.9, 520]]),
          r: Math.sin(fr / 27) * 1.2,
        })}
      >
        <Center y={250} style={{ fontSize: 70 }}>
          <Type text="quem escolhe o horário" at={34.95} dur={0.95} style={L} />
        </Center>
        <Center y={350}>
          <Slam at={36.03} dir="zoom" style={{ ...XB, fontSize: 150, color: C.blue, lineHeight: 1 }}>é você</Slam>
        </Center>
        <Center y={540} style={{ fontSize: 60, alignItems: "center" }}>
          <Type text="e ele fica" at={38.91} dur={0.45} style={{ ...L, color: C.muted }} />
          <Slam at={39.42} dir="zoom" inline style={{ ...XB, color: "#fff", background: C.navy, padding: "4px 26px", borderRadius: 16 }}>fixo</Slam>
        </Center>
        <Center y={640} style={{ fontSize: 60 }}>
          <Type text="toda semana" at={39.96} dur={0.5} style={Bd} />
        </Center>
        <div style={{ position: "absolute", left: PX, top: PY, width: 900 }}>
          <Slam at={35.2} dir="up" dist={900}>
            <div style={{ position: "relative", padding: "46px 44px", transform: `perspective(1800px) rotateX(${10 + fl.rx}deg) rotateY(${-12 + fl.ry}deg) rotateZ(2deg)`, display: "flex", flexDirection: "column", gap: 34, fontWeight: 600, borderRadius: 44, background: "linear-gradient(160deg,rgba(255,255,255,.98),rgba(255,255,255,.85))", border: "2px solid #fff", boxShadow: "0 30px 70px rgba(4,32,76,.16)" }}>
              {rows.map((r) => (
                <div key={r.name}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700, marginBottom: 18 }}>
                    <span style={{ width: 58, height: 58, borderRadius: "50%", background: r.name === "noite" ? C.navy : C.blue, display: "grid", placeItems: "center" }}>{r.icon}</span>
                    {r.name}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {r.slots.map((s) => {
                      const on = active === s.id;
                      const c = clicks.find((k) => k.id === s.id);
                      const pop = c && t >= c.at ? interpolate(spring({ frame: f - F(c.at), fps: FPS, config: { damping: 9 } }), [0, 1], [1.15, 1]) : 1;
                      return (
                        <span key={s.id} style={{ flex: s.flex ?? 1, display: "flex", justifyContent: "center", borderRadius: 999, fontSize: r.fs, padding: "22px 6px", background: on ? C.blue : "#EEF2F7", color: on ? "#fff" : C.navy, transform: `scale(${on ? pop : 1})`, boxShadow: on ? "0 0 0 10px rgba(5,128,248,.15),0 14px 30px rgba(5,128,248,.35)" : "none" }}>
                          {s.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div style={{ position: "absolute", left: cx, top: cy, transform: `scale(${press})`, opacity: interpolate(f, [F(35.7), F(35.85)], [0, 1], cl) }}>
                <Ic.Cursor />
              </div>
            </div>
          </Slam>
        </div>
      </Cam>
    </Bg>
  );
};

/* ═════════════ CENA 8 — fechamento ═════════════ */
export const Scene8: React.FC = () => {
  const f = useCurrentFrame();
  const lift = kf(f, [[43.95, 0], [44.25, 1]]);
  const cursorP = kf(f, [[45.55, 0], [46.05, 1]]);
  const press = f >= F(46.1) && f < F(46.1) + 4 ? 0.85 : 1;
  const ripple = interpolate(f, [F(46.1), F(46.1) + 18], [0, 1], cl);
  const pulse = f > F(45.6) ? 1 + Math.sin((f - F(45.6)) / 5) * 0.04 : 1;
  return (
    <Bg kind="light">
      <Cam
        fn={(fr) => ({
          s: kf(fr, [[40.9, 1.05], [43.9, 1.05], [44.3, 1.0], [47.5, 1.0], [50, 1.06]]) + punch(fr, 42.78, 0.1) + punch(fr, 44.1, 0.08) + punch(fr, 46.1, 0.04),
          r: Math.sin(fr / 30) * 1,
          y: shakeXY(fr, 44.1, 14, 8).y,
        })}
      >
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift * -470}px) scale(${1 - lift * 0.42})`, transformOrigin: "540px 800px" }}>
          <Track
            y={700}
            size={150}
            fadePrevAt={43.4}
            color={C.navy}
            items={[
              { t: "do", at: 41.22, w: 300 },
              { t: "zero", at: 41.52, w: 700 },
              { t: "absoluto", at: 41.88, w: 700 },
              { t: "ao", at: 42.51, w: 300 },
              { t: "avançado", at: 42.78, w: 800, color: C.blue, size: 200 },
            ]}
          />
          <Center y={960} style={{ fontSize: 80, alignItems: "baseline" }}>
            <Type text="no" at={43.62} dur={0.15} style={L} />
            <Slam at={43.83} dir="up" inline dist={150} style={XB}>seu ritmo</Slam>
          </Center>
        </div>
        <div style={{ position: "absolute", top: 880, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Slam at={44.1} dir="zoom">
            <Img src={logo} style={{ width: 880 }} />
          </Slam>
        </div>
        <Center y={1250} style={{ fontSize: 52, color: C.muted }}>
          <Type text="garanta já a sua" at={45.06} dur={0.6} style={L} />
          <Slam at={45.75} dir="up" inline dist={100} style={{ ...XB, color: C.navy }}>vaga</Slam>
        </Center>
        <div style={{ position: "absolute", left: 440, top: 1390, width: 200, height: 200 }}>
          <Slam at={45.3} dir="zoom">
            <div style={{ position: "relative", width: 200, height: 200 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.blue, opacity: ripple > 0 ? 0.35 * (1 - ripple) : 0, transform: `scale(${1 + ripple * 0.9})` }} />
              <div style={{ width: 200, height: 200, borderRadius: "50%", background: C.blue, display: "grid", placeItems: "center", transform: `scale(${pulse * press})`, boxShadow: "0 20px 40px rgba(5,128,248,.35)" }}>
                <Ic.Arrow />
              </div>
            </div>
          </Slam>
          <div style={{ position: "absolute", left: interpolate(cursorP, [0, 1], [440, 130]), top: interpolate(cursorP, [0, 1], [420, 140]), opacity: interpolate(f, [F(45.5), F(45.6)], [0, 1], cl), transform: `scale(${press})` }}>
            <Ic.Cursor />
          </div>
        </div>
        <Center y={1700}>
          <Slam at={46.47} dir="up" dist={200}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 18, borderRadius: 999, background: "#fff", padding: "22px 48px", fontWeight: 600, fontSize: 50, boxShadow: "0 14px 34px rgba(4,32,76,.14)" }}>
              <Ic.Insta size={50} />@way.fluency
            </div>
          </Slam>
        </Center>
      </Cam>
      <Flash at={44.1} max={0.5} />
    </Bg>
  );
};
