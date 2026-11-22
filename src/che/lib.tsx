import React from "react";
import {
  AbsoluteFill,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";

/* ---------- fonts ---------- */
export const SERIF = "'Inter', Helvetica, Arial, sans-serif"; // heavy upright sans (user preference)
export const SANS = "'Inter', Helvetica, Arial, sans-serif";
export const TYPE = "'Special Elite', 'Courier New', monospace";

const fontsToLoad: [string, string, FontFaceDescriptors][] = [
  [
    "Instrument Serif",
    "fonts/instrument-serif-latin-400-italic.woff2",
    { style: "italic" },
  ],
  [
    "Instrument Serif",
    "fonts/instrument-serif-latin-400-normal.woff2",
    { style: "normal" },
  ],
  ["Inter", "fonts/inter-latin-600-normal.woff2", { weight: "600" }],
  ["Inter", "fonts/inter-latin-800-normal.woff2", { weight: "800" }],
  ["Special Elite", "fonts/special-elite-latin-400-normal.woff2", {}],
];
let fontsStarted = false;
export const loadFonts = () => {
  if (fontsStarted || typeof document === "undefined") return;
  fontsStarted = true;
  const h = delayRender("fonts");
  Promise.all(
    fontsToLoad.map(([fam, file, desc]) => {
      const f = new FontFace(fam, `url(${staticFile(file)})`, desc);
      return f.load().then((ff) => document.fonts.add(ff));
    }),
  )
    .then(() => continueRender(h))
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
};

/* ---------- palette ---------- */
export const C = {
  paper: "#e9e6df",
  paperDark: "#d9d3c6",
  ink: "#151515",
  red: "#c8302c",
  redSoft: "#e2574c",
  blue: "#3f87b5",
  black: "#0b0b0b",
};

/* ---------- easing helpers ---------- */
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const ease = (
  f: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  e = easeOut,
) => interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

/* ---------- backgrounds & overlays ---------- */
/** Faint typewritten archive document behind paper scenes. */
const DOC_LINES = [
  "INFORME CONFIDENCIAL — ARCHIVO 1959 — EXPEDIENTE Nº 0471",
  "el comandante ernesto guevara de la serna, nacido en rosario,",
  "argentina, el 14 de junio de 1928. médico. sierra maestra.",
  "columna 8 ciro redondo — las villas — santa clara — 1958",
  "observaciones: asma crónica. lector. viajes por sudamérica",
  "1952 — chile — perú — colombia — venezuela — 8.000 km aprox.",
  "méxico, d.f., 1955 — contacto con el movimiento 26 de julio",
  "granma — 2 de diciembre de 1956 — playa las coloradas",
];
export const DocText: React.FC<{ opacity?: number; seed?: number }> = ({
  opacity = 0.09,
  seed = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: -60,
      top: -40,
      width: 1300,
      rotate: `${-3 + (seed % 3)}deg`,
      fontFamily: TYPE,
      fontSize: 30,
      lineHeight: "54px",
      color: "#2a2418",
      opacity,
      whiteSpace: "nowrap",
    }}
  >
    {Array.from({ length: 38 }).map((_, i) => (
      <div key={i}>{DOC_LINES[(i + seed) % DOC_LINES.length]}</div>
    ))}
  </div>
);

export const Paper: React.FC<{
  tone?: string;
  doc?: boolean;
  seed?: number;
  children?: React.ReactNode;
}> = ({ tone = C.paper, doc = true, seed = 0, children }) => (
  <AbsoluteFill style={{ background: tone, overflow: "hidden" }}>
    {doc ? <DocText seed={seed} /> : null}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.55), rgba(0,0,0,0) 60%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(60,45,20,0.18) 100%)",
      }}
    />
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.35,
        mixBlendMode: "multiply",
      }}
    >
      <filter id="paperfib">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="3"
          seed="7"
        />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.32  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paperfib)" />
    </svg>
    {children}
  </AbsoluteFill>
);

