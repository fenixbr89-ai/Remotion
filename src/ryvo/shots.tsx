import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Foreground, Kinetic, useKf } from "./camera";
import { Bubble, Chips, GlassTile, Headline, LogoMark, Reveal, useProgress } from "./components";
import { Icon, Tile3D } from "./icons";
import { useTheme } from "./ThemeContext";
import { FONT, P } from "./theme";
import { FINAL, HEAD, SYNC } from "./sync";
import { MotionInterface } from "./scenes/Scene2Motion";
import { Card, ImpressaoVisual } from "./scenes/Scene4Impressao";

export type ShotProps = { dur: number };

const useTime = () => useCurrentFrame() / 30;

/** Section label pill at the top of a shot. */
const Label: React.FC<{ n: string; text: string }> = ({ n, text }) => {
  const T = useTheme();
  const p = useProgress(0.05, 0.6);
  return (
    <div style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          opacity: p,
          transform: `translateY(${(1 - p) * -20}px)`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 28px",
          fontFamily: FONT,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.16em",
          color: T.accentText,
          ...T.glass(0.1, 40),
        }}
      >
        <span style={{ color: P.blue }}>{n}</span>
        <span style={{ width: 2, height: 22, background: T.surfaceLine }} />
        {text}
      </div>
    </div>
  );
};

