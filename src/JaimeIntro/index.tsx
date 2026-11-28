import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const fontFamily = "InterLocal";
loadFont({ family: fontFamily, url: staticFile("inter-latin-wght-normal.woff2"), weight: "100 900" });
loadFont({
  family: fontFamily,
  url: staticFile("inter-latin-ext-wght-normal.woff2"),
  weight: "100 900",
  unicodeRange: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
});

export const C = {
  dark: "#0A0A0A",
  light: "#F3F3F1",
  lime: "#B6F23A",
  ink: "#0A0A0A",
  gray: "#6B6B6B",
};

const E = Easing.bezier(0.65, 0, 0.35, 1);
const EO = Easing.bezier(0.22, 1, 0.36, 1);

const r = (
  f: number,
  a: number,
  b: number,
  from: number,
  to: number,
  ease = E,
) =>
  interpolate(f, [a, b], [from, to], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// palavra entrando com desfoque
const BlurIn: React.FC<{
  start: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  out?: number;
}> = ({ start, children, style, out }) => {
  const f = useCurrentFrame();
  const p = r(f, start, start + 14, 0, 1, EO);
  const o = out === undefined ? 0 : r(f, out, out + 10, 0, 1);
  return (
    <span
      style={{
        display: "inline-block",
        opacity: p * (1 - o),
        filter: `blur(${(1 - p) * 18 + o * 14}px)`,
        transform: `translateY(${(1 - p) * 30 - o * 20}px)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/* ---------------- Cena 1: "Olá" sendo digitado numa caixa de texto ---------------- */
const SceneOla: React.FC = () => {
  const f = useCurrentFrame();
  const text = "Olá";
  const typed = Math.min(text.length, Math.max(0, Math.floor((f - 6) / 7) + 1));
  const caretOn = Math.floor(f / 8) % 2 === 0 || f < 30;
  // caixa aparece
  const box = r(f, 0, 12, 0, 1, EO);
  // caixa cresce e vira o fundo claro da próxima cena
  const grow = r(f, 38, 58, 0, 1);
  const w = interpolate(grow, [0, 1], [520, 2000]);
  const h = interpolate(grow, [0, 1], [240, 1160]);
  const camZoom = r(f, 0, 60, 1, 1.08, Easing.linear);
  return (
    <AbsoluteFill style={{ backgroundColor: C.dark, fontFamily }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${camZoom})`,
        }}
      >
        {/* caixa de seleção */}
        <div
          style={{
            position: "absolute",
            width: w,
            height: h,
            opacity: box,
            border: `3px solid ${C.lime}`,
            backgroundColor: `rgba(243,243,241,${grow})`,
            borderRadius: interpolate(grow, [0, 1], [4, 0]),
          }}
        >
          {[
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ].map(([x, y]) => (
            <div
              key={`${x}${y}`}
              style={{
                position: "absolute",
                left: x ? undefined : -11,
                right: x ? -11 : undefined,
                top: y ? undefined : -11,
                bottom: y ? -11 : undefined,
                width: 18,
                height: 18,
                background: C.dark,
                border: `3px solid ${C.lime}`,
                opacity: 1 - grow,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: -52,
              left: -3,
              background: C.lime,
              color: C.ink,
              fontSize: 22,
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 8,
              opacity: 1 - grow,
            }}
          >
            Texto
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -46,
              left: "50%",
              transform: "translateX(-50%)",
              color: C.lime,
              fontSize: 20,
              fontWeight: 400,
              opacity: (1 - grow) * 0.8,
              whiteSpace: "nowrap",
            }}
          >
            520 × 240
          </div>
        </div>
        <div
          style={{
            color: "white",
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: -6,
            display: "flex",
            alignItems: "center",
            opacity: 1 - r(f, 36, 46, 0, 1),
            filter: `blur(${r(f, 36, 46, 0, 12)}px)`,
          }}
        >
          {text
            .slice(0, typed)
            .split("")
            .map((ch, i) => {
              const s = 6 + i * 7;
              const p = r(f, s, s + 8, 0, 1, EO);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    transform: `translateY(${(1 - p) * 40}px)`,
                    opacity: p,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          <span
            style={{
              width: 8,
              height: 170,
              marginLeft: 10,
              background: C.lime,
              opacity: caretOn ? 1 : 0,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Cena 2: "eu sou Jaime." ---------------- */
const SceneNome: React.FC<{ name: string }> = ({ name }) => {
  const f = useCurrentFrame(); // local, começa no frame 48
  const zoom = r(f, 0, 80, 1, 1.06, Easing.linear);
  const dot = spring({
    frame: f - 44,
    fps: 30,
    config: { damping: 18, stiffness: 140 },
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.light,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${zoom})`,
      }}
    >
      <div style={{ textAlign: "center", color: C.ink }}>
        <div style={{ fontSize: 56, fontWeight: 300, color: C.gray, marginBottom: 6 }}>
          <BlurIn start={4}>eu</BlurIn> <BlurIn start={10}>sou</BlurIn>
        </div>
        <div
          style={{
            fontSize: 250,
            fontWeight: 800,
            letterSpacing: -10,
            lineHeight: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {name.split("").map((ch, i) => {
            const s = 20 + i * 4;
            const p = r(f, s, s + 14, 0, 1, EO);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: p,
                  filter: `blur(${(1 - p) * 14}px)`,
                  transform: `translateY(${(1 - p) * 60}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: C.lime,
              marginLeft: 14,
              marginBottom: 30,
              transform: `scale(${dot})`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Cena 3: o ponto verde cresce e vira o fundo ---------------- */
const SceneVerde: React.FC = () => {
  const f = useCurrentFrame(); // local, começa no frame 110
  const R = r(f, 0, 22, 26, 1300);
  const zoom = r(f, 0, 80, 1, 1.07, Easing.linear);
  // painel claro subindo para a próxima cena
  const exitY = r(f, 60, 80, 1080, 0);
  // posição aproximada do ponto da cena anterior
  const cx = 1213;
  const cy = 650;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: interpolate(R, [26, 1300], [cx, 960]) - R,
          top: interpolate(R, [26, 1300], [cy, 540]) - R,
          width: R * 2,
          height: R * 2,
          borderRadius: R,
          background: C.lime,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${zoom})`,
          color: C.ink,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 170, fontWeight: 800, letterSpacing: -7, lineHeight: 0.95 }}>
          <BlurIn start={14}>direção</BlurIn> <BlurIn start={20}>visual</BlurIn>
        </div>
        <div style={{ fontSize: 64, fontWeight: 300, marginTop: 24 }}>
          <BlurIn start={30}>&amp;</BlurIn> <BlurIn start={34}>design</BlurIn>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: exitY,
          height: 1080,
          background: C.light,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Cena 4: "eu crio ___" trocando ---------------- */
const Icon: React.FC<{ kind: number }> = ({ kind }) => {
  const s: React.CSSProperties = { background: C.ink, borderRadius: 3 };
  if (kind === 0)
    return <span style={{ fontWeight: 800, fontSize: 40, letterSpacing: -2 }}>Aa</span>;
  if (kind === 1)
    return (
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {[22, 40, 30, 46, 18].map((h, i) => (
          <div key={i} style={{ ...s, width: 6, height: h }} />
        ))}
      </div>
    );
  if (kind === 2)
    return (
      <div style={{ display: "grid", gridTemplateColumns: "18px 18px", gap: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ ...s, width: 18, height: 18, opacity: i === 1 ? 0.35 : 1 }} />
        ))}
      </div>
    );
  return (
    <div
      style={{
        width: 30,
        height: 30,
        border: `6px solid ${C.ink}`,
        transform: "rotate(45deg)",
        borderRadius: 4,
      }}
    />
  );
};

export const WORDS = ["identidade visual", "motion design", "social media", "direção de arte"];
const STEP = 24;

const SceneCrio: React.FC = () => {
  const f = useCurrentFrame(); // local, começa no frame 180
  const zoom = r(f, 0, 110, 1.04, 1, Easing.linear);
  const exit = r(f, 94, 106, 0, 1);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.light,
        fontFamily,
        color: C.ink,
        transform: `scale(${zoom})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 960 + 18,
          top: 540,
          transform: "translateY(-50%)",
          fontSize: 76,
          fontWeight: 300,
          color: C.gray,
          opacity: 1 - exit,
          filter: `blur(${exit * 12}px)`,
        }}
      >
        <BlurIn start={2}>eu</BlurIn> <BlurIn start={6}>crio</BlurIn>
      </div>
      {WORDS.map((w, i) => {
        const s = 8 + i * STEP;
        const inP = r(f, s, s + 12, 0, 1);
        const outP = i === WORDS.length - 1 ? exit : r(f, s + STEP, s + STEP + 12, 0, 1);
        const line = r(f, s + 6, s + 18, 0, 1);
        const icon = spring({ frame: f - s - 4, fps: 30, config: { damping: 16, stiffness: 160 } });
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: 960 + 18,
              top: 540,
              display: "flex",
              alignItems: "center",
              gap: 26,
              transform: `translateY(calc(-50% + ${(1 - inP) * 70 - outP * 70}px))`,
              opacity: inP * (1 - outP),
              filter: `blur(${(1 - inP) * 10 + outP * 10}px)`,
            }}
          >
            <div style={{ position: "relative", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2.5 }}>{w}</span>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 2,
                  height: 14,
                  background: C.lime,
                  zIndex: -1,
                  transformOrigin: "left",
                  transform: `scaleX(${line})`,
                  borderRadius: 4,
                }}
              />
            </div>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 22,
                background: C.lime,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${icon}) rotate(${(1 - icon) * -20}deg)`,
                boxShadow: "0 14px 30px rgba(140,190,30,0.35)",
              }}
            >
              <Icon kind={i} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- Cena 5: nome sozinho ---------------- */
const SceneNomeSolo: React.FC<{ name: string }> = ({ name }) => {
  const f = useCurrentFrame(); // local, começa no frame 282
  const scale = r(f, 0, 40, 1.15, 0.9, Easing.linear);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.light,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        color: C.ink,
      }}
    >
      <div style={{ transform: `scale(${scale})`, fontSize: 60, display: "flex", gap: 16 }}>
        <BlurIn start={2} style={{ fontWeight: 300, color: C.gray }}>
          eu sou
        </BlurIn>
        <BlurIn start={7} style={{ fontWeight: 800, letterSpacing: -1.5 }}>
          {name}
        </BlurIn>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Cena 6: logo ---------------- */
const SceneLogo: React.FC = () => {
  const f = useCurrentFrame(); // local, começa no frame 306
  const panel = r(f, 0, 16, 1, 0); // painel escuro descendo
  const p = r(f, 10, 30, 0, 1, EO);
  const dot = spring({ frame: f - 22, fps: 30, config: { damping: 18, stiffness: 140 } });
  const zoom = r(f, 0, 54, 1.06, 1, Easing.linear);
  const fade = r(f, 44, 54, 0, 1);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AbsoluteFill
        style={{
          backgroundColor: C.dark,
          transform: `translateY(${-panel * 1080}px)`,
        }}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${zoom})`,
            opacity: 1 - fade,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              color: "white",
              fontSize: 150,
              fontWeight: 800,
              letterSpacing: interpolate(p, [0, 1], [30, -6]),
              lineHeight: 1,
              opacity: p,
              filter: `blur(${(1 - p) * 16}px)`,
            }}
          >
            JM
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                background: C.lime,
                marginLeft: 12,
                marginBottom: 18,
                transform: `scale(${dot})`,
              }}
            />
          </div>
          <div style={{ fontSize: 30, fontWeight: 300, color: "#9A9A9A", marginTop: 22, letterSpacing: 6 }}>
            <BlurIn start={26}>DIREÇÃO VISUAL &amp; DESIGN</BlurIn>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SCENES = { ola: 0, nome: 48, verde: 110, crio: 180, solo: 282, logo: 306 };

export const JaimeIntro: React.FC<{ name: string }> = ({ name }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const at = (start: number, end: number, node: React.ReactNode) =>
    f >= start && f < end ? (
      <AbsoluteFill key={start}>
        <Shift by={start}>{node}</Shift>
      </AbsoluteFill>
    ) : null;
  return (
    <AbsoluteFill style={{ backgroundColor: C.dark }}>
      {at(0, 60, <SceneOla />)}
      {at(SCENES.nome, 112, <SceneNome name={name} />)}
      {at(SCENES.verde, 190, <SceneVerde />)}
      {at(SCENES.crio, 290, <SceneCrio />)}
      {at(SCENES.solo, 322, <SceneNomeSolo name={name} />)}
      {at(SCENES.logo, durationInFrames, <SceneLogo />)}
    </AbsoluteFill>
  );
};

// desloca o tempo dos filhos
const Shift: React.FC<{ by: number; children: React.ReactNode }> = ({ by, children }) => (
  <Sequence from={by} layout="none">
    {children}
  </Sequence>
);
