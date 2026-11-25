import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS } from "./theme";
import { FINAL } from "./sync";

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

  // Regra do Kayke: efeito só em troca de cena (acima) e quando algo ENTRA na tela.
  // Nada de efeito enquanto a cena só está acontecendo (contador, órbita, flip, mergulho...).
  const pops = (at: number, n: number, step: number, vol = 0.35) => {
    for (let i = 0; i < n; i++) fx.push({ file: "pop.mp3", at: at + i * step, vol });
  };
  const CHIP = 0.1; // intervalo entre as etiquetas (Chips)

  // R de vidro entrando ("Ela precisa ser lembrada" e "RYVO")
  fx.push({ file: "glass.mp3", at: st("s03") + 0.05, vol: 0.5 });
  fx.push({ file: "glass.mp3", at: st("s14") + 0.05, vol: 0.45 });
  // interface de edição entrando
  fx.push({ file: "swish.mp3", at: st("s06") + 0.1, vol: 0.35 });
  // etiquetas Vídeos • Animações • Publicidade
  pops(st("s07") + 0.9, 3, CHIP);
  // cores da paleta aparecendo (5 pops — o que ele gostou)
  pops(st("s08") + 22 / FPS, 5, 4 / FPS);
  // notificações chegando (3)
  for (let i = 0; i < 3; i++) fx.push({ file: "notif.mp3", at: st("s09") + (18 + i * 9) / FPS, vol: 0.45 });
  // painel de crescimento entrando + etiquetas
  fx.push({ file: "swish.mp3", at: st("s10") + 0.05, vol: 0.3 });
  pops(st("s10") + 0.9, 3, CHIP);
  // cartaz e cartões entrando
  fx.push({ file: "swish.mp3", at: st("s12") + 0.3, vol: 0.4 });
  // cartão de visita entrando girando + etiquetas
  fx.push({ file: "flip2.mp3", at: st("s13") + 0.1, vol: 0.35 });
  pops(st("s13") + 0.6, 3, CHIP);
  // final: botão entrando, clique do cursor, faixa do WhatsApp + contatos entrando
  const s15 = st("s15");
  fx.push({ file: "notif-soft.mp3", at: s15 + FINAL.button - 0.05, vol: 0.4 });
  fx.push({ file: "click.mp3", at: s15 + FINAL.click - 0.04, vol: 0.5 });
  pops(s15 + FINAL.pill, 2, 0.5, 0.3);
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
