import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Camera,
  CLAMP,
  DrawPath,
  FONT,
  Kinetic,
  prog,
  Sfx,
  useSpring,
} from "../../pixora/ui";
import { J, J_SFX } from "../tema";

const WIN = { x: 720, y: 1095 };
const ZOOM = 108;

const Tag: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
}> = ({ at, x, y, children }) => {
  const s = useSpring(at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        padding: "12px 30px",
        borderRadius: 40,
        border: `3px solid ${J.laranja}`,
        background: "#FFFFFF",
        fontFamily: FONT,
        fontSize: 40,
        fontWeight: 500,
        color: J.preto,
        scale: String(s),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** Estrelinha de brilho (pós-obra). */
const Brilho: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly size?: number;
}> = ({ at, x, y, size = 50 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, at, 18);
  if (frame < at) return null;
  const s = Math.sin(t * Math.PI) * 0.6 + (t >= 1 ? 0.4 : t * 0.4);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{
        position: "absolute",
        left: x,
        top: y,
        scale: String(s),
        rotate: `${t * 90}deg`,
      }}
    >
      <path
        d="M25 0C27 18 32 23 50 25C32 27 27 32 25 50C23 32 18 27 0 25C18 23 23 18 25 0Z"
        fill={J.laranja}
      />
    </svg>
  );
};

