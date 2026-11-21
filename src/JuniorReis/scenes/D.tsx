import type { FC } from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "../cursor";
import { WhatsApp } from "../icons";
import { DARK_GLASS, EI, EIO, INK, LIGHT_GLASS, LIME, M, MUTED_DARK, OLIVE, R, SANS, SHADOW_DARK, SHADOW_LIGHT, lerp, lerpRect, tw } from "../lib";
import { Box, Kinetic, NotifContent, Ripple } from "../ui";

type P = { d: number };
const W = "#fff";
const AV = { cx: 267, cy: 597 };

// ================= 13 — Instagram: Seguir + Mensagem (único cursor do vídeo) =================
export const S13: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = tw(f, 0, M, 0, 1, EIO);
  const card = lerpRect(R.s12Card2, R.s13Card, p);
  const cOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const av = spring({ frame: f - 10, fps, config: { damping: 13, stiffness: 140 } });
  const ring = tw(f, 14, 36, 0, 1, EIO);
  const btn = (delay: number) => spring({ frame: f - delay, fps, config: { damping: 13, stiffness: 140 } });
  const followed = tw(f, T.follow + 2, T.follow + 8);
  const fOut = tw(f, d, d + 12, 0, 1, EI);
  const msgGlow = tw(f, T.message, T.message + 4) * (1 - tw(f, T.message + 10, T.message + 30));
  const txt = (t: string, top: number, size: number, color: string, weight: number, delay: number) => {
    const o = tw(f, delay, delay + 14) * cOut;
    return (
      <div style={{ position: "absolute", left: 317, top, fontFamily: SANS, fontSize: size, fontWeight: weight, color, opacity: o, letterSpacing: weight >= 700 ? "-0.03em" : "0em", translate: `${(1 - o) * 24}px 0px`, lineHeight: 1.2 }}>
        {t}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      {f < d ? (
        <Box rect={card} shadow={SHADOW_DARK} shine={tw(f, 20, 46)} layers={[{ style: LIGHT_GLASS, o: 1 - tw(f, 2, 16) }, { style: DARK_GLASS, o: tw(f, 2, 16) }]}>
          {txt("Júnior Reis", 82, 54, "#fff", 800, 14)}
          {txt("Personal Trainer", 152, 38, "#9C9C9C", 400, 18)}
          {txt("@juniorreispersonal", 208, 35, LIME, 600, 22)}
          {["Musculação, corrida e crossfit", "Consultoria online e presencial"].map((t, i) => {
            const o = tw(f, 24 + i * 5, 40 + i * 5) * cOut;
            return <div key={t} style={{ position: "absolute", left: 63, top: 324 + i * 62, fontFamily: SANS, fontSize: 39, color: "#E6E6E6", opacity: o, translate: `0px ${(1 - o) * 20}px` }}>{t}</div>;
          })}
        </Box>
      ) : null}
      {f < d ? (
        <>
          <div style={{ position: "absolute", left: AV.cx - 96, top: AV.cy - 96, width: 192, height: 192, borderRadius: 96, overflow: "hidden", scale: String(Math.max(0, av)), opacity: cOut }}>
            <Img src={staticFile("avatar.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <svg width={240} height={240} style={{ position: "absolute", left: AV.cx - 120, top: AV.cy - 120, opacity: cOut, rotate: "-90deg" }}>
            <circle cx={120} cy={120} r={102} fill="none" stroke={LIME} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 102 * ring} 1000`} />
          </svg>
        </>
      ) : null}
      {/* Seguir -> Seguindo */}
      <Box rect={R.s13Follow} layers={[{ style: { background: LIME }, o: 1 - followed }, { style: { background: "rgba(255,255,255,0.14)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.18)" }, o: followed }]}
        style={{ scale: String(Math.max(0, btn(16)) * (1 - fOut * 0.2)), opacity: 1 - fOut }}>
        <Ripple x={400 - R.s13Follow.x} y={980 - R.s13Follow.y} p={tw(f, T.follow, T.follow + 22)} color="#fff" />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#0b0b0b", opacity: (1 - followed) * cOut }}>Seguir</div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#fff", opacity: followed * cOut }}>Seguindo ✓</div>
      </Box>
      {f < d ? (
        <Box rect={R.s13Msg} layers={[{ style: { background: "#2c2c2c", boxShadow: `inset 0 0 0 2px rgba(212,255,79,${0.15 + 0.7 * msgGlow})` }, o: 1 }]}
          style={{ scale: String(Math.max(0, btn(20))), boxShadow: `0 0 ${36 * msgGlow}px rgba(212,255,79,0.5)` }}>
          <Ripple x={790 - R.s13Msg.x} y={980 - R.s13Msg.y} p={tw(f, T.message, T.message + 22)} color={LIME} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#fff", opacity: cOut }}>Mensagem</div>
        </Box>
      ) : null}
      <Kinetic start={14} end={d - 10} lines={[
        { y: 1532, size: 84, color: W, segs: [{ t: "Fale comigo pelo" }, { t: "direct", serif: true }] },
        { y: 1625, size: 84, color: W, segs: [{ t: "ou clique no link da bio." }] },
      ]} />
    </AbsoluteFill>
  );
};

// ================= 14 — WhatsApp =================
export const S14: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, M, 0, 1, EIO);
  const notif = lerpRect(R.s13Card, R.s14Notif, p);
  const btn = lerpRect(R.s13Msg, R.s14Btn, p);
  const out = tw(f, d, d + 14, 0, 1, EI);
  const pulse = tw(f, 40, 72);
  const pulse2 = tw(f, 56, 88);
  const bio = tw(f, 30, 46) * (1 - out);
  return (
    <AbsoluteFill>
      <Box rect={notif} layers={[{ style: DARK_GLASS, o: 1 }]} shadow={SHADOW_DARK} shine={tw(f, 22, 48)} style={{ opacity: 1 - out, scale: String(1 - out * 0.08) }}>
        <NotifContent icon={<WhatsApp />} title="WhatsApp" sub="(62) 98118-8910" o={tw(f, 16, 30) * (1 - out)} iconO={tw(f, 14, 26) * (1 - out)} slide={tw(f, 16, 32)} />
      </Box>
      {[pulse, pulse2].map((q, i) =>
        q > 0 && q < 1 && f < d ? (
          <div key={i} style={{ position: "absolute", left: R.s14Btn.x, top: R.s14Btn.y, width: R.s14Btn.w, height: R.s14Btn.h, borderRadius: 54, boxShadow: `0 0 0 ${q * 30}px rgba(212,255,79,${0.32 * (1 - q)})` }} />
        ) : null,
      )}
      {f < d ? (
        <Box rect={btn} layers={[{ style: { background: "#2c2c2c" }, o: 1 - tw(f, 2, 14) }, { style: { background: LIME }, o: tw(f, 2, 14) }]} shine={tw(f, 56, 80)}
          style={{ boxShadow: `0 0 ${(40 + 16 * Math.sin(f / 8)) * tw(f, 20, 40)}px rgba(212,255,79,0.3)` }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#fff", opacity: 1 - tw(f, 0, 8) }}>Mensagem</div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 45, letterSpacing: "-0.01em", color: "#0b0b0b", whiteSpace: "nowrap", opacity: tw(f, 12, 24), translate: `0px ${(1 - tw(f, 12, 26)) * 30}px` }}>
            Chamar no WhatsApp
          </div>
        </Box>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 986, textAlign: "center", fontFamily: SANS, fontSize: 39, color: "#A9A9A9", opacity: bio, translate: `0px ${(1 - bio) * 20}px` }}>ou clique no link da bio</div>
      <Kinetic start={22} end={d - 10} lines={[
        { y: 1532, size: 40, weight: 500, color: MUTED_DARK, segs: [{ t: "Entre em contato e" }] },
        { y: 1625, size: 84, color: W, segs: [{ t: "comece sua" }, { t: "evolução!", serif: true }] },
      ]} />
    </AbsoluteFill>
  );
};

// ================= 15 — Logo se montando =================
const piece = (top: number, bottom: number) => `inset(${top}% 0 ${bottom}% 0)`;
export const S15: FC<P> = () => {
  const f = useCurrentFrame();
  const p = tw(f, 0, 18, 0, 1, EIO);
  const dot = lerpRect(R.s14Btn, R.s15Dot, p);
  const icon = tw(f, 12, 40, 0, 1, EIO);
  const name = tw(f, 30, 54, 0, 1, EIO);
  const sub = tw(f, 46, 62);
  const L = R.logo;
  const layer = (clip: string, extra: React.CSSProperties) => (
    <div style={{ position: "absolute", inset: 0, clipPath: clip, ...extra }}>
      <Img src={staticFile("logo.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
  return (
    <AbsoluteFill>
      <Box rect={dot} layers={[{ style: { background: LIME }, o: 1 - tw(f, 6, 16) }, { style: { background: OLIVE }, o: tw(f, 6, 16) }]} shadow={SHADOW_LIGHT}
        style={{ opacity: 1 - tw(f, 14, 24), scale: String(1 + tw(f, 14, 24) * 0.6) }} />
      <div style={{ position: "absolute", left: L.x, top: L.y, width: L.w, height: L.h }}>
        <div style={{ position: "absolute", inset: 0, clipPath: `circle(${icon * 360}px at 445px 140px)` }}>
          {layer(piece(0, 39), { scale: String(lerp(1.15, 1, icon)), transformOrigin: "445px 140px" })}
        </div>
        {layer(`inset(62% ${(1 - name) * 100}% 12% 0)`, { translate: `${(1 - name) * -20}px 0px` })}
        {layer(piece(86, 0), { opacity: sub, translate: `0px ${(1 - sub) * 16}px` })}
      </div>
      <Kinetic start={14} end={10000} lines={[
        { y: 1532, size: 84, color: INK, segs: [{ t: "Júnior Reis" }] },
        { y: 1625, size: 84, color: INK, serifColor: OLIVE, segs: [{ t: "Treinamento com" }, { t: "estratégia.", serif: true }] },
      ]} />
    </AbsoluteFill>
  );
};
