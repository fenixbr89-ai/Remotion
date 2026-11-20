import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  continueRender,
  delayRender,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const serif = loadSerif("italic").fontFamily;
const inter = loadInter("normal", { weights: ["500", "600", "700"] }).fontFamily;

const heavyHandle = delayRender("sf-heavy");
const sf = new FontFace("SFHeavy", `url(${staticFile("trindade/sf-heavy.otf")})`);
sf.load().then((f) => {
  document.fonts.add(f);
  continueRender(heavyHandle);
});

const G = "#2cff05";
const INK = "#0b0b0b";

/* ---------- motion helpers ---------- */
const useSp = (delay = 0, damping = 18) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass: 0.8 } });
};

const Pop: React.FC<{ delay?: number; from?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  from = 80,
  children,
  style,
}) => {
  const s = useSp(delay);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * from}px) scale(${0.9 + 0.1 * s})`,
        filter: `blur(${(1 - s) * 12}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- background ---------- */
const GreenBg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: G, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -400 + Math.sin(f / 50) * 60,
          top: -300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.35), rgba(255,255,255,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          right: -500,
          bottom: -400 + Math.cos(f / 60) * 60,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,90,0,0.35), rgba(0,90,0,0) 65%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- kinetic caption (words slide in from the side) ---------- */
type Tok = string | { a: string };
const Word: React.FC<{ t: Tok; delay: number }> = ({ t, delay }) => {
  const s = useSp(delay, 16);
  const accent = typeof t !== "string";
  return (
    <span
      style={{
        display: "inline-block",
        opacity: s,
        transform: `translateX(${(1 - s) * 90}px)`,
        filter: `blur(${(1 - s) * 10}px)`,
        marginRight: 18,

      }}
    >
      {accent ? t.a : t}
    </span>
  );
};

const Caption: React.FC<{ kicker?: string; main: Tok[]; delay?: number; top?: number; dark?: boolean }> = ({
  kicker,
  main,
  delay = 0,
  top = 1240,
}) => {
  const ks = useSp(delay);
  const start = delay + (kicker ? 8 : 0);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: "center" }}>
      {kicker ? (
        <div
          style={{
            fontFamily: inter,
            fontWeight: 600,
            fontSize: 40,
            color: "rgba(255,255,255,0.92)",
            marginBottom: 22,
            opacity: ks,
            transform: `translateX(${(1 - ks) * 60}px)`,
            textShadow: "0 2px 18px rgba(0,60,0,0.35)",
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: "SFHeavy",
          fontSize: 84,
          lineHeight: 1.12,
          color: "#fff",
          letterSpacing: -1.5,
          textShadow: "0 4px 30px rgba(0,70,0,0.35)",
        }}
      >
        {main.map((t, i) => (
          <Word key={i} t={t} delay={start + i * 3} />
        ))}
      </div>
    </div>
  );
};

/* ---------- UI pieces ---------- */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.96)",
      borderRadius: 36,
      boxShadow: "0 30px 80px rgba(0,60,0,0.25), 0 4px 14px rgba(0,0,0,0.08)",
      fontFamily: inter,
      color: INK,
      ...style,
    }}
  >
    {children}
  </div>
);

const ICONS: Record<string, string> = {
  smile: "M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v4H6.5A2.5 2.5 0 0 1 4 19.5",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
  cam: "M23 7l-7 5 7 5V7zM3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  cal: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zM16 2v4M8 2v4M3 10h18",
};
const Icon: React.FC<{ n: string; size?: number; color?: string }> = ({ n, size = 44, color = G }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={ICONS[n]} />
  </svg>
);

const Notif: React.FC<{ icon: string; title: string; sub: string; delay: number }> = ({ icon, title, sub, delay }) => {
  const s = useSp(delay);
  return (
    <div style={{ opacity: s, transform: `translateX(${(1 - s) * 140}px)`, filter: `blur(${(1 - s) * 8}px)` }}>
      <Card style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 30px", width: 760, marginBottom: 24 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 22,
            background: INK,
            color: G,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon n={icon} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8a8a8a", fontWeight: 600 }}>
            <span>TRINDADE UAI</span>
            <span>agora</span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, marginTop: 4 }}>{title}</div>
          <div style={{ fontSize: 28, color: "#555", marginTop: 2 }}>{sub}</div>
        </div>
      </Card>
    </div>
  );
};

const Center: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 260 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
    {children}
  </div>
);

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      border: "8px solid #fff",
      boxShadow: "0 30px 80px rgba(0,60,0,0.35)",
    }}
  >
    <Img src={staticFile("trindade/logo.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.5)" }} />
  </div>
);

