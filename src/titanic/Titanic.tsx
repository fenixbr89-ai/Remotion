/**
 * "Por que o Titanic afundou" — black & white 3D motion for @quebra.padrao.
 *  - visuals are driven by the caption words (each element enters on its word);
 *  - the camera moves (push, pull, pan, slight roll) on the beats;
 *  - every scene opens the next one (match, dive, shrink/grow, iris, pan, flash).
 */
import React, { createContext, useContext } from "react";
import {
  AbsoluteFill,
  Audio,
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
import { Glass, Glow, Glyph, Icon, Mat, PhotoIn, RED } from "./kit";
import { NARRATION_END, WORD_TIMES } from "./narration";

loadFonts();

const FPS = 30;
const TF = 16; // transition overlap (frames)
const BAND_TOP = 1330;

/* ---------------- words & timing ---------------- */
type Tok = { w: string; k: "n" | "b" | "r" };
type Word = Tok & { t: number; page: number };
const norm = (w: string) =>
  w
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9@]/g, "");

const parse = (page: string): Tok[] => {
  const out: Tok[] = [];
  const re = /\*\*(.+?)\*\*([.,:?!]*)|\[\[(.+?)\]\]([.,:?!]*)|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(page))) {
    if (m[1]) {
      const ws = m[1].split(" ");
      ws.forEach((w, i) =>
        out.push({ w: i === ws.length - 1 ? w + m![2] : w, k: "b" }),
      );
    } else if (m[3]) {
      const ws = m[3].split(" ");
      ws.forEach((w, i) =>
        out.push({ w: i === ws.length - 1 ? w + m![4] : w, k: "r" }),
      );
    } else out.push({ w: m[5], k: "n" });
  }
  return out;
};

const timeline = (pages: string[]) => {
  let t = 0.3;
  const words: Word[] = [];
  const pageStart: number[] = [];
  pages.forEach((pg, pi) => {
    pageStart.push(t);
    parse(pg).forEach((tk) => {
      words.push({ ...tk, t, page: pi });
      let d = 0.27 + 0.024 * tk.w.length;
      if (/,$/.test(tk.w)) d += 0.14;
      if (/[.?!:]$/.test(tk.w)) d += 0.34;
      t += d;
    });
    t += 0.1;
  });
  return { words, pageStart, dur: t + 0.35 };
};

const BeatCtx = createContext<{ words: Word[]; offset: number }>({
  words: [],
  offset: 0,
});
/** b("iceberg") → local frame where that word is spoken. */
const useBeat = () => {
  const { words, offset } = useContext(BeatCtx);
  return (key: string, nth = 0) => {
    const k = norm(key);
    const hits = words.filter((w) => norm(w.w).startsWith(k));
    const w = hits[Math.min(nth, hits.length - 1)];
    return w ? offset + Math.round(w.t * FPS) : offset;
  };
};

