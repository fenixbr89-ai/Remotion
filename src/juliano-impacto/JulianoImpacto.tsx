import React from "react";
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
import { CLAMP, EASE, EASE_IN_OUT, FONT } from "../pixora/ui";
import { dissolve, whip } from "../pixora/transicoes";
import { Adesivo, Big, Estrela, K, Obj3D, pop, Risco } from "./kit";

/**
 * Roteiro (tempos estimados até a narração nova chegar):
 *  0–2,6s   "Sua casa tá precisando de um cuidado?"
 *  2,6–6,4  "Parede manchada, infiltração, aquele reparo que você vive adiando…"
 *  6,4–8,8  "Juliano Pinturas resolve para você."
 *  8,8–13,0 "Pintura residencial. Pintura automotiva. Elétrica. Reformas." → 4 quadrados de vidro
 *  13,0–17,0 "E ainda: pós-obra, manutenção e muito mais." → etiquetas simples
 *  17,0–19,8 "Tudo com capricho, do início ao acabamento."
 *  19,8–25,4 "Chama no WhatsApp e pede seu orçamento: (62) 99113-2531."
 *  25,4–29,7 "Juliano Pinturas. Seu espaço, renovado."
 */
export const START = [0, 78, 192, 264, 510, 594, 762, 891];
const TRANS = 10;
export const IMPACTO_TOTAL = START[START.length - 1];
const from = (i: number) => START[i] - (i > 0 ? TRANS / 2 : 0);
const dur = (i: number) =>
  START[i + 1] -
  START[i] +
  (i > 0 ? TRANS / 2 : 0) +
  (i < START.length - 2 ? TRANS / 2 : 0);
/** Frame absoluto (tempo da fala) → frame local da cena i. */
const L = (i: number, abs: number) => abs - from(i);

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

// ===== 1 · "Sua casa tá precisando de um cuidado?" =====
const C0: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Claro>
      <Obj3D
        src="3d/casa"
        size={300}
        style={{ position: "absolute", left: 390, top: 380, ...pop(f, 4) }}
      />
      <Big at={8} y={760} size={110} weight={800} color={K.preto}>
        Sua casa
      </Big>
      <Big at={14} y={880} size={92} weight={800} color={K.preto}>
        tá precisando
      </Big>
      <Big at={22} y={990} size={130} color={K.laranja}>
        de um cuidado?
      </Big>
    </Claro>
  );
};

// ===== 2 · "Parede manchada, infiltração, aquele reparo que você vive adiando…" =====
const C1: React.FC = () => {
  const i = 1;
  return (
    <Escuro>
      <Adesivo
        at={L(i, 84)}
        fundo={K.laranja}
        cor={K.branco}
        rot={-4}
        y={620}
        de="left"
        size={86}
      >
        Parede manchada
      </Adesivo>
      <Adesivo
        at={L(i, 112)}
        fundo={K.branco}
        cor={K.preto}
        rot={3}
        y={780}
        de="right"
        size={86}
      >
        Infiltração
      </Adesivo>
      <Adesivo
        at={L(i, 140)}
        fundo={K.laranja}
        cor={K.branco}
        rot={-2}
        y={940}
        de="left"
        size={70}
      >
        Aquele reparo adiado…
      </Adesivo>
      <Risco
        d="M200 1010C420 990 700 995 900 1004"
        at={L(i, 166)}
        cor={K.branco}
        width={9}
      />
    </Escuro>
  );
};

// ===== 3 · "Juliano Pinturas resolve para você." =====
const C2: React.FC = () => {
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
      <Big at={L(i, 202)} y={900} size={96} weight={800} color={K.branco}>
        Juliano Pinturas
      </Big>
      <Big at={L(i, 212)} y={1020} size={112} color={K.laranja}>
        resolve para você.
      </Big>
    </Escuro>
  );
};

