import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { clamp, Pop, ramp, shake, springAt, Words } from "./anim";
import { B, bgBlue, bgLight, C, F, fontFamily } from "./theme";
import * as Ic from "./icons";

const logo = staticFile("wayfluency-logo.svg");
const logoW = staticFile("wayfluency-logo-branca.svg");

const base: React.CSSProperties = { fontFamily, letterSpacing: "-0.02em" };
const light: React.CSSProperties = { fontWeight: 300 };
const bold: React.CSSProperties = { fontWeight: 700 };

const Bg: React.FC<{ kind: "blue" | "light"; children: React.ReactNode }> = ({ kind, children }) => (
  <AbsoluteFill style={{ ...base, background: kind === "blue" ? bgBlue : bgLight, color: kind === "blue" ? "#fff" : C.navy }}>
    {children}
  </AbsoluteFill>
);

/** Camera: everything inside moves together. */
const Cam: React.FC<{ s?: number; x?: number; y?: number; r?: number; blur?: number; origin?: string; children: React.ReactNode }> = ({
  s = 1,
  x = 0,
  y = 0,
  r = 0,
  blur = 0,
  origin = "50% 50%",
  children,
}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)`,
      transformOrigin: origin,
      filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
    }}
  >
    {children}
  </AbsoluteFill>
);

const SmallLogo: React.FC<{ white?: boolean; at: number }> = ({ white, at }) => (
  <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <Pop at={at} dist={20}>
      <Img src={white ? logoW : logo} style={{ width: 320 }} />
    </Pop>
  </div>
);

/* ───────────── CENA 1 — logo ───────────── */
export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  // zoom-out from the blue drop of the "a"
  const z = interpolate(f, [F(0), F(1.15)], [9, 1], { ...clamp, easing: Easing.bezier(0.7, 0, 0.2, 1) });
  const push = interpolate(f, [F(1.15), F(3.45)], [1, 1.07], clamp);
  const blur = interpolate(f, [F(0), F(0.9), F(1.15)], [10, 6, 0], clamp);
  const op = interpolate(f, [0, 6], [0, 1], clamp);
  return (
    <Bg kind="blue">
      <div style={{ position: "absolute", width: 900, height: 500, left: 90, top: 620, background: "radial-gradient(closest-side,rgba(140,205,255,.55),transparent)", filter: "blur(30px)", opacity: interpolate(f, [F(0.8), F(1.4)], [0, 1], clamp) }} />
      <Cam s={z * push} blur={blur} origin="37.6% 50.6%">
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
          <Img src={logoW} style={{ width: 900, marginTop: -120 }} />
        </AbsoluteFill>
      </Cam>
      <div style={{ position: "absolute", top: 1080, width: "100%", textAlign: "center", fontSize: 56 }}>
        <Words
          gap={14}
          items={[
            { t: "já pensou em", at: 0.21, style: light },
            { t: "finalmente", at: 0.84, style: light },
            { t: "destravar", at: 1.98, style: { ...bold, color: C.sky } },
            { t: "o seu inglês?", at: 2.49, style: bold },
          ]}
        />
      </div>
    </Bg>
  );
};

/* ───────────── CENA 2 — matrículas abertas ───────────── */
export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const dolly = interpolate(f, [F(B[1]), F(B[2])], [1, 1.08], clamp);
  const sh = shake(f, 6.99, 16, 10);
  const preOut = interpolate(f, [F(5.0), F(5.25)], [1, 0], clamp);
  return (
    <Bg kind="light">
      <Cam s={dolly} x={sh.x} y={sh.y} r={interpolate(f, [F(B[1]), F(B[2])], [-1, 1], clamp)}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 760, opacity: preOut, fontSize: 64, color: C.muted }}>
            <Words items={[{ t: "então,", at: 3.75, style: light }, { t: "chegou a hora:", at: 4.08, style: bold }]} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -40 }}>
            <Pop at={5.22} from="punch" style={{ ...light, fontSize: 124, lineHeight: 1 }}>matrículas</Pop>
            <Pop at={6.99} from="punch" style={{ ...bold, fontSize: 214, lineHeight: 1, color: C.blue, letterSpacing: "-0.04em" }}>abertas</Pop>
            <div style={{ marginTop: 56, fontSize: 52, color: C.muted }}>
              <Words
                items={[
                  { t: "e começar é muito", at: 7.89, style: light },
                  { t: "simples", at: 8.52, style: { ...bold, color: C.navy } },
                ]}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Cam>
      <SmallLogo at={6.15} />
    </Bg>
  );
};

/* ───────────── CENA 3 — como funciona ───────────── */
const GlassCard: React.FC<{ at: number; next?: number; icon: React.ReactNode; label: string; value: string; dx: number }> = ({
  at,
  next,
  icon,
  label,
  value,
  dx,
}) => {
  const f = useCurrentFrame();
  const s = springAt(f, at);
  const dim = next ? interpolate(f, [F(next), F(next) + 8], [0, 1], clamp) : 0;
  return (
    <div
      style={{
        width: 800,
        padding: "38px 46px",
        display: "flex",
        alignItems: "center",
        gap: 36,
        borderRadius: 44,
        background: "linear-gradient(160deg,rgba(255,255,255,.34),rgba(255,255,255,.1))",
        border: "2px solid rgba(255,255,255,.4)",
        boxShadow: "0 30px 80px rgba(2,20,51,.3), inset 0 2px 0 rgba(255,255,255,.4)",
        opacity: interpolate(f, [F(at), F(at) + 5], [0, 1], clamp) * (1 - dim * 0.35),
        transform: `translate(${dx}px,${(1 - s) * 220}px) scale(${interpolate(s, [0, 1], [0.85, 1]) * (1 + (1 - dim) * 0.04 * s)})`,
        filter: `blur(${(1 - s) * 16 + dim * 2.5}px)`,
      }}
    >
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", flex: "none" }}>{icon}</div>
      <div>
        <div style={{ ...light, fontSize: 36, opacity: 0.85 }}>{label}</div>
        <div style={{ ...bold, fontSize: 62, lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  // camera tilts down as each card is spoken
  const y = interpolate(f, [F(9.3), F(10.86), F(12.99), F(14.4), F(15.6)], [120, 60, 0, -60, -90], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Bg kind="blue">
      <Cam y={y} s={interpolate(f, [F(9.3), F(15.6)], [1.02, 1.07], clamp)}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 46 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Pop at={9.72} style={{ ...light, fontSize: 72, lineHeight: 1.05 }}>funciona</Pop>
            <Pop at={10.17} from="punch" style={{ ...bold, fontSize: 132, lineHeight: 1 }}>assim<span style={{ color: C.sky }}>:</span></Pop>
          </div>
          <GlassCard at={11.37} next={12.99} dx={-30} icon={<Ic.Monitor color={C.blue} />} label="aulas" value="100% online" />
          <GlassCard at={12.99} next={14.4} dx={30} icon={<Ic.Calendar color={C.blue} />} label="frequência" value="1x por semana" />
          <GlassCard at={14.4} dx={-10} icon={<Ic.Clock color={C.blue} />} label="duração" value="1 hora de aula" />
        </AbsoluteFill>
      </Cam>
      <SmallLogo white at={9.4} />
    </Bg>
  );
};

/* ───────────── CENA 4 — gramática, conversação, 3 pilares ───────────── */
const Pillar: React.FC<{ at: number; icon: React.ReactNode; en: string; pt: string; dx: number; from: "left" | "right" }> = ({ at, icon, en, pt, dx, from }) => (
  <Pop at={at} from={from} dist={140}>
    <div style={{ transform: `translateX(${dx}px)`, background: "#fff", borderRadius: 40, padding: "34px 40px", display: "flex", alignItems: "center", gap: 36, boxShadow: "0 24px 50px rgba(2,20,51,.25)" }}>
      <div style={{ width: 130, height: 130, flex: "none", borderRadius: "30%", background: C.blue, display: "grid", placeItems: "center" }}>{icon}</div>
      <div style={{ color: C.navy }}>
        <div style={{ ...bold, fontSize: 72, lineHeight: 1 }}>{en}</div>
        <div style={{ ...light, fontSize: 38, color: "#5A6B8A", marginTop: 6 }}>{pt}</div>
      </div>
    </div>
  </Pop>
);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [F(15.6), F(22.9)], [-26, 26], clamp);
  const s = interpolate(f, [F(15.6), F(22.9)], [1, 1.06], clamp);
  return (
    <Bg kind="blue">
      <Cam x={x} s={s}>
        <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center" }}>
          <Pop at={15.93} style={{ ...light, fontSize: 66 }}>aulas de</Pop>
          <div style={{ ...bold, fontSize: 104, lineHeight: 1.05 }}>
            <Pop at={17.04} from="zoom" inline>gramática</Pop>{" "}
            <Pop at={17.67} inline style={{ ...light, fontSize: 80 }}>e</Pop>
            <br />
            <Pop at={17.7} from="zoom" inline>conversação</Pop>
          </div>
        </div>
        <div style={{ position: "absolute", left: 110, right: 110, top: 760, display: "flex", flexDirection: "column", gap: 34 }}>
          <div style={{ fontSize: 42, textAlign: "center", marginBottom: 10 }}>
            <Words
              gap={12}
              items={[
                { t: "praticando os", at: 18.57, style: light },
                { t: "3 pilares", at: 19.17, style: bold },
                { t: "do idioma", at: 19.83, style: light },
              ]}
            />
          </div>
          <Pillar at={20.59} from="left" dx={-24} icon={<Ic.Headphones />} en="listening" pt="ouvir" />
          <Pillar at={21.29} from="right" dx={24} icon={<Ic.Mic />} en="speaking" pt="falar" />
          <Pillar at={22.1} from="left" dx={-12} icon={<Ic.Pen />} en="writing" pt="escrever" />
        </div>
      </Cam>
      <SmallLogo white at={15.7} />
    </Bg>
  );
};

/* ───────────── CENA 5 — módulos complementares ───────────── */
export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const y = interpolate(f, [F(22.9), F(25.2), F(27.1), F(29.55)], [260, 230, 0, -40], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const teaseOut = interpolate(f, [F(24.05), F(24.35)], [1, 0], clamp);
  const teaseUp = interpolate(f, [F(24.05), F(24.35)], [0, -120], clamp);
  return (
    <Bg kind="light">
      {/* "e tem mais:" teaser */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: teaseOut, transform: `translateY(${teaseUp}px)` }}>
        <div style={{ fontSize: 120, display: "flex", gap: 30, alignItems: "baseline" }}>
          <Pop at={23.2} inline style={light}>e tem</Pop>
          <Pop at={23.61} from="punch" inline style={{ ...bold, color: C.blue, fontSize: 170 }}>mais</Pop>
        </div>
      </AbsoluteFill>
      <Cam y={y}>
        <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center" }}>
          <Pop at={24.27} from="zoom">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 18, borderRadius: 999, background: C.navy, color: "#fff", fontSize: 42, padding: "20px 46px", fontWeight: 600, boxShadow: "0 16px 40px rgba(4,32,76,.25)" }}>
              <Ic.Calendar size={44} color={C.blueL} />
              todo mês
            </div>
          </Pop>
          <Pop at={25.26} style={{ ...light, fontSize: 70, lineHeight: 1.05, marginTop: 40 }}>módulos</Pop>
          <Pop at={25.77} from="zoom" style={{ ...bold, fontSize: 116, lineHeight: 1, color: C.blue }}>complementares</Pop>
        </div>
        {/* parallax: icons move a bit faster than text */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, transform: `translateY(${y * 0.35}px)`, display: "flex", justifyContent: "center", gap: 120 }}>
          {[
            { at: 27.12, icon: <Ic.Shadow />, a: "prática do", b: "shadowing", navy: false },
            { at: 27.84, icon: <Ic.Music />, a: "inglês com", b: "músicas", navy: true },
          ].map((it) => (
            <Pop key={it.b} at={it.at} from="zoom">
              <div style={{ width: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
                <div style={{ width: 260, height: 260, borderRadius: "30%", display: "grid", placeItems: "center", background: it.navy ? C.navy : C.blue, boxShadow: it.navy ? "0 18px 40px rgba(4,32,76,.22)" : "0 18px 40px rgba(5,128,248,.25)" }}>{it.icon}</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...light, fontSize: 42 }}>{it.a}</div>
                  <div style={{ ...bold, fontSize: 64, lineHeight: 1 }}>{it.b}</div>
                </div>
              </div>
            </Pop>
          ))}
        </div>
      </Cam>
      <SmallLogo at={23.0} />
    </Bg>
  );
};

/* ───────────── CENA 6 — preço ───────────── */
export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const hit = 33.51;
  const count = interpolate(f, [F(31.95), F(hit)], [0, 6990], { ...clamp, easing: Easing.out(Easing.cubic) });
  const reais = Math.floor(count / 100);
  const cents = Math.floor(count % 100);
  const punch = interpolate(springAt(f, hit, { damping: 9, stiffness: 180 }), [0, 1], [1.18, 1]);
  const breathe = f > F(hit) ? 1 + Math.sin((f - F(hit)) / 9) * 0.012 : 1;
  const sh = shake(f, hit, 18, 9);
  const flash = interpolate(f, [F(hit), F(hit) + 2, F(hit) + 7], [0, 0.55, 0], clamp);
  const pre = f < F(hit) ? 1 : punch;
  const ap = interpolate(f, [F(31.05), F(31.9)], [0, 0.12], clamp); // "apenas" letter-spacing stretch
  return (
    <Bg kind="blue">
      <Cam s={pre * breathe * interpolate(f, [F(29.55), F(hit)], [1.06, 1], clamp)} x={sh.x} y={sh.y}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 66, marginBottom: 46, display: "flex", gap: 18, alignItems: "baseline" }}>
            <Pop at={29.88} inline style={light}>e tudo isso por</Pop>
            <Pop at={31.05} inline style={{ ...bold, letterSpacing: `${ap}em` }}>apenas…</Pop>
          </div>
          <Pop at={31.05} from="zoom">
            <div style={{ width: 860, padding: "70px 60px 60px", textAlign: "center", position: "relative", borderRadius: 44, background: "linear-gradient(160deg,rgba(255,255,255,.34),rgba(255,255,255,.1))", border: "2px solid rgba(255,255,255,.4)", boxShadow: "0 30px 80px rgba(2,20,51,.3), inset 0 2px 0 rgba(255,255,255,.4)" }}>
              <div style={{ position: "absolute", top: -34, right: 60, background: "#fff", color: C.blue, fontWeight: 700, fontSize: 34, padding: "12px 30px", borderRadius: 999, boxShadow: "0 10px 30px rgba(2,20,51,.3)" }}>mensalidade</div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", fontWeight: 700, lineHeight: 0.9, fontVariantNumeric: "tabular-nums" }}>
                <span style={{ fontSize: 96, marginTop: 62, marginRight: 18, opacity: 0.9 }}>R$</span>
                <span style={{ fontSize: 300, letterSpacing: "-0.06em" }}>{String(reais).padStart(2, "0")}</span>
                <span style={{ fontSize: 130, marginTop: 34, color: C.sky }}>,{String(cents).padStart(2, "0")}</span>
              </div>
              <div style={{ height: 4, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)", margin: "40px 40px 30px" }} />
              <Pop at={33.84} style={{ fontSize: 56 }}>
                <span style={light}>por </span>
                <span style={bold}>mês</span>
              </Pop>
            </div>
          </Pop>
        </AbsoluteFill>
      </Cam>
      <SmallLogo white at={29.7} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </Bg>
  );
};

/* ───────────── CENA 7 — horários ───────────── */
type Slot = { id: string; label: string; flex?: number };
const rows: { name: string; icon: React.ReactNode; slots: Slot[]; fs: number }[] = [
  { name: "manhã", icon: <Ic.Sunrise />, fs: 38, slots: [{ id: "m1", label: "08h às 09h" }, { id: "m2", label: "09h30 às 10h30" }] },
  { name: "tarde", icon: <Ic.Sun />, fs: 31, slots: [{ id: "t1", label: "13h às 14h" }, { id: "t2", label: "14h30 às 15h30", flex: 1.3 }, { id: "t3", label: "16h às 17h" }] },
  { name: "noite", icon: <Ic.Moon />, fs: 38, slots: [{ id: "n1", label: "19h às 20h" }, { id: "n2", label: "20h30 às 21h30" }] },
];
// cursor clicks synced to "manhã", "tarde", "noite"
const clicks = [
  { at: 36.72, id: "m1", x: 228, y: 152 },
  { at: 37.44, id: "t2", x: 422, y: 356 },
  { at: 38.28, id: "n1", x: 214, y: 562 },
];

export const Scene7: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const active = [...clicks].reverse().find((c) => t >= c.at)?.id;
  const rotY = interpolate(f, [F(34.55), F(40.9)], [-24, -10], clamp);
  const rotX = interpolate(f, [F(34.55), F(40.9)], [18, 10], clamp);
  // cursor path
  const pts = [{ at: 35.6, x: 680, y: 700 }, ...clicks];
  let cx = pts[0].x;
  let cy = pts[0].y;
  for (let i = 1; i < pts.length; i++) {
    const p = ramp(f, pts[i].at - 0.45, pts[i].at - 0.05, Easing.inOut(Easing.cubic));
    if (p > 0) {
      cx = interpolate(p, [0, 1], [pts[i - 1].x, pts[i].x]);
      cy = interpolate(p, [0, 1], [pts[i - 1].y, pts[i].y]);
    }
  }
  const press = clicks.some((c) => t >= c.at && t < c.at + 0.12) ? 0.85 : 1;
  const fixoPulse = interpolate(springAt(f, 39.42, { damping: 8 }), [0, 1], [1.25, 1]);
  return (
    <Bg kind="light">
      <Cam s={interpolate(f, [F(34.55), F(40.9)], [1.04, 1], clamp)}>
        <div style={{ position: "absolute", top: 180, width: "100%", textAlign: "center" }}>
          <Pop at={34.95} style={{ ...light, fontSize: 64, lineHeight: 1.1 }}>quem escolhe o horário</Pop>
          <Pop at={36.03} from="punch" style={{ ...bold, fontSize: 120, lineHeight: 1, color: C.blue }}>é você</Pop>
          <div style={{ marginTop: 26, fontSize: 40, color: C.muted }}>
            <Words
              gap={12}
              items={[
                { t: "e ele fica", at: 38.91, style: light },
                { t: "fixo", at: 39.42, style: { ...bold, color: "#fff", background: C.navy, padding: "0 18px", borderRadius: 12, transform: `scale(${f > F(39.42) ? fixoPulse : 1})` } },
                { t: "toda semana", at: 39.96, style: light },
              ]}
            />
          </div>
        </div>
        <div style={{ position: "absolute", left: 90, top: 640, width: 900, perspective: 1800 }}>
          <Pop at={35.2} from="up" dist={120}>
            <div style={{ position: "relative", padding: "46px 44px", transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(2deg)`, display: "flex", flexDirection: "column", gap: 34, fontWeight: 600, borderRadius: 44, background: "linear-gradient(160deg,rgba(255,255,255,.97),rgba(255,255,255,.8))", border: "2px solid #fff", boxShadow: "0 30px 70px rgba(4,32,76,.16)" }}>
              {rows.map((r) => (
                <div key={r.name}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700, marginBottom: 18 }}>
                    <span style={{ width: 58, height: 58, borderRadius: "50%", background: r.name === "noite" ? C.navy : C.blue, display: "grid", placeItems: "center" }}>{r.icon}</span>
                    {r.name}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {r.slots.map((s) => {
                      const on = active === s.id;
                      return (
                        <span key={s.id} style={{ flex: s.flex ?? 1, display: "flex", justifyContent: "center", borderRadius: 999, fontSize: r.fs, padding: "22px 6px", background: on ? C.blue : "#EEF2F7", color: on ? "#fff" : C.navy, boxShadow: on ? "0 0 0 10px rgba(5,128,248,.15),0 14px 30px rgba(5,128,248,.35)" : "none" }}>
                          {s.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div style={{ position: "absolute", left: cx, top: cy, transform: `scale(${press})`, opacity: interpolate(f, [F(35.6), F(35.8)], [0, 1], clamp) }}>
                <Ic.Cursor />
              </div>
            </div>
          </Pop>
        </div>
      </Cam>
      <SmallLogo at={34.7} />
    </Bg>
  );
};

/* ───────────── CENA 8 — fechamento ───────────── */
export const Scene8: React.FC = () => {
  const f = useCurrentFrame();
  const pull = interpolate(f, [F(40.9), F(43.6), F(45.2)], [1.35, 1.3, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const pullY = interpolate(f, [F(40.9), F(43.6), F(45.2)], [260, 240, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const av = springAt(f, 42.78, { damping: 11 });
  const avColor = interpolate(f, [F(42.78), F(43.3)], [0, 1], clamp);
  const pulse = f > F(45.3) ? 1 + Math.sin((f - F(45.3)) / 5) * 0.04 : 1;
  const cursorP = ramp(f, 45.55, 46.05, Easing.inOut(Easing.cubic));
  const press = f >= F(46.1) && f < F(46.1) + 4 ? 0.85 : 1;
  const ripple = interpolate(f, [F(46.1), F(46.1) + 18], [0, 1], clamp);
  return (
    <Bg kind="light">
      <Cam s={pull} y={pullY}>
        <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center" }}>
          <Pop at={41.22} style={{ ...light, fontSize: 62 }}>do zero absoluto ao</Pop>
          <div style={{ ...bold, fontSize: 150, lineHeight: 1, letterSpacing: "-0.04em", opacity: interpolate(f, [F(42.78), F(42.78) + 4], [0, 1], clamp), transform: `scale(${interpolate(av, [0, 1], [0.4, 1])})`, color: interpolateColors(avColor, [0, 1], [C.navy, C.blue]), filter: `blur(${(1 - av) * 10}px)` }}>
            avançado
          </div>
          <div style={{ fontSize: 52, marginTop: 14 }}>
            <Words gap={12} items={[{ t: "no", at: 43.62, style: light }, { t: "seu ritmo", at: 43.83, style: bold }]} />
          </div>
        </div>
        <div style={{ position: "absolute", top: 860, width: "100%", display: "flex", justifyContent: "center" }}>
          <Pop at={44.1} from="zoom">
            <Img src={logo} style={{ width: 860 }} />
          </Pop>
        </div>
        <div style={{ position: "absolute", top: 1290, width: "100%", textAlign: "center", fontSize: 42, color: C.muted }}>
          <Words gap={12} items={[{ t: "garanta já a sua", at: 45.06, style: light }, { t: "vaga", at: 45.75, style: { ...bold, color: C.navy } }]} />
        </div>
        <div style={{ position: "absolute", left: 440, top: 1420, width: 200, height: 200 }}>
          <Pop at={45.3} from="zoom">
            <div style={{ position: "relative", width: 200, height: 200 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.blue, opacity: 0.35 * (1 - ripple), transform: `scale(${1 + ripple * 0.8})` }} />
              <div style={{ width: 200, height: 200, borderRadius: "50%", background: C.blue, display: "grid", placeItems: "center", transform: `scale(${pulse * press})`, boxShadow: "0 20px 40px rgba(5,128,248,.35)" }}>
                <Ic.Arrow />
              </div>
            </div>
          </Pop>
          <div style={{ position: "absolute", left: interpolate(cursorP, [0, 1], [420, 140]), top: interpolate(cursorP, [0, 1], [380, 150]), opacity: interpolate(f, [F(45.5), F(45.6)], [0, 1], clamp), transform: `scale(${press})` }}>
            <Ic.Cursor />
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 110, width: "100%", display: "flex", justifyContent: "center" }}>
          <Pop at={46.47} from="zoom">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 18, borderRadius: 999, background: "#fff", padding: "20px 44px", fontWeight: 600, fontSize: 46, boxShadow: "0 14px 34px rgba(4,32,76,.12)" }}>
              <Ic.Insta />@way.fluency
            </div>
          </Pop>
        </div>
      </Cam>
    </Bg>
  );
};
