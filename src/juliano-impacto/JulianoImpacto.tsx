import React, { createContext, useContext } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import type { TransitionPresentation } from "@remotion/transitions";
import { CLAMP, EASE_IN_OUT, FONT } from "../pixora/ui";
import { dissolve, whip } from "../pixora/transicoes";
import { Adesivo, Big, Estrela, K, Obj3D, pop, Risco } from "./kit";

/**
 * Roteiro, sincronizado com public/juliano/narracao-impacto.wav (31 s):
 *  0–2,2s    "Sua casa tá precisando de um cuidado?"
 *  2,2–6,5   "Parede manchada, infiltração, aquele reparo que você vive adiando…"
 *  6,5–8,9   "Juliano Pinturas resolve para você."
 *  8,9–13,2  "Pintura residencial. Pintura automotiva. Elétrica. Reformas." → 4 quadrados de vidro
 *  13,2–17,1 "E ainda: pós-obra, manutenção e muito mais." → etiquetas simples
 *  17,1–20,0 "Tudo com capricho, do início ao acabamento."
 *  20,0–27,6 "Chama no WhatsApp e faça seu orçamento sem compromisso: (62) 99113-2531."
 *  27,6–32,5 "Juliano Pinturas. Seu espaço, renovado." (+1,5 s de respiro)
 */
export const START = [0, 67, 195, 268, 514, 600, 828, 975];
const TRANS = 10;

/**
 * Vozes. Os tempos acima são da voz masculina; para outra voz, cada momento-chave da fala é
 * mapeado (frame na voz masculina → frame na outra voz) e o resto é interpolado entre eles.
 */
export type Voz = "masculina" | "feminina";
const ARQUIVO: Record<Voz, string> = {
  masculina: "juliano/narracao-impacto.wav",
  feminina: "juliano/narracao-impacto-feminina.wav",
};
const ANCORAS: Record<Voz, [number, number][] | null> = {
  masculina: null,
  feminina: [
    [0, 0],
    [7, 8], // "Sua casa"
    [67, 78], // "Parede manchada"
    [99, 114], // "Infiltração"
    [129, 168], // "aquele reparo"
    [162, 207], // "adiando"
    [195, 244], // "Juliano Pinturas"
    [225, 276], // "resolve para você"
    [268, 326], // "Pintura residencial"
    [312, 375], // "Pintura automotiva"
    [349, 423], // "Elétrica"
    [376, 452], // "Reformas"
    [396, 485], // "E ainda"
    [423, 509], // "pós-obra"
    [444, 531], // "manutenção"
    [474, 563], // "e muito mais"
    [514, 600], // "Tudo com capricho"
    [558, 651], // "do início ao acabamento"
    [600, 703], // "Chama no WhatsApp"
    [630, 729], // "e faça seu orçamento"
    [660, 762], // "sem compromisso"
    [692, 802], // número
    [828, 953], // "Juliano Pinturas."
    [868, 996], // "Seu espaço,"
    [896, 1025], // "renovado."
    [975, 1104], // fim (+1,5 s)
  ],
};
const mapear = (voz: Voz, x: number) => {
  const a = ANCORAS[voz];
  if (!a) return x;
  return interpolate(
    x,
    a.map((p) => p[0]),
    a.map((p) => p[1]),
  );
};
const inicio = (voz: Voz, i: number) => Math.round(mapear(voz, START[i]));
const from = (voz: Voz, i: number) => inicio(voz, i) - (i > 0 ? TRANS / 2 : 0);
const dur = (voz: Voz, i: number) =>
  inicio(voz, i + 1) -
  inicio(voz, i) +
  (i > 0 ? TRANS / 2 : 0) +
  (i < START.length - 2 ? TRANS / 2 : 0);
export const totalDe = (voz: Voz) => inicio(voz, START.length - 1);
export const IMPACTO_TOTAL = totalDe("masculina");

const VozCtx = createContext<Voz>("masculina");
/** Frame absoluto (tempo da fala, voz masculina) → frame local da cena i, na voz atual. */
const useL = () => {
  const voz = useContext(VozCtx);
  return (i: number, abs: number) => mapear(voz, abs) - from(voz, i);
};

