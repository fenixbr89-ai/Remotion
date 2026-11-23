/**
 * Image-only versions of the scenes that used to be typographic.
 * Layout rule: visuals live in y < 1330 (the bottom band holds the captions).
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CommentCard, Photo, Star } from "./Art";
import { LonLat, MapArt, useProjector } from "./MapArt";

const CUBA_FIT: [LonLat, LonLat] = [
  [-86, 17],
  [-68, 24.5],
];
import {
  C,
  Camera,
  Dark,
  Paper,
  SANS,
  clamp,
  ease,
  easeInOut,
  easeOut,
  pop,
} from "./lib";

type S = { d: number };
const center: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
};

/* ---------- drawn pieces ---------- */
const Rifle: React.FC<{ w: number; color?: string }> = ({
  w,
  color = C.red,
}) => (
  <svg width={w} height={w * 0.22} viewBox="0 0 1000 220">
    <path
      d="M0 120 L120 96 L330 92 L360 70 L560 70 L590 88 L900 88 L900 70 L940 70 L940 88 L1000 88 L1000 104 L600 112 L560 140 L470 140 L440 200 L380 200 L410 140 L330 130 L150 160 L20 200 Z"
      fill={color}
    />
    <rect x={610} y={104} width={40} height={60} rx={6} fill={color} />
  </svg>
);

const Person: React.FC<{ color: string }> = ({ color }) => (
  <svg width={56} height={84} viewBox="0 0 20 30">
    <circle cx={10} cy={6} r={5} fill={color} />
    <path d="M2 30 L2 17 Q2 12 10 12 Q18 12 18 17 L18 30 Z" fill={color} />
  </svg>
);

/** Tear-off calendar page. */
const Calendar: React.FC<{
  day: string;
  month: string;
  year: number;
  w: number;
  yearColor?: string;
}> = ({ day, month, year, w, yearColor = C.ink }) => (
  <div
    style={{
      width: w,
      background: "#f2eee4",
      boxShadow: "12px 22px 40px rgba(0,0,0,.5)",
      fontFamily: SANS,
      fontWeight: 800,
      textAlign: "center",
      overflow: "hidden",
      borderRadius: 10,
    }}
  >
    <div
      style={{
        background: C.red,
        color: "#fff",
        fontSize: w * 0.12,
        padding: `${w * 0.03}px 0`,
        letterSpacing: 4,
      }}
    >
      {month}
    </div>
    <div
      style={{
        fontSize: w * 0.42,
        lineHeight: 1.05,
        color: C.ink,
        letterSpacing: -6,
      }}
    >
      {day}
    </div>
    <div
      style={{
        fontSize: w * 0.14,
        color: yearColor,
        paddingBottom: w * 0.05,
        letterSpacing: 2,
      }}
    >
      {year}
    </div>
  </div>
);

/* ---------- scenes ---------- */

/** "Ali ele decidiu: a mudança viria pelas armas." */
export const X_Armas: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const rx = interpolate(f, [50, 95], [-1400, 0], {
    ...clamp,
    easing: easeOut,
  });
  return (
    <Dark glow="rgba(160,25,20,0.55)">
      <Camera dur={d} from={1.0} to={1.1}>
        <div style={{ ...center, top: 200, ...pop(f, 4, 18) }}>
          <div style={{ rotate: "-3deg" }}>
            <Photo k="green" w={700} h={880} border={20} pos="50% 25%" />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 780,
            rotate: "-14deg",
            translate: `${rx}px 0px`,
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))",
          }}
        >
          <Rifle w={1000} />
        </div>
      </Camera>
    </Dark>
  );
};

