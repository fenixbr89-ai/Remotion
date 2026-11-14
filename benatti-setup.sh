npm install @fontsource/poppins@5
mkdir -p src
cat > src/Benatti.tsx << 'EOF'
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/800.css";
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

// Batidas (cenas curtas), em s do vídeo
const B = {
  logo: 0,
  atacado: 3.0,
  catalogo: 5.4,
  tudo: 12.25,
  embalagens: 13.9,
  qualidade: 16.75,
  ofertas: 18.8,
  horario: 20.55,
  visitar: 26.5,
  mapa: 27.45,
  whatsapp: 35.25,
  marca: 40.25,
  fim: 43.4,
};

// ============================================================
//  ESTILO
// ============================================================
const C = {
  paper: "#F1EFEA",
  cream: "#F6EAD7",
  ink: "#161616",
  gray: "#8C8C8C",
  red: "#D7191F",
  redDark: "#8E0B10",
  gold: "#F2B820",
  green: "#22B25A",
  dark: "#0F0F12",
  white: "#FFFFFF",
};
const FONT = "Poppins, Arial, sans-serif";
const SERIF = 'Georgia, "Times New Roman", serif';
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const POP = { damping: 11, stiffness: 150, mass: 0.7 };
const SOFT = { damping: 18, stiffness: 120, mass: 0.9 };

const sp = (t: number, at: number, config = POP) =>
  spring({ frame: (t - at) * FPS, fps: FPS, config });
const lin = (t: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], { ...CLAMP, easing: ease });
const useT = (start: number) => useCurrentFrame() / FPS + start;

// ============================================================
//  FUNDO COM "WIPES" CIRCULARES (troca de cor da tela inteira)
// ============================================================
const WIPES: { at: number; cor: string; x: number; y: number }[] = [
  { at: -1, cor: C.paper, x: 540, y: 960 },
  { at: B.catalogo - 0.15, cor: C.red, x: 540, y: 1500 },
  { at: B.tudo - 0.1, cor: C.paper, x: 540, y: 960 },
  { at: B.embalagens - 0.1, cor: C.cream, x: 900, y: 300 },
  { at: B.qualidade - 0.1, cor: "#E6E6E6", x: 540, y: 1900 },
  { at: B.ofertas - 0.1, cor: C.red, x: 540, y: 960 },
  { at: B.horario - 0.1, cor: C.paper, x: 200, y: 1600 },
  { at: B.whatsapp - 0.1, cor: C.paper, x: 540, y: 960 },
  { at: B.fim, cor: C.dark, x: 540, y: 960 },
];

const Fundo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let i = 0;
  WIPES.forEach((w, k) => {
    if (t >= w.at) i = k;
  });
  const atual = WIPES[i];
  const antes = WIPES[Math.max(0, i - 1)];
  const r = lin(t, atual.at, atual.at + 0.45, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ backgroundColor: r >= 1 ? atual.cor : antes.cor, overflow: "hidden" }}>
      {r < 1 ? (
        <div
          style={{
            position: "absolute",
            left: atual.x - 2300,
            top: atual.y - 2300,
            width: 4600,
            height: 4600,
            borderRadius: "50%",
            background: atual.cor,
            transform: `scale(${r})`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// ============================================================
//  TIPOGRAFIA CINÉTICA
// ============================================================
type WProps = {
  t: number;
  at: number;
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  from?: "baixo" | "cima" | "esq" | "dir" | "zoom";
  style?: React.CSSProperties;
};

// Uma palavra que entra com desfoque + deslocamento
const W: React.FC<WProps> = ({
  t,
  at,
  children,
  size = 56,
  weight = 300,
  color = C.ink,
  from = "baixo",
  style,
}) => {
  const k = sp(t, at, { damping: 15, stiffness: 170, mass: 0.6 });
  const d = 1 - Math.min(1, k);
  const off = {
    baixo: `translateY(${d * 50}px)`,
    cima: `translateY(${-d * 50}px)`,
    esq: `translateX(${-d * 90}px)`,
    dir: `translateX(${d * 90}px)`,
    zoom: `scale(${1 + d * 0.8})`,
  }[from];
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
        transform: `${off} scale(${0.9 + 0.1 * Math.min(1, k)})`,
        whiteSpace: "pre",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

const Linha: React.FC<{ top: number; children: React.ReactNode; gap?: number }> = ({
  top,
  children,
  gap = 14,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 40,
      right: 40,
      display: "flex",
      justifyContent: "center",
      alignItems: "baseline",
      flexWrap: "wrap",
      columnGap: gap,
    }}
  >
    {children}
  </div>
);

// Frase pequena palavra a palavra, sincronizada com a fala
const Frase: React.FC<{
  t: number;
  texto: string;
  depois: number;
  top: number;
  size?: number;
  color?: string;
}> = ({ t, texto, depois, top, size = 52, color = C.ink }) => {
  let ref = depois;
  const ws = texto.split(" ").map((w) => {
    const at = quando(w.replace(/[,.!:]/g, ""), ref);
    ref = at;
    return { w, at };
  });
  return (
    <Linha top={top}>
      {ws.map((p, i) => (
        <W key={i} t={t} at={p.at} size={size} color={color}>
          {p.w}
        </W>
      ))}
    </Linha>
  );
};

// Traço desenhado à mão (círculo, seta, rabisco)
const Traco: React.FC<{
  d: string;
  p: number;
  cor?: string;
  w?: number;
  width: number;
  height: number;
  style?: React.CSSProperties;
}> = ({ d, p, cor = C.gold, w = 7, width, height, style }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", overflow: "visible", ...style }}>
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={cor}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
  </svg>
);

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      overflow: "hidden",
      background: C.red,
      boxShadow: `0 ${size * 0.08}px ${size * 0.2}px rgba(120,0,0,0.35)`,
      flexShrink: 0,
    }}
  >
    <Img
      src={staticFile("benatti-logo.jpg")}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.15)" }}
    />
  </div>
);