/* ---------------- camera ---------------- */
type CamKey = { f: number; s?: number; x?: number; y?: number; r?: number };
const Camera: React.FC<{
  keys: CamKey[];
  d: number;
  children: React.ReactNode;
}> = ({ keys, d, children }) => {
  const f = useCurrentFrame();
  const ks = [...keys].sort((a, b) => a.f - b.f);
  const val = (prop: "s" | "x" | "y" | "r", def: number) => {
    const pts = ks.map((k) => ({ f: k.f, v: k[prop] }));
    let last = { f: 0, v: def };
    const filled = pts.map((p) => {
      last = { f: p.f, v: p.v ?? last.v };
      return last;
    });
    if (f <= filled[0].f) return filled[0].v;
    for (let i = 0; i < filled.length - 1; i++) {
      const a = filled[i];
      const b = filled[i + 1];
      if (f <= b.f)
        return (
          a.v +
          (b.v - a.v) *
            easeInOut(
              Math.max(0, Math.min(1, (f - a.f) / Math.max(1, b.f - a.f))),
            )
        );
    }
    return filled[filled.length - 1].v;
  };
  const drift = 1 + 0.04 * (f / d);
  return (
    <AbsoluteFill
      style={{
        scale: String(val("s", 1) * drift),
        translate: `${val("x", 0)}px ${val("y", 0)}px`,
        rotate: `${val("r", 0)}deg`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Bg: React.FC<{ glow?: number; children: React.ReactNode }> = ({
  glow = 0.08,
  children,
}) => (
  <AbsoluteFill style={{ background: "#050506" }}>
    <Glow a={glow} />
    {children}
  </AbsoluteFill>
);

const at = (f: number, a: number, b: number, from = 0, to = 1) =>
  ease(f, a, b, from, to, easeInOut);

/* ---------------- scenes ---------------- */
type S = { d: number };

/** Titanic → iceberg → maior navio → impossível afundar (shield). */
const A: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tT = b("titanic");
  const tI = b("iceberg");
  const tM = b("maior");
  const tImp = b("impossivel");
  const iceY = interpolate(
    f,
    [tI - 4, tI + 18, tM - 10, tM + 14],
    [1500, 640, 640, 1600],
    { ...clamp, easing: easeInOut },
  );
  const grow = at(f, tM, tM + 24, 1, 1.12);
  const flip = at(f, d - 16, d - 8, 0, 90);
  return (
    <Bg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.35, y: 60 },
          { f: tT + 12, s: 1, y: 0 },
          { f: tI, s: 1, r: 0 },
          { f: tI + 22, s: 1.08, y: -40, r: -1.5 },
          { f: tM, s: 1, y: 0, r: 0 },
          { f: tImp, s: 1.05 },
          { f: tImp + 24, s: 1.22, y: -50 },
        ]}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            scale: String(grow),
            opacity: 1 - at(f, d - 30, d - 14),
          }}
        >
          <Glass x={100} y={300} w={880} h={560} at={tT - 6}>
            <PhotoIn src="ship.jpg" pos="50% 55%" />
          </Glass>
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: iceY,
            width: 960,
            opacity: ease(f, tI - 4, tI + 6),
          }}
        >
          <Img
            src={staticFile("titanic/iceberg_cut.png")}
            style={{
              width: "100%",
              filter:
                "grayscale(1) contrast(1.1) drop-shadow(0 40px 60px rgba(0,0,0,.8))",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 425,
            top: 800,
            transform: `perspective(900px) rotateY(${flip}deg)`,
          }}
        >
          <Icon g="shield" x={0} y={0} s={230} at={tImp} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - at(f, d - 30, d - 14),
          }}
        >
          <Icon g="buoy" x={50} y={140} s={150} rot={-14} blur at={tT} />
          <Icon g="ship" x={860} y={1100} s={130} rot={12} blur at={tT + 6} />
        </div>
      </Camera>
    </Bg>
  );
};

/** The shield flips into a red alert; six alerts surround the captain. */
const B: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tN = b("navio");
  const tS = b("seis");
  const flip = at(f, 8, 16, 90, 0);
  const move = at(f, tN, tN + 20);
  const spots: [number, number, number][] = [
    [860, 250, 10],
    [70, 640, -6],
    [880, 620, 12],
    [150, 1000, -14],
    [820, 990, 8],
  ];
  return (
    <Bg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.22, y: -50 },
          { f: tN + 20, s: 1, y: 0 },
          { f: tS + 24, s: 1.08, r: 1 },
        ]}
      >
        <Glass x={240} y={230} w={600} h={800} at={tN}>
          <PhotoIn src="smith.jpg" pos="50% 25%" />
        </Glass>
        <div
          style={{
            position: "absolute",
            left: interpolate(move, [0, 1], [425, 90]),
            top: interpolate(move, [0, 1], [800, 270]),
            scale: String(interpolate(move, [0, 1], [1, 130 / 230])),
            transformOrigin: "0 0",
            transform: `perspective(900px) rotateY(${flip}deg)`,
          }}
        >
          <Icon g="warn" mat="red" x={0} y={0} s={230} />
        </div>
        {spots.map(([x, y, r], i) => (
          <Icon
            key={i}
            g="warn"
            mat="red"
            x={x}
            y={y}
            s={130}
            rot={r}
            at={tS + i * 5}
          />
        ))}
      </Camera>
    </Bg>
  );
};

