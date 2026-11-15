import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, enter } from "../components/anim";
import { Pill } from "../components/Pill";
import { BrushIcon, HarnessIcon, HelmetIcon, Sparkle, WhatsIcon } from "../components/Icons";
import { LogoCircle } from "../components/LogoReveal";
import { Ring } from "../components/Ring";
import { COLORS, FONT_BODY, FONT_TITLE } from "../theme";

const K = COLORS.black;
const O = COLORS.orange;
const ease = Easing.bezier(0.33, 1, 0.68, 1);

/** Gráfico de linha laranja descendo */
export const ChartDown: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [8, 50], [0, 1], { ...clamp, easing: ease });
  const L = 1000;
  const pts = "40,60 160,90 250,70 360,170 450,150 560,260 660,240 780,360";
  const arrowO = interpolate(frame, [46, 52], [0, 1], clamp);
  return (
    <svg width={860} height={460} viewBox="0 0 860 460" style={{ overflow: "visible" }}>
      {[100, 200, 300, 400].map((y) => (
        <line key={y} x1={20} x2={840} y1={y} y2={y} stroke="#FAFAFA" strokeOpacity={0.12} strokeWidth={3} />
      ))}
      <polyline
        points={pts}
        fill="none"
        stroke={O}
        strokeWidth={16}
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={L}
        strokeDasharray={L}
        strokeDashoffset={L * (1 - p)}
      />
      <polygon points="780,410 730,350 820,330" fill={O} opacity={arrowO} />
    </svg>
  );
};

/** Ícone de casa: laranja "pinta" de baixo pra cima */
export const HouseFill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = enter(frame, fps, 0);
  const fill = interpolate(frame, [14, 60], [200, 20], { ...clamp, easing: ease });
  const house = "M20 98 L100 26 L180 98 L160 98 L160 182 L40 182 L40 98 Z";
  return (
    <svg width={560} height={560} viewBox="0 0 200 200" style={e.style}>
      <defs>
        <clipPath id="house-clip">
          <path d={house} />
        </clipPath>
      </defs>
      <rect x={0} y={fill} width={200} height={200} fill={O} clipPath="url(#house-clip)" />
      <rect x={0} y={fill - 3} width={200} height={6} fill="#fff" opacity={0.5} clipPath="url(#house-clip)" />
      <path d={house} fill="none" stroke={K} strokeWidth={8} strokeLinejoin="round" />
      <rect x={86} y={128} width={28} height={54} rx={3} fill={K} />
      <rect x={56} y={112} width={22} height={22} rx={2} fill="none" stroke={K} strokeWidth={6} />
      <rect x={122} y={112} width={22} height={22} rx={2} fill="none" stroke={K} strokeWidth={6} />
    </svg>
  );
};