const Claro: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ background: K.claro, overflow: "hidden" }}>
    <Estrela x={60} y={140} size={520} blur={8} />
    <Estrela x={1000} y={1720} size={640} blur={12} spin={-0.25} />
    {children}
  </AbsoluteFill>
);
const Escuro: React.FC<{
  readonly children: React.ReactNode;
  readonly estrelas?: boolean;
}> = ({ children, estrelas = true }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 80% at 50% 40%, #1C1C21 0%, ${K.escuro} 70%)`,
      overflow: "hidden",
    }}
  >
    {estrelas ? (
      <>
        <Estrela x={1020} y={120} size={420} blur={20} opacity={0.9} />
        <Estrela
          x={60}
          y={1760}
          size={560}
          blur={24}
          opacity={0.9}
          spin={-0.2}
        />
      </>
    ) : null}
    {children}
  </AbsoluteFill>
);

/** Vidro escuro estilo widget do iPhone. */
const vidro: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(28px) saturate(170%)",
  WebkitBackdropFilter: "blur(28px) saturate(170%)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  boxShadow:
    "0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
};

// ===== 1 · "Sua casa tá precisando de um cuidado?" (mesmo estilo de faixas da cena seguinte) =====
const C0: React.FC = () => {
  const L = useL();
  return (
    <Claro>
      <Adesivo
        at={L(0, 6)}
        out={L(0, 58)}
        fundo={K.laranja}
        cor={K.branco}
        y={600}
        size={100}
      >
        Sua casa
      </Adesivo>
      <Adesivo
        at={L(0, 20)}
        out={L(0, 60)}
        fundo={K.preto}
        cor={K.branco}
        y={790}
        size={86}
      >
        tá precisando
      </Adesivo>
      <Adesivo
        rot={-2}
        at={L(0, 34)}
        out={L(0, 62)}
        fundo={K.laranja}
        cor={K.branco}
        y={960}
        size={100}
      >
        de um cuidado?
      </Adesivo>
    </Claro>
  );
};

// ===== 2 · "Parede manchada, infiltração, aquele reparo que você vive adiando…" =====
const C1: React.FC = () => {
  const L = useL();
  const i = 1;
  return (
    <Escuro>
      <Adesivo
        rot={-1.8}
        at={L(i, 69)}
        out={L(i, 188)}
        fundo={K.laranja}
        cor={K.branco}
        y={620}
        size={86}
      >
        Parede manchada
      </Adesivo>
      <Adesivo
        at={L(i, 99)}
        out={L(i, 190)}
        fundo={K.branco}
        cor={K.preto}
        y={780}
        size={86}
      >
        Infiltração
      </Adesivo>
      <Adesivo
        rot={1.5}
        at={L(i, 129)}
        out={L(i, 192)}
        fundo={K.laranja}
        cor={K.branco}
        y={940}
        size={70}
        risco={L(i, 160)}
      >
        Aquele reparo adiado…
      </Adesivo>
    </Escuro>
  );
};

// ===== 3 · "Juliano Pinturas resolve para você." =====
const C2: React.FC = () => {
  const L = useL();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = 2;
  const s = spring({
    frame: f - L(i, 196),
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  return (
    <Escuro>
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: 620 - 300,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(242,106,27,0.55), rgba(242,106,27,0))",
          scale: String(s),
        }}
      />
      <Obj3D
        src="3d/logo"
        size={400}
        style={{
          position: "absolute",
          left: 340,
          top: 420,
          scale: String(s),
          rotate: `${(1 - s) * -12}deg`,
        }}
      />
      <Big at={L(i, 198)} y={900} size={96} weight={800} color={K.branco}>
        Juliano Pinturas
      </Big>
      <Big at={L(i, 224)} y={1020} size={112} color={K.laranja}>
        resolve para você.
      </Big>
    </Escuro>
  );
};

