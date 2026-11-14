npm install @fontsource/poppins@5
mkdir -p src
cat > src/Benatti.tsx << 'EOF'
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import "@fontsource/poppins/900-italic.css";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

// ============================================================
//  TEMPO — tudo em SEGUNDOS do vídeo
// ============================================================
export const BENATTI_FPS = 30;
const VOZ_INICIO = 1.0; // a narração começa 1s depois do início
const DURACAO = 47.5;
export const BENATTI_TOTAL = Math.round(DURACAO * BENATTI_FPS);
const FPS = BENATTI_FPS;
const sec = (s: number) => Math.round(s * FPS);

// Frases da narração (tempos do ÁUDIO em s, medidos nas pausas da voz)
const FRASES: [number, number, string][] = [
  [0.13, 1.96, "Benatti Frios e Embalagens."],
  [1.96, 4.3, "Atacado e varejo, com qualidade e preço justo."],
  [4.47, 6.85, "Aqui você encontra carnes, frios, frango,"],
  [6.97, 8.85, "mercearia, produtos de limpeza,"],
  [9.04, 11.3, "artigos de festa e embalagens em geral."],
  [11.3, 12.76, "Tudo num só lugar!"],
  [12.94, 15.63, "Embalagens pra sua casa e pro seu negócio."],
  [15.81, 17.68, "Qualidade, variedade e confiança,"],
  [17.83, 19.41, "com ofertas toda semana."],
  [19.63, 20.96, "Nosso horário: de segunda a sábado,"],
  [21.06, 22.88, "das 6h30 da manhã às 21h30 da noite."],
  [23.04, 25.42, "E aos domingos, das 7h às 21h."],
  [25.6, 26.3, "Venha nos visitar!"],
  [26.5, 28.18, "Estamos na Av. das Paineiras,"],
  [28.29, 30.71, "quadra 96, lote 12, próximo à feira de quinta,"],
  [30.82, 32.48, "no Setor Pontakayana,"],
  [32.59, 34.19, "em Trindade, Goiás."],
  [34.3, 36.05, "Faça seu pedido pelo WhatsApp:"],
  [36.16, 39.3, "(62) 99376-2140"],
  [39.3, 42.16, "Benatti Frios e Embalagens: entregas rápidas!"],
];

// Momento (s do vídeo) de cada palavra, proporcional ao tamanho dentro da frase
const PALAVRAS = FRASES.flatMap(([a, b, txt]) => {
  const ws = txt.split(" ");
  const total = ws.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return ws.map((w) => {
    const t = VOZ_INICIO + a + ((b - a) * acc) / total;
    acc += w.length + 1;
    return { w, t };
  });
});
const limpa = (w: string) => w.toLowerCase().replace(/[,.!:]/g, "");
const quando = (palavra: string, depois = 0) => {
  const q = limpa(palavra);
  // palavras curtas ("e", "com") precisam ser iguais; as longas podem ser o começo
  const ok = (w: string) => (q.length <= 3 ? limpa(w) === q : limpa(w).startsWith(q));
  return PALAVRAS.find((p) => p.t >= depois && ok(p.w))?.t ?? depois;
};

// Cenas (s do vídeo)
const B = {
  logo: 0,
  atacado: 3.0,
  produtos: 5.4,
  tudo: 12.25,
  embalagens: 13.9,
  qualidade: 16.75,
  ofertas: 18.8,
  horario: 20.55,
  endereco: 26.5,
  whatsapp: 35.25,
  marca: 40.25,
  fim: 43.4,
};

// ============================================================
//  ESTILO (varejo: vermelho, dourado e branco)
// ============================================================
const C = {
  paper: "#F1EFEA",
  ink: "#161616",
  red: "#D7191F",
  redDeep: "#8E0B10",
  redDark: "#6E070B",
  gold: "#F7C531",
  goldDark: "#B9860B",
  white: "#FFFFFF",
  green: "#22B25A",
};
const FONT = "Poppins, Arial, sans-serif";
const SERIF = 'Georgia, "Times New Roman", serif';
const GOLD = "linear-gradient(180deg, #FFE586 0%, #F7C531 50%, #E0A315 100%)";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const POP = { damping: 11, stiffness: 150, mass: 0.7 };
const SOFT = { damping: 18, stiffness: 120, mass: 0.9 };

const sp = (t: number, at: number, config = POP) =>
  spring({ frame: (t - at) * FPS, fps: FPS, config });
const lin = (t: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], { ...CLAMP, easing: ease });
const useT = (start: number) => useCurrentFrame() / FPS + start;

// ============================================================
//  PEÇAS DE VAREJO
// ============================================================

