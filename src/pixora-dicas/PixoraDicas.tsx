import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  CLAMP,
  EASE,
  EASE_IN_OUT,
  Finger,
  FONT,
  IPhone,
  Kinetic,
  PixoraP,
} from "../pixora/ui";
import { blur } from "../juliano/kit";

/**
 * Pixora — Reels educativo: "3 erros que fazem o vídeo da sua empresa perder clientes".
 * Estilo Apple: fundo claro, vidro, textos palavra por palavra. Linha do tempo contínua (frames).
 *  0–96     "Seu vídeo tem 3 segundos pra prender alguém."
 *  96–150   "E a maioria das empresas erra nisso aqui:"
 *  150–300  Erro 1 · começo lento
 *  300–450  Erro 2 · texto demais
 *  450–600  Erro 3 · sem chamada pra ação
 *  600–780  O jeito certo (3 checks)
 *  780–900  "Quer um vídeo assim pra sua empresa? Fala com a Pixora. Salva esse vídeo."
 *  900–990  Marca
 */
export const DICAS_TOTAL = 990;

const C = {
  fundo: "#F5F5F7",
  preto: "#111111",
  cinza: "#8E8E93",
  cinzaEscuro: "#3A3A3C",
  vermelho: "#FF3B30",
  verde: "#34C759",
  azul: "#0A84FF",
};
const vidro: React.CSSProperties = {
  background: "rgba(255,255,255,0.5)",
  backdropFilter: "blur(30px) saturate(180%)",
  WebkitBackdropFilter: "blur(30px) saturate(180%)",
  border: "1.5px solid rgba(255,255,255,0.8)",
  boxShadow: "0 24px 60px rgba(30,30,60,0.10)",
};
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

const Icone: React.FC<{
  readonly nome: string;
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ nome, size, style }) => (
  <Img
    src={staticFile(`pixora-dicas/${nome}.png`)}
    style={{ width: size, height: size, flexShrink: 0, ...style }}
  />
);

/** Fundo claro com manchas suaves (cinza-azulado), para o vidro aparecer. */
const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const blob = (
    x: number,
    y: number,
    r: number,
    c: string,
    k: number,
  ): React.CSSProperties => ({
    position: "absolute",
    left: x + Math.sin(t * 0.4 + k) * 50 - r,
    top: y + Math.cos(t * 0.35 + k * 2) * 50 - r,
    width: r * 2,
    height: r * 2,
    borderRadius: "50%",
    background: `radial-gradient(closest-side, ${c}, rgba(255,255,255,0))`,
    filter: "blur(40px)",
  });
  return (
    <AbsoluteFill style={{ background: C.fundo }}>
      <div style={blob(180, 380, 420, "rgba(10,132,255,0.16)", 0)} />
      <div style={blob(920, 760, 380, "rgba(175,82,222,0.13)", 1)} />
      <div style={blob(300, 1500, 460, "rgba(52,199,89,0.10)", 2)} />
      <div style={blob(900, 1650, 360, "rgba(10,132,255,0.12)", 3)} />
    </AbsoluteFill>
  );
};

