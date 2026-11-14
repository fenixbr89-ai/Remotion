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
import { Adesivo, Big, Estrela, K, Obj3D, Pessoa, pop, Risco } from "./kit";

// Tudo sincronizado com public/juliano/narracao.wav (frames absolutos a 30 fps).
export const START = [0, 87, 141, 278, 528, 705, 920, 1065];
const TRANS = 10;
export const IMPACTO_TOTAL = START[START.length - 1];
const from = (i: number) => START[i] - (i > 0 ? TRANS / 2 : 0);
const dur = (i: number) =>
  START[i + 1] -
  START[i] +
  (i > 0 ? TRANS / 2 : 0) +
  (i < START.length - 2 ? TRANS / 2 : 0);

/** Converte um frame absoluto (tempo da narração) no frame local da cena i. */
const L = (i: number, abs: number) => abs - from(i);

const Claro: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ background: K.claro, overflow: "hidden" }}>
    <Estrela x={60} y={140} size={520} blur={6} />
    <Estrela x={1000} y={1720} size={640} blur={10} spin={-0.25} />
    {children}
  </AbsoluteFill>
);
const Escuro: React.FC<{
  readonly children: React.ReactNode;
  readonly estrelas?: boolean;
}> = ({ children, estrelas = false }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 80% at 50% 40%, #1A1A1F 0%, ${K.escuro} 70%)`,
      overflow: "hidden",
    }}
  >
    {estrelas ? (
      <>
        <Estrela x={1020} y={120} size={420} blur={18} opacity={0.9} />
        <Estrela
          x={60}
          y={1760}
          size={560}
          blur={22}
          opacity={0.9}
          spin={-0.2}
        />
      </>
    ) : null}
    {children}
  </AbsoluteFill>
);

// ===== 0 · "Parede descascando? Infiltração?" =====
const C0: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Claro>
      <Big at={9} out={46} y={700} size={96} weight={800} color={K.preto}>
        Parede
      </Big>
      <Big at={12} out={46} y={800} size={150} color={K.laranja}>
        descascando?
      </Big>
      <Obj3D
        src="3d/gota"
        size={200}
        style={{ position: "absolute", left: 440, top: 520, ...pop(f, 50) }}
      />
      <Big at={52} y={800} size={170} color={K.laranja}>
        Infiltração?
      </Big>
    </Claro>
  );
};

// ===== 1 · "Chuveiro que não esquenta?" =====
const C1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Escuro>
      <Obj3D
        src="3d/chuveiro"
        size={280}
        style={{ position: "absolute", left: 400, top: 420, ...pop(f, 6) }}
      />
      <Big at={8} y={780} size={140} color={K.branco}>
        Chuveiro
      </Big>
      <Big at={16} y={930} size={96} color={K.laranja}>
        que não esquenta?
      </Big>
    </Escuro>
  );
};

// ===== 2 · "Para de procurar um profissional pra cada coisa." → "O Juliano resolve tudo." =====
const C2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = 2;
  const destaca = interpolate(f, [L(i, 205), L(i, 220)], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const aneis = interpolate(f, [L(i, 210), L(i, 236)], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  const pessoas = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const k = r * 3 + c;
      const centro = k === 4;
      const s = spring({
        frame: f - (L(i, 146) + k * 2),
        fps,
        config: { damping: 14 },
      });
      pessoas.push(
        <div
          key={k}
          style={{
            position: "absolute",
            left: 540 + (c - 1) * 230 - 80,
            top: 1060 + (r - 1) * 250 - 100,
            scale: String(s * (centro ? 1 + destaca * 0.5 : 1 - destaca * 0.2)),
            opacity: centro ? 1 : 1 - destaca,
            filter: centro ? undefined : `blur(${destaca * 14}px)`,
          }}
        >
          <Pessoa
            size={160}
            color={centro ? (destaca > 0.3 ? K.laranja : "#8A8A90") : K.cinza}
          />
        </div>,
      );
    }
  }
  return (
    <Escuro>
      {/* órbitas em volta do Juliano */}
      {[300, 420].map((r, n) => (
        <svg
          key={r}
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0, opacity: aneis }}
        >
          <circle
            cx="540"
            cy="1080"
            r={r * aneis}
            fill="none"
            stroke={K.laranja}
            strokeOpacity="0.45"
            strokeWidth="3"
          />
          {[0, 1, 2, 3].map((d) => {
            const a = (d / 4) * Math.PI * 2 + f * (n ? -0.02 : 0.03);
            return (
              <circle
                key={d}
                cx={540 + Math.cos(a) * r * aneis}
                cy={1080 + Math.sin(a) * r * aneis}
                r="12"
                fill={K.laranja}
              />
            );
          })}
        </svg>
      ))}
      {pessoas}
      <Big
        at={L(i, 141)}
        out={L(i, 200)}
        y={300}
        size={92}
        weight={800}
        color={K.branco}
      >
        Para de procurar
      </Big>
      <Big at={L(i, 150)} out={L(i, 200)} y={410} size={74} color={K.laranja}>
        um profissional
      </Big>
      <Big at={L(i, 158)} out={L(i, 200)} y={495} size={74} color={K.laranja}>
        pra cada coisa
      </Big>
      <Risco
        d="M180 350C400 330 700 340 900 352"
        at={L(i, 172)}
        cor={K.branco}
        width={10}
        out={L(i, 198)}
      />
      <Big at={L(i, 224)} y={330} size={110} weight={800} color={K.branco}>
        O Juliano
      </Big>
      <Big at={L(i, 232)} y={450} size={150} color={K.laranja}>
        resolve tudo.
      </Big>
    </Escuro>
  );
};