// ===== 4 · 4 serviços principais em quadrados de vidro → "E ainda: …" em etiquetas simples =====
const PRINCIPAIS = [
  { src: "3d/rolo", nome: "Pintura", sub: "residencial", at: 270 },
  { src: "3d/carro", nome: "Pintura", sub: "automotiva", at: 303 },
  { src: "3d/lampada", nome: "Elétrica", sub: "instalações", at: 336 },
  { src: "3d/tijolos", nome: "Reformas", sub: "e acabamento", at: 363 },
];
const OUTROS = [
  { txt: "Pós-obra", at: 412 },
  { txt: "Manutenção", at: 428 },
];
const AINDA = 396;
const C3: React.FC = () => {
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
        at={L(i, 266)}
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
              <Obj3D
                src={p.src}
                size={190}
                style={{ rotate: `${(1 - s) * -20}deg` }}
              />
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
            ...pop(f, L(i, 446)),
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
  const i = 4;
  return (
    <Claro>
      <Big at={L(i, 514)} y={640} size={96} weight={800} color={K.preto}>
        Tudo com
      </Big>
      <Big at={L(i, 520)} y={750} size={180} color={K.laranja}>
        capricho
      </Big>
      <Risco
        d="M160 965C380 930 700 940 920 955"
        at={L(i, 532)}
        cor={K.preto}
        width={12}
      />
      <Big at={L(i, 548)} y={1040} size={70} weight={800} color={K.preto}>
        do início ao acabamento.
      </Big>
    </Claro>
  );
};

// ===== 6 · "Chama no WhatsApp e pede seu orçamento: (62) 99113-2531." =====
const GRUPOS = [
  { txt: "(62)", at: 666 },
  { txt: "99113", at: 702 },
  { txt: "-2531", at: 736 },
];
const C5: React.FC = () => {
  const f = useCurrentFrame();
  const i = 5;
  return (
    <Escuro>
      <Obj3D
        src="3d/whatsapp"
        size={240}
        style={{
          position: "absolute",
          left: 420,
          top: 300,
          ...pop(f, L(i, 598)),
        }}
      />
      <Big at={L(i, 602)} y={590} size={92} weight={800} color={K.branco}>
        Chama no
      </Big>
      <Big at={L(i, 608)} y={690} size={150} color={K.zap}>
        WhatsApp
      </Big>
      <Big at={L(i, 628)} y={870} size={64} weight={700} color={K.branco}>
        e pede seu orçamento
      </Big>
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 120,
          letterSpacing: "-0.04em",
        }}
      >
        {GRUPOS.map((g, n) => {
          const t = interpolate(f, [L(i, g.at), L(i, g.at) + 10], [0, 1], {
            ...CLAMP,
            easing: EASE,
          });
          const atual = n === GRUPOS.length - 1 || f < L(i, GRUPOS[n + 1].at);
          return (
            <div key={g.txt} style={{ overflow: "hidden", padding: "0 4px" }}>
              <div
                style={{
                  translate: `0px ${(1 - t) * 120}%`,
                  filter: `blur(${(1 - t) * 14}px)`,
                  opacity: t,
                  color: atual ? K.laranja : K.branco,
                }}
              >
                {g.txt}
              </div>
            </div>
          );
        })}
      </div>
    </Escuro>
  );
};

// ===== 7 · "Juliano Pinturas. Seu espaço, renovado." =====
const C6: React.FC = () => {
  const i = 6;
  return (
    <Claro>
      <Big at={L(i, 766)} y={520} size={130} color={K.preto}>
        Juliano
      </Big>
      <Big at={L(i, 772)} y={650} size={150} color={K.laranja}>
        Pinturas
      </Big>
      <Adesivo
        at={L(i, 796)}
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
        at={L(i, 806)}
        fundo={K.laranja}
        cor={K.branco}
        rot={2}
        y={1030}
        de="right"
        size={96}
      >
        renovado.
      </Adesivo>
      <Adesivo
        at={L(i, 826)}
        fundo={K.zap}
        cor={K.branco}
        rot={-1.5}
        y={1230}
        de="left"
        size={58}
      >
        WhatsApp (62) 99113-2531
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

export type JulianoImpactoProps = { readonly narracao: boolean };

export const JulianoImpacto: React.FC<JulianoImpactoProps> = ({ narracao }) => (
  <AbsoluteFill style={{ background: K.escuro }}>
    <TransitionSeries>
      {CENAS.flatMap((Cena, n) => [
        <TransitionSeries.Sequence
          key={`s${n}`}
          name={`Cena ${n + 1}`}
          durationInFrames={dur(n)}
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
          [0, 15, IMPACTO_TOTAL - 40, IMPACTO_TOTAL],
          [0, narracao ? 0.25 : 0.6, narracao ? 0.25 : 0.6, 0],
          CLAMP,
        )
      }
    />
    {narracao ? (
      <Audio name="Narração" src={staticFile("juliano/narracao-impacto.wav")} />
    ) : null}
  </AbsoluteFill>
);
