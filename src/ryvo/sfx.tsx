import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS } from "./theme";
import { FINAL, HEAD, SYNC } from "./sync";

/**
 * Efeitos sonoros (pasta do Drive do Kayke, copiados em public/sfx/).
 * Cada efeito é posicionado pelo início do plano + o tempo do evento dentro dele.
 */
type ShotTiming = { id: string; from: number; frames: number; inDir: string };
type Fx = {
  file: string;
  at: number; // s, posição no vídeo
  vol: number;
  trim?: number; // s cortados do início do arquivo
  dur?: number; // s tocados (default: o arquivo todo)
  fadeOut?: number; // s de fade no fim
};

const OPEN = ["01", "04", "08", "10", "11", "16", "19"];
const CLOSE = ["09", "14", "15"];

export const buildSfx = (shots: ShotTiming[]): Fx[] => {
  const st = (id: string) => (shots.find((s) => s.id === id)?.from ?? 0) / FPS;
  const fx: Fx[] = [];

  // abertura: riser crescendo enquanto a espiral se revela
  fx.push({ file: "riser.wav", at: 0, trim: 0.3, vol: 0.33 });

  // um "whoosh" em cada corte (whip pan / zoom), com o pico no corte
  let o = 0;
  let c = 0;
  shots.forEach((s, i) => {
    if (i === 0) return;
    const cut = s.from / FPS;
    if (s.inDir === "zoom") {
      fx.push({ file: `whip-close-${CLOSE[c++ % CLOSE.length]}.mp3`, at: cut - 0.12, vol: 0.5 });
    } else {
      fx.push({ file: `whip-open-${OPEN[o++ % OPEN.length]}.mp3`, at: cut - 0.17, vol: 0.45 });
    }
  });

  // R de vidro chegando ("Ela precisa ser lembrada" e "RYVO")
  fx.push({ file: "glass.mp3", at: st("s03") + 0.05, vol: 0.55 });
  fx.push({ file: "glass.mp3", at: st("s14") + 0.05, vol: 0.5 });
  // título "merece mais."
  fx.push({ file: "pluck.mp3", at: st("s04") + HEAD.bold, vol: 0.35 });
  // lâmpada vira play em "movimento"
  fx.push({ file: "flip.mp3", at: st("s05") + SYNC["Transformamos *ideias* em *movimento,*"][3] - 0.2, vol: 0.5 });
  // interface de edição entrando
  fx.push({ file: "digital.mp3", at: st("s06") + 0.05, trim: 0.5, vol: 0.35 });
  // ícones orbitando
  fx.push({ file: "interaction.mp3", at: st("s07") + 0.25, dur: 0.5, vol: 0.28 });
  // cores da paleta aparecendo (5 pops)
  for (let i = 0; i < 5; i++) fx.push({ file: "pop.mp3", at: st("s08") + (22 + i * 4) / FPS, vol: 0.35 });
  // notificações chegando (3)
  for (let i = 0; i < 3; i++) fx.push({ file: "notif.mp3", at: st("s09") + (18 + i * 9) / FPS, vol: 0.5 });
  // contador subindo + confirmação
  fx.push({ file: "loading.mp3", at: st("s10") + 12 / FPS, trim: 0.24, dur: 1.5, fadeOut: 0.3, vol: 0.3 });
  fx.push({ file: "positive.mp3", at: st("s10") + 55 / FPS, dur: 0.3, vol: 0.4 });
  // mergulho na tela do celular: riser com pico no corte
  fx.push({ file: "riser.wav", at: st("s12") - 1.85, trim: 0.3, vol: 0.28 });
  // cartaz e cartões voando
  fx.push({ file: "swish.mp3", at: st("s12") + 0.3, vol: 0.4 });
  // cartão girando
  fx.push({ file: "flip2.mp3", at: st("s13") + 0.1, vol: 0.4 });
  // final: botão, clique do cursor, sucesso, contatos
  const s15 = st("s15");
  fx.push({ file: "notif-soft.mp3", at: s15 + FINAL.button - 0.05, vol: 0.4 });
  fx.push({ file: "click.mp3", at: s15 + FINAL.click - 0.04, vol: 0.55 });
  fx.push({ file: "success.mp3", at: s15 + FINAL.click + 0.08, dur: 0.75, fadeOut: 0.2, vol: 0.45 });
  fx.push({ file: "notif.mp3", at: s15 + FINAL.pill, vol: 0.35 });
  return fx;
};

export const SoundFx: React.FC<{ shots: ShotTiming[] }> = ({ shots }) => (
  <>
    {buildSfx(shots).map((f, i) => {
      const from = Math.max(0, Math.round(f.at * FPS));
      const trimF = Math.round((f.trim ?? 0) * FPS) + Math.max(0, -Math.round(f.at * FPS));
      const len = f.dur ? Math.round(f.dur * FPS) : undefined;
      const fade = f.fadeOut ? Math.round(f.fadeOut * FPS) : 0;
      return (
        <Sequence key={i} from={from} durationInFrames={len} name={`sfx ${f.file}`}>
          <Audio
            src={staticFile(`sfx/${f.file}`)}
            trimBefore={trimF || undefined}
            volume={(fr) => (len && fade ? f.vol * interpolate(fr, [len - fade, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : f.vol)}
          />
        </Sequence>
      );
    })}
  </>
);
