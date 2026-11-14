npm install @fontsource/inter@5
mkdir -p src
cat > src/Benatti.tsx << 'EOF'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
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
//  ESTILO APPLE
// ============================================================
const C = {
  branco: "#FBFBFD",
  cinza: "#F5F5F7",
  preto: "#000000",
  texto: "#1D1D1F",
  sub: "#6E6E73",
  linha: "#D2D2D7",
  red: "#D7191F",
  verde: "#30D158",
};
const FONT = 'Inter, "SF Pro Display", "Helvetica Neue", Arial, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';
const DEGRADE = "linear-gradient(90deg, #D7191F 0%, #F04E23 45%, #F5A623 100%)";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SUAVE = Easing.bezier(0.16, 1, 0.3, 1); // curva "Apple": rápida no começo, pousa macio

const useT = (start: number) => useCurrentFrame() / FPS + start;
const rev = (t: number, at: number, dur = 0.7) => interpolate(t, [at, at + dur], [0, 1], { ...CLAMP, easing: SUAVE });

// Texto que surge (sobe levemente + desfoque some)
const Surge: React.FC<{
  t: number;
  at: number;
  children: React.ReactNode;
  size?: number;
  weight?: number;
  cor?: string;
  degrade?: boolean;
  style?: React.CSSProperties;
}> = ({ t, at, children, size = 64, weight = 600, cor = C.texto, degrade, style }) => {
  const k = rev(t, at);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: size > 90 ? -size * 0.035 : -size * 0.015,
        lineHeight: 1.05,
        color: degrade ? "transparent" : cor,
        background: degrade ? DEGRADE : undefined,
        WebkitBackgroundClip: degrade ? "text" : undefined,
        backgroundClip: degrade ? "text" : undefined,
        opacity: k,
        filter: `blur(${(1 - k) * 12}px)`,
        transform: `translateY(${(1 - k) * 40}px)`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Centro: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", textAlign: "center" }}>
    {children}
  </div>
);

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.225,
      overflow: "hidden",
      background: "#E22521",
      boxShadow: `0 ${size * 0.1}px ${size * 0.25}px rgba(0,0,0,0.18)`,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Img src={staticFile("benatti-logo.jpg")} style={{ width: "82%", height: "82%", objectFit: "contain" }} />
  </div>
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
        <rect x={28} y={26} width={14} height={14} rx={3} fill="#E8E8ED" />
        <rect x={54} y={42} width={30} height={46} rx={6} fill="#3B8FD9" />
        <rect x={62} y={28} width={14} height={16} fill="#1F5FA3" />
        <path d="M62 28 L62 20 L88 20 L88 28 Z" fill="#1F5FA3" />
        <rect x={58} y={56} width={22} height={14} rx={3} fill={w} />
      </>
    ),
    festa: (
      <>
        <ellipse cx={40} cy={36} rx={20} ry={25} fill={r} />
        <ellipse cx={66} cy={44} rx={17} ry={21} fill="#F2B820" />
        <ellipse cx={34} cy={28} rx={5} ry={8} fill="#FF7A7E" />
        <path d="M40 61 L36 68 L44 68 Z M66 65 L62 71 L70 71 Z" fill={r} />
        <path d="M40 68 C44 78 36 84 42 94 M66 71 C62 80 70 86 64 94" stroke="#8E8E93" strokeWidth={2} fill="none" />
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
//  CENA: cada uma tem o próprio fundo; troca com fade + leve zoom
// ============================================================
const TR = 12;
const Cena: React.FC<{ dur: number; last?: boolean; fundo: string; children: React.ReactNode }> = ({
  dur,
  last,
  fundo,
  children,
}) => {
  const f = useCurrentFrame();
  const e = interpolate(f, [0, TR], [0, 1], { ...CLAMP, easing: SUAVE });
  const x = last ? 0 : interpolate(f, [dur, dur + TR], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const cam = interpolate(f, [0, dur], [1, 1.025], CLAMP);
  return (
    <AbsoluteFill style={{ backgroundColor: fundo, opacity: e * (1 - x) }}>
      <AbsoluteFill style={{ transform: `scale(${(1.03 - 0.03 * e) * cam})`, filter: `blur(${x * 10}px)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
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
  const vira = interpolate(t, [0.85, 1.5], [0, 1], { ...CLAMP, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  const tB = quando("Benatti");
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
          background: C.texto,
          opacity: t < 0.85 ? 1 : 0,
        }}
      />
      <div style={{ position: "absolute", left: 540 - 150, top: 632, opacity: t >= 0.85 ? 1 : 0, transform: `scale(${vira}) rotate(${(1 - vira) * -120}deg)` }}>
        <Logo size={300} />
      </div>
      <Centro top={1010}>
        <Surge t={t} at={tB} size={128} cor={C.red} style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: 0 }}>
          Benatti
        </Surge>
      </Centro>
      <Centro top={1170}>
        <Surge t={t} at={quando("Frios", tB)} size={52} weight={500} cor={C.sub}>
          Frios e Embalagens
        </Surge>
      </Centro>
    </AbsoluteFill>
  );
};

// 2) Atacado e varejo. Qualidade. Preço justo.
const Atacado: React.FC = () => {
  const t = useT(B.atacado);
  return (
    <AbsoluteFill>
      <Centro top={660}>
        <Surge t={t} at={quando("Atacado", B.atacado - 0.3)} size={56} weight={500} cor={C.sub}>
          Atacado e varejo.
        </Surge>
      </Centro>
      <Centro top={770}>
        <Surge t={t} at={quando("qualidade", B.atacado)} size={190} weight={700} degrade>
          Qualidade.
        </Surge>
      </Centro>
      <Centro top={1000}>
        <Surge t={t} at={quando("preço", B.atacado)} size={96} weight={700}>
          Preço justo.
        </Surge>
      </Centro>
    </AbsoluteFill>
  );
};

// 3) Produtos: carrossel de cartões; o cartão da categoria falada vem para o centro
const CATS = [
  { k: "carnes", nome: "Carnes" },
  { k: "frios", nome: "Frios" },
  { k: "frango", nome: "Frango" },
  { k: "mercearia", nome: "Mercearia" },
  { k: "limpeza", nome: "Limpeza" },
  { k: "festa", nome: "Artigos de festa" },
  { k: "embalagens", nome: "Embalagens" },
];

const Produtos: React.FC = () => {
  const t = useT(B.produtos);
  const vezes = CATS.map((c) => quando(c.k === "festa" ? "artigos" : c.k, B.produtos - 0.3) - 0.1);
  // posição contínua do carrossel (desliza suave de um cartão para o outro)
  const pos = vezes.reduce((acc, v, i) => (i === 0 ? 0 : acc + interpolate(t, [v, v + 0.45], [0, 1], { ...CLAMP, easing: SUAVE })), 0);
  const entra = rev(t, B.produtos + 0.1, 0.9);
  const CW = 640;
  const GAP = 50;
  return (
    <AbsoluteFill>
      <Centro top={250}>
        <Surge t={t} at={B.produtos + 0.05} size={52} weight={500} cor={C.sub}>
          Aqui você encontra
        </Surge>
      </Centro>
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, height: 1000, opacity: entra, transform: `translateY(${(1 - entra) * 120}px)` }}>
        {CATS.map((c, i) => {
          const d = i - pos;
          const foco = Math.max(0, 1 - Math.abs(d));
          const x = 540 - CW / 2 + d * (CW + GAP);
          return (
            <div
              key={c.k}
              style={{
                position: "absolute",
                left: x,
                top: 0,
                width: CW,
                height: 860,
                borderRadius: 64,
                background: C.cinza,
                boxShadow: `0 30px 80px rgba(0,0,0,${0.04 + 0.08 * foco})`,
                transform: `scale(${0.86 + 0.14 * foco})`,
                opacity: 0.35 + 0.65 * foco,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 50,
              }}
            >
              <div style={{ filter: "drop-shadow(0 24px 24px rgba(0,0,0,0.12))", transform: `translateY(${(1 - foco) * 30}px)` }}>
                <Icone tipo={c.k} size={380} />
              </div>
              <div style={{ fontFamily: FONT, fontSize: c.nome.length > 12 ? 64 : 80, fontWeight: 700, letterSpacing: -2, color: C.texto }}>{c.nome}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1360, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, opacity: entra }}>
        {CATS.map((c, i) => {
          const foco = Math.max(0, 1 - Math.abs(i - pos));
          return <div key={c.k} style={{ width: 14 + 30 * foco, height: 14, borderRadius: 7, background: foco > 0.5 ? C.texto : C.linha }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

// 4) Tudo num só lugar. (fundo preto)
const Tudo: React.FC = () => {
  const t = useT(B.tudo);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 420, left: 110, right: 110, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 26 }}>
        {CATS.map((c, i) => {
          const k = rev(t, B.tudo + 0.05 + i * 0.06, 0.6);
          return (
            <div
              key={c.k}
              style={{
                width: 180,
                height: 180,
                borderRadius: 44,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: k,
                transform: `translateY(${(1 - k) * 30}px)`,
              }}
            >
              <Icone tipo={c.k} size={120} />
            </div>
          );
        })}
      </div>
      <Centro top={900}>
        <Surge t={t} at={quando("Tudo", B.tudo - 0.5)} size={110} weight={700} cor="#F5F5F7">
          Tudo num só
        </Surge>
      </Centro>
      <Centro top={1030}>
        <Surge t={t} at={quando("lugar", B.tudo - 0.5)} size={200} weight={800} degrade>
          lugar.
        </Surge>
      </Centro>
    </AbsoluteFill>
  );
};

// 5) Embalagens. Pra sua casa / Pro seu negócio
const Embalagens: React.FC = () => {
  const t = useT(B.embalagens);
  const opcoes = [
    { tipo: "casa", txt: "Pra sua casa.", at: quando("casa", B.embalagens) - 0.25 },
    { tipo: "loja", txt: "Pro seu negócio.", at: quando("negócio", B.embalagens) - 0.25 },
  ];
  return (
    <AbsoluteFill>
      <Centro top={380}>
        <Surge t={t} at={quando("Embalagens", B.embalagens - 0.3)} size={150} weight={700}>
          Embalagens.
        </Surge>
      </Centro>
      <div style={{ position: "absolute", top: 700, left: 70, right: 70, display: "flex", justifyContent: "space-between" }}>
        {opcoes.map((o) => {
          const k = rev(t, o.at, 0.8);
          return (
            <div
              key={o.tipo}
              style={{
                width: 455,
                height: 620,
                borderRadius: 56,
                background: C.cinza,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 40,
                opacity: k,
                transform: `translateY(${(1 - k) * 80}px)`,
                filter: `blur(${(1 - k) * 10}px)`,
              }}
            >
              <Icone tipo={o.tipo} size={250} />
              <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 700, letterSpacing: -1.5, color: C.texto }}>{o.txt}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 6) Qualidade. Variedade. Confiança. (fundo preto, palavra falada acende)
const Qualidade: React.FC = () => {
  const t = useT(B.qualidade);
  const itens = ["Qualidade.", "Variedade.", "Confiança."].map((w) => ({ w, at: quando(w, B.qualidade - 0.5) - 0.1 }));
  const atual = itens.reduce((acc, it, i) => (t >= it.at ? i : acc), 0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {itens.map((it, i) => (
          <Surge key={it.w} t={t} at={it.at} size={150} weight={700} cor={i === atual ? undefined : "#86868B"} degrade={i === atual}>
            {it.w}
          </Surge>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 7) Ofertas toda semana.
const Ofertas: React.FC = () => {
  const t = useT(B.ofertas);
  const tO = quando("ofertas", B.ofertas - 0.5);
  return (
    <AbsoluteFill>
      <Centro top={760}>
        <Surge t={t} at={tO - 0.1} size={210} weight={800} degrade>
          Ofertas
        </Surge>
      </Centro>
      <Centro top={1000}>
        <Surge t={t} at={quando("toda", tO)} size={84} weight={600}>
          toda semana.
        </Surge>
      </Centro>
    </AbsoluteFill>
  );
};

// 8) Horário: tabela limpa, linha por linha
const Horario: React.FC = () => {
  const t = useT(B.horario);
  const linhas = [
    { dia: "Segunda a sábado", hora: "6h30 – 21h30", at: quando("segunda", B.horario) - 0.15 },
    { dia: "Domingo", hora: "7h – 21h", at: quando("domingos", B.horario) - 0.15 },
  ];
  return (
    <AbsoluteFill>
      <Centro top={470}>
        <Surge t={t} at={B.horario + 0.1} size={48} weight={500} cor={C.sub}>
          Horário de funcionamento
        </Surge>
      </Centro>
      <Centro top={560}>
        <Surge t={t} at={quando("horário", B.horario - 0.5)} size={118} weight={700}>
          Aberto todo dia.
        </Surge>
      </Centro>
      <div style={{ position: "absolute", top: 860, left: 90, right: 90 }}>
        {linhas.map((l) => {
          const k = rev(t, l.at, 0.8);
          return (
            <div key={l.dia} style={{ borderTop: `2px solid ${C.linha}`, padding: "44px 0", opacity: k, transform: `translateY(${(1 - k) * 40}px)`, filter: `blur(${(1 - k) * 8}px)` }}>
              <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 500, color: C.sub }}>{l.dia}</div>
              <div style={{ fontFamily: FONT, fontSize: 130, fontWeight: 700, letterSpacing: -4, color: C.texto, marginTop: 6 }}>{l.hora}</div>
            </div>
          );
        })}
        <div style={{ borderTop: `2px solid ${C.linha}`, opacity: rev(t, linhas[1].at, 0.8) }} />
      </div>
    </AbsoluteFill>
  );
};

// 9) Endereço: cartão estilo "mapas", minimalista
const Endereco: React.FC = () => {
  const t = useT(B.endereco);
  const tAv = quando("Av.", B.endereco);
  const card = rev(t, B.endereco + 0.3, 0.9);
  const pino = interpolate(t, [B.endereco + 0.9, B.endereco + 1.5], [0, 1], { ...CLAMP, easing: Easing.bezier(0.34, 1.4, 0.64, 1) });
  const pulso = (((t - B.endereco - 1.5) % 1.4) + 1.4) % 1.4 / 1.4;
  const linhas = [
    { txt: "Av. das Paineiras, Qd. 96, Lt. 12", at: tAv, forte: true },
    { txt: "Próximo à feira de quinta", at: quando("próximo", B.endereco), forte: false },
    { txt: "St. Pontakayana · Trindade – GO", at: quando("Setor", B.endereco), forte: false },
  ];
  return (
    <AbsoluteFill>
      <Centro top={230}>
        <Surge t={t} at={quando("visitar", B.endereco - 1)} size={120} weight={700}>
          Venha nos visitar.
        </Surge>
      </Centro>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 470,
          height: 1180,
          borderRadius: 64,
          background: "#FFFFFF",
          boxShadow: "0 40px 100px rgba(0,0,0,0.10)",
          overflow: "hidden",
          opacity: card,
          transform: `translateY(${(1 - card) * 100}px)`,
        }}
      >
        {/* mapa minimalista */}
        <svg width={940} height={720} style={{ position: "absolute", top: 0, left: 0 }}>
          <rect width={940} height={720} fill="#F2F1EC" />
          <rect x={560} y={420} width={300} height={220} rx={20} fill="#DDEBD3" />
          {["M -20 210 L 960 170", "M -20 470 L 960 520", "M 250 -20 L 300 740", "M 640 -20 L 600 740", "M -20 680 L 960 330"].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#E2E0D8" strokeWidth={46} fill="none" />
              <path d={d} stroke="#FFFFFF" strokeWidth={34} fill="none" />
            </g>
          ))}
          <text x={60} y={160} fontFamily={FONT} fontSize={24} fontWeight={600} fill="#8E8E93">Av. das Paineiras</text>
          <text x={600} y={600} fontFamily={FONT} fontSize={22} fontWeight={600} fill="#6E8F4F">Feira de quinta</text>
          <circle cx={450} cy={340} r={30 + pulso * 70} fill={C.red} opacity={0.18 * (1 - pulso)} />
        </svg>
        {/* pino */}
        <div style={{ position: "absolute", left: 450 - 50, top: 340 - 120, transform: `translateY(${(1 - pino) * -80}px) scale(${pino})`, transformOrigin: "50% 100%" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: C.red, boxShadow: "0 10px 20px rgba(215,25,31,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", overflow: "hidden", transform: "rotate(45deg)", background: "#E22521", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile("benatti-logo.jpg")} style={{ width: "85%", height: "85%", objectFit: "contain" }} />
            </div>
          </div>
        </div>
        {/* informações */}
        <div style={{ position: "absolute", top: 760, left: 60, right: 60, fontFamily: FONT }}>
          <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1.5, color: C.texto, opacity: rev(t, B.endereco + 0.6) }}>Benatti Frios e Embalagens</div>
          {linhas.map((l) => {
            const k = rev(t, l.at - 0.1, 0.6);
            return (
              <div key={l.txt} style={{ marginTop: 14, fontSize: l.forte ? 42 : 38, fontWeight: l.forte ? 600 : 500, color: l.forte ? C.texto : C.sub, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
                {l.txt}
              </div>
            );
          })}
          <div style={{ marginTop: 34, display: "inline-block", padding: "16px 40px", borderRadius: 999, background: C.red, color: "#fff", fontSize: 38, fontWeight: 600, opacity: rev(t, quando("Trindade", B.endereco), 0.6) }}>
            Trindade – GO
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 10) WhatsApp (fundo preto)
const Whatsapp: React.FC = () => {
  const t = useT(B.whatsapp);
  const tN = quando("(62)", B.whatsapp);
  const num = "(62) 99376-2140";
  const n = Math.floor(interpolate(t, [tN, tN + 2.4], [0, num.length], CLAMP));
  const icone = rev(t, B.whatsapp + 0.1, 0.9);
  return (
    <AbsoluteFill>
      <Centro top={420}>
        <div style={{ opacity: icone, transform: `scale(${0.8 + 0.2 * icone})`, width: 200, height: 200, borderRadius: 48, background: C.verde, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 80px rgba(48,209,88,0.35)" }}>
          <svg width={120} height={120} viewBox="0 0 24 24">
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </Centro>
      <Centro top={720}>
        <Surge t={t} at={quando("pedido", B.whatsapp - 0.5)} size={64} weight={500} cor="#86868B">
          Faça seu pedido pelo
        </Surge>
      </Centro>
      <Centro top={810}>
        <Surge t={t} at={quando("WhatsApp", B.whatsapp - 0.5)} size={170} weight={700} cor="#F5F5F7">
          WhatsApp.
        </Surge>
      </Centro>
      <Centro top={1080}>
        <div style={{ fontFamily: FONT, fontSize: 110, fontWeight: 700, letterSpacing: -3, color: C.verde, opacity: t >= tN - 0.1 ? 1 : 0, whiteSpace: "nowrap" }}>
          {num.slice(0, n)}
          <span style={{ opacity: 0 }}>{num.slice(n)}</span>
        </div>
      </Centro>
    </AbsoluteFill>
  );
};

// 11) Entregas rápidas.
const Marca: React.FC = () => {
  const t = useT(B.marca);
  const logo = rev(t, B.marca + 0.1, 1.0);
  return (
    <AbsoluteFill>
      <Centro top={500}>
        <div style={{ opacity: logo, transform: `scale(${0.85 + 0.15 * logo})` }}>
          <Logo size={260} />
        </div>
      </Centro>
      <Centro top={860}>
        <Surge t={t} at={quando("entregas", B.marca)} size={150} weight={700}>
          Entregas
        </Surge>
      </Centro>
      <Centro top={1020}>
        <Surge t={t} at={quando("rápidas", B.marca)} size={190} weight={800} degrade>
          rápidas.
        </Surge>
      </Centro>
    </AbsoluteFill>
  );
};

// 12) Final
const Fim: React.FC = () => {
  const t = useT(B.fim);
  const fade = interpolate(t, [DURACAO - 0.5, DURACAO], [1, 0], CLAMP);
  const logo = rev(t, B.fim + 0.2, 1.0);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Centro top={620}>
        <div style={{ opacity: logo, transform: `scale(${0.9 + 0.1 * logo})` }}>
          <Logo size={220} />
        </div>
      </Centro>
      <Centro top={900}>
        <Surge t={t} at={B.fim + 0.5} size={110} cor={C.red} style={{ fontFamily: SERIF, fontWeight: 700, letterSpacing: 0 }}>
          Benatti
        </Surge>
      </Centro>
      <Centro top={1040}>
        <Surge t={t} at={B.fim + 0.8} size={44} weight={500} cor={C.sub}>
          Frios e Embalagens
        </Surge>
      </Centro>
      <Centro top={1180}>
        <Surge t={t} at={B.fim + 1.3} size={40} weight={600}>
          @benattifrios · (62) 99376-2140
        </Surge>
      </Centro>
    </AbsoluteFill>
  );
};

// ============================================================
//  COMPOSIÇÃO
// ============================================================
const ORDEM: { k: keyof typeof B; C: React.FC; fundo: string }[] = [
  { k: "logo", C: Abertura, fundo: C.branco },
  { k: "atacado", C: Atacado, fundo: C.branco },
  { k: "produtos", C: Produtos, fundo: C.branco },
  { k: "tudo", C: Tudo, fundo: C.preto },
  { k: "embalagens", C: Embalagens, fundo: C.branco },
  { k: "qualidade", C: Qualidade, fundo: C.preto },
  { k: "ofertas", C: Ofertas, fundo: C.branco },
  { k: "horario", C: Horario, fundo: C.branco },
  { k: "endereco", C: Endereco, fundo: C.cinza },
  { k: "whatsapp", C: Whatsapp, fundo: C.preto },
  { k: "marca", C: Marca, fundo: C.branco },
  { k: "fim", C: Fim, fundo: C.branco },
];

// Espera a fonte Inter carregar antes de renderizar
const useFontes = () => {
  const [h] = useState(() => delayRender("Carregando Inter"));
  useEffect(() => {
    Promise.all(["400", "500", "600", "700", "800"].map((w) => document.fonts.load(`${w} 40px Inter`)))
      .then(() => continueRender(h))
      .catch(() => continueRender(h));
  }, [h]);
};

export const Benatti: React.FC = () => {
  useFontes();
  return (
    <AbsoluteFill style={{ backgroundColor: C.branco }}>
      {ORDEM.map(({ k, C: Scene, fundo }, i) => {
        const ini = B[k];
        const fim = i < ORDEM.length - 1 ? B[ORDEM[i + 1].k] : DURACAO;
        const last = i === ORDEM.length - 1;
        const dur = sec(fim) - sec(ini);
        return (
          <Sequence key={k} from={sec(ini)} durationInFrames={last ? dur : dur + TR} name={k}>
            <Cena dur={dur} last={last} fundo={fundo}>
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
