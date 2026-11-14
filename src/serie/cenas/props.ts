import type { Marcas } from "../sincronia";
import type { Negocio, Numeros } from "../tipos";

/**
 * `entra`: frame da cena em que a ponte de entrada termina (o elemento-ponte "vira" o desta cena).
 * `sai`: frame da cena em que a ponte de saída começa (o elemento desta cena "vira" a ponte).
 */
export type CenaProps = { n: Negocio; k: Numeros; dur: number; ponte: { entra: number; sai: number }; marcas: Marcas };

/** Lê uma marca numérica de tempo (frame da cena), com valor padrão. */
export const marca = (m: Marcas, nome: string, padrao: number) => (typeof m[nome] === "number" ? (m[nome] as number) : padrao);

/** Marca um trecho como destaque do texto cinético, sem deixar quebrar linha no meio. */
export const destaca = (s: string) => `*${s.replace(/ /g, " ")}*`;
