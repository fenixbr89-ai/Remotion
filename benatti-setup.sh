mkdir -p src docs
cat > src/Benatti.tsx << 'EOF'
import React from "react";
import {
  AbsoluteFill,
  Audio,
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
//  TIMING — duração de cada cena em frames (30 = 1 segundo)
// ============================================================
export const BENATTI_FPS = 30;
const TRANSITION = 14;

export const BENATTI_SCENES = {
  abertura: 162, //    0,0s –  5,4s
  categorias: 267, //  5,4s – 14,3s
  embalagens: 69, //  14,3s – 16,6s
  qualidade: 72, //   16,6s – 19,0s
  horario: 270, //    19,0s – 28,0s
  endereco: 258, //   28,0s – 36,6s
  whatsapp: 342, //   36,6s – 48,0s
};

// Narração (public/benatti-narracao.wav) cortada nas pausas naturais da voz.
// `at` = segundo do vídeo em que o trecho começa; from/to = trecho do áudio (s).
const NARRACAO = [
  { at: 1.0, from: 0, to: 12.85 }, //   abertura + categorias
  { at: 14.3, from: 12.85, to: 16.92 }, // embalagens + qualidade
  { at: 19.0, from: 16.92, to: 25.51 }, // horário
  { at: 28.0, from: 25.51, to: 42.2 }, //  endereço + WhatsApp
];

export const BENATTI_TOTAL = Object.values(BENATTI_SCENES).reduce(
  (a, b) => a + b,
  0,
);

// ============================================================
//  DADOS DA EMPRESA
// ============================================================
const INFO = {
  nome: "Benatti",
  sub: "FRIOS E EMBALAGENS",
  whatsapp: "(62) 99376-2140",
  horarios: [
    { dia: "SEG A SÁB", hora: "06:30 ÀS 21:30" },
    { dia: "DOMINGO", hora: "07:00 ÀS 21:00" },
  ],
  endereco1: "Av. das Paineiras, Qd. 96, Lt. 12",
  endereco2: "Próximo à feira de quinta",
  endereco3: "St. Pontakayana · Trindade – GO",
};

// ============================================================
//  ESTILO
// ============================================================
const C = {
  red: "#D7191F",
  redDark: "#8E0B10",
  redLight: "#F0352B",
  gold: "#F7C431",
  goldDark: "#C9971A",
  white: "#FFFFFF",
  cream: "#FFF6E0",
  green: "#25D366",
};
const SANS = '"Montserrat", "Arial Black", "Helvetica Neue", Arial, sans-serif';
const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const GOLD_GRAD = `linear-gradient(180deg, #FFE27A 0%, ${C.gold} 45%, ${C.goldDark} 100%)`;
const SHADOW = "0 18px 40px rgba(60,0,0,0.45)";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const POP = { damping: 10, stiffness: 140, mass: 0.7 };
const SOFT = { damping: 16, stiffness: 110, mass: 0.9 };

const useSpr = (delay = 0, config = POP) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};
const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });

// ============================================================
//  FUNDO: vermelho com raios dourados girando + brilhos
// ============================================================
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${C.redLight} 0%, ${C.red} 45%, ${C.redDark} 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -660,
          top: -260,
          width: 2400,
          height: 2400,
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,215,90,0.10) 0deg 8deg, transparent 8deg 22deg)",
          transform: `rotate(${frame * 0.15}deg)`,
          maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
        }}
      />
      {new Array(14).fill(0).map((_, i) => {
        const x = random(`sx${i}`) * 1080;
        const y = random(`sy${i}`) * 1920;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 14 + i));
        const size = 18 + random(`ss${i}`) * 26;
        return <Sparkle key={i} x={x} y={y} size={size} opacity={tw * 0.8} />;
      })}
    </AbsoluteFill>
  );
};

