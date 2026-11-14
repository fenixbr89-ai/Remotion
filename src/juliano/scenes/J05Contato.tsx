import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Camera,
  CLAMP,
  EASE_IN_OUT,
  FONT,
  Kinetic,
  prog,
  Sfx,
  useSpring,
} from "../../pixora/ui";
import { J, J_SFX } from "../tema";

const BODY =
  "M130 1120L130 1040Q140 1000 200 990L330 980Q400 900 470 880L700 880Q760 885 820 960L900 975Q960 990 960 1050L960 1120Z";
const SPRAY = { from: 20, to: 100 };
const MORPH = 126;
const TILE = 290;
const GAP = 30;
const GRID_LEFT = (1080 - (TILE * 3 + GAP * 2)) / 2;
const GRID_TOP = 760;
const tilePos = (i: number) => ({
  x: GRID_LEFT + (i % 3) * (TILE + GAP),
  y: GRID_TOP + Math.floor(i / 3) * (TILE + GAP),
});

const Carro: React.FC<{ readonly paint: number; readonly shine: number }> = ({
  paint,
  shine,
}) => (
  <svg
    width="1080"
    height="1920"
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0 }}
  >
    <defs>
      <clipPath id="j05-body">
        <path d={BODY} />
      </clipPath>
      <linearGradient id="j05-gloss" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF8A45" />
        <stop offset="0.55" stopColor={J.laranja} />
        <stop offset="1" stopColor="#C9520F" />
      </linearGradient>
      <linearGradient id="j05-shine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d={BODY} fill="#BDBDBD" />
    <g clipPath="url(#j05-body)">
      <rect
        x="120"
        y="860"
        width={860 * paint}
        height="280"
        fill="url(#j05-gloss)"
      />
      <rect
        x={-200 + shine * 1400}
        y="840"
        width="120"
        height="320"
        fill="url(#j05-shine)"
        transform={`rotate(20 ${-140 + shine * 1400} 1000)`}
      />
    </g>
    <path d="M360 980Q420 910 480 900L590 900L590 980Z" fill="#DCE9F3" />
    <path d="M610 900L690 900Q740 910 790 975L610 980Z" fill="#DCE9F3" />
    <path d={BODY} fill="none" stroke={J.preto} strokeWidth="6" />
    {[290, 800].map((x) => (
      <g key={x}>
        <circle cx={x} cy="1130" r="70" fill={J.preto} />
        <circle cx={x} cy="1130" r="30" fill="#8E8E93" />
      </g>
    ))}
  </svg>
);

/** Pistola de pintura (como a da logo) com névoa de tinta. */
const Pistola: React.FC<{
  readonly x: number;
  readonly on: boolean;
  readonly frame: number;
}> = ({ x, on, frame }) => (
  <div style={{ position: "absolute", left: x - 60, top: 640 }}>
    <svg
      width="200"
      height="360"
      viewBox="0 0 200 360"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      {on
        ? new Array(14).fill(0).map((_, i) => {
            const t = ((frame * 3 + i * 17) % 40) / 40;
            return (
              <circle
                key={i}
                cx={60 + Math.sin(i * 1.7) * 40 * t}
                cy={190 + t * 150}
                r={4 + t * 8}
                fill={J.laranja}
                opacity={0.7 * (1 - t)}
              />
            );
          })
        : null}
      <path d="M50 40H110V90H50Z" fill={J.laranja} />
      <rect x="40" y="20" width="80" height="26" rx="10" fill={J.laranja} />
      <path d="M30 90H150L160 130H40Z" fill={J.preto} />
      <rect x="50" y="130" width="22" height="60" rx="6" fill={J.preto} />
      <path d="M120 130L150 230L125 235L100 140Z" fill={J.preto} />
    </svg>
  </div>
);

