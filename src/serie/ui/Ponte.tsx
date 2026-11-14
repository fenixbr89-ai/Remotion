import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import type { Ret } from "../geo";
import { degrade } from "../tema";

export type Chave = { t: number; ret: Ret; cor: string; degrade?: boolean; giro?: number };
export type PonteDef = { chaves: Chave[]; conteudo?: (ret: Ret, progresso: number) => React.ReactNode };

const ease = Easing.bezier(0.65, 0, 0.35, 1);

/**
 * Elemento-ponte: um objeto que sai de uma cena e vira outro na cena seguinte,
 * esticando, girando, crescendo ou encolhendo entre os quadros-chave. `corte` = frame global da troca de cena.
 */
export const Ponte: React.FC<{ def: PonteDef; corte: number }> = ({ def, corte }) => {
  const f = useCurrentFrame() - corte;
  const { chaves } = def;
  if (f < chaves[0].t || f > chaves[chaves.length - 1].t) return null;
  const ts = chaves.map((c) => c.t);
  const op = { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const num = (sel: (c: Chave) => number) => interpolate(f, ts, chaves.map(sel), op);
  const ret: Ret = { x: num((c) => c.ret.x), y: num((c) => c.ret.y), w: num((c) => c.ret.w), h: num((c) => c.ret.h), r: num((c) => c.ret.r) };
  const giro = num((c) => c.giro ?? 0);
  const fundo = interpolateColors(f, ts, chaves.map((c) => c.cor));
  const grad = num((c) => (c.degrade ? 1 : 0));
  const progresso = (f - ts[0]) / (ts[ts.length - 1] - ts[0]);
  return (
    <div style={{ position: "absolute", left: ret.x, top: ret.y, width: ret.w, height: ret.h, borderRadius: ret.r, rotate: `${giro}deg`, overflow: def.conteudo ? "visible" : "hidden", background: def.conteudo ? "transparent" : fundo }}>
      {!def.conteudo && grad > 0 && <div style={{ position: "absolute", inset: 0, background: degrade, opacity: grad }} />}
      {def.conteudo?.(ret, progresso)}
    </div>
  );
};
