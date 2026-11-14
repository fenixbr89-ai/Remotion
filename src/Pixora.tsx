import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================
//  TIMING — ajuste aqui para casar com a narração (em frames, 30fps)
// ============================================================
export const FPS = 30;
export const TRANSITION = 15; // sobreposição entre cenas (frames)

export const SCENES = {
  abertura: 90, //  0,0s –  3,0s
  cenas: 240, //    3,0s – 11,0s
  cores: 135, //   11,0s – 15,5s
  camadas: 165, // 15,5s – 21,0s
  palavra: 180, // 21,0s – 27,0s
  conecta: 330, // 27,0s – 38,0s
  exporta: 315, // 38,0s – 48,5s
  final: 135, //   48,5s – 53,0s
};

export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);

// Legendas (palavra a palavra) de cada cena — edite para bater com a fala
const CAPTIONS: Record<keyof typeof SCENES, string[]> = {
  abertura: ["vídeo", "motion", "graphics"],
  cenas: ["divide", "em", "quatro", "demonstração", "e", "chamada"],
  cores: ["escolhe", "uma", "paleta,", "branco", "pra", "leitura"],
  camadas: ["Anima", "posição,", "escala", "e", "opacidade"],
  palavra: ["uma", "palavra", "de", "cada", "vez", "no", "ritmo"],
  conecta: ["conecta", "as", "cenas", "com", "movimento,", "não", "corte"],
  exporta: ["exporta", "e", "revê", "no", "celular"],
  final: ["movimento", "e", "acabamento"],
};

// ============================================================
//  ESTILO
// ============================================================
const C = {
  bg: "#0A0A0A",
  lime: "#D7FF1E",
  white: "#FFFFFF",
  card: "#1A1A1A",
  border: "rgba(255,255,255,0.12)",
  gray: "#8C8C8C",
};
const FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';
const GLOW = `0 0 24px ${C.lime}88, 0 0 60px ${C.lime}44`;
const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const POP = { damping: 10, stiffness: 140, mass: 0.7 }; // com overshoot
const SOFT = { damping: 16, stiffness: 110, mass: 0.9 };

const useSpring = (delay = 0, config = POP) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

const draw = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

const bez = (t: number, a: number, b: number, c: number, d: number) =>
  (1 - t) ** 3 * a +
  3 * (1 - t) ** 2 * t * b +
  3 * (1 - t) * t ** 2 * c +
  t ** 3 * d;

