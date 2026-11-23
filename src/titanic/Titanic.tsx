/**
 * "Por que o Titanic afundou" — premium 3D motion style for @quebra.padrao.
 * Rules: black & white only; red only for negative things; real people in B&W photos;
 * cards face the camera (slight tilt only); captions at the bottom, max 2 lines.
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  SANS,
  clamp,
  ease,
  easeInOut,
  easeOut,
  loadFonts,
  pop,
} from "../che/lib";

loadFonts();

const RED = "#e0372e";
const BAND_TOP = 1330;

/* ---------------- glyphs (drawn in a 100x100 box) ---------------- */
const G: Record<string, string> = {
  ship: '<path d="M8 60 L92 60 L80 80 L20 80 Z" fill="F"/><rect x="26" y="44" width="48" height="14" rx="3" fill="F"/><rect x="32" y="24" width="8" height="18" fill="F"/><rect x="46" y="24" width="8" height="18" fill="F"/><rect x="60" y="24" width="8" height="18" fill="F"/>',
  ice: '<path d="M50 8 L70 40 L86 44 L94 80 L6 80 L18 50 L34 44 Z" fill="F"/><path d="M50 8 L58 40 L44 80" stroke="A" stroke-width="4" fill="none"/>',
  buoy: '<circle cx="50" cy="50" r="36" fill="none" stroke="F" stroke-width="16"/><path d="M50 12 V28 M50 72 V88 M12 50 H28 M72 50 H88" stroke="A" stroke-width="16"/>',
  bino: '<circle cx="28" cy="64" r="20" fill="F"/><circle cx="72" cy="64" r="20" fill="F"/><rect x="16" y="22" width="22" height="40" rx="8" fill="F"/><rect x="62" y="22" width="22" height="40" rx="8" fill="F"/><rect x="38" y="36" width="24" height="16" fill="F"/><circle cx="28" cy="64" r="9" fill="A"/><circle cx="72" cy="64" r="9" fill="A"/>',
  lock: '<rect x="20" y="44" width="60" height="44" rx="10" fill="F"/><path d="M32 44 V32 a18 18 0 0 1 36 0 V44" stroke="F" stroke-width="10" fill="none"/><circle cx="50" cy="64" r="7" fill="A"/>',
  key: '<circle cx="30" cy="50" r="17" fill="none" stroke="F" stroke-width="10"/><path d="M47 50 H90 M76 50 V64 M88 50 V60" stroke="F" stroke-width="10" stroke-linecap="round"/>',
  warn: '<path d="M50 12 L90 84 L10 84 Z" fill="F" stroke="F" stroke-width="6" stroke-linejoin="round"/><rect x="45" y="36" width="10" height="28" rx="4" fill="A"/><circle cx="50" cy="74" r="6" fill="A"/>',
  shield:
    '<path d="M50 8 L84 20 V48 C84 70, 68 84, 50 92 C32 84, 16 70, 16 48 V20 Z" fill="F"/><path d="M34 50 L46 62 L68 38" stroke="A" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  moon: '<path d="M62 12 A40 40 0 1 0 88 66 A32 32 0 1 1 62 12 Z" fill="F"/>',
  radio:
    '<rect x="18" y="46" width="64" height="40" rx="8" fill="F"/><circle cx="36" cy="66" r="9" fill="A"/><rect x="52" y="58" width="22" height="5" rx="2" fill="A"/><rect x="52" y="68" width="22" height="5" rx="2" fill="A"/><path d="M60 46 L76 14" stroke="F" stroke-width="6" stroke-linecap="round"/>',
  boat: '<path d="M8 52 L92 52 L76 78 L24 78 Z" fill="F"/><path d="M50 14 L50 50 M52 18 L76 46 L52 46 Z" stroke="F" stroke-width="5" fill="F"/>',
  person:
    '<circle cx="50" cy="26" r="16" fill="F"/><path d="M18 92 V66 Q18 48 50 48 Q82 48 82 66 V92 Z" fill="F"/>',
  gauge:
    '<path d="M12 70 A40 40 0 0 1 88 70" fill="none" stroke="F" stroke-width="12" stroke-linecap="round"/><circle cx="50" cy="70" r="9" fill="F"/>',
  chat: '<path d="M14 20 H86 A8 8 0 0 1 94 28 V64 A8 8 0 0 1 86 72 H44 L24 88 V72 H14 A8 8 0 0 1 6 64 V28 A8 8 0 0 1 14 20 Z" fill="F"/><circle cx="32" cy="46" r="6" fill="A"/><circle cx="50" cy="46" r="6" fill="A"/><circle cx="68" cy="46" r="6" fill="A"/>',
};

