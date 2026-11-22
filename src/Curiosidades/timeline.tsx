import React from "react";
import type { TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  S01Gancho,
  S02Estimulo,
  S03Reabsorcao,
  S04Numero,
  S05Vizinhos,
  S06Extrusao,
  S07Seio,
  S08Domino,
  S10Recado,
  S11Final,
} from "./scenes/Scenes";
import {
  SAnatomia,
  SBranemark,
  SComoFaz,
  SCoroa,
  SEnxerto,
  SEstimuloVolta,
  SOsseo,
  SPilar,
  SPino,
  SPlanejamento,
  SPreparo,
} from "./scenes/Implante";
import { circleReveal, whip, zoomThrough } from "./transitions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPresentation = TransitionPresentation<any>;

export type SceneDef = {
  id: string;
  C: React.FC;
  sec: number;
  /** transition into the NEXT scene */
  next?: { p: AnyPresentation; frames?: number };
};

const same = { p: fade(), frames: 20 } as const; // same drawing, only its state changes

export const SCENES: SceneDef[] = [
  { id: "Cena01-Gancho", C: S01Gancho, sec: 5, next: { p: zoomThrough({ x: 540, y: 1400 }) } }, // dive into the gap
  { id: "Cena02-Estimulo", C: S02Estimulo, sec: 5.5, next: same }, // same cross-section, tooth leaves
  { id: "Cena03-Reabsorcao", C: S03Reabsorcao, sec: 6, next: { p: zoomThrough({ x: 540, y: 1470 }) } }, // dive into the bone
  { id: "Cena04-Numero", C: S04Numero, sec: 5.5, next: { p: whip({ dir: "up" }) } },
  { id: "Cena05-Vizinhos", C: S05Vizinhos, sec: 4.5, next: { p: whip({ dir: "down" }) } }, // camera goes up to the upper jaw
  { id: "Cena06-Extrusao", C: S06Extrusao, sec: 5, next: { p: zoomThrough({ x: 540, y: 820, scale: 2.2 }) } },
  { id: "Cena07-SeioMaxilar", C: S07Seio, sec: 5, next: { p: whip({ dir: "left" }) } },
  { id: "Cena08-Domino", C: S08Domino, sec: 6, next: { p: circleReveal({ x: 540, y: 1620 }), frames: 26 } }, // worried tooth grows into the pink scene
  { id: "Cena09-ComoFaz", C: SComoFaz, sec: 3.5, next: { p: zoomThrough({ x: 540, y: 760 }) } }, // dive into the screw
  { id: "Cena10-Anatomia", C: SAnatomia, sec: 5.5, next: { p: whip({ dir: "left" }) } },
  { id: "Cena11-Planejamento", C: SPlanejamento, sec: 5, next: { p: zoomThrough({ x: 600, y: 1310 }) } }, // dive into the planned spot
  { id: "Cena12-Enxerto", C: SEnxerto, sec: 4.5, next: { p: circleReveal({ x: 790, y: 1270 }), frames: 26 } }, // grafted bone grows into the next scene
  { id: "Cena13-Preparo", C: SPreparo, sec: 4.5, next: same },
  { id: "Cena14-Pino", C: SPino, sec: 5, next: same },
  { id: "Cena15-Osseointegracao", C: SOsseo, sec: 5.5, next: { p: zoomThrough({ x: 540, y: 1500 }) } }, // dive into the screw
  { id: "Cena16-Branemark", C: SBranemark, sec: 6.5, next: { p: whip({ dir: "up" }) } },
  { id: "Cena17-Pilar", C: SPilar, sec: 3.5, next: same },
  { id: "Cena18-Coroa", C: SCoroa, sec: 4.5, next: same },
  { id: "Cena19-EstimuloVolta", C: SEstimuloVolta, sec: 4.5, next: { p: circleReveal({ x: 540, y: 1150 }), frames: 26 } }, // from the crown
  { id: "Cena20-Recado", C: S10Recado, sec: 4, next: { p: zoomThrough({ x: 540, y: 700, scale: 1.6 }) } },
  { id: "Cena21-Final", C: S11Final, sec: 5 },
];

export const DEFAULT_T = 22;
export const sceneFrames = (s: SceneDef, fps: number) => Math.round(s.sec * fps);
export const totalFrames = (fps: number) =>
  SCENES.reduce((t, s) => t + sceneFrames(s, fps) - (s.next ? s.next.frames ?? DEFAULT_T : 0), 0);
