import type { Theme } from "./theme";

export type WordEffect = "shake-tear" | "desaturate" | "underline" | "dots";

export type Word = {
  t: string;
  /** Palavra-chave: laranja, Oswald 700, maiúsculas */
  accent?: boolean;
  /** Quebra de linha antes desta palavra */
  br?: boolean;
  effect?: WordEffect;
};

export type Visual =
  | { type: "chart-down" }
  | { type: "logo" }
  | { type: "icon-fill"; icon: "house" }
  | { type: "building-floors"; floors: number }
  | { type: "pills"; items: string[] }
  | { type: "roller-trail" }
  | { type: "check-cards"; items: { icon: "helmet" | "harness"; label: string }[] }
  | { type: "sparkles" }
  | { type: "app-card"; title: string; button: string; done: string }
  | { type: "calendar-flip"; day: number }
  | { type: "brush-reveal" }
  | { type: "cta-logo" }
  | { type: "whatsapp"; phone: string };

export type TransitionSpec = {
  type: "circle" | "stroke";
  color?: string;
};

export type SceneSpec = {
  name: string;
  duration: number;
  theme: Theme;
  /** Texto da locução (referência / legenda futura) */
  voice: string;
  words?: Word[];
  /** Tamanho da palavra-chave (px) */
  size?: number;
  pill?: string;
  visual?: Visual;
  /** Transição sobre o corte para a cena seguinte */
  transition?: TransitionSpec;
};

export type ServiceSpec = {
  id: string;
  durationInFrames: number;
  music?: string;
  voice?: string;
  scenes: SceneSpec[];
};
