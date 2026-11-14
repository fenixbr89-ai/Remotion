import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { CLAMP, EASE, EASE_IN_OUT, FONT, Kinetic } from "../pixora/ui";
import {
  Aurora,
  Barra,
  blur,
  IconAnim,
  LogoTile,
  Texto,
  vidroNotif,
} from "./kit";
import { J, J_TOTAL, SERVICOS } from "./tema";

export type JulianoVideoProps = {
  /** Toca public/juliano/narracao.wav quando true. */
  readonly narracao: boolean;
};

const PHONE = "(62) 99113-2531";
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });

const At: React.FC<{
  readonly y: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ y, style, children }) => (
  <div style={{ position: "absolute", top: y, left: 60, right: 60, ...style }}>
    {children}
  </div>
);

/**
 * Roteiro e linha do tempo (frames). Cada momento nasce de um elemento do anterior.
 *  0–102    "Parede descascando? Infiltração? Chuveiro que não esquenta?"  → 3 alertas chegam
 *  104–180  "Para de procurar um profissional pra cada coisa."             → alertas recuam
 *  168–240  "O Juliano resolve tudo."                                      → alertas se juntam e viram a logo
 *  236–500  "Pintura de casa e de carro. Elétrica, hidráulica e caixa d'água.
 *            Telhado, reforma e pós-obra."                                 → a logo sobe; serviços caem dela
 *  500–626  "Um só profissional, do pequeno reparo ao acabamento final."   → o ponto final vira o preto
 *  626–724  "Feito com capricho, do jeito que a sua casa merece."          → fundo preto; depois clareia
 *  726–840  "Chama no WhatsApp e pede seu orçamento agora: (62) 99113-2531."
 *  840–930  "Juliano Pinturas. Seu espaço, renovado."                      → WhatsApp pousa na barra final
 */
/** Tempos ajustados à narração gravada (public/juliano/narracao.wav, 34 s). */
const CHEGA = [280, 310, 331, 361, 386, 415, 440, 464]; // cada serviço na palavra falada
const M = {
  alerta: [9, 52, 87], // "Parede descascando?" · "Infiltração?" · "Chuveiro…"
  recuaAlerta: 141, // "Para de procurar…"
  junta: 205,
  logo: 224, // "O Juliano resolve tudo."
  logoSobe: 262,
  chega: (k: number) => CHEGA[k], // "Pintura… carro… elétrica… hidráulica… caixa d'água… telhado… reforma… pós-obra"
  recua: 494, // "Um só profissional…"
  ponto: 582,
  preto: 606, // "Feito com capricho…"
  clareia: 696,
  zap: 708, // "Chama no WhatsApp…"
  digita: [786, 909], // o número é digitado enquanto é falado
  vira: 922, // "Juliano Pinturas."
  renovado: 964, // "Seu espaço, renovado."
};
const TOP = 250;
const PASSO = 168;

const ALERTAS = [
  {
    src: "3d/tijolos",
    titulo: "Parede descascando?",
    sub: "Tinta soltando, reboco gasto",
  },
  { src: "3d/gota", titulo: "Infiltração?", sub: "Mancha e umidade na parede" },
  {
    src: "3d/chuveiro",
    titulo: "Chuveiro que não esquenta?",
    sub: "Problema elétrico ou hidráulico",
  },
];
const ALERTA_TOP = [620, 800, 980];

/** Bolinha vermelha de alerta no lugar do "agora". */
const Alerta: React.FC<{ readonly t: number }> = ({ t }) => {
  const s = interpolate(t, [6, 12], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        right: 30,
        top: 50,
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: "#FF3B30",
        color: "#fff",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: String(s * (1 + Math.sin(s * Math.PI) * 0.3)),
        boxShadow: "0 6px 14px rgba(255,59,48,0.35)",
      }}
    >
      !
    </div>
  );
};