// ===== 3 · Serviços um atrás do outro → órbita "Um só profissional" =====
const SERV = [
  { src: "3d/rolo", nome: "Pintura", at: 280 },
  { src: "3d/carro", nome: "Pintura automotiva", at: 310 },
  { src: "3d/lampada", nome: "Elétrica", at: 331 },
  { src: "3d/bomba", nome: "Hidráulica", at: 361 },
  { src: "3d/gota", nome: "Caixa d'água", at: 386 },
  { src: "3d/casa", nome: "Telhado", at: 415 },
  { src: "3d/tijolos", nome: "Reforma", at: 440 },
  { src: "3d/vassoura", nome: "Pós-obra", at: 464 },
];
const ORBITA = 490;
const C3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = 3;
  const orb = interpolate(f, [L(i, ORBITA), L(i, ORBITA + 16)], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  return (
    <Escuro estrelas>
      {SERV.map((s, k) => {
        const t0 = L(i, s.at);
        const next = k < SERV.length - 1 ? L(i, SERV[k + 1].at) : L(i, ORBITA);
        if (f < t0 - 1 || f > next + 8) return null;
        const p = spring({
          frame: f - t0,
          fps,
          config: { damping: 13, stiffness: 140 },
        });
        const sai = interpolate(f, [next - 2, next + 6], [0, 1], CLAMP);
        return (
          <div
            key={s.nome}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - sai,
              filter: `blur(${sai * 16}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 540 - 230,
                top: 860 - 230,
                width: 460,
                height: 460,
                borderRadius: "50%",
                background: `radial-gradient(closest-side, rgba(242,106,27,0.95), rgba(242,106,27,0.55) 70%, rgba(242,106,27,0))`,
                scale: String(p),
              }}
            />
            <Obj3D
              src={s.src}
              size={300}
              style={{
                position: "absolute",
                left: 390,
                top: 700,
                scale: String(p),
                rotate: `${(1 - p) * -18}deg`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 1130,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "10px 34px",
                  background: K.laranja,
                  color: K.branco,
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 70,
                  letterSpacing: "-0.03em",
                  rotate: "-3deg",
                  ...pop(f, t0 + 2),
                }}
              >
                {s.nome}
              </div>
            </div>
          </div>
        );
      })}

      {/* "Um só profissional": os serviços orbitam em volta do Juliano */}
      {orb > 0 ? (
        <>
          <svg
            width="1080"
            height="1920"
            viewBox="0 0 1080 1920"
            style={{ position: "absolute", inset: 0, opacity: orb }}
          >
            <circle
              cx="540"
              cy="1000"
              r={330 * orb}
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="3"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 540 - 110,
              top: 1000 - 140,
              scale: String(orb),
            }}
          >
            <Pessoa size={220} color={K.laranja} />
          </div>
          {SERV.map((s, k) => {
            const a = (k / SERV.length) * Math.PI * 2 - Math.PI / 2 + f * 0.012;
            const x = 540 + Math.cos(a) * 330 * orb;
            const y = 1000 + Math.sin(a) * 330 * orb;
            return (
              <div
                key={s.nome}
                style={{
                  position: "absolute",
                  left: x - 62,
                  top: y - 62,
                  width: 124,
                  height: 124,
                  borderRadius: "50%",
                  background: K.laranja,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: String(orb),
                  boxShadow: "0 0 30px rgba(242,106,27,0.6)",
                }}
              >
                <Obj3D src={s.src} size={86} />
              </div>
            );
          })}
          <Big
            at={L(i, ORBITA + 2)}
            y={360}
            size={96}
            weight={800}
            color={K.branco}
          >
            Um só
          </Big>
          <Big at={L(i, ORBITA + 8)} y={470} size={130} color={K.laranja}>
            profissional.
          </Big>
        </>
      ) : null}
    </Escuro>
  );
};

// ===== 4 · "do pequeno reparo ao acabamento final" → "Feito com capricho, do jeito que a sua casa merece." =====
const C4: React.FC = () => {
  const f = useCurrentFrame();
  const i = 4;
  return (
    <Claro>
      <Adesivo
        at={L(i, 530)}
        out={L(i, 600)}
        fundo={K.laranja}
        cor={K.branco}
        rot={-4}
        y={700}
        de="left"
      >
        Pequeno reparo
      </Adesivo>
      <Adesivo
        at={L(i, 548)}
        out={L(i, 600)}
        fundo={K.preto}
        cor={K.branco}
        rot={3}
        y={830}
        de="right"
      >
        Reforma
      </Adesivo>
      <Adesivo
        at={L(i, 565)}
        out={L(i, 600)}
        fundo={K.laranja}
        cor={K.branco}
        rot={-2}
        y={960}
        de="left"
      >
        Acabamento final
      </Adesivo>

      <Big
        at={L(i, 610)}
        out={L(i, 650)}
        y={700}
        size={92}
        weight={800}
        color={K.preto}
      >
        Feito com
      </Big>
      <Big at={L(i, 616)} out={L(i, 650)} y={800} size={176} color={K.laranja}>
        capricho
      </Big>
      <Risco
        d="M170 1010C380 975 700 985 910 1000"
        at={L(i, 628)}
        cor={K.preto}
        width={12}
        out={L(i, 648)}
      />

      <Big at={L(i, 654)} y={480} size={80} weight={800} color={K.preto}>
        do jeito que
      </Big>
      <Big at={L(i, 660)} y={575} size={140} color={K.laranja}>
        a sua casa
      </Big>
      <Big at={L(i, 668)} y={725} size={120} color={K.preto}>
        merece.
      </Big>
      <Obj3D
        src="3d/casa"
        size={330}
        style={{
          position: "absolute",
          left: 375,
          top: 930,
          ...pop(f, L(i, 664)),
        }}
      />
      <Risco
        d="M540 900C760 900 830 1010 820 1110C810 1250 680 1300 540 1300C380 1300 250 1240 250 1100C250 980 360 905 560 915"
        at={L(i, 672)}
        dur={16}
        cor={K.laranja}
        width={10}
        length={1500}
      />
    </Claro>
  );
};

// ===== 5 · "Chama no WhatsApp e pede seu orçamento agora: (62) 99113-2531." =====
const GRUPOS = [
  { txt: "(62)", at: 786 },
  { txt: "99113", at: 826 },
  { txt: "-2531", at: 878 },
];
const C5: React.FC = () => {
  const f = useCurrentFrame();
  const i = 5;
  return (
    <Escuro estrelas>
      <Obj3D
        src="3d/whatsapp"
        size={240}
        style={{
          position: "absolute",
          left: 420,
          top: 300,
          ...pop(f, L(i, 712)),
        }}
      />
      <Big at={L(i, 716)} y={590} size={92} weight={800} color={K.branco}>
        Chama no
      </Big>
      <Big at={L(i, 722)} y={690} size={150} color={K.zap}>
        WhatsApp
      </Big>
      <Big at={L(i, 740)} y={870} size={64} weight={700} color={K.branco}>
        e pede seu orçamento
      </Big>
      {/* número rola grupo por grupo, no ritmo da fala */}
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

// ===== 6 · "Juliano Pinturas. Seu espaço, renovado." =====
const C6: React.FC = () => {
  const i = 6;
  return (
    <Claro>
      <Big at={L(i, 924)} y={520} size={130} color={K.preto}>
        Juliano
      </Big>
      <Big at={L(i, 930)} y={650} size={150} color={K.laranja}>
        Pinturas
      </Big>
      <Adesivo
        at={L(i, 966)}
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
        at={L(i, 976)}
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
        at={L(i, 996)}
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
  whip("left"),
  dissolve(1.12, 0.9),
  whip("up"),
  whip("left"),
  whip("up"),
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
          [0, 0.25, 0.25, 0],
          CLAMP,
        )
      }
    />
    {narracao ? (
      <Audio name="Narração" src={staticFile("juliano/narracao.wav")} />
    ) : null}
  </AbsoluteFill>
);
