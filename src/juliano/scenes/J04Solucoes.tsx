import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Camera,
  CLAMP,
  DrawPath,
  EASE_IN_OUT,
  Kinetic,
  prog,
  Sfx,
} from "../../pixora/ui";
import { J, J_SFX } from "../tema";

/** Quando cada estação começa (frames locais) e o deslize da câmera entre elas. */
const ST = [10, 76, 144, 212];
const PAN_F = [0, 60, 72, 128, 140, 196, 208, 290];
const PAN_X = [0, 0, 1080, 1080, 2160, 2160, 3240, 3240];
const BASE = 1640;
const LABELS = ["Hidráulica", "Elétrica", "Caixa d'água", "Manutenção"];

const Hidraulica: React.FC<{ readonly f: number }> = ({ f }) => (
  <svg
    width="1080"
    height="1920"
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", left: 0, top: 0 }}
  >
    <DrawPath
      d={`M160 ${BASE}V1080H725V1225`}
      progress={prog(f, 0, 30)}
      length={1600}
      color={J.laranja}
      width={22}
    />
    <rect
      x="685"
      y="1215"
      width="80"
      height="44"
      rx="10"
      fill={J.preto}
      opacity={prog(f, 26, 6)}
    />
    {new Array(6).fill(0).map((_, i) => {
      const t = ((f - 34 - i * 7) % 42) / 42;
      if (f < 34 + i * 7) return null;
      return (
        <ellipse
          key={i}
          cx="725"
          cy={1275 + t * 240}
          rx="10"
          ry="16"
          fill={J.agua}
          opacity={1 - t * 0.5}
        />
      );
    })}
    <path
      d="M590 1500Q590 1590 725 1590Q860 1590 860 1500"
      fill="none"
      stroke={J.preto}
      strokeWidth="10"
      strokeLinecap="round"
      opacity={prog(f, 20, 10)}
    />
  </svg>
);

const Eletrica: React.FC<{ readonly f: number }> = ({ f }) => {
  const on = prog(f, 34, 8);
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <circle
        cx="640"
        cy="1060"
        r={240 * on * (1 + Math.sin(f / 5) * 0.08)}
        fill="rgba(255,178,122,0.35)"
      />
      <DrawPath
        d={`M0 ${BASE}H220V1150H560`}
        progress={prog(f, 0, 30)}
        length={1250}
        color={J.laranja}
        width={14}
      />
      <rect
        x="170"
        y="1260"
        width="100"
        height="160"
        rx="18"
        fill="#FFFFFF"
        stroke={J.preto}
        strokeWidth="8"
        opacity={prog(f, 10, 8)}
      />
      <rect
        x="200"
        y={on > 0.5 ? 1290 : 1340}
        width="40"
        height="60"
        rx="10"
        fill={on > 0.5 ? J.laranja : J.preto}
        opacity={prog(f, 10, 8)}
      />
      <circle
        cx="640"
        cy="1060"
        r="90"
        fill={on > 0.5 ? "#FFE3C7" : "#FFFFFF"}
        stroke={J.preto}
        strokeWidth="8"
        opacity={prog(f, 20, 10)}
      />
      <path
        d="M610 1080Q625 1040 640 1080Q655 1040 670 1080"
        fill="none"
        stroke={on > 0.5 ? J.laranja : J.preto}
        strokeWidth="6"
        opacity={prog(f, 20, 10)}
      />
      <rect
        x="600"
        y="1150"
        width="80"
        height="50"
        rx="8"
        fill={J.preto}
        opacity={prog(f, 20, 10)}
      />
    </svg>
  );
};

const Caixa: React.FC<{ readonly f: number }> = ({ f }) => {
  const level = interpolate(f, [20, 70], [0, 0.78], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const top = 1500 - 430 * level;
  const wave = new Array(11)
    .fill(0)
    .map((_, i) => `${308 + i * 46.4} ${top + Math.sin(f / 5 + i) * 8}`)
    .join(" L");
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <clipPath id="j04-tank">
          <rect x="308" y="1060" width="464" height="440" rx="40" />
        </clipPath>
      </defs>
      <DrawPath
        d={`M0 ${BASE}H190V1120H330`}
        progress={prog(f, 0, 24)}
        length={850}
        color={J.laranja}
        width={18}
      />
      <g clipPath="url(#j04-tank)">
        <path d={`M308 1500 L${wave} L772 1500Z`} fill={J.agua} />
      </g>
      <rect
        x="300"
        y="1050"
        width="480"
        height="460"
        rx="44"
        fill="none"
        stroke={J.preto}
        strokeWidth="10"
        opacity={prog(f, 6, 10)}
      />
      <rect
        x="280"
        y="1010"
        width="520"
        height="50"
        rx="20"
        fill={J.preto}
        opacity={prog(f, 6, 10)}
      />
    </svg>
  );
};

const Manutencao: React.FC<{ readonly f: number }> = ({ f }) => {
  const teeth = new Array(10)
    .fill(0)
    .map((_, i) => (
      <rect
        key={i}
        x="-22"
        y="-170"
        width="44"
        height="60"
        rx="8"
        fill={J.laranja}
        transform={`rotate(${i * 36})`}
      />
    ));
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <DrawPath
        d={`M0 ${BASE}H460V1420`}
        progress={prog(f, 0, 24)}
        length={900}
        color={J.laranja}
        width={14}
      />
      <g
        transform={`translate(460 1240) rotate(${f * 3}) scale(${prog(f, 8, 14)})`}
      >
        {teeth}
        <circle r="135" fill={J.laranja} />
        <circle r="55" fill="#FFFFFF" />
      </g>
      <g
        transform={`translate(760 1080) rotate(${-30 + Math.sin(f / 6) * 25}) scale(${prog(f, 16, 14)})`}
      >
        <path d="M-14 0H14V300H-14Z" fill={J.preto} />
        <path
          d="M-60 -40A60 60 0 1 0 60 -40L30 -40L30 10L-30 10L-30 -40Z"
          fill={J.preto}
        />
      </g>
    </svg>
  );
};

// 20–29s · "Também realizamos instalações elétricas, hidráulicas, caixas d'água e
// manutenção." A câmera desliza por quatro estações ligadas pela mesma linha laranja.
export const J04Solucoes: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, PAN_F, PAN_X, {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const stations = [Hidraulica, Eletrica, Caixa, Manutencao];

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <Sfx at={ST[1] + 34} name="tap" volume={0.4} dir={J_SFX} />
      <Camera
        keys={[
          { f: 0, z: 1.0 },
          { f: 290, z: 1.06 },
        ]}
        origin="50% 70%"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 4320,
            height: 1920,
            translate: `${-pan}px 0px`,
          }}
        >
          {stations.map((Station, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: k * 1080,
                top: 0,
                width: 1080,
                height: 1920,
              }}
            >
              <Station f={frame - ST[k]} />
              <div
                style={{ position: "absolute", top: 1700, left: 0, right: 0 }}
              >
                <Kinetic
                  delay={ST[k] + 10}
                  stagger={4}
                  lines={[
                    { text: LABELS[k], size: 64, weight: 500, color: J.preto },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </Camera>
      <div style={{ position: "absolute", top: 230, left: 60, right: 60 }}>
        <Kinetic
          delay={14}
          stagger={5}
          lines={[
            {
              text: "Soluções para",
              size: 88,
              weight: 300,
              color: J.cinzaMedio,
            },
            {
              text: "o seu dia a dia.",
              size: 108,
              weight: 600,
              color: J.preto,
            },
          ]}
          lineHeight={1.1}
        />
      </div>
    </AbsoluteFill>
  );
};
