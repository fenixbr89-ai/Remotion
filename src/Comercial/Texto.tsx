import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COR, SANS, clamp, suave } from "./tema";

type Props = {
  readonly rotulo?: string;
  readonly linhas: React.ReactNode[];
  readonly locucao: string;
  readonly inicio?: number;
  readonly largura?: number;
};

export const Destaque: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => <span style={{ color: COR.laranja, fontWeight: 500 }}>{children}</span>;

/** Coluna de texto à esquerda: rótulo, título, filete laranja e locução. */
export const TextoCena: React.FC<Props> = ({
  rotulo,
  linhas,
  locucao,
  inicio = 15,
  largura = 720,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 0,
        bottom: 0,
        width: largura,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: SANS,
        color: COR.texto,
      }}
    >
      {rotulo ? (
        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: COR.laranja,
            marginBottom: 36,
            opacity: interpolate(frame, [inicio, inicio + 20], [0, 1], clamp),
            translate: interpolate(
              frame,
              [inicio, inicio + 30],
              ["0px 16px", "0px 0px"],
              { ...clamp, easing: suave },
            ),
          }}
        >
          {rotulo}
        </div>
      ) : null}
      {linhas.map((linha, i) => (
        <div key={i} style={{ overflow: "hidden", paddingBottom: 6 }}>
          <div
            style={{
              fontSize: 86,
              fontWeight: 300,
              lineHeight: 1.12,
              letterSpacing: -2,
              whiteSpace: "nowrap",
              translate: interpolate(
                frame,
                [inicio + 6 + i * 7, inicio + 40 + i * 7],
                ["0px 110%", "0px 0%"],
                { ...clamp, easing: suave },
              ),
            }}
          >
            {linha}
          </div>
        </div>
      ))}
      <div
        style={{
          height: 4,
          marginTop: 40,
          marginBottom: 36,
          backgroundColor: COR.laranja,
          borderRadius: 2,
          width: interpolate(frame, [inicio + 24, inicio + 60], [0, 120], {
            ...clamp,
            easing: suave,
          }),
        }}
      />
      <div
        style={{
          fontSize: 36,
          lineHeight: 1.5,
          fontWeight: 400,
          color: COR.textoSuave,
          maxWidth: 640,
          opacity: interpolate(
            frame,
            [inicio + 32, inicio + 60],
            [0, 1],
            clamp,
          ),
          translate: interpolate(
            frame,
            [inicio + 32, inicio + 70],
            ["0px 20px", "0px 0px"],
            { ...clamp, easing: suave },
          ),
        }}
      >
        “{locucao}”
      </div>
    </div>
  );
};