/* ---------- scenes ---------- */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const year = Math.round(interpolate(f, [5, 45], [2023, 2026], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const p = interpolate(f, [5, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <GreenBg />
      <Center top={420}>
        <Pop>
          <div style={{ fontFamily: "SFHeavy", fontSize: 300, color: "#fff", letterSpacing: -10, textShadow: "0 10px 60px rgba(0,70,0,0.35)" }}>
            {year}
          </div>
        </Pop>
        <Pop delay={4}>
          <div style={{ width: 760, height: 10, borderRadius: 10, background: "rgba(255,255,255,0.35)", marginTop: 20, position: "relative" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 10, background: "#fff" }} />
            <div
              style={{
                position: "absolute",
                left: `calc(${p * 100}% - 22px)`,
                top: -17,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: INK,
                border: "6px solid #fff",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: 760, marginTop: 30, fontFamily: inter, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,0.9)" }}>
            {["2023", "2024", "2025", "2026"].map((y) => (
              <span key={y}>{y}</span>
            ))}
          </div>
        </Pop>
      </Center>
      <Caption kicker="Faz três anos" main={["que", "a", "gente", "criou", "o", { a: "Trindade Uai." }]} delay={10} />
    </AbsoluteFill>
  );
};

const S2: React.FC = () => (
  <AbsoluteFill>
    <GreenBg />
    <Center top={300}>
      <Notif icon="smile" title="Humor" sub="O jeito trindadense de rir" delay={2} />
      <Notif icon="book" title="Histórias antigas" sub="Memórias da cidade" delay={10} />
      <Notif icon="pin" title="Lugares que todos conhecem" sub="Trindade (GO)" delay={18} />
    </Center>
    <Caption
      main={["Começou", "com", "humor,", "histórias", "antigas", "e", "lugares", "que", { a: "todo trindadense" }, "conhece."]}
      delay={6}
      top={1180}
    />
  </AbsoluteFill>
);

const PostCard: React.FC<{ src: string; rot: number; x: number; delay: number }> = ({ src, rot, x, delay }) => {
  const s = useSp(delay, 15);
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 230 + x * s,
        top: 260,
        transform: `rotate(${rot * s}deg) translateY(${(1 - s) * 300}px)`,
        opacity: s,
      }}
    >
      <Card style={{ padding: 12, borderRadius: 34 }}>
        <Img src={staticFile(src)} style={{ width: 436, height: 492, objectFit: "cover", borderRadius: 24, display: "block" }} />
      </Card>
    </div>
  );
};

const S3: React.FC = () => (
  <AbsoluteFill>
    <GreenBg />
    <PostCard src="trindade/p3.jpg" rot={-12} x={-210} delay={0} />
    <PostCard src="trindade/p2.jpg" rot={12} x={210} delay={6} />
    <PostCard src="trindade/p1.jpg" rot={0} x={0} delay={12} />
    <Caption main={["Foi", "postagem", "por", "postagem", "que", "a", "gente", "construiu", { a: "esse espaço." }]} delay={8} />
  </AbsoluteFill>
);

const S4: React.FC = () => {
  const sw = [G, INK, "#ffffff"];
  return (
    <AbsoluteFill>
      <GreenBg />
      <Center top={330}>
        <Pop>
          <Card style={{ width: 760, padding: 44 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#8a8a8a", letterSpacing: 2 }}>IDENTIDADE VISUAL</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 30, marginTop: 24 }}>
              <div style={{ fontFamily: "SFHeavy", fontSize: 190, lineHeight: 0.9 }}>Aa</div>
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 150, lineHeight: 0.9 }}>Aa</div>
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 40 }}>
              {sw.map((c, i) => (
                <Pop key={c} delay={8 + i * 5} from={30}>
                  <div style={{ width: 205, height: 120, borderRadius: 22, background: c, border: "2px solid #e6e6e6" }} />
                  <div style={{ fontSize: 24, fontWeight: 600, marginTop: 10, color: "#666" }}>{c.toUpperCase()}</div>
                </Pop>
              ))}
            </div>
          </Card>
        </Pop>
      </Center>
      <Caption main={["Tudo", "com", { a: "identidade" }, "própria."]} delay={6} />
    </AbsoluteFill>
  );
};

