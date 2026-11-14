import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COR, camera, clamp, suave } from "./tema";
import { Destaque, TextoCena } from "./Texto";

const L = 820; // largura da parede
const A = 700; // altura da parede
const X = 980; // posição da parede na tela
const Y = 190;

/** Cena 01 — uma linha laranja nasce e revela uma superfície sendo transformada. */
export const Cena01Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const linha = interpolate(frame, [6, 72], [0, L], {
    ...clamp,
    easing: camera,
  });
  const abertura = interpolate(frame, [74, 140], [0, A / 2], {
    ...clamp,
    easing: suave,
  });
  const zoom = interpolate(frame, [0, 96], [2.2, 1], {
    ...clamp,
    easing: camera,
  });
  const paredeVisivel = interpolate(frame, [40, 85], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${X + linha}px ${Y + A / 2}px`,
          scale: zoom,
        }}
      >
        <svg
          width={L}
          height={A}
          style={{
            position: "absolute",
            left: X,
            top: Y,
            overflow: "visible",
            filter: `drop-shadow(0 40px 60px rgba(0,0,0,${0.14 * paredeVisivel}))`,
          }}
        >
          <defs>
            <clipPath id="c1-tinta">
              <rect
                x={0}
                y={A / 2 - abertura}
                width={L}
                height={abertura * 2}
              />
            </clipPath>
            <linearGradient id="c1-luz" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g opacity={paredeVisivel}>
            <rect width={L} height={A} fill={COR.paredeVelha} />
            {/* manchas e rachaduras */}
            <circle cx={160} cy={140} r={90} fill="#A79F93" opacity={0.35} />
            <circle cx={620} cy={560} r={130} fill="#A79F93" opacity={0.3} />
            <path
              d="M560 0 L540 80 L575 140 L530 230 M575 140 L630 180"
              stroke="#8E877C"
              strokeWidth={3}
              fill="none"
            />
            <path
              d="M90 700 L120 610 L95 540 L140 470"
              stroke="#8E877C"
              strokeWidth={3}
              fill="none"
            />
          </g>
          <g clipPath="url(#c1-tinta)">
            <rect width={L} height={A} fill={COR.paredeNova} />
            <rect width={L} height={A} fill="url(#c1-luz)" opacity={0.6} />
          </g>
          <rect
            x={0}
            y={A / 2 - abertura - 2}
            width={linha}
            height={4}
            rx={2}
            fill={COR.laranja}
          />
          <rect
            x={0}
            y={A / 2 + abertura - 2}
            width={linha}
            height={4}
            rx={2}
            fill={COR.laranja}
            opacity={abertura > 0 ? 1 : 0}
          />
        </svg>
      </AbsoluteFill>
      <TextoCena
        inicio={62}
        linhas={[
          "Todo espaço",
          <>
            tem <Destaque>potencial</Destaque>.
          </>,
        ]}
        locucao="Todo espaço pode se transformar."
      />
    </AbsoluteFill>
  );
};
