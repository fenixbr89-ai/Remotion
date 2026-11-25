import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AUDIO_FILE, CLIPS, SHOT_FRAMES } from "./sync";
import { Background } from "./components";
import { Cam, Dir, Shot } from "./camera";
import { FONT, FPS, ThemeName } from "./theme";
import { CaptionProvider, CaptionStyle, ThemeProvider, useTheme } from "./ThemeContext";
import * as S from "./shots";

/**
 * Shot list in the style of the reference videos (referencias/): short shots (~2.2s),
 * camera always moving, whip pans with directional motion blur between shots,
 * kinetic text synced to the narration, alternating background.
 */
type ShotDef = {
  id: string;
  dur: number; // seconds (from the narration timing)
  comp: React.FC<S.ShotProps>;
  cam: [Cam, Cam];
  inDir: Dir;
  outDir: Dir;
  alt?: boolean;
};

export const SHOTS: ShotDef[] = [
  // CENA 01 — "Uma marca não precisa apenas aparecer. Ela precisa ser lembrada."
  { id: "s01", dur: SHOT_FRAMES.s01 / 30, comp: S.S01, cam: [{ s: 1 }, { s: 1.1, rz: -1 }], inDir: "none", outDir: "up" },
  { id: "s02", dur: SHOT_FRAMES.s02 / 30, comp: S.S02, cam: [{ s: 1.05, ry: 8 }, { s: 1.0, ry: -6 }], inDir: "up", outDir: "up" },
  { id: "s03", dur: SHOT_FRAMES.s03 / 30, comp: S.S03, cam: [{ s: 0.96 }, { s: 1.12, rz: 1 }], inDir: "up", outDir: "zoom" },
  { id: "s04", dur: SHOT_FRAMES.s04 / 30, comp: S.S04, cam: [{ s: 1.14, ry: 16, rx: -4 }, { s: 1.0, ry: -6, rx: 2 }], inDir: "zoom", outDir: "left", alt: true },
  // CENA 02 — "Transformamos ideias em movimento, criando vídeos, animações e experiências visuais que capturam a atenção."
  { id: "s05", dur: SHOT_FRAMES.s05 / 30, comp: S.S05, cam: [{ s: 1.0 }, { s: 1.12, y: 20 }], inDir: "left", outDir: "up" },
  { id: "s06", dur: SHOT_FRAMES.s06 / 30, comp: S.S06, cam: [{ s: 0.98, ry: -10 }, { s: 1.1, ry: 6, x: -20 }], inDir: "up", outDir: "right" },
  { id: "s07", dur: SHOT_FRAMES.s07 / 30, comp: S.S07, cam: [{ s: 1.08, rx: 8 }, { s: 0.98, rx: -2 }], inDir: "right", outDir: "zoom" },
  // CENA 03 — "Criamos identidades visuais e conteúdos digitais que fortalecem a presença e a personalidade das marcas."
  { id: "s08", dur: SHOT_FRAMES.s08 / 30, comp: S.S08, cam: [{ s: 1.0, ry: -8 }, { s: 1.1, ry: 6 }], inDir: "zoom", outDir: "left", alt: true },
  { id: "s09", dur: SHOT_FRAMES.s09 / 30, comp: S.S09, cam: [{ s: 1.08, x: 30 }, { s: 1.0, x: -30 }], inDir: "left", outDir: "up", alt: true },
  { id: "s10", dur: SHOT_FRAMES.s10 / 30, comp: S.S10, cam: [{ s: 0.97, rx: 6 }, { s: 1.1, rx: -2 }], inDir: "up", outDir: "down", alt: true },
  // CENA 04 — "E levamos sua comunicação além das telas, com materiais gráficos e publicitários que dão vida à sua marca."
  { id: "s11", dur: SHOT_FRAMES.s11 / 30, comp: S.S11, cam: [{ s: 1.0 }, { s: 1.04 }], inDir: "down", outDir: "zoom" },
  { id: "s12", dur: SHOT_FRAMES.s12 / 30, comp: S.S12, cam: [{ s: 1.1, ry: 14 }, { s: 1.0, ry: -8 }], inDir: "zoom", outDir: "right" },
  { id: "s13", dur: SHOT_FRAMES.s13 / 30, comp: S.S13, cam: [{ s: 1.0, rx: 4 }, { s: 1.1, rx: -2 }], inDir: "right", outDir: "zoom" },
  // CENA 05 — "RYVO. Criatividade que vai além do visual. Vamos desenvolver seu próximo projeto?"
  { id: "s14", dur: SHOT_FRAMES.s14 / 30, comp: S.S14, cam: [{ s: 0.98 }, { s: 1.1 }], inDir: "zoom", outDir: "up", alt: true },
  { id: "s15", dur: SHOT_FRAMES.s15 / 30, comp: S.S15, cam: [{ s: 1.04, y: 20 }, { s: 1.0, y: 0 }], inDir: "up", outDir: "none" },
];

export const shotFrames = () => {
  let from = 0;
  return SHOTS.map((s) => {
    const frames = Math.round(s.dur * FPS);
    const out = { ...s, from, frames };
    from += frames;
    return out;
  });
};

export const totalShotFrames = () => shotFrames().reduce((a, s) => a + s.frames, 0);

export const RyvoComercial: React.FC<{ tema: ThemeName; legenda?: CaptionStyle }> = ({ tema, legenda = "desfoque" }) => (
  <ThemeProvider name={tema}>
    <CaptionProvider value={legenda}>
      <Inner />
    </CaptionProvider>
  </ThemeProvider>
);

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const T = useTheme();
  const shots = shotFrames();

  // Background alternates (brand ↔ alternate); the switch happens inside the whip of the cut.
  let alt = 0;
  shots.forEach((s, i) => {
    const prev = i > 0 && shots[i - 1].alt ? 1 : 0;
    const cur = s.alt ? 1 : 0;
    if (frame >= s.from - 3 && frame < s.from + s.frames) {
      alt = interpolate(frame, [s.from - 3, s.from + 3], [prev, cur], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <AbsoluteFill style={{ background: T.altBg, opacity: alt }} />
      {/* narration, placed phrase by phrase */}
      {CLIPS.map(([a, b, at], i) => (
        <Sequence key={`vo${i}`} from={Math.round(at * FPS)} durationInFrames={Math.round((b - a) * FPS) + 2} name={`locução ${i + 1}`}>
          <Audio src={staticFile(AUDIO_FILE)} trimBefore={Math.round(a * FPS)} trimAfter={Math.round(b * FPS)} />
        </Sequence>
      ))}
      {shots.map((s) => {
        const Comp = s.comp;
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
            <Shot id={s.id} dur={s.frames} cam={s.cam} inDir={s.inDir} outDir={s.outDir}>
              <Comp dur={s.frames} />
            </Shot>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