/** Speed gauge: needle into the red on "40", lights dim on "escuro". */
const C: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const t40 = b("40");
  const tE = b("escuro");
  const ang =
    interpolate(f, [t40 - 8, t40 + 20], [-120, 48], {
      ...clamp,
      easing: easeOut,
    }) + (f > t40 + 20 ? Math.sin(f / 3) * 1.5 : 0);
  const speed = 10 + at(f, t40, t40 + 20) * 30;
  const dark = at(f, tE, tE + 20, 0, 0.5);
  return (
    <Bg>
      <svg
        width={1080}
        height={1330}
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 120 + ((i * 137) % 1100);
          const x = 1200 - ((f * (speed + (i % 5) * 6) + i * 300) % 1700);
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x + 160 + (i % 4) * 60}
              y2={y}
              stroke="#fff"
              strokeOpacity={0.1 + (i % 3) * 0.06}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1 },
          { f: t40, s: 1.04 },
          { f: t40 + 26, s: 1.16, r: 1.2 },
          { f: d - 10, s: 1.24, r: 0 },
        ]}
      >
        <Glass x={240} y={300} w={600} h={600} radius={300}>
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
              opacity={ease(f, t40 + 6, t40 + 16)}
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
      </Camera>
      <AbsoluteFill style={{ background: "#000", opacity: dark }} />
    </Bg>
  );
};

/** Lookout eye → binoculars → red lock → key leaves. */
const D: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tB = b("binoculos");
  const tTr = b("trancados");
  const tCh = b("chave");
  const tDes = b("desembarcou");
  const eyeOut = at(f, tB - 6, tB + 10);
  const keyFly = at(f, tDes, tDes + 26);
  return (
    <Bg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1 },
          { f: tB, s: 1.12 },
          { f: tTr, s: 1 },
          { f: tTr + 16, s: 1.08, x: -30 },
          { f: tDes, s: 1.04, x: 40 },
          { f: d - 4, s: 1.12, x: 0 },
        ]}
      >
        <div
          style={{
            position: "absolute",
            left: 390,
            top: 500,
            opacity: 1 - eyeOut,
            scale: String(1 - 0.5 * eyeOut),
          }}
        >
          <Icon g="eye" x={0} y={0} s={300} />
        </div>
        <Glass x={190} y={260} w={700} h={780} at={tB - 4}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 170px,rgba(255,255,255,0) 170px 180px)",
            }}
          />
        </Glass>
        <Icon g="bino" x={330} y={430} s={420} at={tB} />
        <Icon g="lock" mat="red" x={690} y={780} s={210} rot={8} at={tTr} />
        <div
          style={{
            position: "absolute",
            left: 140 + keyFly * 900,
            top: 1000 - keyFly * 900,
            opacity: 1 - ease(f, tDes + 18, tDes + 26),
          }}
        >
          <Icon g="key" x={0} y={0} s={150} rot={-20} at={tCh} />
        </div>
      </Camera>
    </Bg>
  );
};

/** Through the lens: night without moon, flat sea, the iceberg, 37 seconds. */
const E: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tL = b("lua");
  const tO = b("ondas");
  const tI = b("iceberg");
  const t37 = b("37");
  const shipX = interpolate(f, [tO, d], [60, 470], clamp);
  const iceRise = at(f, tI - 2, tI + 18);
  const left = interpolate(f, [t37, d - 2], [37, 0], clamp);
  const c = 2 * Math.PI * 150;
  return (
    <Bg glow={0.03}>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.15 },
          { f: tO, s: 1 },
          { f: tI, s: 1 },
          { f: tI + 22, s: 1.12, x: -60, y: 20 },
          { f: d, s: 1.3, x: -140, y: 30 },
        ]}
      >
        <Icon
          g="moon"
          x={110}
          y={170}
          s={220}
          at={b("noite")}
          slash={ease(f, tL + 4, tL + 20)}
        />
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 880,
            height: 3,
            width: 1000 * ease(f, tO - 4, tO + 20),
            background:
              "linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,.75),rgba(255,255,255,.1))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: shipX,
            top: 790,
            opacity: ease(f, tO, tO + 10),
          }}
        >
          <Glyph g="ship" f="#d9d9de" a="#555" size={110} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 600,
            top: 882 - 190 * iceRise,
            width: 440,
            height: 190 * iceRise,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("titanic/iceberg_cut.png")}
            style={{
              width: 440,
              position: "absolute",
              top: 0,
              filter: "grayscale(1) brightness(.95)",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 600,
            top: 140,
            ...pop(f, t37, 16),
          }}
        >
          <Glass x={0} y={0} w={380} h={380} radius={190}>
            <svg viewBox="0 0 380 380" width={380} height={380}>
              <circle
                cx={190}
                cy={190}
                r={150}
                fill="none"
                stroke="rgba(255,255,255,.15)"
                strokeWidth={16}
              />
              <circle
                cx={190}
                cy={190}
                r={150}
                fill="none"
                stroke={left < 12 ? RED : "#fff"}
                strokeWidth={16}
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={c * (1 - left / 37)}
                transform="rotate(-90 190 190)"
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
                fontSize: 150,
                color: left < 12 ? RED : "#fff",
                letterSpacing: -6,
              }}
            >
              {Math.ceil(left)}
            </div>
          </Glass>
        </div>
      </Camera>
    </Bg>
  );
};

