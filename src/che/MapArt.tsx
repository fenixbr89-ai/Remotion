import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { geoMercator, geoPath, geoNaturalEarth1, GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-50m.json";
import { C, SHOW_SCENE_TEXT, TYPE, ease, easeInOut, easeOut } from "./lib";

import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";

type CountryProps = { name: string };
const topo = world as unknown as Topology<{
  countries: GeometryCollection<CountryProps>;
}>;
const countries: Feature<Geometry, CountryProps>[] = (
  feature(topo, topo.objects.countries) as FeatureCollection<
    Geometry,
    CountryProps
  >
).features;

export type LonLat = [number, number];

export type MapSpec = {
  w: number;
  h: number;
  /** bounding box [[lonW, latS],[lonE, latN]] to fit */
  fit: [LonLat, LonLat];
  world?: boolean;
  highlight?: { name: string; color: string; start: number }[];
  routes?: {
    pts: LonLat[];
    start: number;
    dur: number;
    color?: string;
    dash?: boolean;
  }[];
  pins?: { at: LonLat; label: string; start: number; side?: "l" | "r" }[];
  ink?: string;
  fill?: string;
};

export const MapArt: React.FC<MapSpec> = ({
  w,
  h,
  fit,
  world: isWorld,
  highlight = [],
  routes = [],
  pins = [],
  ink = "#2a2a2a",
  fill = "rgba(40,35,25,0.07)",
}) => {
  const f = useCurrentFrame();
  const { proj, path } = useMemo(() => {
    const p: GeoProjection = isWorld ? geoNaturalEarth1() : geoMercator();
    const box = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPoint",
        coordinates: [
          fit[0],
          fit[1],
          [fit[0][0], fit[1][1]],
          [fit[1][0], fit[0][1]],
        ],
      },
    };
    p.fitExtent(
      [
        [40, 40],
        [w - 40, h - 40],
      ],
      box as unknown as Feature,
    );
    return { proj: p, path: geoPath(p) };
  }, [w, h, fit, isWorld]);

  const routePaths = routes.map((r) => {
    const pts = r.pts.map((pt) => proj(pt) as [number, number]);
    // smooth curve through points
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2 + (y1 - y0) * 0.18;
      const my = (y0 + y1) / 2 - (x1 - x0) * 0.18;
      d += ` Q${mx} ${my} ${x1} ${y1}`;
      len += Math.hypot(x1 - x0, y1 - y0) * 1.08;
    }
    return { d, len, r };
  });

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible" }}
    >
      {countries.map((c, i) => {
        const hl = highlight.find((x) => x.name === c.properties.name);
        const p = hl ? ease(f, hl.start, hl.start + 18) : 0;
        return (
          <path
            key={i}
            d={path(c) ?? ""}
            fill={hl ? hl.color : fill}
            fillOpacity={hl ? 0.12 + 0.75 * p : 1}
            stroke={ink}
            strokeOpacity={0.55}
            strokeWidth={1.1}
          />
        );
      })}
      {routePaths.map(({ d, len, r }, i) => {
        const p = ease(f, r.start, r.start + r.dur, 0, 1, easeInOut);
        return (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke={r.color ?? C.red}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={`${len}`}
              strokeDashoffset={len * (1 - p)}
            />
          </g>
        );
      })}
      {pins.map((pin, i) => {
        const [x, y] = proj(pin.at) as [number, number];
        const p = ease(f, pin.start, pin.start + 14, 0, 1, easeOut);
        const ring = ((f - pin.start) % 40) / 40;
        const side = pin.side ?? "r";
        return (
          <g key={i} opacity={p}>
            {f > pin.start ? (
              <circle
                cx={x}
                cy={y}
                r={10 + ring * 40}
                fill="none"
                stroke={C.red}
                strokeWidth={3}
                opacity={1 - ring}
              />
            ) : null}
            <circle
              cx={x}
              cy={y}
              r={11 * p}
              fill={C.red}
              stroke="#fff"
              strokeWidth={3}
            />
            {SHOW_SCENE_TEXT ? (
              <text
                x={x + (side === "r" ? 26 : -26)}
                y={y + 12}
                textAnchor={side === "r" ? "start" : "end"}
                fontFamily={TYPE}
                fontSize={38}
                fill={C.ink}
                style={{
                  paintOrder: "stroke",
                  stroke: "rgba(233,230,223,0.9)",
                  strokeWidth: 8,
                }}
              >
                {pin.label.slice(
                  0,
                  Math.max(0, Math.floor((f - pin.start - 6) * 0.9)),
                )}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

/** helper so scenes can position a dot that travels along a route */
export const useProjector = (w: number, h: number, fit: [LonLat, LonLat]) =>
  useMemo(() => {
    const p = geoMercator();
    const box = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPoint",
        coordinates: [
          fit[0],
          fit[1],
          [fit[0][0], fit[1][1]],
          [fit[1][0], fit[0][1]],
        ],
      },
    };
    p.fitExtent(
      [
        [40, 40],
        [w - 40, h - 40],
      ],
      box as unknown as Feature,
    );
    return p;
  }, [w, h, fit]);
