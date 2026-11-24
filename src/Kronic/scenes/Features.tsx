import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Camera, Glass, IconTile, Words } from "../components";
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
      <Camera rx={[6, 0]} ry={[8, -8]} scale={[1, 1.05]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
          <Words text="Tudo que o seu" start={0} size={88} weight={500} color={C.inkSoft} />
          <Words text="projeto precisa." start={6} size={124} weight={800} color={C.ink} accent={["precisa."]} />
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", top: 690, gap: 34, display: "flex", flexDirection: "column" }}>
          {FEATURES.map((f, i) => {
            const s = [16, 26, 106, 162][i];
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
      </Camera>
    </AbsoluteFill>
  );
};