/** Impact → hull cross-section floods from the bow. */
const F: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tA = b("abriu");
  const tAg = b("aguentava");
  const n = 16;
  return (
    <Bg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.7, x: -320 },
          { f: tA + 10, s: 1.6, x: -300 },
          { f: tAg - 10, s: 1.15, x: -100 },
          { f: tAg + 10, s: 1, x: 0 },
        ]}
      >
        <Glass x={50} y={380} w={980} h={480}>
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
              const k = n - 1 - i; // bow first
              const flood =
                k < 6
                  ? at(
                      f,
                      tA + k * ((tAg - tA) / 6),
                      tA + k * ((tAg - tA) / 6) + 16,
                    )
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
        <Icon g="warn" mat="red" x={820} y={880} s={160} rot={10} at={tAg} />
      </Camera>
    </Bg>
  );
};

/** Pan to the Californian: radio waves go out, its radio is off. */
const Gs: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tNv = b("navio");
  const tR = b("radio");
  const tD = b("desligado");
  const off = f > tD;
  const ringsOn = 1 - ease(f, tD + 10, tD + 30);
  return (
    <Bg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.1, x: 220 },
          { f: tNv, s: 1, x: 0 },
          { f: tR, s: 1.05, x: -60, y: -40 },
          { f: tD + 12, s: 1.14, x: -130, y: -70 },
        ]}
      >
        <Glass x={80} y={230} w={920} h={560} at={tNv}>
          <PhotoIn src="californian.jpg" pos="50% 50%" />
        </Glass>
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
              opacity: ringsOn,
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
          at={tR}
          slash={ease(f, tD, tD + 16)}
        />
      </Camera>
    </Bg>
  );
};

/** Lifeboats for half of the people. */
const H: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tBo = b("botes");
  const tMe = b("metade");
  return (
    <Bg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.05, y: 140 },
          { f: tBo, s: 1.05, y: -40 },
          { f: tMe, s: 1.12, y: -150 },
        ]}
      >
        <Glass x={90} y={170} w={900} h={460}>
          <PhotoIn src="lifeboat.jpg" pos="50% 50%" />
        </Glass>
        <Glass x={90} y={680} w={900} h={520} at={tBo - 4}>
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
              <div key={i} style={{ opacity: ease(f, tBo + i, tBo + i + 8) }}>
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
              const red =
                i >= 30
                  ? ease(f, tMe + (i - 30) * 0.5, tMe + (i - 30) * 0.5 + 6)
                  : 0;
              return (
                <div
                  key={i}
                  style={{
                    opacity: ease(f, tBo + 8 + i * 0.4, tBo + 16 + i * 0.4),
                  }}
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
      </Camera>
    </Bg>
  );
};