const Sparkle: React.FC<{ x: number; y: number; size: number; opacity: number }> = ({
  x,
  y,
  size,
  opacity,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    style={{ position: "absolute", left: x, top: y, opacity }}
  >
    <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={C.gold} />
  </svg>
);

// ============================================================
//  PEÇAS REUTILIZÁVEIS
// ============================================================
const Ribbon: React.FC<{ text: string; delay?: number; size?: number }> = ({
  text,
  delay = 0,
  size = 52,
}) => {
  const s = useSpr(delay);
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${size * 0.3}px ${size * 0.8}px`,
        background: GOLD_GRAD,
        color: C.redDark,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 2,
        borderRadius: 14,
        boxShadow: SHADOW,
        transform: `scaleX(${s}) skewX(-6deg)`,
        opacity: Math.min(1, s * 2),
      }}
    >
      <span style={{ display: "inline-block", transform: "skewX(6deg)" }}>{text}</span>
    </div>
  );
};

const Title: React.FC<{ line1: string; line2?: string; top?: number }> = ({
  line1,
  line2,
  top = 170,
}) => {
  const s = useSpr(2);
  return (
    <div style={{ position: "absolute", top, width: "100%", textAlign: "center" }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1,
          color: C.white,
          textShadow: "0 8px 0 rgba(120,0,0,0.6), 0 20px 40px rgba(0,0,0,0.35)",
          transform: `translateY(${(1 - s) * -80}px) scale(${0.7 + 0.3 * s})`,
          opacity: Math.min(1, s * 1.5),
        }}
      >
        {line1}
      </div>
      {line2 ? (
        <div style={{ marginTop: 26 }}>
          <Ribbon text={line2} delay={10} size={44} />
        </div>
      ) : null}
    </div>
  );
};

const LogoBadge: React.FC<{ size: number; delay?: number }> = ({ size, delay = 0 }) => {
  const frame = useCurrentFrame();
  const s = useSpr(delay, { damping: 9, stiffness: 110, mass: 0.9 });
  const shine = interpolate(frame, [delay + 18, delay + 45], [-40, 140], CLAMP);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        padding: size * 0.035,
        background: GOLD_GRAD,
        boxShadow: `0 0 ${60 * s}px rgba(255,210,80,0.6), ${SHADOW}`,
        transform: `scale(${s}) rotate(${(1 - s) * -200}deg)`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          border: `${size * 0.02}px solid ${C.white}`,
          boxSizing: "border-box",
          background: C.red,
        }}
      >
        <Img
          src={staticFile("benatti-logo.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, transparent ${shine - 15}%, rgba(255,255,255,0.55) ${shine}%, transparent ${shine + 15}%)`,
          }}
        />
      </div>
    </div>
  );
};