// Texto grande "3D" (branco com extrusão vermelha)
const Big: React.FC<{
  t: number;
  at: number;
  children: React.ReactNode;
  size?: number;
  cor?: string;
}> = ({ t, at, children, size = 150, cor = C.white }) => {
  const k = sp(t, at, { damping: 12, stiffness: 160, mass: 0.7 });
  const d = 1 - Math.min(1, k);
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: FONT,
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: size,
        lineHeight: 1,
        letterSpacing: -2,
        textTransform: "uppercase",
        color: cor,
        WebkitTextStroke: `3px ${C.redDark}`,
        textShadow: `0 3px 0 ${C.redDeep}, 0 6px 0 ${C.redDeep}, 0 9px 0 ${C.redDark}, 0 12px 0 ${C.redDark}, 0 22px 30px rgba(0,0,0,0.45)`,
        opacity: t < at ? 0 : Math.min(1, k * 1.5),
        filter: `blur(${d * 16}px)`,
        transform: `scale(${1 + d * 0.9})`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// Faixa (pílula dourada com borda branca)
const Faixa: React.FC<{
  t: number;
  at: number;
  children: React.ReactNode;
  size?: number;
  branca?: boolean;
}> = ({ t, at, children, size = 54, branca }) => {
  const k = sp(t, at, { damping: 10, stiffness: 170, mass: 0.6 });
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${size * 0.16}px ${size * 0.7}px`,
        borderRadius: 999,
        background: branca ? C.white : GOLD,
        border: `${Math.max(4, size * 0.08)}px solid ${branca ? C.gold : C.white}`,
        boxShadow: `0 ${size * 0.14}px 0 ${branca ? C.goldDark : C.redDark}, 0 ${size * 0.3}px ${size * 0.4}px rgba(0,0,0,0.35)`,
        fontFamily: FONT,
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: size,
        lineHeight: 1.1,
        textTransform: "uppercase",
        color: C.redDark,
        whiteSpace: "nowrap",
        opacity: t < at ? 0 : 1,
        transform: `scaleX(${Math.min(1.08, k)}) scaleY(${0.6 + 0.4 * Math.min(1, k)})`,
      }}
    >
      {children}
    </div>
  );
};

const Centro: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    {children}
  </div>
);

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      overflow: "hidden",
      background: "#E22521",
      boxShadow: `0 ${size * 0.08}px ${size * 0.2}px rgba(80,0,0,0.35)`,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Img src={staticFile("benatti-logo.jpg")} style={{ width: "82%", height: "82%", objectFit: "contain" }} />
  </div>
);

// Moeda dourada com o logo (flutua no fundo)
const Moeda: React.FC<{ size: number; giro: number }> = ({ size, giro }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: GOLD,
      border: `${size * 0.05}px solid #FFF1B8`,
      boxShadow: `0 ${size * 0.06}px 0 ${C.goldDark}, 0 ${size * 0.15}px ${size * 0.3}px rgba(0,0,0,0.35)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scaleX(${0.35 + 0.65 * Math.abs(Math.cos(giro))})`,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        width: "74%",
        height: "74%",
        borderRadius: "50%",
        background: "#E22521",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img src={staticFile("benatti-logo.jpg")} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
    </div>
  </div>
);

const Zap: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={11} fill={C.green} />
    <path
      d="M8.2 11.1c.8 1.6 2.1 2.9 3.7 3.7l1.2-1.2c.2-.2.4-.2.6-.1.6.2 1.3.3 2 .3.3 0 .6.3.6.6V16c0 .3-.3.6-.6.6C10.6 16.6 7.4 13.4 7.4 9.3c0-.3.3-.6.6-.6h1.6c.3 0 .6.3.6.6 0 .7.1 1.4.3 2 .1.2 0 .4-.1.6l-.2.2z"
      fill={C.white}
    />
  </svg>
);

// ---------- Ícones 2D ----------
const Icone: React.FC<{ tipo: string; size?: number }> = ({ tipo, size = 120 }) => {
  const r = C.red;
  const w = "#fff";
  const s: Record<string, React.ReactNode> = {
    carnes: (
      <>
        <path d="M14 56 C8 28 42 10 66 20 C90 30 94 62 74 77 C56 90 20 84 14 56Z" fill="#F3E2C8" />
        <path d="M20 55 C15 32 44 18 64 26 C84 34 86 60 70 71 C55 81 25 77 20 55Z" fill="#B8262C" />
        <path d="M32 50 C34 40 48 34 58 38" stroke="#E8A3A0" strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={62} cy={54} r={8} fill={w} />
      </>
    ),
    frios: (
      <>
        <path d="M10 72 L82 28 L90 72 Z" fill="#F6C843" />
        <path d="M82 28 L90 72 L94 66 L86 24 Z" fill="#E3AE25" />
        <rect x={10} y={72} width={80} height={10} fill="#D9A520" />
        <circle cx={60} cy={58} r={7} fill="#D9A520" />
        <circle cx={42} cy={65} r={4} fill="#D9A520" />
        <circle cx={76} cy={48} r={4} fill="#D9A520" />
      </>
    ),
    frango: (
      <>
        <ellipse cx={40} cy={42} rx={27} ry={23} transform="rotate(-35 40 42)" fill="#D9893A" />
        <ellipse cx={34} cy={36} rx={10} ry={6} transform="rotate(-35 34 36)" fill="#F0B56A" />
        <rect x={52} y={52} width={11} height={30} rx={5} transform="rotate(-45 57 66)" fill="#F3E6D0" />
        <circle cx={75} cy={81} r={7} fill="#F3E6D0" />
        <circle cx={83} cy={73} r={7} fill="#F3E6D0" />
      </>
    ),
    mercearia: (
      <>
        <path d="M30 40 C30 16 70 16 70 40" stroke={r} strokeWidth={7} fill="none" />
        <rect x={26} y={22} width={16} height={26} rx={3} fill="#F2B820" />
        <rect x={46} y={18} width={14} height={30} rx={3} fill="#3BA55C" />
        <rect x={62} y={26} width={12} height={22} rx={3} fill="#3B8FD9" />
        <path d="M12 40 L88 40 L78 86 L22 86 Z" fill={r} />
        <rect x={34} y={52} width={6} height={24} rx={3} fill={w} />
        <rect x={47} y={52} width={6} height={24} rx={3} fill={w} />
        <rect x={60} y={52} width={6} height={24} rx={3} fill={w} />
      </>
    ),
    limpeza: (
      <>
        <rect x={20} y={38} width={30} height={50} rx={8} fill="#2DB36A" />
        <rect x={28} y={26} width={14} height={14} rx={3} fill="#fff" />
        <rect x={54} y={42} width={30} height={46} rx={6} fill="#3B8FD9" />
        <rect x={62} y={28} width={14} height={16} fill="#1F5FA3" />
        <path d="M62 28 L62 20 L88 20 L88 28 Z" fill="#1F5FA3" />
        <rect x={58} y={56} width={22} height={14} rx={3} fill={w} />
        <circle cx={14} cy={30} r={4} fill="#9FD8F5" />
        <circle cx={8} cy={42} r={3} fill="#9FD8F5" />
      </>
    ),
    festa: (
      <>
        <ellipse cx={40} cy={36} rx={20} ry={25} fill={r} />
        <ellipse cx={66} cy={44} rx={17} ry={21} fill="#F2B820" />
        <ellipse cx={34} cy={28} rx={5} ry={8} fill="#FF7A7E" />
        <path d="M40 61 L36 68 L44 68 Z M66 65 L62 71 L70 71 Z" fill={r} />
        <path d="M40 68 C44 78 36 84 42 94 M66 71 C62 80 70 86 64 94" stroke="#555" strokeWidth={2} fill="none" />
      </>
    ),
    embalagens: (
      <>
        <path d="M50 12 L88 30 L50 48 L12 30 Z" fill="#E8C79A" />
        <path d="M12 30 L50 48 L50 92 L12 74 Z" fill="#C8925A" />
        <path d="M88 30 L50 48 L50 92 L88 74 Z" fill="#A9733D" />
        <path d="M31 21 L69 39 L69 56" stroke="#F7E7CC" strokeWidth={7} fill="none" />
      </>
    ),
    casa: (
      <>
        <path d="M10 46 L50 12 L90 46 Z" fill={r} />
        <rect x={20} y={44} width={60} height={44} fill="#F3E6D0" />
        <rect x={42} y={60} width={16} height={28} fill="#A9733D" />
        <rect x={26} y={54} width={12} height={12} fill="#9FD8F5" />
        <rect x={62} y={54} width={12} height={12} fill="#9FD8F5" />
      </>
    ),
    loja: (
      <>
        <rect x={14} y={40} width={72} height={48} fill="#F3E6D0" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x={10 + i * 13.3} y={22} width={13.3} height={20} fill={i % 2 ? w : r} />
            <circle cx={16.6 + i * 13.3} cy={42} r={6.65} fill={i % 2 ? w : r} />
          </g>
        ))}
        <rect x={10} y={14} width={80} height={10} rx={3} fill="#F2B820" />
        <rect x={22} y={56} width={24} height={20} fill="#9FD8F5" />
        <rect x={54} y={54} width={20} height={34} fill="#A9733D" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {s[tipo]}
    </svg>
  );
};