export const JulianoVideo: React.FC<JulianoVideoProps> = ({ narracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const preto = interpolate(
    f,
    [M.preto - 2, M.preto, M.clareia, M.clareia + 12],
    [0, 1, 1, 0],
    CLAMP,
  );

  // ---------- alertas → logo ----------
  const recuaAlerta = ease(f, M.recuaAlerta, M.recuaAlerta + 16);
  const junta = ease(f, M.junta, M.logo + 2);
  const logoPop = spring({
    frame: f - M.logo,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const logoSobe = ease(f, M.logoSobe, M.logoSobe + 22);
  const logoSize = 380 * (1 - logoSobe) + 120 * logoSobe;
  const logoY = 820 * (1 - logoSobe) + 125 * logoSobe;
  const logoSai = blur(f, 0, M.chega(2), 12, 14);

  // ---------- lista ----------
  const recua = ease(f, M.recua, M.recua + 18);
  const listaSai = blur(f, 0, M.ponto - 4, 12, 12);

  // ---------- ponto que vira o preto ----------
  const dotIn = interpolate(f, [M.ponto - 10, M.ponto - 2], [0, 1], CLAMP);
  const dotGrow = interpolate(f, [M.ponto, M.preto], [1, 180], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const dotEscuro = interpolate(f, [M.ponto, M.ponto + 10], [0, 1], CLAMP);

  // ---------- WhatsApp ----------
  const zapPop = spring({
    frame: f - M.zap,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const toBar = ease(f, M.vira, M.vira + 20);
  const zapSize = interpolate(toBar, [0, 1], [230, 100]);
  const zapX = interpolate(toBar, [0, 1], [540, 70 + 26 + 50]);
  const zapY = interpolate(toBar, [0, 1], [500, 1000 + 75]);
  const typed = PHONE.slice(
    0,
    Math.floor(interpolate(f, M.digita, [0, PHONE.length], CLAMP)),
  );
  const bar = interpolate(f, [M.vira + 8, M.vira + 22], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{ background: J.fundo, overflow: "hidden" }}>
      <Aurora opacity={1} />

      {/* ===== problemas: alertas que se juntam e viram a logo ===== */}
      {f < M.logo + 8
        ? ALERTAS.map((a, i) => {
            const t0 = M.alerta[i];
            if (f < t0 - 1) return null;
            const inn = interpolate(f, [t0, t0 + 12], [0, 1], {
              ...CLAMP,
              easing: EASE,
            });
            const top = ALERTA_TOP[i] + (820 - 75 - ALERTA_TOP[i]) * junta;
            return (
              <Barra
                key={a.titulo}
                {...a}
                hora=""
                t={f - t0}
                style={{
                  top,
                  translate: `0px ${(1 - inn) * -60}px`,
                  opacity:
                    inn *
                    (1 - recuaAlerta * 0.35) *
                    (1 -
                      interpolate(f, [M.logo - 6, M.logo + 6], [0, 1], CLAMP)),
                  filter: `blur(${(1 - inn) * 16 + recuaAlerta * 3 + junta * 10}px)`,
                  scale: String(
                    (0.94 + 0.06 * inn) *
                      (1 - recuaAlerta * 0.05) *
                      (1 - junta * 0.55),
                  ),
                }}
              >
                <Alerta t={f - t0} />
              </Barra>
            );
          })
        : null}
      {f < M.logo + 60 ? (
        <>
          <At y={330}>
            <Kinetic
              delay={M.recuaAlerta + 4}
              stagger={3}
              outAt={M.junta - 4}
              lines={[
                { text: "Para de procurar", size: 92 },
                {
                  text: "um profissional pra cada coisa.",
                  size: 56,
                  color: J.laranja,
                },
              ]}
              lineHeight={1.15}
            />
          </At>
          <At y={1080}>
            <Kinetic
              delay={M.logo + 6}
              stagger={4}
              outAt={M.logoSobe - 4}
              lines={[
                { text: "O Juliano", size: 96 },
                { text: "resolve tudo.", size: 96, color: J.laranja },
              ]}
              lineHeight={1.1}
            />
          </At>
        </>
      ) : null}
      {f >= M.logo - 2 && f < M.chega(2) + 16 ? (
        <LogoTile
          size={logoSize}
          style={{
            position: "absolute",
            left: 540 - logoSize / 2,
            top: logoY - logoSize / 2,
            scale: String(logoPop),
            opacity: Math.min(1, logoPop * 1.5) * (logoSai.opacity as number),
            filter: `${logoSai.filter} drop-shadow(0 12px 24px rgba(0,0,0,0.15))`,
          }}
        />
      ) : null}

      {/* ===== serviços caem da logo ===== */}
      {f >= M.chega(0) - 1 && f < M.ponto + 12
        ? SERVICOS.map((s, k) => {
            if (f < M.chega(k) - 1) return null;
            let slot = 0;
            for (let j = k + 1; j < SERVICOS.length; j++)
              slot += ease(f, M.chega(j), M.chega(j) + 12);
            const inn = interpolate(f, [M.chega(k), M.chega(k) + 12], [0, 1], {
              ...CLAMP,
              easing: EASE,
            });
            return (
              <Barra
                key={s.titulo}
                {...s}
                t={f - M.chega(k)}
                style={{
                  top: TOP + slot * PASSO,
                  translate: `0px ${(1 - inn) * -80}px`,
                  opacity:
                    inn * (1 - recua * 0.75) * (listaSai.opacity as number),
                  filter: `blur(${(1 - inn) * 16 + recua * 6}px) ${listaSai.filter}`,
                  scale: String((0.94 + 0.06 * inn) * (1 - recua * 0.06)),
                }}
              />
            );
          })
        : null}

      {f >= M.recua && f < M.preto + 4 ? (
        <At y={720}>
          <Kinetic
            delay={M.recua + 6}
            stagger={4}
            lines={[
              { text: "Um só profissional.", size: 96 },
              { text: "Do reparo ao acabamento", size: 72, color: J.laranja },
            ]}
            lineHeight={1.15}
            trailing={
              <span
                style={{
                  display: "inline-block",
                  width: "0.22em",
                  height: "0.22em",
                  marginLeft: "0.04em",
                  borderRadius: "50%",
                  background: J.laranja,
                  opacity: dotIn,
                  scale: String(dotGrow * (0.4 + 0.6 * dotIn)),
                  filter: `brightness(${1 - dotEscuro})`,
                  position: "relative",
                  zIndex: 30,
                }}
              />
            }
          />
        </At>
      ) : null}

      {/* ===== preto: "Feito com capricho" ===== */}
      <AbsoluteFill style={{ background: "#000", opacity: preto }} />
      {f >= M.preto && f < M.zap + 20 ? (
        <At y={700}>
          <Kinetic
            delay={M.preto + 8}
            stagger={4}
            outAt={M.clareia - 14}
            lines={[
              { text: "Feito com capricho,", size: 100, color: J.laranja },
              { text: "do jeito que a sua", size: 80, color: "#FFFFFF" },
              { text: "casa merece.", size: 80, color: "#FFFFFF" },
            ]}
            lineHeight={1.15}
          />
        </At>
      ) : null}

      {/* ===== WhatsApp → barra final ===== */}
      {f >= M.zap - 2 ? (
        <>
          <At y={680}>
            <Kinetic
              delay={M.zap + 8}
              stagger={4}
              outAt={M.vira - 6}
              lines={[
                { text: "Chama no WhatsApp", size: 84, color: J.verdeEscuro },
                { text: "e pede seu orçamento.", size: 70 },
              ]}
              lineHeight={1.15}
            />
          </At>
          <At y={940} style={blur(f, M.digita[0] - 6, M.vira - 6)}>
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
              delay={M.renovado}
              stagger={4}
              lines={[
                { text: "Seu espaço,", size: 104 },
                { text: "renovado.", size: 104, color: J.laranja },
              ]}
              lineHeight={1.1}
            />
          </At>
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
          <IconAnim
            src="3d/whatsapp"
            size={zapSize}
            t={f - M.zap}
            style={{
              position: "absolute",
              left: zapX - zapSize / 2,
              top: zapY - zapSize / 2,
              scale: String(zapPop),
            }}
          />
        </>
      ) : null}

      <Audio
        name="Trilha"
        src={staticFile("juliano/trilha.mp3")}
        volume={(fr) =>
          interpolate(
            fr,
            [0, 15, J_TOTAL - 40, J_TOTAL],
            [0, narracao ? 0.25 : 0.6, narracao ? 0.25 : 0.6, 0],
            CLAMP,
          )
        }
      />
      {narracao ? (
        <Audio name="Narração" src={staticFile("juliano/narracao.wav")} />
      ) : null}
    </AbsoluteFill>
  );
};
