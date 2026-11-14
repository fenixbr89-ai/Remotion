import type { Negocio, Numeros } from "../tipos";
export type CenaProps = { n: Negocio; k: Numeros; dur: number };

/** Marca um trecho como destaque do texto cinético, sem deixar quebrar linha no meio. */
export const destaca = (s: string) => `*${s.replace(/ /g, " ")}*`;
