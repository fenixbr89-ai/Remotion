import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { Bg, Camera, Glass, Words } from "../components";
import { C, clamp, EASE_OUT, fontFamily } from "../theme";

// 1 — "Seu site ou sistema travou de novo?"
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [10, 40], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 18 }),
  });
  const broke = frame >= 55;
  const shake = broke ? Math.sin(frame * 2.2) * interpolate(frame, [55, 73], [26, 0], clamp) : 0;
  const errP = interpolate(frame, [55, 69], [0, 1], { ...clamp, easing: EASE_OUT });
  const toast = interpolate(frame, [66, 82], [0, 1], { ...clamp, easing: EASE_OUT });

  return (
    <AbsoluteFill>
      <Bg variant="dark" />
      <Camera rx={[10, 2]} ry={[-4, 4]} scale={[1, 1.08]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
          <Words text="Seu site ou sistema" start={2} size={84} weight={500} color="rgba(255,255,255,0.7)" />
          <Words text="travou de novo?" start={8} size={116} weight={800} color="#fff" accent={["travou"]} />
        </AbsoluteFill>

        {/* Browser window */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 420 }}>
          <div
            style={{
              transform: `translateY(${(1 - enter) * 500}px) rotateX(${(1 - enter) * 45}deg) translateX(${shake}px)`,
              opacity: enter,
            }}
          >
            <Glass dark style={{ width: 860, height: 600, padding: 36, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c, opacity: 0.85 }} />
                ))}
                <div
                  style={{
                    marginLeft: 24,
                    flex: 1,
                    height: 52,
                    borderRadius: 26,
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 26,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 28,
                  }}
                >
                  seusite.com.br
                </div>
              </div>
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 70 }}>
                {!broke ? (
                  <svg width={150} height={150} viewBox="0 0 50 50" style={{ rotate: `${frame * 12}deg` }}>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                    <circle cx="25" cy="25" r="20" fill="none" stroke={C.lavender} strokeWidth="4" strokeLinecap="round" strokeDasharray="40 200" />
                  </svg>
                ) : (
                  <div style={{ textAlign: "center", opacity: errP, scale: String(0.8 + 0.2 * errP), fontFamily }}>
                    <div style={{ fontSize: 190, fontWeight: 800, color: "#fff", letterSpacing: "-0.06em", lineHeight: 1 }}>
                      504
                    </div>
                    <div style={{ fontSize: 34, color: C.alert, fontWeight: 600, marginTop: 10 }}>
                      Gateway Timeout
                    </div>
                  </div>
                )}
              </AbsoluteFill>
            </Glass>
          </div>
        </AbsoluteFill>

        {/* Toast */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 1500,
            opacity: toast,
            transform: `translateY(${(1 - toast) * 60}px) rotate(${-4 + toast * 2}deg)`,
          }}
        >
          <Glass dark style={{ padding: "26px 36px", borderRadius: 32, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: C.alert, color: "#fff", fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
              !
            </div>
            <div style={{ color: "#fff", fontSize: 32, fontWeight: 600 }}>Servidor sem resposta</div>
          </Glass>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
