import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Camera, Glass, Words } from "../components";
import { C, clamp, EASE_OUT, OFFER } from "../theme";

// 5 — "Mais perto. Mais rápido."
export const Speed: React.FC = () => {
  const frame = useCurrentFrame();
  const gauge = interpolate(frame, [20, 70], [0, 1], { ...clamp, easing: EASE_OUT });
  const ms = Math.round(interpolate(frame, [20, 70], [OFFER.latencyFar, OFFER.latencyNear], { ...clamp, easing: EASE_OUT }));
  const chip = interpolate(frame, [64, 84], [0, 1], { ...clamp, easing: EASE_OUT });
  const card = interpolate(frame, [10, 34], [0, 1], { ...clamp, easing: EASE_OUT });

  const R = 300;
  const arcLen = Math.PI * R;
  const angle = -180 + 180 * gauge;

  return (
    <AbsoluteFill>
      <Bg variant="dark" />
      <Camera rx={[8, 0]} ry={[6, -6]} scale={[1, 1.07]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 280 }}>
          <Words text="Mais perto." start={2} size={130} weight={800} color="#fff" />
          <Words text="Mais rápido." start={62} size={130} weight={800} color="#fff" accent={["rápido."]} />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", top: 820 }}>
          <div style={{ opacity: card, transform: `translateY(${(1 - card) * 200}px) rotateX(${(1 - card) * 40}deg)` }}>
            <Glass dark style={{ width: 860, height: 600, position: "relative", overflow: "hidden" }}>
              <svg width={860} height={600} style={{ position: "absolute", inset: 0 }}>
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0" stopColor={C.lavender} />
                    <stop offset="1" stopColor={C.purple} />
                  </linearGradient>
                </defs>
                <path d={`M ${430 - R} 360 A ${R} ${R} 0 0 1 ${430 + R} 360`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={40} strokeLinecap="round" />
                <path
                  d={`M ${430 - R} 360 A ${R} ${R} 0 0 1 ${430 + R} 360`}
                  fill="none"
                  stroke="url(#g)"
                  strokeWidth={40}
                  strokeLinecap="round"
                  strokeDasharray={`${arcLen * gauge} ${arcLen}`}
                  style={{ filter: "drop-shadow(0 0 20px rgba(132,104,249,0.8))" }}
                />
                <g transform={`translate(430 360) rotate(${angle})`}>
                  <line x1={0} y1={0} x2={R - 70} y2={0} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
                </g>
                <circle cx={430} cy={360} r={22} fill="#fff" />
              </svg>
              <div style={{ position: "absolute", width: "100%", bottom: 40, textAlign: "center", color: "#fff" }}>
                <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums" }}>{ms}</span>
                <span style={{ fontSize: 40, fontWeight: 600, marginLeft: 8, color: C.lavender }}>ms</span>
              </div>
            </Glass>
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", top: 1500 }}>
          <div style={{ opacity: chip, transform: `translateY(${(1 - chip) * 40}px)` }}>
            <Glass dark style={{ padding: "24px 44px", borderRadius: 60, display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: C.ok, boxShadow: `0 0 16px ${C.ok}` }} />
              <div style={{ color: "#fff", fontSize: 36, fontWeight: 600 }}>Infraestrutura no Brasil</div>
            </Glass>
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
