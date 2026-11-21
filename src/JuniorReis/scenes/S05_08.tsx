import type { FC, ReactNode } from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ArrowUp, Check, Chevron, Dumbbell, Flag, Person, RingIcon, Stopwatch } from "../icons";
import {
  DARK_GLASS,
  EI,
  EIO,
  INK,
  LIGHT_GLASS,
  LIME,
  M,
  MUTED_DARK,
  MUTED_LIGHT,
  OLIVE,
  OLIVE_FRAME,
  R,
  SANS,
  SHADOW_DARK,
  SHADOW_LIGHT,
  lerp,
  lerpRect,
  tw,
} from "../lib";
import { Box, Kinetic } from "../ui";
import { T } from "../cursor";
import { bump } from "../lib";

type P = { d: number };

// ================= CENA 5 — Lista de modalidades (fundo claro) =================
const ROWS: { label: string; icon: ReactNode }[] = [
  { label: "Musculação", icon: <Dumbbell color={LIME} /> },
  { label: "Corrida", icon: <Stopwatch color={LIME} /> },
  { label: "Cross", icon: <RingIcon color={LIME} /> },
];

export const S05: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 120 } });
  const contentOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const iconP = tw(f, 0, M, 0, 1, EIO);
  const icon = lerpRect(R.s4Flag, R.s5Icon1, iconP);

  return (
    <AbsoluteFill>
      {f < d ? (
        <Box
          rect={R.s5Card}
          layers={[{ style: LIGHT_GLASS, o: 1 }]}
          shadow={SHADOW_LIGHT}
          shine={tw(f, 14, 40)}
          style={{
            opacity: tw(f, 2, 14),
            scale: String(0.86 + 0.14 * cardIn),
            translate: `0px ${(1 - cardIn) * 80}px`,
          }}
        >
          {[0, 1, 2].map((i) => {
            const rowIn = tw(f, 14 + i * 6, 32 + i * 6) * contentOut;
            const tc = T.s5Checks[i];
            const chk = spring({ frame: f - tc, fps, config: { damping: 9, stiffness: 220 } });
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 167, height: 166 }}>
                {i > 0 ? (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(0,0,0,0.06)", opacity: contentOut }} />
                ) : null}
                {i > 0 ? (
                  <div style={{
                    position: "absolute", left: 46, top: 42, width: 84, height: 84, borderRadius: 20,
                    background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: rowIn, scale: String(0.6 + 0.4 * rowIn),
                  }}>
                    <div style={{ width: 46, height: 46 }}>{ROWS[i].icon}</div>
                  </div>
                ) : null}
                <div style={{
                  position: "absolute", left: 172, top: 50, fontFamily: SANS, fontWeight: 600, fontSize: 58,
                  letterSpacing: "-0.01em", color: INK, lineHeight: "70px", opacity: rowIn,
                  translate: `${(1 - rowIn) * -40 + bump(f, tc) * 12}px 0px`, filter: `blur(${(1 - rowIn) * 6}px)`,
                }}>
                  {ROWS[i].label}
                </div>
                <div style={{
                  position: "absolute", left: 772, top: 52, width: 62, height: 62, borderRadius: 31, background: LIME,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  scale: String(Math.max(0, chk) * contentOut), opacity: contentOut,
                  boxShadow: `0 0 ${36 * bump(f, tc)}px rgba(212,255,79,0.9)`,
                }}>
                  <div style={{ width: 36, height: 36 }}>
                    <Check p={tw(f, tc + 2, tc + 12)} />
                  </div>
                </div>
              </div>
            );
          })}
        </Box>
      ) : null}

      {/* ícone da bandeira -> ícone de musculação */}
      {f < d ? (
        <div style={{
          position: "absolute", left: icon.x, top: icon.y + Math.sin(Math.PI * iconP) * -60, width: icon.w, height: icon.h,
          borderRadius: icon.r, overflow: "hidden", opacity: f > d - 10 ? contentOut : 1,
          rotate: `${Math.sin(Math.PI * iconP) * -18}deg`,
        }}>
          <div style={{ position: "absolute", inset: 0, background: LIME, opacity: 1 - tw(f, 6, 20), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "52%", height: "52%", color: "#0b0b0b" }}><Flag /></div>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "#0d0d0d", opacity: tw(f, 6, 20), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "55%", height: "55%" }}><Dumbbell color={LIME} /></div>
          </div>
        </div>
      ) : null}

      <Kinetic
        start={22}
        end={d - 10}
        lines={[
          { y: 1440, size: 40, weight: 500, color: MUTED_LIGHT, segs: [{ t: "E pra isso, a gente treina" }] },
          { y: 1532, size: 88, color: INK, segs: [{ t: "musculação, corrida," }] },
          { y: 1622, size: 88, color: INK, serifColor: OLIVE, segs: [{ t: "cross", serif: true }, { t: "e vários outros." }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 6 — Card claro vira o card escuro de evolução =================
const BARS = [
  { label: "Força", v: 0.86 },
  { label: "Resistência", v: 0.72 },
  { label: "Performance", v: 0.94 },
];

export const S06: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, M, 0, 1, EIO);
  const rect = lerpRect(R.s5Card, R.s6Card, p);
  const contentOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const title = tw(f, 16, 34) * contentOut;

  return (
    <AbsoluteFill>
      {f < d ? (
        <Box
          rect={rect}
          shadow={SHADOW_DARK}
          shine={tw(f, 18, 44)}
          layers={[
            { style: LIGHT_GLASS, o: 1 - tw(f, 0, 18) },
            { style: DARK_GLASS, o: tw(f, 0, 18) },
          ]}
        >
          <div style={{
            position: "absolute", left: 66, top: 58, fontFamily: SANS, fontWeight: 500, fontSize: 31,
            letterSpacing: `${lerp(0.5, 0.26, title)}em`, color: "#8A8A8A", opacity: title,
          }}>
            EVOLUÇÃO DO TREINO
          </div>
          {BARS.map((b, i) => {
            const rowIn = tw(f, 22 + i * 6, 38 + i * 6) * contentOut;
            const ds = T.s6Drag[i];
            const fill = tw(f, ds, ds + 12, 0, 1, EIO) * (1 - tw(f, d - 14, d, 0, 1, EI));
            const done = bump(f, ds + 12);
            return (
              <div key={i} style={{ position: "absolute", left: 66, right: 66, top: 143 + i * 152 }}>
                <div style={{
                  fontFamily: SANS, fontWeight: 600, fontSize: 47, color: "#fff", letterSpacing: "-0.01em",
                  lineHeight: "60px", opacity: rowIn, translate: `${(1 - rowIn) * -30}px 0px`,
                }}>
                  {b.label}
                  <span style={{ position: "absolute", right: 0, top: 0, color: LIME, fontWeight: 700, fontVariantNumeric: "tabular-nums", scale: String(1 + 0.25 * done), transformOrigin: "100% 50%" }}>
                    {Math.round(b.v * 100 * fill)}%
                  </span>
                </div>
                <div style={{ position: "relative", marginTop: 34, height: 26, borderRadius: 13, background: "#3B3B3B", opacity: rowIn }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: `${b.v * 100 * fill}%`, borderRadius: 13,
                    background: LIME, boxShadow: `0 0 ${20 * fill + 30 * done}px rgba(212,255,79,${0.35 + 0.4 * done})`,
                  }} />
                </div>
              </div>
            );
          })}
        </Box>
      ) : null}

      <Kinetic
        start={20}
        end={d - 10}
        lines={[
          { y: 1438, size: 40, weight: 500, color: MUTED_DARK, segs: [{ t: "Tudo pra desenvolver" }] },
          { y: 1530, size: 88, color: "#fff", segs: [{ t: "força, resistência", serif: true }] },
          { y: 1622, size: 88, color: "#fff", segs: [{ t: "e" }, { t: "performance.", serif: true }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 7 — Card vira a pílula; celular com conversa =================
const PHONE_BORDER = 16;
export const PhoneScreen: FC<{ f: number; o: number }> = ({ f, o }) => {
  const b1 = tw(f, T.s7Send + 2, T.s7Send + 14);
  const b2 = tw(f, 58, 72);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: SANS }}>
      {/* header */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 187, background: "#fff" }} />
      <div style={{ position: "absolute", left: 189, top: 16, width: 150, height: 42, borderRadius: 21, background: "#000" }} />
      <div style={{ position: "absolute", left: 33, top: 116, width: 30, height: 30 }}><Chevron /></div>
      <div style={{ position: "absolute", left: 86, top: 96, width: 68, height: 68, borderRadius: 34, background: "#E0E3D5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40 }}><Person /></div>
      </div>
      <div style={{ position: "absolute", left: 175, top: 98, fontSize: 33, fontWeight: 600, color: INK, lineHeight: "40px" }}>Aluno</div>
      <div style={{ position: "absolute", left: 175, top: 137, fontSize: 23, color: "#6B8E23", lineHeight: "28px" }}>online</div>
      {/* chat */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 187, height: 569, background: "#E8E9DE" }} />
      <div style={{
        position: "absolute", left: 102, top: 234, width: 400, height: 144, background: LIME,
        borderRadius: "28px 28px 6px 28px", padding: "22px 28px", boxSizing: "border-box",
        fontSize: 31, lineHeight: "39px", color: INK,
        opacity: b1, scale: String(0.6 + 0.4 * b1), transformOrigin: "100% 100%", translate: `0px ${(1 - b1) * 30}px`,
      }}>
        Como foi o treino de hoje?
        <div style={{ position: "absolute", right: 28, bottom: 14, fontSize: 21, color: "rgba(0,0,0,0.55)" }}>09:41</div>
      </div>
      <div style={{
        position: "absolute", left: 26, top: 401, width: 400, height: 145, background: "#fff",
        borderRadius: "28px 28px 28px 6px", padding: "22px 28px", boxSizing: "border-box",
        fontSize: 31, lineHeight: "39px", color: INK,
        opacity: b2, scale: String(0.6 + 0.4 * b2), transformOrigin: "0% 100%", translate: `0px ${(1 - b2) * 30}px`,
      }}>
        Mandei bem! Bora pro próximo.
        <div style={{ position: "absolute", right: 28, bottom: 14, fontSize: 21, color: "rgba(0,0,0,0.5)" }}>09:42</div>
      </div>
      {/* input */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 756, bottom: 0, background: "#fff" }} />
      <div style={{ position: "absolute", left: 24, top: 778, width: 392, height: 70, borderRadius: 35, background: "#EEEEE6", fontSize: 29, color: "#8f8f8a", lineHeight: "70px", paddingLeft: 28, boxSizing: "border-box" }}>Mensagem</div>
      <div style={{ position: "absolute", left: 434, top: 778, width: 70, height: 70, borderRadius: 35, background: LIME, display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 - 0.25 * bump(f, T.s7Send)), boxShadow: `0 0 ${30 * bump(f, T.s7Send)}px rgba(212,255,79,0.9)` }}>
        <div style={{ width: 36, height: 36, color: "#111" }}><ArrowUp /></div>
      </div>
    </div>
  );
};

export const S07: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = tw(f, 0, M, 0, 1, EIO);
  const pill = lerpRect(R.s6Card, R.s7Pill, p);
  const pillOut = tw(f, d, d + 14, 0, 1, EI);
  const phoneIn = spring({ frame: f - 14, fps, config: { damping: 17, stiffness: 90, mass: 0.9 } });
  const contentOut = 1 - tw(f, d - 10, d, 0, 1, EI);

  return (
    <AbsoluteFill>
      <Box
        rect={pill}
        shadow={SHADOW_LIGHT}
        layers={[
          { style: DARK_GLASS, o: 1 - tw(f, 0, 18) },
          { style: LIGHT_GLASS, o: tw(f, 0, 18) },
        ]}
        shine={tw(f, 18, 44)}
        style={{ opacity: 1 - pillOut, translate: `0px ${-pillOut * 80}px` }}
      />
      <Kinetic
        start={12}
        end={d - 12}
        lines={[
          { y: 262, size: 88, color: INK, segs: [{ t: "Mas treino bom" }] },
          { y: 352, size: 82, color: INK, serifColor: OLIVE, segs: [{ t: "não anda sozinho.", serif: true }] },
        ]}
      />

      {f < d ? (
        <Box
          rect={R.s7Phone}
          layers={[{ style: { background: "#141414" }, o: 1 }]}
          shadow="0 50px 90px rgba(40,45,30,0.28)"
          style={{
            opacity: tw(f, 14, 24),
            translate: `0px ${(1 - phoneIn) * 700}px`,
            rotate: `${(1 - phoneIn) * 10}deg`,
          }}
        >
          <div style={{ position: "absolute", inset: PHONE_BORDER, borderRadius: 72 - PHONE_BORDER, overflow: "hidden", background: "#fff" }}>
            <PhoneScreen f={f} o={contentOut} />
          </div>
        </Box>
      ) : null}

      <Kinetic
        start={30}
        end={d - 10}
        lines={[
          { y: 1500, size: 88, color: INK, segs: [{ t: "Por isso," }] },
          { y: 1594, size: 88, color: INK, serifColor: OLIVE, segs: [{ t: "acompanhamento", serif: true }] },
          { y: 1688, size: 88, color: INK, segs: [{ t: "de perto." }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 8 — Celular vira o card da consultoria =================
export const S08: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, M, 0, 1, EIO);
  const rect = lerpRect(R.s7Phone, R.s8Card, p);
  const inset = lerp(PHONE_BORDER, 20, p);
  const out = tw(f, d, d + 14, 0, 1, EI);
  const box = tw(f, 20, 38);
  const tg = tw(f, T.s8Toggle + 1, T.s8Toggle + 14, 0, 1, EIO); // Online -> Presencial

  return (
    <AbsoluteFill>
      <Box
        rect={rect}
        shadow={SHADOW_DARK}
        layers={[
          { style: { background: "#141414" }, o: 1 - tw(f, 0, 16) },
          { style: OLIVE_FRAME, o: tw(f, 0, 16) },
        ]}
        style={{ opacity: 1 - out, scale: String(1 - out * 0.12) }}
        shine={tw(f, 22, 48)}
      >
        <div style={{ position: "absolute", inset, borderRadius: rect.r - inset, overflow: "hidden", background: "#0c110c" }}>
          <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 1 - tw(f, 0, 14) }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 743, opacity: tw(f, 6, 22) }}>
            <Img src={staticFile("junior-foto.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%", scale: String(lerp(1.2, 1, tw(f, 6, 50))) }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,17,12,0) 62%, #0c110c 96%)" }} />
          </div>
          {/* seletor de consultoria */}
          <div style={{
            position: "absolute", left: 28, top: 714, width: 576, height: 210, borderRadius: 40, background: "#1a201a",
            opacity: box, translate: `0px ${(1 - box) * 60}px`,
          }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 24, textAlign: "center", fontFamily: SANS, fontSize: 31, fontWeight: 500, letterSpacing: "0.26em", color: "#8A8A8A" }}>
              CONSULTORIA
            </div>
            <div style={{ position: "absolute", left: 26, top: 85, width: 524, height: 104, borderRadius: 52, background: "#0a0d0a" }}>
              <div style={{
                position: "absolute", top: 8, height: 88, borderRadius: 44, background: LIME,
                left: lerp(8, 262, tg), width: lerp(252, 254, tg),
                scale: `${1 + Math.sin(Math.PI * tg) * 0.12} ${1 - Math.sin(Math.PI * tg) * 0.08}`,
                boxShadow: `0 0 ${40 * tw(f, T.s8Toggle + 10, T.s8Toggle + 16) * (1 - tw(f, T.s8Toggle + 16, T.s8Toggle + 34))}px rgba(212,255,79,0.8)`,
              }} />
              {[
                { t: "Online", c: 134, a: 1 - tg },
                { t: "Presencial", c: 389, a: tg },
              ].map((o) => (
                <div key={o.t} style={{
                  position: "absolute", top: 8, height: 88, lineHeight: "88px", left: o.c - 130, width: 260, textAlign: "center",
                  fontFamily: SANS, fontWeight: 600, fontSize: 42, letterSpacing: "-0.01em",
                  color: o.a > 0.5 ? "#0b0b0b" : "#f2f2f2",
                }}>
                  {o.t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box>

      <Kinetic
        start={22}
        end={d - 10}
        lines={[
          { y: 1532, size: 40, weight: 500, color: MUTED_DARK, segs: [{ t: "Com consultoria online e" }] },
          { y: 1625, size: 88, color: "#fff", segs: [{ t: "personal" }, { t: "presencial,", serif: true }] },
        ]}
      />
    </AbsoluteFill>
  );
};
