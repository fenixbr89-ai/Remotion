import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Glass, IconTile, Words, Cam, Foreground } from "../components";
import { C, clamp, EASE_OUT } from "../theme";

const ic = { fill: "none", stroke: "#fff", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const FEATURES = [
  {
    title: "Servidores no Brasil",
    sub: "Menor distância, menor latência",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" {...ic}>
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Uptime de 99,9%",
    sub: "Estabilidade para sua operação",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" {...ic}>
        <path d="M3 12h4l3-8 4 16 3-8h4" />
      </svg>
    ),
  },
  {
    title: "Suporte técnico próximo",
    sub: "Atendimento quando você precisar",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" {...ic}>
        <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
        <rect x="3" y="13" width="4" height="6" rx="1.5" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Alta performance",
    sub: "Sites, sistemas, automações e mais",
    icon: (
      <svg width="60" height="60" viewBox="0 0 24 24" {...ic}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </svg>
    ),
  },
];

// 6 — Benefits stack
export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg variant="light" />
      <Cam keys={[{ f: 0, x: 540, y: 640, z: 1.15, rx: 8, ry: 6 }, { f: 30, x: 540, y: 900, z: 1.32, rx: 4, ry: -12 }, { f: 104, x: 540, y: 930, z: 1.34, ry: -6 }, { f: 120, x: 540, y: 1200, z: 1.36, ry: 12, rz: 1 }, { f: 160, x: 540, y: 1220, z: 1.34, ry: 6, rz: 0 }, { f: 176, x: 540, y: 1420, z: 1.36, ry: -10 }, { f: 250, x: 540, y: 1440, z: 1.32, ry: -4 }, { f: 300, x: 540, y: 1000, z: 1.0, rx: 0, ry: 0 }, { f: 338, x: 540, y: 980, z: 0.98, ry: 4 }]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
          <Words text="Tudo que o seu" start={0} size={88} weight={500} color={C.inkSoft} />
          <Words text="projeto precisa." start={6} size={124} weight={800} color={C.ink} accent={["precisa."]} />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", top: 690, gap: 34, display: "flex", flexDirection: "column" }}>
          {FEATURES.map((f, i) => {
            const s = [16, 26, 112, 168][i];
            const p = interpolate(frame, [s, s + 24], [0, 1], { ...clamp, easing: EASE_OUT });
            const float = Math.sin((frame + i * 20) / 22) * 6;
            return (
              <div
                key={f.title}
                style={{
                  opacity: p,
                  filter: `blur(${(1 - p) * 16}px)`,
                  transform: `translateY(${(1 - p) * 160 + float}px) translateX(${(i % 2 ? 1 : -1) * 18}px) rotateX(${(1 - p) * -70}deg) rotateZ(${(i % 2 ? 1 : -1) * 1.2}deg)`,
                }}
              >
                <Glass style={{ width: 880, padding: "34px 40px", display: "flex", alignItems: "center", gap: 36 }}>
                  <IconTile>{f.icon}</IconTile>
                  <div>
                    <div style={{ fontSize: 46, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em" }}>{f.title}</div>
                    <div style={{ fontSize: 30, color: C.inkSoft, marginTop: 6 }}>{f.sub}</div>
                  </div>
                </Glass>
              </div>
            );
          })}
        </AbsoluteFill>
      </Cam>
      <Foreground from={[1400, 600]} to={[-400, 1500]} start={104} end={128} size={640} blur={30} />
    </AbsoluteFill>
  );
};
