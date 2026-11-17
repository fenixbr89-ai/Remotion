import React from "react";
import { useCurrentFrame } from "remotion";
import { easeOut, enterStyle, ip, rand } from "../anim";
import { C, FONT, s, SCENES, T } from "../constants";
import { Caption } from "../components/Caption";
import { Cursor } from "../components/Cursor";
import { LineIcon, Logo } from "../components/Icons";
import { SceneShell } from "../components/SceneShell";

const L = (sec: number) => s(sec) - SCENES.s6.from;
const BTN_Y = 1060;
const BTN_W = 460;
const BTN_H = 124;

const PARTICLES = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2 + rand(i) * 0.3;
  return {
    a,
    d: 190 + rand(i + 40) * 170,
    size: 14 + rand(i + 80) * 16,
    diamond: i % 3 === 0,
    color: i % 2 ? C.blue : C.sky,
    delay: Math.floor(rand(i + 120) * 4),
  };
});

const Burst: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <>
      {PARTICLES.map((p, i) => {
        const t = ip(frame, [at + p.delay, at + p.delay + 28], [0, 1], easeOut);
        const fade = ip(frame, [at + p.delay + 14, at + p.delay + 34], [1, 0]);
        if (t <= 0 || fade <= 0) return null;
        const x = 540 + Math.cos(p.a) * p.d * t * 1.25;
        const y = BTN_Y + Math.sin(p.a) * p.d * t * 0.85;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - p.size / 2,
              top: y - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: p.diamond ? 3 : "50%",
              background: p.color,
              rotate: p.diamond ? "45deg" : undefined,
              opacity: fade,
              scale: String(1 - t * 0.4),
            }}
          />
        );
      })}
    </>
  );
};

export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const click = L(T.s6Click);
  const followed = frame >= click + 1;
  const press = ip(frame, [click - 3, click], [0, 1]) - ip(frame, [click + 1, click + 8], [0, 1]);
  const swap = ip(frame, [click, click + 8], [0, 1], easeOut);
  const ringPulse = (frame % 45) / 45;
  const logoAt = L(T.s6Logo);

  return (
    <SceneShell punches={[click + 2]} exit={false}>
      <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
        {/* logo */}
        <div
          style={{
            position: "absolute",
            top: 300,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ...enterStyle(frame, logoAt, { dy: 40, scaleFrom: 0.6, damping: 11 }),
          }}
        >
          <div style={{ position: "relative", width: 320, height: 320 }}>
            <div
              style={{
                position: "absolute",
                inset: -30 - ringPulse * 40,
                borderRadius: "50%",
                border: `6px solid ${C.ring}`,
                opacity: 1 - ringPulse,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -22,
                borderRadius: "50%",
                border: `22px solid ${C.ring}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: C.white,
                boxShadow: C.shadow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo size={170} />
            </div>
          </div>
          <div style={{ marginTop: 60, fontSize: 80, fontWeight: 800, color: C.navy, letterSpacing: "-2.5px" }}>
            Preço Certo
          </div>
          <div style={{ marginTop: 6, fontSize: 40, fontWeight: 500, color: C.gray }}>@precocerto.site</div>
        </div>

        {/* botão seguir */}
        <div
          style={{
            position: "absolute",
            left: 540 - BTN_W / 2,
            top: BTN_Y - BTN_H / 2,
            width: BTN_W,
            height: BTN_H,
            ...enterStyle(frame, L(T.s6Button), { dy: 30, scaleFrom: 0.8 }),
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: BTN_H / 2,
              background: followed ? C.white : C.gradient,
              border: followed ? `3px solid ${C.ring}` : "3px solid transparent",
              boxSizing: "border-box",
              boxShadow: followed ? C.shadowSm : "0 18px 40px rgba(29,78,216,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              scale: String(1 - press * 0.08 + (followed ? (1 - swap) * 0.06 : 0)),
            }}
          >
            {followed ? (
              <>
                <span style={{ fontSize: 50, fontWeight: 800, color: C.blue, opacity: swap }}>Seguindo</span>
                <div style={{ opacity: swap, scale: String(swap) }}>
                  <LineIcon name="check" size={52} />
                </div>
              </>
            ) : (
              <span style={{ fontSize: 50, fontWeight: 800, color: "#fff" }}>Seguir</span>
            )}
          </div>
        </div>

        <Burst at={click} />

        <Cursor
          keys={[
            { f: L(T.s6CursorIn), x: 820, y: 1440 },
            { f: click - 3, x: 600, y: BTN_Y + 10 },
            { f: click + 30, x: 700, y: BTN_Y + 170 },
          ]}
          clicks={[click]}
          hideAt={click + 24}
        />

        <Caption
          start={L(T.s6Caption)}
          line1="Segue pra ver"
          line2={[{ text: "o" }, { text: "EP. 03.", accent: true }]}
        />
      </div>
    </SceneShell>
  );
};
