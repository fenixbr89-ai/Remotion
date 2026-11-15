import { geoEquirectangular, geoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import mundo from "world-atlas/countries-110m.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = mundo as any;
export const paises = feature(topo, topo.objects.countries) as unknown as FeatureCollection<
  Geometry,
  { name: string }
>;

export const TORDESILHAS_LON = -46.6;

export const criarProjecao = (
  largura: number,
  altura: number,
  centro: [number, number],
  escala: number,
): GeoProjection =>
  geoEquirectangular()
    .center(centro)
    .scale(escala)
    .translate([largura / 2, altura / 2]);

export const caminho = (proj: GeoProjection) => geoPath(proj);