// ---------- Ícones simples (SVG) ----------
const Icon: React.FC<{ kind: string; color?: string; size?: number }> = ({
  kind,
  color = C.red,
  size = 110,
}) => {
  const bg = C.white;
  const shapes: Record<string, React.ReactNode> = {
    carnes: (
      <>
        <path d="M18 55 C12 30 42 14 64 22 C86 30 90 60 72 74 C56 86 24 80 18 55Z" fill={color} />
        <path d="M30 52 C30 40 46 32 58 36" stroke={bg} strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={62} cy={52} r={9} fill={bg} />
      </>
    ),
    frios: (
      <>
        <path d="M12 70 L80 30 L88 70 Z" fill={color} />
        <rect x={12} y={70} width={76} height={10} fill={color} />
        <circle cx={60} cy={58} r={6} fill={bg} />
        <circle cx={44} cy={64} r={4} fill={bg} />
        <circle cx={74} cy={50} r={4} fill={bg} />
      </>
    ),
    frango: (
      <>
        <ellipse cx={40} cy={42} rx={26} ry={22} transform="rotate(-35 40 42)" fill={color} />
        <rect x={52} y={52} width={10} height={28} rx={5} transform="rotate(-45 57 66)" fill={color} />
        <circle cx={74} cy={80} r={7} fill={color} />
        <circle cx={82} cy={72} r={7} fill={color} />
      </>
    ),
    mercearia: (
      <>
        <path d="M30 40 C30 18 70 18 70 40" stroke={color} strokeWidth={7} fill="none" />
        <path d="M14 40 L86 40 L76 84 L24 84 Z" fill={color} />
        <rect x={34} y={52} width={6} height={22} rx={3} fill={bg} />
        <rect x={47} y={52} width={6} height={22} rx={3} fill={bg} />
        <rect x={60} y={52} width={6} height={22} rx={3} fill={bg} />
      </>
    ),
    limpeza: (
      <>
        <rect x={32} y={40} width={34} height={46} rx={8} fill={color} />
        <rect x={40} y={26} width={18} height={16} fill={color} />
        <path d="M40 26 L40 16 L74 16 L74 26 Z" fill={color} />
        <path d="M74 18 L84 14 M76 22 L88 22 M74 26 L84 30" stroke={color} strokeWidth={4} strokeLinecap="round" />
        <rect x={38} y={54} width={22} height={16} rx={3} fill={bg} />
      </>
    ),
    festa: (
      <>
        <ellipse cx={42} cy={38} rx={20} ry={25} fill={color} />
        <ellipse cx={66} cy={46} rx={17} ry={21} fill={C.gold} />
        <path d="M42 63 L38 70 L46 70 Z M66 67 L62 73 L70 73 Z" fill={color} />
        <path d="M42 70 C46 80 38 86 44 94 M66 73 C62 82 70 86 64 94" stroke={color} strokeWidth={3} fill="none" />
      </>
    ),
    embalagens: (
      <>
        <path d="M50 14 L86 30 L50 46 L14 30 Z" fill={C.gold} />
        <path d="M14 30 L50 46 L50 88 L14 72 Z" fill={color} />
        <path d="M86 30 L50 46 L50 88 L86 72 Z" fill={C.redDark} />
        <path d="M32 22 L68 38 L68 52" stroke={bg} strokeWidth={5} fill="none" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {shapes[kind]}
    </svg>
  );
};

// ============================================================
//  SHELL: entrada com mola, câmera push-in, saída com zoom + blur
// ============================================================
const Shell: React.FC<{ dur: number; last?: boolean; children: React.ReactNode }> = ({
  dur,
  last,
  children,
}) => {
  const frame = useCurrentFrame();
  const enter = useSpr(0, SOFT);
  const exit = last
    ? 0
    : interpolate(frame, [dur, dur + TRANSITION], [0, 1], {
        ...CLAMP,
        easing: Easing.in(Easing.cubic),
      });
  const camera = interpolate(frame, [0, dur], [1, 1.05], CLAMP);
  const fadeOut = last ? interpolate(frame, [dur - 10, dur], [1, 0], CLAMP) : 1;
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <AbsoluteFill
        style={{
          transform: `translateX(${(1 - enter) * 700 - exit * 500}px) rotateY(${(1 - enter) * -25 + exit * 20}deg) scale(${camera * (0.85 + 0.15 * enter) * (1 + exit * 0.15)})`,
          opacity: Math.min(1, enter * 1.6) * (1 - exit) * fadeOut,
          filter: `blur(${exit * 10}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Faixa dourada diagonal que "varre" a tela na troca de cena
const Sweep: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, TRANSITION * 2], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -400,
          left: interpolate(p, [0, 1], [1500, -900]),
          width: 220,
          height: 2800,
          background: GOLD_GRAD,
          transform: "rotate(18deg)",
          boxShadow: "0 0 80px rgba(255,210,80,0.8)",
          opacity: interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -400,
          left: interpolate(p, [0, 1], [1800, -600]),
          width: 40,
          height: 2800,
          background: C.white,
          transform: "rotate(18deg)",
          opacity: interpolate(p, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0]),
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 1 — ABERTURA
// ============================================================
const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const name = INFO.nome.split("");
  const tag = useSpr(62);
  const ring = prog(frame, 0, 40);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <svg width={760} height={760} style={{ position: "absolute", top: 260 }}>
        <circle
          cx={380}
          cy={380}
          r={360}
          fill="none"
          stroke={C.gold}
          strokeWidth={6}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - ring}
          transform={`rotate(${-90 + frame * 0.6} 380 380)`}
          style={{ filter: "drop-shadow(0 0 14px rgba(255,210,80,0.9))" }}
        />
      </svg>
      <div style={{ position: "absolute", top: 340 }}>
        <LogoBadge size={600} delay={4} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1060,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {name.map((l, i) => {
          const s = spring({ frame: frame - 26 - i * 3, fps, config: POP });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 200,
                color: C.white,
                textShadow: "0 10px 0 rgba(110,0,0,0.6), 0 24px 40px rgba(0,0,0,0.35)",
                opacity: Math.min(1, s * 1.5),
                transform: `translateY(${(1 - s) * 140}px) rotate(${(1 - s) * 25}deg)`,
              }}
            >
              {l}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1330 }}>
        <Ribbon text={INFO.sub} delay={50} size={56} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1480,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 50,
          color: C.gold,
          letterSpacing: 4,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 40}px)`,
        }}
      >
        ~ Atacado e Varejo ~
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 2 — TUDO NUM SÓ LUGAR (categorias)
// ============================================================
const CATS = [
  { k: "carnes", t: "Carnes" },
  { k: "frios", t: "Frios" },
  { k: "frango", t: "Frango" },
  { k: "mercearia", t: "Mercearia" },
  { k: "limpeza", t: "Limpeza" },
  { k: "festa", t: "Artigos de Festa" },
  { k: "embalagens", t: "Embalagens" },
];

const Categorias: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const highlight = Math.floor(interpolate(frame, [30, 215], [0, 7], CLAMP));
  return (
    <AbsoluteFill>
      <Title line1="TUDO NUM" line2="SÓ LUGAR!" top={150} />
      {CATS.map((c, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const lastRow = i === 6;
        const x = lastRow ? 540 - 230 : 70 + col * 490;
        const y = 520 + row * 270;
        const s = spring({ frame: frame - 14 - i * 6, fps, config: POP });
        const on = highlight === i;
        const bump = on ? 1.06 : 1;
        return (
          <div
            key={c.k}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 460,
              height: 230,
              borderRadius: 30,
              background: C.white,
              border: `6px solid ${on ? C.gold : C.white}`,
              boxShadow: on ? `0 0 50px rgba(255,210,80,0.9), ${SHADOW}` : SHADOW,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 26px",
              boxSizing: "border-box",
              opacity: Math.min(1, s * 1.5),
              transform: `perspective(1000px) translateY(${(1 - s) * 160}px) rotateX(${(1 - s) * 60}deg) scale(${(0.6 + 0.4 * s) * bump})`,
            }}
          >
            <div
              style={{
                transform: `rotate(${on ? Math.sin(frame / 3) * 8 : 0}deg)`,
              }}
            >
              <Icon kind={c.k} size={130} />
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: c.t.length > 10 ? 40 : c.t.length > 8 ? 44 : 52,
                lineHeight: 1.05,
                color: C.red,
              }}
            >
              {c.t}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 3 — EMBALAGENS EM GERAL
// ============================================================
const Embalagens: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = useSpr(6);
  const open = prog(frame, 26, 46);
  const items = ["festa", "limpeza", "frios"];
  const badge = useSpr(60);
  return (
    <AbsoluteFill>
      <Title line1="EMBALAGENS" line2="EM GERAL" top={150} />
      <div
        style={{
          position: "absolute",
          left: 540 - 220,
          top: 820,
          width: 440,
          height: 360,
          transform: `scale(${box}) rotate(${(1 - box) * 20}deg)`,
          perspective: 900,
        }}
      >
        {items.map((k, i) => {
          const s = spring({ frame: frame - 40 - i * 7, fps, config: POP });
          const ang = (-30 + i * 30) * (Math.PI / 180);
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 150 + Math.sin(ang) * 260 * s,
                top: 40 - Math.cos(ang) * 300 * s,
                width: 140,
                height: 140,
                borderRadius: 70,
                background: C.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: SHADOW,
                opacity: s > 0.02 ? 1 : 0,
                transform: `scale(${s}) rotate(${(1 - s) * 180}deg)`,
              }}
            >
              <Icon kind={k} size={100} />
            </div>
          );
        })}
        {/* abas */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 60,
            width: 220,
            height: 70,
            background: C.goldDark,
            transformOrigin: "0% 100%",
            transform: `rotate(${-open * 130}deg)`,
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 60,
            width: 220,
            height: 70,
            background: C.goldDark,
            transformOrigin: "100% 100%",
            transform: `rotate(${open * 130}deg)`,
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 130,
            width: 440,
            height: 260,
            background: GOLD_GRAD,
            borderRadius: 14,
            boxShadow: SHADOW,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 80,
            color: C.redDark,
          }}
        >
          Benatti
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1300,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 54,
          color: C.white,
          lineHeight: 1.25,
          opacity: badge,
          transform: `translateY(${(1 - badge) * 60}px)`,
        }}
      >
        Pra sua casa
        <br />
        <span style={{ color: C.gold }}>e pro seu negócio</span>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 4 — QUALIDADE / VARIEDADE / CONFIANÇA + OFERTAS
