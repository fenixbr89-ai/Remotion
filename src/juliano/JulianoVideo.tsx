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
import { CLAMP, EASE, EASE_IN_OUT, FONT, Kinetic } from "../pixora/ui";
import { dissolve, whip } from "../pixora/transicoes";
import { Aurora, Barra, blur, LogoTile, Obj, Texto, vidroNotif } from "./kit";
import { DUR, J, J_TOTAL, SERVICOS, TRANS } from "./tema";

export type JulianoVideoProps = {
  /** Toca public/juliano/narracao.wav quando true. */
  readonly narracao: boolean;
};

const PHONE = "(62) 99113-2531";
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });

const Fundo: React.FC<{
  readonly children: React.ReactNode;
  readonly aurora?: boolean;
}> = ({ children, aurora = true }) => (
  <AbsoluteFill style={{ background: J.fundo, overflow: "hidden" }}>
    {aurora ? <Aurora opacity={1} /> : null}
    {children}
  </AbsoluteFill>
);

const At: React.FC<{
  readonly y: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ y, style, children }) => (
  <div style={{ position: "absolute", top: y, left: 60, right: 60, ...style }}>
    {children}
  </div>
);

// ===== A · Gancho + logo (0–5,2s) =====
// "Precisa pintar, reformar ou consertar alguma coisa?" → "Chama o Juliano."
const CenaA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ICONS = [
    {
      src: "emoji/pincel",
      filtro: "hue-rotate(28deg) saturate(1.3)",
      x: 250,
      at: 14,
    },
    { src: "3d/tijolos", x: 540, at: 24 },
    { src: "3d/lampada", x: 830, at: 34 },
  ];
  const junta = ease(f, 88, 106);
  const logo = spring({
    frame: f - 100,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  return (
    <Fundo>
      <At y={330}>
        <Kinetic
          delay={2}
          stagger={3}
          outAt={86}
          lines={[
            { text: "Precisa pintar,", size: 96 },
            { text: "reformar ou consertar?", size: 70, color: J.laranja },
          ]}
          lineHeight={1.12}
        />
      </At>
      {ICONS.map((ic) => {
        const s = spring({
          frame: f - ic.at,
          fps,
          config: { damping: 13, stiffness: 130 },
        });
        const x = interpolate(junta, [0, 1], [ic.x, 540]);
        const y = interpolate(junta, [0, 1], [800, 820]);
        const size = 210 * (1 - junta * 0.5);
        return (
          <Obj
            key={ic.src}
            src={ic.src}
            size={size}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              scale: String(s),
              opacity: 1 - interpolate(f, [100, 108], [0, 1], CLAMP),
              filter: `${ic.filtro ?? ""} blur(${junta * 6}px)`,
            }}
          />
        );
      })}
      {f >= 98 ? (
        <LogoTile
          size={380}
          style={{
            position: "absolute",
            left: 350,
            top: 630,
            scale: String(logo),
            opacity: Math.min(1, logo * 1.5),
          }}
        />
      ) : null}
      <At y={1080}>
        <Kinetic
          delay={106}
          stagger={4}
          lines={[{ text: "Chama o Juliano.", size: 92 }]}
        />
      </At>
    </Fundo>
  );
};

// ===== B · Serviços em barras de notificação (5,2–17s) =====
// Cada serviço chega como notificação no instante em que é falado e empurra os anteriores para baixo.
const CHEGA = (k: number) => 4 + k * 30;
const TOP = 230;
const PASSO = 168;
const RECUA = 236;

const CenaB: React.FC = () => {
  const f = useCurrentFrame();
  const recua = ease(f, RECUA, RECUA + 18);
  return (
    <Fundo>
      {SERVICOS.map((s, k) => {
        if (f < CHEGA(k) - 1) return null;
        let slot = 0;
        for (let j = k + 1; j < SERVICOS.length; j++)
          slot += ease(f, CHEGA(j), CHEGA(j) + 12);
        const inn = interpolate(f, [CHEGA(k), CHEGA(k) + 12], [0, 1], {
          ...CLAMP,
          easing: EASE,
        });
        return (
          <Barra
            key={s.titulo}
            {...s}
            style={{
              top: TOP + slot * PASSO,
              opacity: inn * (1 - recua * 0.75),
              filter: `blur(${(1 - inn) * 16 + recua * 6}px)`,
              translate: `0px ${(1 - inn) * -50}px`,
              scale: String((0.94 + 0.06 * inn) * (1 - recua * 0.06)),
            }}
          />
        );
      })}
      <At y={760}>
        <Kinetic
          delay={RECUA + 6}
          stagger={4}
          lines={[
            { text: "Um só contato.", size: 104 },
            { text: "Muitas soluções.", size: 104, color: J.laranja },
          ]}
          lineHeight={1.1}
        />
      </At>
    </Fundo>
  );
};

// ===== C · Casa e carro (17–22s) =====
const CenaC: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Fundo>
      <At y={420}>
        <Kinetic
          delay={8}
          stagger={4}
          outAt={146}
          lines={[
            { text: "Da sua casa", size: 104 },
            { text: "ao seu carro.", size: 104, color: J.laranja },
          ]}
          lineHeight={1.1}
        />
      </At>
      <Barra
        src="3d/casa"
        titulo="Pra sua casa."
        sub="Paredes, fachadas e muros"
        style={{ top: 800, ...blur(f, 24, 146, 12, 10) }}
      />
      <Barra
        src="3d/carro"
        titulo="Pro seu carro."
        sub="Pintura automotiva"
        style={{ top: 980, ...blur(f, 40, 146, 12, 10) }}
      />
    </Fundo>
  );
};

