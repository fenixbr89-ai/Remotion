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
import { CLAMP, EASE, EASE_IN_OUT, FONT } from "../pixora/ui";
import {
  Aurora,
  blur,
  Grad,
  LogoTile,
  NotifBody,
  NotifHeader,
  Obj,
  Texto,
  vidro,
} from "./kit";
import { J, J_TOTAL, SERVICOS, T } from "./tema";

export type JulianoVideoProps = {
  /** Toca public/juliano/narracao.wav quando true. */
  readonly narracao: boolean;
};

const PHONE = "(62) 99113-2531";

// ---------- geometria da grade 3×3 que vai sendo preenchida ----------
const TILE = 280;
const GAP = 30;
const GRID = { left: (1080 - (TILE * 3 + GAP * 2)) / 2, top: 640 };
const slot = (i: number) => ({
  left: GRID.left + (i % 3) * (TILE + GAP),
  top: GRID.top + Math.floor(i / 3) * (TILE + GAP),
  width: TILE,
  height: TILE,
});
const BIG = { left: 90, top: 900, width: 900, height: 380 };
const HERO = { left: 340, top: 300, width: 400, height: 400 };
/** Cada serviço entra a cada 30 frames: aparece grande, segura e voa para o seu lugar. */
const ENTRA = (k: number) => T.servicos + 6 + k * 30;
const SEGURA = 18;
const VOA = 14;

type Rect = { left: number; top: number; width: number; height: number };
const mix = (a: Rect, b: Rect, p: number): Rect => ({
  left: a.left + (b.left - a.left) * p,
  top: a.top + (b.top - a.top) * p,
  width: a.width + (b.width - a.width) * p,
  height: a.height + (b.height - a.height) * p,
});
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

/** Um serviço: card grande que vira um quadradinho na grade (e o primeiro vira o destaque "Pintura"). */
const Servico: React.FC<{ readonly k: number }> = ({ k }) => {
  const f = useCurrentFrame();
  const s = SERVICOS[k];
  const t0 = ENTRA(k);
  const p = ease(f, t0 + SEGURA, t0 + SEGURA + VOA);
  const hero = k === 0 ? ease(f, T.pintura + 4, T.pintura + 30) : 0;
  const rect = mix(mix(BIG, slot(k), p), HERO, hero);
  const enter = blur(f, t0, undefined, 8);
  const landed = interpolate(
    f,
    [t0 + SEGURA + VOA - 2, t0 + SEGURA + VOA + 4, t0 + SEGURA + VOA + 10],
    [0, 1, 0],
    CLAMP,
  );
  const out =
    k === 0 ? blur(f, 0, T.valores + 10, 12, 14) : blur(f, 0, T.pintura + 2, 12, 12);

  const iconSize = interpolate(p, [0, 1], [220, 150]) + hero * 140;
  const iconLeft =
    interpolate(p, [0, 1], [40, (TILE - 150) / 2]) * (1 - hero) +
    hero * ((HERO.width - 290) / 2);
  const iconTop =
    interpolate(p, [0, 1], [(BIG.height - 220) / 2, 30]) * (1 - hero) +
    hero * ((HERO.height - 290) / 2);
  const titleSize = interpolate(p, [0, 1], [76, 32]);

  return (
    <div
      style={{
        position: "absolute",
        ...rect,
        borderRadius: interpolate(p, [0, 1], [56, 44]) + hero * 40,
        ...vidro,
        opacity: (enter.opacity as number) * (out.opacity as number),
        filter:
          k === 0 && f < T.pintura
            ? enter.filter
            : f >= T.pintura
              ? out.filter
              : enter.filter,
        scale: String(
          (p < 1 ? (enter.scale as unknown as number) * 1 : 1) + landed * 0.05,
        ),
        translate:
          k === 0
            ? "0px 0px"
            : `0px ${interpolate(f, [T.pintura, T.pintura + 14], [0, 60], CLAMP)}px`,
        zIndex: f < t0 + SEGURA + VOA ? 10 : k === 0 && f >= T.pintura ? 20 : 1,
      }}
    >
      <Obj
        src={s.src}
        size={iconSize}
        style={{
          position: "absolute",
          left: iconLeft,
          top: iconTop + (hero ? Math.sin(f / 14) * 8 : 0),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: interpolate(p, [0, 1], [290, 0]),
          right: interpolate(p, [0, 1], [30, 0]),
          top: interpolate(p, [0, 1], [118, 196]),
          textAlign: "center",
          fontFamily: FONT,
          opacity: 1 - hero,
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: J.preto,
            letterSpacing: "-0.03em",
          }}
        >
          {s.titulo}
        </div>
        <div
          style={{
            fontSize: 32,
            color: J.cinza,
            marginTop: 6,
            opacity: 1 - p * 2.5,
          }}
        >
          {s.sub}
        </div>
      </div>
    </div>
  );
};

