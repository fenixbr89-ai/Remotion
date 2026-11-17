import React from "react";
import { useCurrentFrame } from "remotion";
import { easeOut, enterStyle, ip } from "../anim";
import { C, COSTS, FONT, NUMBERS, s, SCENES, T } from "../constants";
import { Caption } from "../components/Caption";
import { Card, CardTitle } from "../components/Card";
import { CheckRow } from "../components/CheckRow";
import { Icon3D, LineIcon } from "../components/Icons";
import { SceneShell } from "../components/SceneShell";
import { SlotNumber, slotEnd } from "../components/SlotNumber";

const L = (sec: number) => s(sec) - SCENES.s2.from;
export const S2_TOTAL_END = slotEnd(NUMBERS.custo, L(T.s2Total), 26);

export const Scene2Custo: React.FC = () => {
  const frame = useCurrentFrame();
  const divider = ip(frame, [L(T.s2Divider), L(T.s2Divider) + 14], [0, 1], easeOut);

  return (
    <SceneShell punches={[S2_TOTAL_END]}>
      <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
        <Card start={L(T.s2Card)} top={240} height={1030}>
          <CardTitle icon={<Icon3D src="3d/pot_of_food.png" size={64} />}>CUSTO DA MARMITA</CardTitle>
          <div style={{ marginTop: 24 }}>
            {COSTS.map((c, i) => (
              <CheckRow
                key={c.label}
                start={L(T.s2RowsStart + i * T.s2RowGap)}
                icon={
                  "img" in c ? (
                    <Icon3D src={c.img} size={52} />
                  ) : (
                    <LineIcon name={c.icon} size={42} />
                  )
                }
                label={c.label}
                value={c.value}
              />
            ))}
          </div>
          <div
            style={{
              height: 3,
              borderRadius: 2,
              background: "#E4E9F1",
              marginTop: 18,
              width: `${divider * 100}%`,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 26,
              ...enterStyle(frame, L(T.s2Total) - 6, { dy: 20 }),
            }}
          >
            <span style={{ fontSize: 46, fontWeight: 700, color: C.navy }}>Custo total</span>
            <SlotNumber value={NUMBERS.custo} start={L(T.s2Total)} fontSize={92} color={C.blue} duration={26} />
          </div>
        </Card>
        <Caption
          start={L(T.s2Caption)}
          line1="Quanto custa produzir"
          line2={[{ text: "cada" }, { text: "uma?", accent: true }]}
        />
      </div>
    </SceneShell>
  );
};