/** Clock spins (three hours), the ship sinks, then the paperboy and the toll. */
const I: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tTr = b("tres");
  const tAf = b("afundou");
  const t15 = b("1500");
  const sink = at(f, tAf, tAf + 40);
  const hand = (f - tTr) * 9;
  return (
    <Bg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.05 },
          { f: tAf, s: 1 },
          { f: tAf + 30, s: 1.08, r: 1.5, y: 40 },
          { f: t15, s: 1, r: 0, y: 0 },
          { f: d, s: 1.06 },
        ]}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - sink,
            translate: `0px ${sink * 700}px`,
            rotate: `${sink * 12}deg`,
          }}
        >
          <Glass x={140} y={450} w={800} h={480}>
            <PhotoIn src="ship.jpg" pos="45% 55%" />
          </Glass>
        </div>
        <div
          style={{
            position: "absolute",
            left: 420,
            top: 140,
            opacity: 1 - ease(f, t15 - 10, t15),
          }}
        >
          <Icon g="clock" x={0} y={0} s={240} at={tTr - 4} />
          <svg
            viewBox="0 0 100 100"
            width={240}
            height={240}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <g transform={`translate(50 50) rotate(${hand})`}>
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={-22}
                stroke="#8a8a92"
                strokeWidth={5}
                strokeLinecap="round"
              />
            </g>
            <g transform={`translate(50 50) rotate(${hand / 12})`}>
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={-14}
                stroke="#17171b"
                strokeWidth={6}
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            left: 250,
            top: 150,
            opacity: ease(f, t15 - 6, t15 + 8),
            translate: `0px ${(1 - ease(f, t15 - 6, t15 + 24)) * 260}px`,
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
        <Icon
          g="warn"
          mat="red"
          x={820}
          y={380}
          s={160}
          rot={12}
          at={t15 + 10}
        />
      </Camera>
    </Bg>
  );
};

/** One error… then all of them orbit the ship. */
const J: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tE = b("erro");
  const tV = b("varios");
  const items: { g: string; mat: Mat; slash?: boolean }[] = [
    { g: "warn", mat: "red" },
    { g: "lock", mat: "red" },
    { g: "gauge", mat: "silver" },
    { g: "moon", mat: "silver", slash: true },
    { g: "radio", mat: "red", slash: true },
    { g: "boat", mat: "silver" },
  ];
  const burst = at(f, tV - 2, tV + 22);
  const rot = f * 0.5;
  return (
    <Bg>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.25 },
          { f: tV, s: 1 },
          { f: d, s: 1.06, r: 2 },
        ]}
      >
        <Glass x={340} y={460} w={400} h={300}>
          <PhotoIn src="ship.jpg" pos="50% 55%" inset={14} />
        </Glass>
        <div
          style={{
            position: "absolute",
            left: 460,
            top: 180,
            opacity: 1 - burst,
          }}
        >
          <Icon g="warn" mat="red" x={0} y={0} s={160} at={tE} />
        </div>
        {items.map((it, i) => {
          const a = ((i / items.length) * 360 + rot) * (Math.PI / 180);
          const x = 540 + Math.cos(a) * 400 * burst - 80;
          const y = 610 + Math.sin(a) * 430 * burst - 80;
          return (
            <div
              key={i}
              style={{ position: "absolute", left: x, top: y, opacity: burst }}
            >
              <Icon
                g={it.g}
                mat={it.mat}
                x={0}
                y={0}
                s={160}
                slash={it.slash ? 1 : 0}
              />
            </div>
          );
        })}
      </Camera>
    </Bg>
  );
};

/** Final hook: comment + profile card. */
const K: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const b = useBeat();
  const tSe = b("segue");
  const tQ = b("@quebra");
  const pressAt = tQ + 12;
  const pressed = f >= pressAt;
  const squash = 1 - 0.07 * Math.max(0, 1 - Math.abs(f - pressAt) / 5);
  const q = "qual erro foi o pior?";
  const n = Math.max(0, Math.floor((f - 10) * 0.9));
  return (
    <Bg glow={0.1}>
      <Camera
        d={d}
        keys={[
          { f: 0, s: 1.12, y: 160 },
          { f: tSe - 6, s: 1.08, y: 140 },
          { f: tSe + 14, s: 1, y: 0 },
        ]}
      >
        <Glass x={110} y={140} w={860} h={200} at={2} radius={36}>
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
        <Glass x={120} y={420} w={840} h={820} at={tSe - 8}>
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
      </Camera>
    </Bg>
  );
};

/* ---------------- script, transitions, timeline ---------------- */
type Tr = {
  type: "match" | "dive" | "shrink" | "iris" | "pan" | "flash" | "up";
  p?: [number, number];
  q?: [number, number];
};

