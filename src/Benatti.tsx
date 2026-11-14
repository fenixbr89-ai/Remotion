import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================
//  TEMPO — tudo em SEGUNDOS do vídeo
// ============================================================
export const BENATTI_FPS = 30;
const VOZ_INICIO = 1.0; // a narração começa 1s depois do início do vídeo
const DURACAO = 47.5; //   duração total (s)
export const BENATTI_TOTAL = Math.round(DURACAO * BENATTI_FPS);

// Início de cada cena (s). Ajuste aqui se trocar a narração.
const CENAS = {
  abertura: 0,
  produtos: 5.3,
  qualidade: 14.0,
  horario: 20.5,
  endereco: 26.5,
  whatsapp: 35.2,
  final: 43.4,
};

// Legenda sincronizada com a narração (tempos do ÁUDIO, em s).
// Palavras com * ficam em dourado.
const FRASES: [number, number, string][] = [
  [0.13, 1.96, "*Benatti Frios e Embalagens."],
  [1.96, 4.3, "Atacado e varejo, com *qualidade e *preço *justo."],
  [4.47, 6.85, "Aqui você encontra *carnes, *frios, *frango,"],
  [6.97, 8.85, "*mercearia, produtos de *limpeza,"],
  [9.04, 11.3, "*artigos *de *festa e *embalagens em geral."],
  [11.3, 12.76, "Tudo num *só *lugar!"],
  [12.94, 15.63, "*Embalagens pra sua *casa e pro seu *negócio."],
  [15.81, 17.68, "*Qualidade, *variedade e *confiança,"],
  [17.83, 19.41, "com *ofertas toda *semana."],
  [19.63, 20.96, "Nosso *horário: de *segunda a *sábado,"],
  [21.06, 22.88, "das *6h30 da manhã às *21h30 da noite."],
  [23.04, 25.42, "E aos *domingos, das *7h às *21h."],
  [25.6, 26.3, "Venha nos *visitar!"],
  [26.5, 28.18, "Estamos na *Av. *das *Paineiras,"],
  [28.29, 30.71, "*quadra *96, *lote *12, próximo à *feira de quinta,"],
  [30.82, 32.48, "no *Setor *Pontakayana,"],
  [32.59, 34.19, "em *Trindade, *Goiás."],
  [34.3, 36.05, "Faça seu pedido pelo *WhatsApp:"],
  [36.16, 39.3, "*(62) *99376-2140"],
  [39.3, 42.16, "*Benatti Frios e Embalagens: entregas *rápidas!"],
];

type Palavra = { txt: string; gold: boolean; t: number };
type Frase = { ini: number; fim: number; palavras: Palavra[] };

// Distribui as palavras de cada frase pelo tempo, proporcional ao tamanho
const LEGENDA: Frase[] = FRASES.map(([a, b, txt]) => {
  const ws = txt.split(" ");
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  const palavras = ws.map((w) => {
    const t = VOZ_INICIO + a + ((b - a) * acc) / total;
    acc += w.length + 1;
    return { txt: w.replace("*", ""), gold: w.startsWith("*"), t };
  });
  return { ini: VOZ_INICIO + a, fim: VOZ_INICIO + b, palavras };
});

// Momento (s do vídeo) em que uma palavra é falada, a partir de `depois`
const quando = (palavra: string, depois = 0) => {
  for (const f of LEGENDA) {
    for (const p of f.palavras) {
      if (p.t >= depois && p.txt.toLowerCase().startsWith(palavra.toLowerCase())) {
        return p.t;
      }
    }
  }
  return depois;
};

// ============================================================
//  ESTILO
// ============================================================
const C = {
  bg: "#0E0606",
  red: "#D7191F",
  redDark: "#7A0A0E",
  gold: "#F7C431",
  goldDark: "#C9971A",
  white: "#FFFFFF",
  card: "#1C0C0C",
  line: "rgba(255,255,255,0.12)",
  green: "#25D366",
  greenDark: "#128C4B",
};
const SANS = '"Montserrat", "Arial Black", "Helvetica Neue", Arial, sans-serif';
const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const GOLD = `linear-gradient(180deg, #FFE27A 0%, ${C.gold} 45%, ${C.goldDark} 100%)`;
const SHADOW = "0 24px 50px rgba(0,0,0,0.55)";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const POP = { damping: 11, stiffness: 150, mass: 0.7 };

const FPS = BENATTI_FPS;
const sec = (s: number) => Math.round(s * FPS);

// Tempo global (s) dentro de uma cena que começa em `start`
const useT = (start: number) => useCurrentFrame() / FPS + start;

// Mola que começa no segundo `at` (tempo global)
const sp = (t: number, at: number, config = POP) =>
  spring({ frame: (t - at) * FPS, fps: FPS, config });
const lin = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });

