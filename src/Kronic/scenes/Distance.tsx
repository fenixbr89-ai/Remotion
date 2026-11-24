import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Glass, ServerIcon, Words, Cam, Foreground } from "../components";
import { C, clamp, EASE_OUT, fontFamily, OFFER } from "../theme";

// Shared route diagram: server -> user, with a packet travelling.
export const Route: React.FC<{
  serverLabel: string;
  userLabel: string;
  far: boolean;
  start: number;
}> = ({ serverLabel, userLabel, far, start }) => {
  const frame = useCurrentFrame();
  const show = interpolate(frame, [start, start + 24], [0, 1], { ...clamp, easing: EASE_OUT });
  const sx = far ? 830 : 760;
  const sy = far ? 760 : 1010;
  const ux = 250;
  const uy = far ? 1580 : 1350;
  const cx = far ? 960 : 620;
  const cy = far ? 1400 : 1250;
  const path = `M ${sx} ${sy + 90} Q ${cx} ${cy} ${ux + 70} ${uy}`;
  // Packet speed: slow when far, fast when near
  const period = far ? 70 : 18;
  const t = ((Math.max(0, frame - start - 10) % period) / period);
  const bez = (a: number, b: number, c: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c;
  const px = bez(sx, cx, ux + 70);
  const py = bez(sy + 90, cy, uy);
  const draw = interpolate(frame, [start + 6, start + 34], [1, 0], { ...clamp, easing: EASE_OUT });

  return (
    <AbsoluteFill style={{ opacity: show }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path
          d={path}
          fill="none"
          stroke={far ? "rgba(255,92,122,0.7)" : C.lavender}
          strokeWidth={5}
          strokeDasharray="14 16"
          pathLength={1000}
          strokeDashoffset={draw * 1000}
        />
        <circle cx={px} cy={py} r={16} fill={far ? C.alert : "#fff"} style={{ filter: `drop-shadow(0 0 18px ${far ? C.alert : C.purple})` }} />
      </svg>
      <div style={{ position: "absolute", left: sx - 80, top: sy - 110, textAlign: "center", scale: String(0.7 + 0.3 * show) }}>
        <ServerIcon size={160} glow />
        <Label text={serverLabel} />
      </div>
      <div style={{ position: "absolute", left: ux - 30, top: uy - 40, textAlign: "center" }}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            background: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        </div>
        <Label text={userLabel} />
      </div>
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      marginTop: 16,
      fontSize: 30,
      fontWeight: 600,
      color: "rgba(255,255,255,0.8)",
      fontFamily,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

// 3 — "Servidor lá fora?"
export const Distance: React.FC = () => {
  const frame = useCurrentFrame();
  const ms = Math.round(interpolate(frame, [56, 110], [0, OFFER.latencyFar], { ...clamp, easing: EASE_OUT }));
  const card = interpolate(frame, [52, 72], [0, 1], { ...clamp, easing: EASE_OUT });

  return (
    <AbsoluteFill>
      <Bg variant="dark" />
      <Cam keys={[{ f: 0, x: 820, y: 800, z: 1.7, rx: 10, ry: -26 }, { f: 40, x: 560, y: 980, z: 1.05, rx: 4, ry: -6 }, { f: 70, x: 380, y: 1080, z: 1.3, rx: 0, ry: 12 }, { f: 136, x: 440, y: 1040, z: 1.2, ry: 6, rz: 2 }]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
          <Words text="Servidor" start={2} size={92} weight={500} color="rgba(255,255,255,0.7)" />
          <Words text="lá fora?" start={6} size={150} weight={800} color="#fff" accent={["fora?"]} />
        </AbsoluteFill>
        <Route serverLabel="Exterior" userLabel="Seu cliente · BR" far start={14} />
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 880,
            opacity: card,
            transform: `translateY(${(1 - card) * 60}px) rotate(-3deg)`,
          }}
        >
          <Glass dark style={{ padding: "30px 40px", borderRadius: 36 }}>
            <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Latência</div>
            <div style={{ fontSize: 96, fontWeight: 800, color: C.alert, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums" }}>
              {ms}
              <span style={{ fontSize: 44, marginLeft: 8 }}>ms</span>
            </div>
          </Glass>
        </div>
      </Cam>
      <Foreground dark from={[1300, 300]} to={[-300, 900]} start={30} end={62} size={560} blur={26} />
    </AbsoluteFill>
  );
};