const Cursor: React.FC<{ x: number; y: number; press: boolean; op?: number }> = ({
  x,
  y,
  press,
  op = 1,
}) => (
  <svg
    width={78}
    height={78}
    viewBox="0 0 24 24"
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity: op,
      transform: `scale(${press ? 0.85 : 1})`,
      filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.3))",
    }}
  >
    <path
      d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5c0 3.6-2.4 6.5-6 6.5h-1c-2.2 0-3.6-.9-4.8-2.5L3.6 14a1.5 1.5 0 0 1 2.3-1.9L9 15"
      fill={C.white}
      stroke={C.ink}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);

// Ícones (traço simples) usados no catálogo
const Icone: React.FC<{ tipo: string; size?: number; cor?: string }> = ({
  tipo,
  size = 120,
  cor = C.red,
}) => {
  const s: Record<string, React.ReactNode> = {
    carnes: (
      <>
        <path d="M18 55 C12 30 42 14 64 22 C86 30 90 60 72 74 C56 86 24 80 18 55Z" fill={cor} />
        <circle cx={62} cy={52} r={9} fill="#fff" />
      </>
    ),
    frios: (
      <>
        <path d="M12 70 L80 30 L88 70 Z" fill={C.gold} />
        <rect x={12} y={70} width={76} height={10} fill="#C9971A" />
        <circle cx={60} cy={58} r={6} fill="#C9971A" />
        <circle cx={74} cy={50} r={4} fill="#C9971A" />
      </>
    ),
    frango: (
      <>
        <ellipse cx={40} cy={42} rx={26} ry={22} transform="rotate(-35 40 42)" fill="#E08A2E" />
        <rect x={52} y={52} width={10} height={28} rx={5} transform="rotate(-45 57 66)" fill="#D9C7A6" />
        <circle cx={74} cy={80} r={7} fill="#D9C7A6" />
        <circle cx={82} cy={72} r={7} fill="#D9C7A6" />
      </>
    ),
    mercearia: (
      <>
        <path d="M30 40 C30 18 70 18 70 40" stroke={cor} strokeWidth={7} fill="none" />
        <path d="M14 40 L86 40 L76 84 L24 84 Z" fill={cor} />
        <rect x={34} y={52} width={6} height={22} rx={3} fill="#fff" />
        <rect x={47} y={52} width={6} height={22} rx={3} fill="#fff" />
        <rect x={60} y={52} width={6} height={22} rx={3} fill="#fff" />
      </>
    ),
    limpeza: (
      <>
        <rect x={32} y={40} width={34} height={46} rx={8} fill="#3B8FD9" />
        <rect x={40} y={26} width={18} height={16} fill="#3B8FD9" />
        <path d="M40 26 L40 16 L74 16 L74 26 Z" fill="#2B6FB0" />
        <rect x={38} y={54} width={22} height={16} rx={3} fill="#fff" />
      </>
    ),
    festa: (
      <>
        <ellipse cx={42} cy={38} rx={20} ry={25} fill={cor} />
        <ellipse cx={66} cy={46} rx={17} ry={21} fill={C.gold} />
        <path d="M42 70 C46 80 38 86 44 94 M66 73 C62 82 70 86 64 94" stroke={C.ink} strokeWidth={2} fill="none" />
      </>
    ),
    embalagens: (
      <>
        <path d="M50 14 L86 30 L50 46 L14 30 Z" fill={C.gold} />
        <path d="M14 30 L50 46 L50 88 L14 72 Z" fill="#B57A2E" />
        <path d="M86 30 L50 46 L50 88 L86 72 Z" fill="#8E5A1E" />
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
//  MOLDURA DE CENA: entra com zoom/blur e sai "atravessando" a câmera
// ============================================================
const TR = 8;
const Cena: React.FC<{ dur: number; last?: boolean; children: React.ReactNode }> = ({
  dur,
  last,
  children,
}) => {
  const f = useCurrentFrame();
  const e = spring({ frame: f, fps: FPS, config: SOFT });
  const x = last ? 0 : interpolate(f, [dur, dur + TR], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  const cam = interpolate(f, [0, dur], [1, 1.04], CLAMP);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${(0.92 + 0.08 * e) * cam * (1 + x * 0.35)})`,
        filter: `blur(${(1 - Math.min(1, e)) * 10 + x * 16}px)`,
        opacity: Math.min(1, e * 2) * (1 - x),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ============================================================
//  BATIDAS
// ============================================================

// 1) Bolinha cai, vira o logo; "Benatti Frios e Embalagens"
const Abertura: React.FC = () => {
  const t = useT(B.logo);
  const queda = interpolate(t, [0.1, 0.55], [-900, 0], { ...CLAMP, easing: Easing.bezier(0.5, 0, 0.9, 0.5) });
  const quique = t > 0.55 ? Math.abs(Math.sin((t - 0.55) * 9)) * 60 * Math.max(0, 1 - (t - 0.55) * 3) : 0;
  const vira = sp(t, 0.85, { damping: 9, stiffness: 120, mass: 0.8 });
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
          background: C.ink,
          opacity: t < 0.85 ? 1 : 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 150,
          top: 632,
          opacity: t >= 0.85 ? 1 : 0,
          transform: `scale(${vira}) rotate(${(1 - vira) * -120}deg)`,
        }}
      >
        <Logo size={300} />
      </div>
      <Linha top={1010}>
        <W t={t} at={tB} size={128} weight={800} color={C.red} from="zoom" style={{ fontFamily: SERIF, fontWeight: 700 }}>
          Benatti
        </W>
      </Linha>
      <Frase t={t} texto="Frios e Embalagens" depois={tB + 0.1} top={1170} size={54} />
    </AbsoluteFill>
  );
};

// 2) "Atacado e varejo, com QUALIDADE e PREÇO JUSTO"
const Atacado: React.FC = () => {
  const t = useT(B.atacado);
  const tQ = quando("qualidade");
  const tP = quando("preço");
  const circ = lin(t, tQ + 0.1, tQ + 0.7);
  return (
    <AbsoluteFill>
      <Frase t={t} texto="Atacado e varejo," depois={B.atacado - 0.2} top={640} size={56} />
      <Linha top={760}>
        <W t={t} at={quando("com", B.atacado)} size={56}>
          com
        </W>
      </Linha>
      <div style={{ position: "absolute", top: 840, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <Traco
            d="M 40 110 C 0 20, 380 -20, 600 50 C 700 90, 640 190, 330 200 C 100 205, -10 160, 60 70"
            p={circ}
            width={640}
            height={220}
            style={{ left: -60, top: -40 }}
          />
          <W t={t} at={tQ} size={128} weight={800} color={C.red} from="zoom">
            qualidade
          </W>
        </div>
      </div>
      <Linha top={1060}>
        <W t={t} at={quando("e", tQ + 0.1)} size={56}>
          e
        </W>
        <W t={t} at={tP} size={104} weight={800} from="dir">
          preço justo
        </W>
      </Linha>
    </AbsoluteFill>
  );
};

// 3) Catálogo tipo aplicativo, categoria ativa no ritmo da voz
const CATS = [
  { k: "carnes", nome: "Carnes", itens: ["Picanha", "Alcatra", "Costela", "Carne moída"] },
  { k: "frios", nome: "Frios", itens: ["Mussarela", "Presunto", "Bacon", "Salame"] },
  { k: "frango", nome: "Frango", itens: ["Peito", "Coxa e sobrecoxa", "Asa", "Filé"] },
  { k: "mercearia", nome: "Mercearia", itens: ["Arroz", "Feijão", "Óleo", "Café"] },
  { k: "limpeza", nome: "Limpeza", itens: ["Detergente", "Sabão", "Desinfetante", "Esponja"] },
  { k: "festa", nome: "Festa", itens: ["Balões", "Pratos", "Copos", "Velas"] },
  { k: "embalagens", nome: "Embalagens", itens: ["Marmitex", "Sacolas", "Potes", "Bandejas"] },
];

const Catalogo: React.FC = () => {
  const t = useT(B.catalogo);
  const vezes = CATS.map((c) => quando(c.k === "festa" ? "artigos" : c.k, B.catalogo - 0.3));
  const idx = vezes.reduce((acc, v, i) => (t >= v - 0.05 ? i : acc), 0);
  const app = sp(t, B.catalogo + 0.2, SOFT);
  const troca = sp(t, vezes[idx]);
  const chipX = interpolate(t, vezes, vezes.map((_, i) => -Math.max(0, i - 1) * 190), CLAMP);
  const tap = vezes[idx];
  const pressed = t > tap - 0.05 && t < tap + 0.08;
  return (
    <AbsoluteFill>
      <Frase t={t} texto="Aqui você encontra" depois={B.catalogo - 0.3} top={210} size={54} color={C.white} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, perspective: 1600 }}>
        <div
          style={{
            margin: "0 auto",
            width: 880,
            height: 1340,
            borderRadius: 48,
            background: C.white,
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(60,0,0,0.45)",
            transform: `translateY(${(1 - app) * 1400}px) rotateX(${(1 - app) * 25 + 6}deg)`,
            fontFamily: FONT,
          }}
        >
          <div style={{ background: C.red, padding: "34px 34px 26px", display: "flex", alignItems: "center", gap: 20 }}>
            <Logo size={74} />
            <div style={{ flex: 1, background: C.white, borderRadius: 999, padding: "16px 28px", fontSize: 28, color: C.gray }}>
              Buscar na Benatti
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, padding: "26px 30px", transform: `translateX(${chipX}px)` }}>
            {CATS.map((c, i) => (
              <div
                key={c.k}
                style={{
                  flexShrink: 0,
                  padding: "14px 28px",
                  borderRadius: 999,
                  fontSize: 30,
                  fontWeight: 600,
                  background: i === idx ? C.red : "#F1F1F1",
                  color: i === idx ? C.white : C.ink,
                  transform: `scale(${i === idx ? 0.94 + 0.06 * troca : 1})`,
                }}
              >
                {c.nome}
              </div>
            ))}
          </div>
          <div style={{ margin: "0 30px", height: 200, borderRadius: 30, background: `linear-gradient(110deg, ${C.red}, #F0352B)`, color: C.white, padding: "30px 36px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 26, fontWeight: 600, opacity: 0.85 }}>FRIOS E EMBALAGENS</div>
            <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1 }}>Atacado e varejo</div>
            <div style={{ position: "absolute", right: 30, top: 30, transform: `rotate(${t * 20}deg)` }}>
              <Icone tipo={CATS[idx].k} size={140} />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 22,
              padding: 30,
              transform: `translateY(${(1 - troca) * 120}px)`,
              opacity: Math.min(1, troca * 1.3),
            }}
          >
            {CATS[idx].itens.map((nome, i) => (
              <div key={nome} style={{ background: "#F6F6F6", borderRadius: 26, padding: 24, height: 330, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: "100%", height: 190, borderRadius: 20, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ transform: `rotate(${(i - 1.5) * 8}deg)` }}>
                    <Icone tipo={CATS[idx].k} size={150} />
                  </div>
                </div>
                <div style={{ width: "100%" }}>
                  <div style={{ fontSize: 32, fontWeight: 600, color: C.ink }}>{nome}</div>
                  <div style={{ marginTop: 6, display: "inline-block", padding: "4px 14px", borderRadius: 8, background: i === 0 ? C.gold : "#E9F7EE", color: i === 0 ? C.ink : C.green, fontSize: 22, fontWeight: 600 }}>
                    {i === 0 ? "Destaque" : "Disponível"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Cursor x={interpolate(idx, [0, 1, 2], [190, 380, 420], CLAMP) + (pressed ? 0 : 20)} y={560} press={pressed} op={app} />
    </AbsoluteFill>
  );
};

// 4) "Tudo num só LUGAR!" com seta circular desenhada
const Tudo: React.FC = () => {
  const t = useT(B.tudo);
  const tL = quando("lugar", B.tudo - 0.5);
  const seta = lin(t, tL, tL + 0.6);
  return (
    <AbsoluteFill>
      <Frase t={t} texto="Tudo num só" depois={B.tudo - 0.3} top={780} size={64} />
      <div style={{ position: "absolute", top: 880, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <Traco
            d="M 520 40 C 300 -60, -40 20, 20 150 C 70 260, 560 270, 640 140 C 680 70, 620 30, 560 30 M 560 30 L 600 -5 M 560 30 L 610 55"
            p={seta}
            cor={C.ink}
            w={6}
            width={660}
            height={270}
            style={{ left: -70, top: -20 }}
          />
          <W t={t} at={tL} size={150} weight={800} color={C.red} from="zoom">
            LUGAR!
          </W>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 5) "EMBALAGENS" vazado + casa / negócio
const LinhaIcone: React.FC<{ tipo: "casa" | "loja"; p: number }> = ({ tipo, p }) => (
  <svg width={180} height={160} viewBox="0 0 90 80" style={{ overflow: "visible" }}>
    <path
      d={
        tipo === "casa"
          ? "M10 38 L45 8 L80 38 M18 32 L18 74 L72 74 L72 32 M38 74 L38 50 L52 50 L52 74"
          : "M8 30 L14 10 L76 10 L82 30 Z M8 30 C8 38 22 38 22 30 C22 38 36 38 36 30 C36 38 50 38 50 30 C50 38 64 38 64 30 C64 38 82 38 82 30 M14 38 L14 74 L76 74 L76 38 M26 74 L26 52 L42 52 L42 74"
      }
      pathLength={1}
      fill="none"
      stroke={C.ink}
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
  </svg>
);

const Embalagens: React.FC = () => {
  const t = useT(B.embalagens);
  const big = sp(t, B.embalagens + 0.05, SOFT);
  const risco = lin(t, B.embalagens + 0.2, B.embalagens + 1.0);
  const tCasa = quando("casa", B.embalagens);
  const tNeg = quando("negócio", B.embalagens);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 640,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 118,
          color: "transparent",
          WebkitTextStroke: `4px ${C.red}`,
          letterSpacing: -2,
          transform: `rotate(-7deg) scale(${0.6 + 0.4 * big}) translateX(${(1 - big) * 300}px)`,
          opacity: big,
        }}
      >
        EMBALAGENS
      </div>
      <Traco
        d="M -20 860 C 150 700, 300 980, 480 820 S 800 700, 1100 820"
        p={risco}
        cor={C.gold}
        w={12}
        width={1080}
        height={1920}
        style={{ left: 0, top: 0 }}
      />
      {[
        { tipo: "casa" as const, txt: "pra sua casa", at: tCasa, x: 90 },
        { tipo: "loja" as const, txt: "pro seu negócio", at: tNeg, x: 570 },
      ].map((o) => {
        const s = sp(t, o.at - 0.15);
        return (
          <div
            key={o.tipo}
            style={{
              position: "absolute",
              left: o.x,
              top: 1060,
              width: 420,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              opacity: t >= o.at - 0.15 ? 1 : 0,
              transform: `translateY(${(1 - Math.min(1, s)) * 60}px)`,
            }}
          >
            <LinhaIcone tipo={o.tipo} p={lin(t, o.at - 0.15, o.at + 0.6)} />
            <W t={t} at={o.at} size={50} weight={600}>
              {o.txt}
            </W>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6) Balões 3D: Qualidade / Variedade / Confiança
const Balao: React.FC<{ t: number; at: number; txt: string; rot: number; x: number; y: number; atras: number }> = ({
  t,
  at,
  txt,
  rot,
  x,
  y,
  atras,
}) => {
  const s = sp(t, at, { damping: 10, stiffness: 160, mass: 0.7 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: t >= at ? 1 - atras * 0.35 : 0,
        transform: `perspective(1200px) rotateX(18deg) rotate(${rot}deg) scale(${s * (1 - atras * 0.12)}) translateY(${-atras * 40}px)`,
        filter: `blur(${atras * 2}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "34px 64px",
          borderRadius: 44,
          background: C.white,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 92,
          color: C.ink,
          boxShadow: "0 30px 50px rgba(0,0,0,0.18), 0 8px 0 #D9D9D9",
        }}
      >
        {txt}
        <div style={{ position: "absolute", left: 90, bottom: -40, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: `44px solid ${C.white}` }} />
      </div>
    </div>
  );
};

const Qualidade: React.FC = () => {
  const t = useT(B.qualidade);
  const itens = [
    { txt: "Qualidade", at: quando("Qualidade", B.qualidade - 0.5), rot: -10, x: 90, y: 620 },
    { txt: "Variedade", at: quando("variedade", B.qualidade - 0.5), rot: 6, x: 260, y: 860 },
    { txt: "Confiança", at: quando("confiança", B.qualidade - 0.5), rot: -5, x: 150, y: 1100 },
  ];
  const ultimo = itens.reduce((acc, it, i) => (t >= it.at ? i : acc), 0);
  return (
    <AbsoluteFill>
      {itens.map((it, i) => (
        <Balao key={it.txt} t={t} {...it} atras={Math.max(0, ultimo - i) > 0 ? 1 : 0} />
      ))}
    </AbsoluteFill>
  );
};

// 7) "com OFERTAS toda semana" (fundo vermelho)
const Ofertas: React.FC = () => {
  const t = useT(B.ofertas);
  const tO = quando("ofertas", B.ofertas - 0.5);
  const selo = sp(t, tO + 0.15, { damping: 8, stiffness: 140, mass: 0.7 });
  return (
    <AbsoluteFill>
      <Linha top={700}>
        <W t={t} at={quando("com", B.ofertas - 0.5)} size={60} color={C.white}>
          com
        </W>
      </Linha>
      <Linha top={790}>
        <W t={t} at={tO} size={180} weight={800} color={C.white} from="zoom">
          OFERTAS
        </W>
      </Linha>
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 650,
          width: 170,
          height: 170,
          borderRadius: "50%",
          background: C.gold,
          color: C.redDark,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 40px rgba(80,0,0,0.4)",
          transform: `scale(${selo}) rotate(${(1 - selo) * 200 + Math.sin(t * 3) * 8}deg)`,
          opacity: t >= tO + 0.15 ? 1 : 0,
        }}
      >
        %
      </div>
      <Frase t={t} texto="toda semana." depois={tO + 0.1} top={1020} size={64} color={C.white} />
    </AbsoluteFill>
  );
};

// 8) Horário
const RelogioLinha: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = lin(t, at, at + 0.6);
  const giro = interpolate(t, [at, at + 1.2], [0, 720], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return (
    <svg width={150} height={150} viewBox="0 0 100 100" style={{ opacity: p > 0 ? 1 : 0 }}>
      <circle cx={50} cy={50} r={42} pathLength={1} fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      <line x1={50} y1={50} x2={50} y2={22} stroke={C.red} strokeWidth={5} strokeLinecap="round" transform={`rotate(${giro} 50 50)`} />
      <line x1={50} y1={50} x2={68} y2={50} stroke={C.ink} strokeWidth={5} strokeLinecap="round" transform={`rotate(${giro / 12} 50 50)`} />
      <circle cx={50} cy={50} r={5} fill={C.ink} />
    </svg>
  );
};

const Horario: React.FC = () => {
  const t = useT(B.horario);
  const tH = quando("horário", B.horario - 0.5);
  const tSeg = quando("segunda", B.horario);
  const t630 = quando("6h30", B.horario);
  const t2130 = quando("21h30", B.horario);
  const tDom = quando("domingos", B.horario);
  const t7 = quando("7h", B.horario);
  const t21 = quando("21h.", B.horario);
  const sobe = sp(t, tDom - 0.2, SOFT);
  const card = (label: string, tl: number, a: string, ta: number, b: string, tb: number, cor: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <W t={t} at={tl} size={40} weight={600} color={cor} style={{ letterSpacing: 6 }}>
        {label}
      </W>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
        <W t={t} at={ta} size={130} weight={800} from="esq">
          {a}
        </W>
        <W t={t} at={tb - 0.05} size={70} weight={300} color={C.gray}>
          às
        </W>
        <W t={t} at={tb} size={130} weight={800} from="dir">
          {b}
        </W>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 420, width: "100%", display: "flex", justifyContent: "center" }}>
        <RelogioLinha t={t} at={tH - 0.2} />
      </div>
      <Linha top={610}>
        <W t={t} at={quando("Nosso", B.horario - 0.5)} size={56}>
          Nosso
        </W>
        <W t={t} at={tH} size={56} weight={800} color={C.red}>
          horário
        </W>
      </Linha>
      <div style={{ position: "absolute", top: 800, width: "100%", transform: `translateY(${-sobe * 60}px) scale(${1 - sobe * 0.15})` }}>
        {card("SEGUNDA A SÁBADO", tSeg, "06:30", t630, "21:30", t2130, C.red)}
      </div>
      <div style={{ position: "absolute", top: 1130, width: "100%" }}>
        {card("DOMINGO", tDom, "07:00", t7, "21:00", t21, C.gold)}
      </div>
    </AbsoluteFill>
  );
};

// 9) Botão "Venha nos visitar" + clique + check
const Visitar: React.FC = () => {
  const t = useT(B.visitar);
  const btn = sp(t, B.visitar, POP);
  const clique = B.visitar + 0.55;
  const cx = interpolate(t, [B.visitar + 0.1, clique - 0.05], [820, 560], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const cy = interpolate(t, [B.visitar + 0.1, clique - 0.05], [1300, 1000], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const ok = sp(t, clique + 0.05);
  const pressed = t > clique - 0.05 && t < clique + 0.12;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 700, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            background: t >= clique ? C.red : "transparent",
            border: `22px solid ${t >= clique ? C.red : C.ink}`,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${t >= clique ? ok : btn})`,
          }}
        >
          {t >= clique ? (
            <svg width={90} height={90} viewBox="0 0 24 24">
              <path d="M5 12.5 L10 17 L19 7" pathLength={1} fill="none" stroke={C.white} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - lin(t, clique, clique + 0.25)} />
            </svg>
          ) : null}
        </div>
      </div>
      <div style={{ position: "absolute", top: 930, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "30px 64px",
            borderRadius: 22,
            background: C.red,
            color: C.white,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 50,
            boxShadow: "0 14px 0 #9E0F14, 0 30px 40px rgba(0,0,0,0.2)",
            transform: `scale(${btn * (pressed ? 0.94 : 1)}) translateY(${pressed ? 8 : 0}px)`,
          }}
        >
          Venha nos visitar
        </div>
      </div>
      <Cursor x={cx} y={cy} press={pressed} op={t > B.visitar + 0.1 ? 1 : 0} />
    </AbsoluteFill>
  );
};

// 10) Mapa 3D com localização e balões do endereço
const RUAS = [
  "M -200 300 C 200 280, 500 360, 1300 300",
  "M -200 760 C 300 720, 700 820, 1300 760",
  "M -200 1240 C 400 1200, 800 1280, 1300 1220",
  "M 200 -200 C 230 400, 160 900, 240 1700",
  "M 620 -200 C 600 500, 680 1000, 640 1700",
  "M 980 -200 C 1000 400, 940 1000, 1000 1700",
  "M -100 1500 L 1200 300",
  "M 420 -100 C 400 300, 430 520, 380 760",
];

const ENDERECO = [
  { txt: "Av. das Paineiras", w: "Av." },
  { txt: "Qd. 96 · Lt. 12", w: "quadra" },
  { txt: "Próximo à feira de quinta", w: "próximo" },
  { txt: "St. Pontakayana", w: "Setor" },
  { txt: "Trindade – GO", w: "Trindade" },
];

const Mapa: React.FC = () => {
  const t = useT(B.mapa);
  const ent = sp(t, B.mapa, SOFT);
  const vezes = ENDERECO.map((e) => quando(e.w, B.mapa - 1));
  const idx = vezes.reduce((acc, v, i) => (t >= v - 0.1 ? i : acc), -1);
  // trajeto do ponto pelo mapa
  const pts = [
    [240, 1300],
    [240, 760],
    [640, 760],
    [640, 520],
    [640, 300],
    [600, 300],
  ];
  const k = interpolate(t, [B.mapa + 0.3, B.mapa + 6.6], [0, pts.length - 1], { ...CLAMP, easing: Easing.inOut(Easing.quad) });
  const i0 = Math.min(pts.length - 2, Math.floor(k));
  const f = k - i0;
  const px = pts[i0][0] + (pts[i0 + 1][0] - pts[i0][0]) * f;
  const py = pts[i0][1] + (pts[i0 + 1][1] - pts[i0][1]) * f;
  const ang = Math.atan2(pts[i0 + 1][1] - pts[i0][1], pts[i0 + 1][0] - pts[i0][0]) * (180 / Math.PI);
  const camX = 540 - px;
  const camY = 1150 - py;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #8F8F8F 0%, #C9C9C9 30%, #E9E9E9 60%)" }}>
      <div style={{ position: "absolute", inset: 0, perspective: 1100, perspectiveOrigin: "50% 30%" }}>
        <div
          style={{
            position: "absolute",
            left: -400,
            top: 200,
            width: 1880,
            height: 2100,
            transformOrigin: "50% 50%",
            transform: `rotateX(${interpolate(ent, [0, 1], [0, 58])}deg) translate(${camX * 0.9}px, ${camY * 0.9}px) scale(${1.1 - ent * 0.1})`,
          }}
        >
          <svg width={1880} height={2100} viewBox="-400 -100 1880 2100">
            <rect x={-400} y={-100} width={1880} height={2100} fill="#F4F4F4" />
            {RUAS.map((d, i) => (
              <path key={i} d={d} stroke={C.ink} strokeWidth={46} fill="none" strokeLinecap="round" />
            ))}
            {RUAS.map((d, i) => (
              <path key={`b${i}`} d={d} stroke="#F4F4F4" strokeWidth={30} fill="none" strokeLinecap="round" />
            ))}
            <circle cx={600} cy={300} r={140} fill={C.red} opacity={0.25} />
            <g transform={`translate(${px} ${py}) rotate(${ang})`}>
              <path d="M 0 0 L 230 -110 A 250 250 0 0 1 230 110 Z" fill="url(#feixe)" />
              <circle r={34} fill={C.white} stroke={C.red} strokeWidth={12} />
            </g>
            <defs>
              <radialGradient id="feixe" cx="0" cy="0.5" r="1">
                <stop offset="0" stopColor={C.red} stopOpacity={0.7} />
                <stop offset="1" stopColor={C.red} stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      {ENDERECO.map((e, i) => {
        if (i > idx) return null;
        const s = sp(t, vezes[i] - 0.1, { damping: 10, stiffness: 160, mass: 0.7 });
        const atras = idx - i;
        const rot = [-8, 6, -5, 7, -6][i];
        return (
          <div
            key={e.txt}
            style={{
              position: "absolute",
              top: 600 - atras * 70,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              opacity: atras > 2 ? 0 : 1 - atras * 0.35,
              filter: `blur(${atras * 2.5}px)`,
              transform: `perspective(1200px) rotateX(15deg) rotate(${rot}deg) scale(${s * (1 - atras * 0.15)})`,
              zIndex: 10 - atras,
            }}
          >
            <div
              style={{
                position: "relative",
                padding: "28px 52px",
                borderRadius: 40,
                background: i === ENDERECO.length - 1 ? C.red : C.white,
                color: i === ENDERECO.length - 1 ? C.white : C.ink,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 74,
                whiteSpace: "nowrap",
                boxShadow: "0 30px 50px rgba(0,0,0,0.25), 0 8px 0 rgba(0,0,0,0.12)",
              }}
            >
              {e.txt}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: -28,
                  bottom: -40,
                  borderLeft: "28px solid transparent",
                  borderRight: "28px solid transparent",
                  borderTop: `42px solid ${i === ENDERECO.length - 1 ? C.red : C.white}`,
                }}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 11) WhatsApp + número sendo digitado numa barra
const Whatsapp: React.FC = () => {
  const t = useT(B.whatsapp);
  const tW = quando("WhatsApp", B.whatsapp - 0.5);
  const tN = quando("(62)", B.whatsapp);
  const bar = sp(t, tN - 0.3, SOFT);
  const num = "(62) 99376-2140";
  const n = Math.floor(interpolate(t, [tN, tN + 2.6], [0, num.length], CLAMP));
  const cursorOn = Math.floor(t * 3) % 2 === 0;
  return (
    <AbsoluteFill>
      <Frase t={t} texto="Faça seu pedido pelo" depois={B.whatsapp - 0.3} top={640} size={56} />
      <Linha top={740}>
        <W t={t} at={tW} size={150} weight={800} color={C.green} from="zoom">
          WhatsApp
        </W>
      </Linha>
      <div style={{ position: "absolute", top: 1010, width: "100%", display: "flex", justifyContent: "center", opacity: t >= tN - 0.3 ? 1 : 0 }}>
        <div style={{ position: "relative", width: 900 * bar, height: 130 }}>
          <div style={{ position: "absolute", inset: 0, transform: "translate(-8px,-6px)", borderRadius: 30, background: C.red }} />
          <div style={{ position: "absolute", inset: 0, transform: "translate(8px,6px)", borderRadius: 30, background: C.gold }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 30,
              background: C.white,
              display: "flex",
              alignItems: "center",
              padding: "0 30px",
              gap: 24,
              overflow: "hidden",
              fontFamily: FONT,
            }}
          >
            <svg width={56} height={56} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx={12} cy={12} r={11} fill={C.green} />
              <path d="M8.2 11.1c.8 1.6 2.1 2.9 3.7 3.7l1.2-1.2c.2-.2.4-.2.6-.1.6.2 1.3.3 2 .3.3 0 .6.3.6.6V16c0 .3-.3.6-.6.6C10.6 16.6 7.4 13.4 7.4 9.3c0-.3.3-.6.6-.6h1.6c.3 0 .6.3.6.6 0 .7.1 1.4.3 2 .1.2 0 .4-.1.6l-.2.2z" fill={C.white} />
            </svg>
            <div style={{ fontSize: 66, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>
              {num.slice(0, n)}
              <span style={{ opacity: cursorOn ? 1 : 0, color: C.red }}>|</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 12) Assinatura: logo + "Benatti Frios e Embalagens: entregas rápidas!"
const Marca: React.FC = () => {
  const t = useT(B.marca);
  const logo = sp(t, B.marca + 0.05, { damping: 9, stiffness: 120, mass: 0.8 });
  const tR = quando("rápidas", B.marca);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 130, top: 620, transform: `scale(${logo}) rotate(${(1 - logo) * 90}deg)` }}>
        <Logo size={260} />
      </div>
      <Frase t={t} texto="Benatti Frios e Embalagens:" depois={B.marca - 0.3} top={960} size={50} />
      <Linha top={1050}>
        <W t={t} at={quando("entregas", B.marca)} size={60} weight={300}>
          entregas
        </W>
        <W t={t} at={tR} size={96} weight={800} color={C.red} from="zoom">
          rápidas!
        </W>
      </Linha>
    </AbsoluteFill>
  );
};

// 13) Encerramento escuro com a busca do perfil
const Fim: React.FC = () => {
  const t = useT(B.fim);
  const logo = sp(t, B.fim + 0.2, { damping: 10, stiffness: 120, mass: 0.8 });
  const bar = sp(t, B.fim + 0.7, SOFT);
  const handle = "@benattifrios";
  const n = Math.floor(interpolate(t, [B.fim + 1.2, B.fim + 2.4], [0, handle.length], CLAMP));
  const fade = lin(t, DURACAO - 0.4, DURACAO);
  return (
    <AbsoluteFill style={{ opacity: 1 - fade }}>
      <div style={{ position: "absolute", top: 640, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${logo})` }}>
        <Logo size={170} />
        <div style={{ marginTop: 24, fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: C.white }}>Benatti</div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, letterSpacing: 8, color: C.gold }}>FRIOS E EMBALAGENS</div>
      </div>
      <div style={{ position: "absolute", top: 1080, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 640 * bar, height: 100 }}>
          <div style={{ position: "absolute", inset: 0, transform: "translate(-7px,-5px)", borderRadius: 18, background: C.red }} />
          <div style={{ position: "absolute", inset: 0, transform: "translate(7px,5px)", borderRadius: 18, background: C.gold }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.white, display: "flex", alignItems: "center", gap: 20, padding: "0 26px", overflow: "hidden", fontFamily: FONT }}>
            <svg width={40} height={40} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx={10} cy={10} r={6.5} fill="none" stroke={C.ink} strokeWidth={2.4} />
              <path d="M15 15 L21 21" stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 44, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>{handle.slice(0, n)}</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1230, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 300, fontSize: 36, color: "rgba(255,255,255,0.75)", opacity: lin(t, B.fim + 2.4, B.fim + 2.8) }}>
        Siga a gente no Instagram
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
//  COMPOSIÇÃO
// ============================================================
const ORDEM: { k: keyof typeof B; C: React.FC }[] = [
  { k: "logo", C: Abertura },
  { k: "atacado", C: Atacado },
  { k: "catalogo", C: Catalogo },
  { k: "tudo", C: Tudo },
  { k: "embalagens", C: Embalagens },
  { k: "qualidade", C: Qualidade },
  { k: "ofertas", C: Ofertas },
  { k: "horario", C: Horario },
  { k: "visitar", C: Visitar },
  { k: "mapa", C: Mapa },
  { k: "whatsapp", C: Whatsapp },
  { k: "marca", C: Marca },
  { k: "fim", C: Fim },
];

// Espera a fonte Poppins carregar antes de renderizar
const useFontes = () => {
  const [h] = useState(() => delayRender("Carregando Poppins"));
  useEffect(() => {
    Promise.all(["300", "400", "600", "800"].map((w) => document.fonts.load(`${w} 40px Poppins`)))
      .then(() => continueRender(h))
      .catch(() => continueRender(h));
  }, [h]);
};

export const Benatti: React.FC = () => {
  useFontes();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Fundo />
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
