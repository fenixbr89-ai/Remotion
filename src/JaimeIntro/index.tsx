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
  const text = "Hello";
  const typed = Math.min(text.length, Math.max(0, Math.floor((f - 4) / 5) + 1));
  // letra só entra no layout quando começa a aparecer
  const caretOn = Math.floor(f / 8) % 2 === 0 || f < 30;
  // caixa aparece
  const box = r(f, 0, 12, 0, 1, EO);
  // caixa cresce e vira o fundo claro da próxima cena
  const grow = r(f, 32, 50, 0, 1);
  const w = interpolate(grow, [0, 1], [700, 2000]);
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
            Text
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
            700 × 240
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
            opacity: 1 - r(f, 30, 40, 0, 1),
            filter: `blur(${r(f, 30, 40, 0, 12)}px)`,
          }}
        >
          {text
            .slice(0, typed)
            .split("")
            .map((ch, i) => {
              const s = 4 + i * 5;
              const p = r(f, s - 1, s + 6, 0.15, 1, EO);
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

/* ---------------- Silhueta original (perfil, óculos, barba) ---------------- */
const Silhueta: React.FC<{ style?: React.CSSProperties; glasses?: number }> = ({ style, glasses = 1 }) => (
  <svg viewBox="0 0 400 500" style={style}>
    <path
      fill={C.ink}
      d="M 20 500 C 30 440, 90 410, 130 400 C 140 380, 135 350, 120 330 C 95 300, 90 240, 100 200
         C 102 150, 140 112, 200 104 C 214 92, 236 94, 246 104 C 262 100, 282 108, 292 122
         C 306 128, 314 142, 315 160 C 322 180, 326 200, 325 215 C 330 228, 334 236, 333 245
         C 340 260, 352 280, 356 292 C 358 298, 352 303, 343 302 C 340 306, 342 312, 340 316
         C 346 320, 346 328, 340 332 C 345 336, 344 344, 338 348 C 344 366, 336 384, 316 392
         C 295 398, 272 397, 256 393 C 250 410, 252 430, 262 445 C 300 460, 360 470, 380 500 Z"
    />
    {/* textura do cabelo */}
    {[
      [130, 160, 26],
      [160, 128, 24],
      [196, 112, 20],
      [232, 108, 18],
      [268, 118, 18],
      [114, 196, 20],
    ].map(([x, y, rr]) => (
      <circle key={`${x}`} cx={x} cy={y} r={rr} fill={C.ink} />
    ))}
    {/* óculos: haste e frente da armação */}
    <path d="M 324 238 L 246 236" stroke={C.light} strokeWidth={4} strokeLinecap="round" opacity={glasses} />
    <rect x={326} y={222} width={16} height={36} rx={5} fill={C.ink} />
  </svg>
);

/* ---------------- Cena 2: silhueta + "I'm" + nome ---------------- */
const SceneNome: React.FC<{ name: string }> = ({ name }) => {
  const f = useCurrentFrame(); // local, começa no frame 45
  const rise = r(f, 0, 22, 1, 0);
  const shrink = r(f, 24, 44, 0, 1);
  const zoom = r(f, 0, 80, 1, 1.05, Easing.linear);
  const imOut = r(f, 22, 30, 0, 1);
    return (
    <AbsoluteFill style={{ backgroundColor: C.light, fontFamily, transform: `scale(${zoom})` }}>
      <Silhueta
        glasses={imOut}
        style={{
          position: "absolute",
          width: interpolate(shrink, [0, 1], [700, 420]),
          left: interpolate(shrink, [0, 1], [610, 880]),
          bottom: -rise * 900,
        }}
      />
      {/* "I'm" dentro da cabeça */}
      <div
        style={{
          position: "absolute",
          left: 977,
          top: 590 + rise * 900,
          transform: "translate(-50%, -50%)",
          fontSize: 150,
          fontWeight: 600,
          color: C.light,
          letterSpacing: -4,
          opacity: 1 - imOut,
          filter: `blur(${imOut * 12}px)`,
        }}
      >
        I&apos;m
      </div>
      {/* nome se montando */}
      <div
        style={{
          position: "absolute",
          right: 960 - 40,
          top: 640,
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: -4,
          color: C.ink,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {name.split("").map((ch, i) => {
          const s = 30 + i * 3;
          const p = r(f, s, s + 12, 0, 1, EO);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: p,
                filter: `blur(${(1 - p) * 12}px)`,
                transform: `translateY(${(1 - p) * 40}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            background: C.lime,
            marginLeft: 8,
            marginBottom: 18,
            transform: `scale(${spring({ frame: f - 48, fps: 30, config: { damping: 18 } })})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Cena 3: olho original (pálpebra abre, pupila engole a tela) ---------------- */
const SceneOlho: React.FC = () => {
  const f = useCurrentFrame(); // local, começa no frame 115
  const band = r(f, 0, 14, 0, 1); // faixa escura abrindo
  const open = r(f, 8, 26, 0, 1);
  const look = r(f, 22, 40, -70, 0);
  const dil = r(f, 34, 50, 1, 1.5);
  const dive = r(f, 44, 66, 0, 1, Easing.bezier(0.55, 0, 0.75, 0.2));
  const camScale = interpolate(dive, [0, 1], [1, 60]);
  const reveal = r(f, 62, 76, 0, 1);
  const bandH = interpolate(band, [0, 1], [0, 1080]);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AbsoluteFill style={{ backgroundColor: C.light }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 540 - bandH / 2,
          height: bandH,
          background: C.dark,
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="-480 -270 960 540"
          style={{
            position: "absolute",
            left: 0,
            top: 540 - bandH / 2 > 0 ? -(540 - bandH / 2) : 0,
            width: 1920,
            height: 1080,
            transform: `scale(${camScale})`,
            transformOrigin: `${960 + look * 2}px 540px`,
          }}
        >
          <defs>
            <clipPath id="olho-clip">
              <path
                d={`M -300 0 Q 0 ${-190 * open} 300 0 Q 0 ${170 * open} -300 0 Z`}
              />
            </clipPath>
            <radialGradient id="olho-esclera" cx="0" cy="20" r="320" gradientUnits="userSpaceOnUse">
              <stop offset="55%" stopColor={C.light} />
              <stop offset="100%" stopColor="#BDBDB8" />
            </radialGradient>
            <radialGradient id="olho-iris">
              <stop offset="0%" stopColor="#5E8F0E" />
              <stop offset="55%" stopColor={C.lime} />
              <stop offset="100%" stopColor="#7DB51C" />
            </radialGradient>
          </defs>
          <g clipPath="url(#olho-clip)">
            <rect x={-320} y={-200} width={640} height={400} fill="url(#olho-esclera)" />
            <g transform={`translate(${look} 0)`}>
              <circle r={92} fill="url(#olho-iris)" />
              {[78, 64, 50].map((rr) => (
                <circle key={rr} r={rr} fill="none" stroke="#4E7A0A" strokeOpacity={0.35} strokeWidth={2} />
              ))}
              <circle r={36 * dil} fill={C.ink} />
              <circle cx={30} cy={-34} r={13} fill="white" opacity={1 - dive} />
            </g>
          </g>
          {/* linha da pálpebra */}
          <path
            d={`M -300 0 Q 0 ${-190 * open} 300 0`}
            fill="none"
            stroke={C.dark}
            strokeWidth={6}
          />
        </svg>
      </div>
      {/* revelação clara a partir do centro da pupila */}
      <div
        style={{
          position: "absolute",
          left: 960 - reveal * 1200,
          top: 540 - reveal * 1200,
          width: reveal * 2400,
          height: reveal * 2400,
          borderRadius: "50%",
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

export const WORDS = ["Director", "Designer", "Thinker", "Partner"];
const STEP = 24;

const Wavy: React.FC<{ progress: number }> = ({ progress }) => {
  const d = Array.from({ length: 13 }, (_, i) => `${i === 0 ? "M" : "Q"} ${i === 0 ? 0 : i * 20 - 10} ${i === 0 ? 8 : i % 2 ? 0 : 16} ${i === 0 ? "" : `${i * 20} 8`}`).join(" ");
  return (
    <svg width={240} height={18} viewBox="0 0 240 18" style={{ position: "absolute", left: 0, bottom: -22 }}>
      <path d={d} fill="none" stroke={C.lime} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
    </svg>
  );
};

const SceneCrio: React.FC = () => {
  const f = useCurrentFrame(); // local, começa no frame 185
  const zoom = r(f, 0, 110, 1.05, 1, Easing.linear);
  const exit = r(f, 94, 106, 0, 1);
  const wav = r(f, 6, 26, 0, 1);
  return (
    <AbsoluteFill style={{ backgroundColor: C.light, fontFamily, color: C.ink, transform: `scale(${zoom})` }}>
      <div
        style={{
          position: "absolute",
          right: 960 + 10,
          top: 540,
          transform: "translateY(-50%)",
          fontSize: 92,
          fontWeight: 400,
          letterSpacing: -2,
          opacity: 1 - exit,
          filter: `blur(${exit * 12}px)`,
        }}
      >
        <BlurIn start={0}>Creative</BlurIn>
        <Wavy progress={wav} />
      </div>
      {WORDS.map((w, i) => {
        const s = 8 + i * STEP;
        const inP = r(f, s, s + 12, 0, 1);
        const outP = i === WORDS.length - 1 ? exit : r(f, s + STEP, s + STEP + 12, 0, 1);
        const icon = spring({ frame: f - s - 6, fps: 30, config: { damping: 16, stiffness: 160 } });
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: 960 + 10,
              top: 540,
              display: "flex",
              alignItems: "flex-start",
              transform: `translateY(calc(-50% + ${(1 - inP) * 70 - outP * 70}px))`,
              opacity: inP * (1 - outP),
              filter: `blur(${(1 - inP) * 10 + outP * 10}px)`,
            }}
          >
            <span style={{ fontSize: 92, fontWeight: 700, letterSpacing: -2.5, whiteSpace: "nowrap" }}>{w}</span>
            <div
              style={{
                width: 54,
                height: 54,
                marginLeft: 6,
                marginTop: -16,
                borderRadius: 16,
                background: C.lime,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${icon * 0.8}) rotate(${(1 - icon) * -25 + 10}deg)`,
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
            <BlurIn start={26}>VISUAL DIRECTION &amp; DESIGN</BlurIn>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SCENES = { ola: 0, nome: 45, olho: 115, crio: 185, solo: 285, logo: 310 };

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
      {at(0, 52, <SceneOla />)}
      {at(SCENES.nome, 117, <SceneNome name={name} />)}
      {at(SCENES.olho, 193, <SceneOlho />)}
      {at(SCENES.crio, 295, <SceneCrio />)}
      {at(SCENES.solo, 326, <SceneNomeSolo name={name} />)}
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
