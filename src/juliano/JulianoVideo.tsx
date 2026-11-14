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
import { CLAMP, EASE, EASE_IN_OUT, FONT } from "../pixora/ui";
import {
  AppIcon,
  Aurora,
  blur,
  CallIcon,
  Grad,
  Icon3D,
  NotifBody,
  NotifHeader,
  Texto,
  vidro,
} from "./kit";
import { J, J_TOTAL, SERVICOS, T } from "./tema";

export type JulianoVideoProps = {
  /** Toca public/juliano/narracao.wav quando true. */
  readonly narracao: boolean;
};

const CARD = { left: 70, width: 940, top: 860 };
const HEADER_ICON = { x: CARD.left + 30 + 19, y: CARD.top + 30 + 19 };
const CELL = (CARD.width - 60) / 4;
const cellCenter = (i: number) => ({
  x: CARD.left + 30 + (i % 4) * CELL + CELL / 2,
  y: CARD.top + 60 + Math.floor(i / 4) * 320 + 65,
});
const PHONE = "(62) 99113-2531";

/** Bloco centralizado numa altura da tela. */
const At: React.FC<{
  readonly y: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ y, style, children }) => (
  <div style={{ position: "absolute", top: y, left: 60, right: 60, ...style }}>
    {children}
  </div>
);

const lerp = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], { ...CLAMP, easing: EASE_IN_OUT });

