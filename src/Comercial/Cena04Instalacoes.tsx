import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COR, SANS, camera, clamp, suave } from "./tema";
import { Destaque, TextoCena } from "./Texto";

const desenha = (f: number, a: number, b: number) =>
  1 - interpolate(f, [a, b], [0, 1], { ...clamp, easing: camera });

const Hidraulica: React.FC<{ readonly f: number }> = ({ f }) => {
  const cano = "M40 70 H220 Q250 70 250 100 V190 H350 V222";
  const gota = ((f - 55) % 30) / 30;
  return (
    <>
      <path
        d={cano}
        stroke={COR.texto}
        strokeWidth={16}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={desenha(f, 0, 40)}
      />
      <path
        d={cano}
        stroke={COR.agua}
        strokeWidth={6}
        strokeDasharray="10 14"
        strokeDashoffset={-f * 2.5}
        opacity={interpolate(f, [45, 55], [0, 1], clamp)}
      />
      <g
        transform={`translate(250 135) rotate(${interpolate(f, [36, 52], [0, 90], { ...clamp, easing: suave })})`}
        opacity={interpolate(f, [30, 36], [0, 1], clamp)}
      >
        <circle r={20} fill={COR.laranja} />
        <rect x={-6} y={-46} width={12} height={40} rx={6} fill={COR.laranja} />
      </g>
      {f > 55 ? (
        <path
          transform={`translate(350 ${236 + gota * 40})`}
          d="M0 -12 Q-9 2 0 8 Q9 2 0 -12z"
          fill={COR.agua}
          opacity={1 - gota}
        />
      ) : null}
    </>
  );
};

const Eletrica: React.FC<{ readonly f: number }> = ({ f }) => {
  const fio = "M70 200 C 140 200 150 80 230 80 S 310 90 310 120";
  const acesa = interpolate(f, [42, 52], [0, 1], clamp);
  return (
    <>
      <rect
        x={40}
        y={165}
        width={60}
        height={80}
        rx={10}
        stroke={COR.texto}
        strokeWidth={5}
      />
      <line
        x1={70}
        y1={205}
        x2={70}
        y2={185}
        stroke={COR.laranja}
        strokeWidth={8}
        transform={`rotate(${interpolate(f, [34, 42], [-35, 35], clamp)} 70 205)`}
      />
      <path
        d={fio}
        stroke={COR.texto}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={desenha(f, 0, 34)}
      />
      <path
        d={fio}
        stroke={COR.laranja}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray="0.08 0.92"
        strokeDashoffset={-((f - 42) / 24)}
        opacity={acesa}
      />
      <circle
        cx={310}
        cy={168}
        r={56}
        fill={COR.laranjaClaro}
        opacity={0.3 * acesa}
      />
      <circle
        cx={310}
        cy={168}
        r={38}
        fill={COR.laranja}
        opacity={acesa}
        stroke={COR.texto}
        strokeWidth={5}
      />
      <circle cx={310} cy={168} r={38} stroke={COR.texto} strokeWidth={5} />
      <rect x={294} y={120} width={32} height={14} rx={3} fill={COR.texto} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const r1 = 54;
        const r2 =
          54 +
          22 * interpolate(f, [46, 60], [0, 1], { ...clamp, easing: suave });
        return (
          <line
            key={i}
            x1={310 + Math.cos(a) * r1}
            y1={168 + Math.sin(a) * r1}
            x2={310 + Math.cos(a) * r2}
            y2={168 + Math.sin(a) * r2}
            stroke={COR.laranja}
            strokeWidth={5}
            opacity={acesa}
          />
        );
      })}
    </>
  );
};