/** **x** = white emphasis, [[x]] = red (negative). Max ~40 chars per page (2 lines). */
const SCENES: { C: React.FC<S>; pages: string[]; out?: Tr; lead?: number }[] = [
  {
    C: A,
    pages: [
      "O **Titanic** não afundou",
      "só por causa de um **iceberg**.",
      "Em 1912, era o **maior navio** do mundo.",
      "Diziam que era **impossível** afundar.",
    ],
    out: { type: "match" },
  },
  {
    C: B,
    pages: ["Naquele dia, o navio recebeu", "[[seis alertas]] de gelo."],
    out: { type: "shrink", p: [540, 630], q: [540, 600] },
  },
  {
    C: C,
    pages: ["Mesmo assim, seguia a mais", "de **40 km/h** no escuro."],
    out: { type: "dive", p: [540, 700], q: [540, 650] },
  },
  {
    C: D,
    pages: [
      "Os vigias procuravam gelo **a olho nu**.",
      "Os **binóculos** estavam [[trancados]]",
      "e a chave ficou com um oficial que desembarcou.",
    ],
    out: { type: "iris", p: [591, 672], q: [591, 672] },
  },
  {
    C: E,
    pages: [
      "A noite estava [[sem lua]]",
      "e o mar, **sem ondas**.",
      "Quando o **iceberg** apareceu,",
      "faltavam só [[37 segundos]].",
    ],
    out: { type: "flash" },
  },
  {
    C: F,
    pages: [
      "A batida abriu mais compartimentos",
      "do que o navio [[aguentava]].",
    ],
    out: { type: "pan" },
  },
  {
    C: Gs,
    pages: [
      "Perto dali, outro **navio**",
      "poderia ajudar.",
      "Mas o rádio dele estava [[desligado]].",
    ],
    out: { type: "shrink", p: [200, 965], q: [540, 400] },
  },
  {
    C: H,
    lead: 1,
    pages: ["E só havia **botes**", "para [[metade]] das pessoas."],
    out: { type: "up" },
  },
  {
    C: I,
    pages: [
      "Em menos de **três horas**, ele afundou.",
      "Mais de [[1.500]] pessoas não voltaram.",
    ],
    out: { type: "shrink", p: [540, 640], q: [540, 610] },
  },
  {
    C: J,
    pages: ["Não foi um erro só.", "Foram **vários**, ao mesmo tempo."],
    out: { type: "shrink", p: [540, 610], q: [540, 760] },
  },
  {
    C: K,
    pages: [
      "Qual foi o pior? **Comenta** aí.",
      "E segue o **@quebra.padrao**.",
    ],
  },
];

/** Scene timing comes from the recorded narration (word start times). */
const PLAN = (() => {
  let k = 0;
  const raw = SCENES.map((sc) => {
    const tl = timeline(sc.pages);
    const abs = tl.words.map(() => WORD_TIMES[k++]);
    return { sc, tl, abs };
  });
  // a scene may open on a later word (e.g. skip a connector "E" said right after the previous line)
  const starts = raw.map((r, i) =>
    i === 0 ? 0 : r.abs[r.sc.lead ?? 0] - 0.25,
  );
  return raw.map(({ sc, tl, abs }, i) => {
    const s0 = starts[i];
    const s1 = i < raw.length - 1 ? starts[i + 1] : NARRATION_END + 1.6;
    const words = tl.words.map((w, j) => ({ ...w, t: abs[j] - s0 }));
    const pageStart = tl.pageStart.map((_, pi) => {
      const first = words.find((w) => w.page === pi);
      return first ? first.t - 0.05 : 0;
    });
    return {
      ...sc,
      tl: { words, pageStart, dur: s1 - s0 },
      start: Math.round(s0 * FPS),
      end: Math.round(s1 * FPS),
    };
  });
})();
export const titanicFrames = () => PLAN[PLAN.length - 1].end;

const around = (p: [number, number], s: number) =>
  `translate(${p[0]}px, ${p[1]}px) scale(${s}) translate(${-p[0]}px, ${-p[1]}px)`;

