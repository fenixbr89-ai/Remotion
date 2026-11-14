import { useCurrentFrame, useVideoConfig } from "remotion";
import { cor, entra, flutua, suave } from "../tema";

type Tipo = "anel" | "ponto" | "mais" | "quadrado" | "brilho" | "zigue" | "meia";
const TIPOS: Tipo[] = ["anel", "mais", "ponto", "brilho", "quadrado", "zigue", "meia"];
const CORES = [cor.azul, cor.azulCeu, cor.azulProfundo, cor.azulClaro];

/** Gerador pseudoaleatório determinístico (mesmo resultado em todo render). */
const rnd = (s: number) => {
  const x = Math.sin(s * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const Desenho: React.FC<{ tipo: Tipo; tam: number; c: string; f: number }> = ({ tipo, tam, c, f }) => {
  switch (tipo) {
    case "anel":
      return <div style={{ width: tam, height: tam, borderRadius: "50%", border: `${tam * 0.12}px solid ${c}` }} />;
    case "ponto":
      return <div style={{ width: tam * 0.5, height: tam * 0.5, borderRadius: "50%", background: c }} />;
    case "quadrado":
      return <div style={{ width: tam * 0.7, height: tam * 0.7, borderRadius: tam * 0.2, background: c, rotate: `${f * 3}deg` }} />;
    case "mais":
      return (
        <svg width={tam} height={tam} viewBox="0 0 24 24" style={{ rotate: `${f * 4}deg` }}>
          <path d="M12 3v18M3 12h18" stroke={c} strokeWidth={4.5} strokeLinecap="round" />
        </svg>
      );
    case "brilho":
      return (
        <svg width={tam} height={tam} viewBox="0 0 24 24" style={{ scale: `${1 + Math.sin(f / 5) * 0.2}` }}>
          <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" fill={c} />
        </svg>
      );
    case "zigue":
      return (
        <svg width={tam * 1.6} height={tam * 0.6} viewBox="0 0 64 24">
          <path d="M2 18L14 6l12 12 12-12 12 12 12-12" stroke={c} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={120} strokeDashoffset={120 - Math.min(120, f * 8)} />
        </svg>
      );
    case "meia":
      return <div style={{ width: tam, height: tam / 2, borderRadius: `${tam}px ${tam}px 0 0`, background: c, rotate: `${Math.sin(f / 10) * 25}deg` }} />;
  }
};

/**
 * Formas decorativas que aparecem (esticando), giram/flutuam e somem encolhendo no fim da cena.
 * Ficam nas bordas para não brigar com o conteúdo.
 */
export const Formas: React.FC<{ semente: number; dur: number; qtd?: number }> = ({ semente, dur, qtd = 6 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {Array.from({ length: qtd }).map((_, j) => {
        const s = semente * 17 + j * 7;
        const esq = j % 2 === 0;
        const x = esq ? 30 + rnd(s) * 120 : 900 + rnd(s) * 120;
        const y = 400 + ((j + rnd(s + 1)) / qtd) * 1250;
        const tipo = TIPOS[Math.floor(rnd(s + 2) * TIPOS.length)];
        const tam = 34 + rnd(s + 3) * 46;
        const c = CORES[Math.floor(rnd(s + 4) * CORES.length)];
        const t = 3 + j * 3;
        const e = entra(f, fps, t, 7);
        const firme = entra(f, fps, t, 30);
        const w = (e - firme) * 1.2;
        const saida = 1 - suave(f, dur - 10 + (j % 3), dur - 2);
        const lado = esq ? -1 : 1;
        return (
          <div
            key={j}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: `${(1 - saida) * lado * 120 + flutua(f, j, 6)}px ${flutua(f, j + 2, 14)}px`,
              scale: `${e * saida * (1 - w * 0.4)} ${e * saida * (1 + w * 0.4)}`,
              opacity: 0.85,
            }}
          >
            <Desenho tipo={tipo} tam={tam} c={c} f={f - t} />
          </div>
        );
      })}
    </>
  );
};