// ===== 4 · 4 serviços principais em quadrados de vidro → "E ainda: …" em etiquetas simples =====
const PRINCIPAIS: {
  src: string;
  nome: string;
  sub: string;
  at: number;
  extra?: string;
}[] = [
  {
    src: "3d/casa",
    nome: "Pintura",
    sub: "residencial",
    at: 268,
    extra: "3d/rolo",
  },
  { src: "3d/carro", nome: "Pintura", sub: "automotiva", at: 312 },
  { src: "3d/lampada", nome: "Elétrica", sub: "instalações", at: 349 },
  { src: "3d/tijolos", nome: "Reformas", sub: "e acabamento", at: 376 },
];
const OUTROS = [
  { txt: "Pós-obra", at: 423 },
  { txt: "Manutenção", at: 444 },
];
const AINDA = 396;
const C3: React.FC = () => {
  const L = useL();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = 3;
  const sobe = interpolate(f, [L(i, AINDA), L(i, AINDA + 16)], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const Q = 400;
  const GAP = 36;
  return (
    <Escuro>
      <Big
        at={L(i, 268)}
        out={L(i, AINDA - 6)}
        y={300}
        size={84}
        weight={800}
        color={K.branco}
      >
        Especialista em
      </Big>
      {/* 4 quadrados de vidro; quando entra "E ainda", sobem e encolhem */}
      <div
        style={{
          position: "absolute",
          left: 540 - (Q * 2 + GAP) / 2,
          top: 470,
          width: Q * 2 + GAP,
          height: Q * 2 + GAP,
          transformOrigin: "50% 0%",
          scale: String(1 - sobe * 0.42),
          translate: `0px ${-sobe * 230}px`,
        }}
      >
        {PRINCIPAIS.map((p, k) => {
          const s = spring({
            frame: f - L(i, p.at),
            fps,
            config: { damping: 14, stiffness: 130 },
          });
          const brilho = interpolate(
            f - L(i, p.at),
            [0, 6, 22],
            [0, 1, 0],
            CLAMP,
          );
          return (
            <div
              key={p.sub + k}
              style={{
                position: "absolute",
                left: (k % 2) * (Q + GAP),
                top: Math.floor(k / 2) * (Q + GAP),
                width: Q,
                height: Q,
                borderRadius: 64,
                ...vidro,
                boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 ${60 * brilho}px rgba(242,106,27,${0.7 * brilho}), inset 0 1px 0 rgba(255,255,255,0.12)`,
                scale: String(s),
                opacity: Math.min(1, s * 1.5),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                fontFamily: FONT,
              }}
            >
              <div style={{ position: "relative" }}>
                <Obj3D
                  src={p.src}
                  size={190}
                  style={{ rotate: `${(1 - s) * -20}deg` }}
                />
                {p.extra ? (
                  <Obj3D
                    src={p.extra}
                    size={96}
                    style={{
                      position: "absolute",
                      right: -34,
                      bottom: -6,
                      rotate: `${-14 + Math.sin(Math.max(0, f - L(i, p.at)) * 0.4) * 10 * Math.exp(-Math.max(0, f - L(i, p.at)) / 12)}deg`,
                      scale: String(
                        interpolate(f - L(i, p.at), [6, 14], [0, 1], CLAMP),
                      ),
                    }}
                  />
                ) : null}
              </div>
              <div style={{ textAlign: "center", lineHeight: 1.05 }}>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    color: K.branco,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {p.nome}
                </div>
                <div
                  style={{ fontSize: 34, fontWeight: 600, color: K.laranja }}
                >
                  {p.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Big at={L(i, AINDA + 4)} y={1020} size={110} color={K.laranja}>
        E ainda:
      </Big>
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 80,
          right: 80,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 22,
        }}
      >
        {OUTROS.map((o) => (
          <div
            key={o.txt}
            style={{
              padding: "16px 34px",
              borderRadius: 50,
              ...vidro,
              color: K.branco,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 46,
              ...pop(f, L(i, o.at)),
            }}
          >
            {o.txt}
          </div>
        ))}
        <div
          style={{
            padding: "16px 34px",
            borderRadius: 50,
            background: K.laranja,
            color: K.branco,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 46,
            ...pop(f, L(i, 474)),
          }}
        >
          e muito mais
        </div>
      </div>
    </Escuro>
  );
};

// ===== 5 · "Tudo com capricho, do início ao acabamento." =====
const C4: React.FC = () => {
  const L = useL();
  const i = 4;
  return (
    <Claro>
      <Big at={L(i, 516)} y={640} size={96} weight={800} color={K.preto}>
        Tudo com
      </Big>
      <Big at={L(i, 522)} y={750} size={180} color={K.laranja}>
        capricho
      </Big>
      <Risco
        d="M160 965C380 930 700 940 920 955"
        at={L(i, 536)}
        cor={K.preto}
        width={12}
      />
      <Big at={L(i, 558)} y={1040} size={70} weight={800} color={K.preto}>
        do início ao acabamento.
      </Big>
    </Claro>
  );
};

// ===== 6 · "Chama no WhatsApp e faça seu orçamento sem compromisso: (62) 99113-2531." =====
const NUMERO = 692;
const C5: React.FC = () => {
  const L = useL();
  const f = useCurrentFrame();
  const i = 5;
  const brilho = interpolate(f - L(i, NUMERO), [8, 14, 30], [0, 1, 0], CLAMP);
  return (
    <Escuro>
      <Obj3D
        src="3d/whatsapp"
        size={240}
        style={{
          position: "absolute",
          left: 420,
          top: 300,
          ...pop(f, L(i, 602)),
        }}
      />
      <Big at={L(i, 606)} y={590} size={92} weight={800} color={K.branco}>
        Chama no
      </Big>
      <Big at={L(i, 612)} y={690} size={150} color={K.zap}>
        WhatsApp
      </Big>
      <Big at={L(i, 630)} y={880} size={64} weight={700} color={K.branco}>
        e faça seu orçamento
      </Big>
      <Adesivo
        at={L(i, 660)}
        fundo={K.laranja}
        cor={K.branco}
        y={970}
        size={66}
      >
        sem compromisso
      </Adesivo>
      {/* o número entra inteiro, de uma vez */}
      <Big
        at={L(i, NUMERO)}
        y={1160}
        size={112}
        color={K.branco}
        style={{
          textShadow: `0 0 ${40 * brilho}px rgba(37,211,102,${0.8 * brilho})`,
        }}
      >
        (62) 99113-2531
      </Big>
    </Escuro>
  );
};

// ===== 7 · "Juliano Pinturas. Seu espaço, renovado." =====
const C6: React.FC = () => {
  const L = useL();
  const i = 6;
  return (
    <Claro>
      <Big at={L(i, 830)} y={520} size={130} color={K.preto}>
        Juliano
      </Big>
      <Big at={L(i, 836)} y={650} size={150} color={K.laranja}>
        Pinturas
      </Big>
      <Adesivo
        classico
        at={L(i, 868)}
        fundo={K.preto}
        cor={K.branco}
        rot={-3}
        y={900}
        de="left"
        size={84}
      >
        Seu espaço,
      </Adesivo>
      <Adesivo
        classico
        at={L(i, 896)}
        fundo={K.laranja}
        cor={K.branco}
        rot={2}
        y={1030}
        de="right"
        size={96}
      >
        renovado.
      </Adesivo>
    </Claro>
  );
};

const T = linearTiming({ durationInFrames: TRANS, easing: EASE_IN_OUT });
const CENAS = [C0, C1, C2, C3, C4, C5, C6];
// as passagens têm props diferentes; o TransitionSeries aceita qualquer uma por posição
const PASSAGENS = [
  whip("up"),
  dissolve(1.12, 0.9),
  whip("up"),
  whip("left"),
  whip("up"),
  whip("left"),
] as unknown as TransitionPresentation<Record<string, unknown>>[];

export type JulianoImpactoProps = {
  readonly narracao: boolean;
  readonly voz: Voz;
};

export const JulianoImpacto: React.FC<JulianoImpactoProps> = ({
  narracao,
  voz,
}) => {
  const total = totalDe(voz);
  return (
    <VozCtx.Provider value={voz}>
      <AbsoluteFill style={{ background: K.escuro }}>
        <TransitionSeries>
          {CENAS.flatMap((Cena, n) => [
            <TransitionSeries.Sequence
              key={`s${n}`}
              name={`Cena ${n + 1}`}
              durationInFrames={dur(voz, n)}
            >
              <Cena />
            </TransitionSeries.Sequence>,
            ...(n < CENAS.length - 1
              ? [
                  <TransitionSeries.Transition
                    key={`t${n}`}
                    presentation={PASSAGENS[n]}
                    timing={T}
                  />,
                ]
              : []),
          ])}
        </TransitionSeries>
        <Audio
          name="Trilha"
          src={staticFile("juliano/trilha.mp3")}
          volume={(fr) =>
            interpolate(
              fr,
              [0, 15, total - 40, total],
              [0, narracao ? 0.25 : 0.6, narracao ? 0.25 : 0.6, 0],
              CLAMP,
            )
          }
        />
        {narracao ? (
          <Audio name="Narração" src={staticFile(ARQUIVO[voz])} />
        ) : null}
      </AbsoluteFill>
    </VozCtx.Provider>
  );
};