/** Prédio: faixas laranja sobem andar por andar */
export const BuildingFloors: React.FC<{ floors: number }> = ({ floors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = enter(frame, fps, 0);
  const top = 20;
  const bottom = 190;
  const h = (bottom - top) / floors;
  return (
    <svg width={500} height={600} viewBox="0 0 170 205" style={e.style}>
      {Array.from({ length: floors }).map((_, i) => {
        const y = bottom - (i + 1) * h;
        const p = interpolate(frame, [14 + i * 8, 24 + i * 8], [0, 1], { ...clamp, easing: ease });
        return <rect key={i} x={30} y={y + h * (1 - p)} width={110} height={h * p} fill={O} />;
      })}
      <rect x={30} y={top} width={110} height={bottom - top} fill="none" stroke={K} strokeWidth={7} />
      {Array.from({ length: floors }).map((_, i) => {
        const y = top + i * h + h * 0.3;
        return [44, 74, 104].map((x) => (
          <rect key={`${i}-${x}`} x={x} y={y} width={20} height={h * 0.4} rx={2} fill={K} />
        ));
      })}
      <rect x={14} y={bottom} width={142} height={9} rx={3} fill={K} />
    </svg>
  );
};

/** Pills em cascata */
export const PillsCascade: React.FC<{ items: string[] }> = ({ items }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
    {items.map((it, i) => (
      <Pill
        key={it}
        label={it}
        delay={16 + i * 8}
        variant="body"
        fontSize={56}
        bg={i % 2 === 0 ? COLORS.black : O}
        style={{ translate: `${(i - 1) * 70}px 0px` }}
      />
    ))}
  </div>
);

/** Rolo de tinta atravessando a tela deixando rastro laranja */
export const RollerTrail: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [10, 62], [-160, 1240], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.4, 1),
  });
  const bob = Math.sin(frame * 0.6) * 6;
  return (
    <div style={{ position: "relative", width: 1080, height: 360 }}>
      <svg width={1080} height={360} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="roll-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.2" numOctaves={2} seed={2} />
            <feDisplacementMap in="SourceGraphic" scale={18} />
          </filter>
        </defs>
        <rect x={-40} y={70} width={Math.max(0, x + 40)} height={220} fill={O} filter="url(#roll-rough)" />
      </svg>
      <svg
        width={260}
        height={360}
        viewBox="0 0 130 180"
        style={{ position: "absolute", left: x - 40, top: bob }}
      >
        <rect x={6} y={30} width={44} height={120} rx={14} fill={O} stroke={K} strokeWidth={4} />
        <path d="M28 30 L28 16 L96 16 L96 70" fill="none" stroke={K} strokeWidth={8} strokeLinejoin="round" />
        <rect x={86} y={68} width={20} height={90} rx={9} fill={K} />
      </svg>
    </div>
  );
};

/** 2 cards com ícone e check laranja animado */
export const CheckCards: React.FC<{
  items: { icon: "helmet" | "harness"; label: string }[];
}> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
      {items.map((it, i) => {
        const d = 16 + i * 10;
        const s = spring({ frame: frame - d, fps, config: { damping: 15 } });
        const c = interpolate(frame, [d + 10, d + 24], [0, 1], { ...clamp, easing: ease });
        const L = 100;
        return (
          <div
            key={it.label}
            style={{
              width: 860,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: 34,
              background: "#fff",
              borderRadius: 40,
              padding: "34px 44px",
              boxShadow: "0 24px 60px rgba(20,20,20,0.12)",
              opacity: Math.min(1, s * 1.5),
              translate: `${(1 - s) * (i % 2 === 0 ? -300 : 300)}px 0px`,
            }}
          >
            {it.icon === "helmet" ? <HelmetIcon /> : <HarnessIcon />}
            <div
              style={{
                flex: 1,
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: 48,
                color: K,
                lineHeight: 1.1,
              }}
            >
              {it.label}
            </div>
            <svg width={100} height={100} viewBox="0 0 100 100">
              <circle cx={50} cy={50} r={44} fill={O} opacity={c} />
              <path
                d="M28 52 L44 67 L73 36"
                fill="none"
                stroke="#fff"
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={L}
                strokeDasharray={L}
                strokeDashoffset={L * (1 - c)}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

/** Brilhos piscando ao redor do texto */
const SPARKS = [
  { x: -360, y: -300, s: 90, ph: 0 },
  { x: 340, y: -260, s: 70, ph: 1.7 },
  { x: 400, y: 180, s: 100, ph: 3.1 },
  { x: -380, y: 230, s: 64, ph: 4.4 },
  { x: -120, y: -400, s: 50, ph: 2.3 },
  { x: 160, y: 380, s: 56, ph: 5.2 },
];
export const Sparkles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%" }}>
      {SPARKS.map((sp, i) => {
        const appear = interpolate(frame, [12 + i * 3, 20 + i * 3], [0, 1], clamp);
        const tw = 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.18 + sp.ph));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sp.x - sp.s / 2,
              top: sp.y - sp.s / 2,
              scale: `${appear * tw}`,
              rotate: `${frame * 1.5 + i * 20}deg`,
            }}
          >
            <Sparkle size={sp.s} color={i % 2 === 0 ? O : K} />
          </div>
        );
      })}
    </div>
  );
};

