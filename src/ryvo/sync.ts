// Gerado a partir da narração (public/audio/narracao.mp3).
// SYNC: início de cada palavra (s, relativo ao início do plano). CLIPS: trechos do áudio [início, fim, posição no vídeo] em segundos.
export const SYNC: Record<string, number[]> = {
  "Uma *marca*": [0.94, 1.26],
  "não precisa apenas *aparecer.*": [0.09, 0.25, 0.82, 1.25],
  "Ela precisa ser *lembrada.*": [0.78, 1.15, 1.71, 1.9],
  "Transformamos *ideias* em *movimento,*": [0.23, 1.11, 1.56, 1.78],
  "criando *vídeos,* *animações*": [0.1, 0.54, 1.09],
  "e experiências visuais que capturam a *atenção.*": [0.07, 0.29, 1.18, 1.68, 1.81, 2.22, 2.35],
  "Criamos *identidades* *visuais*": [0.23, 0.7, 1.88],
  "e *conteúdos* *digitais*": [0.08, 0.32, 1.02],
  "que fortalecem a *presença* e a *personalidade* das marcas.": [0.08, 0.26, 0.99, 1.17, 1.72, 1.9, 2.08, 3.18, 3.36],
  "E levamos sua comunicação *além* *das* *telas,*": [0.27, 0.42, 0.89, 1.04, 1.87, 2.25, 2.44],
  "com *materiais* *gráficos* e *publicitários*": [0.08, 0.24, 0.73, 1.23, 1.39],
  "que dão *vida* à sua marca.": [0.07, 0.24, 0.4, 0.73, 0.89, 1.06],
  "Criatividade que vai *além* *do* *visual.*": [0.89, 1.86, 2.05, 2.24, 2.63, 2.83],
};

export const CLIPS: [number, number, number][] = [[0.0, 2.47, 1.0], [2.52, 4.42, 4.75], [4.86, 12.16, 9.5], [12.62, 20.31, 17.5], [20.78, 27.32, 25.8], [27.58, 30.4, 33.2], [30.4, 32.28, 36.55]];

export const SHOT_FRAMES: Record<string, number> = {"s01": 45, "s02": 74, "s03": 92, "s04": 67, "s05": 80, "s06": 57, "s07": 103, "s08": 68, "s09": 51, "s10": 129, "s11": 92, "s12": 64, "s13": 56, "s14": 110, "s15": 109};