const Trans: React.FC<{
  len: number;
  tin?: Tr;
  tout?: Tr;
  children: React.ReactNode;
}> = ({ len, tin, tout, children }) => {
  const f = useCurrentFrame();
  const pin = tin
    ? interpolate(f, [0, TF], [0, 1], { ...clamp, easing: easeInOut })
    : 1;
  const pout = tout
    ? interpolate(f, [len - TF, len], [0, 1], { ...clamp, easing: easeInOut })
    : 0;
  const tf: string[] = [];
  let op = 1;
  let blur = 0;
  let flash = 0;
  let clip: string | undefined;
  if (tin) {
    const q = tin.q ?? [540, 640];
    if (tin.type === "match") op *= ease(f, 6, 8);
    if (tin.type === "dive") {
      tf.push(around(q, 6 - 5 * pin));
      op *= ease(pin, 0, 0.35);
      blur += (1 - pin) * 10;
    }
    if (tin.type === "shrink") {
      tf.push(around(q, 0.05 + 0.95 * pin));
      op *= ease(pin, 0, 0.25);
    }
    if (tin.type === "iris")
      clip = `circle(${pin * 1500}px at ${q[0]}px ${q[1]}px)`;
    if (tin.type === "pan") {
      tf.push(`translateX(${(1 - pin) * 1080}px)`);
      blur += Math.sin(pin * Math.PI) * 12;
    }
    if (tin.type === "up") {
      tf.push(`translateY(${(1 - pin) * 1920}px)`);
      blur += Math.sin(pin * Math.PI) * 14;
    }
    if (tin.type === "flash") {
      op *= interpolate(pin, [0.45, 0.55], [0, 1], clamp);
      flash = 1 - Math.abs(pin * 2 - 1);
    }
  }
  if (tout && pout > 0) {
    const p = tout.p ?? [540, 640];
    if (tout.type === "dive") {
      tf.push(around(p, 1 + 7 * pout * pout));
      op *= 1 - ease(pout, 0.7, 1);
      blur += pout * 8;
    }
    if (tout.type === "shrink") {
      tf.push(around(p, 1 - 0.95 * pout));
      op *= 1 - ease(pout, 0.75, 1);
    }
    if (tout.type === "iris") {
      tf.push(around(p, 1 + 3 * pout));
    }
    if (tout.type === "pan") {
      tf.push(`translateX(${-pout * 1080}px)`);
      blur += Math.sin(pout * Math.PI) * 12;
    }
    if (tout.type === "up") {
      tf.push(`translateY(${-pout * 1920}px)`);
      blur += Math.sin(pout * Math.PI) * 14;
    }
  }
  return (
    <>
      <AbsoluteFill
        style={{
          opacity: op,
          transform: tf.join(" ") || undefined,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
          clipPath: clip,
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

const Captions: React.FC<{
  words: Word[];
  pageStart: number[];
  len: number;
}> = ({ words, pageStart, len }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let page = 0;
  pageStart.forEach((s, i) => {
    if (t >= s - 0.05) page = i;
  });
  const pEnd = page < pageStart.length - 1 ? pageStart[page + 1] : len / FPS;
  const fade = Math.min(
    ease(t, pageStart[page] - 0.1, pageStart[page] + 0.05),
    1 - ease(t, pEnd - 0.12, pEnd),
  );
  const ws = words.filter((w) => w.page === page);
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
      {ws.map((w, i) => {
        const p = ease(t, w.t - 0.05, w.t + 0.15);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: 16,
              opacity: 0.15 + 0.85 * p,
              filter: `blur(${(1 - p) * 4}px)`,
              translate: `0px ${(1 - p) * 8}px`,
              color:
                w.k === "r"
                  ? RED
                  : w.k === "b"
                    ? "#ffffff"
                    : "rgba(255,255,255,.74)",
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

export const Titanic: React.FC = () => {
  useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#050506" }}>
      {PLAN.map((sc, i) => {
        const from = i === 0 ? 0 : sc.start - TF / 2;
        const to = i === PLAN.length - 1 ? sc.end : sc.end + TF / 2;
        const tin = i > 0 ? PLAN[i - 1].out : undefined;
        const { C } = sc;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={to - from}
            name={`Cena ${i + 1}`}
          >
            <BeatCtx.Provider
              value={{ words: sc.tl.words, offset: i === 0 ? 0 : TF / 2 }}
            >
              <Trans len={to - from} tin={tin} tout={sc.out}>
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
            </BeatCtx.Provider>
          </Sequence>
        );
      })}
      {PLAN.map((sc, i) => (
        <Sequence
          key={`c${i}`}
          from={sc.start}
          durationInFrames={sc.end - sc.start}
          name={`Legenda ${i + 1}`}
        >
          <Captions
            words={sc.tl.words}
            pageStart={sc.tl.pageStart}
            len={sc.end - sc.start}
          />
        </Sequence>
      ))}
      <Audio src={staticFile("titanic/narracao.m4a")} />
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