// 12–20s · "Do telhado às calhas, das pequenas reformas aos serviços de pós-obra."
// A linha laranja desenha o telhado e desce pela calha; a câmera entra pela janela.
export const J03Detalhes: React.FC = () => {
  const frame = useCurrentFrame();
  const roof = prog(frame, 6, 34);
  const walls = prog(frame, 16, 16);
  const tiles = prog(frame, 32, 26);
  const gutter = prog(frame, 44, 26);
  const inside = interpolate(frame, [ZOOM + 18, ZOOM + 32], [0, 1], CLAMP);
  const clean = interpolate(frame, [186, 222], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <Sfx at={6} name="brush" volume={0.35} dir={J_SFX} />
      <Sfx at={186} name="brush" volume={0.35} dir={J_SFX} />

      {/* exterior: casa */}
      <Camera
        keys={[
          { f: 0, z: 1.0 },
          { f: ZOOM, z: 1.06 },
          { f: ZOOM + 32, z: 5.5 },
        ]}
        origin={`${(WIN.x / 1080) * 100}% ${(WIN.y / 1920) * 100}%`}
      >
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <clipPath id="j03-roof">
              <path d="M150 960L540 640L930 960Z" />
            </clipPath>
          </defs>
          <g opacity={walls}>
            <rect
              x="230"
              y="960"
              width="620"
              height="440"
              fill="#FFFFFF"
              stroke={J.preto}
              strokeWidth="6"
            />
            <rect
              x="480"
              y="1220"
              width="120"
              height="180"
              fill={J.cinza}
              stroke={J.preto}
              strokeWidth="6"
            />
            <rect
              x="300"
              y="1040"
              width="120"
              height="110"
              fill={J.agua}
              opacity="0.5"
              stroke={J.preto}
              strokeWidth="6"
            />
            <rect
              x="660"
              y="1040"
              width="120"
              height="110"
              fill={J.agua}
              opacity="0.5"
              stroke={J.preto}
              strokeWidth="6"
            />
          </g>
          <g clipPath="url(#j03-roof)">
            {new Array(8).fill(0).map((_, i) => (
              <line
                key={i}
                x1={150}
                x2={150 + 780 * tiles}
                y1={690 + i * 38}
                y2={690 + i * 38}
                stroke="#BDBDBD"
                strokeWidth="14"
                strokeDasharray="60 8"
              />
            ))}
          </g>
          <DrawPath
            d="M150 960L540 640L930 960"
            progress={roof}
            length={1010}
            color={J.laranja}
            width={10}
          />
          <DrawPath
            d="M140 976H940V1400"
            progress={gutter}
            length={1230}
            color={J.laranja}
            width={8}
          />
          {/* água descendo pela calha */}
          {new Array(5).fill(0).map((_, i) => {
            const t = prog(frame, 70 + i * 7, 20);
            if (t <= 0 || t >= 1) return null;
            return (
              <ellipse
                key={i}
                cx={940}
                cy={980 + t * 420}
                rx="7"
                ry="12"
                fill={J.agua}
              />
            );
          })}
        </svg>
        <Tag at={30} x={540} y={580}>
          Telhado
        </Tag>
        <Tag at={66} x={940} y={1460}>
          Calhas
        </Tag>
      </Camera>

      {/* interior: reforma e pós-obra */}
      <AbsoluteFill style={{ opacity: inside, background: J.cinza }}>
        <Camera
          keys={[
            { f: ZOOM + 20, z: 1.12 },
            { f: 260, z: 1.0 },
          ]}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1380,
              height: 540,
              background: "#FFFFFF",
            }}
          />
          {/* piso sendo assentado */}
          {new Array(12).fill(0).map((_, i) => {
            const s = prog(frame, 148 + i * 2, 8);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 30 + (i % 6) * 170,
                  top: 1420 + Math.floor(i / 6) * 170,
                  width: 160,
                  height: 160,
                  borderRadius: 6,
                  background: "#E9DED2",
                  border: "2px solid #D6C7B6",
                  scale: String(s),
                }}
              />
            );
          })}
          {/* escada */}
          <svg
            width="300"
            height="760"
            viewBox="0 0 300 760"
            style={{ position: "absolute", left: 120, top: 640 }}
          >
            <path
              d="M80 0L10 740M80 0L230 740"
              stroke={J.preto}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {[150, 300, 450, 600].map((y) => (
              <line
                key={y}
                x1={80 - (y / 740) * 70}
                y1={y}
                x2={80 + (y / 740) * 150}
                y2={y}
                stroke={J.preto}
                strokeWidth="10"
              />
            ))}
          </svg>
          {/* lata de tinta */}
          <svg
            width="220"
            height="240"
            viewBox="0 0 220 240"
            style={{ position: "absolute", left: 700, top: 1190 }}
          >
            <path d="M20 40H200L185 230H35Z" fill={J.laranja} />
            <rect x="10" y="20" width="200" height="30" rx="8" fill={J.preto} />
            <path
              d="M60 50V90"
              stroke={J.laranjaClaro}
              strokeWidth="14"
              strokeLinecap="round"
            />
          </svg>
          {/* fitas nos cantos da parede */}
          <div
            style={{
              position: "absolute",
              left: 460,
              top: 700,
              width: 380,
              height: 10,
              background: J.laranja,
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 830,
              top: 700,
              width: 10,
              height: 420,
              background: J.laranja,
              opacity: 0.8,
            }}
          />

          {/* poeira que some com a limpeza */}
          {new Array(26).fill(0).map((_, i) => {
            const x = 60 + ((i * 137) % 960);
            const y = 560 + ((i * 89) % 1250);
            const gone = clean * 1100 > x;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y + Math.sin(frame / 10 + i) * 8,
                  width: 10 + (i % 3) * 6,
                  height: 10 + (i % 3) * 6,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.18)",
                  opacity: gone
                    ? 0
                    : interpolate(frame, [ZOOM + 24, ZOOM + 40], [0, 1], CLAMP),
                }}
              />
            );
          })}
          {/* faixa de limpeza */}
          <div
            style={{
              position: "absolute",
              top: 500,
              bottom: 0,
              left: clean * 1100 - 20,
              width: 12,
              borderRadius: 6,
              background: J.laranja,
              opacity: clean > 0 && clean < 1 ? 0.9 : 0,
              boxShadow: `0 0 30px ${J.laranja}`,
            }}
          />
          <Brilho at={204} x={260} y={900} />
          <Brilho at={212} x={620} y={820} size={70} />
          <Brilho at={220} x={900} y={1500} />
          <Brilho at={226} x={420} y={1560} size={40} />

          <Tag at={150} x={540} y={560}>
            Reformas
          </Tag>
          <Tag at={190} x={540} y={1800}>
            Pós-obra
          </Tag>
        </Camera>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: interpolate(
            frame,
            [ZOOM, ZOOM + 8, ZOOM + 30, ZOOM + 42],
            [1, 0, 0, 1],
            CLAMP,
          ),
        }}
      >
        <div style={{ position: "absolute", top: 230, left: 60, right: 60 }}>
          <Kinetic
            delay={20}
            stagger={5}
            lines={[
              {
                text: "Cuidado em",
                size: 88,
                weight: 300,
                color: J.cinzaMedio,
              },
              { text: "cada detalhe.", size: 108, weight: 600, color: J.preto },
            ]}
            lineHeight={1.1}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
