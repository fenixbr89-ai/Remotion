import React from "react";
import { Easing, interpolate } from "remotion";
import { HANDLE, K, sans } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** "Seguir" button that gets tapped and turns into "Seguindo". t = scene progress 0..1. */
export const FollowButton: React.FC<{ t: number; tap?: number }> = ({ t, tap = 0.5 }) => {
  const TAP = tap;
  const followed = t >= TAP;
  // press: shrink a bit right before the tap, spring back after
  const press =
    t < TAP
      ? interpolate(t, [TAP - 0.08, TAP], [1, 0.92], { ...clamp, easing: Easing.bezier(0.4, 0, 1, 1) })
      : interpolate(t, [TAP, TAP + 0.12], [0.92, 1], { ...clamp, easing: Easing.bezier(0.34, 1.5, 0.64, 1) });
  const ripple = interpolate(t, [TAP, TAP + 0.25], [0, 1], clamp);
  // finger comes in, taps, leaves
  const fingerIn = interpolate(t, [Math.max(0, TAP - 0.25), TAP - 0.04], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const fingerOut = interpolate(t, [TAP + 0.1, TAP + 0.3], [0, 1], clamp);
  const tapDip = interpolate(t, [TAP - 0.05, TAP, TAP + 0.08], [0, 18, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
      <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 64, letterSpacing: -1.5, color: K.ink }}>{HANDLE}</div>
      <div style={{ position: "relative" }}>
        {/* ripple */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 520,
            height: 520,
            marginLeft: -260,
            marginTop: -260,
            borderRadius: 999,
            border: `6px solid ${K.pink}`,
            opacity: ripple > 0 ? 1 - ripple : 0,
            scale: `${0.3 + ripple * 0.9}`,
          }}
        />
        <div
          style={{
            width: 520,
            height: 140,
            borderRadius: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontFamily: sans,
            fontWeight: 800,
            fontSize: 60,
            letterSpacing: -1,
            scale: `${press}`,
            background: followed ? "#ffffff" : K.pink,
            color: followed ? K.ink : "#ffffff",
            border: followed ? `4px solid ${K.pink}` : "4px solid transparent",
            boxShadow: followed ? "0 16px 40px rgba(200,90,140,0.16)" : "0 22px 50px rgba(242,124,176,0.5)",
          }}
        >
          {followed ? (
            <>
              <svg width={50} height={50} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={11} fill={K.pink} />
                <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Seguindo
            </>
          ) : (
            "Seguir"
          )}
        </div>
        {/* finger */}
        <div
          style={{
            position: "absolute",
            left: 330,
            top: 70 + tapDip,
            fontSize: 120,
            opacity: fingerIn * (1 - fingerOut),
            translate: `${(1 - fingerIn) * 220 + fingerOut * 220}px ${(1 - fingerIn) * 260 + fingerOut * 260}px`,
          }}
        >
          <svg width={130} height={150} viewBox="0 0 26 30">
            <path
              d="M9 2.5c1.2 0 2 .9 2 2V12l.6-.1c1-.2 2 .5 2.2 1.5l.1.4c.9-.4 2-.1 2.4.9.9-.3 1.9.2 2.2 1.1l.4 1.3c.8 2.6.2 5.4-1.5 7.4l-1.2 1.4c-.8 1-2 1.5-3.2 1.5H10c-1.4 0-2.7-.7-3.5-1.8L2.6 20c-.6-.9-.4-2.1.5-2.7.8-.5 1.8-.4 2.4.3L7 19.2V4.5c0-1.1.9-2 2-2z"
              fill="#fde7ef"
              stroke={K.ink}
              strokeWidth={1.3}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
