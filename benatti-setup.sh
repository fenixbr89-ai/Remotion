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
  children: string;
  size?: number;
  weight?: number;
  cor?: string;
  degrade?: boolean;
  style?: React.CSSProperties;
}> = ({ t, at, children, size = 64, weight = 600, cor = C.texto, degrade, style }) => {
  // texto entra letra por letra: cada letra sobe de dentro de uma "máscara" e perde o desfoque
  const letras = Array.from(children);
  const n = letras.length;
  const passo = Math.min(0.03, 0.55 / n);
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: size > 90 ? -size * 0.035 : -size * 0.015,
        lineHeight: 1.12,
        whiteSpace: "pre",
        overflow: "hidden",
        paddingBottom: size * 0.08,
        ...style,
      }}
    >
      {letras.map((ch, i) => {
        const k = rev(t, at + i * passo, 0.65);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: degrade ? "transparent" : cor,
              background: degrade ? DEGRADE : undefined,
              backgroundSize: degrade ? `${n * 100}% 100%` : undefined,
              backgroundPosition: degrade ? `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0` : undefined,
              WebkitBackgroundClip: degrade ? "text" : undefined,
              backgroundClip: degrade ? "text" : undefined,
              opacity: k,
              filter: `blur(${(1 - k) * 8}px)`,
              transform: `translateY(${(1 - k) * size * 0.7}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
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

// ============================================================
//  CENA: cada uma tem o próprio fundo; troca com fade + leve zoom
// ============================================================
const TR = 14; // frames de sobreposição entre cenas
type Trans = "sobe" | "lado" | "zoom";

// Movimento de câmera contínuo: a cena que sai e a que entra se movem juntas
const Cena: React.FC<{
  dur: number;
  last?: boolean;
  fundo: string;
  entra?: Trans;
  sai?: Trans;
  children: React.ReactNode;
}> = ({ dur, last, fundo, entra = "sobe", sai = "sobe", children }) => {
  const f = useCurrentFrame();
  const MEIO = Easing.bezier(0.65, 0, 0.35, 1);
  const e = interpolate(f, [0, TR], [0, 1], { ...CLAMP, easing: MEIO }); // entrada 0→1
  const x = last ? 0 : interpolate(f, [dur, dur + TR], [0, 1], { ...CLAMP, easing: MEIO }); // saída 0→1
  const cam = interpolate(f, [0, dur], [1, 1.025], CLAMP);
  // velocidade (para o desfoque de movimento)
  const vel = Math.sin(Math.PI * (f < TR ? e : x));
  let tf = "";
  let op = 1;
  if (f < TR) {
    if (entra === "sobe") tf = `translateY(${(1 - e) * 1920}px)`;
    else if (entra === "lado") tf = `translateX(${(1 - e) * 1080}px)`;
    else {
      tf = `scale(${0.88 + 0.12 * e})`;
      op = e;
    }
  } else if (x > 0) {
    if (sai === "sobe") tf = `translateY(${-x * 1920}px)`;
    else if (sai === "lado") tf = `translateX(${-x * 1080}px)`;
    else {
      tf = `scale(${1 + x * 0.6})`;
      op = 1 - x;
    }
  }
  const borrao = (f < TR ? entra : sai) === "zoom" ? vel * 14 : vel * 10;
  const estica = (f < TR ? entra : sai) === "sobe" ? `scaleY(${1 + vel * 0.04})` : (f < TR ? entra : sai) === "lado" ? `scaleX(${1 + vel * 0.04})` : "";
  const tipo = f < TR ? entra : sai;
  const emZoom = tipo === "zoom" && (f < TR || x > 0);
  // no zoom o fundo fica parado (cobre a tela toda) e só o conteúdo aproxima
  return (
    <AbsoluteFill
      style={{
        backgroundColor: fundo,
        opacity: op,
        transform: emZoom ? undefined : `${tf} ${estica}`,
        filter: emZoom ? undefined : `blur(${borrao}px)`,
      }}
    >
      <AbsoluteFill style={{ transform: `${emZoom ? tf : ""} scale(${cam})`, filter: emZoom ? `blur(${borrao}px)` : undefined }}>
        {children}
      </AbsoluteFill>
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

// 3) Produtos: só tipografia — cada categoria entra quando é falada
const CATS = [
  { k: "carnes", nome: "Carnes." },
  { k: "frios", nome: "Frios." },
  { k: "frango", nome: "Frango." },
  { k: "mercearia", nome: "Mercearia." },
  { k: "limpeza", nome: "Limpeza." },
  { k: "festa", nome: "Artigos de festa." },
  { k: "embalagens", nome: "Embalagens." },
];

const Produtos: React.FC = () => {
  const t = useT(B.produtos);
  const vezes = CATS.map((c) => quando(c.k === "festa" ? "artigos" : c.k, B.produtos - 0.3) - 0.1);
  const atual = vezes.reduce((acc, v, i) => (t >= v ? i : acc), 0);
  return (
    <AbsoluteFill>
      <Centro top={330}>
        <Surge t={t} at={B.produtos + 0.05} size={52} weight={500} cor={C.sub}>
          Aqui você encontra
        </Surge>
      </Centro>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {CATS.map((c, i) => (
          <Surge key={c.k} t={t} at={vezes[i]} size={112} weight={700} cor={i === atual ? undefined : "#C7C7CC"} degrade={i === atual}>
            {c.nome}
          </Surge>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 4) Tudo num só lugar. (fundo preto)
const Tudo: React.FC = () => {
  const t = useT(B.tudo);
  return (
    <AbsoluteFill>
      <Centro top={760}>
        <Surge t={t} at={quando("Tudo", B.tudo - 0.5)} size={120} weight={700} cor="#F5F5F7">
          Tudo num só
        </Surge>
      </Centro>
      <Centro top={900}>
        <Surge t={t} at={quando("lugar", B.tudo - 0.5)} size={220} weight={800} degrade>
          lugar.
        </Surge>
      </Centro>
    </AbsoluteFill>
  );
};

// 5) Embalagens. pra sua casa e pro seu negócio.
const Embalagens: React.FC = () => {
  const t = useT(B.embalagens);
  const tCasa = quando("casa", B.embalagens) - 0.25;
  const tNeg = quando("negócio", B.embalagens) - 0.25;
  const casaAtiva = t < tNeg;
  return (
    <AbsoluteFill>
      <Centro top={640}>
        <Surge t={t} at={quando("Embalagens", B.embalagens - 0.3)} size={136} weight={700}>
          Embalagens.
        </Surge>
      </Centro>
      <Centro top={880}>
        <Surge t={t} at={tCasa} size={96} weight={700} cor={casaAtiva ? undefined : "#C7C7CC"} degrade={casaAtiva}>
          Pra sua casa.
        </Surge>
      </Centro>
      <Centro top={1010}>
        <Surge t={t} at={tNeg} size={96} weight={700} degrade>
          Pro seu negócio.
        </Surge>
      </Centro>
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
        <Surge t={t} at={quando("visitar", B.endereco - 1)} size={100} weight={700}>
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
  const fade = interpolate(t, [DURACAO - 0.6, DURACAO], [1, 0], CLAMP);
  const logo = rev(t, B.fim + 0.15, 1.1);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Centro top={700}>
        <div style={{ opacity: logo, transform: `scale(${0.85 + 0.15 * logo})`, filter: `blur(${(1 - logo) * 10}px)` }}>
          <Logo size={220} />
        </div>
      </Centro>
      <Centro top={990}>
        <Surge t={t} at={B.fim + 0.6} size={62} weight={600} cor="#F5F5F7" style={{ letterSpacing: 26 }}>
          BENATTI
        </Surge>
      </Centro>
      <Centro top={1090}>
        <Surge t={t} at={B.fim + 1.0} size={34} weight={500} cor="#86868B" style={{ letterSpacing: 2 }}>
          Frios e Embalagens
        </Surge>
      </Centro>
      <Centro top={1170}>
        <Surge t={t} at={B.fim + 1.4} size={34} weight={500} cor="#86868B" style={{ letterSpacing: 1 }}>
          @benattifrios · (62) 99376-2140
        </Surge>
      </Centro>
    </AbsoluteFill>
  );
};

// ============================================================
//  COMPOSIÇÃO
// ============================================================
// `entra` = como a cena chega (a anterior sai do mesmo jeito)
const ORDEM: { k: keyof typeof B; C: React.FC; fundo: string; entra: Trans }[] = [
  { k: "logo", C: Abertura, fundo: C.branco, entra: "zoom" },
  { k: "atacado", C: Atacado, fundo: C.branco, entra: "sobe" },
  { k: "produtos", C: Produtos, fundo: C.branco, entra: "sobe" },
  { k: "tudo", C: Tudo, fundo: C.preto, entra: "zoom" },
  { k: "embalagens", C: Embalagens, fundo: C.branco, entra: "zoom" },
  { k: "qualidade", C: Qualidade, fundo: C.preto, entra: "lado" },
  { k: "ofertas", C: Ofertas, fundo: C.branco, entra: "zoom" },
  { k: "horario", C: Horario, fundo: C.branco, entra: "sobe" },
  { k: "endereco", C: Endereco, fundo: C.cinza, entra: "sobe" },
  { k: "whatsapp", C: Whatsapp, fundo: C.preto, entra: "zoom" },
  { k: "marca", C: Marca, fundo: C.branco, entra: "lado" },
  { k: "fim", C: Fim, fundo: C.preto, entra: "zoom" },
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
      {ORDEM.map(({ k, C: Scene, fundo, entra }, i) => {
        const ini = B[k];
        const fim = i < ORDEM.length - 1 ? B[ORDEM[i + 1].k] : DURACAO;
        const last = i === ORDEM.length - 1;
        const dur = sec(fim) - sec(ini);
        return (
          <Sequence key={k} from={sec(ini)} durationInFrames={last ? dur : dur + TR} name={k}>
            <Cena dur={dur} last={last} fundo={fundo} entra={entra} sai={ORDEM[i + 1]?.entra}>
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