// ============================================================
const SEALS = ["QUALIDADE", "VARIEDADE", "CONFIANÇA"];

const Qualidade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tag = useSpr(56, { damping: 6, stiffness: 90, mass: 0.8 });
  const swing = Math.sin(frame / 7) * 6 * Math.max(0, 1 - (frame - 56) / 80);
  return (
    <AbsoluteFill>
      <Title line1="O MELHOR" line2="PARA SUA MESA" top={150} />
      {SEALS.map((t, i) => {
        const s = spring({ frame: frame - 12 - i * 9, fps, config: POP });
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: 60 + i * 330,
              top: 560,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: GOLD_GRAD,
              boxShadow: `0 0 40px rgba(255,210,80,0.5), ${SHADOW}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${s}) rotate(${(1 - s) * -360}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 14,
                borderRadius: "50%",
                border: `4px dashed ${C.redDark}`,
                transform: `rotate(${frame * 1.2}deg)`,
              }}
            />
            <svg width={90} height={90} viewBox="0 0 100 100">
              <path
                d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z"
                fill={C.red}
              />
            </svg>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 34,
                color: C.redDark,
                marginTop: 8,
              }}
            >
              {t}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: 1010,
          width: 600,
          transformOrigin: "50% -60px",
          transform: `rotate(${swing + (1 - tag) * -40}deg) scale(${tag})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 290,
            top: -70,
            width: 20,
            height: 20,
            borderRadius: 10,
            background: C.gold,
          }}
        />
        <div
          style={{
            background: C.white,
            borderRadius: 30,
            padding: "36px 30px",
            textAlign: "center",
            boxShadow: SHADOW,
            border: `8px solid ${C.gold}`,
          }}
        >
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 76, color: C.red, lineHeight: 1 }}>
            OFERTAS
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.redDark, marginTop: 10 }}>
            TODA SEMANA
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 5 — HORÁRIO DE FUNCIONAMENTO
// ============================================================
const Clock: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const s = useSpr(4);
  const spin = interpolate(frame, [0, 50], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const minute = 720 * spin + 180; // termina apontando 6 (=:30)
  const hour = 60 * spin + 195; // ~6:30
  const ring = frame > 40 ? Math.sin(frame * 2.2) * 4 * Math.max(0, 1 - (frame - 40) / 25) : 0;
  return (
    <div style={{ transform: `scale(${s}) rotate(${ring}deg)`, width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx={60} cy={30} r={22} fill={C.gold} />
        <circle cx={140} cy={30} r={22} fill={C.gold} />
        <circle cx={100} cy={108} r={86} fill={C.gold} />
        <circle cx={100} cy={108} r={74} fill={C.white} />
        {new Array(12).fill(0).map((_, i) => (
          <rect
            key={i}
            x={98}
            y={40}
            width={4}
            height={i % 3 === 0 ? 14 : 8}
            fill={C.redDark}
            transform={`rotate(${i * 30} 100 108)`}
          />
        ))}
        <rect x={96} y={62} width={8} height={50} rx={4} fill={C.red} transform={`rotate(${hour} 100 108)`} />
        <rect x={98} y={46} width={4} height={66} rx={2} fill={C.redDark} transform={`rotate(${minute} 100 108)`} />
        <circle cx={100} cy={108} r={8} fill={C.gold} />
      </svg>
    </div>
  );
};

const Horario: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 170 }}>
        <Clock size={340} />
      </div>
      <div style={{ position: "absolute", top: 560, width: "100%", textAlign: "center" }}>
        <Title line1="HORÁRIO" line2="DE FUNCIONAMENTO" top={0} />
      </div>
      {INFO.horarios.map((h, i) => {
        const s = spring({ frame: frame - 30 - i * 14, fps, config: POP });
        const arrow = 20 * Math.sin(frame / 6);
        return (
          <div
            key={h.dia}
            style={{
              position: "absolute",
              top: 900 + i * 340,
              width: "100%",
              textAlign: "center",
              opacity: Math.min(1, s * 1.5),
              transform: `translateX(${(1 - s) * (i % 2 ? 900 : -900)}px)`,
            }}
          >
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: C.gold, letterSpacing: 2 }}>
              <span style={{ display: "inline-block", transform: `translateX(${arrow * 0.3}px)` }}>→</span>
              {`  ${h.dia}  `}
              <span style={{ display: "inline-block", transform: `translateX(${-arrow * 0.3}px)` }}>←</span>
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "18px 50px",
                border: `6px solid ${C.white}`,
                borderRadius: 20,
                background: "rgba(0,0,0,0.15)",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 96,
                color: C.white,
                letterSpacing: 2,
              }}
            >
              {h.hora}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 6 — ENDEREÇO