// ============================================================
//  FUNDO: claro na abertura → vermelho com raios
// ============================================================
const Fundo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const w = lin(t, B.atacado - 0.15, B.atacado + 0.25, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 2300,
          top: 960 - 2300,
          width: 4600,
          height: 4600,
          borderRadius: "50%",
          transform: `scale(${w})`,
          background: `radial-gradient(circle at 50% 50%, #F0352B 0%, ${C.red} 20%, ${C.redDeep} 38%, ${C.redDark} 50%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -660,
          top: -240,
          width: 2400,
          height: 2400,
          opacity: w * 0.5,
          background: "repeating-conic-gradient(from 0deg, rgba(255,210,120,0.10) 0deg 6deg, transparent 6deg 18deg)",
          transform: `rotate(${t * 4}deg)`,
          maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Moedas flutuando + selo do logo + rodapé (da cena 2 até o fim)
const Camadas: React.FC = () => {
  const t = useCurrentFrame() / FPS + B.atacado;
  const on = lin(t, B.atacado + 0.1, B.atacado + 0.6);
  const moedas = [
    { x: 30, y: 400, s: 110, b: 0 },
    { x: 920, y: 330, s: 90, b: 2 },
    { x: 950, y: 1250, s: 120, b: 0 },
    { x: 10, y: 1500, s: 90, b: 3 },
    { x: 860, y: 1620, s: 70, b: 4 },
    { x: 60, y: 980, s: 60, b: 5 },
  ];
  return (
    <AbsoluteFill style={{ opacity: on, pointerEvents: "none" }}>
      {moedas.map((m, i) => {
        const fy = Math.sin(t * 1.3 + i) * 18;
        return (
          <div key={i} style={{ position: "absolute", left: m.x, top: m.y + fy, filter: `blur(${m.b}px)` }}>
            <Moeda size={m.s} giro={t * 1.5 + random(`m${i}`) * 6} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 60,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 28px 10px 10px",
          borderRadius: 999,
          background: C.white,
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          transform: `translateY(${(1 - on) * -120}px)`,
        }}
      >
        <Logo size={64} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, color: C.red }}>Benatti</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          bottom: 40,
          height: 96,
          borderRadius: 30,
          background: "rgba(70,0,4,0.75)",
          border: "2px solid rgba(255,220,120,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 26px",
          fontFamily: FONT,
          transform: `translateY(${(1 - on) * 200}px)`,
        }}
      >
        <div style={{ padding: "8px 22px", borderRadius: 999, background: GOLD, color: C.redDark, fontWeight: 900, fontStyle: "italic", fontSize: 28 }}>
          ATACADO E VAREJO
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: C.white, fontWeight: 800, fontSize: 34 }}>
          <Zap size={40} />
          (62) 99376-2140
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  TRANSIÇÃO: zoom com desfoque (entra de perto, sai "explodindo")
// ============================================================
const TR = 8;
const Cena: React.FC<{ dur: number; last?: boolean; children: React.ReactNode }> = ({ dur, last, children }) => {
  const f = useCurrentFrame();
  const e = spring({ frame: f, fps: FPS, config: { damping: 16, stiffness: 150, mass: 0.7 } });
  const x = last ? 0 : interpolate(f, [dur, dur + TR], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  const cam = interpolate(f, [0, dur], [1, 1.04], CLAMP);
  const ein = Math.min(1, e);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${(0.7 + 0.3 * ein) * cam * (1 + x * 0.8)})`,
        filter: `blur(${(1 - ein) * 18 + x * 22}px)`,
        opacity: Math.min(1, e * 2) * (1 - x),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Palavra simples (usada na abertura)
const W: React.FC<{
  t: number;
  at: number;
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ t, at, children, size = 56, weight = 300, color = C.ink, style }) => {
  const k = sp(t, at, { damping: 15, stiffness: 170, mass: 0.6 });
  const d = 1 - Math.min(1, k);
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.05,
        opacity: t < at ? 0 : Math.min(1, k * 1.4),
        filter: `blur(${d * 14}px)`,
        transform: `translateY(${d * 50}px)`,
        whiteSpace: "pre",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// ============================================================
//  CENAS
// ============================================================

// 1) Abertura (mantida): bolinha cai, vira o logo
const Abertura: React.FC = () => {
  const t = useT(B.logo);
  const queda = interpolate(t, [0.1, 0.55], [-900, 0], { ...CLAMP, easing: Easing.bezier(0.5, 0, 0.9, 0.5) });
  const quique = t > 0.55 ? Math.abs(Math.sin((t - 0.55) * 9)) * 60 * Math.max(0, 1 - (t - 0.55) * 3) : 0;
  const vira = sp(t, 0.85, { damping: 9, stiffness: 120, mass: 0.8 });
  const tB = quando("Benatti");
  let ref = tB + 0.1;
  const sub = ["Frios", "e", "Embalagens"].map((w) => {
    ref = quando(w, ref);
    return { w, at: ref };
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 540 - 22,
          top: 760 + queda - quique,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: C.ink,
          opacity: t < 0.85 ? 1 : 0,
        }}
      />
      <div style={{ position: "absolute", left: 540 - 150, top: 632, opacity: t >= 0.85 ? 1 : 0, transform: `scale(${vira}) rotate(${(1 - vira) * -120}deg)` }}>
        <Logo size={300} />
      </div>
      <Centro top={1010}>
        <W t={t} at={tB} size={128} color={C.red} style={{ fontFamily: SERIF, fontWeight: 700 }}>
          Benatti
        </W>
      </Centro>
      <Centro top={1170}>
        <div style={{ display: "flex", gap: 14 }}>
          {sub.map((p) => (
            <W key={p.w} t={t} at={p.at} size={54}>
              {p.w}
            </W>
          ))}
        </div>
      </Centro>
    </AbsoluteFill>
  );
};