// ===== D · Valores no preto (22–26s) =====
const CenaD: React.FC = () => {
  const f = useCurrentFrame();
  const WORDS = ["Qualidade.", "Capricho.", "Confiança."];
  const at = (i: number) => 10 + i * 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {WORDS.map((w, i) => {
        const nextAt = i < 2 ? at(i + 1) : 9999;
        const gray = interpolate(f, [nextAt, nextAt + 10], [0, 1], CLAMP);
        return (
          <At key={w} y={680 + i * 150}>
            <div style={{ position: "relative" }}>
              <div style={{ opacity: 1 - gray }}>
                <Kinetic
                  delay={at(i)}
                  stagger={3}
                  outAt={122}
                  lines={[{ text: w, size: 124, color: J.laranja }]}
                />
              </div>
              <div style={{ position: "absolute", inset: 0, opacity: gray }}>
                <Kinetic
                  delay={at(i)}
                  stagger={3}
                  outAt={122}
                  lines={[{ text: w, size: 124, color: "#6E6E73" }]}
                />
              </div>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ===== E · WhatsApp e final (26–33s) =====
// "Peça seu orçamento pelo WhatsApp." → "Juliano Pinturas. Transformando seus espaços."
const VIRA = 112;
const CenaE: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: f - 6,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const toBar = ease(f, VIRA, VIRA + 20);
  // o ícone grande encolhe e vira o ícone da barra final
  const size = interpolate(toBar, [0, 1], [230, 100]);
  const x = interpolate(toBar, [0, 1], [540, 70 + 26 + 50]);
  const y = interpolate(toBar, [0, 1], [500, 1000 + 75]);
  const typed = PHONE.slice(
    0,
    Math.floor(interpolate(f, [44, 74], [0, PHONE.length], CLAMP)),
  );
  const bar = interpolate(f, [VIRA + 8, VIRA + 22], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  return (
    <Fundo>
      <At y={680}>
        <Kinetic
          delay={12}
          stagger={4}
          outAt={VIRA - 6}
          lines={[
            { text: "Peça seu orçamento", size: 80 },
            { text: "pelo WhatsApp.", size: 96, color: J.verdeEscuro },
          ]}
          lineHeight={1.12}
        />
      </At>
      <At y={940} style={blur(f, 40, VIRA - 6)}>
        <Texto size={78} color={J.preto}>
          {typed}
          <span
            style={{
              opacity: f % 20 < 10 && typed.length < PHONE.length ? 1 : 0,
            }}
          >
            |
          </span>
        </Texto>
      </At>

      <At y={560}>
        <Kinetic
          delay={VIRA + 10}
          stagger={4}
          lines={[
            { text: "Transformando", size: 100 },
            { text: "seus espaços.", size: 100, color: J.laranja },
          ]}
          lineHeight={1.1}
        />
      </At>
      {/* barra final do WhatsApp (o ícone grande pousa nela) */}
      <div
        style={{
          position: "absolute",
          left: 70,
          width: 940,
          top: 1000,
          height: 150,
          borderRadius: 42,
          padding: "0 34px 0 150px",
          display: "flex",
          alignItems: "center",
          fontFamily: FONT,
          ...vidroNotif,
          opacity: bar,
          filter: `blur(${(1 - bar) * 14}px)`,
          scale: String(0.94 + 0.06 * bar),
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: J.preto,
              letterSpacing: "-0.02em",
            }}
          >
            Juliano Pinturas
          </div>
          <div
            style={{
              fontSize: 34,
              color: J.verdeEscuro,
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {PHONE}
          </div>
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            marginTop: 26,
            fontSize: 25,
            color: J.cinzaEscuro,
            opacity: 0.6,
          }}
        >
          agora
        </div>
      </div>
      <Obj
        src="3d/whatsapp"
        size={size}
        style={{
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          scale: String(pop),
        }}
      />
    </Fundo>
  );
};

const t = (k: number) =>
  linearTiming({ durationInFrames: TRANS[k], easing: EASE_IN_OUT });

export const JulianoVideo: React.FC<JulianoVideoProps> = ({ narracao }) => (
  <AbsoluteFill style={{ background: J.fundo }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="A · Gancho" durationInFrames={DUR.a}>
        <CenaA />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip("up")} timing={t(0)} />
      <TransitionSeries.Sequence name="B · Serviços" durationInFrames={DUR.b}>
        <CenaB />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip("left")} timing={t(1)} />
      <TransitionSeries.Sequence
        name="C · Casa e carro"
        durationInFrames={DUR.c}
      >
        <CenaC />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={dissolve(1.06, 0.96)}
        timing={t(2)}
      />
      <TransitionSeries.Sequence name="D · Valores" durationInFrames={DUR.d}>
        <CenaD />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={dissolve(1.06, 0.96)}
        timing={t(3)}
      />
      <TransitionSeries.Sequence name="E · WhatsApp" durationInFrames={DUR.e}>
        <CenaE />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio
      name="Trilha"
      src={staticFile("juliano/trilha.mp3")}
      volume={(fr) =>
        interpolate(
          fr,
          [0, 15, J_TOTAL - 40, J_TOTAL],
          [0, narracao ? 0.3 : 0.6, narracao ? 0.3 : 0.6, 0],
          CLAMP,
        )
      }
    />
    {narracao ? (
      <Audio name="Narração" src={staticFile("juliano/narracao.wav")} />
    ) : null}
  </AbsoluteFill>
);