// ============================================================
const Endereco: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = useSpr(8, SOFT);
  const route = prog(frame, 25, 70);
  const pin = spring({ frame: frame - 55, fps, config: { damping: 7, stiffness: 160, mass: 0.8 } });
  const card = useSpr(36);
  const pulse = ((frame - 70) % 30) / 30;
  return (
    <AbsoluteFill>
      <Title line1="VENHA NOS" line2="VISITAR!" top={150} />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 560,
          width: 900,
          height: 560,
          perspective: 1400,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 26,
            background: "#F3EBD7",
            border: `10px solid ${C.gold}`,
            boxShadow: SHADOW,
            overflow: "hidden",
            transform: `rotateX(${30 + (1 - map) * 50}deg) scale(${0.7 + 0.3 * map})`,
            opacity: map,
          }}
        >
          <svg width={880} height={540} style={{ position: "absolute" }}>
            {[[40, 40], [300, 40], [560, 40], [40, 300], [300, 300], [560, 300]].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width={220} height={200} rx={12} fill={i % 3 === 1 ? "#B9D99A" : "#E2D8C0"} />
            ))}
            <path
              d="M 120 520 L 120 270 L 410 270 L 410 160"
              pathLength={1}
              stroke={C.gold}
              strokeWidth={14}
              strokeDasharray="1 1"
              strokeDashoffset={1 - route}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 120 520 L 120 270 L 410 270 L 410 160"
              stroke={C.redDark}
              strokeWidth={4}
              strokeDasharray="10 14"
              fill="none"
              opacity={route}
            />
          </svg>
          {frame > 70 ? (
            <div
              style={{
                position: "absolute",
                left: 410 - 60,
                top: 160 - 30,
                width: 120,
                height: 60,
                borderRadius: "50%",
                border: `4px solid ${C.red}`,
                transform: `scale(${1 + pulse})`,
                opacity: 1 - pulse,
              }}
            />
          ) : null}
        </div>
        <svg
          width={150}
          height={200}
          viewBox="0 0 60 80"
          style={{
            position: "absolute",
            left: 410 + 10 - 75,
            top: 60 - (1 - pin) * 500,
            opacity: frame > 55 ? 1 : 0,
            filter: "drop-shadow(0 14px 10px rgba(0,0,0,0.4))",
          }}
        >
          <path d="M30 78 C30 78 4 46 4 28 A26 26 0 0 1 56 28 C56 46 30 78 30 78Z" fill={C.red} stroke={C.white} strokeWidth={3} />
          <circle cx={30} cy={28} r={11} fill={C.white} />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 1220,
          background: C.white,
          borderRadius: 30,
          padding: "36px 40px",
          boxShadow: SHADOW,
          display: "flex",
          gap: 26,
          alignItems: "center",
          opacity: Math.min(1, card * 1.5),
          transform: `translateY(${(1 - card) * 200}px)`,
        }}
      >
        <svg width={80} height={106} viewBox="0 0 60 80" style={{ flexShrink: 0 }}>
          <path d="M30 78 C30 78 4 46 4 28 A26 26 0 0 1 56 28 C56 46 30 78 30 78Z" fill={C.red} />
          <circle cx={30} cy={28} r={11} fill={C.white} />
        </svg>
        <div style={{ fontFamily: SANS, color: "#2A2A2A", lineHeight: 1.3 }}>
          <div style={{ fontWeight: 900, fontSize: 44, color: C.red }}>{INFO.endereco1}</div>
          <div style={{ fontWeight: 700, fontSize: 36 }}>{INFO.endereco2}</div>
          <div style={{ fontWeight: 700, fontSize: 36 }}>{INFO.endereco3}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  CENA 7 — WHATSAPP + ENCERRAMENTO