// 2) ATACADO E VAREJO / QUALIDADE / PREÇO JUSTO
const Atacado: React.FC = () => {
  const t = useT(B.atacado);
  return (
    <AbsoluteFill>
      <Centro top={560}>
        <Faixa t={t} at={quando("Atacado", B.atacado - 0.3)} size={60}>
          Atacado e varejo
        </Faixa>
      </Centro>
      <Centro top={760}>
        <W t={t} at={quando("com", B.atacado)} size={60} weight={600} color={C.white}>
          com
        </W>
      </Centro>
      <Centro top={860}>
        <Big t={t} at={quando("qualidade", B.atacado)} size={160}>
          Qualidade
        </Big>
      </Centro>
      <Centro top={1080}>
        <Faixa t={t} at={quando("preço", B.atacado)} size={76} branca>
          e preço justo
        </Faixa>
      </Centro>
    </AbsoluteFill>
  );
};

// 3) Produtos: cartão com prato branco + nome, a cada categoria falada
const CATS = [
  { k: "carnes", nome: "Carnes", itens: "Picanha • Alcatra • Costela • Linguiça" },
  { k: "frios", nome: "Frios", itens: "Mussarela • Presunto • Salame • Bacon" },
  { k: "frango", nome: "Frango", itens: "Coxa • Sobrecoxa • Peito • Asa" },
  { k: "mercearia", nome: "Mercearia", itens: "Arroz • Feijão • Óleo • Café" },
  { k: "limpeza", nome: "Limpeza", itens: "Detergente • Desinfetante • Sabão" },
  { k: "festa", nome: "Artigos de festa", itens: "Balões • Copos • Pratos • Velas" },
  { k: "embalagens", nome: "Embalagens", itens: "Marmitex • Caixas • Sacolas • Potes" },
];