/** Card de vidro de um erro (ou de um acerto). */
const Card: React.FC<{
  readonly at: number;
  readonly out: number;
  readonly icone: string;
  readonly selo: string;
  readonly corSelo: string;
  readonly titulo: string;
  readonly sub: string;
}> = ({ at, out, icone, selo, corSelo, titulo, sub }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 300,
        padding: "30px 34px",
        borderRadius: 48,
        display: "flex",
        alignItems: "center",
        gap: 28,
        fontFamily: FONT,
        ...vidro,
        ...blur(f, at, out, 12, 10),
      }}
    >
      <Icone nome={icone} size={130} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 18px",
            borderRadius: 30,
            background: `${corSelo}1F`,
            color: corSelo,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {selo}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: C.preto,
            letterSpacing: "-0.03em",
            marginTop: 8,
          }}
        >
          {titulo}
        </div>
        <div style={{ fontSize: 32, color: C.cinzaEscuro, marginTop: 4 }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

/** Etiqueta ao lado do celular (resultado do erro). */
const Etiqueta: React.FC<{
  readonly at: number;
  readonly out: number;
  readonly children: React.ReactNode;
}> = ({ at, out, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1690,
        display: "flex",
        justifyContent: "center",
        ...blur(f, at, out, 10, 8),
      }}
    >
      <div
        style={{
          padding: "14px 32px",
          borderRadius: 40,
          background: C.vermelho,
          color: "#fff",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 40,
          boxShadow: "0 12px 30px rgba(255,59,48,0.35)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const PixoraDicas: React.FC<{ readonly narracao: boolean }> = ({
  narracao,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- contagem 3-2-1 ----------
  const anel = interpolate(f, [6, 90], [1, 0], CLAMP);
  const numero = f < 34 ? 3 : f < 62 ? 2 : 1;

  // ---------- celular que fica na tela durante os 3 erros ----------
  const celIn = spring({ frame: f - 128, fps, config: { damping: 18 } });
  const celOut = ease(f, 596, 616);
  const PH = { left: 330, top: 780, w: 420, h: 860 };

  // erro 1: logo lento + dedo que pula
  const pula = ease(f, 236, 252);
  const tempo = Math.min(
    3,
    Math.floor(interpolate(f, [160, 250], [0, 3.99], CLAMP)),
  );
  // erro 2: texto demais
  const linhas = Math.floor(interpolate(f, [318, 360], [0, 22], CLAMP));
  const borra = interpolate(f, [376, 392], [0, 1], CLAMP);
  // erro 3: fim sem convite
  const fim = interpolate(f, [470, 480], [0, 1], CLAMP);
  const duvida = spring({ frame: f - 500, fps, config: { damping: 11 } });

  // ---------- marca ----------
  const marca = spring({
    frame: f - 904,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Fundo />

      {/* ===== gancho ===== */}
      {f < 100 ? (
        <>
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            style={{
              position: "absolute",
              left: 380,
              top: 380,
              ...blur(f, 2, 86),
            }}
          >
            <circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="18"
            />
            <circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke={C.preto}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={880}
              strokeDashoffset={880 * (1 - anel)}
              transform="rotate(-90 160 160)"
            />
            <text
              x="160"
              y="200"
              textAnchor="middle"
              fontFamily={FONT}
              fontWeight={800}
              fontSize="130"
              fill={C.preto}
            >
              {numero}
            </text>
          </svg>
          <At y={790}>
            <Kinetic
              delay={8}
              stagger={4}
              outAt={86}
              lines={[
                {
                  text: "Seu vídeo tem",
                  size: 70,
                  color: C.cinza,
                  weight: 600,
                },
                { text: "3 segundos", size: 140 },
                { text: "pra prender alguém.", size: 70, weight: 700 },
              ]}
              lineHeight={1.1}
            />
          </At>
        </>
      ) : null}

      {/* ===== "E a maioria erra nisso aqui:" ===== */}
      {f >= 92 && f < 160 ? (
        <At y={330}>
          <Kinetic
            delay={96}
            stagger={4}
            outAt={146}
            lines={[
              {
                text: "E a maioria das empresas",
                size: 64,
                color: C.cinza,
                weight: 600,
              },
              { text: "erra nisso aqui:", size: 104 },
            ]}
            lineHeight={1.15}
          />
        </At>
      ) : null}

      {/* ===== os 3 erros (o card troca, o celular continua) ===== */}
      <Card
        at={152}
        out={292}
        icone="tartaruga"
        selo="ERRO 1"
        corSelo={C.vermelho}
        titulo="Começo lento"
        sub="Logo, música… e nada acontece."
      />
      <Card
        at={302}
        out={442}
        icone="pergaminho"
        selo="ERRO 2"
        corSelo={C.vermelho}
        titulo="Texto demais"
        sub="Ninguém lê parágrafo no feed."
      />
      <Card
        at={452}
        out={592}
        icone="pensando"
        selo="ERRO 3"
        corSelo={C.vermelho}
        titulo="Sem chamada pra ação"
        sub="O vídeo acaba e… e agora?"
      />

      {f >= 120 && f < 625 ? (
        <div
          style={{
            position: "absolute",
            left: PH.left,
            top: PH.top,
            translate: `0px ${(1 - celIn) * 1100 + celOut * 200}px`,
            opacity: 1 - celOut,
            filter: `blur(${celOut * 14}px)`,
          }}
        >
          <IPhone width={PH.w} height={PH.h} screen="#FFFFFF">
            {/* erro 1 */}
            {f < 300 ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  translate: `0px ${-pula * 100}%`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "42%",
                    width: 150,
                    height: 150,
                    translate: "-50% -50%",
                    borderRadius: 36,
                    background: "#E5E5EA",
                    rotate: `${f * 0.6}deg`,
                    opacity: 0.6 + 0.4 * Math.sin(f / 18),
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 70,
                    width: "100%",
                    textAlign: "center",
                    fontFamily: FONT,
                    fontSize: 30,
                    color: C.cinza,
                  }}
                >
                  0:0{tempo}
                </div>
              </div>
            ) : null}
            {/* erro 2 */}
            {f >= 300 && f < 452 ? (
              <div
                style={{
                  position: "absolute",
                  inset: "70px 34px",
                  filter: `blur(${borra * 6}px)`,
                }}
              >
                {new Array(linhas).fill(0).map((_, n) => (
                  <div
                    key={n}
                    style={{
                      height: 14,
                      borderRadius: 7,
                      marginBottom: 18,
                      width: `${62 + ((n * 37) % 38)}%`,
                      background: "#C7C7CC",
                    }}
                  />
                ))}
              </div>
            ) : null}
            {/* erro 3 */}
            {f >= 452 ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `rgba(0,0,0,${fim})`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "40%",
                    width: "100%",
                    textAlign: "center",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 54,
                    color: "#fff",
                    opacity: fim,
                  }}
                >
                  Fim.
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "56%",
                    translate: "-50% 0",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: C.azul,
                    color: "#fff",
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 70,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    scale: String(duvida),
                  }}
                >
                  ?
                </div>
              </div>
            ) : null}
          </IPhone>
        </div>
      ) : null}
      {f >= 200 && f < 260 ? (
        <Finger
          path={[
            { f: 212, x: 560, y: 1480 },
            { f: 222, x: 560, y: 1440 },
            { f: 240, x: 560, y: 1000 },
            { f: 250, x: 600, y: 920 },
          ]}
          taps={[]}
        />
      ) : null}
      <Etiqueta at={246} out={292}>
        Pulou o vídeo.
      </Etiqueta>
      <Etiqueta at={394} out={442}>
        Ninguém leu.
      </Etiqueta>
      <Etiqueta at={530} out={592}>
        Cliente perdido.
      </Etiqueta>

      {/* ===== o jeito certo ===== */}
      {f >= 600 && f < 790 ? (
        <>
          <At y={300}>
            <Kinetic
              delay={604}
              stagger={4}
              outAt={772}
              lines={[
                { text: "O jeito", size: 72, color: C.cinza, weight: 600 },
                { text: "certo:", size: 130 },
              ]}
              lineHeight={1.05}
            />
          </At>
          {[
            { t: "Movimento nos 3 primeiros segundos", at: 628 },
            { t: "Uma ideia por cena", at: 668 },
            { t: "Convite claro no final", at: 708 },
          ].map((c, n) => (
            <div
              key={c.t}
              style={{
                position: "absolute",
                left: 70,
                right: 70,
                top: 640 + n * 200,
                height: 170,
                borderRadius: 44,
                padding: "0 34px",
                display: "flex",
                alignItems: "center",
                gap: 26,
                fontFamily: FONT,
                ...vidro,
                ...blur(f, c.at, 772 + n * 3, 12, 10),
              }}
            >
              <Icone nome="check" size={96} />
              <div
                style={{
                  fontSize: 46,
                  fontWeight: 700,
                  color: C.preto,
                  letterSpacing: "-0.02em",
                }}
              >
                {c.t}
              </div>
            </div>
          ))}
        </>
      ) : null}

      {/* ===== chamada ===== */}
      {f >= 780 && f < 910 ? (
        <>
          <At y={520}>
            <Kinetic
              delay={784}
              stagger={4}
              outAt={894}
              lines={[
                { text: "Quer um vídeo assim", size: 80 },
                { text: "pra sua empresa?", size: 80, color: C.cinza },
              ]}
              lineHeight={1.12}
            />
          </At>
          <At y={760}>
            <Kinetic
              delay={812}
              stagger={4}
              outAt={894}
              lines={[{ text: "Fala com a Pixora.", size: 104 }]}
            />
          </At>
          <div
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 1000,
              height: 160,
              borderRadius: 44,
              padding: "0 34px",
              display: "flex",
              alignItems: "center",
              gap: 26,
              fontFamily: FONT,
              ...vidro,
              ...blur(f, 836, 894, 12, 10),
            }}
          >
            <Icone nome="salvar" size={92} />
            <div>
              <div style={{ fontSize: 44, fontWeight: 700, color: C.preto }}>
                Salva esse vídeo
              </div>
              <div style={{ fontSize: 30, color: C.cinzaEscuro }}>
                pra não esquecer na hora de gravar
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* ===== marca ===== */}
      {f >= 900 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 540 - 120,
              top: 620,
              width: 240,
              height: 240,
              borderRadius: 56,
              background: C.preto,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
              scale: String(marca),
            }}
          >
            <PixoraP size={150} id="dicas" />
          </div>
          <At y={930} style={blur(f, 916)}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 64,
                letterSpacing: "0.3em",
                paddingLeft: "0.3em",
                textAlign: "center",
                color: C.preto,
              }}
            >
              PIXORA
            </div>
          </At>
          <At y={1020} style={blur(f, 926)}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 36,
                textAlign: "center",
                color: C.cinza,
              }}
            >
              Vídeos em motion para empresas
            </div>
          </At>
        </>
      ) : null}

      <Audio
        name="Trilha"
        src={staticFile("audio/trilha.mp3")}
        volume={(fr) =>
          interpolate(
            fr,
            [0, 15, DICAS_TOTAL - 40, DICAS_TOTAL],
            [0, narracao ? 0.22 : 0.5, narracao ? 0.22 : 0.5, 0],
            {
              ...CLAMP,
              easing: EASE,
            },
          )
        }
      />
      {narracao ? (
        <Audio name="Narração" src={staticFile("pixora-dicas/narracao.wav")} />
      ) : null}
    </AbsoluteFill>
  );
};