// ============================================================
//  BASE: fundo, cabeçalho, legenda, shell de cena
// ============================================================
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.09 + 0.03 * Math.sin(frame / 25);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(circle at 50% 45%, rgba(215,255,30,${pulse}) 0%, rgba(215,255,30,0.02) 38%, transparent 60%)`,
      }}
    />
  );
};

const Header: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const frame = useCurrentFrame();
  const s = useSpring(4, SOFT);
  const line = draw(frame, 8, 26);
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        width: "100%",
        textAlign: "center",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          color: C.white,
          fontSize: 62,
          fontWeight: 900,
          letterSpacing: 2,
          textTransform: "uppercase",
          opacity: s,
          transform: `translateY(${(1 - s) * -40}px)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          margin: "18px auto 0",
          width: 120 * line,
          height: 4,
          borderRadius: 2,
          background: C.lime,
          boxShadow: GLOW,
        }}
      />
      <div
        style={{
          marginTop: 16,
          color: C.gray,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: line,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

const Captions: React.FC<{ words: string[]; dur: number }> = ({
  words,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 8;
  const end = dur - 12;
  const step = (end - start) / words.length;
  const active = Math.min(
    words.length - 1,
    Math.floor(interpolate(frame, [start, end], [0, words.length], CLAMP)),
  );
  return (
    <div
      style={{
        position: "absolute",
        bottom: 230,
        left: 70,
        right: 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 14,
        fontFamily: FONT,
      }}
    >
      {words.map((w, i) => {
        const appear = start + i * step;
        if (frame < appear) return null;
        const s = spring({ frame: frame - appear, fps, config: POP });
        const on = i === active;
        return (
          <div
            key={i}
            style={{
              padding: "14px 28px",
              borderRadius: 999,
              fontSize: 42,
              fontWeight: 800,
              background: on ? C.lime : C.card,
              color: on ? "#000" : C.white,
              border: `1.5px solid ${on ? C.lime : C.border}`,
              boxShadow: on ? GLOW : "none",
              transform: `translateY(${(1 - s) * 30}px) scale(${0.6 + 0.4 * s})`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};

// Envolve cada cena: entrada com mola, câmera push-in, saída ease-in
const Shell: React.FC<{
  dur: number;
  last?: boolean;
  title?: string;
  sub?: string;
  words: string[];
  children: React.ReactNode;
}> = ({ dur, last, title, sub, words, children }) => {
  const frame = useCurrentFrame();
  const enter = useSpring(0, SOFT);
  const exit = last
    ? 0
    : interpolate(frame, [dur, dur + TRANSITION], [0, 1], {
        ...CLAMP,
        easing: Easing.in(Easing.cubic),
      });
  const camera = interpolate(frame, [0, dur], [1, 1.05], CLAMP);
  const fadeOut = last ? interpolate(frame, [dur - 12, dur], [1, 0], CLAMP) : 1;
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <AbsoluteFill
        style={{
          transformOrigin: "50% 50%",
          transform: `translateY(${(1 - enter) * 260 - exit * 320}px) rotateX(${(1 - enter) * 16 - exit * 12}deg) scale(${camera * (0.88 + 0.12 * enter) * (1 + exit * 0.1)})`,
          opacity: Math.min(1, enter * 1.6) * (1 - exit) * fadeOut,
          filter: `blur(${exit * 10 + (1 - Math.min(1, enter * 1.3)) * 6}px)`,
        }}
      >
        {children}
        {title && sub ? <Header title={title} sub={sub} /> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: (1 - exit) * fadeOut }}>
        <Captions words={words} dur={dur} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Traço limão que "puxa" a cena seguinte de baixo para cima
const Pull: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, TRANSITION * 2], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const y = interpolate(p, [0, 1], [2100, -900]);
  const op = interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <div
        style={{
          position: "absolute",
          left: 537,
          top: y,
          width: 6,
          height: 800,
          borderRadius: 3,
          background: `linear-gradient(to bottom, ${C.lime}, ${C.lime}00)`,
          boxShadow: GLOW,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 522,
          top: y - 18,
          width: 36,
          height: 36,
          borderRadius: 18,
          background: C.lime,
          boxShadow: GLOW,
        }}
      />
    </AbsoluteFill>
  );
};

const Card: React.FC<{
  style?: React.CSSProperties;
  active?: boolean;
  children?: React.ReactNode;
}> = ({ style, active, children }) => (
  <div
    style={{
      position: "absolute",
      background: C.card,
      borderRadius: 28,
      border: `2px solid ${active ? C.lime : C.border}`,
      boxShadow: active ? GLOW : "0 30px 60px rgba(0,0,0,0.45)",
      fontFamily: FONT,
      color: C.white,
      ...style,
    }}
  >
    {children}
  </div>
);

// ============================================================
//  CENA 1 — ABERTURA
// ============================================================
const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = useSpring(0, SOFT);
  const ideia = useSpring(18);
  const line = draw(frame, 26, 44);
  const mov = useSpring(36);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 270,
          top: 470,
          width: 540,
          height: 540,
          transform: `scale(${ring}) rotate(${frame * 0.8}deg)`,
        }}
      >
        <svg width={540} height={540}>
          <circle
            cx={270}
            cy={270}
            r={250}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={5}
            strokeDasharray="1 18"
            strokeLinecap="round"
          />
          <circle
            cx={270}
            cy={270}
            r={250}
            fill="none"
            stroke={C.lime}
            strokeWidth={5}
            strokeDasharray="160 1411"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 10px ${C.lime})` }}
          />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 740 - 130,
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const s = spring({
            frame: frame - 4 - i * 4,
            fps,
            config: POP,
          });
          const center = i === 2;
          const h =
            (center ? 230 : 90 + 60 * Math.abs(2 - i)) *
            (0.55 + 0.45 * Math.abs(Math.sin(frame * 0.12 + i * 1.3)));
          return (
            <div
              key={i}
              style={{
                width: 34,
                height: h * s,
                borderRadius: 17,
                background: center ? C.lime : C.white,
                boxShadow: center ? GLOW : "none",
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1080,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: C.white,
            letterSpacing: 6,
            opacity: ideia,
            transform: `translateY(${(1 - ideia) * 60}px)`,
          }}
        >
          IDEIA
        </div>
        <div
          style={{
            margin: "14px auto",
            width: 460 * line,
            height: 8,
            borderRadius: 4,
            background: C.lime,
            boxShadow: GLOW,
          }}
        />
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: C.lime,
            letterSpacing: 6,
            textShadow: GLOW,
            opacity: Math.min(1, mov * 1.5),
            transform: `translateY(${(1 - mov) * 80}px) scale(${0.8 + 0.2 * mov})`,
          }}
        >
          MOVIMENTO
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 2 — PENSA EM CENAS
// ============================================================
const STEPS = [
  { n: "01", t: "Gancho", d: "Prende em 2 segundos" },
  { n: "02", t: "Explicação", d: "O que é e por quê" },
  { n: "03", t: "Demonstração", d: "Mostra na prática" },
  { n: "04", t: "Chamada", d: "Diz o próximo passo" },
];
const STEP_POS = [
  { x: 70, y: 470 },
  { x: 590, y: 720 },
  { x: 70, y: 970 },
  { x: 590, y: 1220 },
];
const CARD_W = 420;
const CARD_H = 200;

const Cenas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = STEP_POS.map((p) => ({ x: p.x + CARD_W / 2, y: p.y + CARD_H / 2 }));
  const d = `M ${c[0].x} ${c[0].y} C 540 ${c[0].y}, 540 ${c[1].y}, ${c[1].x} ${c[1].y} C 540 ${c[1].y}, 540 ${c[2].y}, ${c[2].x} ${c[2].y} C 540 ${c[2].y}, 540 ${c[3].y}, ${c[3].x} ${c[3].y}`;
  const p = interpolate(frame, [15, 175], [0, 1], CLAMP);
  const current = Math.min(3, Math.floor(p * 3 + 0.02));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={4}
          strokeDasharray="10 14"
        />
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke={C.lime}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - p}
          style={{ filter: `drop-shadow(0 0 12px ${C.lime})` }}
        />
      </svg>
      {STEPS.map((s, i) => {
        const delay = 15 + i * 53;
        const e = spring({ frame: frame - delay, fps, config: POP });
        const badge = spring({ frame: frame - delay - 8, fps, config: POP });
        return (
          <Card
            key={s.n}
            active={i === current && e > 0.5}
            style={{
              left: STEP_POS[i].x,
              top: STEP_POS[i].y,
              width: CARD_W,
              height: CARD_H,
              opacity: Math.min(1, e * 1.5),
              transform: `perspective(1200px) translateY(${(1 - e) * 80}px) rotate(${(1 - e) * (i % 2 ? 8 : -8)}deg) rotateY(${(1 - e) * 30}deg) scale(${0.6 + 0.4 * e})`,
              padding: "34px 34px 0 140px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 34,
                top: 50,
                width: 84,
                height: 84,
                borderRadius: 42,
                background: C.lime,
                color: "#000",
                fontSize: 34,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: GLOW,
                transform: `scale(${badge}) rotate(${(1 - badge) * -90}deg)`,
              }}
            >
              {s.n}
            </div>
            <div style={{ fontSize: 46, fontWeight: 900 }}>{s.t}</div>
            <div
              style={{
                fontSize: 26,
                color: C.gray,
                marginTop: 10,
                fontWeight: 600,
              }}
            >
              {s.d}
            </div>
          </Card>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 3 — MENOS CORES, MAIS IMPACTO
// ============================================================
const SWATCHES = [
  { name: "Preto", hex: "#0A0A0A" },
  { name: "Branco", hex: "#FFFFFF" },
  { name: "Limão", hex: C.lime },
];

const Cores: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const focus = interpolate(frame, [55, 70], [0, 1], CLAMP);
  const btn = useSpring(68);
  const pulse = 1 + 0.08 * Math.sin(frame * 0.3);
  const ring = ((frame - 70) % 30) / 30;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {SWATCHES.map((s, i) => {
        const e = spring({ frame: frame - 8 - i * 14, fps, config: POP });
        const isLime = i === 2;
        const dim = isLime ? 1 : 1 - focus * 0.5;
        return (
          <Card
            key={s.name}
            active={isLime && focus > 0.5}
            style={{
              left: 75 + i * 320,
              top: 500,
              width: 290,
              height: 520,
              overflow: "hidden",
              opacity: Math.min(1, e * 1.5) * dim,
              transform: `perspective(1200px) translateY(${(1 - e) * 140}px) rotateY(${(1 - e) * -50}deg) scale(${isLime ? 1 + focus * 0.07 : 1})`,
              boxShadow:
                isLime && focus > 0
                  ? `0 0 ${80 * focus}px ${C.lime}aa`
                  : undefined,
            }}
          >
            <div
              style={{
                height: 330,
                background: s.hex,
                borderBottom: `2px solid ${C.border}`,
              }}
            />
            <div style={{ padding: 28 }}>
              <div style={{ fontSize: 44, fontWeight: 900 }}>{s.name}</div>
              <div
                style={{
                  fontSize: 24,
                  color: C.gray,
                  marginTop: 8,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                {s.hex.toUpperCase()}
              </div>
            </div>
          </Card>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 1140,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
          opacity: Math.min(1, btn * 1.4),
          transform: `translateY(${(1 - btn) * 60}px) scale(${0.7 + 0.3 * btn})`,
        }}
      >
        <div style={{ position: "relative", width: 96, height: 96 }}>
          {frame > 70 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 48,
                border: `3px solid ${C.lime}`,
                transform: `scale(${1 + ring * 0.8})`,
                opacity: 1 - ring,
              }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 48,
              background: C.lime,
              color: "#000",
              fontSize: 64,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: GLOW,
              transform: `scale(${pulse})`,
            }}
          >
            !
          </div>
        </div>
        <div
          style={{
            padding: "26px 44px",
            borderRadius: 999,
            border: `3px solid ${C.lime}`,
            color: C.lime,
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: 2,
            boxShadow: GLOW,
          }}
        >
          UM FOCO DE CADA VEZ
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 4 — MONTA EM CAMADAS
// ============================================================
const LAYERS = ["Textura / Detalhe", "Formas + Ícones", "Tipografia"]; // baixo → cima
const TABS = ["Posição", "Escala", "Opacidade"];

const Camadas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // destaque: Tipografia → Formas → Textura
  const hl = frame < 28 ? -1 : 2 - Math.min(2, Math.floor((frame - 28) / 16));
  const graph = useSpring(62, SOFT);
  const curve = draw(frame, 72, 98);
  const tabIdx = Math.max(0, Math.min(2, Math.floor((frame - 82) / 26)));
  const t = interpolate(frame - 82 - tabIdx * 26, [0, 22], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const P = [
    [20, 250],
    [290, 250],
    [230, -20],
    [520, 40],
  ];
  const dx = bez(t, P[0][0], P[1][0], P[2][0], P[3][0]);
  const dy = bez(t, P[0][1], P[1][1], P[2][1], P[3][1]);
  const v = (250 - dy) / 210;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 400,
          height: 520,
          perspective: 1600,
        }}
      >
        {LAYERS.map((name, i) => {
          const e = spring({ frame: frame - 4 - i * 7, fps, config: POP });
          const on = hl === i;
          const lift = spring({
            frame: on ? frame - (28 + (2 - i) * 16) : 0,
            fps,
            config: POP,
          });
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: 540 - 230,
                top: 300 - i * 150 - (on ? lift * 40 : 0),
                width: 460,
                height: 250,
                borderRadius: 28,
                background: on ? "#20230F" : C.card,
                border: `3px solid ${on ? C.lime : C.border}`,
                boxShadow: on ? GLOW : "0 40px 60px rgba(0,0,0,0.6)",
                transform: `translateX(${(1 - e) * -900}px) rotateX(58deg) rotateZ(-38deg)`,
                opacity: Math.min(1, e * 1.5),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                fontWeight: 900,
                color: on ? C.lime : C.white,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
      <Card
        style={{
          left: 90,
          top: 960,
          width: 900,
          height: 440,
          opacity: graph,
          transform: `translateY(${(1 - graph) * 120}px) scale(${0.9 + 0.1 * graph})`,
        }}
      >
        <div style={{ display: "flex", gap: 14, padding: "26px 30px 0" }}>
          {TABS.map((tab, i) => {
            const on = frame >= 82 && tabIdx === i;
            return (
              <div
                key={tab}
                style={{
                  padding: "12px 26px",
                  borderRadius: 999,
                  fontSize: 28,
                  fontWeight: 800,
                  background: on ? C.lime : "transparent",
                  color: on ? "#000" : C.gray,
                  border: `2px solid ${on ? C.lime : C.border}`,
                  boxShadow: on ? GLOW : "none",
                }}
              >
                {tab}
              </div>
            );
          })}
        </div>
        <svg
          width={560}
          height={280}
          style={{ position: "absolute", left: 30, top: 120, overflow: "visible" }}
        >
          {[0, 1, 2, 3].map((g) => (
            <line
              key={g}
              x1={0}
              x2={540}
              y1={40 + g * 70}
              y2={40 + g * 70}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={2}
            />
          ))}
          <path
            d={`M ${P[0]} C ${P[1]} ${P[2]} ${P[3]}`}
            pathLength={1}
            fill="none"
            stroke={C.lime}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="1 1"
            strokeDashoffset={1 - curve}
            style={{ filter: `drop-shadow(0 0 10px ${C.lime})` }}
          />
          {frame >= 82 ? (
            <circle cx={dx} cy={dy} r={14} fill={C.white} stroke={C.lime} strokeWidth={5} />
          ) : null}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 130,
            width: 220,
            height: 270,
            borderRadius: 20,
            border: `2px dashed ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 18,
              background: C.lime,
              boxShadow: GLOW,
              transform:
                tabIdx === 0
                  ? `translateY(${(1 - v) * 90}px)`
                  : tabIdx === 1
                    ? `scale(${0.3 + 0.9 * v})`
                    : "none",
              opacity: tabIdx === 2 ? Math.max(0.05, Math.min(1, v)) : 1,
            }}
          />
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 5 — PALAVRA A PALAVRA
// ============================================================
const Palavra: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = "PALAVRA".split("");
  const bars = 44;
  const W = 900;
  const play = interpolate(frame, [20, 170], [0, W], CLAMP);
  const tagA = useSpring(40);
  const tagB = useSpring(52);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          top: 520,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          perspective: 900,
        }}
      >
        {word.map((l, i) => {
          const s = spring({ frame: frame - 6 - i * 3, fps, config: POP });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: 190,
                fontWeight: 900,
                color: C.lime,
                textShadow: GLOW,
                opacity: Math.min(1, s * 1.5),
                transform: `translateY(${(1 - s) * 120}px) rotateX(${(1 - s) * -80}deg)`,
              }}
            >
              {l}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 860,
          width: W,
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {new Array(bars).fill(0).map((_, i) => {
          const x = (i / (bars - 1)) * W;
          const base = 0.3 + 0.7 * random(`bar-${i}`);
          const env = Math.sin((i / bars) * Math.PI);
          const h =
            16 + 260 * base * env * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.16 + i * 0.6)));
          const e = spring({ frame: frame - 10 - i * 0.6, fps, config: SOFT });
          const past = x <= play;
          return (
            <div
              key={i}
              style={{
                width: 11,
                height: h * e,
                borderRadius: 6,
                background: past ? C.lime : "rgba(255,255,255,0.3)",
                boxShadow: past ? `0 0 12px ${C.lime}88` : "none",
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: play - 3,
            top: -30,
            width: 6,
            height: 360,
            borderRadius: 3,
            background: C.lime,
            boxShadow: GLOW,
            opacity: frame > 18 ? 1 : 0,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1230,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            padding: "20px 46px",
            borderRadius: 999,
            border: `3px solid ${C.lime}`,
            color: C.lime,
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 4,
            transform: `translateX(${(1 - tagA) * -600}px) rotate(${(1 - tagA) * -10}deg)`,
          }}
        >
          RITMO
        </div>
        <div
          style={{
            padding: "20px 46px",
            borderRadius: 999,
            background: C.lime,
            color: "#000",
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 4,
            boxShadow: GLOW,
            transform: `translateX(${(1 - tagB) * 600}px) rotate(${(1 - tagB) * 10}deg)`,
          }}
        >
          IDEIA
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 6 — CONECTA, NÃO CORTA
// ============================================================
const TRANS = ["Faixa", "Diagonal", "Corte", "Zoom"];
const GRID = [
  { x: 70, y: 450 },
  { x: 560, y: 450 },
  { x: 70, y: 940 },
  { x: 560, y: 940 },
];
const G = 450;
const ACT0 = 30;
const ACT_STEP = 70;

const MiniDemo: React.FC<{ kind: number; q: number }> = ({ kind, q }) => {
  let bStyle: React.CSSProperties = {};
  let band: React.ReactNode = null;
  if (kind === 0) {
    bStyle = { clipPath: `inset(0 ${100 - q * 100}% 0 0)` };
    band = (
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `calc(${q * 100}% - 18px)`,
          width: 36,
          background: C.lime,
          boxShadow: GLOW,
          opacity: q > 0 && q < 1 ? 1 : 0,
        }}
      />
    );
  } else if (kind === 1) {
    const k = q * 200;
    bStyle = {
      clipPath: `polygon(0 0, ${k}% 0, ${k - 100}% 100%, 0 100%)`,
    };
  } else if (kind === 2) {
    bStyle = { opacity: q >= 0.5 ? 1 : 0 };
    band =
      q > 0.45 && q < 0.6 ? (
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.6 }} />
      ) : null;
  } else {
    bStyle = { transform: `scale(${q})`, borderRadius: 16 * (1 - q) };
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 50,
        width: 350,
        height: 250,
        borderRadius: 18,
        overflow: "hidden",
        background: "#2A2A2A",
      }}
    >
      <div style={{ position: "absolute", left: 30, top: 40, width: 160, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.35)" }} />
      <div style={{ position: "absolute", left: 30, top: 80, width: 230, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.2)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.lime,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
          fontSize: 40,
          fontWeight: 900,
          ...bStyle,
        }}
      >
        B
      </div>
      {band}
    </div>
  );
};