export const Dark: React.FC<{ glow?: string; children?: React.ReactNode }> = ({
  glow,
  children,
}) => (
  <AbsoluteFill style={{ background: C.black }}>
    {glow ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow}, rgba(0,0,0,0) 62%)`,
        }}
      />
    ) : null}
    {children}
  </AbsoluteFill>
);

/** Film grain + flicker + vignette, applied over everything. */
export const FilmLook: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 24;
  const flicker = 0.035 * (random(`fl${Math.floor(frame / 2)}`) - 0.5);
  const dx = Math.round(random(`gx${seed}`) * 60);
  const dy = Math.round(random(`gy${seed}`) * 60);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          mixBlendMode: "overlay",
        }}
      >
        <filter id={`grain${seed}`} x="0" y="0">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="2"
            seed={seed}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          x={-dx}
          y={-dy}
          width="120%"
          height="120%"
          filter={`url(#grain${seed})`}
        />
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const k = `${Math.floor(frame / 2)}-${i}`;
          return (
            <circle
              key={i}
              cx={random(`dx${k}`) * 1080}
              cy={random(`dy${k}`) * 1920}
              r={1 + random(`dr${k}`) * 3}
              fill={random(`dc${k}`) > 0.5 ? "#000" : "#fff"}
              opacity={0.35}
            />
          );
        })}
        {random(`sc${Math.floor(frame / 3)}`) > 0.72 ? (
          <line
            x1={random(`sx${Math.floor(frame / 3)}`) * 1080}
            x2={random(`sx${Math.floor(frame / 3)}`) * 1080 + 6}
            y1={0}
            y2={1920}
            stroke="#fff"
            strokeOpacity={0.12}
            strokeWidth={1.5}
          />
        ) : null}
      </svg>
      <AbsoluteFill
        style={{
          background: flicker > 0 ? "#fff" : "#000",
          opacity: Math.abs(flicker),
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- camera: constant slow move until the end of a scene ---------- */
export const Camera: React.FC<{
  dur: number;
  from?: number;
  to?: number;
  rot?: number;
  x?: number;
  y?: number;
  children: React.ReactNode;
}> = ({ dur, from = 1, to = 1.07, rot = 0, x = 0, y = 0, children }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill
      style={{
        scale: String(from + (to - from) * t),
        rotate: `${rot * t}deg`,
        translate: `${x * t}px ${y * t}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ---------- text ---------- */
/** Heavy sans words appearing one by one with blur. */
export const SerifWords: React.FC<{
  text: string;
  start?: number;
  every?: number;
  size?: number;
  color?: string;
  italic?: boolean;
  style?: React.CSSProperties;
  highlight?: string[];
  hlColor?: string;
  align?: "center" | "left" | "right";
}> = ({
  text,
  start = 0,
  every = 5,
  size = 64,
  color = C.ink,
  italic = false,
  style,
  highlight = [],
  hlColor = C.red,
  align = "center",
}) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: 800,
        fontSize: size * 0.8,
        lineHeight: 1.05,
        color,
        textAlign: align,
        letterSpacing: -size * 0.025,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = start + i * every;
        const p = ease(f, s, s + 10);
        const hl = highlight.includes(w.replace(/[.,:!?]/g, ""));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: size * 0.2,
              opacity: p,
              filter: `blur(${(1 - p) * 8}px)`,
              translate: `0px ${(1 - p) * 14}px`,
              color: hl ? hlColor : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Small caps sans typed letter by letter with a blue cursor (reference style). */
export const TypeCaps: React.FC<{
  text: string;
  start?: number;
  cps?: number;
  size?: number;
  color?: string;
  cursor?: string;
  font?: string;
  weight?: number;
  style?: React.CSSProperties;
  boxWords?: string[];
}> = ({
  text,
  start = 0,
  cps = 18,
  size = 40,
  color = C.ink,
  cursor = C.blue,
  font = SANS,
  weight = 600,
  style,
  boxWords = [],
}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor(((f - start) / 30) * cps));
  const shown = text.slice(0, n);
  const done = n >= text.length;
  const blink = done ? Math.floor(f / 8) % 2 === 0 : true;
  const parts = shown.split(/(\s+)/);
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        color,
        letterSpacing: font === SANS ? 1.5 : 0,
        whiteSpace: "pre",
        textAlign: "center",
        ...style,
      }}
    >
      {parts.map((p, i) =>
        boxWords.includes(p) ? (
          <span
            key={i}
            style={{ outline: `2px solid ${cursor}`, outlineOffset: 4 }}
          >
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
      <span
        style={{
          display: "inline-block",
          width: 3,
          height: size * 1.05,
          marginLeft: 4,
          verticalAlign: "middle",
          background: cursor,
          opacity: n > 0 && blink ? 1 : 0,
        }}
      />
    </div>
  );
};

/** Hand-drawn style red underline / circle that draws itself. */
export const RedStroke: React.FC<{
  start: number;
  d: string;
  w: number;
  h: number;
  len?: number;
  color?: string;
  width?: number;
  style?: React.CSSProperties;
  dur?: number;
}> = ({
  start,
  d,
  w,
  h,
  len = 1600,
  color = C.red,
  width = 7,
  style,
  dur = 16,
}) => {
  const f = useCurrentFrame();
  const p = ease(f, start, start + dur, 0, 1, easeInOut);
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
    </svg>
  );
};

/** Cutout sticker look for PNGs with transparency: white edge + soft shadow. */
export const cutoutFilter = (edge = 5, shadow = 0.35) =>
  `drop-shadow(${edge}px 0 0 #f4f1ea) drop-shadow(-${edge}px 0 0 #f4f1ea) drop-shadow(0 ${edge}px 0 #f4f1ea) drop-shadow(0 -${edge}px 0 #f4f1ea) drop-shadow(10px 18px 14px rgba(0,0,0,${shadow}))`;

/** Spring-ish pop for collage elements (soft, no bounce slam). */
export const pop = (f: number, s: number, d = 14) => {
  const p = ease(f, s, s + d, 0, 1, Easing.bezier(0.34, 1.35, 0.64, 1));
  return { scale: String(0.85 + 0.15 * p), opacity: ease(f, s, s + 6) };
};

/** Torn paper edge path (deterministic). */
export const tornPath = (
  w: number,
  h: number,
  seed: string,
  amp = 18,
  step = 26,
) => {
  let d = `M0 ${amp}`;
  for (let x = 0; x <= w + step; x += step) {
    d += ` L${x} ${amp + (random(seed + x) - 0.5) * amp * 1.6}`;
  }
  d += ` L${w} ${h} L0 ${h} Z`;
  return d;
};
