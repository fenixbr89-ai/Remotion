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
 * Linha do tempo (frames) — cada momento nasce de um elemento do anterior:
 *  0–156   gancho: três ícones caem e se juntam → viram a logo ("Chama o Juliano.")
 *  140–400 a logo sobe e as notificações caem dela, uma por serviço falado
 *  392–510 "Um só contato. Muitas soluções."
 *  506–664 casa e carro se soltam da lista → "Pra sua casa / Pro seu carro";
 *          o ponto final de "carro." cresce e vira o fundo preto
 *  664–800 Qualidade, Capricho, Confiança; "Confiança." fica enquanto o fundo clareia
 *  800–990 WhatsApp aparece, número é digitado, e o ícone pousa na barra final
 */
const M = {
  logoSobe: 140,
  chega: (k: number) => 166 + k * 30,
  recua: 392,
  solta: 506,
  ponto: 636,
  preto: 664,
  valor: (i: number) => 676 + i * 30,
  clareia: 780,
  zap: 812,
  vira: 900,
};
const TOP = 250;
const PASSO = 168;
const CASA = SERVICOS.findIndex((s) => s.src === "3d/casa");
const CARRO = SERVICOS.findIndex((s) => s.src === "3d/carro");

export const JulianoVideo: React.FC<JulianoVideoProps> = ({ narracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // fundo preto: nasce do ponto (já cobre a tela em M.preto) e volta a clarear em M.clareia
  const preto = interpolate(
    f,
    [M.preto - 2, M.preto, M.clareia, M.clareia + 12],
    [0, 1, 1, 0],
    CLAMP,
  );

  // ---------- gancho → logo ----------
  const GANCHO = [
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
  const logoPop = spring({
    frame: f - 100,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const logoSobe = ease(f, M.logoSobe, M.logoSobe + 22);
  const logoSize = 380 * (1 - logoSobe) + 120 * logoSobe;
  const logoY = 820 * (1 - logoSobe) + 125 * logoSobe;
  const logoSai = blur(f, 0, M.chega(2), 12, 14);

  // ---------- lista → casa e carro ----------
  const recua =
    ease(f, M.recua, M.recua + 18) * (1 - ease(f, M.solta, M.solta + 16));
  const solta = ease(f, M.solta, M.solta + 26);
  const outrasSaem = blur(f, 0, M.solta, 12, 12);

  // ---------- ponto que vira o preto ----------
  const dotIn = interpolate(f, [M.solta + 50, M.solta + 58], [0, 1], CLAMP);
  const dotGrow = interpolate(f, [M.ponto, M.preto], [1, 180], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const dotCor = interpolate(f, [M.ponto, M.ponto + 10], [0, 1], CLAMP);

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
    Math.floor(
      interpolate(f, [M.zap + 40, M.zap + 70], [0, PHONE.length], CLAMP),
    ),
  );
  const bar = interpolate(f, [M.vira + 8, M.vira + 22], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{ background: J.fundo, overflow: "hidden" }}>
      <Aurora opacity={1} />

      {/* ===== gancho ===== */}
      {f < 160 ? (
        <>
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
          {f < 110
            ? GANCHO.map((ic) => {
                const x = interpolate(junta, [0, 1], [ic.x, 540]);
                const size = 210 * (1 - junta * 0.55);
                return (
                  <IconAnim
                    key={ic.src}
                    src={ic.src}
                    size={size}
                    t={f - ic.at}
                    filtro={ic.filtro}
                    style={{
                      position: "absolute",
                      left: x - size / 2,
                      top: 820 - size / 2,
                      opacity:
                        (f >= ic.at ? 1 : 0) *
                        (1 - interpolate(f, [100, 108], [0, 1], CLAMP)),
                      filter: `blur(${junta * 6}px)`,
                    }}
                  />
                );
              })
            : null}
          <At y={1080}>
            <Kinetic
              delay={106}
              stagger={4}
              outAt={M.logoSobe - 4}
              lines={[{ text: "Chama o Juliano.", size: 92 }]}
            />
          </At>
        </>
      ) : null}
      {f >= 98 && f < M.chega(2) + 16 ? (
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

      {/* ===== notificações (caem da logo) → casa e carro ===== */}
      {f >= M.chega(0) - 1 && f < M.preto + 4
        ? SERVICOS.map((s, k) => {
            if (f < M.chega(k) - 1) return null;
            const fica = k === CASA || k === CARRO;
            let slot = 0;
            for (let j = k + 1; j < SERVICOS.length; j++)
              slot += ease(f, M.chega(j), M.chega(j) + 12);
            const inn = interpolate(f, [M.chega(k), M.chega(k) + 12], [0, 1], {
              ...CLAMP,
              easing: EASE,
            });
            const topLista = TOP + slot * PASSO;
            const destino = k === CASA ? 800 : 980;
            const top = fica
              ? topLista + (destino - topLista) * solta
              : topLista;
            const troca = fica
              ? interpolate(f, [M.solta + 8, M.solta + 20], [0, 1], CLAMP)
              : 0;
            const sai = fica ? blur(f, 0, M.ponto - 6, 12, 10) : outrasSaem;
            const titulo =
              troca < 0.5
                ? s.titulo
                : k === CASA
                  ? "Pra sua casa."
                  : "Pro seu carro.";
            const sub =
              troca < 0.5
                ? s.sub
                : k === CASA
                  ? "Paredes, fachadas e muros"
                  : "Pintura automotiva";
            return (
              <Barra
                key={s.titulo}
                src={s.src}
                filtro={s.filtro}
                titulo={titulo}
                sub={sub}
                t={f - M.chega(k)}
                style={{
                  top,
                  // começa um pouco acima, como se caísse da logo
                  translate: `0px ${(1 - inn) * -80}px`,
                  opacity: inn * (1 - recua * 0.75) * (sai.opacity as number),
                  filter: `blur(${(1 - inn) * 16 + recua * 6 + Math.abs(Math.sin(troca * Math.PI)) * 4}px) ${sai.filter}`,
                  scale: String((0.94 + 0.06 * inn) * (1 - recua * 0.06)),
                }}
              />
            );
          })
        : null}

      <At y={760}>
        <Kinetic
          delay={M.recua + 6}
          stagger={4}
          outAt={M.solta - 6}
          lines={[
            { text: "Um só contato.", size: 104 },
            { text: "Muitas soluções.", size: 104, color: J.laranja },
          ]}
          lineHeight={1.1}
        />
      </At>

      {f >= M.solta && f < M.preto + 4 ? (
        <At y={420}>
          <Kinetic
            delay={M.solta + 14}
            stagger={4}
            lines={[
              { text: "Da sua casa", size: 104 },
              { text: "ao seu carro", size: 104, color: J.laranja },
            ]}
            lineHeight={1.1}
            trailing={
              <span
                style={{
                  display: "inline-block",
                  width: "0.2em",
                  height: "0.2em",
                  marginLeft: "0.03em",
                  borderRadius: "50%",
                  background: dotCor < 1 ? J.laranja : "#000",
                  opacity: dotIn,
                  scale: String(dotGrow * (0.4 + 0.6 * dotIn)),
                  position: "relative",
                  zIndex: 30,
                  boxShadow:
                    dotCor > 0 ? `0 0 0 999px rgba(0,0,0,0)` : undefined,
                  filter: `brightness(${1 - dotCor})`,
                }}
              />
            }
          />
        </At>
      ) : null}

      {/* ===== fundo preto ===== */}
      <AbsoluteFill style={{ background: "#000", opacity: preto }} />

      {/* ===== valores (Confiança fica enquanto clareia) ===== */}
      {f >= M.preto && f < M.zap + 30
        ? ["Qualidade.", "Capricho.", "Confiança."].map((w, i) => {
            const nextAt = i < 2 ? M.valor(i + 1) : 99999;
            const gray = interpolate(f, [nextAt, nextAt + 10], [0, 1], CLAMP);
            const ultimo = i === 2;
            const out = ultimo ? M.zap - 6 : M.clareia - 8;
            // "Confiança." sobe ao centro enquanto as outras saem
            const y =
              680 +
              i * 150 -
              (ultimo ? ease(f, M.clareia - 6, M.clareia + 16) * 150 : 0);
            return (
              <At key={w} y={y}>
                <div style={{ position: "relative" }}>
                  <div style={{ opacity: 1 - gray }}>
                    <Kinetic
                      delay={M.valor(i)}
                      stagger={3}
                      outAt={out}
                      lines={[{ text: w, size: 124, color: J.laranja }]}
                    />
                  </div>
                  <div
                    style={{ position: "absolute", inset: 0, opacity: gray }}
                  >
                    <Kinetic
                      delay={M.valor(i)}
                      stagger={3}
                      outAt={out}
                      lines={[{ text: w, size: 124, color: "#6E6E73" }]}
                    />
                  </div>
                </div>
              </At>
            );
          })
        : null}

      {/* ===== WhatsApp → barra final ===== */}
      {f >= M.zap - 2 ? (
        <>
          <At y={680}>
            <Kinetic
              delay={M.zap + 8}
              stagger={4}
              outAt={M.vira - 6}
              lines={[
                { text: "Peça seu orçamento", size: 80 },
                { text: "pelo WhatsApp.", size: 96, color: J.verdeEscuro },
              ]}
              lineHeight={1.12}
            />
          </At>
          <At y={940} style={blur(f, M.zap + 36, M.vira - 6)}>
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
              delay={M.vira + 10}
              stagger={4}
              lines={[
                { text: "Transformando", size: 100 },
                { text: "seus espaços.", size: 100, color: J.laranja },
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
};