const Produtos: React.FC = () => {
  const t = useT(B.produtos);
  const vezes = CATS.map((c) => quando(c.k === "festa" ? "artigos" : c.k, B.produtos - 0.3) - 0.08);
  const idx = vezes.reduce((acc, v, i) => (t >= v ? i : acc), 0);
  const at = Math.max(vezes[idx], B.produtos + 0.2);
  const card = sp(t, B.produtos + 0.05, SOFT);
  const prato = sp(t, at, { damping: 10, stiffness: 150, mass: 0.7 });
  const c = CATS[idx];
  return (
    <AbsoluteFill>
      <Centro top={230}>
        <Faixa t={t} at={B.produtos + 0.1} size={52}>
          Aqui você encontra
        </Faixa>
      </Centro>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 390,
          height: 1250,
          borderRadius: 60,
          background: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(80,0,4,0.35))",
          border: "5px solid rgba(255,214,110,0.75)",
          boxShadow: "inset 0 0 80px rgba(255,200,120,0.15), 0 40px 80px rgba(0,0,0,0.35)",
          transform: `translateY(${(1 - card) * 1400}px)`,
        }}
      >
        <div style={{ position: "absolute", right: 40, top: 40, padding: "8px 24px", borderRadius: 999, background: C.white, color: C.red, fontFamily: FONT, fontWeight: 900, fontSize: 34 }}>
          {String(idx + 1).padStart(2, "0")}/07
        </div>
        <div
          style={{
            position: "absolute",
            left: 470 - 300,
            top: 90,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 35%, #FFFFFF 0%, #F4F1EC 60%, #DCD6CC 100%)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.35), inset 0 -14px 0 rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 40, borderRadius: "50%", border: "3px solid rgba(0,0,0,0.05)" }} />
          <div
            key={idx}
            style={{
              transform: `scale(${prato}) rotate(${(1 - Math.min(1, prato)) * -90}deg)`,
              filter: "drop-shadow(0 20px 18px rgba(0,0,0,0.3))",
            }}
          >
            <Icone tipo={c.k} size={420} />
          </div>
        </div>
        <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Big key={`n${idx}`} t={t} at={at} size={c.nome.length > 12 ? 100 : 140}>
            {c.nome}
          </Big>
        </div>
        <div
          style={{
            position: "absolute",
            top: 960,
            left: 40,
            right: 40,
            textAlign: "center",
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 36,
            color: C.gold,
            opacity: lin(t, at + 0.15, at + 0.35),
          }}
        >
          {c.itens}
        </div>
        <div style={{ position: "absolute", top: 1100, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12 }}>
          {CATS.map((x, i) => (
            <div key={x.k} style={{ width: i === idx ? 52 : 16, height: 16, borderRadius: 8, background: i <= idx ? C.gold : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) TUDO NUM SÓ LUGAR — os 7 cartões juntos
const Tudo: React.FC = () => {
  const t = useT(B.tudo);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 300, left: 90, right: 90, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
        {CATS.map((c, i) => {
          const s = sp(t, B.tudo + 0.05 + i * 0.05);
          return (
            <div
              key={c.k}
              style={{
                width: 190,
                height: 190,
                borderRadius: 40,
                background: C.white,
                border: `5px solid ${C.gold}`,
                boxShadow: `0 10px 0 ${C.goldDark}, 0 24px 30px rgba(0,0,0,0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s})`,
              }}
            >
              <Icone tipo={c.k} size={140} />
            </div>
          );
        })}
      </div>
      <Centro top={880}>
        <Faixa t={t} at={quando("Tudo", B.tudo - 0.5)} size={64}>
          Tudo num só
        </Faixa>
      </Centro>
      <Centro top={1040}>
        <Big t={t} at={quando("lugar", B.tudo - 0.5)} size={220}>
          Lugar!
        </Big>
      </Centro>
    </AbsoluteFill>
  );
};

// 5) EMBALAGENS pra sua casa / pro seu negócio
const Embalagens: React.FC = () => {
  const t = useT(B.embalagens);
  const opcoes = [
    { tipo: "casa", txt: "Pra sua casa", at: quando("casa", B.embalagens) - 0.2 },
    { tipo: "loja", txt: "Pro seu negócio", at: quando("negócio", B.embalagens) - 0.2 },
  ];
  return (
    <AbsoluteFill>
      <Centro top={250}>
        <div style={{ transform: `scale(${sp(t, B.embalagens)})` }}>
          <div style={{ width: 230, height: 230, borderRadius: "50%", background: C.white, border: `8px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 40px rgba(0,0,0,0.35)" }}>
            <Icone tipo="embalagens" size={170} />
          </div>
        </div>
      </Centro>
      <Centro top={560}>
        <Big t={t} at={quando("Embalagens", B.embalagens - 0.3)} size={136}>
          Embalagens
        </Big>
      </Centro>
      <div style={{ position: "absolute", top: 840, left: 70, right: 70, display: "flex", justifyContent: "space-between" }}>
        {opcoes.map((o) => {
          const s = sp(t, o.at);
          return (
            <div
              key={o.tipo}
              style={{
                width: 450,
                height: 540,
                borderRadius: 44,
                background: C.white,
                border: `6px solid ${C.gold}`,
                boxShadow: `0 12px 0 ${C.goldDark}, 0 30px 40px rgba(0,0,0,0.35)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                boxSizing: "border-box",
                opacity: t < o.at ? 0 : 1,
                transform: `translateY(${(1 - Math.min(1, s)) * 200}px) scale(${0.7 + 0.3 * Math.min(1, s)})`,
              }}
            >
              <Icone tipo={o.tipo} size={250} />
              <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 50, color: C.red, textTransform: "uppercase", textAlign: "center", lineHeight: 1.05, padding: "0 20px" }}>
                {o.txt}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 6) QUALIDADE / VARIEDADE / CONFIANÇA
const Qualidade: React.FC = () => {
  const t = useT(B.qualidade);
  const itens = ["Qualidade", "Variedade", "Confiança"].map((w) => ({ w, at: quando(w, B.qualidade - 0.5) - 0.1 }));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 70 }}>
        {itens.map((it) => {
          const s = sp(t, it.at, { damping: 10, stiffness: 170, mass: 0.6 });
          return (
            <div
              key={it.w}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                width: 860,
                padding: "34px 44px",
                borderRadius: 999,
                background: C.white,
                border: `6px solid ${C.gold}`,
                boxShadow: `0 12px 0 ${C.goldDark}, 0 30px 40px rgba(0,0,0,0.35)`,
                boxSizing: "border-box",
                opacity: t < it.at ? 0 : 1,
                transform: `translateX(${(1 - Math.min(1, s)) * 900}px) scale(${0.8 + 0.2 * Math.min(1, s)})`,
              }}
            >
              <div style={{ width: 110, height: 110, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width={70} height={70} viewBox="0 0 24 24">
                  <path d="M5 12.5 L10 17 L19 7" fill="none" stroke={C.white} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 92, color: C.red, textTransform: "uppercase" }}>{it.w}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 7) OFERTAS TODA SEMANA (calendário com argolas, como nos encartes)
const Ofertas: React.FC = () => {
  const t = useT(B.ofertas);
  const tO = quando("ofertas", B.ofertas - 0.5);
  const cal = sp(t, B.ofertas + 0.05, { damping: 9, stiffness: 140, mass: 0.8 });
  return (
    <AbsoluteFill>
      <Centro top={400}>
        <div style={{ position: "relative", width: 300, height: 300, transform: `scale(${cal})` }}>
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, bottom: 0, borderRadius: 40, background: C.white, boxShadow: "0 24px 40px rgba(0,0,0,0.35)", overflow: "hidden" }}>
            <div style={{ height: 80, background: C.red }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.red }}>%</div>
          </div>
          {[70, 200].map((x) => (
            <div key={x} style={{ position: "absolute", left: x, top: 0, width: 30, height: 90, borderRadius: 15, background: GOLD, border: "4px solid #fff" }} />
          ))}
        </div>
      </Centro>
      <Centro top={790}>
        <Big t={t} at={tO} size={200}>
          Ofertas
        </Big>
      </Centro>
      <Centro top={1040}>
        <Faixa t={t} at={quando("toda", tO)} size={80}>
          Toda semana
        </Faixa>
      </Centro>
    </AbsoluteFill>
  );
};

// 8) HORÁRIO DE FUNCIONAMENTO
const Despertador: React.FC<{ t: number }> = ({ t }) => {
  const treme = Math.sin(t * 40) * 6 * Math.max(0, 1 - (t - B.horario) / 0.9);
  return (
    <svg width={240} height={240} viewBox="0 0 200 200" style={{ transform: `rotate(${treme}deg)`, filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.35))" }}>
      <circle cx={52} cy={36} r={24} fill={C.gold} />
      <circle cx={148} cy={36} r={24} fill={C.gold} />
      <circle cx={100} cy={110} r={84} fill={C.gold} />
      <circle cx={100} cy={110} r={70} fill={C.white} />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={98} y={44} width={4} height={i % 3 === 0 ? 14 : 8} fill={C.redDark} transform={`rotate(${i * 30} 100 110)`} />
      ))}
      <rect x={96} y={66} width={8} height={48} rx={4} fill={C.red} transform="rotate(195 100 110)" />
      <rect x={98} y={50} width={4} height={64} rx={2} fill={C.redDark} transform="rotate(180 100 110)" />
      <circle cx={100} cy={110} r={8} fill={C.gold} />
    </svg>
  );
};