// ============================================================
//  CAMADAS FIXAS: fundo, abas de etapas, legenda
// ============================================================
const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = 0.32 + 0.06 * Math.sin(frame / 30);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(ellipse 70% 45% at 50% 58%, rgba(215,25,31,${p}) 0%, rgba(120,10,14,0.15) 55%, transparent 80%), radial-gradient(circle at 50% 110%, rgba(247,196,49,0.12) 0%, transparent 45%)`,
      }}
    />
  );
};

const ABAS = [
  { nome: "Produtos", at: CENAS.produtos },
  { nome: "Qualidade", at: CENAS.qualidade },
  { nome: "Horário", at: CENAS.horario },
  { nome: "Endereço", at: CENAS.endereco },
  { nome: "WhatsApp", at: CENAS.whatsapp },
];

const Abas: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const show = lin(t, CENAS.produtos - 0.2, CENAS.produtos + 0.3);
  const hide = lin(t, CENAS.final - 0.2, CENAS.final + 0.1);
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 10,
        fontFamily: SANS,
        opacity: show * (1 - hide),
        transform: `translateY(${(1 - show) * -60}px)`,
      }}
    >
      {ABAS.map((a, i) => {
        const prox = ABAS[i + 1]?.at ?? CENAS.final - 0.6;
        const ativa = t >= a.at && t < prox;
        const feita = t >= prox;
        const pop = sp(t, ativa ? a.at : feita ? prox : 999);
        return (
          <div
            key={a.nome}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 800,
              color: ativa || feita ? C.white : "rgba(255,255,255,0.45)",
              background: ativa ? "rgba(215,25,31,0.35)" : "rgba(255,255,255,0.06)",
              border: `2px solid ${ativa ? C.red : C.line}`,
              boxShadow: ativa ? "0 0 24px rgba(215,25,31,0.7)" : "none",
              transform: `scale(${ativa ? 1 + 0.06 * pop : 1})`,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: feita ? C.green : ativa ? C.red : "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontSize: 18,
                transform: `scale(${feita ? 0.6 + 0.4 * pop : 1})`,
              }}
            >
              {feita ? "✓" : ""}
            </div>
            {a.nome}
          </div>
        );
      })}
    </div>
  );
};

const Legenda: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const idx = LEGENDA.findIndex((f, i) => {
    const prox = LEGENDA[i + 1]?.ini ?? f.fim + 0.6;
    return t >= f.ini - 0.12 && t < prox - 0.05;
  });
  if (idx < 0 || t >= CENAS.final) return null;
  const f = LEGENDA[idx];
  const prox = LEGENDA[idx + 1]?.ini ?? f.fim + 0.6;
  const out = lin(t, prox - 0.2, prox - 0.05);
  return (
    <div
      style={{
        position: "absolute",
        top: 230,
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 16,
        rowGap: 4,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 60,
        lineHeight: 1.15,
        textAlign: "center",
        opacity: 1 - out,
        filter: `blur(${out * 12}px)`,
        transform: `translateY(${-out * 30}px)`,
      }}
    >
      {f.palavras.map((p, i) => {
        const k = interpolate(t, [p.t - 0.08, p.t + 0.14], [0, 1], CLAMP);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: p.gold ? C.gold : C.white,
              textShadow: p.gold ? "0 0 26px rgba(247,196,49,0.55)" : "0 4px 20px rgba(0,0,0,0.6)",
              opacity: k,
              filter: `blur(${(1 - k) * 12}px)`,
              transform: `translateY(${(1 - k) * 28}px) scale(${0.85 + 0.15 * k})`,
            }}
          >
            {p.txt}
          </span>
        );
      })}
    </div>
  );
};

// ============================================================
//  ILUSTRAÇÕES
// ============================================================
const Loja: React.FC<{ acesa: number; t: number }> = ({ acesa, t }) => {
  const flick = acesa < 1 ? (Math.sin(t * 60) > 0 ? 1 : 0.4) : 1;
  const luz = acesa * flick;
  const stripes = 10;
  return (
    <svg width={820} height={640} viewBox="0 0 820 640" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE3A3" />
          <stop offset="1" stopColor="#F2A93B" />
        </linearGradient>
      </defs>
      <rect x={60} y={200} width={700} height={410} rx={10} fill="#2A0E0F" />
      <rect x={210} y={40} width={400} height={110} rx={18} fill={C.redDark} stroke={C.gold} strokeWidth={6} />
      <text
        x={410}
        y={118}
        textAnchor="middle"
        fontFamily={SERIF}
        fontWeight={700}
        fontSize={74}
        fill={C.white}
        style={{ filter: luz > 0.5 ? "drop-shadow(0 0 14px rgba(255,220,120,0.9))" : "none" }}
        opacity={0.35 + 0.65 * luz}
      >
        Benatti
      </text>
      {new Array(stripes).fill(0).map((_, i) => {
        const w = 760 / stripes;
        return (
          <g key={i}>
            <rect x={30 + i * w} y={160} width={w} height={70} fill={i % 2 ? C.white : C.red} />
            <circle cx={30 + i * w + w / 2} cy={230} r={w / 2} fill={i % 2 ? C.white : C.red} />
          </g>
        );
      })}
      {[90, 480].map((x, k) => (
        <g key={x}>
          <rect x={x} y={290} width={250} height={210} rx={10} fill={luz > 0.3 ? "url(#win)" : "#3A1A12"} opacity={0.4 + 0.6 * luz} />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x={x + 14} y={340 + r * 60} width={222} height={6} fill="#8A4B1C" />
              {[0, 1, 2, 3, 4].map((c) => (
                <rect
                  key={c}
                  x={x + 22 + c * 43}
                  y={308 + r * 60}
                  width={32}
                  height={32}
                  rx={5}
                  fill={[C.red, C.white, C.gold, "#5FAE4E", C.redDark][(c + r + k) % 5]}
                  opacity={0.5 + 0.5 * luz}
                />
              ))}
            </g>
          ))}
        </g>
      ))}
      <rect x={355} y={300} width={110} height={310} rx={8} fill={luz > 0.3 ? "#F6C86A" : "#3A1A12"} opacity={0.5 + 0.5 * luz} />
      <rect x={365} y={312} width={90} height={150} rx={6} fill={C.white} opacity={0.25 * luz} />
      <circle cx={448} cy={470} r={6} fill={C.gold} />
      <rect x={0} y={606} width={820} height={10} rx={5} fill="rgba(255,255,255,0.15)" />
      <ellipse cx={410} cy={612} rx={380} ry={26} fill="rgba(255,200,90,0.25)" opacity={luz} />
    </svg>
  );
};

const Pessoa: React.FC<{ cor: string; pele: string; andando: boolean; t: number }> = ({
  cor,
  pele,
  andando,
  t,
}) => {
  const step = andando ? Math.sin(t * 14) : 0;
  return (
    <svg width={90} height={190} viewBox="0 0 90 190" style={{ overflow: "visible" }}>
      <rect x={28} y={120} width={14} height={60} rx={7} fill="#2B2B3A" transform={`rotate(${step * 18} 35 122)`} />
      <rect x={48} y={120} width={14} height={60} rx={7} fill="#2B2B3A" transform={`rotate(${-step * 18} 55 122)`} />
      <rect x={20} y={55} width={50} height={75} rx={18} fill={cor} />
      <rect x={10} y={62} width={12} height={50} rx={6} fill={cor} transform={`rotate(${-step * 20} 16 64)`} />
      <rect x={68} y={62} width={12} height={50} rx={6} fill={cor} transform={`rotate(${step * 20} 74 64)`} />
      <circle cx={45} cy={30} r={24} fill={pele} />
      <path d="M21 26 C22 4 68 4 69 26 C60 16 32 16 21 26Z" fill="#2A1A12" />
    </svg>
  );
};

const MaisUm: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const s = sp(t, at);
  return (
    <div
      style={{
        padding: "6px 16px",
        borderRadius: 12,
        background: C.red,
        color: C.white,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 30,
        boxShadow: "0 0 20px rgba(215,25,31,0.8)",
        opacity: t >= at ? 1 : 0,
        transform: `translateY(${(1 - s) * 30}px) scale(${s})`,
      }}
    >
      +1
    </div>
  );
};

const Icone: React.FC<{ tipo: string; size?: number }> = ({ tipo, size = 120 }) => {
  const r = C.red;
  const bg = C.white;
  const shapes: Record<string, React.ReactNode> = {
    carnes: (
      <>
        <path d="M18 55 C12 30 42 14 64 22 C86 30 90 60 72 74 C56 86 24 80 18 55Z" fill={r} />
        <path d="M30 52 C30 40 46 32 58 36" stroke={bg} strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={62} cy={52} r={9} fill={bg} />
      </>
    ),
    frios: (
      <>
        <path d="M12 70 L80 30 L88 70 Z" fill={C.gold} />
        <rect x={12} y={70} width={76} height={10} fill={C.goldDark} />
        <circle cx={60} cy={58} r={6} fill={C.goldDark} />
        <circle cx={44} cy={64} r={4} fill={C.goldDark} />
        <circle cx={74} cy={50} r={4} fill={C.goldDark} />
      </>
    ),
    frango: (
      <>
        <ellipse cx={40} cy={42} rx={26} ry={22} transform="rotate(-35 40 42)" fill="#E08A2E" />
        <rect x={52} y={52} width={10} height={28} rx={5} transform="rotate(-45 57 66)" fill="#E9D9BE" />
        <circle cx={74} cy={80} r={7} fill="#E9D9BE" />
        <circle cx={82} cy={72} r={7} fill="#E9D9BE" />
      </>
    ),
    mercearia: (
      <>
        <path d="M30 40 C30 18 70 18 70 40" stroke={r} strokeWidth={7} fill="none" />
        <path d="M14 40 L86 40 L76 84 L24 84 Z" fill={r} />
        <rect x={34} y={52} width={6} height={22} rx={3} fill={bg} />
        <rect x={47} y={52} width={6} height={22} rx={3} fill={bg} />
        <rect x={60} y={52} width={6} height={22} rx={3} fill={bg} />
      </>
    ),
    limpeza: (
      <>
        <rect x={32} y={40} width={34} height={46} rx={8} fill="#3B8FD9" />
        <rect x={40} y={26} width={18} height={16} fill="#3B8FD9" />
        <path d="M40 26 L40 16 L74 16 L74 26 Z" fill="#2B6FB0" />
        <path d="M74 18 L84 14 M76 22 L88 22 M74 26 L84 30" stroke="#3B8FD9" strokeWidth={4} strokeLinecap="round" />
        <rect x={38} y={54} width={22} height={16} rx={3} fill={bg} />
      </>
    ),
    festa: (
      <>
        <ellipse cx={42} cy={38} rx={20} ry={25} fill={r} />
        <ellipse cx={66} cy={46} rx={17} ry={21} fill={C.gold} />
        <path d="M42 63 L38 70 L46 70 Z M66 67 L62 73 L70 73 Z" fill={r} />
        <path d="M42 70 C46 80 38 86 44 94 M66 73 C62 82 70 86 64 94" stroke={r} strokeWidth={3} fill="none" />
      </>
    ),
    embalagens: (
      <>
        <path d="M50 14 L86 30 L50 46 L14 30 Z" fill={C.gold} />
        <path d="M14 30 L50 46 L50 88 L14 72 Z" fill="#B57A2E" />
        <path d="M86 30 L50 46 L50 88 L86 72 Z" fill="#8E5A1E" />
        <path d="M32 22 L68 38 L68 52" stroke={bg} strokeWidth={5} fill="none" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {shapes[tipo]}
    </svg>
  );
};

const Raios: React.FC<{ t: number; size: number; op: number }> = ({ t, size, op }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      left: -size / 2,
      top: -size / 2,
      borderRadius: "50%",
      background: `repeating-conic-gradient(from ${t * 25}deg, rgba(215,25,31,0.85) 0deg 9deg, transparent 9deg 24deg)`,
      maskImage: "radial-gradient(circle, transparent 18%, black 30%, transparent 70%)",
      WebkitMaskImage: "radial-gradient(circle, transparent 18%, black 30%, transparent 70%)",
      opacity: op,
    }}
  />
);

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      padding: size * 0.035,
      background: GOLD,
      boxShadow: `0 0 40px rgba(255,210,80,0.5), ${SHADOW}`,
      boxSizing: "border-box",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        overflow: "hidden",
        border: `${Math.max(2, size * 0.02)}px solid ${C.white}`,
        boxSizing: "border-box",
        background: C.red,
      }}
    >
      <Img
        src={staticFile("benatti-logo.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)" }}
      />
    </div>
  </div>
);

const Cartao: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      background: C.card,
      border: `2px solid ${C.line}`,
      borderRadius: 30,
      boxShadow: SHADOW,
      fontFamily: SANS,
      color: C.white,
      ...style,
    }}
  >
    {children}
  </div>
);

// ============================================================
//  CENA: troca rápida (whip + motion blur) e push-in de câmera
// ============================================================
const TR = 10; // frames de transição

const Cena: React.FC<{ dur: number; last?: boolean; children: React.ReactNode }> = ({
  dur,
  last,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame, fps, config: { damping: 18, stiffness: 160, mass: 0.8 } });
  const x = last
    ? 0
    : interpolate(frame, [dur, dur + TR], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  const cam = interpolate(frame, [0, dur], [1, 1.06], CLAMP);
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${(1 - e) * 420 - x * 520}px) scaleX(${1 + (1 - e) * 0.12 + x * 0.15}) scale(${cam})`,
        filter: `blur(${(1 - e) * 16 + x * 18}px)`,
        opacity: Math.min(1, e * 2) * (1 - x),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ============================================================