/** Soft glow behind a hero element (no lines). */
const Glow: React.FC<{ cx: number; cy: number; delay?: number }> = ({ cx, cy, delay = 0.2 }) => {
  const p = useProgress(delay, 0.9);
  const time = useTime();
  const r = 340 + Math.sin(time * 2) * 20;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(117,71,232,0.55) 0%, rgba(167,139,250,0.25) 40%, rgba(117,71,232,0) 70%)`,
        opacity: p,
        filter: "blur(10px)",
      }}
    />
  );
};

const Center: React.FC<{ y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ y, children, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", ...style }}>
    {children}
  </div>
);

// ───────────────────────── CENA 1 — Abertura ─────────────────────────

/** "Uma marca" — the glass spiral comes through the camera and settles. */
export const S01: React.FC<ShotProps> = () => {
  const T = useTheme();
  const z = useKf([
    [0, 2.4],
    [1.4, 1],
  ]);
  const blur = useKf([
    [0, 26],
    [1.15, 0],
  ]);
  const rot = useKf([
    [0, -30],
    [2.8, 6],
  ]);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 300,
          width: 900,
          height: 900,
          transform: `scale(${z}) rotate(${rot}deg)`,
          filter: `blur(${blur}px)`,
        }}
      >
        <Img src={staticFile(T.spiral)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <Center y={1270}>
        <Kinetic text="Uma *marca*" start={0.4} size={150} wps={3} />
      </Center>
    </AbsoluteFill>
  );
};

/** "não precisa apenas aparecer." — camera tracks along the line as it is written. */
export const S02: React.FC<ShotProps> = ({ dur }) => {
  // as in v3 (approved): the camera keeps travelling and "aparecer." ends half hidden at the edge
  const x = useKf([
    [0, 120],
    [dur / 30, -980],
  ]);
  return (
    <AbsoluteFill>
      <GlassTile size={220} x={760} y={430} rx={20} ry={-30} rz={15} tint={0.6} blur={4} floatPhase={1} />
      <GlassTile size={160} x={80} y={1300} rx={-20} ry={30} rz={-20} tint={0.4} blur={6} floatPhase={2} />
      <div style={{ position: "absolute", top: 860, left: 0, transform: `translateX(${x}px)` }}>
        <Kinetic text="não precisa apenas *aparecer.*" nowrap size={170} start={0.1} wps={2.6} align="left" />
      </div>
      <Foreground from={[1300, 1500]} to={[-300, 1300]} size={420} dur={dur} blur={22}>
        <GlassTile size={420} x={0} y={0} tint={0.7} />
      </Foreground>
    </AbsoluteFill>
  );
};

/** "Ela precisa ser lembrada." — R tile flies in through the camera with light rays. */
export const S03: React.FC<ShotProps> = () => {
  const z = useKf([
    [0, 2.6],
    [1.7, 1],
  ]);
  const blur = useKf([
    [0, 24],
    [1.4, 0],
  ]);
  const time = useTime();
  return (
    <AbsoluteFill>
      <Glow cx={540} cy={760} delay={0.8} />
      <Center y={560}>
        <div style={{ transform: `scale(${z}) rotate(${Math.sin(time * 0.8) * 3}deg)`, filter: `blur(${blur}px)` }}>
          <Tile3D size={400}>
            <LogoMark height={190} white />
          </Tile3D>
        </div>
      </Center>
      <Center y={1180}>
        <Kinetic text="Ela precisa ser *lembrada.*" start={1.1} size={104} width={900} wps={2.6} />
      </Center>
      <Bubble size={70} x={200} y={480} phase={1} />
      <Bubble size={46} x={840} y={1000} phase={2} />
    </AbsoluteFill>
  );
};

/** Hero title "Sua marca merece mais." on the alternate background. */
export const S04: React.FC<ShotProps> = ({ dur }) => (
  <AbsoluteFill>
    <GlassTile size={260} x={730} y={260} rx={25} ry={-35} rz={18} tint={0.7} floatPhase={0.5} />
    <GlassTile size={180} x={60} y={1330} rx={-15} ry={30} rz={-24} tint={0.5} floatPhase={2} />
    <Bubble size={90} x={150} y={420} phase={1} />
    <Center y={700}>
      <Headline light="Sua marca" bold={"merece\nmais."} delay={HEAD.light} boldDelay={HEAD.bold} lightSize={150} boldSize={220} align="center" />
    </Center>
    <Foreground from={[-200, 300]} to={[1300, 200]} size={360} dur={dur} blur={24}>
      <GlassTile size={360} x={0} y={0} tint={0.8} />
    </Foreground>
  </AbsoluteFill>
);

// ───────────────────────── CENA 2 — Motion Design ─────────────────────────

/** "Transformamos ideias em movimento," — idea tile flips into a play tile. */
export const S05: React.FC<ShotProps> = () => {
  const tMov = SYNC["Transformamos *ideias* em *movimento,*"][3];
  const flip = useKf([
    [tMov - 0.3, 0],
    [tMov + 0.3, 180],
  ]);
  const enter = useProgress(0, 0.6);
  const time = useTime();
  return (
    <AbsoluteFill>
      <Label n="01" text="MOTION DESIGN" />
      <Center y={480}>
        <div
          style={{
            width: 420,
            height: 420,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `perspective(1400px) rotateY(${flip + Math.sin(time) * 6}deg) scale(${0.6 + enter * 0.4})`,
            opacity: enter,
          }}
        >
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
            <Tile3D size={420} variant="lavender">
              <Icon name="bulb" size={210} color={P.ice} stroke={1.6} />
            </Tile3D>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <Tile3D size={420}>
              <Icon name="play" size={220} color={P.ice} />
            </Tile3D>
          </div>
        </div>
      </Center>
      <Center y={1110}>
        <Kinetic text="Transformamos *ideias* em *movimento,*" start={0.1} size={96} width={940} />
      </Center>
      <Bubble size={64} x={170} y={560} phase={0} />
      <Bubble size={40} x={880} y={900} phase={2} />
    </AbsoluteFill>
  );
};

/** "criando vídeos, animações" — editor interface swings in. */
export const S06: React.FC<ShotProps> = ({ dur }) => (
  <AbsoluteFill>
    <Label n="01" text="MOTION DESIGN" />
    <Center y={330}>
      <Kinetic text="criando *vídeos,* *animações*" start={0.1} size={96} width={940} />
    </Center>
    <div style={{ position: "absolute", inset: 0, transform: "translateY(-150px)" }}>
      <MotionInterface />
    </div>
    <Foreground from={[1250, 1600]} to={[-250, 1450]} size={300} dur={dur} blur={20}>
      <Tile3D size={300}>
        <Icon name="play" size={150} />
      </Tile3D>
    </Foreground>
  </AbsoluteFill>
);

/** "e experiências visuais que capturam a atenção." — icons orbit around the eye. */
export const S07: React.FC<ShotProps> = () => {
  const time = useTime();
  const enter = useProgress(0, 0.7);
  const icons: ["play" | "layers" | "megaphone", "violet" | "blue" | "lavender"][] = [
    ["play", "violet"],
    ["layers", "blue"],
    ["megaphone", "lavender"],
  ];
  return (
    <AbsoluteFill>
      <Label n="01" text="MOTION DESIGN" />
      <Center y={330}>
        <Kinetic text="e experiências visuais que capturam a *atenção.*" start={0.05} size={84} width={940} wps={3.6} />
      </Center>
      <div style={{ position: "absolute", left: 540, top: 1010 }}>
        {icons.map(([n, v], i) => {
          const a = time * 0.55 + (i / 3) * Math.PI * 2;
          const z = Math.sin(a);
          const sc = (0.75 + z * 0.3) * enter;
          return (
            <div
              key={n}
              style={{
                position: "absolute",
                left: Math.cos(a) * 330 - 90,
                top: z * 90 - 90,
                transform: `scale(${sc})`,
                filter: z < -0.2 ? `blur(${(-z - 0.2) * 8}px)` : undefined,
                zIndex: Math.round(z * 10) + 10,
              }}
            >
              <Tile3D size={180} variant={v}>
                <Icon name={n} size={92} />
              </Tile3D>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: -150, top: -150, zIndex: 10, transform: `scale(${enter})` }}>
          <Tile3D size={300}>
            <Icon name="eye" size={160} />
          </Tile3D>
        </div>
      </div>
      <Center y={1400}>
        <Chips items={["Vídeos", "Animações", "Publicidade"]} delay={0.9} />
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── CENA 3 — Design Gráfico ─────────────────────────

/** "Criamos identidades visuais" — identity board swings in, palette pops. */
export const S08: React.FC<ShotProps> = () => {
  const T = useTheme();
  const frame = useCurrentFrame();
  const enter = useProgress(0.1, 1.0);
  const swatches = [P.black, P.violet, P.lavender, P.blue, P.ice];
  return (
    <AbsoluteFill>
      <Label n="02" text="DESIGN GRÁFICO" />
      <Center y={330}>
        <Kinetic text="Criamos *identidades* *visuais*" start={0.1} size={96} width={940} />
      </Center>
      <Center y={640}>
        <div
          style={{
            width: 760,
            height: 820,
            padding: 56,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: enter,
            transform: `perspective(1600px) rotateY(${(1 - enter) * -50 + 8}deg) rotateX(${(1 - enter) * 25 + 6}deg) translateY(${(1 - enter) * 200}px)`,
            ...T.glass(0.25, 56),
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: FONT, fontSize: 26, letterSpacing: "0.18em", color: T.accentText, fontWeight: 600 }}>
              IDENTIDADE VISUAL
            </span>
            <LogoMark height={56} />
          </div>
          <div style={{ fontFamily: FONT, fontSize: 260, fontWeight: 900, letterSpacing: "-0.06em", color: T.text, lineHeight: 1 }}>
            Aa
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {swatches.map((s, i) => {
              const k = interpolate(frame, [22 + i * 4, 34 + i * 4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={s}
                  style={{
                    width: 104,
                    height: 104,
                    borderRadius: 30,
                    background: s,
                    border: `2px solid ${T.surfaceLine}`,
                    transform: `scale(${k}) translateY(${(1 - k) * 40}px)`,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </Center>
      <GlassTile size={150} x={880} y={1440} rx={20} ry={-30} rz={20} tint={0.6} floatPhase={1} />
    </AbsoluteFill>
  );
};

/** "e conteúdos digitais" — phone post + notifications stacking. */
export const S09: React.FC<ShotProps> = () => {
  const T = useTheme();
  const frame = useCurrentFrame();
  const phone = useProgress(0.05, 0.9);
  const notes: ["heart" | "userPlus" | "trend", string][] = [
    ["heart", "1.248 curtidas"],
    ["userPlus", "+356 seguidores"],
    ["trend", "Alcance em alta"],
  ];
  return (
    <AbsoluteFill>
      <Label n="02" text="DESIGN GRÁFICO" />
      <Center y={330}>
        <Kinetic text="e *conteúdos* *digitais* que fortalecem a *presença*" size={84} width={940} />
      </Center>
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 650,
          width: 470,
          height: 900,
          padding: 26,
          opacity: phone,
          transform: `perspective(1600px) rotateY(${18 - (1 - phone) * 30}deg) rotateZ(-4deg) translateY(${(1 - phone) * 220}px)`,
          ...T.glass(0.3, 70),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 8px 18px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: P.black,
              border: `2px solid ${P.lavender}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoMark height={22} />
          </div>
          <span style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: T.text }}>@ryvocreative</span>
        </div>
        <div
          style={{
            height: 520,
            borderRadius: 34,
            padding: 34,
            background: `linear-gradient(160deg, #15122E 0%, #2B1B6E 55%, ${P.violet} 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 300, color: P.ice, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Sua marca
          </div>
          <div style={{ fontFamily: FONT, fontSize: 60, fontWeight: 900, fontStyle: "italic", color: P.lavender, letterSpacing: "-0.06em" }}>
            em movimento.
          </div>
          <div style={{ position: "absolute", right: 30, bottom: 30 }}>
            <LogoMark height={70} white />
          </div>
        </div>
        <div style={{ display: "flex", gap: 22, padding: "24px 10px" }}>
          <Icon name="heart" size={44} color={P.lavender} />
          <div style={{ flex: 1, height: 14, borderRadius: 7, alignSelf: "center", background: "rgba(167,139,250,0.35)" }} />
        </div>
      </div>
      {notes.map(([ic, label], i) => {
        const k = interpolate(frame, [18 + i * 9, 30 + i * 9], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: 520,
              top: 850 + i * 150,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "20px 30px 20px 20px",
              opacity: k,
              transform: `translateX(${(1 - k) * 260}px) scale(${0.9 + k * 0.1})`,
              filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined,
              fontFamily: FONT,
              fontSize: 32,
              fontWeight: 700,
              color: T.text,
              ...T.glass(0.4, 34),
            }}
          >
            <Tile3D size={64} variant={i === 1 ? "blue" : "violet"}>
              <Icon name={ic} size={34} />
            </Tile3D>
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "que fortalecem a presença e a personalidade das marcas." — growth card + counter. */
export const S10: React.FC<ShotProps> = () => {
  const T = useTheme();
  const frame = useCurrentFrame();
  const enter = useProgress(0.05, 0.8);
  const n = Math.round(interpolate(frame, [12, 55], [0, 250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const draw = interpolate(frame, [12, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts = [0, 0.12, 0.08, 0.3, 0.26, 0.5, 0.46, 0.72, 0.68, 1].map((v, i) => [40 + i * 72, 300 - v * 250]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <AbsoluteFill>
      <Label n="02" text="DESIGN GRÁFICO" />
      <Center y={330}>
        <Kinetic text="e a *personalidade* das marcas." size={96} width={940} />
      </Center>
      <Center y={720}>
        <div
          style={{
            width: 780,
            padding: 48,
            opacity: enter,
            transform: `perspective(1600px) rotateX(${(1 - enter) * 40 + 8}deg) rotateY(-8deg) scale(${0.85 + enter * 0.15})`,
            ...T.glass(0.3, 52),
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 28, color: T.textSoft, fontWeight: 500 }}>presença da marca</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontFamily: FONT, fontSize: 170, fontWeight: 800, color: T.text, letterSpacing: "-0.05em" }}>+{n}%</span>
            <Icon name="trend" size={70} color={P.blue} stroke={2.4} />
          </div>
          <svg width={700} height={320}>
            <defs>
              <linearGradient id="lg-growth" x1="0" x2="1">
                <stop offset="0" stopColor={P.lavender} />
                <stop offset="1" stopColor={P.blue} />
              </linearGradient>
            </defs>
            <path d={d} fill="none" stroke="url(#lg-growth)" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          </svg>
        </div>
      </Center>
      <Center y={1460}>
        <Chips items={["Identidade Visual", "Social Media", "Conteúdo Digital"]} delay={0.9} />
      </Center>
    </AbsoluteFill>
  );
};

// ───────────────────────── CENA 4 — Impressão ─────────────────────────

/** "E levamos sua comunicação além das telas," — camera dives through a phone screen. */
export const S11: React.FC<ShotProps> = ({ dur }) => {
  const T = useTheme();
  const d = dur / 30;
  const z = useKf([
    [0, 0.9],
    [d - 0.35, 1],
    [d, 5.5],
  ]);
  const blur = useKf([
    [d - 0.22, 0],
    [d, 18],
  ]);
  const textO = useKf([
    [d - 0.15, 1],
    [d, 0],
  ]);
  return (
    <AbsoluteFill>
      <Label n="03" text="IMPRESSOS" />
      <Center y={330} style={{ opacity: textO }}>
        <Kinetic text="E levamos sua comunicação *além* *das* *telas,*" start={0.05} size={88} width={940} wps={3.8} />
      </Center>
      <Center y={720}>
        <div
          style={{
            width: 440,
            height: 880,
            padding: 22,
            transform: `scale(${z})`,
            transformOrigin: "50% 45%",
            filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
            ...T.glass(0.3, 70),
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 52,
              background: `radial-gradient(circle at 50% 40%, ${P.violet} 0%, #2B1B6E 55%, ${P.black} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoMark height={150} white />
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/** "com materiais gráficos e publicitários" — poster and cards fly in. */
export const S12: React.FC<ShotProps> = ({ dur }) => (
  <AbsoluteFill>
    <Label n="03" text="IMPRESSOS" />
    <Center y={330}>
      <Kinetic text="com *materiais* *gráficos* e *publicitários*" start={0.05} size={92} width={940} wps={3.2} />
    </Center>
    <div style={{ position: "absolute", inset: 0, transform: "translateY(-110px) scale(1.06)" }}>
      <ImpressaoVisual />
    </div>
    <Foreground from={[-250, 1650]} to={[1300, 1500]} size={340} dur={dur} blur={22}>
      <Tile3D size={340} variant="blue">
        <Icon name="print" size={170} />
      </Tile3D>
    </Foreground>
  </AbsoluteFill>
);

/** "que dão vida à sua marca." — business card flips in 3D. */
export const S13: React.FC<ShotProps> = () => {
  const spin = useKf([
    [0, -160],
    [1.4, 0],
    [2.0, 12],
  ]);
  const enter = useProgress(0, 0.5);
  return (
    <AbsoluteFill>
      <Label n="03" text="IMPRESSOS" />
      <Center y={330}>
        <Kinetic text="que dão *vida* à sua marca." start={0.05} size={96} width={940} />
      </Center>
      <Center y={760}>
        <div
          style={{
            width: 420,
            height: 240,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `perspective(1600px) rotateY(${spin}deg) rotateX(14deg) scale(${1.6 * enter})`,
            transformOrigin: "50% 0%",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
            <Card front />
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <Card />
          </div>
        </div>
      </Center>
      <Center y={1400}>
        <Chips items={["Materiais gráficos", "Publicidade", "Comunicação visual"]} delay={0.6} />
      </Center>
      <Bubble size={70} x={140} y={1180} phase={1} />
      <GlassTile size={140} x={850} y={600} rx={20} ry={-30} rz={18} tint={0.6} floatPhase={2} />
    </AbsoluteFill>
  );
};

// ───────────────────────── CENA 5 — Encerramento ─────────────────────────

/** "RYVO. Criatividade que vai além do visual." — R symbol zooms through with rays. */
export const S14: React.FC<ShotProps> = () => {
  const z = useKf([
    [0, 2.8],
    [1.8, 1],
  ]);
  const blur = useKf([
    [0, 26],
    [1.5, 0],
  ]);
  const time = useTime();
  return (
    <AbsoluteFill>
      <Glow cx={540} cy={720} delay={0.8} />
      <Center y={560}>
        <div style={{ transform: `scale(${z})`, filter: `blur(${blur}px) drop-shadow(0 0 ${40 + Math.sin(time * 1.2) * 12}px rgba(117,71,232,0.6))` }}>
          <LogoMark height={300} />
        </div>
      </Center>
      <Center y={1080}>
        <Kinetic text="Criatividade que vai *além* *do* *visual.*" start={1.6} size={100} width={900} wps={3.2} />
      </Center>
    </AbsoluteFill>
  );
};

/** Final CTA — headline, button clicked by a cursor, contacts. */
export const S15: React.FC<ShotProps> = () => {
  const T = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = useProgress(0, 1.4);
  const btn = useProgress(FINAL.button - 0.1, 0.5);
  const ck = FINAL.click;
  const time = useTime();
  // cursor path → click at 2.1s
  const cx = useKf([
    [ck - 0.75, 980],
    [ck - 0.05, 640],
  ]);
  const cy = useKf([
    [ck - 0.75, 1500],
    [ck - 0.05, 1060],
  ]);
  const cursorO = useKf([
    [ck - 0.85, 0],
    [ck - 0.65, 1],
    [ck + 0.9, 1],
    [ck + 1.2, 0],
  ]);
  const click = interpolate(frame, [(ck - 0.05) * fps, (ck + 0.05) * fps, (ck + 0.25) * fps], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ripple = interpolate(frame, [ck * fps, (ck + 0.7) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: -80,
          top: 1160,
          width: 1240,
          height: 1100,
          opacity: ring * 0.95,
          transform: `scale(${0.85 + ring * 0.15}) rotate(${-12 + time * 3}deg)`,
          filter: `blur(${(1 - ring) * 18}px)`,
        }}
      >
        <Img src={staticFile(T.ring)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Reveal delay={0.1} dur={1.4}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <LogoMark height={150} style={{ filter: "drop-shadow(0 0 30px rgba(117,71,232,0.5))" }} />
            <div style={{ fontSize: 26, letterSpacing: "0.42em", color: T.accentText, fontWeight: 500, marginTop: 22, paddingLeft: "0.42em" }}>
              ESTÚDIO CRIATIVO
            </div>
          </div>
        </Reveal>
        <div style={{ height: 50 }} />
        <Headline light={"Sua próxima ideia"} bold={"começa aqui."} delay={FINAL.light} boldDelay={FINAL.bold} lightSize={100} boldSize={128} align="center" />
        <div style={{ height: 56 }} />
        <div
          style={{
            opacity: btn,
            transform: `translateY(${(1 - btn) * 30}px) scale(${1 - click * 0.06})`,
            filter: btn < 1 ? `blur(${(1 - btn) * 12}px)` : undefined,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "30px 56px 30px 34px",
            borderRadius: 80,
            position: "relative",
            background: `linear-gradient(90deg, ${P.violet} 0%, #8C5FF0 55%, ${P.blue} 100%)`,
            boxShadow: "0 30px 60px rgba(117,71,232,0.5), inset 0 2px 0 rgba(255,255,255,0.45)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 80,
              border: `3px solid ${P.lavender}`,
              transform: `scale(${1 + ripple * 0.4})`,
              opacity: (1 - ripple) * (ripple > 0 ? 1 : 0),
            }}
          />
          <div style={{ width: 76, height: 76, borderRadius: 38, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="whatsapp" size={46} />
          </div>
          <span style={{ fontSize: 46, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Vamos conversar?</span>
        </div>
        <div style={{ height: 30 }} />
        <Reveal delay={FINAL.pill}>
          <div style={{ ...T.glass(0.15, 40), padding: "16px 34px", fontSize: 31, color: T.text, fontWeight: 500 }}>
            Solicite seu orçamento pelo <b style={{ fontWeight: 800 }}>WhatsApp</b>
          </div>
        </Reveal>
        <div style={{ height: 18 }} />
        <Reveal delay={FINAL.pill + 0.5}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 34, fontWeight: 800, color: T.text }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="whatsapp" size={34} color={T.accentText} />
              (62) 99523-7527
            </span>
            <span style={{ width: 2, height: 30, background: T.surfaceLine }} />
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={T.accentText} strokeWidth={2.2}>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.4" cy="6.6" r="0.6" fill={T.accentText} />
              </svg>
              @ryvocreative
            </span>
          </div>
        </Reveal>
      </div>

      {/* cursor */}
      <svg
        width={70}
        height={70}
        viewBox="0 0 24 24"
        style={{ position: "absolute", left: cx, top: cy, opacity: cursorO, transform: `scale(${1 - click * 0.15})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))", zIndex: 60 }}
      >
        <path d="M5 3l14 7.2-6.3 1.6L10 18z" fill="#fff" stroke={P.black} strokeWidth={1.3} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