type Mat = "silver" | "red" | "dark";
const MAT: Record<Mat, { bg: string; shadow: string; f: string; a: string }> = {
  silver: {
    bg: "linear-gradient(160deg,#ffffff 0%,#d9d9de 45%,#7d7d86 100%)",
    shadow:
      "0 30px 60px rgba(0,0,0,.6), 0 0 40px rgba(255,255,255,.08), inset 0 -10px 24px rgba(0,0,0,.35), inset 0 8px 14px rgba(255,255,255,.8)",
    f: "#17171b",
    a: "#8a8a92",
  },
  red: {
    bg: "linear-gradient(160deg,#ff8a7e 0%,#e0372e 45%,#8a1410 100%)",
    shadow:
      "0 30px 60px rgba(224,55,46,.4), inset 0 -10px 24px rgba(80,0,0,.45), inset 0 8px 14px rgba(255,255,255,.5)",
    f: "#ffffff",
    a: "#a3140f",
  },
  dark: {
    bg: "linear-gradient(160deg,#4a4a52 0%,#23232a 55%,#0f0f12 100%)",
    shadow:
      "0 30px 60px rgba(0,0,0,.6), inset 0 -10px 24px rgba(0,0,0,.6), inset 0 8px 14px rgba(255,255,255,.25)",
    f: "#ffffff",
    a: "rgba(255,255,255,.4)",
  },
};

const Glyph: React.FC<{
  g: string;
  f: string;
  a: string;
  size: string | number;
}> = ({ g, f, a, size }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    dangerouslySetInnerHTML={{
      __html: G[g].split('"F"').join(`"${f}"`).split('"A"').join(`"${a}"`),
    }}
  />
);

/** Glossy 3D squircle icon; floats gently. */
const Icon: React.FC<{
  g: string;
  x: number;
  y: number;
  s: number;
  mat?: Mat;
  rot?: number;
  blur?: boolean;
  at?: number;
  slash?: number; // 0..1 red slash drawn over it
}> = ({ g, x, y, s, mat = "silver", rot = 0, blur, at = 0, slash = 0 }) => {
  const f = useCurrentFrame();
  const m = MAT[mat];
  const bob = Math.sin(f / 18 + x * 0.01) * 14;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s,
        height: s,
        translate: `0px ${bob}px`,
        rotate: `${rot + Math.sin(f / 30 + y) * 2}deg`,
        filter: blur ? "blur(10px)" : undefined,
        opacity: (blur ? 0.7 : 1) * pop(f, at, 16).opacity,
        scale: pop(f, at, 16).scale,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "28%",
          background: m.bg,
          boxShadow: m.shadow,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "12%",
            right: "12%",
            top: "6%",
            height: "34%",
            borderRadius: "50%",
            background:
              "linear-gradient(180deg,rgba(255,255,255,.6),rgba(255,255,255,0))",
          }}
        />
      </div>
      <div style={{ position: "absolute", inset: "22%" }}>
        <Glyph g={g} f={m.f} a={m.a} size="100%" />
      </div>
      {slash > 0 ? (
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: "10%",
            width: "80%",
            height: "80%",
          }}
        >
          <line
            x1={14}
            y1={14}
            x2={14 + 72 * slash}
            y2={14 + 72 * slash}
            stroke={RED}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </div>
  );
};