export const JulianoVideo: React.FC<JulianoVideoProps> = ({ narracao }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fundo: as trocas claro ↔ escuro se espalham em círculo a partir de um elemento
  // (o rolo, o centro da frase, o ícone do WhatsApp) — nunca corte seco.
  const iris = (from: number, to: number) =>
    interpolate(f, [from, to], [0, 2400], {
      ...CLAMP,
      easing: Easing.bezier(0.55, 0, 0.75, 0.2),
    });
  const rValores = iris(T.valores - 18, T.valores + 10);
  const rReforma = iris(T.reforma - 8, T.reforma + 18);
  const aurora = interpolate(
    f,
    [T.servicos - 10, T.servicos + 30, T.valores - 24, T.valores],
    [0, 1, 1, 0],
    CLAMP,
  );
  // Câmera do plano-sequência: nunca para, sem tremor.
  const camZoom =
    1 +
    0.018 * Math.sin(f / 70) +
    interpolate(f, [T.valores - 16, T.valores + 4], [0, 0.08], CLAMP) *
      (f < T.valores + 20 ? 1 : 0);
  const camY = 8 * Math.sin(f / 95);

  // ---------- logo: nasce do ponto, vira cabeçalho e some no destaque ----------
  const born = spring({
    frame: f - 8,
    fps,
    config: { damping: 15, stiffness: 110 },
  });
  const toHeader = ease(f, 84, 112);
  const logoSize =
    interpolate(born, [0, 1], [16, 300]) * (1 - toHeader) + toHeader * 120;
  const logoY = 760 * (1 - toHeader) + toHeader * 190;
  const logoOut = blur(f, 0, T.pintura, 12, 12);

  // ---------- valores ----------
  const VALORES = ["Qualidade.", "Capricho.", "Confiança."];
  const vAt = (i: number) => T.valores + 16 + i * 34;

  // ---------- WhatsApp: sai da lista e vira a cena; depois vira a logo ----------
  const ROW1 = { x: 940, y: 790 };
  const waP = ease(f, T.whatsapp, T.whatsapp + 30);
  const waSize = interpolate(waP, [0, 1], [96, 230]);
  const waX = interpolate(waP, [0, 1], [ROW1.x, 540]);
  const waY = interpolate(waP, [0, 1], [ROW1.y, 640]);
  const rWhats = iris(T.whatsapp + 4, T.whatsapp + 30);
  const toLogo = interpolate(f, [T.final, T.final + 16], [0, 1], {
    ...CLAMP,
    easing: EASE,
  });
  const typed = PHONE.slice(
    0,
    Math.floor(
      interpolate(
        f,
        [T.whatsapp + 62, T.whatsapp + 92],
        [0, PHONE.length],
        CLAMP,
      ),
    ),
  );

  return (
    <AbsoluteFill style={{ background: J.fundo, overflow: "hidden" }}>
      <Aurora opacity={aurora} />
      <AbsoluteFill
        style={{
          background: "#000",
          clipPath: `circle(${rValores}px at 540px 500px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: J.fundo,
          clipPath: `circle(${rReforma}px at 540px 1000px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "#000",
          clipPath: `circle(${rWhats}px at ${waX}px ${waY}px)`,
        }}
      />
      <AbsoluteFill
        style={{ scale: String(camZoom), translate: `0px ${camY}px` }}
      >
        {/* ===== Intro: ponto → logo ===== */}
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
        {f >= 6 && f < T.pintura + 16 ? (
          <LogoTile
            size={logoSize}
            style={{
              position: "absolute",
              left: 540 - logoSize / 2,
              top: logoY - logoSize / 2,
              rotate: `${(1 - born) * -12}deg`,
              opacity:
                interpolate(f, [6, 12], [0, 1], CLAMP) *
                (logoOut.opacity as number),
              filter: `${logoOut.filter} drop-shadow(0 ${logoSize * 0.06}px ${logoSize * 0.14}px rgba(0,0,0,0.18))`,
            }}
          />
        ) : null}
        {f < T.servicos + 10 ? (
          <>
            <At y={960} style={blur(f, 24, 82)}>
              <Texto size={92}>Juliano Pinturas</Texto>
            </At>
            <At y={1066} style={blur(f, 34, 82)}>
              <Texto size={40} weight={400} color={J.cinza}>
                Prestadora de Serviços
              </Texto>
            </At>
            <At y={380} style={blur(f, 100, T.servicos - 4)}>
              <Texto size={132}>
                <Grad>Todo espaço</Grad>
              </Texto>
            </At>
            <At y={530} style={blur(f, 110, T.servicos - 4)}>
              <Texto size={88}>tem potencial.</Texto>
            </At>
          </>
        ) : null}

        {/* ===== Serviços: um atrás do outro, preenchendo a tela ===== */}
        {f >= T.servicos && f < T.valores + 30 ? (
          <>
            <At y={330} style={blur(f, T.grade - 8, T.pintura)}>
              <Texto size={88}>Um só contato.</Texto>
            </At>
            <At y={440} style={blur(f, T.grade + 2, T.pintura)}>
              <Texto size={88}>
                <Grad>Muitas soluções.</Grad>
              </Texto>
            </At>
            {SERVICOS.map((_, k) =>
              f >= ENTRA(k) - 1 ? <Servico key={k} k={k} /> : null,
            )}
          </>
        ) : null}

        {/* ===== Pintura: o quadradinho do rolo vira o destaque ===== */}
        {f >= T.pintura && f < T.valores + 4 ? (
          <>
            <At y={760} style={blur(f, T.pintura + 26, T.valores - 20)}>
              <Texto size={124}>Pintura.</Texto>
            </At>
            {[
              {
                icon: "3d/casa",
                titulo: "Pra sua casa.",
                sub: "Paredes, fachadas e muros",
                at: 40,
                top: 940,
              },
              {
                icon: "3d/carro",
                titulo: "Pro seu carro.",
                sub: "Pintura automotiva",
                at: 56,
                top: 1190,
              },
            ].map((c) => (
              <div
                key={c.titulo}
                style={{
                  position: "absolute",
                  left: 70,
                  width: 940,
                  top: c.top,
                  borderRadius: 48,
                  padding: 30,
                  ...vidro,
                  ...blur(f, T.pintura + c.at, T.valores - 20),
                }}
              >
                <NotifHeader />
                <NotifBody icon={c.icon} titulo={c.titulo} sub={c.sub} />
              </div>
            ))}
          </>
        ) : null}

        {/* ===== Valores ===== */}
        {f >= T.valores && f < T.reforma + 24 ? (
          <>
            {VALORES.map((v, i) => {
              const nextAt = i < 2 ? vAt(i + 1) : T.reforma + 100;
              const gray = interpolate(f, [nextAt, nextAt + 10], [0, 1], CLAMP);
              return (
                <At
                  key={v}
                  y={660 + i * 140}
                  style={blur(f, vAt(i), T.reforma + 8, 12, 12)}
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

        {/* ===== Do pequeno reparo à reforma ===== */}
        {f >= T.reforma && f < T.passos + 4 ? (
          <>
            <At y={700} style={blur(f, T.reforma + 22, T.passos - 10)}>
              <Texto size={80}>Do pequeno reparo</Texto>
            </At>
            <At y={810} style={blur(f, T.reforma + 32, T.passos - 10)}>
              <Texto size={160}>
                <Grad>à reforma.</Grad>
              </Texto>
            </At>
          </>
        ) : null}

        {/* ===== Como funciona ===== */}
        {f >= T.passos && f < T.whatsapp + 20 ? (
          <>
            <At y={470} style={blur(f, T.passos + 4, T.whatsapp)}>
              <Texto size={38} weight={400} color={J.cinza}>
                Como funciona
              </Texto>
            </At>
            <At y={530} style={blur(f, T.passos + 10, T.whatsapp)}>
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
                  top: 720 + i * 190,
                  borderTop: `2px solid ${J.linha}`,
                  paddingTop: 26,
                  fontFamily: FONT,
                  ...blur(f, T.passos + 28 + i * 22, T.whatsapp),
                }}
              >
                <div style={{ fontSize: 30, color: J.cinza }}>
                  Passo {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 60,
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

        {/* ===== WhatsApp: o ícone do passo 1 vira a cena; depois vira a logo ===== */}
        {f >= T.passos + 28 ? (
          <>
            <Obj
              src="3d/whatsapp"
              size={waSize}
              style={{
                position: "absolute",
                left: waX - waSize / 2,
                top: waY - waSize / 2,
                ...blur(f, T.passos + 30, undefined, 10),
                opacity:
                  (blur(f, T.passos + 30, undefined, 10).opacity as number) *
                  (1 - toLogo),
                filter: `blur(${toLogo * 16}px) drop-shadow(0 0 ${waP * 60}px rgba(52,199,89,${0.5 * waP}))`,
              }}
            />
            {f >= T.final ? (
              <LogoTile
                size={300}
                style={{
                  position: "absolute",
                  left: 390,
                  top: 490,
                  opacity: toLogo,
                  filter: `blur(${(1 - toLogo) * 16}px)`,
                  scale: String(0.9 + 0.1 * toLogo),
                }}
              />
            ) : null}
          </>
        ) : null}
        {f >= T.whatsapp ? (
          <>
            <At y={800} style={blur(f, T.whatsapp + 34, T.final - 6)}>
              <Texto size={40} weight={400} color={J.cinza}>
                Solicite seu orçamento pelo
              </Texto>
            </At>
            <At y={860} style={blur(f, T.whatsapp + 42, T.final - 6)}>
              <Texto size={116} color="#FFFFFF">
                WhatsApp.
              </Texto>
            </At>
            <At y={1020} style={blur(f, T.whatsapp + 58, T.final - 6)}>
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
            <At y={850} style={blur(f, T.final + 14)}>
              <Texto
                size={58}
                weight={600}
                color="#FFFFFF"
                style={{ letterSpacing: "0.3em", paddingLeft: "0.3em" }}
              >
                JULIANO PINTURAS
              </Texto>
            </At>
            <At y={940} style={blur(f, T.final + 24)}>
              <Texto size={36} weight={400} color={J.cinza}>
                Prestadora de Serviços
              </Texto>
            </At>
            <At y={1000} style={blur(f, T.final + 32)}>
              <Texto size={34} weight={500} color="#AEAEB2">
                {PHONE}
              </Texto>
            </At>
          </>
        ) : null}
      </AbsoluteFill>

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
