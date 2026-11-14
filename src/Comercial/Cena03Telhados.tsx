import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COR, SANS, camera, clamp, suave } from "./tema";
import { Destaque, TextoCena } from "./Texto";

const OX = 940; // origem do desenho na tela
const OY = 150;

const traco = (frame: number, a: number, b: number) =>
  1 - interpolate(frame, [a, b], [0, 1], { ...clamp, easing: camera });

const telhas = (() => {
  const linhas: string[] = [];
  for (let y = 190; y <= 390; y += 34) {
    let d = `M100 ${y}`;
    for (let x = 100; x < 800; x += 40) d += ` a20 20 0 0 0 40 0`;
    linhas.push(d);
  }
  return linhas;
})();

const Etiqueta: React.FC<{
  readonly texto: string;
  readonly x: number;
  readonly y: number;
  readonly de: number;
  readonly ate: number;
}> = ({ texto, x, y, de, ate }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "14px 28px",
        borderRadius: 999,
        background: "#fff",
        border: `2px solid ${COR.laranja}`,
        color: COR.texto,
        fontFamily: SANS,
        fontSize: 30,
        fontWeight: 500,
        boxShadow: "0 18px 40px rgba(0,0,0,0.10)",
        opacity: interpolate(
          frame,
          [de, de + 12, ate - 12, ate],
          [0, 1, 1, 0],
          clamp,
        ),
        translate: interpolate(frame, [de, de + 24], ["0px 18px", "0px 0px"], {
          ...clamp,
          easing: suave,
        }),
      }}
    >
      {texto}
    </div>
  );
};

/** Cena 03 — telhado, calhas e pós-obra em traço minimalista. */
export const Cena03Telhados: React.FC = () => {
  const frame = useCurrentFrame();

  // câmera: plano geral -> close na calha -> plano geral
  const zoom = interpolate(frame, [100, 135, 180, 212], [1, 1.9, 1.9, 1], {
    ...clamp,
    easing: camera,
  });
  const agua = interpolate(frame, [110, 125, 190, 200], [0, 1, 1, 0], clamp);
  const sol = interpolate(frame, [10, 70], [0, 1], clamp);
  const janelaAcesa = interpolate(frame, [205, 230], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      <div
        style={{
          position: "absolute",
          left: 900,
          top: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <AbsoluteFill
          style={{
            left: -900,
            width: 1920,
            transformOrigin: `${OX + 770}px ${OY + 410}px`,
            scale: zoom,
          }}
        >
          <svg
            width={900}
            height={820}
            viewBox="0 0 900 820"
            style={{
              position: "absolute",
              left: OX,
              top: OY,
              overflow: "visible",
            }}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <radialGradient id="c3-sol">
                <stop
                  offset="0"
                  stopColor={COR.laranjaClaro}
                  stopOpacity="0.55"
                />
                <stop offset="1" stopColor={COR.laranjaClaro} stopOpacity="0" />
              </radialGradient>
              <clipPath id="c3-telhado">
                <polygon points="120,400 450,150 780,400" />
              </clipPath>
            </defs>
            <circle
              cx={720}
              cy={120}
              r={interpolate(frame, [10, 90], [150, 260], clamp)}
              fill="url(#c3-sol)"
              opacity={sol}
            />
            {/* chão */}
            <path
              d="M20 720 H880"
              stroke={COR.linha}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={traco(frame, 0, 30)}
            />
            {/* paredes */}
            <path
              d="M180 400 V720 H720 V400"
              stroke={COR.texto}
              strokeWidth={5}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={traco(frame, 8, 50)}
            />
            {/* telhado */}
            <g clipPath="url(#c3-telhado)">
              {telhas.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke={COR.laranja}
                  strokeWidth={3}
                  opacity={interpolate(
                    frame,
                    [45 + i * 6, 60 + i * 6],
                    [0, 0.9],
                    clamp,
                  )}
                />
              ))}
            </g>
            <path
              d="M120 400 L450 150 L780 400"
              stroke={COR.texto}
              strokeWidth={6}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={traco(frame, 20, 60)}
            />
            {/* porta e janelas */}
            <path
              d="M405 720 V580 H495 V720"
              stroke={COR.texto}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={traco(frame, 40, 70)}
            />
            {[230, 570].map((x) => (
              <g key={x}>
                <rect
                  x={x}
                  y={480}
                  width={100}
                  height={90}
                  fill={COR.laranjaClaro}
                  opacity={0.45 * janelaAcesa}
                />
                <path
                  d={`M${x} 480 h100 v90 h-100z M${x + 50} 480 v90 M${x} 525 h100`}
                  stroke={COR.texto}
                  strokeWidth={4}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={traco(frame, 50, 80)}
                />
              </g>
            ))}
            {/* calha e condutor */}
            <path
              d="M110 410 H790 M770 412 V690 Q770 708 792 712"
              stroke="#8D8D8D"
              strokeWidth={12}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={traco(frame, 70, 105)}
            />
            <path
              d="M120 410 H770"
              stroke={COR.agua}
              strokeWidth={5}
              strokeDasharray="14 18"
              strokeDashoffset={-frame * 4}
              opacity={agua}
            />
            {[0, 1, 2].map((i) => {
              const ciclo = ((frame - 110 + i * 9) % 27) / 27;
              return (
                <circle
                  key={i}
                  cx={800 + ciclo * 14}
                  cy={714 + ciclo * ciclo * 60}
                  r={6}
                  fill={COR.agua}
                  opacity={agua * (1 - ciclo)}
                />
              );
            })}
            {/* brilhos de pós-obra */}
            {[
              [140, 300],
              [820, 520],
              [450, 90],
              [300, 650],
              [620, 640],
            ].map(([x, y], i) => {
              const p = interpolate(
                frame,
                [205 + i * 6, 225 + i * 6, 255],
                [0, 1, 0.6],
                clamp,
              );
              return (
                <path
                  key={i}
                  transform={`translate(${x} ${y}) scale(${p})`}
                  d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6Z"
                  fill={COR.laranja}
                  opacity={p}
                />
              );
            })}
          </svg>
        </AbsoluteFill>
      </div>
      <Etiqueta texto="Telhados" x={OX + 330} y={OY + 40} de={55} ate={102} />
      <Etiqueta texto="Calhas" x={1460} y={210} de={128} ate={186} />
      <Etiqueta
        texto="Pequenas reformas · Pós-obra"
        x={OX + 160}
        y={OY + 752}
        de={208}
        ate={300}
      />
      <TextoCena
        rotulo="Telhados, calhas e reformas"
        inicio={20}
        linhas={[
          "Cuidado em",
          <>
            cada <Destaque>detalhe</Destaque>.
          </>,
        ]}
        locucao="Do telhado às calhas, das pequenas reformas aos serviços de pós-obra."
      />
    </AbsoluteFill>
  );
};
