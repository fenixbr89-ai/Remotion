import React from "react";
import { useCurrentFrame } from "remotion";
import { easeOut, enterStyle, ip } from "../anim";
import { C, FONT, MINUS, NUMBERS, s, SCENES, T } from "../constants";
import { Caption } from "../components/Caption";
import { Card, CardTitle } from "../components/Card";
import { CheckRow } from "../components/CheckRow";
import { Icon3D, LineIcon } from "../components/Icons";
import { ProgressBar } from "../components/ProgressBar";
import { SceneShell } from "../components/SceneShell";
import { SlotNumber, slotEnd } from "../components/SlotNumber";

const L = (sec: number) => s(sec) - SCENES.s5.from;
export const S5_TOTAL_END = slotEnd(NUMBERS.sobra, L(T.s5Total), 26);

const ROWS = [
  { label: "Vendeu no app", value: NUMBERS.ifood, icon: <Icon3D src="3d/motor_scooter.png" size={52} /> },
  { label: "Custo do produto", value: `${MINUS} ${NUMBERS.custo}`, icon: <Icon3D src="3d/pot_of_food.png" size={52} /> },
  {
    label: "Taxa da plataforma",
    sub: "taxa considerada: 25%",
    value: `${MINUS} ${NUMBERS.taxa}`,
    icon: <LineIcon name="tag" size={40} />,
  },
];

export const Scene5Sobra: React.FC = () => {
  const frame = useCurrentFrame();
  const totalAt = L(T.s5Total);
  const halo = ip(frame, [S5_TOTAL_END, S5_TOTAL_END + 14], [0, 1], easeOut);

  return (
    <SceneShell punches={[S5_TOTAL_END]}>
      <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
        <Card start={L(T.s5Card)} top={250} height={1020}>
          <CardTitle icon={<Icon3D src="3d/shopping_bags.png" size={60} />}>CADA MARMITA NO IFOOD</CardTitle>
          <div style={{ marginTop: 30 }}>
            {ROWS.map((r, i) => (
              <CheckRow
                key={r.label}
                start={L(T.s5Rows[i])}
                icon={r.icon}
                label={r.label}
                sub={r.sub}
                value={r.value}
                height={r.sub ? 120 : 100}
                showCheck={false}
              />
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <ProgressBar start={L(T.s5BarStart)} end={L(T.s5BarEnd)} />
          </div>
          <div
            style={{
              marginTop: 44,
              padding: "26px 36px",
              gap: 20,
              borderRadius: 34,
              background: C.soft,
              border: `3px solid rgba(56,189,248,${0.15 + halo * 0.5})`,
              boxShadow: `0 0 ${halo * 40}px rgba(56,189,248,${halo * 0.35})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              ...enterStyle(frame, totalAt - 6, { dy: 24, scaleFrom: 0.92 }),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Icon3D src="3d/money_bag.png" size={76} />
              <span style={{ fontSize: 52, fontWeight: 800, color: C.navy }}>Sobrou</span>
            </div>
            <SlotNumber value={NUMBERS.sobra} start={totalAt} fontSize={84} color={C.blue} duration={26} />
          </div>
        </Card>
        <Caption
          start={L(T.s5Caption)}
          line1="Quanto sobra"
          line2={[{ text: "de cada" }, { text: "venda.", accent: true }]}
        />
      </div>
    </SceneShell>
  );
};
