import type { Word } from "./Legendas";
import type { Overlay } from "./Overlays";
import type { ShapeSpec } from "./shapes";
import { FPS } from "./theme";

/** Cena: entra exatamente na palavra `cue` (n-ésima ocorrência após a cena anterior). */
export type Scene = {
  cue: string;
  /** pula ocorrências da cue após a cena anterior (0 = primeira) */
  skip?: number;
  /** ajuste fino em segundos (negativo = antes da palavra) */
  offset?: number;
  shape: ShapeSpec;
  /** cor do tema desta cena (padrão: tema do vídeo) */
  theme?: string;
  overlays?: Overlay[];
  /** câmera: zoom lento sempre; deslocamento opcional */
  pan?: "left" | "right" | "up" | "down";
};

export type VideoDef = {
  audio?: string; // caminho em public/
  words: Word[];
  theme: string;
  scenes: Scene[];
  durationInFrames: number;
  count?: number;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Converte cue words em frames de início. Lança erro se não achar a palavra. */
export const resolveScenes = (scenes: Scene[], words: Word[]) => {
  let cursor = 0;
  return scenes.map((s, i) => {
    if (i === 0 && s.cue === "") return { ...s, from: 0 };
    const target = s.cue.split(" ").map(norm);
    let skip = s.skip ?? 0;
    let found = -1;
    for (let w = cursor; w < words.length; w++) {
      if (target.every((t, k) => norm(words[w + k]?.palavra ?? "") === t)) {
        if (skip-- === 0) {
          found = w;
          break;
        }
      }
    }
    if (found < 0) throw new Error(`Cue "${s.cue}" (cena ${i}) não encontrada após a palavra ${cursor}`);
    cursor = found + 1;
    const from = i === 0 ? 0 : Math.max(0, Math.round((words[found].inicio + (s.offset ?? 0)) * FPS));
    return { ...s, from };
  });
};


/** Duração = áudio + 1,5 s. */
export const durationFor = (audioSeconds: number) => Math.ceil((audioSeconds + 1.5) * FPS);