const ICONS: { label: string; draw: React.ReactNode }[] = [
  {
    label: "Pintura",
    draw: (
      <>
        <rect x="20" y="20" width="110" height="40" rx="20" fill={J.laranja} />
        <path
          d="M130 40H145V90H75V110"
          fill="none"
          stroke={J.preto}
          strokeWidth="8"
        />
        <rect x="65" y="108" width="20" height="40" rx="8" fill={J.preto} />
      </>
    ),
  },
  {
    label: "Telhados",
    draw: (
      <>
        <path
          d="M10 80L75 25L140 80"
          fill="none"
          stroke={J.laranja}
          strokeWidth="10"
          strokeLinejoin="round"
        />
        <rect
          x="30"
          y="80"
          width="90"
          height="65"
          fill="none"
          stroke={J.preto}
          strokeWidth="8"
        />
      </>
    ),
  },
  {
    label: "Hidráulica",
    draw: (
      <>
        <path
          d="M20 40H110V80"
          fill="none"
          stroke={J.laranja}
          strokeWidth="14"
        />
        <path
          d="M110 100C95 120 95 135 110 140C125 135 125 120 110 100Z"
          fill={J.agua}
        />
      </>
    ),
  },
  {
    label: "Elétrica",
    draw: (
      <path
        d="M85 10L35 85H75L60 145L120 60H80Z"
        fill={J.laranja}
        stroke={J.preto}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Caixa d'água",
    draw: (
      <>
        <rect
          x="30"
          y="35"
          width="90"
          height="105"
          rx="16"
          fill="none"
          stroke={J.preto}
          strokeWidth="8"
        />
        <rect x="36" y="85" width="78" height="50" rx="10" fill={J.agua} />
        <rect x="22" y="22" width="106" height="18" rx="8" fill={J.laranja} />
      </>
    ),
  },
];

// 29–37s · A pistola pinta o carro (pintura automotiva); o carro vira uma peça do
// mosaico de serviços. "Um só contato. Muitas soluções."
export const J05Contato: React.FC = () => {
  const frame = useCurrentFrame();
  const paint = interpolate(frame, [SPRAY.from, SPRAY.to], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const gunX = 130 + paint * 830;
  const spraying = frame >= SPRAY.from && frame < SPRAY.to;
  const shine = prog(frame, 102, 22);
  const m = prog(frame, MORPH, 26, EASE_IN_OUT);
  const carTile = tilePos(5);
  const tagIn = useSpring(12, 16);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <Sfx at={SPRAY.from} name="brush" volume={0.35} dir={J_SFX} />
      <Sfx at={SPRAY.from + 40} name="brush" volume={0.3} dir={J_SFX} />
      <Camera
        keys={[
          { f: 0, z: 1.12 },
          { f: 100, z: 1.0 },
          { f: 260, z: 1.03 },
        ]}
        origin="50% 55%"
      >
        {/* mosaico de serviços */}
        {ICONS.map((icon, i) => {
          const p = tilePos(i);
          const s = popIn(frame, MORPH + 6 + i * 4);
          return (
            <div
              key={icon.label}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                width: TILE,
                height: TILE,
                borderRadius: 36,
                background: "#FFFFFF",
                border: "2px solid #E5E5EA",
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                scale: String(s),
                opacity: s,
              }}
            >
              <svg width="150" height="150" viewBox="0 0 150 150">
                {icon.draw}
              </svg>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 32,
                  fontWeight: 500,
                  color: J.preto,
                }}
              >
                {icon.label}
              </div>
            </div>
          );
        })}
        {/* peça do carro */}
        <div
          style={{
            position: "absolute",
            left: carTile.x,
            top: carTile.y,
            width: TILE,
            height: TILE,
            borderRadius: 36,
            background: "#FFFFFF",
            border: "2px solid #E5E5EA",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            opacity: prog(frame, MORPH + 14, 10),
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 22,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 32,
              fontWeight: 500,
              color: J.preto,
            }}
          >
            Automotiva
          </div>
        </div>

        {/* carro que encolhe para dentro da peça */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "545px 1030px",
            translate: `${m * (carTile.x + TILE / 2 - 545)}px ${m * (carTile.y + TILE / 2 - 30 - 1030)}px`,
            scale: String(interpolate(m, [0, 1], [1, 0.27])),
          }}
        >
          <Carro paint={paint} shine={shine} />
        </div>
        {spraying || frame < SPRAY.from ? (
          <Pistola x={gunX} on={spraying} frame={frame} />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 1330,
            translate: "-50% 0",
            padding: "12px 30px",
            borderRadius: 40,
            border: `3px solid ${J.laranja}`,
            background: "#FFFFFF",
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 500,
            color: J.preto,
            scale: String(tagIn * (1 - m)),
            whiteSpace: "nowrap",
          }}
        >
          Pintura automotiva
        </div>
      </Camera>

      <div style={{ position: "absolute", top: 230, left: 60, right: 60 }}>
        <Kinetic
          delay={MORPH}
          stagger={4}
          lines={[
            { text: "Um só contato.", size: 96, weight: 600, color: J.preto },
          ]}
        />
        <Kinetic
          delay={MORPH + 16}
          stagger={4}
          lines={[
            {
              text: "Muitas soluções.",
              size: 80,
              weight: 300,
              color: J.laranja,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Entrada com leve elástico, calculada sem hook (para usar dentro de .map). */
const popIn = (frame: number, at: number) => {
  const t = Math.max(0, frame - at) / 16;
  if (t >= 1) return 1;
  return 1 - Math.pow(1 - t, 3) * Math.cos(t * 1.2);
};
