import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { AREAS, CONTATO, EQUIPE } from "./data";
import { C, goldText, img, sans, serif, tagStyle } from "./theme";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);
export const FADE = 15;

/** Envolve cada cena com fade de entrada/saída para cruzar com a próxima. */
export const Cena: React.FC<{
  dur: number;
  entrada?: boolean;
  saida?: boolean;
  children: React.ReactNode;
}> = ({ dur, entrada = true, saida = true, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          f,
          [0, FADE, dur - FADE, dur],
          [entrada ? 0 : 1, 1, 1, saida ? 0 : 1],
          cl,
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Fundo preto com brilho dourado pulsante e partículas, como no topo do site. */
export const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 60% 30%, #1b1409, ${C.bk} 65%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 540 - 600,
          top: 160,
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(198,154,80,.38), rgba(198,154,80,.08) 45%, transparent 68%)",
          opacity: 0.8 + Math.sin(f / 30) * 0.2,
          scale: String(1 + Math.sin(f / 30) * 0.05),
        }}
      />
      {new Array(40).fill(0).map((_, i) => {
        const x = random(`x${i}`) * 1080;
        const vel = 0.4 + random(`v${i}`) * 1.2;
        const y = (((random(`y${i}`) * 1920 - f * vel) % 1920) + 1920) % 1920;
        const r = 2 + random(`r${i}`) * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r,
              height: r,
              borderRadius: "50%",
              background: C.ch,
              opacity: 0.15 + random(`o${i}`) * 0.45,
              boxShadow: `0 0 ${r * 3}px ${C.gd}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Monograma: React.FC<{ escala?: number }> = ({ escala = 1 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22 * escala,
      fontFamily: serif,
      fontWeight: 600,
      fontSize: 40 * escala,
      color: C.wh,
      whiteSpace: "nowrap",
    }}
  >
    <b
      style={{
        color: C.gd,
        border: `${2 * escala}px solid ${C.gd}`,
        padding: `${4 * escala}px ${14 * escala}px`,
        fontSize: 34 * escala,
      }}
    >
      WPC
    </b>
    <span>Woner Protásio &amp; Cândido</span>
  </div>
);

/** Texto que sobe palavra por palavra (como o h1 do site). */
const Palavras: React.FC<{
  texto: string;
  inicio: number;
  passo?: number;
  dourado?: boolean;
}> = ({ texto, inicio, passo = 5, dourado }) => {
  const f = useCurrentFrame();
  return (
    <>
      {texto.split(" ").map((p, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            padding: "0 0.12em 0.1em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              ...(dourado ? goldText : {}),
              translate: interpolate(
                f,
                [inicio + i * passo, inicio + i * passo + 24],
                ["0px 110%", "0px 0%"],
                { ...cl, easing: suave },
              ),
            }}
          >
            {p}
          </span>
        </span>
      ))}
    </>
  );
};

const Titulo: React.FC<{
  tag: string;
  inicio?: number;
  children: React.ReactNode;
}> = ({ tag, inicio = 0, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 190, left: 80, right: 80 }}>
      <div
        style={{
          ...tagStyle,
          opacity: interpolate(f, [inicio, inicio + 20], [0, 1], cl),
          translate: interpolate(
            f,
            [inicio, inicio + 20],
            ["-30px 0px", "0px 0px"],
            {
              ...cl,
              easing: suave,
            },
          ),
        }}
      >
        {tag}
      </div>
      <div
        style={{
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 96,
          lineHeight: 1.02,
          color: C.wh,
          margin: "26px 0 0 -0.12em",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ───────────────────────────── 1. Abertura ─────────────────────────────
export const Abertura: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 90,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(f, [10, 35], [0, 1], cl),
        }}
      >
        <Monograma />
      </div>
      <Img
        src={img(baseUrl, "deusa.webp")}
        style={{
          position: "absolute",
          left: 150,
          top: 190,
          width: 780,
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,.7))",
          opacity: interpolate(f, [0, 40], [0, 1], cl),
          scale: interpolate(f, [0, 110], [1.18, 1], { ...cl, easing: suave }),
          translate: `0px ${Math.sin(f / 22) * 10}px`,
        }}
      />
      {/* brilho que atravessa a estátua */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 190,
          width: 780,
          height: 826,
          WebkitMaskImage: `url(${img(baseUrl, "deusa.webp")})`,
          maskImage: `url(${img(baseUrl, "deusa.webp")})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          background:
            "linear-gradient(105deg, transparent 42%, rgba(255,232,180,.75) 50%, transparent 58%)",
          backgroundSize: "260% 100%",
          backgroundPositionX: `${interpolate(f, [40, 120], [100, 0], cl)}%`,
          mixBlendMode: "soft-light",
          scale: interpolate(f, [0, 110], [1.18, 1], { ...cl, easing: suave }),
          translate: `0px ${Math.sin(f / 22) * 10}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 760,
          height: 360,
          background: `linear-gradient(180deg, transparent, ${C.bk})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div
          style={{
            margin: 0,
            textAlign: "center",
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 124,
            lineHeight: 1.0,
            color: C.wh,
          }}
        >
          <Palavras texto="Compromisso com a justiça." inicio={30} />
          <br />
          <Palavras texto="Foco em pessoas." inicio={58} dourado />
        </div>
        <div
          style={{
            maxWidth: 860,
            margin: 0,
            textAlign: "center",
            fontFamily: sans,
            fontWeight: 300,
            fontSize: 34,
            lineHeight: 1.6,
            color: C.mut,
            opacity: interpolate(f, [85, 110], [0, 1], cl),
            translate: interpolate(f, [85, 110], ["0px 30px", "0px 0px"], {
              ...cl,
              easing: suave,
            }),
          }}
        >
          Atuação estratégica e personalizada, com soluções jurídicas eficazes
          para proteger seus direitos.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────── 2. Áreas de atuação ───────────────────────────
export const Areas: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Titulo tag="Áreas de atuação">
        <Palavras texto="Soluções jurídicas" inicio={8} />
        <br />
        <Palavras texto="para cada momento." inicio={18} dourado />
      </Titulo>
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
        }}
      >
        {AREAS.map((a, i) => {
          const ini = 35 + i * 12;
          // destaque dourado que percorre os cartões um a um
          const luz = interpolate(
            f,
            [130 + i * 18, 145 + i * 18, 175 + i * 18],
            [0, 1, 0],
            cl,
          );
          return (
            <div
              key={a.titulo}
              style={{
                height: 330,
                borderRadius: 28,
                padding: "44px 38px",
                boxSizing: "border-box",
                background: `linear-gradient(160deg, rgba(198,154,80,${0.1 + luz * 0.18}), ${C.gr} 60%)`,
                border: `2px solid rgba(198,154,80,${0.22 + luz * 0.6})`,
                boxShadow: `0 0 ${luz * 70}px rgba(198,154,80,.35)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: interpolate(f, [ini, ini + 18], [0, 1], cl),
                translate: interpolate(
                  f,
                  [ini, ini + 30],
                  ["0px 120px", "0px 0px"],
                  {
                    ...cl,
                    easing: Easing.spring({ damping: 200 }),
                  },
                ),
                scale: String(1 + luz * 0.04),
              }}
            >
              <div style={{ width: 96, height: 96, stroke: C.gd }}>
                {a.icone}
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontWeight: 600,
                  fontSize: 46,
                  lineHeight: 1.05,
                  color: C.wh,
                }}
              >
                {a.titulo}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────── 3. O escritório ─────────────────────────────
const FOTOS = [
  { arq: "fachada.jpg", ini: 0, fim: 75, pos: "60% 50%" },
  { arq: "recepcao.jpg", ini: 60, fim: 125, pos: "50% 40%" },
  { arq: "reuniao.jpg", ini: 110, fim: 180, pos: "50% 50%" },
];

export const Sobre: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          height: 1180,
          overflow: "hidden",
        }}
      >
        {FOTOS.map((p) => (
          <Img
            key={p.arq}
            src={img(baseUrl, p.arq)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: p.pos,
              opacity: interpolate(f, [p.ini, p.ini + 15], [0, 1], cl),
              scale: interpolate(f, [p.ini, p.fim], [1.04, 1.16], cl),
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(8,8,8,.55), transparent 25%, transparent 55%, ${C.bk})`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 80,
          ...tagStyle,
          textShadow: "0 2px 12px rgba(0,0,0,.9)",
        }}
      >
        O escritório
      </div>
      <div style={{ position: "absolute", top: 1130, left: 80, right: 80 }}>
        <div
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 92,
            lineHeight: 1.02,
            color: C.wh,
            margin: "0 0 0 -0.12em",
          }}
        >
          <Palavras
            texto="Experiência, ética e resultados"
            inicio={15}
            passo={4}
          />
          <br />
          <Palavras
            texto="que fazem a diferença."
            inicio={32}
            passo={4}
            dourado
          />
        </div>
        <div
          style={{
            height: 2,
            margin: "40px 0",
            background: `linear-gradient(90deg, ${C.gd}, transparent)`,
            width: interpolate(f, [45, 80], [0, 420], { ...cl, easing: suave }),
          }}
        />
        <div
          style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: 34,
            lineHeight: 1.6,
            color: C.mut,
            margin: 0,
            opacity: interpolate(f, [55, 80], [0, 1], cl),
          }}
        >
          Conhecimento técnico, atendimento humanizado e estratégias jurídicas
          eficazes para entregar soluções seguras e personalizadas.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────── 4. Equipe ─────────────────────────────
export const Equipe: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Titulo tag="Nossa equipe">
        <Palavras texto="Profissionais que" inicio={8} />
        <br />
        <Palavras texto="cuidam" inicio={16} />
        <Palavras texto="do seu caso." inicio={20} dourado />
      </Titulo>
      <div
        style={{
          position: "absolute",
          top: 590,
          left: 60,
          right: 60,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px 30px",
        }}
      >
        {EQUIPE.map((p, i) => {
          const ini = 30 + i * 14;
          return (
            <div
              key={p.nome}
              style={{
                width: 300,
                opacity: interpolate(f, [ini, ini + 15], [0, 1], cl),
                translate: interpolate(
                  f,
                  [ini, ini + 30],
                  ["0px 80px", "0px 0px"],
                  {
                    ...cl,
                    easing: Easing.spring({ damping: 200 }),
                  },
                ),
              }}
            >
              <div
                style={{
                  width: 300,
                  height: 420,
                  borderRadius: 24,
                  overflow: "hidden",
                  border: `2px solid rgba(198,154,80,.4)`,
                  clipPath: `inset(${interpolate(f, [ini, ini + 30], [100, 0], { ...cl, easing: suave })}% 0 0 0 round 24px)`,
                }}
              >
                <Img
                  src={img(baseUrl, p.foto)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    scale: interpolate(f, [ini, ini + 120], [1.2, 1], cl),
                  }}
                />
              </div>
              <div
                style={{
                  ...tagStyle,
                  fontSize: 20,
                  letterSpacing: 4,
                  marginTop: 18,
                }}
              >
                {p.cargo}
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontWeight: 600,
                  fontSize: 36,
                  lineHeight: 1.05,
                  color: C.wh,
                  marginTop: 6,
                }}
              >
                {p.nome}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────── 5. Contato ─────────────────────────────
export const Contato: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  const f = useCurrentFrame();
  const pulso = interpolate(
    f,
    [70, 85, 100, 115, 130],
    [1, 1.06, 1, 1.06, 1],
    cl,
  );
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Img
        src={img(baseUrl, "deusa.webp")}
        style={{
          position: "absolute",
          top: 120,
          width: 760,
          opacity: 0.16,
          scale: interpolate(f, [0, 180], [1, 1.1], cl),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 260,
          opacity: interpolate(f, [0, 20], [0, 1], cl),
        }}
      >
        <Monograma escala={1.3} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 70,
          right: 70,
          margin: 0,
          textAlign: "center",
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 126,
          lineHeight: 1.0,
          color: C.wh,
        }}
      >
        <Palavras texto="Vamos conversar" inicio={10} />
        <br />
        <Palavras texto="sobre o" inicio={20} />
        <Palavras texto="seu caso?" inicio={28} dourado />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 300,
          fontSize: 34,
          lineHeight: 1.7,
          color: C.mut,
          opacity: interpolate(f, [40, 60], [0, 1], cl),
        }}
      >
        {CONTATO.endereco}
        <br />
        {CONTATO.cidade}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1200,
          fontFamily: serif,
          fontWeight: 700,
          fontSize: 100,
          ...goldText,
          opacity: interpolate(f, [50, 70], [0, 1], cl),
          translate: interpolate(f, [50, 75], ["0px 40px", "0px 0px"], {
            ...cl,
            easing: suave,
          }),
        }}
      >
        {CONTATO.telefone}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1440,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "34px 64px",
          borderRadius: 100,
          background: `linear-gradient(120deg, #a97d3a, ${C.ch} 50%, #a97d3a)`,
          color: "#17110a",
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: 3,
          textTransform: "uppercase",
          boxShadow: "0 20px 60px rgba(198,154,80,.35)",
          opacity: interpolate(f, [60, 75], [0, 1], cl),
          scale: String(
            interpolate(f, [60, 80], [0.8, 1], {
              ...cl,
              easing: Easing.spring({ damping: 12 }),
            }) * pulso,
          ),
        }}
      >
        <svg viewBox="0 0 24 24" width={46} height={46} fill="#17110a">
          <path d="M12 2a10 10 0 00-8.6 15L2 22l5.1-1.3A10 10 0 1012 2zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.1.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z" />
        </svg>
        Fale pelo WhatsApp
      </div>
    </AbsoluteFill>
  );
};