/** 82 landed, about 20 survived. */
export const X_Sierra: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const survivors = new Set([
    3, 9, 14, 20, 27, 31, 36, 40, 45, 49, 52, 57, 60, 63, 66, 70, 73, 76, 78,
    81,
  ]);
  return (
    <Dark>
      <Camera dur={d} from={1.0} to={1.06}>
        <div style={{ ...center, top: 120, ...pop(f, 2, 16) }}>
          <div style={{ rotate: "2deg" }}>
            <Photo
              k="sierra"
              w={900}
              h={560}
              border={18}
              tint="warm"
              pos="50% 40%"
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 760,
            width: 900,
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 2px",
          }}
        >
          {Array.from({ length: 82 }).map((_, i) => {
            const alive = survivors.has(i);
            const fade = alive
              ? 0
              : ease(f, 55 + (i % 13) * 3, 70 + (i % 13) * 3);
            const red = alive ? ease(f, 90, 105) : 0;
            return (
              <div
                key={i}
                style={{
                  opacity:
                    ease(f, 8 + i * 0.4, 18 + i * 0.4) * (1 - 0.85 * fade),
                  width: 64,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Person color={red > 0.5 ? C.redSoft : "#e8e2d6"} />
              </div>
            );
          })}
        </div>
      </Camera>
    </Dark>
  );
};

/** "O médico virou comandante": the student photo flips into the commander. */
export const X_Comandante: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const flip = interpolate(f, [22, 48], [0, 180], {
    ...clamp,
    easing: easeInOut,
  });
  const front = flip < 90;
  return (
    <Paper seed={3}>
      <Camera dur={d} from={1.0} to={1.08}>
        <div style={{ ...center, top: 170 }}>
          <div
            style={{
              transform: `perspective(1600px) rotateY(${flip}deg)`,
              rotate: "-2deg",
            }}
          >
            <div style={{ transform: front ? undefined : "rotateY(180deg)" }}>
              {front ? (
                <Photo
                  k="student"
                  w={760}
                  h={960}
                  border={22}
                  tint="warm"
                  pos="50% 25%"
                />
              ) : (
                <Photo k="green" w={760} h={960} border={22} pos="50% 25%" />
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 800,
            top: 140,
            opacity: ease(f, 46, 56),
            rotate: `${interpolate(f, [46, d], [-40, 10])}deg`,
          }}
        >
          <Star size={150} />
        </div>
      </Camera>
    </Paper>
  );
};

const Plane: React.FC<{ w: number }> = ({ w }) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 100 100"
    style={{ filter: "drop-shadow(6px 12px 8px rgba(0,0,0,.5))" }}
  >
    <path
      d="M50 4 C 54 4, 55 10, 55 16 L55 38 L94 58 L94 66 L55 56 L55 80 L66 88 L66 94 L50 90 L34 94 L34 88 L45 80 L45 56 L6 66 L6 58 L45 38 L45 16 C 45 10, 46 4, 50 4 Z"
      fill="#f2eee6"
    />
  </svg>
);

/** Batista flees by plane on New Year's night; the clipping lands. */
export const X_Batista: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const proj = useProjector(1080, 640, CUBA_FIT);
  const [hx, hy] = proj([-82.36, 23.13]) as [number, number];
  const [dx, dy] = proj([-69.9, 18.5]) as [number, number];
  const t = ease(f, 10, 90, 0, 1, easeInOut);
  const px = hx + (dx - hx) * t;
  const py = hy + (dy - hy) * t - Math.sin(t * Math.PI) * 120;
  const ang =
    (Math.atan2(dy - hy - 120 * Math.PI * Math.cos(t * Math.PI), dx - hx) *
      180) /
      Math.PI +
    90;
  return (
    <Dark glow="rgba(40,60,120,0.45)">
      <Camera dur={d} from={1.0} to={1.06}>
        <div style={{ position: "absolute", left: 0, top: 90 }}>
          <MapArt
            w={1080}
            h={640}
            fit={CUBA_FIT}
            ink="#8a8f9c"
            fill="rgba(200,210,230,0.08)"
            highlight={[{ name: "Cuba", color: "#3a4a6a", start: 0 }]}
            routes={[
              {
                pts: [
                  [-82.36, 23.13],
                  [-76, 22.5],
                  [-69.9, 18.5],
                ],
                start: 10,
                dur: 80,
                color: C.redSoft,
              },
            ]}
            pins={[{ at: [-82.36, 23.13], label: "", start: 4 }]}
          />
          <div
            style={{
              position: "absolute",
              left: px - 60,
              top: py - 60,
              rotate: `${ang}deg`,
            }}
          >
            <Plane w={120} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 760,
            rotate: "-5deg",
            ...pop(f, 100),
          }}
        >
          <div
            style={{
              width: 780,
              background: "#ece4d0",
              padding: 28,
              boxShadow: "10px 18px 30px rgba(0,0,0,.45)",
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 22,
                color: "#5a4f3c",
                borderBottom: "2px solid #5a4f3c",
                paddingBottom: 6,
              }}
            >
              LA HABANA · 1º DE ENERO DE 1959
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 70,
                lineHeight: 1,
                letterSpacing: -2,
                color: "#141414",
                margin: "14px 0 16px",
              }}
            >
              BATISTA FOGE DE CUBA
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 9,
                  margin: "0 0 11px",
                  background: "#8a7f6a",
                  opacity: 0.45,
                  width: `${70 + ((i * 37) % 30)}%`,
                }}
              />
            ))}
          </div>
        </div>
      </Camera>
    </Dark>
  );
};

