import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { PHOTOS } from "./assets";
import { C, SERIF, TYPE, cutoutFilter, ease, easeInOut } from "./lib";

/* ---------- photos (public domain, from Wikimedia Commons) ---------- */
export const has = (k: string) => Boolean(PHOTOS[k]);

/** Rectangular archival photo (B&W, printed look, white border optional). */
export const Photo: React.FC<{
  k: string;
  w: number;
  h: number;
  pos?: string;
  border?: number;
  tint?: "bw" | "warm" | "red" | "none";
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}> = ({
  k,
  w,
  h,
  pos = "50% 30%",
  border = 0,
  tint = "bw",
  style,
  fallback,
}) => {
  const fr = useCurrentFrame();
  const p = PHOTOS[k];
  const sway = border
    ? `perspective(1400px) rotateY(${Math.sin(fr / 38 + w) * 7}deg) rotateX(${Math.cos(fr / 45 + h) * 4}deg)`
    : undefined;
  const kb = 1.04 + fr * 0.0006;
  const filter =
    tint === "bw"
      ? "grayscale(1) contrast(1.15) brightness(1.02)"
      : tint === "warm"
        ? "grayscale(1) sepia(0.35) contrast(1.1)"
        : tint === "red"
          ? "grayscale(1) contrast(1.5) brightness(1.1)"
          : "none";
  return (
    <div
      style={{
        width: w,
        height: h,
        padding: border,
        background: border ? "#f4f1ea" : undefined,
        boxShadow: border ? "8px 16px 26px rgba(0,0,0,0.35)" : undefined,
        position: "relative",
        transform: sway,
        ...style,
      }}
    >
      {border ? (
        <>
          <Tape style={{ left: -30, top: -14, rotate: "-32deg" }} />
          <Tape style={{ right: -30, top: -14, rotate: "30deg" }} />
        </>
      ) : null}
      {p ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(`che/${p.file}`)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: pos,
              filter,
              scale: String(kb),
            }}
          />
          {tint === "red" ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: C.red,
                mixBlendMode: "screen",
              }}
            />
          ) : null}
        </div>
      ) : (
        (fallback ?? (
          <MissingPhoto w={w - border * 2} h={h - border * 2} label={k} />
        ))
      )}
    </div>
  );
};

/** Background-removed cutout (PNG) with sticker edge. */
export const Cutout: React.FC<{
  k: string;
  h: number;
  style?: React.CSSProperties;
  edge?: number;
  fallback?: React.ReactNode;
}> = ({ k, h, style, edge = 5, fallback }) => {
  const p = PHOTOS[k];
  if (!p || !p.cut)
    return <>{fallback ?? <MissingPhoto w={h * 0.7} h={h} label={k} />}</>;
  return (
    <Img
      src={staticFile(`che/${p.cut}`)}
      style={{
        height: h,
        width: "auto",
        filter: `grayscale(1) contrast(1.12) ${cutoutFilter(edge)}`,
        ...style,
      }}
    />
  );
};

const MissingPhoto: React.FC<{ w: number; h: number; label: string }> = ({
  w,
  h,
  label,
}) => (
  <div
    style={{
      width: w,
      height: h,
      background:
        "repeating-linear-gradient(45deg,#cfc9bc 0 14px,#c4bdae 14px 28px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: TYPE,
      fontSize: 34,
      color: "#555",
    }}
  >
    [{label}]
  </div>
);

