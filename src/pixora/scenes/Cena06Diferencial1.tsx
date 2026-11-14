import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, Camera, CLAMP, EASE, Finger, FONT, Kinetic, prog, Sfx, useSpring } from "../ui";
import { SCREEN } from "./Cena05Estilos";

/** "premium" ~12,8s, "limpo" ~13,5s, "profissional" 14,5s (frames locais). */
const W = { visual: 9, limpo: 46, prof: 74 };
const BTN = { x: SCREEN.left + SCREEN.width - 120, y: SCREEN.top + SCREEN.height + 200 };

// 12–15,3s · Editor: a timeline anda e, no "profissional", o dedo toca "Exportar".
export const Cena06Diferencial1: React.FC = () => {
  const frame = useCurrentFrame();
  const frameIn = prog(frame, 4, 16);
  const ui = prog(frame, 10, 14);
  const head = interpolate(frame, [12, 100], [0, 1], CLAMP);
  const exporting = interpolate(frame, [W.prof + 2, W.prof + 18], [0, 1], { ...CLAMP, easing: EASE });
  const done = frame >= W.prof + 18;
  const check = useSpring(W.prof + 18, 12);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Sfx at={W.prof + 18} name="pop" volume={0.55} />
      <Camera
        keys={[
          { f: 0, z: 1.0 },
          { f: 40, z: 1.04, y: -20 },
          { f: W.prof, z: 1.07, x: -60, y: -40 },
          { f: 110, z: 1.04, x: -20, y: -20 },
        ]}
        punches={[{ f: W.prof, amt: 0.05 }]}
        origin="50% 55%"
      >
        <div style={{ position: "absolute", top: 210, left: 60, right: 60 }}>
          <Kinetic delay={W.visual} stagger={4} lines={[{ text: "Visual premium.", size: 92 }]} />
          <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 6 }}>
            <Kinetic delay={W.limpo} lines={[{ text: "Limpo.", size: 66, color: C.sub }]} />
            <Kinetic delay={W.prof} lines={[{ text: "Profissional.", size: 66, color: C.ink }]} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: SCREEN.top - 44,
            left: SCREEN.left - 44,
            width: SCREEN.width + 88,
            height: 780,
            borderRadius: 52,
            background: C.gray,
            boxShadow: "0 40px 100px rgba(0,0,0,0.12)",
            opacity: frameIn,
            scale: String(1.04 - frameIn * 0.04),
          }}
        />
        <div
          style={{
            position: "absolute",
            ...SCREEN,
            borderRadius: SCREEN.radius,
            background: C.black,
            overflow: "hidden",
          }}
        >
          {/* prévia rodando dentro da tela */}
          <div
            style={{
              position: "absolute",
              left: interpolate(head, [0, 1], [-200, 700]),
              top: 120,
              width: 260,
              height: 160,
              borderRadius: 30,
              background: "linear-gradient(135deg, #3A3A3C, #1C1C1E)",
              rotate: `${frame * 2}deg`,
              opacity: ui,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 64,
              color: C.white,
              letterSpacing: "-0.03em",
              opacity: ui,
            }}
          >
            PIXORA
          </div>
        </div>

        {/* timeline de edição */}
        <div
          style={{
            position: "absolute",
            top: SCREEN.top + SCREEN.height + 40,
            left: SCREEN.left,
            width: SCREEN.width,
            height: 110,
            opacity: ui,
            filter: `blur(${(1 - ui) * 12}px)`,
          }}
        >
          {[
            [0, 0.3, "#1C1C1E"],
            [0.32, 0.25, "#8E8E93"],
            [0.59, 0.41, "#3A3A3C"],
          ].map(([l, w, c], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(l as number) * 100}%`,
                width: `${(w as number) * 100 - 1}%`,
                top: 10 + (i % 2) * 50,
                height: 40,
                borderRadius: 12,
                background: c as string,
                scale: `${prog(frame, 12 + i * 4, 10)} 1`,
                transformOrigin: "0% 50%",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: `${head * 100}%`,
              top: -6,
              width: 6,
              height: 120,
              borderRadius: 3,
              background: C.red,
            }}
          />
        </div>

        {/* botão Exportar → progresso → pronto */}
        <div
          style={{
            position: "absolute",
            left: BTN.x - 150,
            top: BTN.y - 42,
            width: 300,
            height: 84,
            borderRadius: 42,
            background: done ? C.green : C.ink,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 600,
            color: C.white,
            opacity: prog(frame, 30, 10),
            scale: String(1 + Math.sin(prog(frame, W.prof + 18, 10) * Math.PI) * 0.1),
          }}
        >
          {exporting > 0 && !done ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${exporting * 100}%`,
                background: C.green,
              }}
            />
          ) : null}
          <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
            {done ? (
              <>
                <svg width="34" height="28" viewBox="0 0 24 20" style={{ scale: String(check) }}>
                  <path d="M3 10L9 16L21 4" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Pronto
              </>
            ) : exporting > 0 ? (
              `${Math.round(exporting * 100)}%`
            ) : (
              "Exportar"
            )}
          </span>
        </div>

        <Finger
          path={[
            { f: 50, x: 900, y: 1700 },
            { f: W.prof - 2, x: BTN.x, y: BTN.y },
            { f: W.prof + 8, x: BTN.x + 10, y: BTN.y + 10 },
            { f: 100, x: 980, y: 1650 },
          ]}
          taps={[W.prof]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