/** Capture: calendar page over the Bolivia photo. */
export const X_Captured: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <Camera dur={d} from={1.0} to={1.08}>
        <div style={{ ...center, top: 120 }}>
          <div style={{ rotate: "-2deg", opacity: 0.9 }}>
            <Photo
              k="bolivia"
              w={920}
              h={700}
              border={18}
              tint="bw"
              pos="50% 40%"
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 640,
            rotate: "6deg",
            ...pop(f, 10, 18),
          }}
        >
          <Calendar day="8" month="OUTUBRO" year={1967} w={380} />
        </div>
        <svg
          width={420}
          height={420}
          style={{
            position: "absolute",
            left: 540,
            top: 700,
            overflow: "visible",
          }}
        >
          <path
            d="M210 20 C 360 10, 410 120, 400 210 C 385 330, 120 380, 40 280 C -20 200, 30 60, 220 30"
            fill="none"
            stroke={C.redSoft}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={1400}
            strokeDashoffset={1400 * (1 - ease(f, 110, 140, 0, 1, easeInOut))}
          />
        </svg>
      </Camera>
    </Dark>
  );
};

/** Body hidden 30 years: the calendar flips 1967 → 1997. */
export const X_1997: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const y = Math.round(
    interpolate(f, [20, 110], [1967, 1997], { ...clamp, easing: easeInOut }),
  );
  const flipPhase = (f % 6) / 6;
  return (
    <Dark glow="rgba(120,20,15,0.35)">
      <Camera dur={d} from={1.0} to={1.08}>
        <div style={{ ...center, top: 280 }}>
          <div
            style={{
              transform:
                y < 1997 && f > 20
                  ? `perspective(1200px) rotateX(${flipPhase * 25}deg)`
                  : undefined,
            }}
          >
            <Calendar
              day={y === 1997 ? "28" : "9"}
              month={y === 1997 ? "JUNHO" : "OUTUBRO"}
              year={y}
              w={560}
              yearColor={y === 1997 ? C.red : C.ink}
            />
          </div>
        </div>
      </Camera>
    </Dark>
  );
};

