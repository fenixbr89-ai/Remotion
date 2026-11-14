npm install @fontsource/poppins@5 @remotion/three@4.0.543 three@0.170.0 @react-three/fiber@9 && npm install -D @types/three@0.170.0
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
import { ThreeCanvas } from "@remotion/three";
import { PRODUTOS_3D } from "./Produtos3D";

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
      background: "#E22521",
      boxShadow: `0 ${size * 0.08}px ${size * 0.2}px rgba(120,0,0,0.35)`,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Img
      src={staticFile("benatti-logo.jpg")}
      style={{ width: "82%", height: "82%", objectFit: "contain" }}
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

// 3) Catálogo 3D: pódio com produtos em 3D, trocando no ritmo da voz
const CATS = [
  { k: "carnes", nome: "Carnes", itens: ["Picanha", "Alcatra", "Costela", "Linguiça", "Carne moída"] },
  { k: "frios", nome: "Frios", itens: ["Mussarela", "Presunto", "Salame", "Queijo prato", "Bacon"] },
  { k: "frango", nome: "Frango", itens: ["Coxa", "Sobrecoxa", "Peito", "Asa", "Frango inteiro"] },
  { k: "mercearia", nome: "Mercearia", itens: ["Arroz", "Feijão", "Óleo", "Café", "Enlatados"] },
  { k: "limpeza", nome: "Limpeza", itens: ["Detergente", "Desinfetante", "Sabão", "Esponja", "Água sanitária"] },
  { k: "festa", nome: "Artigos de festa", itens: ["Balões", "Chapéus", "Copos", "Pratos", "Velas"] },
  { k: "embalagens", nome: "Embalagens", itens: ["Marmitex", "Caixas", "Sacolas", "Potes", "Bandejas"] },
];

const Podio: React.FC<{ t: number; cat: string; at: number; saindo?: number }> = ({ t, cat, at, saindo = 0 }) => {
  const lista = PRODUTOS_3D[cat];
  const pos: [number, number, number][] = [
    [-1.6, 0, -0.5],
    [0, 0, 0.7],
    [1.6, 0, -0.5],
  ];
  return (
    <>
      {lista.map((Prod, i) => {
        const k = Math.min(1.15, sp(t, at + i * 0.07, { damping: 10, stiffness: 140, mass: 0.7 }));
        const s = (i === 1 ? 1.8 : 1.3) * k * (1 - saindo);
        const giro = (1 - Math.min(1, k)) * Math.PI * 1.5 + Math.sin((t - at) * 1.2 + i) * 0.35 - 0.25;
        const bob = Math.sin(t * 2.2 + i * 1.7) * 0.05 + saindo * -1.2;
        return (
          <group key={`${cat}-${i}`} position={[pos[i][0], pos[i][1] + bob, pos[i][2]]} scale={s} rotation={[0, giro, 0]}>
            <Prod />
          </group>
        );
      })}
    </>
  );
};

