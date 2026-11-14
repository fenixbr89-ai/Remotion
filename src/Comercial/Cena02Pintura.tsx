import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COR, camera, clamp } from "./tema";
import { Destaque, TextoCena } from "./Texto";

const LARG = 1020;
const ALT = 1080;
const FAIXA = 340;
const PASSADAS = [0, 1, 2].map((i) => ({ x: i * FAIXA, inicio: 16 + i * 50 }));

const Rolo: React.FC<{ readonly x: number; readonly y: number }> = ({
  x,
  y,
}) => (
  <g transform={`translate(${x} ${y})`}>
    {/* cabo */}
    <path
      d="M150 0 H182 V120 L0 170 V300"
      stroke="#1B1B1B"
      strokeWidth={14}
      fill="none"
      strokeLinejoin="round"
    />
    <rect x={-22} y={290} width={44} height={170} rx={22} fill={COR.laranja} />
    <rect
      x={-22}
      y={290}
      width={14}
      height={170}
      rx={7}
      fill="#fff"
      opacity={0.25}
    />
    {/* cilindro */}
    <rect x={-160} y={-48} width={320} height={96} rx={48} fill={COR.laranja} />
    <rect
      x={-150}
      y={-38}
      width={300}
      height={22}
      rx={11}
      fill="#fff"
      opacity={0.28}
    />
    {Array.from({ length: 14 }).map((_, i) => (
      <line
        key={i}
        x1={-140 + i * 21}
        x2={-140 + i * 21}
        y1={-30}
        y2={34}
        stroke="#C9500F"
        strokeWidth={3}
        opacity={0.35}
      />
    ))}
  </g>
);

/** Cena 02 — close de um rolo pintando a parede em três passadas. */
export const Cena02Pintura: React.FC = () => {
  const frame = useCurrentFrame();

  const brilho = interpolate(frame, [175, 235], [-400, LARG + 400], {
    ...clamp,
    easing: camera,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      <svg
        width={LARG}
        height={ALT}
        style={{
          position: "absolute",
          left: 900,
          top: 0,
          scale: interpolate(frame, [0, 240], [1.14, 1], clamp),
          translate: interpolate(
            frame,
            [0, 240],
            ["40px 0px", "0px 0px"],
            clamp,
          ),
        }}
      >
        <defs>
          <linearGradient id="c2-brilho" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="c2-molhado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={LARG} height={ALT} fill={COR.paredeVelha} />
        <circle cx={300} cy={260} r={160} fill="#A79F93" opacity={0.3} />
        <circle cx={820} cy={760} r={210} fill="#A79F93" opacity={0.25} />
        <path
          d="M700 0 L670 120 L720 210 L660 330 M720 210 L790 260"
          stroke="#8E877C"
          strokeWidth={4}
          fill="none"
        />
        {PASSADAS.map(({ x, inicio }, i) => {
          const y = interpolate(frame, [inicio, inicio + 70], [ALT + 60, -60], {
            ...clamp,
            easing: camera,
          });
          const topo = Math.max(0, Math.min(ALT, y));
          return (
            <g key={i}>
              <rect
                x={x}
                y={topo}
                width={FAIXA}
                height={ALT - topo}
                fill={COR.paredeNova}
              />
              <rect
                x={x}
                y={topo}
                width={FAIXA}
                height={Math.min(160, ALT - topo)}
                fill="url(#c2-molhado)"
              />
            </g>
          );
        })}
        <rect
          x={brilho - 200}
          y={0}
          width={400}
          height={ALT}
          fill="url(#c2-brilho)"
        />
        {PASSADAS.map(({ x, inicio }, i) => {
          const y = interpolate(frame, [inicio, inicio + 70], [ALT + 60, -60], {
            ...clamp,
            easing: camera,
          });
          const some = interpolate(
            frame,
            [inicio + 70, inicio + 95],
            [0, -520],
            {
              ...clamp,
              easing: camera,
            },
          );
          return <Rolo key={i} x={x + FAIXA / 2} y={y + some} />;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1000,
          height: ALT,
          background: `linear-gradient(90deg, ${COR.fundo} 88%, rgba(250,250,249,0))`,
        }}
      />
      <TextoCena
        rotulo="Pintura e acabamento"
        inicio={20}
        linhas={[
          "Transformamos",
          <>
            <Destaque>ambientes</Destaque>.
          </>,
        ]}
        locucao="Com pintura, reformas e acabamentos feitos para renovar cada detalhe."
      />
    </AbsoluteFill>
  );
};