/** "Herói para uns, símbolo de violência para outros." */
export const X_Split: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const split = ease(f, 36, 56, 0, 1, easeInOut);
  return (
    <AbsoluteFill style={{ background: "#141414" }}>
      <Paper seed={2}>
        <Camera dur={d} from={1.0} to={1.06}>
          <div style={{ ...center, top: 60, ...pop(f, 2, 16) }}>
            <div
              style={{
                width: 520,
                height: 600,
                background: C.red,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                boxShadow: "10px 18px 30px rgba(0,0,0,.35)",
                rotate: "-2deg",
                overflow: "hidden",
              }}
            >
              <Img
                src={staticFile("che/korda_cut.png")}
                style={{
                  height: 560,
                  filter: "grayscale(1) contrast(2.4) brightness(1.15)",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
          </div>
        </Camera>
      </Paper>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640 + (1 - split) * 1300,
          height: 1300,
          background: "#141414",
        }}
      >
        <svg
          width={1080}
          height={60}
          style={{ position: "absolute", top: -40 }}
        >
          <path
            d={`M0 40 ${Array.from({ length: 28 })
              .map((_, i) => `L${i * 40} ${20 + ((i * 37) % 23)}`)
              .join(" ")} L1080 30 L1080 60 L0 60 Z`}
            fill="#141414"
          />
        </svg>
        <div style={{ ...center, top: 50 }}>
          <div style={{ position: "relative", rotate: "2deg" }}>
            <Photo
              k="sierra"
              w={860}
              h={560}
              border={0}
              tint="bw"
              pos="50% 45%"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: C.red,
                mixBlendMode: "multiply",
                opacity: 0.85,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Final hook: logo + @quebra.padrao profile card + comment card. */
export const X_CTA: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  const pressAt = 128;
  const pressed = f >= pressAt;
  const squash = 1 - 0.07 * Math.max(0, 1 - Math.abs(f - pressAt) / 5);
  const glow = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <Dark glow="rgba(70,80,140,0.35)">
      <Camera dur={d} from={1.0} to={1.05}>
        {/* comment card: "herói ou vilão?" */}
        <div style={{ ...center, top: 110, ...pop(f, 20, 16) }}>
          <CommentCard
            start={26}
            name="você"
            text="herói ou vilão?"
            likes="12 mil"
          />
        </div>
        {/* profile card */}
        <div style={{ ...center, top: 470, ...pop(f, 92, 18) }}>
          <div
            style={{
              width: 880,
              background: "#ffffff",
              borderRadius: 40,
              padding: "44px 44px 40px",
              boxShadow: "0 30px 70px rgba(0,0,0,.55)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
              fontFamily: SANS,
            }}
          >
            <div
              style={{
                width: 250,
                height: 250,
                borderRadius: "50%",
                padding: 7,
                background:
                  "conic-gradient(from 200deg, #f5c400, #e2574c, #c8302c, #f5c400)",
                boxShadow: `0 0 ${30 + glow * 30}px rgba(255,255,255,${0.15 + glow * 0.15})`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "6px solid #fff",
                  overflow: "hidden",
                  background: "#000",
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
                fontWeight: 800,
                fontSize: 60,
                color: "#111",
                letterSpacing: -1.5,
              }}
            >
              @quebra.padrao
            </div>
            <div style={{ fontWeight: 600, fontSize: 32, color: "#666" }}>
              Te explicando coisas em 1 minuto
            </div>
            <div
              style={{
                marginTop: 10,
                scale: String(squash),
                width: 620,
                textAlign: "center",
                background: pressed ? "#efefef" : "#0095f6",
                color: pressed ? "#111" : "#fff",
                borderRadius: 22,
                padding: "26px 0",
                fontWeight: 800,
                fontSize: 46,
              }}
            >
              {pressed ? "Seguindo" : "Seguir"}
            </div>
          </div>
        </div>
      </Camera>
    </Dark>
  );
};

/** "No caminho, viu mineiros, leprosos, pobreza": the 1952 raft photo, framed. */
export const X_Caminho: React.FC<S> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Dark glow="rgba(90,70,40,0.4)">
      <Camera dur={d} from={1.0} to={1.1} x={-20}>
        <div style={{ ...center, top: 230, ...pop(f, 4, 18) }}>
          <div style={{ rotate: "-2deg" }}>
            <Photo
              k="leper"
              w={960}
              h={700}
              border={20}
              tint="warm"
              pos="50% 45%"
              style={{ filter: "brightness(1.2)" }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 860,
            rotate: "7deg",
            ...pop(f, 140, 16),
          }}
        >
          <Star size={120} />
        </div>
      </Camera>
    </Dark>
  );
};