/** Calendário com página virando (rotateX) */
export const CalendarFlip: React.FC<{ day: number }> = ({ day }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = enter(frame, fps, 0);
  const flip = interpolate(frame, [20, 40], [0, -180], {
    ...clamp,
    easing: Easing.bezier(0.5, 0, 0.3, 1),
  });
  const check = interpolate(frame, [36, 50], [0, 1], { ...clamp, easing: ease });
  const W = 440;
  const page = (content: React.ReactNode, style?: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 110,
        width: W,
        height: 320,
        background: "#fff",
        borderRadius: "0 0 36px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        ...style,
      }}
    >
      {content}
    </div>
  );
  const num = (n: number) => (
    <div style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 210, color: K, lineHeight: 1 }}>
      {n}
    </div>
  );
  return (
    <div
      style={{
        ...e.style,
        position: "relative",
        width: W,
        height: 430,
        perspective: 1400,
        filter: `${e.style.filter} drop-shadow(0 24px 40px rgba(20,20,20,0.18))`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: 112,
          background: O,
          borderRadius: "36px 36px 0 0",
        }}
      />
      {[110, 330].map((x) => (
        <div
          key={x}
          style={{ position: "absolute", left: x - 14, top: -26, width: 28, height: 70, borderRadius: 14, background: K }}
        />
      ))}
      {page(
        <svg width={220} height={220} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={44} fill={O} opacity={check} />
          <path
            d="M28 52 L44 67 L73 36"
            fill="none"
            stroke="#fff"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 * (1 - check)}
          />
        </svg>,
      )}
      {page(num(day), {
        transformOrigin: "50% 0%",
        rotate: "x " + flip + "deg",
        boxShadow: "inset 0 -6px 0 #EEE",
      })}
    </div>
  );
};

/** Pincel passa da esquerda pra direita revelando o conteúdo */
export const BrushReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const W = 920;
  const p = interpolate(frame, [6, 40], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.4, 1) });
  const x = -60 + p * (W + 120);
  const leave = interpolate(frame, [40, 50], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width: W }}>
      <div style={{ clipPath: `inset(-40px ${Math.max(0, W - x)}px -40px -40px)` }}>{children}</div>
      <div
        style={{
          position: "absolute",
          left: x - 70,
          top: -150,
          rotate: `${28 + Math.sin(frame * 0.5) * 4}deg`,
          translate: `${leave * 300}px ${-leave * 200}px`,
          opacity: 1 - leave,
          filter: "drop-shadow(0 0 0 #FAFAFA) drop-shadow(0 0 2px #FAFAFA)",
        }}
      >
        <div style={{ rotate: "180deg" }}>
          <BrushIcon size={300} />
        </div>
      </div>
    </div>
  );
};

/** Logo no topo com anel laranja pulsando atrás */
export const CtaLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const size = 470;
  const pulse = (frame % 30) / 30;
  return (
    <div style={{ position: "relative", width: size, height: size, scale: `${0.6 + 0.4 * s}`, opacity: Math.min(1, s * 2) }}>
      {[0, 15].map((off) => {
        const pp = ((frame + off) % 30) / 30;
        return (
          <div
            key={off}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `8px solid ${O}`,
              scale: `${1 + 0.35 * pp}`,
              opacity: 0.8 * (1 - pp),
            }}
          />
        );
      })}
      <Ring size={size + 60} color={O} speed={1} dash="400 60 80 60" strokeWidth={5} />
      <div style={{ scale: `${1 + 0.02 * Math.sin(pulse * Math.PI * 2)}` }}>
        <LogoCircle size={size} />
      </div>
    </div>
  );
};

/** Pill verde do WhatsApp com número */
export const WhatsappPill: React.FC<{ phone: string }> = ({ phone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconS = spring({ frame: frame - 14, fps, config: { damping: 10 } });
  return (
    <Pill
      label={phone}
      delay={8}
      bg={COLORS.whatsapp}
      fontSize={92}
      icon={
        <div style={{ scale: `${iconS}`, rotate: `${(1 - iconS) * -90}deg`, display: "flex" }}>
          <WhatsIcon size={100} />
        </div>
      }
      style={{ padding: "30px 60px 30px 44px", letterSpacing: 2 }}
    />
  );
};
