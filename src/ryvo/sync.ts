// Gerado por scripts/sync_falas.py a partir das 20 falas (public/audio/falas/).
// Tempo das palavras: reconhecimento de voz alinhado ao texto. Velocidade inalterada.
// SYNC: início de cada palavra (s, relativo ao início do plano).
export const SYNC: Record<string, number[]> = {
  "não precisa apenas *aparecer.*": [0.06, 0.21, 0.84, 1.38],
  "Ela precisa ser *lembrada.*": [0.08, 0.2, 1.01, 1.22],
  "Transformamos *ideias* em *movimento,*": [0.09, 0.88, 1.65, 1.83],
  "criando *vídeos* e *animações*": [0.11, 0.48, 1.13, 1.22],
  "e experiências visuais que capturam a *atenção.*": [0.08, 0.29, 1.16, 1.79, 1.94, 2.78, 2.87],
  "Criamos *identidades* *visuais*": [0.08, 0.47, 1.19],
  "e *conteúdos* *digitais*": [0.1, 0.26, 1.06],
  "que fortalecem a *presença* e a *personalidade* das marcas.": [0.11, 0.28, 1.16, 1.25, 1.91, 2.03, 2.15, 3.08, 3.26],
  "E levamos sua comunicação *além* *das* *telas,*": [0.1, 0.13, 0.65, 0.85, 1.78, 2.2, 2.44],
  "com *materiais* *gráficos* e *publicitários*": [0.09, 0.39, 1.17, 1.86, 1.95],
  "que dão *vida* à sua marca.": [0.11, 0.2, 0.41, 0.72, 1.04, 1.37],
  "Criatividade que vai *além* *do* *visual.*": [1.25, 2.06, 2.21, 2.45, 2.84, 2.99],
};

/** Trechos de áudio: [arquivo, início no arquivo, fim no arquivo, posição no vídeo] (s). */
export const CLIPS: [string, number, number, number][] = [["audio/falas/01.wav", 0, 0.6, 0.6], ["audio/falas/01.wav", 0.6, 2.755, 1.4], ["audio/falas/02.wav", 0, 1.74, 3.805], ["audio/falas/03.wav", 0, 1.78, 5.695], ["audio/falas/05.wav", 0, 2.77, 7.775], ["audio/falas/06.wav", 0, 1.922, 10.595], ["audio/falas/07.wav", 0, 3.233, 12.567], ["audio/falas/09.wav", 0, 1.9, 16.1], ["audio/falas/10.wav", 0, 1.99, 18.05], ["audio/falas/11.wav", 0, 3.593, 20.09], ["audio/falas/13.wav", 0, 3.07, 23.983], ["audio/falas/14.wav", 0, 2.84, 27.103], ["audio/falas/15.wav", 0, 1.624, 29.993], ["audio/falas/16.wav", 0, 0.58, 31.967], ["audio/falas/17.wav", 0, 2.39, 32.747], ["audio/falas/18.wav", 0, 1.987, 35.337], ["audio/falas/19.wav", 0, 0.82, 37.474], ["audio/falas/20.wav", 0, 1.89, 38.444]];

export const SHOT_FRAMES: Record<string, number> = {"s01": 44, "s02": 67, "s03": 57, "s04": 62, "s05": 83, "s06": 60, "s07": 106, "s08": 59, "s09": 60, "s10": 117, "s11": 94, "s12": 86, "s13": 52, "s14": 111, "s15": 176};

/** Tempos (s, relativos ao plano) do título "Sua marca merece mais." e do encerramento. */
export const HEAD = {"light": 0.17, "bold": 0.85};
export const FINAL = {"light": 0.14, "bold": 1.27, "button": 2.21, "click": 3.03, "pill": 3.21, "contacts": 5.07};