const CaixaDagua: React.FC<{ readonly f: number }> = ({ f }) => {
  const nivel = interpolate(f, [20, 100], [0, 0.82], {
    ...clamp,
    easing: camera,
  });
  const topo = 250 - nivel * 170;
  let onda = `M110 ${topo}`;
  for (let x = 110; x <= 300; x += 10)
    onda += ` L${x} ${topo + Math.sin(x / 18 + f / 5) * 5}`;
  onda += " L300 260 L110 260 Z";
  return (
    <>
      <defs>
        <clipPath id="c4-tanque">
          <path d="M110 70 V245 a95 22 0 0 0 190 0 V70z" />
        </clipPath>
      </defs>
      <g clipPath="url(#c4-tanque)">
        <path d={onda} fill={COR.agua} opacity={0.75} />
      </g>
      <ellipse
        cx={205}
        cy={70}
        rx={95}
        ry={22}
        stroke={COR.texto}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={desenha(f, 0, 25)}
      />
      <path
        d="M110 70 V245 a95 22 0 0 0 190 0 V70"
        stroke={COR.texto}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={desenha(f, 5, 35)}
      />
      <path
        d="M30 30 H170 V48"
        stroke={COR.laranja}
        strokeWidth={10}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={desenha(f, 10, 30)}
      />
      {[300, 255, 210, 165, 120].map((y, i) => (
        <line
          key={y}
          x1={330}
          x2={nivel * 5 >= i + 0.5 ? 362 : 348}
          y1={y - 30}
          y2={y - 30}
          stroke={nivel * 5 >= i + 0.5 ? COR.laranja : COR.linha}
          strokeWidth={6}
          strokeLinecap="round"
        />
      ))}
    </>
  );
};

const Manutencao: React.FC<{ readonly f: number }> = ({ f }) => {
  const giro = interpolate(
    f,
    [20, 40, 50, 70, 80, 100],
    [0, 70, 0, 70, 0, 70],
    {
      ...clamp,
      easing: camera,
    },
  );
  const ok = interpolate(f, [100, 120], [0, 1], { ...clamp, easing: suave });
  return (
    <>
      <g transform={`translate(110 90) rotate(${f * 1.2})`} opacity={0.18}>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={-10}
            y={-62}
            width={20}
            height={24}
            rx={4}
            fill={COR.texto}
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r={44} stroke={COR.texto} strokeWidth={16} />
      </g>
      <g transform={`translate(205 150) rotate(${giro})`}>
        <rect x={20} y={-16} width={190} height={32} rx={16} fill={COR.texto} />
        <circle r={46} fill={COR.texto} />
        <rect x={-62} y={-20} width={50} height={40} fill="#fff" />
      </g>
      <polygon
        points="205,122 229,136 229,164 205,178 181,164 181,136"
        fill={COR.laranja}
        transform={`rotate(${giro} 205 150)`}
      />
      <path
        d="M140 250 l26 24 l52 -52"
        stroke={COR.laranja}
        strokeWidth={10}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - ok}
      />
    </>
  );
};

const CARTOES = [
  { titulo: "Hidráulica", Desenho: Hidraulica },
  { titulo: "Elétrica", Desenho: Eletrica },
  { titulo: "Caixa d’água", Desenho: CaixaDagua },
  { titulo: "Manutenção", Desenho: Manutencao },
];

/** Cena 04 — instalações em animações minimalistas. */
export const Cena04Instalacoes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      {CARTOES.map(({ titulo, Desenho }, i) => {
        const inicio = 25 + i * 32;
        const f = frame - inicio;
        const col = i % 2;
        const lin = Math.floor(i / 2);
        return (
          <div
            key={titulo}
            style={{
              position: "absolute",
              left: 960 + col * 440,
              top: 110 + lin * 440,
              width: 410,
              height: 410,
              borderRadius: 32,
              background: "#fff",
              border: `1px solid ${COR.linha}`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.07)",
              opacity: interpolate(f, [0, 18], [0, 1], clamp),
              translate: interpolate(f, [0, 30], ["0px 40px", "0px 0px"], {
                ...clamp,
                easing: suave,
              }),
            }}
          >
            <svg
              width={410}
              height={300}
              viewBox="0 0 410 300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginTop: 18 }}
            >
              <Desenho f={f} />
            </svg>
            <div
              style={{
                position: "absolute",
                left: 36,
                bottom: 30,
                fontFamily: SANS,
                fontSize: 34,
                fontWeight: 500,
                color: COR.texto,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: COR.laranja,
                }}
              />
              {titulo}
            </div>
          </div>
        );
      })}
      <TextoCena
        rotulo="Instalações e manutenção"
        inicio={20}
        linhas={[
          "Soluções para",
          <>
            o seu <Destaque>dia a dia</Destaque>.
          </>,
        ]}
        locucao="Também realizamos instalações elétricas, hidráulicas, caixas d’água e serviços de manutenção."
      />
    </AbsoluteFill>
  );
};