const Badge: React.FC<{ label: string; value: string; delay: number; style: React.CSSProperties }> = ({ label, value, delay, style }) => {
  const s = useSp(delay, 12);
  return (
    <div style={{ position: "absolute", transform: `scale(${s})`, ...style }}>
      <div style={{ background: INK, color: "#fff", borderRadius: 26, padding: "16px 28px", fontFamily: inter, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: G, letterSpacing: 2 }}>{label}</div>
        <div style={{ fontSize: 50, fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
};

const S5: React.FC = () => {
  const s = useSp(0, 16);
  return (
    <AbsoluteFill>
      <GreenBg />
      <div style={{ position: "absolute", left: 540 - 230, top: 150, transform: `translateY(${(1 - s) * 600}px) rotate(${(1 - s) * 8}deg)` }}>
        <div style={{ width: 460, height: 960, borderRadius: 70, background: INK, padding: 16, boxShadow: "0 50px 120px rgba(0,60,0,0.45)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 56, overflow: "hidden", background: "#fff", position: "relative" }}>
            <Img src={staticFile("trindade/profile.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
        </div>
      </div>
      <Badge label="SEGUIDORES" value="252 mil" delay={14} style={{ left: 120, top: 300 }} />
      <Badge label="POSTS" value="4.440" delay={20} style={{ right: 120, top: 640 }} />
      <Caption main={["O", "jeito,", "as", "cores", "e", "os", "vídeos", { a: "nasceram aqui." }]} delay={10} top={1250} />
    </AbsoluteFill>
  );
};

const S6: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(4);
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      {new Array(22).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: i * 92 - 40,
            left: -400 + ((i % 2 ? 1 : -1) * f * 3) % 600,
            whiteSpace: "nowrap",
            fontFamily: "SFHeavy",
            fontSize: 84,
            color: i % 5 === 2 ? "rgba(44,255,5,0.22)" : "rgba(255,255,255,0.06)",
          }}
        >
          {"TRINDADE UAI  ".repeat(8)}
        </div>
      ))}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(11,11,11,0.2), rgba(11,11,11,0.95) 70%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: s,
            transform: `scale(${0.85 + 0.15 * s})`,
            filter: `blur(${(1 - s) * 14}px)`,
            background: "rgba(25,25,25,0.85)",
            border: "2px solid rgba(255,255,255,0.08)",
            borderRadius: 44,
            padding: "60px 70px",
            textAlign: "center",
            boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 42, color: "rgba(255,255,255,0.75)" }}>Hoje, tem gente</div>
          <div style={{ fontFamily: "SFHeavy", fontSize: 140, color: "#fff", margin: "10px 0", letterSpacing: -3 }}>
            copiando
          </div>
          <div style={{ fontFamily: "SFHeavy", fontSize: 64, color: "#fff" }}>o Trindade Uai.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const S7: React.FC = () => {
  const users = ["@pagina.1", "@pagina.2", "@pagina.3", "@pagina.4", "@pagina.5", "@pagina.6"];
  return (
    <AbsoluteFill>
      <GreenBg />
      <Center top={300}>
        <div style={{ display: "flex", flexWrap: "wrap", width: 860, justifyContent: "center", gap: 26 }}>
          {users.map((u, i) => (
            <Pop key={u} delay={i * 4} from={50}>
              <Card style={{ width: 250, padding: "30px 0", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 30 }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#e9e9e9" }} />
                <div style={{ fontSize: 26, fontWeight: 700, marginTop: 16 }}>{u}</div>
              </Card>
            </Pop>
          ))}
        </div>
      </Center>
      <Caption
        kicker="Na internet, todo mundo pode ter seu espaço."
        main={[{ a: "Ninguém" }, "é", "dono", "da", "rede."]}
        delay={10}
        top={1220}
      />
    </AbsoluteFill>
  );
};

const S8: React.FC = () => {
  const check = useSp(26, 10);
  const dim = interpolate(useCurrentFrame(), [20, 35], [1, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <GreenBg />
      <Center top={330}>
        <div style={{ display: "flex", gap: 40 }}>
          <Pop delay={0}>
            <Card style={{ width: 360, height: 470, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: dim, filter: "grayscale(1)" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#999", letterSpacing: 3 }}>CÓPIA</div>
              <div style={{ width: 150, height: 150, borderRadius: "50%", background: "#bdbdbd", margin: "34px 0" }} />
              <div style={{ width: 200, height: 14, borderRadius: 8, background: "#d4d4d4" }} />
              <div style={{ width: 140, height: 14, borderRadius: 8, background: "#e2e2e2", marginTop: 14 }} />
            </Card>
          </Pop>
          <Pop delay={6}>
            <Card style={{ width: 360, height: 470, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `6px solid ${INK}`, position: "relative" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: INK, letterSpacing: 3 }}>ORIGINAL</div>
              <div style={{ margin: "30px 0" }}>
                <Logo size={160} />
              </div>
              <div style={{ fontFamily: "SFHeavy", fontSize: 40 }}>Trindade Uai</div>
              <div
                style={{
                  position: "absolute",
                  top: -34,
                  right: -34,
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: INK,
                  color: G,
                  fontSize: 54,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${check})`,
                }}
              >
                ✓
              </div>
            </Card>
          </Pop>
        </div>
      </Center>
      <Caption main={["Mas", "é", "importante", "saber", "diferenciar", "o", "que", "é", "cópia", "e", { a: "o que é original." }]} delay={8} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => (
  <AbsoluteFill>
    <GreenBg />
    <Center top={300}>
      <Notif icon="chat" title="Histórias" sub="Enviadas por vocês" delay={2} />
      <Notif icon="cam" title="Registros" sub="Direto do celular de quem viu" delay={10} />
      <Notif icon="cal" title="Dia a dia" sub="Tudo que acontece na cidade" delay={18} />
    </Center>
    <Caption
      kicker="E esse espaço também é feito por vocês."
      main={["Pelas", "histórias,", "pelos", "registros", "e", "por", { a: "tudo que acontece" }, "na", "cidade."]}
      delay={8}
      top={1160}
    />
  </AbsoluteFill>
);

const S10: React.FC = () => {
  const typed = "Vou postar agora, obrigado pelo vídeo!";
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [30, 60], [0, typed.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const bubble = useSp(62, 14);
  return (
    <AbsoluteFill>
      <GreenBg />
      <Center top={200}>
        <Pop>
          <Card style={{ width: 800, padding: 34 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Logo size={80} />
              <div>
                <div style={{ fontSize: 34, fontWeight: 700 }}>trindadeuai.br</div>
                <div style={{ fontSize: 24, color: "#888" }}>Direct · online</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 30 }}>
              <div
                style={{
                  width: 420,
                  height: 300,
                  borderRadius: 30,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Img src={staticFile("trindade/raw.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>▶</div>
                </div>
              </div>
            </div>
            <div style={{ transform: `scale(${bubble})`, transformOrigin: "right", marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <div style={{ display: "inline-block", background: INK, color: "#fff", fontSize: 32, fontWeight: 600, padding: "20px 28px", borderRadius: 30 }}>
                {typed}
              </div>
            </div>
            <div style={{ marginTop: 26, background: "#f1f1f1", borderRadius: 40, padding: "22px 30px", fontSize: 30, color: n ? INK : "#999", display: "flex", justifyContent: "space-between" }}>
              <span>{bubble > 0.5 ? "Mensagem..." : typed.slice(0, n) || "Mensagem..."}</span>
              <span style={{ display: "inline-block", margin: -8 }}><Logo size={64} /></span>
            </div>
          </Card>
        </Pop>
      </Center>
      <Caption
        kicker="Aconteceu alguma coisa no seu bairro? Gravou?"
        main={["Manda", { a: "primeiro" }, "pro", "Trindade", "Uai."]}
        delay={10}
        top={1260}
      />
    </AbsoluteFill>
  );
};

const S11: React.FC = () => {
  const f = useCurrentFrame();
  const press = interpolate(f, [62, 66, 70], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const following = f >= 66;
  return (
    <AbsoluteFill>
      <GreenBg />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 56 }}>
        <Pop>
          <Logo size={360} />
        </Pop>
        <Pop delay={6}>
          <div style={{ fontFamily: "SFHeavy", fontSize: 60, color: "#fff", textShadow: "0 4px 30px rgba(0,70,0,0.35)" }}>@trindadeuai.br</div>
        </Pop>
        <div style={{ position: "relative", width: 1080, height: 230 }}>
          <Caption main={["O", "que", "acontece", "em", { a: "Trindade (GO)" }, "tá", "aqui."]} delay={12} top={0} />
        </div>
        <Pop delay={30}>
          <div
            style={{
              transform: `scale(${press})`,
              width: 520,
              height: 120,
              borderRadius: 60,
              background: following ? "#fff" : INK,
              color: following ? INK : "#fff",
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 60px rgba(0,60,0,0.3)",
            }}
          >
            {following ? "Seguindo ✓" : "Seguir"}
          </div>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- timeline ---------- */
export const SCENES: { C: React.FC; d: number }[] = [
  { C: S1, d: 120 },
  { C: S2, d: 180 },
  { C: S3, d: 120 },
  { C: S4, d: 90 },
  { C: S5, d: 100 },
  { C: S6, d: 150 },
  { C: S7, d: 90 },
  { C: S8, d: 120 },
  { C: S9, d: 240 },
  { C: S10, d: 150 },
  { C: S11, d: 120 },
];
export const T = 14;
export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

const pres = (i: number) => {
  // vary transitions for a kinetic feel
  if (i === 4 || i === 5) return fade();
  const dirs = ["from-right", "from-bottom", "from-right", "from-left"] as const;
  return slide({ direction: dirs[i % dirs.length] });
};

export const TrindadeUai: React.FC = () => (
  <AbsoluteFill style={{ background: G }}>
    <TransitionSeries>
      {SCENES.map(({ C, d }, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={d}>
            <C />
          </TransitionSeries.Sequence>
          {i < SCENES.length - 1 ? (
            <TransitionSeries.Transition presentation={pres(i)} timing={linearTiming({ durationInFrames: T })} />
          ) : null}
        </React.Fragment>
      ))}
    </TransitionSeries>
  </AbsoluteFill>
);
