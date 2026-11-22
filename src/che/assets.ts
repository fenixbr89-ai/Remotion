// Photos from Wikimedia Commons, all public domain (PD-Cuba, PD-AR-Photo, PD-USGov).
// *_cut.png files are background-removed versions made locally with rembg.
type P = { file: string; cut?: string; credit: string };
export const PHOTOS: Record<string, P> = {
  korda: {
    file: "korda.jpg",
    cut: "korda_cut.png",
    credit: "Alberto Korda, 1960 — PD-Cuba",
  },
  portrait: { file: "portrait.jpg", credit: "ChePipe.jpg — PD-Cuba" },
  kid: { file: "kid.jpg", credit: "Che1933.jpg — PD-AR-Photo" },
  student: {
    file: "student.jpg",
    credit: "Che Guevara ca. 1945 — PD-AR-Photo",
  },
  leper: { file: "leper.jpg", credit: "CheOnRaft1952.jpg — PD-Cuba" },
  fidel: {
    file: "fidel.jpg",
    cut: "fidel_cut.png",
    credit: "CheyFidel.jpg — PD-Cuba",
  },
  havana: { file: "havana.jpg", credit: "Che_SClara.jpg — PD-Cuba" },
  official: { file: "official.jpg", credit: "Che_Guevara.jpg — PD-Cuba" },
  green: { file: "green.jpg", credit: "Che Guevara June 2, 1959 — PD-Cuba" },
  korda_walk: {
    file: "korda_walk.jpg",
    credit: "KordaOfCheWalking.jpg — PD-Cuba",
  },
  congo: { file: "congo.jpg", credit: "CheInCongo1965.jpg — PD-Cuba" },
  bolivia: { file: "bolivia.jpg", credit: "CheMuleFull.jpg — PD-Cuba" },
  sierra: {
    file: "sierra.jpg",
    credit: "Fidel Castro and his men in the Sierra Maestra — PD-Cuba",
  },
  family: { file: "family.jpg", credit: "Chefamily.jpg — PD-AR-Photo" },
};