const Catalogo: React.FC = () => {
  const t = useT(B.catalogo);
  const vezes = CATS.map((c) => quando(c.k === "festa" ? "artigos" : c.k, B.catalogo - 0.3) - 0.08);
  const idx = vezes.reduce((acc, v, i) => (t >= v ? i : acc), 0);
  const at = Math.max(vezes[idx], B.catalogo + 0.15);
  const saida = idx > 0 ? lin(t, vezes[idx] - 0.02, vezes[idx] + 0.16) : 1;
  const palco = sp(t, B.catalogo + 0.05, SOFT);
  const nome = sp(t, at, { damping: 14, stiffness: 170, mass: 0.6 });
  return (
    <AbsoluteFill>
      <Frase t={t} texto="Aqui você encontra" depois={B.catalogo - 0.3} top={230} size={54} color={C.white} />
      {/* luz atrás do pódio */}
      <div style={{ position: "absolute", left: 540 - 520, top: 520, width: 1040, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,150,0.45) 0%, rgba(255,120,80,0.12) 45%, transparent 70%)" }} />
      <ThreeCanvas
        width={1080}
        height={1080}
        style={{ position: "absolute", left: 0, top: 330 }}
        camera={{ position: [0, 3.0, 10.5], rotation: [-0.2, 0, 0], fov: 30 }}
      >
        <ambientLight intensity={0.5} />
        <hemisphereLight args={["#FFFFFF", "#7A0A0E", 0.7]} />
        <directionalLight position={[3, 7, 6]} intensity={2.4} />
        <directionalLight position={[-5, 3, -2]} intensity={1.0} color="#FFD27A" />
        <group position={[0, -0.55 - (1 - palco) * 5, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[2.7, 2.8, 0.42, 64]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.7, 0.05, 12, 96]} />
            <meshStandardMaterial color="#F2B820" roughness={0.25} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.47, 0]}>
            <cylinderGeometry args={[2.95, 3.0, 0.1, 64]} />
            <meshStandardMaterial color="#F2B820" roughness={0.3} metalness={0.6} />
          </mesh>
          {idx > 0 && saida < 1 ? <Podio t={t} cat={CATS[idx - 1].k} at={vezes[idx - 1]} saindo={saida} /> : null}
          <Podio t={t} cat={CATS[idx].k} at={at} />
        </group>
      </ThreeCanvas>
      {/* nome da categoria */}
      <div style={{ position: "absolute", top: 1420, width: "100%", textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: CATS[idx].nome.length > 12 ? 96 : 120,
            color: C.white,
            opacity: Math.min(1, nome * 1.4),
            filter: `blur(${(1 - Math.min(1, nome)) * 12}px)`,
            transform: `translateY(${(1 - Math.min(1, nome)) * 40}px)`,
          }}
        >
          {CATS[idx].nome}
        </span>
      </div>
      {/* itens da categoria */}
      <div style={{ position: "absolute", top: 1575, left: 60, right: 60, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {CATS[idx].itens.map((it, i) => {
          const s = sp(t, at + 0.12 + i * 0.06);
          return (
            <div
              key={`${idx}-${it}`}
              style={{
                padding: "12px 26px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                border: "2px solid rgba(255,255,255,0.35)",
                color: C.white,
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 34,
                opacity: Math.min(1, s * 1.5),
                transform: `translateY(${(1 - Math.min(1, s)) * 30}px)`,
              }}
            >
              {it}
            </div>
          );
        })}
      </div>
      {/* progresso das 7 categorias */}
      <div style={{ position: "absolute", top: 1790, width: "100%", display: "flex", justifyContent: "center", gap: 12 }}>
        {CATS.map((c, i) => (
          <div key={c.k} style={{ width: i === idx ? 48 : 14, height: 14, borderRadius: 7, background: i <= idx ? C.gold : "rgba(255,255,255,0.3)" }} />
        ))}
      </div>
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
          transform: `scale(${0.6 + 0.4 * big}) translateX(${(1 - big) * 300}px)`,
          opacity: big,
        }}
      >
        EMBALAGENS
      </div>
      <Traco
        d="M -20 830 C 150 730, 300 930, 540 830 S 900 730, 1100 830"
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

// 6) Balões: Qualidade / Variedade / Confiança (retos, empilhados)
const Balao: React.FC<{ t: number; at: number; txt: string; ativo: boolean }> = ({ t, at, txt, ativo }) => {
  const s = sp(t, at, { damping: 10, stiffness: 160, mass: 0.7 });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        opacity: t >= at ? 1 : 0,
        transform: `translateY(${(1 - Math.min(1, s)) * 60}px) scale(${s})`,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "30px 72px",
          borderRadius: 40,
          background: ativo ? C.red : C.white,
          color: ativo ? C.white : C.ink,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 88,
          boxShadow: ativo ? "0 24px 40px rgba(150,0,0,0.3), 0 8px 0 #9E0F14" : "0 24px 40px rgba(0,0,0,0.14), 0 8px 0 #D5D5D5",
        }}
      >
        {txt}
        <div
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: -26,
            bottom: -38,
            borderLeft: "26px solid transparent",
            borderRight: "26px solid transparent",
            borderTop: `40px solid ${ativo ? C.red : C.white}`,
          }}
        />
      </div>
    </div>
  );
};