//  1) ABERTURA — loja acende, clientes chegam
// ============================================================
const Abertura: React.FC = () => {
  const t = useT(CENAS.abertura);
  const loja = sp(t, 0.1, { damping: 14, stiffness: 90, mass: 1 });
  const acesa = lin(t, 0.6, 1.4);
  const logo = sp(t, quando("Benatti") + 0.1);
  const pessoas = [
    { cor: "#3B6FD9", pele: "#C68B59", x0: -200, x1: 150, at: 1.6 },
    { cor: "#E0457B", pele: "#F1C27D", x0: -320, x1: 260, at: 2.2 },
    { cor: "#7B4FD9", pele: "#8D5524", x0: 1300, x1: 840, at: 2.8 },
  ];
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 700,
          transform: `translateY(${(1 - loja) * 300}px) scale(${0.8 + 0.2 * loja})`,
          opacity: loja,
        }}
      >
        <Loja acesa={acesa} t={t} />
        <div style={{ position: "absolute", left: 410 - 75, top: -160, transform: `scale(${logo})` }}>
          <Logo size={150} />
        </div>
      </div>
      {pessoas.map((p, i) => {
        const k = lin(t, p.at, p.at + 1.2);
        const x = p.x0 + (p.x1 - p.x0) * k;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 1110, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <MaisUm t={t} at={p.at + 1.2} />
            <Pessoa cor={p.cor} pele={p.pele} andando={k > 0 && k < 1} t={t} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 1440,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 20,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 44,
        }}
      >
        {["ATACADO", "VAREJO"].map((w, i) => {
          const s = sp(t, quando(w.toLowerCase().slice(0, 4)));
          return (
            <div
              key={w}
              style={{
                padding: "16px 34px",
                borderRadius: 16,
                background: i ? GOLD : C.red,
                color: i ? C.redDark : C.white,
                boxShadow: SHADOW,
                opacity: s > 0.01 ? 1 : 0,
                transform: `translateY(${(1 - s) * 80}px) rotate(${(1 - s) * (i ? 12 : -12)}deg) scale(${s})`,
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  2) PRODUTOS — herói com raios trocando no ritmo da voz
// ============================================================
const PRODUTOS = [
  { k: "carnes", nome: "CARNES" },
  { k: "frios", nome: "FRIOS" },
  { k: "frango", nome: "FRANGO" },
  { k: "mercearia", nome: "MERCEARIA" },
  { k: "limpeza", nome: "LIMPEZA" },
  { k: "festa", nome: "ARTIGOS DE FESTA" },
  { k: "embalagens", nome: "EMBALAGENS" },
];

const Produtos: React.FC = () => {
  const t = useT(CENAS.produtos);
  const vezes = PRODUTOS.map(
    (p) => quando(p.k === "festa" ? "artigos" : p.k, CENAS.produtos - 0.2) - 0.1,
  );
  const idx = vezes.reduce((acc, v, i) => (t >= v ? i : acc), 0);
  const tudo = quando("Tudo", CENAS.produtos);
  const fase2 = lin(t, tudo - 0.2, tudo + 0.5);
  const troca = sp(t, vezes[idx], { damping: 9, stiffness: 180, mass: 0.6 });
  const raios = sp(t, CENAS.produtos);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540, top: 1000 }}>
        <Raios t={t} size={1300} op={raios * (1 - fase2 * 0.6)} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 210,
          top: 1000 - 210,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: C.white,
          boxShadow: `0 0 80px rgba(215,25,31,0.6), ${SHADOW}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${raios * (1 - fase2)})`,
        }}
      >
        <div style={{ transform: `scale(${troca}) rotate(${(1 - troca) * -40}deg)` }}>
          <Icone tipo={PRODUTOS[idx].k} size={280} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1260,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: 1 - fase2,
        }}
      >
        <div
          style={{
            padding: "14px 34px",
            borderRadius: 999,
            background: GOLD,
            color: C.redDark,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 46,
            boxShadow: SHADOW,
            transform: `scale(${0.7 + 0.3 * troca})`,
          }}
        >
          {PRODUTOS[idx].nome}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1380,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 12,
          opacity: 1 - fase2,
        }}
      >
        {PRODUTOS.map((p, i) => (
          <div
            key={p.k}
            style={{
              width: i === idx ? 44 : 14,
              height: 14,
              borderRadius: 7,
              background: i <= idx ? C.gold : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
      {PRODUTOS.map((p, i) => {
        const s = sp(t, tudo + i * 0.05);
        const ang = (i / PRODUTOS.length) * Math.PI * 2 - Math.PI / 2 + t * 0.4;
        const R = 340 * s;
        return (
          <div
            key={p.k}
            style={{
              position: "absolute",
              left: 540 + Math.cos(ang) * R - 80,
              top: 1000 + Math.sin(ang) * R * 0.95 - 80,
              width: 160,
              height: 160,
              borderRadius: 40,
              background: C.white,
              boxShadow: SHADOW,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: t >= tudo ? 1 : 0,
              transform: `scale(${s})`,
            }}
          >
            <Icone tipo={p.k} size={110} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 540 - 90,
          top: 1000 - 90,
          transform: `scale(${sp(t, tudo + 0.3)})`,
          opacity: t >= tudo ? 1 : 0,
        }}
      >
        <Logo size={180} />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  3) QUALIDADE — casa x negócio, checklist e oferta da semana
// ============================================================
const Qualidade: React.FC = () => {
  const t = useT(CENAS.qualidade);
  const fimA = quando("Qualidade", CENAS.qualidade) - 0.1;
  const fimB = quando("ofertas", CENAS.qualidade) - 0.15;
  const a = 1 - lin(t, fimA - 0.2, fimA + 0.1);
  const b = lin(t, fimA - 0.1, fimA + 0.3) * (1 - lin(t, fimB - 0.2, fimB + 0.1));
  const c = lin(t, fimB - 0.1, fimB + 0.3);
  const caixa = sp(t, CENAS.qualidade + 0.1);
  const abre = lin(t, CENAS.qualidade + 0.4, CENAS.qualidade + 0.9);
  const lados = [
    { nome: "SUA CASA", at: quando("casa", CENAS.qualidade), x: -250 },
    { nome: "SEU NEGÓCIO", at: quando("negócio", CENAS.qualidade), x: 250 },
  ];
  const checks = ["Qualidade", "Variedade", "Confiança"];
  const dias = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  return (
    <AbsoluteFill>
      <div style={{ opacity: a, position: "absolute", inset: 0, transform: `scale(${0.9 + 0.1 * a})` }}>
        <div style={{ position: "absolute", left: 540 - 200, top: 900, width: 400, height: 330, transform: `scale(${caixa})` }}>
          <div style={{ position: "absolute", left: 0, top: 30, width: 200, height: 60, background: "#B57A2E", transformOrigin: "0% 100%", transform: `rotate(${-abre * 125}deg)`, borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 200, top: 30, width: 200, height: 60, background: "#B57A2E", transformOrigin: "100% 100%", transform: `rotate(${abre * 125}deg)`, borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 0, top: 90, width: 400, height: 240, background: "linear-gradient(180deg,#D99A4A,#A86A26)", borderRadius: 14, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ padding: "10px 26px", border: `4px solid ${C.redDark}`, borderRadius: 12, fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: C.redDark }}>Benatti</div>
          </div>
        </div>
        {["festa", "limpeza", "frios"].map((k, i) => {
          const s = sp(t, CENAS.qualidade + 0.6 + i * 0.12);
          const ang = (-35 + i * 35) * (Math.PI / 180);
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 540 - 65 + Math.sin(ang) * 240 * s,
                top: 960 - Math.cos(ang) * 200 * s,
                width: 130,
                height: 130,
                borderRadius: 65,
                background: C.white,
                boxShadow: SHADOW,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s})`,
              }}
            >
              <Icone tipo={k} size={90} />
            </div>
          );
        })}
        {lados.map((l) => {
          const s = sp(t, l.at);
          return (
            <div
              key={l.nome}
              style={{
                position: "absolute",
                left: 540 + l.x - 160,
                top: 1300,
                width: 320,
                padding: "20px 0",
                textAlign: "center",
                borderRadius: 22,
                background: l.x < 0 ? C.white : GOLD,
                color: C.redDark,
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 38,
                boxShadow: SHADOW,
                opacity: t >= l.at ? 1 : 0,
                transform: `translateY(${(1 - s) * 120}px) scale(${s}) rotate(${(l.x < 0 ? -5 : 5) * s}deg)`,
              }}
            >
              {l.nome}
            </div>
          );
        })}
      </div>
      <Cartao
        style={{
          left: 140,
          top: 740,
          width: 800,
          padding: "30px 40px",
          boxSizing: "border-box",
          opacity: b,
          transform: `translateY(${(1 - b) * 80}px) scale(${0.9 + 0.1 * b})`,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: 4, marginBottom: 14 }}>
          NOSSO COMPROMISSO
        </div>
        {checks.map((ck) => {
          const at = quando(ck, CENAS.qualidade);
          const on = t >= at;
          const s = sp(t, at);
          return (
            <div key={ck} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 0" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  border: `3px solid ${on ? C.green : C.line}`,
                  background: on ? C.green : "transparent",
                  color: C.white,
                  fontSize: 40,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${on ? 0.7 + 0.3 * s : 1})`,
                }}
              >
                {on ? "✓" : ""}
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, color: on ? C.white : "rgba(255,255,255,0.35)" }}>{ck}</div>
            </div>
          );
        })}
      </Cartao>
      <div style={{ position: "absolute", inset: 0, opacity: c }}>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 760,
            width: 840,
            height: 230,
            borderRadius: 28,
            background: `linear-gradient(90deg, ${C.red}, #F0352B)`,
            boxShadow: `0 0 60px rgba(215,25,31,0.6), ${SHADOW}`,
            display: "flex",
            fontFamily: SANS,
            color: C.white,
            transform: `rotate(${(1 - c) * -8}deg) scale(${0.8 + 0.2 * c})`,
          }}
        >
          <div style={{ flex: 1, padding: "34px 40px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, opacity: 0.8, letterSpacing: 3 }}>OFERTAS</div>
            <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05 }}>Toda semana!</div>
          </div>
          <div style={{ width: 4, margin: "20px 0", borderLeft: "4px dashed rgba(255,255,255,0.5)" }} />
          <div style={{ width: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, fontWeight: 900, color: C.gold }}>%</div>
        </div>
        <div style={{ position: "absolute", top: 1060, width: "100%", display: "flex", justifyContent: "center", gap: 12 }}>
          {dias.map((d, i) => {
            const s = sp(t, fimB + 0.15 + i * 0.07);
            return (
              <div
                key={d}
                style={{
                  width: 108,
                  height: 120,
                  borderRadius: 18,
                  background: C.card,
                  border: `2px solid ${C.gold}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: SANS,
                  color: C.white,
                  transform: `translateY(${(1 - s) * 60}px) scale(${s})`,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>{d}</div>
                <div style={{ fontSize: 40, fontWeight: 900 }}>%</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  4) HORÁRIO — semana acendendo + relógio
// ============================================================
const Relogio: React.FC<{ t: number; horas: number }> = ({ t, horas }) => {
  const min = (horas % 1) * 360;
  const hr = ((horas % 12) / 12) * 360;
  const shake = Math.sin(t * 50) * 3 * Math.max(0, 1 - (t - CENAS.horario) / 0.6);
  return (
    <svg width={300} height={300} viewBox="0 0 200 200" style={{ transform: `rotate(${shake}deg)` }}>
      <circle cx={60} cy={28} r={22} fill={C.gold} />
      <circle cx={140} cy={28} r={22} fill={C.gold} />
      <circle cx={100} cy={108} r={86} fill={C.gold} />
      <circle cx={100} cy={108} r={74} fill={C.white} />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={98} y={40} width={4} height={i % 3 === 0 ? 14 : 8} fill={C.redDark} transform={`rotate(${i * 30} 100 108)`} />
      ))}
      <rect x={96} y={62} width={8} height={50} rx={4} fill={C.red} transform={`rotate(${hr} 100 108)`} />
      <rect x={98} y={46} width={4} height={66} rx={2} fill={C.redDark} transform={`rotate(${min} 100 108)`} />
      <circle cx={100} cy={108} r={8} fill={C.gold} />
    </svg>
  );
};

const Horario: React.FC = () => {
  const t = useT(CENAS.horario);
  const dias = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  const tSeg = quando("segunda", CENAS.horario);
  const tSab = quando("sábado", CENAS.horario);
  const tAbre = quando("6h30", CENAS.horario);
  const tFecha = quando("21h30", CENAS.horario);
  const tDom = quando("domingos", CENAS.horario);
  const domingo = t >= tDom - 0.1;
  const horas = domingo
    ? interpolate(t, [tDom, tDom + 0.6, tDom + 1.4, tDom + 2.0], [21.5, 7, 7, 21], CLAMP)
    : interpolate(t, [tAbre - 0.4, tAbre, tFecha - 0.3, tFecha + 0.3], [0, 6.5, 6.5, 21.5], CLAMP);
  const abre = domingo ? "07:00" : "06:30";
  const fecha = domingo ? "21:00" : "21:30";
  const chipA = domingo ? sp(t, quando("7h", CENAS.horario)) : sp(t, tAbre);
  const chipB = domingo ? sp(t, quando("21h.", CENAS.horario)) : sp(t, tFecha);
  const cal = sp(t, CENAS.horario);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 520, width: "100%", display: "flex", justifyContent: "center", gap: 12 }}>
        {dias.map((d, i) => {
          const at = i < 6 ? tSeg + ((tSab - tSeg) * i) / 5 : tDom;
          const on = domingo ? i === 6 : t >= at && i < 6;
          const s = sp(t, at);
          const enter = sp(t, CENAS.horario + i * 0.04);
          return (
            <div
              key={d}
              style={{
                width: 120,
                height: 150,
                borderRadius: 22,
                background: on ? C.red : C.card,
                border: `3px solid ${on ? C.gold : C.line}`,
                boxShadow: on ? "0 0 30px rgba(215,25,31,0.8)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SANS,
                color: C.white,
                transform: `translateY(${(1 - enter) * 120 - (on ? 14 * s : 0)}px) scale(${enter})`,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 900, color: on ? C.white : "rgba(255,255,255,0.55)" }}>{d}</div>
              <div style={{ fontSize: 34, marginTop: 6, color: C.gold, opacity: on ? 1 : 0 }}>✓</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 540 - 150, top: 780, transform: `scale(${cal})` }}>
        <Relogio t={t} horas={horas} />
      </div>
      <div style={{ position: "absolute", top: 1140, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 26, fontFamily: SANS }}>
        {[
          { lbl: "ABRE", v: abre, s: chipA },
          { lbl: "FECHA", v: fecha, s: chipB },
        ].map((c, i) => (
          <div
            key={c.lbl}
            style={{
              padding: "18px 36px",
              borderRadius: 24,
              background: i ? GOLD : C.white,
              color: C.redDark,
              textAlign: "center",
              boxShadow: SHADOW,
              transform: `translateY(${(1 - c.s) * 80}px) scale(${c.s})`,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>{c.lbl}</div>
            <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1 }}>{c.v}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1390,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 44,
          color: "rgba(255,255,255,0.8)",
          opacity: chipB,
        }}
      >
        {domingo ? "Domingo" : "Segunda a sábado"}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  5) ENDEREÇO — loja → mapa com rota e pino → endereço
// ============================================================
const Endereco: React.FC = () => {
  const t = useT(CENAS.endereco);
  const tAv = quando("Av.", CENAS.endereco);
  const mapa = lin(t, tAv - 0.5, tAv);
  const lojaS = sp(t, CENAS.endereco);
  const rota = lin(t, tAv, tAv + 1.6);
  const pino = sp(t, tAv + 1.4, { damping: 7, stiffness: 170, mass: 0.8 });
  const pulso = (((t - tAv - 1.6) % 1) + 1) % 1;
  const linhas = [
    { txt: "Av. das Paineiras", at: tAv, big: true },
    { txt: "Quadra 96 · Lote 12", at: quando("quadra", CENAS.endereco), big: false },
    { txt: "Próximo à feira de quinta", at: quando("feira", CENAS.endereco), big: false },
    { txt: "St. Pontakayana", at: quando("Setor", CENAS.endereco), big: false },
    { txt: "Trindade – GO", at: quando("Trindade", CENAS.endereco), big: true },
  ];
  const caminho = "M 90 560 L 90 330 L 420 330 L 420 190 L 640 190";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - mapa, transform: `scale(${1 + mapa * 0.6})`, filter: `blur(${mapa * 12}px)` }}>
        <div style={{ position: "absolute", left: 130, top: 760, transform: `scale(${lojaS})` }}>
          <Loja acesa={1} t={t} />
        </div>
        <div style={{ position: "absolute", left: interpolate(t, [CENAS.endereco, CENAS.endereco + 1.2], [-100, 380], CLAMP), top: 1170 }}>
          <Pessoa cor="#3BA55C" pele="#C68B59" andando t={t} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 470, width: 900, height: 640, opacity: mapa, perspective: 1400 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 30,
            background: "#F3EBD7",
            border: `8px solid ${C.gold}`,
            overflow: "hidden",
            boxShadow: SHADOW,
            transform: `rotateX(${22 + (1 - mapa) * 40}deg) scale(${0.75 + 0.25 * mapa})`,
          }}
        >
          <svg width={884} height={624}>
            {[[30, 30], [270, 30], [510, 30], [30, 380], [270, 380], [510, 380], [690, 220]].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width={i === 6 ? 180 : 210} height={i === 6 ? 130 : 220} rx={14} fill={i % 3 === 1 ? "#B9D99A" : "#E2D8C0"} />
            ))}
            <text x={150} y={300} fontFamily={SANS} fontSize={20} fontWeight={800} fill="#9A8B6A">AV. DAS PAINEIRAS</text>
            <text x={560} y={360} fontFamily={SANS} fontSize={18} fontWeight={800} fill="#6E8F4F">FEIRA DE QUINTA</text>
            <path d={caminho} pathLength={1} stroke={C.gold} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - rota} />
            <path d={caminho} stroke={C.redDark} strokeWidth={4} strokeDasharray="10 14" fill="none" opacity={rota} />
          </svg>
          {t > tAv + 1.6 ? (
            <div style={{ position: "absolute", left: 640 - 70, top: 190 - 30, width: 140, height: 60, borderRadius: "50%", border: `5px solid ${C.red}`, transform: `scale(${1 + pulso})`, opacity: 1 - pulso }} />
          ) : null}
        </div>
        <svg
          width={150}
          height={200}
          viewBox="0 0 60 80"
          style={{
            position: "absolute",
            left: 640 + 10 - 75,
            top: 30 - (1 - pino) * 600,
            opacity: t > tAv + 1.4 ? 1 : 0,
            filter: "drop-shadow(0 14px 10px rgba(0,0,0,0.45))",
          }}
        >
          <path d="M30 78 C30 78 4 46 4 28 A26 26 0 0 1 56 28 C56 46 30 78 30 78Z" fill={C.red} stroke={C.white} strokeWidth={3} />
          <circle cx={30} cy={28} r={11} fill={C.white} />
        </svg>
      </div>
      <Cartao
        style={{
          left: 90,
          right: 90,
          top: 1170,
          padding: "30px 40px",
          background: C.white,
          color: "#2A2A2A",
          opacity: mapa,
          transform: `translateY(${(1 - mapa) * 160}px)`,
        }}
      >
        {linhas.map((l) => {
          const s = sp(t, l.at - 0.05);
          return (
            <div
              key={l.txt}
              style={{
                fontSize: l.big ? 50 : 38,
                fontWeight: l.big ? 900 : 700,
                color: l.big ? C.red : "#3A3A3A",
                lineHeight: 1.3,
                opacity: Math.min(1, s * 1.5),
                transform: `translateX(${(1 - s) * 60}px)`,
                filter: `blur(${(1 - Math.min(1, s)) * 6}px)`,
              }}
            >
              {l.txt}
            </div>
          );
        })}
      </Cartao>
    </AbsoluteFill>
  );
};

// ============================================================
//  6) WHATSAPP — conversa no celular + número + entrega
// ============================================================
const Bolha: React.FC<{ t: number; at: number; eu?: boolean; children: React.ReactNode }> = ({
  t,
  at,
  eu,
  children,
}) => {
  const s = sp(t, at);
  if (t < at) return null;
  return (
    <div
      style={{
        alignSelf: eu ? "flex-end" : "flex-start",
        maxWidth: "82%",
        padding: "14px 20px",
        borderRadius: 22,
        borderTopRightRadius: eu ? 6 : 22,
        borderTopLeftRadius: eu ? 22 : 6,
        background: eu ? "#DCF8C6" : C.white,
        color: "#1E1E1E",
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 1.3,
        boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
        transformOrigin: eu ? "100% 0%" : "0% 0%",
        transform: `scale(${s})`,
      }}
    >
      {children}
    </div>
  );
};

const Digitando: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ alignSelf: "flex-start", padding: "16px 22px", borderRadius: 22, background: C.white, display: "flex", gap: 8 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: "#9A9A9A", transform: `translateY(${Math.sin(t * 12 - i) * 4}px)` }} />
    ))}
  </div>
);

const Moto: React.FC = () => (
  <svg width={300} height={200} viewBox="0 0 150 100">
    <rect x={20} y={20} width={44} height={40} rx={6} fill={C.gold} />
    <text x={42} y={48} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={24} fill={C.redDark}>B</text>
    <path d="M30 62 L100 62 L118 44 L128 44 L120 70 L30 70 Z" fill={C.red} />
    <rect x={112} y={30} width={6} height={20} fill="#333" />
    <circle cx={40} cy={78} r={14} fill="#222" />
    <circle cx={40} cy={78} r={6} fill="#999" />
    <circle cx={116} cy={78} r={14} fill="#222" />
    <circle cx={116} cy={78} r={6} fill="#999" />
    <circle cx={88} cy={28} r={10} fill="#C68B59" />
    <path d="M78 26 A10 10 0 0 1 98 26 L98 22 A10 10 0 0 0 78 22Z" fill={C.red} />
    <rect x={80} y={38} width={18} height={26} rx={6} fill="#2B6FB0" />
  </svg>
);

const Whatsapp: React.FC = () => {
  const t = useT(CENAS.whatsapp);
  const cel = sp(t, CENAS.whatsapp, { damping: 14, stiffness: 120, mass: 0.9 });
  const m1 = CENAS.whatsapp + 0.5;
  const typing = m1 + 0.6;
  const tNum = quando("(62)", CENAS.whatsapp);
  const m2 = tNum - 0.5;
  const num = sp(t, tNum);
  const tEnt = quando("rápidas", CENAS.whatsapp) - 0.6;
  const moto = lin(t, tEnt - 0.5, tEnt + 1.6);
  const numTxt = "(62) 99376-2140";
  const visiveis = Math.floor(interpolate(t, [tNum, tNum + 2.4], [0, numTxt.length], CLAMP));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 450,
          width: 500,
          height: 800,
          borderRadius: 60,
          background: "#111",
          padding: 14,
          boxSizing: "border-box",
          boxShadow: `0 0 70px rgba(37,211,102,0.25), ${SHADOW}`,
          transform: `translateY(${(1 - cel) * 900}px) rotate(${(1 - cel) * 10}deg)`,
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", background: "#ECE5DD", display: "flex", flexDirection: "column", fontFamily: SANS }}>
          <div style={{ background: C.greenDark, padding: "44px 22px 18px", display: "flex", alignItems: "center", gap: 16, color: C.white }}>
            <Logo size={64} />
            <div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>Benatti Frios</div>
              <div style={{ fontSize: 20, opacity: 0.85 }}>online</div>
            </div>
          </div>
          <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <Bolha t={t} at={m1} eu>
              Oi! Quero fazer um pedido
            </Bolha>
            {t >= typing && t < m2 ? <Digitando t={t} /> : null}
            <Bolha t={t} at={m2}>
              Claro! Manda sua lista que a gente entrega rapidinho.
            </Bolha>
            <Bolha t={t} at={m2 + 1.2} eu>
              2kg de frango, 500g de mussarela e pratos de festa
            </Bolha>
            <Bolha t={t} at={m2 + 2.4}>
              Anotado! Já está saindo ✓
            </Bolha>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1290, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "22px 40px",
            borderRadius: 999,
            background: C.green,
            boxShadow: `0 0 50px rgba(37,211,102,0.6), ${SHADOW}`,
            transform: `scale(${num})`,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 70,
            color: C.white,
            whiteSpace: "nowrap",
          }}
        >
          <svg width={60} height={60} viewBox="0 0 24 24">
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
              fill={C.white}
            />
          </svg>
          <span>
            {numTxt.slice(0, visiveis)}
            <span style={{ opacity: 0 }}>{numTxt.slice(visiveis)}</span>
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1430, left: interpolate(moto, [0, 1], [-340, 1100]) }}>
        <div style={{ position: "absolute", left: -170, top: 80, display: "flex", flexDirection: "column", gap: 14, opacity: moto > 0 && moto < 1 ? 1 : 0 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 6, borderRadius: 3, background: C.gold, width: 120 - i * 30, marginLeft: i * 20 }} />
          ))}
        </div>
        <Moto />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1650,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 54,
          color: C.gold,
          letterSpacing: 2,
          opacity: lin(t, tEnt, tEnt + 0.4),
          textShadow: "0 0 26px rgba(247,196,49,0.6)",
        }}
      >
        ENTREGAS RÁPIDAS
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  7) FINAL — tela vermelha, logo e botão seguir
// ============================================================
const Final: React.FC = () => {
  const t = useT(CENAS.final);
  const wipe = lin(t, CENAS.final, CENAS.final + 0.5);
  const logo = sp(t, CENAS.final + 0.3, { damping: 9, stiffness: 110, mass: 0.9 });
  const nome = sp(t, CENAS.final + 0.6);
  const btn = sp(t, CENAS.final + 1.0);
  const click = CENAS.final + 2.3;
  const ease = { ...CLAMP, easing: Easing.out(Easing.cubic) };
  const cx = interpolate(t, [CENAS.final + 1.3, click - 0.1], [900, 640], ease);
  const cy = interpolate(t, [CENAS.final + 1.3, click - 0.1], [1800, 1395], ease);
  const press = t > click && t < click + 0.15 ? 0.9 : 1;
  const seguindo = t >= click + 0.1;
  const fade = lin(t, DURACAO - 0.4, DURACAO);
  return (
    <AbsoluteFill style={{ opacity: 1 - fade }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 1200,
          top: 960 - 1200,
          width: 2400,
          height: 2400,
          borderRadius: "50%",
          background: `radial-gradient(circle, #F0352B 0%, ${C.red} 40%, ${C.redDark} 75%)`,
          transform: `scale(${wipe})`,
        }}
      />
      <div style={{ position: "absolute", left: 540 - 230, top: 470, transform: `scale(${logo}) rotate(${(1 - logo) * -180}deg)` }}>
        <Logo size={460} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          width: "100%",
          textAlign: "center",
          color: C.white,
          opacity: nome,
          transform: `translateY(${(1 - nome) * 60}px)`,
        }}
      >
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 130, lineHeight: 1, textShadow: "0 8px 0 rgba(90,0,0,0.5)" }}>Benatti</div>
        <div style={{ marginTop: 20, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: C.gold, letterSpacing: 4 }}>
          FRIOS E EMBALAGENS
        </div>
        <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 700, fontSize: 34, opacity: 0.85 }}>@benattifrios</div>
      </div>
      <div style={{ position: "absolute", top: 1340, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "22px 70px",
            borderRadius: 999,
            background: seguindo ? GOLD : C.white,
            color: seguindo ? C.redDark : C.red,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 48,
            boxShadow: SHADOW,
            transform: `scale(${btn * press})`,
          }}
        >
          {seguindo ? "Seguindo ✓" : "+ Seguir"}
        </div>
      </div>
      <svg
        width={70}
        height={70}
        viewBox="0 0 24 24"
        style={{ position: "absolute", left: cx, top: cy, opacity: t > CENAS.final + 1.3 ? 1 : 0, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}
      >
        <path d="M4 2 L4 20 L9 15 L12 22 L15 21 L12 14 L19 14 Z" fill={C.white} stroke="#111" strokeWidth={1.2} />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================
//  COMPOSIÇÃO
// ============================================================
const ORDEM: { k: keyof typeof CENAS; C: React.FC }[] = [
  { k: "abertura", C: Abertura },
  { k: "produtos", C: Produtos },
  { k: "qualidade", C: Qualidade },
  { k: "horario", C: Horario },
  { k: "endereco", C: Endereco },
  { k: "whatsapp", C: Whatsapp },
  { k: "final", C: Final },
];

export const Benatti: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fundo />
      {ORDEM.map(({ k, C: Scene }, i) => {
        const ini = CENAS[k];
        const fim = i < ORDEM.length - 1 ? CENAS[ORDEM[i + 1].k] : DURACAO;
        const last = i === ORDEM.length - 1;
        const dur = sec(fim) - sec(ini);
        return (
          <Sequence key={k} from={sec(ini)} durationInFrames={last ? dur : dur + TR} name={k}>
            <Cena dur={dur} last={last}>
              <Scene />
            </Cena>
          </Sequence>
        );
      })}
      <Abas />
      <Legenda />
      <Sequence from={sec(VOZ_INICIO)}>
        <Audio src={staticFile("benatti-narracao.wav")} />
      </Sequence>
      {/* Trilha opcional: coloque public/benatti-trilha.mp3 e descomente
      <Audio src={staticFile("benatti-trilha.mp3")} volume={0.12} />
      */}
    </AbsoluteFill>
  );
};
