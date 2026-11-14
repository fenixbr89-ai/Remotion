import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COR, CONDENSADA, SANS, camera, clamp, suave } from "./tema";
import { IconeWhatsApp } from "./Icones";

const TAM = 640;

/** Cena 06 — assinatura com a logo, contato e chamada. */
export const Cena06Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const entra = (de: number, dist = 30) => ({
    opacity: interpolate(frame, [de, de + 20], [0, 1], clamp),
    translate: interpolate(frame, [de, de + 34], [`0px ${dist}px`, "0px 0px"], {
      ...clamp,
      easing: suave,
    }),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 540 - TAM / 2,
          width: TAM,
          height: TAM,
          scale: interpolate(frame, [10, 90], [0.92, 1], {
            ...clamp,
            easing: suave,
          }),
        }}
      >
        <svg
          width={TAM + 80}
          height={TAM + 80}
          style={{
            position: "absolute",
            left: -40,
            top: -40,
            rotate: "-90deg",
          }}
        >
          <circle
            cx={(TAM + 80) / 2}
            cy={(TAM + 80) / 2}
            r={TAM / 2 + 24}
            fill="none"
            stroke={COR.laranja}
            strokeWidth={3}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(frame, [4, 64], [1, 0], {
              ...clamp,
              easing: camera,
            })}
          />
        </svg>
        <Img
          src={staticFile("logo.jpg")}
          style={{
            width: TAM,
            height: TAM,
            clipPath: `circle(${interpolate(frame, [14, 70], [0, 47], {
              ...clamp,
              easing: camera,
            })}% at 50% 50%)`,
            filter: `blur(${interpolate(frame, [14, 60], [8, 0], clamp)}px)`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 940,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: SANS,
        }}
      >
        <div
          style={{
            fontFamily: CONDENSADA,
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 1,
            letterSpacing: 1,
            ...entra(55),
          }}
        >
          <span style={{ color: COR.texto }}>JULIANO </span>
          <span style={{ color: COR.laranja }}>PINTURAS</span>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: COR.textoSuave,
            marginTop: 24,
            ...entra(68),
          }}
        >
          Prestadora de Serviços
        </div>
        <div
          style={{
            height: 3,
            background: COR.linha,
            marginTop: 50,
            marginBottom: 50,
            width: interpolate(frame, [78, 120], [0, 760], {
              ...clamp,
              easing: suave,
            }),
          }}
        />
        <div style={{ display: "flex", ...entra(92) }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "22px 44px 22px 26px",
              borderRadius: 999,
              background: COR.texto,
              color: "#fff",
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            <IconeWhatsApp tamanho={64} />
            (62) 99113-2531
          </div>
        </div>
        <div
          style={{
            fontSize: 50,
            fontWeight: 300,
            color: COR.texto,
            marginTop: 44,
            ...entra(108),
          }}
        >
          Solicite seu{" "}
          <span
            style={{
              color: COR.laranja,
              fontWeight: 500,
              position: "relative",
            }}
          >
            orçamento
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: -6,
                height: 4,
                borderRadius: 2,
                background: COR.laranja,
                width: `${interpolate(frame, [125, 155], [0, 100], { ...clamp, easing: suave })}%`,
              }}
            />
          </span>
          .
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 70,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 32,
          fontStyle: "italic",
          color: COR.textoSuave,
          ...entra(140, 16),
        }}
      >
        “Juliano Pinturas. Qualidade e soluções para transformar seus espaços.”
      </div>
    </AbsoluteFill>
  );
};