/** The Korda face as a red/black screen print (t-shirts, posters). */
export const PrintFace: React.FC<{
  h: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ h, color = C.red, style }) => {
  const p = PHOTOS.korda;
  if (!p?.cut) return <Star size={h * 0.8} color={color} />;
  const src = staticFile(`che/${p.cut}`);
  return (
    <div
      style={{
        position: "relative",
        height: h,
        width: h * (950 / 1055),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color,
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      />
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: "grayscale(1) contrast(2.6) brightness(1.2)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
};

/* ---------- drawn collage elements ---------- */
export const Star: React.FC<{
  size: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size, color = C.red, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <polygon
      points="50,4 61,38 97,38 68,59 79,94 50,72 21,94 32,59 3,38 39,38"
      fill={color}
    />
  </svg>
);

export const TShirt: React.FC<{
  w: number;
  color?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, color = "#f2f0ea", children, style }) => (
  <div style={{ position: "relative", width: w, height: w * 1.05, ...style }}>
    <svg
      width={w}
      height={w * 1.05}
      viewBox="0 0 400 420"
      style={{
        position: "absolute",
        inset: 0,
        filter: "drop-shadow(10px 18px 16px rgba(0,0,0,.3))",
      }}
    >
      <path
        d="M130 20 Q200 70 270 20 L380 70 L340 160 L300 140 L300 410 L100 410 L100 140 L60 160 L20 70 Z"
        fill={color}
        stroke="rgba(0,0,0,.25)"
        strokeWidth={2}
      />
      <path
        d="M130 20 Q200 75 270 20"
        fill="none"
        stroke="rgba(0,0,0,.3)"
        strokeWidth={4}
      />
    </svg>
    <div
      style={{
        position: "absolute",
        left: "26%",
        top: "30%",
        width: "48%",
        height: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  </div>
);

export const Books: React.FC<{ w: number }> = ({ w }) => {
  const books = [
    { h: 70, c: "#7a2b25", t: "MARX" },
    { h: 58, c: "#2f3b4a", t: "NERUDA" },
    { h: 64, c: "#c9b78f", t: "FREUD" },
    { h: 54, c: "#4c5a3a", t: "JULIO VERNE" },
    { h: 74, c: "#8c6a3c", t: "MEDICINA" },
  ];
  return (
    <svg
      width={w}
      height={w * 0.9}
      viewBox="0 0 400 360"
      style={{ filter: "drop-shadow(10px 16px 14px rgba(0,0,0,.3))" }}
    >
      {books.map((b, i) => {
        const y = 340 - books.slice(0, i + 1).reduce((s, x) => s + x.h, 0);
        const off = (i % 2 ? 1 : -1) * (i * 6);
        return (
          <g key={i} transform={`translate(${40 + off} ${y})`}>
            <rect width={320} height={b.h - 4} rx={4} fill={b.c} />
            <rect
              x={8}
              y={6}
              width={304}
              height={3}
              fill="rgba(255,255,255,.35)"
            />
            <text
              x={160}
              y={b.h / 2 + 8}
              textAnchor="middle"
              fontFamily={TYPE}
              fontSize={24}
              fill="#f1ead8"
            >
              {b.t}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Camera aperture made of blades: open = 1, closed = 0. */
export const Aperture: React.FC<{ size: number; open: number }> = ({
  size,
  open,
}) => {
  const blades = 7;
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200">
      <defs>
        <clipPath id="apclip">
          <circle r={98} />
        </clipPath>
      </defs>
      <g clipPath="url(#apclip)">
        {Array.from({ length: blades }).map((_, i) => {
          const a = (i / blades) * Math.PI * 2;
          const rot = (a * 180) / Math.PI + (1 - open) * 32;
          const inset = 20 + open * 62;
          return (
            <g key={i} transform={`rotate(${rot})`}>
              <path
                d={`M${inset} -120 L${inset + 140} -40 L${inset + 30} 120 L${inset - 10} 120 Z`}
                fill={i % 2 ? "#2b2b2b" : "#333"}
                stroke="#555"
                strokeWidth={1}
              />
            </g>
          );
        })}
      </g>
      <circle r={98} fill="none" stroke="#777" strokeWidth={4} />
      <circle r={92} fill="none" stroke="#222" strokeWidth={6} />
    </svg>
  );
};

export const Banknote: React.FC<{ w: number }> = ({ w }) => {
  const f = useCurrentFrame();
  const sig = ease(f, 18, 50, 0, 1, easeInOut);
  return (
    <svg
      width={w}
      height={w * 0.45}
      viewBox="0 0 600 270"
      style={{ filter: "drop-shadow(10px 16px 14px rgba(0,0,0,.3))" }}
    >
      <rect width={600} height={270} rx={8} fill="#cfd8c4" />
      <rect
        x={14}
        y={14}
        width={572}
        height={242}
        rx={4}
        fill="none"
        stroke="#56684d"
        strokeWidth={3}
      />
      {Array.from({ length: 22 }).map((_, i) => (
        <circle
          key={i}
          cx={470}
          cy={135}
          r={8 + i * 4}
          fill="none"
          stroke="#7c8f70"
          strokeOpacity={0.35}
        />
      ))}
      <text x={40} y={70} fontFamily={TYPE} fontSize={30} fill="#3d4c36">
        BANCO NACIONAL
      </text>
      <text x={40} y={110} fontFamily={TYPE} fontSize={22} fill="#3d4c36">
        PRESIDENTE · 1959
      </text>
      <text
        x={470}
        y={155}
        textAnchor="middle"
        fontFamily={SERIF}
        fontSize={70}
        fill="#3d4c36"
      >
        $
      </text>
      <path
        d="M60 210 C 80 160, 100 160, 95 200 C 92 225, 120 180, 140 190 C 160 200, 150 230, 175 205 C 190 190, 210 200, 240 196"
        fill="none"
        stroke="#1c2a1a"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={400}
        strokeDashoffset={400 * (1 - sig)}
      />
      <text x={60} y={240} fontFamily={TYPE} fontSize={16} fill="#3d4c36">
        assinatura: "Che"
      </text>
    </svg>
  );
};

export const Yacht: React.FC<{ w: number }> = ({ w }) => (
  <svg
    width={w}
    height={w * 0.5}
    viewBox="0 0 400 200"
    style={{ filter: "drop-shadow(8px 14px 10px rgba(0,0,0,.35))" }}
  >
    <path
      d="M20 120 L380 120 L340 170 L60 170 Z"
      fill="#f3f1ea"
      stroke="#222"
      strokeWidth={3}
    />
    <rect
      x={120}
      y={80}
      width={160}
      height={40}
      fill="#f3f1ea"
      stroke="#222"
      strokeWidth={3}
    />
    <rect
      x={170}
      y={50}
      width={70}
      height={30}
      fill="#f3f1ea"
      stroke="#222"
      strokeWidth={3}
    />
    {[140, 175, 210, 245].map((x) => (
      <rect key={x} x={x} y={92} width={18} height={14} fill="#333" />
    ))}
    <line x1={205} y1={50} x2={205} y2={10} stroke="#222" strokeWidth={4} />
    <text x={300} y={152} fontFamily={TYPE} fontSize={22} fill="#222">
      GRANMA
    </text>
  </svg>
);

export const Motorcycle: React.FC<{ w: number }> = ({ w }) => (
  <svg
    width={w}
    height={w * 0.62}
    viewBox="0 0 400 250"
    style={{ filter: "drop-shadow(8px 14px 10px rgba(0,0,0,.35))" }}
  >
    {[90, 310].map((cx) => (
      <g key={cx}>
        <circle
          cx={cx}
          cy={180}
          r={58}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={16}
        />
        <circle cx={cx} cy={180} r={10} fill="#1a1a1a" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={cx}
            y1={180}
            x2={cx + Math.cos((i * Math.PI) / 6) * 50}
            y2={180 + Math.sin((i * Math.PI) / 6) * 50}
            stroke="#444"
            strokeWidth={2}
          />
        ))}
      </g>
    ))}
    <path
      d="M90 180 L170 110 L260 110 L310 180"
      fill="none"
      stroke="#1a1a1a"
      strokeWidth={10}
    />
    <rect x={160} y={80} width={110} height={40} rx={16} fill="#2a2a2a" />
    <path
      d="M150 80 L210 78"
      stroke="#111"
      strokeWidth={14}
      strokeLinecap="round"
    />
    <path
      d="M270 90 L300 40 L330 40"
      fill="none"
      stroke="#1a1a1a"
      strokeWidth={8}
      strokeLinecap="round"
    />
    <rect x={180} y={130} width={60} height={40} rx={6} fill="#3a3a3a" />
  </svg>
);

/** Typed paper label (like a clipped caption). */
export const Label: React.FC<{
  text: string;
  start: number;
  size?: number;
  style?: React.CSSProperties;
  bg?: string;
  color?: string;
}> = ({ text, start, size = 34, style, bg = "#f4f1ea", color = C.ink }) => {
  const f = useCurrentFrame();
  const p = ease(f, start, start + 12);
  const n = Math.floor(Math.max(0, f - start) * 1.2);
  return (
    <div
      style={{
        position: "absolute",
        background: bg,
        padding: "8px 16px",
        fontFamily: TYPE,
        fontSize: size,
        color,
        boxShadow: "4px 8px 14px rgba(0,0,0,.25)",
        opacity: p,
        rotate: "-2deg",
        whiteSpace: "pre",
        ...style,
      }}
    >
      {text.slice(0, n)}
    </div>
  );
};

/* ---------- richer collage pieces ---------- */
export const Tape: React.FC<{ style?: React.CSSProperties; w?: number }> = ({
  style,
  w = 150,
}) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: 44,
      background: "rgba(236,228,204,0.78)",
      boxShadow: "0 2px 6px rgba(0,0,0,.18)",
      zIndex: 3,
      clipPath:
        "polygon(0 8%, 4% 0, 9% 10%, 14% 0, 100% 0, 96% 50%, 100% 100%, 8% 100%, 3% 88%, 0 100%, 4% 50%)",
      ...style,
    }}
  />
);

/** Newspaper clipping with headline, fake text columns and optional photo. */
export const Clipping: React.FC<{
  w: number;
  paper?: string;
  kicker: string;
  headline: string;
  photo?: string;
  start?: number;
  style?: React.CSSProperties;
}> = ({ w, kicker, headline, photo, start = 0, paper = "#ece4d0", style }) => {
  const f = useCurrentFrame();
  const lines = 14;
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        background: paper,
        padding: 30,
        boxShadow: "10px 18px 30px rgba(0,0,0,.35)",
        clipPath:
          "polygon(0 1%, 6% 0, 13% 1.5%, 22% 0, 31% 1%, 44% 0, 58% 1.2%, 70% 0, 83% 1%, 100% 0, 99% 30%, 100% 62%, 99% 100%, 86% 99%, 71% 100%, 55% 98.8%, 40% 100%, 24% 99%, 10% 100%, 0 99%, 1% 60%, 0 28%)",
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: TYPE,
          fontSize: 24,
          color: "#5a4f3c",
          borderBottom: "2px solid #5a4f3c",
          paddingBottom: 6,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: w * 0.085,
          lineHeight: 1.0,
          letterSpacing: -2,
          color: "#141414",
          margin: "14px 0 18px",
        }}
      >
        {headline.slice(0, Math.max(0, Math.floor((f - start) * 1.4)))}
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        {photo ? <Photo k={photo} w={w * 0.46} h={w * 0.5} /> : null}
        <div style={{ flex: 1 }}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 9,
                margin: "0 0 11px",
                background: "#8a7f6a",
                opacity: 0.45,
                width: `${70 + ((i * 37) % 30)}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Out-of-focus foreground scraps drifting for depth. */
export const Scraps: React.FC<{ seed?: number; dark?: boolean }> = ({
  seed = 1,
  dark,
}) => {
  const f = useCurrentFrame();
  const items = [
    {
      x: -80,
      y: 120,
      w: 300,
      h: 180,
      r: -18,
      c: dark ? "#2a2522" : "#d8cfbb",
      v: 0.5,
    },
    {
      x: 860,
      y: 1500,
      w: 320,
      h: 220,
      r: 22,
      c: dark ? "#3a1715" : "#c9b994",
      v: -0.6,
    },
    { x: 900, y: 80, w: 120, h: 120, r: 10, c: C.red, v: 0.8, star: true },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: it.x + ((seed * 53) % 40),
            top: it.y + f * it.v,
            width: it.w,
            height: it.h,
            rotate: `${it.r + f * 0.05 * it.v}deg`,
            filter: "blur(9px)",
            opacity: 0.85,
          }}
        >
          {it.star ? (
            <Star size={it.w} color={it.c} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: it.c,
                boxShadow: "0 20px 40px rgba(0,0,0,.4)",
              }}
            />
          )}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** Diary page with handwritten-looking lines drawing in. */
export const Diary: React.FC<{ w: number; start?: number }> = ({
  w,
  start = 0,
}) => {
  const f = useCurrentFrame();
  const rows = 9;
  return (
    <svg
      width={w}
      height={w * 1.25}
      viewBox="0 0 400 500"
      style={{ filter: "drop-shadow(10px 16px 14px rgba(0,0,0,.35))" }}
    >
      <rect width={400} height={500} fill="#efe7cf" />
      {Array.from({ length: rows + 3 }).map((_, i) => (
        <line
          key={i}
          x1={20}
          x2={380}
          y1={90 + i * 34}
          y2={90 + i * 34}
          stroke="#9fb4c8"
          strokeWidth={1}
        />
      ))}
      <line x1={60} x2={60} y1={0} y2={500} stroke="#d9827a" strokeWidth={2} />
      <text x={70} y={60} fontFamily={TYPE} fontSize={22} fill="#3b3326">
        7 de noviembre de 1966
      </text>
      {Array.from({ length: rows }).map((_, i) => {
        const p = ease(f, start + i * 6, start + i * 6 + 14, 0, 1, easeInOut);
        const len = 260 + ((i * 47) % 60);
        let d = `M70 ${118 + i * 34}`;
        for (let x = 0; x < len; x += 14) d += ` q7 ${-8 - ((x + i) % 5)} 14 0`;
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#2b2f4a"
            strokeWidth={2}
            strokeDasharray={900}
            strokeDashoffset={900 - 900 * p * (len / 330)}
          />
        );
      })}
    </svg>
  );
};

/* ---------- final CTA pieces ---------- */
export const CommentCard: React.FC<{
  start: number;
  text: string;
  name: string;
  likes: string;
}> = ({ start, text, name, likes }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor((f - start - 8) * 1.1));
  return (
    <div
      style={{
        width: 860,
        background: "#ffffff",
        borderRadius: 34,
        padding: "28px 34px",
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        boxShadow: "0 24px 50px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 42,
          background: "linear-gradient(135deg,#c8302c,#5a1512)",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 800,
            fontSize: 30,
            color: "#777",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 44,
            color: "#111",
            minHeight: 54,
          }}
        >
          {text.slice(0, n)}
          <span style={{ opacity: n < text.length ? 1 : 0, color: C.red }}>
            |
          </span>
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 28,
            color: "#999",
            marginTop: 6,
          }}
        >
          Responder
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <svg width={44} height={40} viewBox="0 0 24 22">
          <path
            d="M12 21 C 5 15, 1 11, 1 6.5 A5 5 0 0 1 12 4 A5 5 0 0 1 23 6.5 C 23 11, 19 15, 12 21 Z"
            fill={f > start + 40 ? C.red : "none"}
            stroke={f > start + 40 ? C.red : "#999"}
            strokeWidth={2}
          />
        </svg>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 24,
            color: "#999",
          }}
        >
          {likes}
        </div>
      </div>
    </div>
  );
};

export const FollowButton: React.FC<{ start: number; pressAt: number }> = ({
  start,
  pressAt,
}) => {
  const f = useCurrentFrame();
  const pressed = f >= pressAt;
  const squash = 1 - 0.06 * Math.max(0, 1 - Math.abs(f - pressAt) / 5);
  return (
    <div
      style={{
        opacity: ease(f, start, start + 10),
        scale: String(squash * (0.85 + 0.15 * ease(f, start, start + 14))),
        background: pressed ? "#1d1d1d" : C.red,
        color: "#fff",
        borderRadius: 999,
        padding: "30px 80px",
        fontFamily: SERIF,
        fontWeight: 800,
        fontSize: 56,
        letterSpacing: 1,
        display: "flex",
        alignItems: "center",
        gap: 20,
        boxShadow: pressed
          ? "0 10px 24px rgba(0,0,0,.3)"
          : "0 18px 40px rgba(200,48,44,.45)",
      }}
    >
      {pressed ? (
        <svg width={54} height={54} viewBox="0 0 24 24">
          <path
            d="M4 12.5 L10 18 L20 6"
            fill="none"
            stroke="#fff"
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width={54} height={54} viewBox="0 0 24 24">
          <path
            d="M12 4 V20 M4 12 H20"
            stroke="#fff"
            strokeWidth={3.2}
            strokeLinecap="round"
          />
        </svg>
      )}
      {pressed ? "SEGUINDO" : "SEGUIR"}
    </div>
  );
};