const Turno: React.FC<{ t: number; at: number; dia: string; hora: string }> = ({ t, at, dia, hora }) => {
  const s = sp(t, at, { damping: 11, stiffness: 160, mass: 0.7 });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: t < at ? 0 : 1,
        transform: `scale(${0.6 + 0.4 * Math.min(1, s)})`,
        filter: `blur(${(1 - Math.min(1, s)) * 10}px)`,
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 56, color: C.gold, letterSpacing: 2 }}>→ {dia} ←</div>
      <div
        style={{
          padding: "14px 46px",
          borderRadius: 26,
          border: `6px solid ${C.white}`,
          background: "rgba(70,0,4,0.45)",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 100,
          color: C.white,
          letterSpacing: 1,
          whiteSpace: "nowrap",
        }}
      >
        {hora}
      </div>
    </div>
  );
};

const Horario: React.FC = () => {
  const t = useT(B.horario);
  const tH = quando("horário", B.horario - 0.5);
  return (
    <AbsoluteFill>
      <Centro top={190}>
        <div style={{ transform: `scale(${sp(t, B.horario + 0.05)})` }}>
          <Despertador t={t} />
        </div>
      </Centro>
      <Centro top={450}>
        <Big t={t} at={tH} size={170}>
          Horário
        </Big>
      </Centro>
      <Centro top={650}>
        <Faixa t={t} at={tH + 0.2} size={56}>
          de funcionamento
        </Faixa>
      </Centro>
      <Centro top={850}>
        <Turno t={t} at={quando("segunda", B.horario) - 0.1} dia="SEG A SÁB" hora="06:30 ÀS 21:30" />
      </Centro>
      <Centro top={1190}>
        <Turno t={t} at={quando("domingos", B.horario) - 0.1} dia="DOMINGO" hora="07:00 ÀS 21:00" />
      </Centro>
    </AbsoluteFill>
  );
};