/** Frosted glass card, facing the camera (tiny tilt only). */
const Glass: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  tilt?: number;
  children?: React.ReactNode;
  radius?: number;
}> = ({ x, y, w, h, at = 0, tilt = 0, children, radius = 44 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        background:
          "linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.04) 55%,rgba(255,255,255,.08))",
        border: "1.5px solid rgba(255,255,255,.22)",
        boxShadow:
          "0 50px 90px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.35)",
        overflow: "hidden",
        rotate: `${tilt + Math.sin(f / 40) * 0.6}deg`,
        scale: p.scale,
        opacity: p.opacity,
      }}
    >
      {children}
    </div>
  );
};

const PhotoIn: React.FC<{ src: string; pos?: string; inset?: number }> = ({
  src,
  pos = "50% 45%",
  inset = 20,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        inset,
        borderRadius: 28,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(`titanic/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          filter: "grayscale(1) contrast(1.12)",
          scale: String(1.04 + f * 0.0007),
        }}
      />
    </div>
  );
};

const Glow: React.FC<{
  x?: number;
  y?: number;
  r?: number;
  a?: number;
  color?: string;
}> = ({ x = 540, y = 640, r = 460, a = 0.08, color = "255,255,255" }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(${color},${a}), rgba(${color},0) 70%)`,
    }}
  />
);

