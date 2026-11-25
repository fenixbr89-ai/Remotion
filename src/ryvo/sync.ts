// Gerado por scripts/sync_falas.py a partir das 20 falas (public/audio/falas/).
// Tempo das palavras: reconhecimento de voz alinhado ao texto. Velocidade inalterada.
// SYNC: início de cada palavra (s, relativo ao início do plano).
export const SYNC: Record<string, number[]> = {
  "Uma *marca*": [0.91, 1.06],
  "não precisa apenas *aparecer.*": [0.06, 0.21, 0.84, 1.38],
  "Ela precisa ser *lembrada.*": [0.1, 0.22, 1.03, 1.24],
  "Transformamos *ideias* em *movimento,*": [1.56, 2.35, 3.12, 3.3],
  "criando *vídeos* e *animações*": [0.11, 0.48, 1.13, 1.22],
  "e experiências visuais que capturam a *atenção.*": [0.08, 0.29, 1.16, 1.79, 1.94, 2.78, 2.87],
  "Criamos *identidades* *visuais*": [1.49, 1.88, 2.6],
  "e *conteúdos* *digitais*": [0.1, 0.26, 1.06],
  "que fortalecem a *presença* e a *personalidade* das marcas.": [0.11, 0.28, 1.16, 1.25, 1.91, 2.03, 2.15, 3.08, 3.26],
  "E levamos sua comunicação *além* *das* *telas,*": [1.12, 1.15, 1.67, 1.87, 2.8, 3.22, 3.46],
  "com *materiais* *gráficos* e *publicitários*": [0.1, 0.4, 1.18, 1.87, 1.96],
  "que dão *vida* à sua marca.": [0.09, 0.18, 0.39, 0.71, 1.02, 1.35],
  "Criatividade que vai *além* *do* *visual.*": [1.3, 2.11, 2.26, 2.5, 2.89, 3.04],
};

/** Trechos de áudio: [arquivo, início no arquivo, fim no arquivo, posição no vídeo] (s). */
export const CLIPS: [string, number, number, number][] = [["audio/falas/01.wav", 0, 0.6, 0.9], ["audio/falas/01.wav", 0.6, 2.755, 1.8], ["audio/falas/02.wav", 0, 1.74, 4.255], ["audio/falas/03.wav", 0, 1.78, 6.195], ["audio/falas/04.wav", 0, 1.218, 8.325], ["audio/falas/05.wav", 0, 2.77, 9.742], ["audio/falas/06.wav", 0, 1.922, 12.562], ["audio/falas/07.wav", 0, 3.233, 14.534], ["audio/falas/08.wav", 0, 1.22, 18.118], ["audio/falas/09.wav", 0, 1.9, 19.538], ["audio/falas/10.wav", 0, 1.99, 21.488], ["audio/falas/11.wav", 0, 3.593, 23.528], ["audio/falas/12.wav", 0, 0.83, 27.471], ["audio/falas/13.wav", 0, 3.07, 28.501], ["audio/falas/14.wav", 0, 2.84, 31.621], ["audio/falas/15.wav", 0, 1.624, 34.511], ["audio/falas/16.wav", 0, 0.58, 36.534], ["audio/falas/17.wav", 0, 2.39, 37.364], ["audio/falas/18.wav", 0, 1.987, 40.004], ["audio/falas/19.wav", 0, 0.82, 42.191], ["audio/falas/20.wav", 0, 1.89, 43.211]];

export const SHOT_FRAMES: Record<string, number> = {"s01": 56, "s02": 68, "s03": 59, "s04": 62, "s05": 127, "s06": 60, "s07": 108, "s08": 101, "s09": 60, "s10": 119, "s11": 124, "s12": 87, "s13": 53, "s14": 114, "s15": 182};

/** Tempos (s, relativos ao plano) do título "Sua marca merece mais." e do encerramento. */
export const HEAD = {"light": 0.17, "bold": 0.85};
export const FINAL = {"light": 0.14, "bold": 1.27, "button": 2.26, "click": 3.08, "pill": 3.31, "contacts": 5.17};