const Qualidade: React.FC = () => {
  const t = useT(B.qualidade);
  const itens = [
    { txt: "Qualidade", at: quando("Qualidade", B.qualidade - 0.5) },
    { txt: "Variedade", at: quando("variedade", B.qualidade - 0.5) },
    { txt: "Confiança", at: quando("confiança", B.qualidade - 0.5) },
  ];
  const atual = itens.reduce((acc, it, i) => (t >= it.at ? i : acc), 0);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
        {itens.map((it, i) => (
          <Balao key={it.txt} t={t} at={it.at} txt={it.txt} ativo={i === atual} />
        ))}
      </div>
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

// Horário com "fantasma" claro: o espaço já aparece e o número entra por cima
const Hora: React.FC<{ t: number; at: number; txt: string; from: "esq" | "dir" }> = ({ t, at, txt, from }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 130, lineHeight: 1.05, color: "rgba(0,0,0,0.07)" }}>{txt}</span>
    <span style={{ position: "absolute", left: 0, top: 0 }}>
      <W t={t} at={at} size={130} weight={800} from={from}>
        {txt}
      </W>
    </span>
  </span>
);

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
        <Hora t={t} at={ta} txt={a} from="esq" />
        <W t={t} at={tl} size={70} weight={300} color={C.gray}>
          às
        </W>
        <Hora t={t} at={tb} txt={b} from="dir" />
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
      <div style={{ position: "absolute", top: 1130, width: "100%", opacity: lin(t, tDom - 0.35, tDom - 0.1) }}>
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
        if (i !== idx && i !== idx - 1) return null;
        const s2 = sp(t, vezes[i] - 0.1, { damping: 10, stiffness: 160, mass: 0.7 });
        const sai = i === idx - 1 ? lin(t, vezes[idx] - 0.15, vezes[idx] + 0.1) : 0;
        const ultimo = i === ENDERECO.length - 1;
        return (
          <div
            key={e.txt}
            style={{
              position: "absolute",
              top: 560,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              opacity: 1 - sai,
              transform: `translateY(${-sai * 120}px) scale(${Math.min(1.05, s2) * (1 - sai * 0.2)})`,
            }}
          >
            <div
              style={{
                position: "relative",
                padding: "28px 56px",
                borderRadius: 40,
                background: ultimo ? C.red : C.white,
                color: ultimo ? C.white : C.ink,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 72,
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
                  borderTop: `42px solid ${ultimo ? C.red : C.white}`,
                }}
              />
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1420,
          padding: "28px 40px",
          borderRadius: 32,
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 24px 50px rgba(0,0,0,0.2)",
          fontFamily: FONT,
          opacity: idx >= 0 ? 1 : 0,
          transform: `translateY(${(1 - Math.min(1, sp(t, vezes[0]))) * 300}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <svg width={34} height={44} viewBox="0 0 60 80">
            <path d="M30 78 C30 78 4 46 4 28 A26 26 0 0 1 56 28 C56 46 30 78 30 78Z" fill={C.red} />
            <circle cx={30} cy={28} r={11} fill={C.white} />
          </svg>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 4, color: C.gray }}>NOSSO ENDEREÇO</div>
        </div>
        {[
          "Av. das Paineiras, Qd. 96, Lt. 12",
          "Próximo à feira de quinta",
          "St. Pontakayana · Trindade – GO",
        ].map((l, i) => {
          const at = [vezes[0], vezes[2], vezes[3]][i];
          const k = sp(t, at);
          return (
            <div key={l} style={{ fontSize: i === 0 ? 40 : 34, fontWeight: i === 0 ? 800 : 400, color: C.ink, lineHeight: 1.35, opacity: t >= at ? Math.min(1, k * 1.5) : 0, transform: `translateX(${(1 - Math.min(1, k)) * 40}px)` }}>
              {l}
            </div>
          );
        })}
      </div>
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
cat > src/Produtos3D.tsx << 'EOF'
import React, { useMemo } from "react";
import * as THREE from "three";

// ============================================================
//  Produtos 3D feitos com formas simples (estilo "massinha")
//  Cada produto tem ~1 unidade de altura e fica apoiado em y=0.
// ============================================================

type P = { cor?: string };

const Mat: React.FC<{ cor: string; rough?: number; metal?: number; op?: number }> = ({
  cor,
  rough = 0.55,
  metal = 0,
  op = 1,
}) => (
  <meshStandardMaterial
    color={cor}
    roughness={rough}
    metalness={metal}
    transparent={op < 1}
    opacity={op}
  />
);

const useLathe = (pts: [number, number][]) =>
  useMemo(() => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 48), [pts]);

// ---------- CARNES ----------
const Bife: React.FC = () => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.7, 0);
    s.bezierCurveTo(-0.8, 0.5, -0.2, 0.75, 0.3, 0.6);
    s.bezierCurveTo(0.8, 0.45, 0.85, -0.1, 0.5, -0.4);
    s.bezierCurveTo(0.1, -0.7, -0.6, -0.5, -0.7, 0);
    return new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4 });
  }, []);
  return (
    <group rotation={[-0.55, 0, 0.15]} position={[0, 0.45, 0]} scale={0.62}>
      <mesh geometry={geo} scale={[1.06, 1.06, 0.9]} position={[0, 0, -0.02]}>
        <Mat cor="#F3E2C8" />
      </mesh>
      <mesh geometry={geo}>
        <Mat cor="#B8262C" rough={0.7} />
      </mesh>
      <mesh position={[0.15, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 24]} />
        <Mat cor="#F7EEDC" />
      </mesh>
    </group>
  );
};

const Linguica: React.FC = () => (
  <group position={[0, 0.25, 0]}>
    {[-0.55, 0, 0.55].map((x, i) => (
      <mesh key={i} position={[x, Math.abs(x) * 0.25, 0]} rotation={[0, 0, Math.PI / 2 + x * 0.6]}>
        <capsuleGeometry args={[0.2, 0.42, 8, 16]} />
        <Mat cor="#9B3424" rough={0.4} />
      </mesh>
    ))}
  </group>
);

const Bandeja: React.FC<{ recheio: string; bolinhas?: boolean }> = ({ recheio, bolinhas }) => (
  <group>
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[1.4, 0.2, 0.95]} />
      <Mat cor="#FFFFFF" rough={0.3} />
    </mesh>
    <mesh position={[0, 0.27, 0]} scale={[0.6, 0.18, 0.4]}>
      <sphereGeometry args={[1, 32, 16]} />
      <Mat cor={recheio} rough={0.8} />
    </mesh>
    {bolinhas
      ? [-0.3, 0, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.38, 0.05]} scale={[0.22, 0.12, 0.18]}>
            <sphereGeometry args={[1, 16, 12]} />
            <Mat cor={recheio} rough={0.8} />
          </mesh>
        ))
      : null}
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[1.42, 0.02, 0.97]} />
      <Mat cor="#FFFFFF" op={0.25} rough={0.1} />
    </mesh>
  </group>
);

// ---------- FRIOS ----------
const Queijo: React.FC = () => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.7, 0);
    s.lineTo(0.7, 0);
    s.lineTo(0.7, 0.75);
    s.lineTo(-0.7, 0);
    return new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 });
  }, []);
  return (
    <group position={[0, 0, -0.35]}>
      <mesh geometry={geo}>
        <Mat cor="#F6C843" rough={0.6} />
      </mesh>
      {[
        [0.3, 0.2, 0.74],
        [-0.1, 0.12, 0.74],
        [0.5, 0.45, 0.74],
        [0.71, 0.3, 0.3],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1, 1, 0.35]}>
          <sphereGeometry args={[0.08 + (i % 2) * 0.04, 16, 12]} />
          <Mat cor="#D9A520" />
        </mesh>
      ))}
    </group>
  );
};

const Presunto: React.FC = () => (
  <group position={[0, 0.05, 0]}>
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[i * 0.12 - 0.12, i * 0.09, i * 0.05]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.07, 48]} />
        <Mat cor={i % 2 ? "#F4A7A3" : "#EF9590"} rough={0.65} />
      </mesh>
    ))}
  </group>
);

const Salame: React.FC = () => (
  <group position={[0, 0.32, 0]} rotation={[0, 0.5, Math.PI / 2]}>
    <mesh>
      <cylinderGeometry args={[0.3, 0.3, 1.3, 32]} />
      <Mat cor="#7E1A1F" rough={0.85} />
    </mesh>
    <mesh position={[0, 0.66, 0]}>
      <cylinderGeometry args={[0.29, 0.29, 0.02, 32]} />
      <Mat cor="#C2464C" />
    </mesh>
    {[
      [0.1, 0.05],
      [-0.12, 0.1],
      [0.05, -0.15],
      [-0.08, -0.08],
      [0.17, -0.05],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.68, z]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <Mat cor="#FFF3E6" />
      </mesh>
    ))}
  </group>
);

// ---------- FRANGO ----------
const Coxa: React.FC = () => (
  <group position={[0, 0.4, 0]} rotation={[0, 0, -0.6]}>
    <mesh scale={[0.42, 0.58, 0.42]}>
      <sphereGeometry args={[1, 32, 24]} />
      <Mat cor="#D9893A" rough={0.45} />
    </mesh>
    <mesh position={[0, -0.7, 0]}>
      <cylinderGeometry args={[0.07, 0.08, 0.5, 16]} />
      <Mat cor="#F3E6D0" />
    </mesh>
    {[-0.07, 0.07].map((x) => (
      <mesh key={x} position={[x, -0.97, 0]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <Mat cor="#F3E6D0" />
      </mesh>
    ))}
  </group>
);

const FrangoInteiro: React.FC = () => (
  <group position={[0, 0.45, 0]}>
    <mesh scale={[0.75, 0.48, 0.55]}>
      <sphereGeometry args={[1, 32, 24]} />
      <Mat cor="#E3A157" rough={0.4} />
    </mesh>
    {[-0.35, 0.35].map((z) => (
      <group key={z} position={[0.55, 0.1, z]} rotation={[0, 0, -1]} scale={0.55}>
        <mesh scale={[0.42, 0.58, 0.42]}>
          <sphereGeometry args={[1, 24, 16]} />
          <Mat cor="#D98C3A" rough={0.4} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
          <Mat cor="#F3E6D0" />
        </mesh>
      </group>
    ))}
  </group>
);

// ---------- MERCEARIA ----------
const Pacote: React.FC<{ cor: string; faixa: string }> = ({ cor, faixa }) => (
  <group position={[0, 0.6, 0]}>
    <mesh>
      <boxGeometry args={[0.85, 1.2, 0.45]} />
      <Mat cor={cor} rough={0.5} />
    </mesh>
    <mesh position={[0, 0.05, 0.231]}>
      <boxGeometry args={[0.86, 0.32, 0.01]} />
      <Mat cor={faixa} />
    </mesh>
    <mesh position={[0, -0.32, 0.231]}>
      <boxGeometry args={[0.4, 0.14, 0.01]} />
      <Mat cor="#F2B820" />
    </mesh>
    <mesh position={[0, 0.66, 0]}>
      <boxGeometry args={[0.85, 0.12, 0.08]} />
      <Mat cor={cor} />
    </mesh>
  </group>
);

const Garrafa: React.FC<{ cor: string; tampa: string; op?: number }> = ({ cor, tampa, op = 1 }) => {
  const geo = useLathe([
    [0, 0],
    [0.32, 0],
    [0.36, 0.1],
    [0.36, 0.85],
    [0.3, 1.0],
    [0.14, 1.15],
    [0.12, 1.3],
    [0, 1.3],
  ]);
  return (
    <group>
      <mesh geometry={geo}>
        <Mat cor={cor} rough={0.15} op={op} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.365, 0.365, 0.34, 32]} />
        <Mat cor="#FFFFFF" />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.14, 24]} />
        <Mat cor={tampa} />
      </mesh>
    </group>
  );
};

const Lata: React.FC<{ cor: string }> = ({ cor }) => (
  <group position={[0, 0.5, 0]}>
    <mesh>
      <cylinderGeometry args={[0.38, 0.38, 0.9, 40]} />
      <Mat cor={cor} rough={0.35} metal={0.3} />
    </mesh>
    {[0.46, -0.46].map((y) => (
      <mesh key={y} position={[0, y, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.06, 40]} />
        <Mat cor="#D7D7D7" rough={0.25} metal={0.9} />
      </mesh>
    ))}
    <mesh>
      <cylinderGeometry args={[0.385, 0.385, 0.3, 40]} />
      <Mat cor="#FFFFFF" />
    </mesh>
  </group>
);

// ---------- LIMPEZA ----------
const Detergente: React.FC = () => {
  const geo = useLathe([
    [0, 0],
    [0.3, 0],
    [0.33, 0.1],
    [0.3, 0.6],
    [0.34, 1.0],
    [0.16, 1.2],
    [0, 1.2],
  ]);
  return (
    <group>
      <mesh geometry={geo} scale={[1, 1, 0.6]}>
        <Mat cor="#2DB36A" rough={0.2} op={0.92} />
      </mesh>
      <mesh position={[0, 1.27, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.18, 20]} />
        <Mat cor="#FFFFFF" />
      </mesh>
    </group>
  );
};

const Borrifador: React.FC = () => (
  <group>
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[0.6, 0.9, 0.38]} />
      <Mat cor="#3B8FD9" rough={0.25} />
    </mesh>
    <mesh position={[0, 0.55, 0.2]}>
      <boxGeometry args={[0.45, 0.4, 0.01]} />
      <Mat cor="#FFFFFF" />
    </mesh>
    <mesh position={[0, 1.0, 0]}>
      <cylinderGeometry args={[0.12, 0.16, 0.2, 20]} />
      <Mat cor="#FFFFFF" />
    </mesh>
    <mesh position={[0.12, 1.18, 0]}>
      <boxGeometry args={[0.5, 0.18, 0.2]} />
      <Mat cor="#1F5FA3" />
    </mesh>
    <mesh position={[0.08, 1.0, 0]} rotation={[0, 0, 0.3]}>
      <boxGeometry args={[0.08, 0.25, 0.12]} />
      <Mat cor="#1F5FA3" />
    </mesh>
  </group>
);

const Esponja: React.FC = () => (
  <group position={[0, 0.2, 0]} rotation={[0, 0.4, 0]}>
    <mesh>
      <boxGeometry args={[1.0, 0.3, 0.6]} />
      <Mat cor="#F6D33C" rough={0.95} />
    </mesh>
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[1.0, 0.1, 0.6]} />
      <Mat cor="#2E9E57" rough={0.95} />
    </mesh>
  </group>
);

// ---------- FESTA ----------
const Baloes: React.FC = () => (
  <group>
    {[
      { x: -0.3, y: 1.0, c: "#D7191F", s: 0.38 },
      { x: 0.3, y: 1.15, c: "#F2B820", s: 0.34 },
      { x: 0.0, y: 1.35, c: "#FFFFFF", s: 0.3 },
    ].map((b, i) => (
      <group key={i} position={[b.x, b.y, i * 0.05]}>
        <mesh scale={[b.s, b.s * 1.2, b.s]}>
          <sphereGeometry args={[1, 32, 24]} />
          <Mat cor={b.c} rough={0.15} />
        </mesh>
        <mesh position={[0, -b.s * 1.2 - 0.04, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.06, 0.1, 12]} />
          <Mat cor={b.c} />
        </mesh>
        <mesh position={[-b.x * 0.5, -b.s * 1.2 - (b.y - b.s * 1.2) / 2, 0]} rotation={[0, 0, b.x * 0.5]}>
          <cylinderGeometry args={[0.008, 0.008, b.y - b.s * 1.2, 6]} />
          <Mat cor="#555555" />
        </mesh>
      </group>
    ))}
  </group>
);

const Chapeu: React.FC = () => (
  <group>
    <mesh position={[0, 0.55, 0]}>
      <coneGeometry args={[0.42, 1.1, 40]} />
      <Mat cor="#F2B820" rough={0.35} />
    </mesh>
    {[0.25, 0.55, 0.85].map((y) => (
      <mesh key={y} position={[0, y, 0]}>
        <torusGeometry args={[0.42 * (1 - y / 1.1) + 0.01, 0.025, 8, 40]} />
        <Mat cor="#D7191F" />
      </mesh>
    ))}
    <mesh position={[0, 1.15, 0]}>
      <sphereGeometry args={[0.12, 16, 12]} />
      <Mat cor="#D7191F" />
    </mesh>
  </group>
);

const Copo: React.FC<{ cor: string }> = ({ cor }) => {
  const geo = useLathe([
    [0, 0],
    [0.25, 0],
    [0.38, 1.0],
    [0.36, 1.0],
    [0.23, 0.04],
    [0, 0.04],
  ]);
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial color={cor} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.335, 0.31, 0.16, 32, 1, true]} />
        <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ---------- EMBALAGENS ----------
const Caixa: React.FC = () => (
  <group position={[0, 0.5, 0]} rotation={[0, 0.5, 0]}>
    <mesh>
      <boxGeometry args={[1.1, 1.0, 0.9]} />
      <Mat cor="#C8925A" rough={0.9} />
    </mesh>
    <mesh position={[0, 0.501, 0]}>
      <boxGeometry args={[0.25, 0.01, 0.92]} />
      <Mat cor="#E8C79A" rough={0.4} />
    </mesh>
    <mesh position={[0, 0.2, 0.451]}>
      <boxGeometry args={[0.25, 0.6, 0.01]} />
      <Mat cor="#E8C79A" rough={0.4} />
    </mesh>
    <mesh position={[0.3, -0.25, 0.452]}>
      <boxGeometry args={[0.3, 0.2, 0.01]} />
      <Mat cor="#D7191F" />
    </mesh>
  </group>
);

const Marmitex: React.FC = () => (
  <group position={[0, 0.2, 0]}>
    <mesh>
      <cylinderGeometry args={[0.65, 0.55, 0.35, 8]} />
      <Mat cor="#C9CDD2" rough={0.25} metal={0.85} />
    </mesh>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.7, 0.7, 0.06, 8]} />
      <Mat cor="#FFFFFF" rough={0.4} />
    </mesh>
  </group>
);

const Sacola: React.FC = () => (
  <group position={[0, 0.5, 0]} rotation={[0, -0.4, 0]}>
    <mesh>
      <boxGeometry args={[0.9, 1.0, 0.45]} />
      <Mat cor="#FFFFFF" rough={0.6} />
    </mesh>
    <mesh position={[0, 0.0, 0.226]}>
      <circleGeometry args={[0.22, 32]} />
      <Mat cor="#D7191F" />
    </mesh>
    {[-0.22, 0.22].map((x) => (
      <mesh key={x} position={[x, 0.6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.12, 0.025, 8, 24, Math.PI]} />
        <Mat cor="#D7191F" />
      </mesh>
    ))}
  </group>
);

// ============================================================
//  Catálogo por categoria (3 produtos cada)
// ============================================================
export const PRODUTOS_3D: Record<string, React.FC<P>[]> = {
  carnes: [() => <Bandeja recheio="#C2343A" bolinhas />, Bife, Linguica],
  frios: [Presunto, Queijo, Salame],
  frango: [Coxa, FrangoInteiro, () => <Bandeja recheio="#F4B6A6" />],
  mercearia: [() => <Pacote cor="#FFFFFF" faixa="#D7191F" />, () => <Garrafa cor="#F5C542" tampa="#D7191F" op={0.9} />, () => <Lata cor="#D7191F" />],
  limpeza: [Detergente, Borrifador, Esponja],
  festa: [Chapeu, Baloes, () => <Copo cor="#D7191F" />],
  embalagens: [Marmitex, Caixa, Sacola],
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

// Necessário para os produtos 3D (WebGL) renderizarem sem placa de vídeo
Config.setChromiumOpenGlRenderer("swangle");
EOF
