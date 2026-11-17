import { interpolate } from "remotion";

/**
 * Marmita de alumínio vista de cima, reta, em 2D plano.
 * 3 divisórias: arroz com carne, feijão tropeiro, salada (alface, tomate, cenoura).
 * `tampa`: 0 fechada → 1 aberta (sobe reta e some). `comida`: escala de cada divisória (0→1).
 * `vapor`: 0→1, o vapor sobe uma vez e some.
 */
const ALU = "#D9E0EA";
const ALU_BORDA = "#B8C3D2";
const ALU_FUNDO = "#EEF2F7";

const Arroz: React.FC = () => (
  <g>
    <rect x="34" y="34" width="282" height="352" rx="26" fill="#FBFAF5" />
    {Array.from({ length: 46 }).map((_, i) => {
      const x = 52 + ((i * 37) % 250);
      const y = 52 + ((i * 53) % 318);
      return <ellipse key={i} cx={x} cy={y} rx={7} ry={3.2} fill="#ECE7D6" transform={`rotate(${(i * 47) % 180} ${x} ${y})`} />;
    })}
    {/* carne por cima: 3 bifes acebolados com marcas de grelha */}
    {[
      [58, 150, 150, 84],
      [150, 220, 140, 78],
      [62, 262, 120, 70],
    ].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} rx={h / 2.4} fill="#8A4B2C" />
        {[0.3, 0.55, 0.8].map((p) => (
          <rect key={p} x={x + w * 0.18} y={y + h * p - 4} width={w * 0.64} height={7} rx={3.5} fill="#5E2F18" opacity={0.55} />
        ))}
        <rect x={x + 12} y={y + 8} width={w * 0.4} height={9} rx={4.5} fill="#B9744A" />
      </g>
    ))}
    {[
      [120, 200],
      [210, 250],
      [100, 300],
    ].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx={22} ry={8} fill="none" stroke="#F3E3C0" strokeWidth={5} />
    ))}
  </g>
);

const Tropeiro: React.FC = () => (
  <g>
    <rect x="344" y="34" width="222" height="166" rx="22" fill="#B98547" />
    {Array.from({ length: 70 }).map((_, i) => {
      // posições pseudoaleatórias fixas (sem padrão em diagonal)
      const r1 = Math.sin(i * 12.9898) * 43758.5453;
      const r2 = Math.sin(i * 78.233) * 12345.6789;
      const fx = r1 - Math.floor(r1);
      const fy = r2 - Math.floor(r2);
      return <circle key={i} cx={358 + fx * 196} cy={48 + fy * 140} r={i % 3 === 0 ? 4.5 : 3} fill={i % 4 === 0 ? "#7A4A22" : "#E8C27A"} />;
    })}
    {[
      [380, 80],
      [470, 70],
      [430, 140],
      [520, 150],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width={26} height={16} rx={5} fill="#9B3B2A" />
    ))}
    {[
      [410, 110],
      [500, 110],
      [370, 160],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={6} fill="#58A94A" />
    ))}
  </g>
);

const Salada: React.FC = () => (
  <g>
    <rect x="344" y="220" width="222" height="166" rx="22" fill="#CFE8B8" />
    {[
      [370, 250, 90, 60],
      [450, 240, 100, 66],
      [360, 320, 110, 58],
      [470, 320, 84, 56],
    ].map(([x, y, w, h], i) => (
      <ellipse key={i} cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={i % 2 ? "#5DAE48" : "#79C35F"} />
    ))}
    {[
      [420, 290],
      [510, 300],
    ].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={26} fill="#E5533D" />
        <circle cx={x} cy={y} r={18} fill="#F07A62" />
        {[0, 1, 2, 3].map((j) => (
          <circle key={j} cx={x + Math.cos(j * 1.57) * 9} cy={y + Math.sin(j * 1.57) * 9} r={3} fill="#FCE3A6" />
        ))}
      </g>
    ))}
    {[
      [372, 362, 70],
      [452, 368, 80],
      [520, 352, 30],
    ].map(([x, y, w], i) => (
      <rect key={i} x={x} y={y} width={w} height={12} rx={6} fill="#F28C28" />
    ))}
  </g>
);

const Vapor: React.FC<{ p: number }> = ({ p }) => (
  <g opacity={interpolate(p, [0, 0.2, 0.8, 1], [0, 0.8, 0.6, 0])} transform={`translate(0 ${-p * 90})`}>
    {[180, 300, 420].map((x, i) => (
      <path key={i} d={`M${x} 40 q 22 -30 0 -60 q -22 -30 0 -60`} stroke="#C9D6EA" strokeWidth={14} strokeLinecap="round" fill="none" transform={`translate(0 ${-i * 10})`} />
    ))}
  </g>
);

export const Marmita: React.FC<{ largura: number; tampa?: number; comida?: [number, number, number]; vapor?: number }> = ({ largura, tampa = 1, comida = [1, 1, 1], vapor = 0 }) => {
  const escala = (v: number, cx: number, cy: number) => `translate(${cx} ${cy}) scale(${v}) translate(${-cx} ${-cy})`;
  return (
    <svg width={largura} height={(largura * 560) / 600} viewBox="0 -140 600 560" style={{ overflow: "visible" }}>
      {vapor > 0 && <Vapor p={vapor} />}
      {/* bandeja */}
      <rect x="6" y="6" width="588" height="408" rx="44" fill={ALU} stroke={ALU_BORDA} strokeWidth={8} />
      <rect x="24" y="24" width="552" height="372" rx="32" fill={ALU_FUNDO} />
      <g transform={escala(comida[0], 175, 210)}>
        <Arroz />
      </g>
      <g transform={escala(comida[1], 455, 117)}>
        <Tropeiro />
      </g>
      <g transform={escala(comida[2], 455, 303)}>
        <Salada />
      </g>
      {/* divisórias */}
      <rect x="322" y="24" width="16" height="372" rx="8" fill={ALU} stroke={ALU_BORDA} strokeWidth={3} />
      <rect x="330" y="202" width="246" height="14" rx="7" fill={ALU} stroke={ALU_BORDA} strokeWidth={3} />
      {/* tampa: sobe reta e some */}
      {tampa < 1 && (
        <g transform={`translate(0 ${-tampa * 260})`} opacity={1 - tampa}>
          <rect x="0" y="0" width="600" height="420" rx="48" fill="#E7ECF3" stroke={ALU_BORDA} strokeWidth={8} />
          <rect x="40" y="40" width="520" height="340" rx="30" fill="none" stroke="#CBD5E1" strokeWidth={6} />
          <rect x="220" y="180" width="160" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={4} />
        </g>
      )}
    </svg>
  );
};