const Conecta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const centers = GRID.map((g) => ({ x: g.x + G / 2, y: g.y + G / 2 }));
  const active = Math.floor((frame - ACT0) / ACT_STEP);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {TRANS.map((name, i) => {
        const e = spring({ frame: frame - 4 - i * 5, fps, config: POP });
        const startA = ACT0 + i * ACT_STEP;
        const q = interpolate(frame, [startA + 8, startA + 48], [0, 1], {
          ...CLAMP,
          easing: Easing.inOut(Easing.cubic),
        });
        const on = active === i;
        const pop = spring({ frame: frame - startA, fps, config: POP });
        return (
          <Card
            key={name}
            active={on}
            style={{
              left: GRID[i].x,
              top: GRID[i].y,
              width: G,
              height: G,
              opacity: Math.min(1, e * 1.5) * (on || frame < startA ? 1 : 0.85),
              transform: `perspective(1200px) translateY(${(1 - e) * 100}px) rotateX(${(1 - e) * 40}deg) scale(${(0.7 + 0.3 * e) * (on ? 1 + 0.05 * pop : 1)})`,
            }}
          >
            <MiniDemo kind={i} q={q} />
            <div
              style={{
                position: "absolute",
                left: 50,
                bottom: 46,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  background: on ? C.lime : "transparent",
                  border: `2px solid ${on ? C.lime : C.border}`,
                  color: on ? "#000" : C.gray,
                  fontSize: 24,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {`0${i + 1}`}
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: on ? C.lime : C.white }}>
                {name}
              </div>
            </div>
          </Card>
        );
      })}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[0, 1, 2].map((k) => {
          const a = centers[k];
          const b = centers[k + 1];
          const tEnd = ACT0 + (k + 1) * ACT_STEP;
          const p = draw(frame, tEnd - 22, tEnd);
          if (p <= 0) return null;
          const x = a.x + (b.x - a.x) * p;
          const y = a.y + (b.y - a.y) * p;
          return (
            <g key={k} style={{ filter: `drop-shadow(0 0 10px ${C.lime})` }}>
              <line x1={a.x} y1={a.y} x2={x} y2={y} stroke={C.lime} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
              {p < 1 ? <circle cx={x} cy={y} r={16} fill={C.lime} /> : null}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 7 — EXPORTA E REVÊ
// ============================================================
const CHECKS = [
  { t: "Ritmo", d: "cortes no tempo da fala" },
  { t: "Legibilidade", d: "texto grande e no centro" },
  { t: "Áudio", d: "voz acima da trilha" },
];

const Exporta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const outline = draw(frame, 4, 40);
  const phoneW = 380;
  const phoneH = 676; // 9:16
  const float = Math.sin(frame / 20) * 10;
  const playP = interpolate(frame, [40, 300], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 560,
          width: phoneW,
          height: phoneH,
          transform: `perspective(1400px) rotateY(14deg) translateY(${float}px)`,
        }}
      >
        <svg width={phoneW} height={phoneH} style={{ position: "absolute", overflow: "visible" }}>
          <rect
            x={3}
            y={3}
            width={phoneW - 6}
            height={phoneH - 6}
            rx={48}
            pathLength={1}
            fill="rgba(215,255,30,0.03)"
            stroke={C.lime}
            strokeWidth={6}
            strokeDasharray="1 1"
            strokeDashoffset={1 - outline}
            style={{ filter: `drop-shadow(0 0 12px ${C.lime})` }}
          />
          <rect x={phoneW / 2 - 50} y={22} width={100} height={18} rx={9} fill={C.lime} opacity={outline} />
        </svg>
        {[0.7, 0.9, 0.55, 0.8, 0.4].map((w, i) => {
          const s = spring({ frame: frame - 30 - i * 6, fps, config: POP });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 40,
                top: 90 + i * 60 + (i > 2 ? 220 : 0),
                width: (phoneW - 80) * w * s,
                height: 26,
                borderRadius: 13,
                background: i === 1 ? C.lime : "rgba(255,255,255,0.35)",
                boxShadow: i === 1 ? GLOW : "none",
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: phoneW / 2 - 50,
            top: 340,
            width: 0,
            height: 0,
            borderTop: "40px solid transparent",
            borderBottom: "40px solid transparent",
            borderLeft: `70px solid ${C.white}`,
            marginLeft: 20,
            opacity: outline,
          }}
        />
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 50, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)" }}>
          <div style={{ width: `${playP * 100}%`, height: "100%", borderRadius: 4, background: C.lime, boxShadow: GLOW }} />
        </div>
      </div>
      {CHECKS.map((c, i) => {
        const e = spring({ frame: frame - 20 - i * 8, fps, config: POP });
        const checkAt = 90 + i * 60;
        const ck = spring({ frame: frame - checkAt, fps, config: POP });
        const tick = draw(frame, checkAt, checkAt + 12);
        const done = frame >= checkAt;
        return (
          <Card
            key={c.t}
            active={done && frame < checkAt + 40}
            style={{
              left: 520,
              top: 600 + i * 210,
              width: 480,
              height: 170,
              opacity: Math.min(1, e * 1.5),
              transform: `translateX(${(1 - e) * 500}px) scale(${1 + (done ? 0.04 * Math.sin(Math.min(1, ck) * Math.PI) : 0)})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 30,
                top: 45,
                width: 80,
                height: 80,
                borderRadius: 20,
                border: `3px solid ${done ? C.lime : C.border}`,
                background: done ? C.lime : "transparent",
                boxShadow: done ? GLOW : "none",
                transform: `scale(${done ? 0.8 + 0.2 * ck : 1})`,
              }}
            >
              <svg width={80} height={80} style={{ position: "absolute", left: -3, top: -3 }}>
                <path
                  d="M 20 42 L 35 56 L 61 26"
                  pathLength={1}
                  fill="none"
                  stroke="#000"
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - tick}
                />
              </svg>
            </div>
            <div style={{ position: "absolute", left: 140, top: 38 }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: done ? C.lime : C.white }}>{c.t}</div>
              <div style={{ fontSize: 24, color: C.gray, fontWeight: 600, marginTop: 6 }}>{c.d}</div>
            </div>
          </Card>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 8 — ENCERRAMENTO
// ============================================================
const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = useSpring(2, { damping: 9, stiffness: 120, mass: 0.8 });
  const shine = interpolate(frame, [28, 58], [-60, 160], CLAMP);
  const sub = useSpring(48);
  const line = draw(frame, 50, 70);
  const glow = 0.5 + 0.2 * Math.sin(frame / 8);
  const SIZE = 560;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 380,
          top: 520 - 120,
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(215,255,30,${0.22 * glow * logo}) 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - SIZE / 2,
          top: 500,
          width: SIZE,
          height: SIZE,
          transform: `scale(${0.4 + 0.6 * logo}) rotate(${(1 - logo) * -14}deg)`,
          opacity: Math.min(1, logo * 1.5),
          filter: `blur(${Math.max(0, 1 - logo) * 12}px)`,
        }}
      >
        {/* O logo (P branco em fundo preto) vira máscara: o preto some e o P recebe o brilho */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, ${C.white} ${shine - 18}%, ${C.lime} ${shine}%, ${C.white} ${shine + 18}%)`,
            maskImage: `url(${staticFile("logo.png")})`,
            maskMode: "luminance",
            maskSize: "contain",
            WebkitMaskImage: `url(${staticFile("logo.png")})`,
            WebkitMaskSize: "contain",
            filter: `drop-shadow(0 0 30px ${C.lime}66)`,
          }}
        />
        {/* Pré-carrega o logo para o render esperar por ele */}
        <Img src={staticFile("logo.png")} style={{ width: 1, height: 1, opacity: 0 }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1110,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {"PIXORA".split("").map((l, i) => {
          const s = spring({ frame: frame - 22 - i * 3, fps, config: POP });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: 140,
                fontWeight: 900,
                color: C.white,
                letterSpacing: 18,
                opacity: Math.min(1, s * 1.5),
                transform: `translateY(${(1 - s) * 80}px) scale(${0.6 + 0.4 * s})`,
              }}
            >
              {l}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ margin: "0 auto 22px", width: 300 * line, height: 5, borderRadius: 3, background: C.lime, boxShadow: GLOW }} />
        <div
          style={{
            color: C.lime,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: 14,
            textShadow: GLOW,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 30}px)`,
          }}
        >
          MOTION GRAPHICS
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  COMPOSIÇÃO
// ============================================================
const ORDER: {
  key: keyof typeof SCENES;
  C: React.FC;
  title?: string;
  sub?: string;
}[] = [
  { key: "abertura", C: Abertura },
  { key: "cenas", C: Cenas, title: "PENSA EM CENAS", sub: "Roteiro em 4 blocos" },
  { key: "cores", C: Cores, title: "MENOS CORES, MAIS IMPACTO", sub: "Paleta de 3 tons" },
  { key: "camadas", C: Camadas, title: "MONTA EM CAMADAS", sub: "Profundidade + curvas" },
  { key: "palavra", C: Palavra, title: "PALAVRA A PALAVRA", sub: "Texto no ritmo da voz" },
  { key: "conecta", C: Conecta, title: "CONECTA, NÃO CORTA", sub: "4 transições" },
  { key: "exporta", C: Exporta, title: "EXPORTA E REVÊ", sub: "Checklist final" },
  { key: "final", C: Final },
];

export const Pixora: React.FC = () => {
  let start = 0;
  const items = ORDER.map((s, i) => {
    const dur = SCENES[s.key];
    const last = i === ORDER.length - 1;
    const from = start;
    start += dur;
    return { ...s, dur, last, from };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background />
      {items.map(({ key, C: Scene, title, sub, dur, last, from }) => (
        <Sequence
          key={key}
          from={from}
          durationInFrames={last ? dur : dur + TRANSITION}
          name={key}
        >
          <Shell dur={dur} last={last} title={title} sub={sub} words={CAPTIONS[key]}>
            <Scene />
          </Shell>
        </Sequence>
      ))}
      {items.slice(1).map(({ key, from }) => (
        <Sequence key={`pull-${key}`} from={from - TRANSITION} durationInFrames={TRANSITION * 2}>
          <Pull />
        </Sequence>
      ))}
      {/* Narração e trilha: descomente depois de colocar os arquivos em public/
      <Audio src={staticFile("narracao.mp3")} />
      <Audio src={staticFile("trilha.mp3")} volume={0.15} />
      */}
    </AbsoluteFill>
  );
};