// 9) ENDEREÇO: "Venha nos visitar!" + mapa 2D com pino + cartão
const Endereco: React.FC = () => {
  const t = useT(B.endereco);
  const tAv = quando("Av.", B.endereco);
  const mapa = sp(t, B.endereco + 0.4, SOFT);
  const rota = lin(t, B.endereco + 0.6, B.endereco + 2.0);
  const pino = sp(t, B.endereco + 1.8, { damping: 7, stiffness: 170, mass: 0.8 });
  const pulso = (((t - B.endereco - 2.1) % 1) + 1) % 1;
  const linhas = [
    { txt: "Av. das Paineiras, Qd. 96, Lt. 12", at: tAv, big: true },
    { txt: "Próximo à feira de quinta", at: quando("próximo", B.endereco), big: false },
    { txt: "St. Pontakayana", at: quando("Setor", B.endereco), big: false },
    { txt: "Trindade – GO", at: quando("Trindade", B.endereco), big: true },
  ];
  const caminho = "M 80 400 L 80 250 L 380 250 L 380 120 L 640 120";
  return (
    <AbsoluteFill>
      <Centro top={190}>
        <Faixa t={t} at={B.endereco} size={50}>
          Venha nos
        </Faixa>
      </Centro>
      <Centro top={290}>
        <Big t={t} at={quando("visitar", B.endereco - 0.5)} size={150}>
          Visitar!
        </Big>
      </Centro>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 520,
          width: 860,
          height: 480,
          borderRadius: 36,
          background: "#F3EBD7",
          border: `8px solid ${C.gold}`,
          overflow: "hidden",
          boxShadow: "0 30px 50px rgba(0,0,0,0.35)",
          transform: `scale(${mapa})`,
        }}
      >
        <svg width={844} height={464}>
          {[[20, 20], [240, 20], [460, 20], [680, 20], [20, 280], [240, 280], [460, 280], [680, 280], [460, 150]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={200} height={i === 8 ? 90 : 150} rx={14} fill={i % 3 === 1 ? "#B9D99A" : "#E2D8C0"} />
          ))}
          <text x={110} y={240} fontFamily={FONT} fontSize={20} fontWeight={800} fill="#9A8B6A">AV. DAS PAINEIRAS</text>
          <text x={490} y={202} fontFamily={FONT} fontSize={18} fontWeight={800} fill="#6E8F4F">FEIRA DE QUINTA</text>
          <path d={caminho} pathLength={1} stroke={C.gold} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - rota} />
          <path d={caminho} stroke={C.redDark} strokeWidth={4} strokeDasharray="10 14" fill="none" opacity={rota} />
        </svg>
        {t > B.endereco + 2.1 ? (
          <div style={{ position: "absolute", left: 640 - 70, top: 120 - 30, width: 140, height: 60, borderRadius: "50%", border: `5px solid ${C.red}`, transform: `scale(${1 + pulso})`, opacity: 1 - pulso }} />
        ) : null}
      </div>
      <svg
        width={140}
        height={186}
        viewBox="0 0 60 80"
        style={{ position: "absolute", left: 118 + 640 - 70, top: 528 + 120 - 180 - (1 - pino) * 700, opacity: t > B.endereco + 1.8 ? 1 : 0, filter: "drop-shadow(0 14px 10px rgba(0,0,0,0.45))" }}
      >
        <path d="M30 78 C30 78 4 46 4 28 A26 26 0 0 1 56 28 C56 46 30 78 30 78Z" fill={C.red} stroke={C.white} strokeWidth={3} />
        <circle cx={30} cy={28} r={11} fill={C.white} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 1060,
          padding: "36px 44px",
          borderRadius: 40,
          background: C.white,
          border: `6px solid ${C.gold}`,
          boxShadow: `0 12px 0 ${C.goldDark}, 0 30px 40px rgba(0,0,0,0.35)`,
          display: "flex",
          gap: 28,
          fontFamily: FONT,
          opacity: t < tAv - 0.2 ? 0 : 1,
          transform: `translateY(${(1 - Math.min(1, sp(t, tAv - 0.2))) * 400}px)`,
        }}
      >
        <svg width={80} height={106} viewBox="0 0 60 80" style={{ flexShrink: 0 }}>
          <path d="M30 78 C30 78 4 46 4 28 A26 26 0 0 1 56 28 C56 46 30 78 30 78Z" fill={C.red} />
          <circle cx={30} cy={28} r={11} fill={C.white} />
        </svg>
        <div>
          {linhas.map((l) => {
            const k = sp(t, l.at - 0.05);
            return (
              <div
                key={l.txt}
                style={{
                  fontSize: l.big ? 44 : 38,
                  fontWeight: l.big ? 900 : 600,
                  color: l.big ? C.red : "#333",
                  lineHeight: 1.35,
                  opacity: t < l.at - 0.05 ? 0 : Math.min(1, k * 1.5),
                  transform: `translateX(${(1 - Math.min(1, k)) * 60}px)`,
                }}
              >
                {l.txt}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 10) WHATSAPP
const Whatsapp: React.FC = () => {
  const t = useT(B.whatsapp);
  const tN = quando("(62)", B.whatsapp);
  const ic = sp(t, B.whatsapp + 0.05, { damping: 9, stiffness: 140, mass: 0.8 });
  const num = "(62) 99376-2140";
  const n = Math.floor(interpolate(t, [tN, tN + 2.6], [0, num.length], CLAMP));
  const box = sp(t, tN - 0.2, SOFT);
  return (
    <AbsoluteFill>
      <Centro top={260}>
        <div style={{ transform: `scale(${ic})`, filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.4))", borderRadius: "50%", border: `8px solid ${C.white}`, display: "flex" }}>
          <Zap size={240} />
        </div>
      </Centro>
      <Centro top={620}>
        <Faixa t={t} at={quando("pedido", B.whatsapp - 0.5)} size={58}>
          Faça seu pedido pelo
        </Faixa>
      </Centro>
      <Centro top={790}>
        <Big t={t} at={quando("WhatsApp", B.whatsapp - 0.5)} size={170}>
          WhatsApp
        </Big>
      </Centro>
      <Centro top={1060}>
        <div
          style={{
            padding: "26px 50px",
            borderRadius: 30,
            background: C.white,
            border: `8px solid ${C.green}`,
            boxShadow: "0 12px 0 #157A3D, 0 30px 40px rgba(0,0,0,0.35)",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 92,
            color: C.ink,
            whiteSpace: "nowrap",
            opacity: t < tN - 0.2 ? 0 : 1,
            transform: `scale(${box})`,
          }}
        >
          {num.slice(0, n)}
          <span style={{ opacity: 0 }}>{num.slice(n)}</span>
        </div>
      </Centro>
    </AbsoluteFill>
  );
};

// 11) ENTREGAS RÁPIDAS + assinatura
const Marca: React.FC = () => {
  const t = useT(B.marca);
  const logo = sp(t, B.marca + 0.05, { damping: 9, stiffness: 120, mass: 0.8 });
  return (
    <AbsoluteFill>
      <Centro top={280}>
        <div style={{ transform: `scale(${logo})`, padding: 14, borderRadius: 90, background: GOLD, boxShadow: "0 30px 50px rgba(0,0,0,0.4)" }}>
          <Logo size={330} />
        </div>
      </Centro>
      <Centro top={760}>
        <Faixa t={t} at={B.marca + 0.3} size={46} branca>
          Benatti Frios e Embalagens
        </Faixa>
      </Centro>
      <Centro top={930}>
        <Big t={t} at={quando("entregas", B.marca)} size={150}>
          Entregas
        </Big>
      </Centro>
      <Centro top={1100}>
        <Big t={t} at={quando("rápidas", B.marca)} size={170} cor={C.gold}>
          Rápidas!
        </Big>
      </Centro>
    </AbsoluteFill>
  );
};

// 12) FINAL: siga no Instagram
const Fim: React.FC = () => {
  const t = useT(B.fim);
  const logo = sp(t, B.fim + 0.15, { damping: 10, stiffness: 120, mass: 0.8 });
  const handle = "@benattifrios";
  const n = Math.floor(interpolate(t, [B.fim + 0.9, B.fim + 2.0], [0, handle.length], CLAMP));
  const fade = lin(t, DURACAO - 0.4, DURACAO);
  return (
    <AbsoluteFill style={{ opacity: 1 - fade }}>
      <Centro top={420}>
        <div style={{ transform: `scale(${logo})` }}>
          <Logo size={260} />
        </div>
      </Centro>
      <Centro top={760}>
        <Faixa t={t} at={B.fim + 0.5} size={60}>
          Siga a gente
        </Faixa>
      </Centro>
      <Centro top={910}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            width: 760,
            padding: "26px 36px",
            borderRadius: 30,
            background: C.white,
            boxShadow: `0 12px 0 ${C.goldDark}, 0 30px 40px rgba(0,0,0,0.35)`,
            border: `6px solid ${C.gold}`,
            boxSizing: "border-box",
            fontFamily: FONT,
            transform: `scale(${sp(t, B.fim + 0.7, SOFT)})`,
          }}
        >
          <svg width={60} height={60} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <rect x={2} y={2} width={20} height={20} rx={6} fill="none" stroke={C.red} strokeWidth={2.2} />
            <circle cx={12} cy={12} r={4.5} fill="none" stroke={C.red} strokeWidth={2.2} />
            <circle cx={17.5} cy={6.5} r={1.4} fill={C.red} />
          </svg>
          <div style={{ fontSize: 64, fontWeight: 800, color: C.ink, whiteSpace: "nowrap" }}>
            {handle.slice(0, n)}
            <span style={{ color: C.red, opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>|</span>
          </div>
        </div>
      </Centro>
      <Centro top={1130}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 40, color: C.white, opacity: lin(t, B.fim + 2.0, B.fim + 2.4), textAlign: "center", lineHeight: 1.4 }}>
          Av. das Paineiras · Trindade – GO
          <br />
          <span style={{ color: C.gold }}>(62) 99376-2140</span>
        </div>
      </Centro>
    </AbsoluteFill>
  );
};

// ============================================================
//  COMPOSIÇÃO
// ============================================================
const ORDEM: { k: keyof typeof B; C: React.FC }[] = [
  { k: "logo", C: Abertura },
  { k: "atacado", C: Atacado },
  { k: "produtos", C: Produtos },
  { k: "tudo", C: Tudo },
  { k: "embalagens", C: Embalagens },
  { k: "qualidade", C: Qualidade },
  { k: "ofertas", C: Ofertas },
  { k: "horario", C: Horario },
  { k: "endereco", C: Endereco },
  { k: "whatsapp", C: Whatsapp },
  { k: "marca", C: Marca },
  { k: "fim", C: Fim },
];

// Espera a fonte Poppins carregar antes de renderizar
const useFontes = () => {
  const [h] = useState(() => delayRender("Carregando Poppins"));
  useEffect(() => {
    Promise.all(
      ["300 40px Poppins", "400 40px Poppins", "600 40px Poppins", "800 40px Poppins", "900 40px Poppins", "italic 900 40px Poppins"].map((f) =>
        document.fonts.load(f),
      ),
    )
      .then(() => continueRender(h))
      .catch(() => continueRender(h));
  }, [h]);
};

export const Benatti: React.FC = () => {
  useFontes();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Fundo />
      <Sequence from={sec(B.atacado)} name="moedas-rodape">
        <Camadas />
      </Sequence>
      {ORDEM.map(({ k, C: Scene }, i) => {
        const ini = B[k];
        const fim = i < ORDEM.length - 1 ? B[ORDEM[i + 1].k] : DURACAO;
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
      <Sequence from={sec(VOZ_INICIO)}>
        <Audio src={staticFile("benatti-narracao.wav")} />
      </Sequence>
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
        durationInFrames={BENATTI_TOTAL} // 1425 = 47,5s × 30fps
        fps={BENATTI_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
EOF
cat > remotion.config.ts << 'EOF'
// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

EOF