// ============================================================
const Whatsapp: React.FC = () => {
  const frame = useCurrentFrame();
  const btn = useSpr(24);
  const num = useSpr(34);
  const pulse = 1 + 0.05 * Math.sin(frame / 5);
  const ring = ((frame - 30) % 36) / 36;
  const foot = useSpr(60);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 140 }}>
        <LogoBadge size={330} delay={2} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 560,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 82,
          color: C.white,
          textAlign: "center",
          lineHeight: 1.05,
          textShadow: "0 8px 0 rgba(120,0,0,0.6)",
          opacity: btn,
          transform: `scale(${0.7 + 0.3 * btn})`,
        }}
      >
        PEÇA PELO
        <br />
        <span style={{ color: C.gold }}>WHATSAPP</span>
      </div>
      <div style={{ position: "absolute", top: 830, width: 230, height: 230 }}>
        {frame > 30 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `8px solid ${C.green}`,
              transform: `scale(${1 + ring * 0.7})`,
              opacity: 1 - ring,
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: C.green,
            border: `8px solid ${C.white}`,
            boxShadow: SHADOW,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${btn * pulse}) rotate(${(1 - btn) * -90}deg)`,
          }}
        >
          <svg width={120} height={120} viewBox="0 0 24 24">
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
              fill={C.white}
            />
          </svg>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1140,
          padding: "30px 50px",
          background: C.white,
          borderRadius: 999,
          border: `8px solid ${C.gold}`,
          boxShadow: SHADOW,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 88,
          color: C.red,
          whiteSpace: "nowrap",
          transform: `scale(${num})`,
        }}
      >
        {INFO.whatsapp}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1380,
          width: "100%",
          textAlign: "center",
          opacity: foot,
          transform: `translateY(${(1 - foot) * 40}px)`,
        }}
      >
        <Ribbon text="ENTREGAS RÁPIDAS" delay={60} size={50} />
        <div
          style={{
            marginTop: 40,
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 58,
            color: C.white,
          }}
        >
          Benatti Frios e Embalagens
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  COMPOSIÇÃO
// ============================================================
const ORDER: { key: keyof typeof BENATTI_SCENES; C: React.FC }[] = [
  { key: "abertura", C: Abertura },
  { key: "categorias", C: Categorias },
  { key: "embalagens", C: Embalagens },
  { key: "qualidade", C: Qualidade },
  { key: "horario", C: Horario },
  { key: "endereco", C: Endereco },
  { key: "whatsapp", C: Whatsapp },
];

export const Benatti: React.FC = () => {
  let start = 0;
  const items = ORDER.map((s, i) => {
    const dur = BENATTI_SCENES[s.key];
    const last = i === ORDER.length - 1;
    const from = start;
    start += dur;
    return { ...s, dur, last, from };
  });
  return (
    <AbsoluteFill>
      <Background />
      {items.map(({ key, C: Scene, dur, last, from }) => (
        <Sequence key={key} from={from} durationInFrames={last ? dur : dur + TRANSITION} name={key}>
          <Shell dur={dur} last={last}>
            <Scene />
          </Shell>
        </Sequence>
      ))}
      {items.slice(1).map(({ key, from }) => (
        <Sequence key={`sweep-${key}`} from={from - TRANSITION} durationInFrames={TRANSITION * 2}>
          <Sweep />
        </Sequence>
      ))}
      {NARRACAO.map((n, i) => (
        <Sequence
          key={`voz-${i}`}
          from={Math.round(n.at * BENATTI_FPS)}
          durationInFrames={Math.round((n.to - n.from) * BENATTI_FPS)}
        >
          <Audio
            src={staticFile("benatti-narracao.wav")}
            trimBefore={Math.round(n.from * BENATTI_FPS)}
            trimAfter={Math.round(n.to * BENATTI_FPS)}
          />
        </Sequence>
      ))}
      {/* Trilha opcional: coloque public/benatti-trilha.mp3 e descomente
      <Audio src={staticFile("benatti-trilha.mp3")} volume={0.12} />
      */}
    </AbsoluteFill>
  );
};
EOF
cat > src/Root.tsx << 'EOF'
import { Composition } from "remotion";
import { Benatti, BENATTI_FPS, BENATTI_TOTAL } from "./Benatti";
import { FPS, Pixora, TOTAL_FRAMES } from "./Pixora";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Pixora"
        component={Pixora}
        durationInFrames={TOTAL_FRAMES} // 1590 = 53s × 30fps
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Benatti"
        component={Benatti}
        durationInFrames={BENATTI_TOTAL} // 1440 = 48s × 30fps
        fps={BENATTI_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
EOF
