// Gerado por scripts/sync_narracao.py a partir de public/audio/narracao-v2.wav
// (pausas longas cortadas; velocidade do áudio e do vídeo inalteradas).
// SYNC: início de cada palavra (s, relativo ao início do plano).
export const SYNC: Record<string, number[]> = {
  "Uma marca não precisa apenas *aparecer.*": [0.33, 0.67, 1.01, 1.18, 1.8, 2.19],
  "Ela precisa ser *lembrada.*": [0.09, 0.4, 0.87, 1.02],
  "Motion *design.*": [0.09, 0.51],
  "Transformamos *ideias* em *movimento,*": [1.21, 1.92, 2.28, 2.45],
  "criando *vídeos,* *animações*": [0.1, 0.57, 1.14],
  "e experiências visuais que capturam a *atenção.*": [0.09, 0.33, 1.29, 1.94, 2.15, 3.04, 3.36],
  "Design *gráfico.*": [0.09, 0.39],
  "Criamos *identidades* *visuais*": [0.91, 1.22, 2.1],
  "e *conteúdos* *digitais* que fortalecem a *presença*": [0, 0.1, 0.6, 1.11, 1.27, 1.95, 2.11],
  "e a *personalidade* das marcas.": [0.11, 0.26, 0.4, 1.28, 1.43],
  "*Impressos.*": [0.11],
  "E levamos sua comunicação *além* *das* *telas,*": [1.02, 1.19, 1.71, 1.88, 2.73, 3.08, 3.25],
  "com *materiais* *gráficos* e *publicitários*": [0.11, 0.27, 0.75, 1.24, 1.4],
  "que dão *vida* à sua marca.": [0.11, 0.27, 0.43, 0.75, 0.91, 1.07],
  "Criatividade que vai *além* *do* *visual.*": [0.9, 1.66, 1.82, 1.97, 2.27, 2.42],
};

/** Trechos do áudio: [início na fonte, fim na fonte, posição no vídeo] (s). */
export const CLIPS: [number, number, number][] = [[0.27, 2.78, 0.35], [3.11, 4.65, 3.01], [5.07, 6.75, 4.75], [7.3, 8.3, 6.68], [8.53, 10.63, 7.8], [10.86, 12.93, 10.02], [12.98, 17.43, 12.14], [17.76, 24.7, 16.84], [25.1, 25.86, 24.03], [26.28, 32.6, 24.94], [33.16, 33.62, 31.71], [33.82, 35.79, 32.32], [35.96, 37.88, 34.44], [38.36, 39.1, 36.56], [39.35, 41.15, 37.45]];

export const AUDIO_FILE = "audio/narracao-v2.wav";

export const SHOT_FRAMES: Record<string, number> = {"s01": 87, "s03": 52, "s04": 58, "s05": 100, "s06": 64, "s07": 141, "s08": 75, "s09": 80, "s10": 60, "s11": 111, "s12": 63, "s13": 51, "s14": 88, "s15": 174};

/** Tempos (s, relativos ao plano) do título "Sua marca merece mais." e do encerramento. */
export const HEAD = {"light": 0.15, "bold": 0.8};
export const FINAL = {"light": 0.14, "bold": 1.1, "button": 2.26, "click": 2.97, "pill": 3.15, "contacts": 4.92};