export const JulianoVideo: React.FC<JulianoVideoProps> = ({ narracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dark = (f >= T.valores && f < T.reforma) || f >= T.whatsapp;
  const aurora = interpolate(
    f,
    [T.servicos, T.servicos + 30, T.valores - 22, T.valores],
    [0, 1, 1, 0],
    CLAMP,
  );

  // ---------- ícone do app: nasce do ponto, sobe e voa para o cabeçalho do card ----------
  const born = spring({
    frame: f - 8,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const iconSize =
    f < 82
      ? interpolate(born, [0, 1], [16, 230])
      : f < 152
        ? lerp(f, 82, 104, 230, 130)
        : lerp(f, 152, 176, 130, 38);
  const iconX = f < 152 ? 540 : lerp(f, 152, 176, 540, HEADER_ICON.x);
  const iconY =
    f < 82
      ? 760
      : f < 152
        ? lerp(f, 82, 104, 760, 330)
        : lerp(f, 152, 176, 330, HEADER_ICON.y);
  const showFlyingIcon = f >= 6 && f < 176;

  // ---------- card de vidro: notificação que vira widget ----------
  const cardIn = blur(f, 162, T.pintura + 2, 14, 12);
  const cardH = lerp(f, T.widget, T.widget + 26, 210, 720);
  const k = Math.max(0, Math.min(7, Math.floor((f - 180) / 30)));
  const lt = f - 180 - k * 30;
  const swap = blur(
    f,
    180 + k * 30 - (k === 0 ? 4 : 0),
    k < 7 ? 180 + k * 30 + 24 : T.widget,
    8,
    6,
  );

  // ---------- pincel que sai da grade e vira o destaque ----------
  const from = cellCenter(0);
  const brushX = lerp(f, T.pintura + 2, T.pintura + 28, from.x, 540);
  const brushY = lerp(f, T.pintura + 2, T.pintura + 28, from.y, 420);
  const brushSize = lerp(f, T.pintura + 2, T.pintura + 28, 130, 250);

  // ---------- palavras no preto ----------
  const VALORES = ["Qualidade.", "Capricho.", "Confiança."];
  const vAt = (i: number) => T.valores + 6 + i * 36;

  // ---------- número digitado ----------
  const typed = PHONE.slice(
    0,
    Math.floor(
      interpolate(
        f,
        [T.whatsapp + 34, T.whatsapp + 64],
        [0, PHONE.length],
        CLAMP,
      ),
    ),
  );
  const callIn = spring({
    frame: f - (T.whatsapp + 4),
    fps,
    config: { damping: 14 },
  });
  const toApp = interpolate(f, [T.final + 2, T.final + 16], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });

  return (
    <AbsoluteFill
      style={{ background: dark ? "#000000" : J.fundo, overflow: "hidden" }}
    >
      <Aurora opacity={aurora} />

      {/* ===== 1 · Intro ===== */}
      {f < T.servicos + 2 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 532,
              top: 752,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: J.preto,
              opacity: interpolate(f, [0, 4, 10, 14], [0, 1, 1, 0], CLAMP),
            }}
          />
          <At y={960} style={blur(f, 26, 80)}>
            <Texto size={92}>Juliano Pinturas</Texto>
          </At>
          <At y={1066} style={blur(f, 36, 80)}>
            <Texto size={40} weight={400} color={J.cinza}>
              Prestadora de Serviços
            </Texto>
          </At>
          <At y={560} style={blur(f, 100, T.servicos - 8)}>
            <Texto size={40} weight={400} color={J.cinza}>
              Especialista em pintura
            </Texto>
          </At>
          <At y={630} style={blur(f, 108, T.servicos - 8)}>
            <Texto size={132}>
              <Grad>Todo espaço</Grad>
            </Texto>
          </At>
          <At y={790} style={blur(f, 118, T.servicos - 8)}>
            <Texto size={88}>tem potencial.</Texto>
          </At>
        </>
      ) : null}
      {showFlyingIcon ? (
        <AppIcon
          size={iconSize}
          style={{
            position: "absolute",
            left: iconX - iconSize / 2,
            top: iconY - iconSize / 2,
            rotate: `${(1 - born) * -14}deg`,
            opacity: interpolate(f, [6, 12], [0, 1], CLAMP),
          }}
        />
      ) : null}

      {/* ===== 2 · Serviços (card de notificação) e 3 · widget ===== */}
      {f >= 160 && f < T.pintura + 16 ? (
        <>
          <At y={760} style={blur(f, 168, T.widget)}>
            <Texto size={40} weight={400} color={J.cinza}>
              Aqui você encontra
            </Texto>
          </At>
          <At y={560} style={blur(f, T.widget + 6, T.pintura)}>
            <Texto size={88}>Um só contato.</Texto>
          </At>
          <At y={670} style={blur(f, T.widget + 16, T.pintura)}>
            <Texto size={88}>
              <Grad>Muitas soluções.</Grad>
            </Texto>
          </At>

          <div
            style={{
              position: "absolute",
              left: CARD.left,
              width: CARD.width,
              top: CARD.top,
              height: cardH,
              borderRadius: 48,
              padding: 30,
              ...vidro,
              ...cardIn,
            }}
          >
            {f < T.widget + 10 ? (
              <div style={blur(f, 166, T.widget, 10, 8)}>
                <NotifHeader iconOpacity={f >= 176 ? 1 : 0} />
                <div
                  style={{
                    ...swap,
                    translate: `0px ${lt < 8 ? (1 - lt / 8) * 14 : 0}px`,
                  }}
                >
                  <NotifBody
                    icon={SERVICOS[k].icon}
                    titulo={SERVICOS[k].titulo}
                    sub={SERVICOS[k].sub}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* grade do widget (fora do card para o pincel poder sair dela) */}
          {f >= T.widget + 14
            ? SERVICOS.map((s, i) => {
                const c = cellCenter(i);
                const pop = spring({
                  frame: f - (T.widget + 18 + i * 4),
                  fps,
                  config: { damping: 13 },
                });
                const leaving = i === 0 && f >= T.pintura;
                return (
                  <div
                    key={s.icon}
                    style={{
                      position: "absolute",
                      left: c.x - CELL / 2,
                      top: c.y - 65,
                      width: CELL,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 14,
                      scale: String(pop),
                      opacity: leaving ? 0 : 1,
                      ...(i === 0
                        ? {}
                        : {
                            filter: blur(f, 0, T.pintura).filter,
                            opacity: blur(f, 0, T.pintura).opacity,
                          }),
                    }}
                  >
                    <Icon3D name={s.icon} size={130} />
                    <div
                      style={{
                        fontFamily: FONT,
                        fontSize: 28,
                        fontWeight: 500,
                        color: J.cinzaEscuro,
                        textAlign: "center",
                        opacity:
                          i === 0
                            ? 1 -
                              interpolate(
                                f,
                                [T.pintura, T.pintura + 6],
                                [0, 1],
                                CLAMP,
                              )
                            : 1,
                      }}
                    >
                      {s.titulo}
                    </div>
                  </div>
                );
              })
            : null}
        </>
      ) : null}

      {/* ===== 4 · Pintura: o pincel sai da grade e vira o destaque ===== */}
      {f >= T.pintura && f < T.valores ? (
        <>
          <Icon3D
            name="pincel"
            size={brushSize}
            style={{
              position: "absolute",
              left: brushX - brushSize / 2,
              top: brushY - brushSize / 2 + Math.sin(f / 14) * 8,
              ...blur(f, 0, T.valores - 22),
            }}
          />
          <At y={590} style={blur(f, T.pintura + 26, T.valores - 22)}>
            <Texto size={124}>Pintura.</Texto>
          </At>
          {[
            {
              icon: "casa-jardim",
              titulo: "Pra sua casa.",
              sub: "Paredes, fachadas e muros",
              at: 42,
              top: 790,
            },
            {
              icon: "carro",
              titulo: "Pro seu carro.",
              sub: "Pintura automotiva",
              at: 60,
              top: 1040,
            },
          ].map((c) => (
            <div
              key={c.titulo}
              style={{
                position: "absolute",
                left: CARD.left,
                width: CARD.width,
                top: c.top,
                borderRadius: 48,
                padding: 30,
                ...vidro,
                ...blur(f, T.pintura + c.at, T.valores - 22),
              }}
            >
              <NotifHeader />
              <NotifBody icon={c.icon} titulo={c.titulo} sub={c.sub} />
            </div>
          ))}
        </>
      ) : null}

      {/* ===== 5 · Valores no preto ===== */}
      {f >= T.valores && f < T.reforma ? (
        <>
          {VALORES.map((v, i) => {
            const nextAt = i < 2 ? vAt(i + 1) : T.reforma + 100;
            const gray = interpolate(f, [nextAt, nextAt + 10], [0, 1], CLAMP);
            return (
              <At
                key={v}
                y={660 + i * 140}
                style={blur(f, vAt(i), T.reforma - 12)}
              >
                <div style={{ position: "relative" }}>
                  <Texto size={120} color="#6E6E73" style={{ opacity: gray }}>
                    {v}
                  </Texto>
                  <Texto
                    size={120}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 1 - gray,
                    }}
                  >
                    <Grad>{v}</Grad>
                  </Texto>
                </div>
              </At>
            );
          })}
        </>
      ) : null}

      {/* ===== 6 · Do pequeno reparo à reforma ===== */}
      {f >= T.reforma && f < T.passos ? (
        <>
          <At y={700} style={blur(f, T.reforma + 4, T.passos - 12)}>
            <Texto size={80}>Do pequeno reparo</Texto>
          </At>
          <At y={810} style={blur(f, T.reforma + 18, T.passos - 12)}>
            <Texto size={160}>
              <Grad>à reforma.</Grad>
            </Texto>
          </At>
        </>
      ) : null}

      {/* ===== 7 · Como funciona (lista estilo Ajustes do iOS) ===== */}
      {f >= T.passos && f < T.whatsapp ? (
        <>
          <At y={470} style={blur(f, T.passos + 4, T.whatsapp - 12)}>
            <Texto size={38} weight={400} color={J.cinza}>
              Como funciona
            </Texto>
          </At>
          <At y={530} style={blur(f, T.passos + 10, T.whatsapp - 12)}>
            <Texto size={100}>Simples assim.</Texto>
          </At>
          {[
            "Chame no WhatsApp",
            "Receba seu orçamento",
            "Serviço feito com capricho",
          ].map((txt, i) => (
            <div
              key={txt}
              style={{
                position: "absolute",
                left: 70,
                right: 70,
                top: 740 + i * 190,
                borderTop: `2px solid ${J.linha}`,
                paddingTop: 26,
                fontFamily: FONT,
                ...blur(f, T.passos + 30 + i * 24, T.whatsapp - 12),
              }}
            >
              <div style={{ fontSize: 30, color: J.cinza }}>Passo {i + 1}</div>
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 700,
                  color: J.preto,
                  letterSpacing: "-0.03em",
                  marginTop: 6,
                }}
              >
                {txt}
              </div>
            </div>
          ))}
        </>
      ) : null}

      {/* ===== 8 · WhatsApp e 9 · final (o ícone de ligar vira o ícone da marca) ===== */}
      {f >= T.whatsapp ? (
        <>
          <CallIcon
            size={150}
            style={{
              position: "absolute",
              left: 465,
              top: 565,
              scale: String(callIn),
              opacity: 1 - toApp,
              filter: `blur(${toApp * 16}px)`,
            }}
          />
          {f >= T.final ? (
            <AppIcon
              size={150}
              style={{
                position: "absolute",
                left: 465,
                top: 565,
                opacity: toApp,
                filter: `blur(${(1 - toApp) * 16}px)`,
                scale: String(0.9 + 0.1 * toApp),
              }}
            />
          ) : null}

          <At y={790} style={blur(f, T.whatsapp + 12, T.final - 6)}>
            <Texto size={40} weight={400} color={J.cinza}>
              Solicite seu orçamento pelo
            </Texto>
          </At>
          <At y={850} style={blur(f, T.whatsapp + 20, T.final - 6)}>
            <Texto size={116} color="#FFFFFF">
              WhatsApp.
            </Texto>
          </At>
          <At y={1010} style={blur(f, T.whatsapp + 32, T.final - 6)}>
            <Texto size={80} color={J.verde}>
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

          <At y={790} style={blur(f, T.final + 12)}>
            <Texto
              size={58}
              weight={600}
              color="#FFFFFF"
              style={{ letterSpacing: "0.3em", paddingLeft: "0.3em" }}
            >
              JULIANO PINTURAS
            </Texto>
          </At>
          <At y={880} style={blur(f, T.final + 22)}>
            <Texto size={36} weight={400} color={J.cinza}>
              Prestadora de Serviços
            </Texto>
          </At>
          <At y={940} style={blur(f, T.final + 30)}>
            <Texto size={32} weight={400} color="#AEAEB2">
              {PHONE}
            </Texto>
          </At>
        </>
      ) : null}

      <Audio
        name="Trilha"
        src={staticFile("juliano/trilha.mp3")}
        volume={(fr) =>
          interpolate(
            fr,
            [0, 20, J_TOTAL - 45, J_TOTAL],
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