/** Slow push-in; no sideways camera. */
const Cam: React.FC<{
  d: number;
  children: React.ReactNode;
  from?: number;
  to?: number;
}> = ({ d, children, from = 1, to = 1.13 }) => {
  const f = useCurrentFrame();
  const t = f / d;
  return (
    <AbsoluteFill
      style={{
        scale: String(from + (to - from) * t),
        translate: `0px ${-24 * t}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Stage: React.FC<{ children: React.ReactNode; glow?: number }> = ({
  children,
  glow = 0.08,
}) => (
  <AbsoluteFill style={{ background: "#050506" }}>
    <Glow a={glow} />
    {children}
  </AbsoluteFill>
);

/* ---------------- scenes ---------------- */
type S = { d: number };

const S1: React.FC<S> = ({ d }) => (
  <Stage>
    <Cam d={d}>
      <Glass x={100} y={330} w={880} h={560} at={2}>
        <PhotoIn src="ship.jpg" pos="50% 55%" />
      </Glass>
      <Icon g="ice" x={730} y={790} s={230} at={40} />
      <Icon g="buoy" x={50} y={140} s={150} rot={-14} blur />
      <Icon g="ship" x={860} y={1100} s={130} rot={12} blur />
    </Cam>
  </Stage>
);

const S2: React.FC<S> = ({ d }) => (
  <Stage>
    <Cam d={d} from={1.02} to={1.1}>
      <Glass x={70} y={260} w={940} h={620} at={0}>
        <PhotoIn src="ship.jpg" pos="40% 55%" />
      </Glass>
      <Icon g="shield" x={420} y={790} s={240} at={70} />
      <Icon g="ship" x={60} y={1040} s={120} blur rot={-8} />
      <Icon g="ice" x={880} y={150} s={120} blur rot={10} />
    </Cam>
  </Stage>
);

const S3: React.FC<S> = ({ d }) => {
  const spots: [number, number, number][] = [
    [90, 270, -10],
    [860, 250, 10],
    [70, 640, -6],
    [880, 620, 12],
    [150, 1000, -14],
    [820, 990, 8],
  ];
  return (
    <Stage>
      <Cam d={d}>
        <Glass x={240} y={230} w={600} h={800} at={0}>
          <PhotoIn src="smith.jpg" pos="50% 25%" />
        </Glass>
        {spots.map(([x, y, r], i) => (
          <Icon
            key={i}
            g="warn"
            mat="red"
            x={x}
            y={y}
            s={130}
            rot={r}
            at={14 + i * 12}
          />
        ))}
      </Cam>
    </Stage>
  );
};

const S4: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const ang =
    interpolate(f, [8, 60], [-120, 48], { ...clamp, easing: easeOut }) +
    Math.sin(f / 4) * 1.5;
  return (
    <Stage>
      {/* speed streaks */}
      <svg
        width={1080}
        height={1330}
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 120 + ((i * 137) % 1100);
          const x = 1200 - ((f * (22 + (i % 5) * 6) + i * 300) % 1700);
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x + 160 + (i % 4) * 60}
              y2={y}
              stroke="#fff"
              strokeOpacity={0.12 + (i % 3) * 0.06}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <Cam d={d}>
        <Glass x={240} y={300} w={600} h={600} at={0} radius={300}>
          <svg viewBox="0 0 600 600" width={600} height={600}>
            <path
              d="M120 400 A200 200 0 0 1 480 400"
              fill="none"
              stroke="rgba(255,255,255,.25)"
              strokeWidth={34}
              strokeLinecap="round"
            />
            <path
              d="M405 237 A200 200 0 0 1 480 400"
              fill="none"
              stroke={RED}
              strokeWidth={34}
              strokeLinecap="round"
            />
            <g transform={`rotate(${ang} 300 400)`}>
              <line
                x1={300}
                y1={400}
                x2={300}
                y2={230}
                stroke="#fff"
                strokeWidth={14}
                strokeLinecap="round"
              />
            </g>
            <circle cx={300} cy={400} r={26} fill="#fff" />
          </svg>
        </Glass>
        <Icon g="ice" x={760} y={980} s={150} blur rot={-8} />
        <Icon g="ship" x={80} y={180} s={130} blur rot={10} />
      </Cam>
    </Stage>
  );
};

const S5: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const kx = interpolate(f, [120, 170], [0, 700], {
    ...clamp,
    easing: easeInOut,
  });
  const ky = interpolate(f, [120, 170], [0, -500], {
    ...clamp,
    easing: easeInOut,
  });
  return (
    <Stage>
      <Cam d={d}>
        <Glass x={190} y={260} w={700} h={780} at={0}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 170px,rgba(255,255,255,0) 170px 180px)",
            }}
          />
        </Glass>
        <Icon g="bino" x={330} y={430} s={420} at={6} />
        <Icon g="lock" mat="red" x={690} y={780} s={210} rot={8} at={70} />
        <div
          style={{
            position: "absolute",
            left: 120 + kx,
            top: 1000 + ky,
            opacity: 1 - ease(f, 150, 175),
          }}
        >
          <Icon g="key" x={0} y={0} s={150} rot={-20} at={96} />
        </div>
      </Cam>
    </Stage>
  );
};

const S6: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Stage glow={0.04}>
      <Cam d={d}>
        <Icon g="moon" x={400} y={250} s={280} at={2} slash={ease(f, 40, 60)} />
        {/* perfectly flat sea */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 900,
            height: 3,
            background:
              "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.7),rgba(255,255,255,0))",
            opacity: ease(f, 20, 40),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: interpolate(f, [0, d], [140, 560]),
            top: 820,
            opacity: ease(f, 24, 40),
          }}
        >
          <Glyph g="ship" f="#d9d9de" a="#555" size={110} />
        </div>
        <Icon g="ice" x={830} y={760} s={150} at={60} mat="dark" />
      </Cam>
    </Stage>
  );
};

const S7: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [6, d - 6], [37, 0], clamp);
  const p = t / 37;
  const r = 250;
  const c = 2 * Math.PI * r;
  const late = t < 12;
  return (
    <Stage>
      <Cam d={d}>
        <Glass x={240} y={300} w={600} h={600} at={0} radius={300}>
          <svg viewBox="0 0 600 600" width={600} height={600}>
            <circle
              cx={300}
              cy={300}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,.15)"
              strokeWidth={22}
            />
            <circle
              cx={300}
              cy={300}
              r={r}
              fill="none"
              stroke={late ? RED : "#fff"}
              strokeWidth={22}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - p)}
              transform="rotate(-90 300 300)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 230,
              color: late ? RED : "#fff",
              letterSpacing: -8,
            }}
          >
            {Math.ceil(t)}
          </div>
        </Glass>
        <div
          style={{
            position: "absolute",
            left: interpolate(f, [0, d], [980, 760]),
            top: 960,
            scale: String(interpolate(f, [0, d], [0.7, 1.3])),
          }}
        >
          <Icon g="ice" x={0} y={0} s={170} />
        </div>
      </Cam>
    </Stage>
  );
};

const S8: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const n = 16;
  return (
    <Stage>
      <Cam d={d}>
        <Glass x={50} y={380} w={980} h={480} at={0}>
          <svg viewBox="0 0 980 480" width={980} height={480}>
            {[300, 400, 500, 600].map((x) => (
              <rect
                key={x}
                x={x}
                y={70}
                width={46}
                height={110}
                rx={6}
                fill="rgba(255,255,255,.75)"
              />
            ))}
            <path
              d="M60 180 L920 180 L870 380 L140 380 Z"
              fill="rgba(255,255,255,.08)"
              stroke="#fff"
              strokeWidth={4}
            />
            {Array.from({ length: n }).map((_, i) => {
              const x0 = 140 + i * (730 / n);
              const w = 730 / n;
              const flood =
                i >= n - 6
                  ? ease(f, 30 + (n - 1 - i) * 10, 50 + (n - 1 - i) * 10)
                  : 0;
              return (
                <g key={i}>
                  <rect
                    x={x0 + 2}
                    y={380 - 190 * flood}
                    width={w - 4}
                    height={190 * flood}
                    fill={RED}
                    opacity={0.85}
                  />
                  <line
                    x1={x0}
                    y1={190}
                    x2={x0}
                    y2={380}
                    stroke="rgba(255,255,255,.55)"
                    strokeWidth={3}
                  />
                </g>
              );
            })}
            <path
              d="M0 300 Q 245 290 490 300 T 980 300"
              fill="none"
              stroke="rgba(255,255,255,.35)"
              strokeWidth={3}
              strokeDasharray="10 10"
            />
          </svg>
        </Glass>
        <Icon g="warn" mat="red" x={820} y={880} s={160} rot={10} at={70} />
        <Icon g="ice" x={60} y={180} s={130} blur rot={-10} />
      </Cam>
    </Stage>
  );
};

const S9: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const off = f > 120;
  return (
    <Stage>
      <Cam d={d}>
        <Glass x={80} y={230} w={920} h={560} at={0}>
          <PhotoIn src="californian.jpg" pos="50% 50%" />
        </Glass>
        {/* Titanic calling */}
        <div style={{ position: "absolute", left: 140, top: 900 }}>
          <Glyph g="ship" f="#d9d9de" a="#555" size={130} />
          <svg
            width={600}
            height={300}
            style={{
              position: "absolute",
              left: 60,
              top: -80,
              overflow: "visible",
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => {
              const r = ((f * 4 + i * 60) % 240) + 20;
              return (
                <circle
                  key={i}
                  cx={40}
                  cy={110}
                  r={r}
                  fill="none"
                  stroke="#fff"
                  strokeOpacity={0.5 * (1 - r / 260)}
                  strokeWidth={3}
                />
              );
            })}
          </svg>
        </div>
        <Icon
          g="radio"
          mat={off ? "red" : "silver"}
          x={700}
          y={860}
          s={220}
          at={40}
          slash={ease(f, 120, 140)}
        />
      </Cam>
    </Stage>
  );
};

const S10: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Cam d={d}>
        <Glass x={90} y={170} w={900} h={460} at={0}>
          <PhotoIn src="lifeboat.jpg" pos="50% 50%" />
        </Glass>
        <Glass x={90} y={680} w={900} h={520} at={10}>
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 40,
              right: 50,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ opacity: ease(f, 16 + i * 2, 26 + i * 2) }}>
                <Glyph g="boat" f="#fff" a="#fff" size={62} />
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 220,
              right: 50,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {Array.from({ length: 60 }).map((_, i) => {
              const lost = i >= 30;
              const red = lost ? ease(f, 70 + (i - 30), 80 + (i - 30)) : 0;
              return (
                <div
                  key={i}
                  style={{ opacity: ease(f, 30 + i * 0.6, 40 + i * 0.6) }}
                >
                  <Glyph
                    g="person"
                    f={red > 0.5 ? RED : "#fff"}
                    a="#fff"
                    size={46}
                  />
                </div>
              );
            })}
          </div>
        </Glass>
      </Cam>
    </Stage>
  );
};

const S11: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Cam d={d}>
        <div
          style={{
            position: "absolute",
            left: 250,
            top: 140,
            opacity: ease(f, 0, 14),
            translate: `0px ${(1 - ease(f, 0, 24)) * 60}px`,
          }}
        >
          <Img
            src={staticFile("titanic/paperboy_cut.png")}
            style={{
              height: 1150,
              filter:
                "grayscale(1) contrast(1.12) drop-shadow(0 40px 60px rgba(0,0,0,.85))",
            }}
          />
        </div>
        <Icon g="warn" mat="red" x={820} y={380} s={160} rot={12} at={40} />
        <Icon g="person" x={70} y={300} s={140} blur rot={-10} />
        <Icon g="ship" x={60} y={950} s={130} blur rot={8} mat="dark" />
      </Cam>
    </Stage>
  );
};

const S12: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const items: { g: string; mat: Mat; slash?: boolean }[] = [
    { g: "warn", mat: "red" },
    { g: "lock", mat: "red" },
    { g: "gauge", mat: "silver" },
    { g: "moon", mat: "silver", slash: true },
    { g: "radio", mat: "red", slash: true },
    { g: "boat", mat: "silver" },
  ];
  const rot = f * 0.4;
  return (
    <Stage>
      <Cam d={d}>
        <Glass x={340} y={460} w={400} h={300} at={0}>
          <PhotoIn src="ship.jpg" pos="50% 55%" inset={14} />
        </Glass>
        {items.map((it, i) => {
          const a = ((i / items.length) * 360 + rot) * (Math.PI / 180);
          const x = 540 + Math.cos(a) * 400 - 80;
          const y = 610 + Math.sin(a) * 430 - 80;
          return (
            <Icon
              key={i}
              g={it.g}
              mat={it.mat}
              x={x}
              y={y}
              s={160}
              at={8 + i * 8}
              slash={it.slash ? 1 : 0}
            />
          );
        })}
      </Cam>
    </Stage>
  );
};

const S13: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const pressAt = 120;
  const pressed = f >= pressAt;
  const squash = 1 - 0.07 * Math.max(0, 1 - Math.abs(f - pressAt) / 5);
  const q = "qual erro foi o pior?";
  const n = Math.max(0, Math.floor((f - 14) * 0.9));
  return (
    <Stage glow={0.1}>
      <Cam d={d} from={1} to={1.04}>
        <Glass x={110} y={140} w={860} h={200} at={6} radius={36}>
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 40,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(160deg,#fff,#7d7d86)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 180,
              top: 46,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 30,
              color: "rgba(255,255,255,.55)",
            }}
          >
            você
          </div>
          <div
            style={{
              position: "absolute",
              left: 180,
              top: 88,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 48,
              color: "#fff",
            }}
          >
            {q.slice(0, n)}
            <span style={{ opacity: n < q.length ? 1 : 0 }}>|</span>
          </div>
        </Glass>
        <Glass x={120} y={420} w={840} h={820} at={60}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              fontFamily: SANS,
            }}
          >
            <div
              style={{
                width: 290,
                height: 290,
                borderRadius: "50%",
                padding: 8,
                background:
                  "conic-gradient(from 200deg,#ffffff,#9a9aa2,#ffffff,#5a5a62,#ffffff)",
                boxShadow: "0 0 60px rgba(255,255,255,.18)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "6px solid #050506",
                }}
              >
                <Img
                  src={staticFile("che/logo.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    scale: "1.15",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 64,
                letterSpacing: -1.5,
              }}
            >
              @quebra.padrao
            </div>
            <div
              style={{
                color: "rgba(255,255,255,.6)",
                fontWeight: 600,
                fontSize: 32,
              }}
            >
              Te explicando coisas em 1 minuto
            </div>
            <div
              style={{
                marginTop: 12,
                width: 600,
                padding: "28px 0",
                textAlign: "center",
                borderRadius: 24,
                scale: String(squash),
                background: pressed
                  ? "rgba(255,255,255,.1)"
                  : "linear-gradient(160deg,#ffffff,#d9d9de 60%,#9d9da5)",
                border: pressed ? "1.5px solid rgba(255,255,255,.3)" : "none",
                color: pressed ? "#fff" : "#0b0b0d",
                fontWeight: 800,
                fontSize: 48,
              }}
            >
              {pressed ? "Seguindo" : "Seguir"}
            </div>
          </div>
        </Glass>
      </Cam>
    </Stage>
  );
};

/* ---------------- timeline ---------------- */
/** Caption pages per scene. **x** = white emphasis, [[x]] = red (negative). */
const SCENES: {
  C: React.FC<S>;
  s: number;
  caps: string[];
  t: "zoom" | "up" | "fade" | "flash";
}[] = [
  {
    C: S1,
    s: 4.2,
    caps: ["O Titanic não afundou", "só por causa de um **iceberg**."],
    t: "zoom",
  },
  {
    C: S2,
    s: 5.4,
    caps: [
      "Em 1912, era o **maior navio** do mundo.",
      "Diziam que era impossível afundar.",
    ],
    t: "zoom",
  },
  {
    C: S3,
    s: 4.6,
    caps: ["Naquele dia, o navio recebeu", "[[seis alertas]] de gelo."],
    t: "up",
  },
  {
    C: S4,
    s: 4.2,
    caps: ["Mesmo assim, seguia a mais", "de **40 km/h** no escuro."],
    t: "zoom",
  },
  {
    C: S5,
    s: 6.4,
    caps: [
      "Os vigias procuravam gelo a olho nu.",
      "Os **binóculos** estavam [[trancados]]",
      "e a chave ficou com um oficial que desembarcou.",
    ],
    t: "fade",
  },
  {
    C: S6,
    s: 5.0,
    caps: ["A noite estava [[sem lua]]", "e o mar, sem ondas."],
    t: "zoom",
  },
  {
    C: S7,
    s: 4.2,
    caps: ["Quando o iceberg apareceu,", "faltavam só **37 segundos**."],
    t: "flash",
  },
  {
    C: S8,
    s: 5.2,
    caps: [
      "A batida abriu mais compartimentos",
      "do que o navio [[aguentava]].",
    ],
    t: "up",
  },
  {
    C: S9,
    s: 6.2,
    caps: [
      "Perto dali, outro navio",
      "poderia ajudar.",
      "Mas o rádio dele estava [[desligado]].",
    ],
    t: "zoom",
  },
  {
    C: S10,
    s: 4.6,
    caps: ["E só havia **botes**", "para [[metade]] das pessoas."],
    t: "fade",
  },
  {
    C: S11,
    s: 5.2,
    caps: [
      "Em menos de três horas, ele afundou.",
      "Mais de [[1.500]] pessoas não voltaram.",
    ],
    t: "zoom",
  },
  {
    C: S12,
    s: 4.6,
    caps: ["Não foi um erro só.", "Foram **vários**, ao mesmo tempo."],
    t: "up",
  },
  {
    C: S13,
    s: 6.8,
    caps: ["Qual foi o pior? **Comenta** aí.", "E segue o **@quebra.padrao**."],
    t: "zoom",
  },
];
const TF = 14;
export const titanicFrames = (fps: number) =>
  Math.round(SCENES.reduce((a, b) => a + b.s, 0) * fps);

const Trans: React.FC<{
  len: number;
  tin?: string;
  tout?: string;
  children: React.ReactNode;
}> = ({ len, tin, tout, children }) => {
  const f = useCurrentFrame();
  const pin = tin
    ? interpolate(f, [0, TF], [0, 1], { ...clamp, easing: easeInOut })
    : 1;
  const pout = tout
    ? interpolate(f, [len - TF, len], [0, 1], { ...clamp, easing: easeInOut })
    : 0;
  let scale = 1;
  let ty = 0;
  let blur = 0;
  let op = 1;
  let flash = 0;
  if (tin === "zoom") {
    scale *= 0.8 + 0.2 * pin;
    op *= pin;
    blur += (1 - pin) * 14;
  }
  if (tin === "up") {
    ty += (1 - pin) * 1920;
    blur += Math.sin(pin * Math.PI) * 16;
  }
  if (tin === "fade") op *= pin;
  if (tin === "flash") {
    op *= interpolate(pin, [0.45, 0.55], [0, 1], clamp);
    flash = 1 - Math.abs(pin * 2 - 1);
  }
  if (tout === "zoom") {
    scale *= 1 + pout * 0.8;
    blur += pout * 14;
  }
  if (tout === "up") {
    ty -= pout * 1920;
    blur += Math.sin(pout * Math.PI) * 16;
  }
  return (
    <>
      <AbsoluteFill
        style={{
          opacity: op,
          scale: String(scale),
          translate: `0px ${ty}px`,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      {flash > 0 ? (
        <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      ) : null}
    </>
  );
};

const renderCap = (text: string, prog: number) => {
  const tokens: { w: string; k: "n" | "b" | "r" }[] = [];
  const re = /\*\*(.+?)\*\*|\[\[(.+?)\]\]|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m[1]) m[1].split(" ").forEach((w) => tokens.push({ w, k: "b" }));
    else if (m[2]) m[2].split(" ").forEach((w) => tokens.push({ w, k: "r" }));
    else tokens.push({ w: m[3], k: "n" });
  }
  // attach punctuation tokens like "." that follow markup
  return tokens.map((tk, i) => {
    const p = Math.max(0, Math.min(1, prog * tokens.length * 1.6 - i));
    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          marginRight: /^[.,:?!]/.test(tokens[i + 1]?.w ?? "") ? 0 : 16,
          opacity: 0.15 + 0.85 * p,
          filter: `blur(${(1 - p) * 4}px)`,
          translate: `0px ${(1 - p) * 8}px`,
          color:
            tk.k === "r"
              ? RED
              : tk.k === "b"
                ? "#ffffff"
                : "rgba(255,255,255,.74)",
        }}
      >
        {tk.w}
      </span>
    );
  });
};

const CaptionTrack: React.FC<{ caps: string[]; len: number }> = ({
  caps,
  len,
}) => {
  const f = useCurrentFrame();
  const per = len / caps.length;
  const i = Math.min(caps.length - 1, Math.floor(f / per));
  const local = f - i * per;
  const prog = local / (per * 0.75);
  const fade = Math.min(ease(local, 0, 5), 1 - ease(local, per - 5, per));
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1400,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 62,
        lineHeight: 1.18,
        letterSpacing: -1.2,
        opacity: fade,
      }}
    >
      {renderCap(caps[i], prog)}
    </div>
  );
};

export const Titanic: React.FC = () => {
  const { fps } = useVideoConfig();
  let acc = 0;
  return (
    <AbsoluteFill style={{ background: "#050506" }}>
      {SCENES.map(({ C, s, t }, i) => {
        const start = Math.round(acc * fps);
        acc += s;
        const end = Math.round(acc * fps);
        const from = i === 0 ? 0 : start - TF / 2;
        const to = i === SCENES.length - 1 ? end : end + TF / 2;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={to - from}
            name={`Cena ${i + 1}`}
          >
            <Trans
              len={to - from}
              tin={i > 0 ? SCENES[i - 1].t : undefined}
              tout={i < SCENES.length - 1 ? t : undefined}
            >
              <C d={to - from} />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: BAND_TOP - 90,
                  height: 90,
                  background: "linear-gradient(180deg,rgba(5,5,6,0),#050506)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: BAND_TOP,
                  bottom: 0,
                  background: "#050506",
                }}
              />
            </Trans>
          </Sequence>
        );
      })}
      {(() => {
        let a = 0;
        return SCENES.map(({ s, caps }, i) => {
          const start = Math.round(a * fps);
          a += s;
          const len = Math.round(a * fps) - start;
          return (
            <Sequence
              key={`c${i}`}
              from={start}
              durationInFrames={len}
              name={`Legenda ${i + 1}`}
            >
              <CaptionTrack caps={caps} len={len} />
            </Sequence>
          );
        });
      })()}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
