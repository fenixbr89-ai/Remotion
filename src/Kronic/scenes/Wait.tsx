import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Camera, Glass, Words } from "../components";
import { C, clamp, EASE_OUT, GRADIENT } from "../theme";

// 2 — "O seu cliente não espera."
export const Wait: React.FC = () => {
  const frame = useCurrentFrame();
  const card = interpolate(frame, [6, 30], [0, 1], { ...clamp, easing: EASE_OUT });
  const progress = interpolate(frame, [14, 50], [0, 98], { ...clamp, easing: EASE_OUT });
  const secs = interpolate(frame, [14, 195], [0, 9.6], clamp);
  const late = secs > 3;
  const t1 = interpolate(frame, [100, 118], [0, 1], { ...clamp, easing: EASE_OUT });
  const t2 = interpolate(frame, [134, 152], [0, 1], { ...clamp, easing: EASE_OUT });

  const toasts = [
    { p: t1, title: "Cliente saiu do site", sub: "há 1 segundo", top: 1320, rot: -3 },
    { p: t2, title: "Carrinho abandonado", sub: "R$ 0,00 em vendas", top: 1530, rot: 2 },
  ];

  return (
    <AbsoluteFill>
      <Bg variant="light" />
      <Camera rx={[0, 0]} ry={[5, -5]} scale={[1.02, 1.08]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
          <Words text="O seu cliente" start={6} size={92} weight={500} color={C.inkSoft} />
          <Words text="não espera." start={16} size={140} weight={800} color={C.ink} accent={["não", "espera."]} />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", top: 760 }}>
          <div style={{ opacity: card, transform: `translateY(${(1 - card) * 200}px) rotateX(${(1 - card) * 30}deg)` }}>
            <Glass style={{ width: 860, padding: 56 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 36, fontWeight: 600, color: C.ink }}>Carregando…</div>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: late ? C.alert : C.ink,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {secs.toFixed(1).replace(".", ",")}s
                </div>
              </div>
              <div style={{ marginTop: 36, height: 22, borderRadius: 11, background: "rgba(132,104,249,0.14)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", borderRadius: 11, background: GRADIENT }} />
              </div>
              <div style={{ marginTop: 18, fontSize: 28, color: C.inkSoft, fontWeight: 500 }}>
                {Math.round(progress)}%
              </div>
            </Glass>
          </div>
        </AbsoluteFill>

        {toasts.map((t) => (
          <div
            key={t.title}
            style={{
              position: "absolute",
              left: 110,
              top: t.top,
              opacity: t.p,
              transform: `translateX(${(1 - t.p) * 400}px) rotate(${t.rot}deg)`,
              filter: `blur(${(1 - t.p) * 12}px)`,
            }}
          >
            <Glass style={{ width: 860, padding: "30px 40px", borderRadius: 36, display: "flex", alignItems: "center", gap: 26 }}>
              <div style={{ width: 76, height: 76, borderRadius: 38, background: "rgba(255,92,122,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.alert} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 38, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{t.title}</div>
                <div style={{ fontSize: 28, color: C.inkSoft, marginTop: 4 }}>{t.sub}</div>
              </div>
            </Glass>
          </div>
        ))}
      </Camera>
    </AbsoluteFill>
  );
};
