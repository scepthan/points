import type { OwnerStandingsEntry } from "@/types";

export const GetOwnerStandingsEndpoint = async (season: number, series: number) =>
  (await fetch(
    `https://cf.nascar.com/cacher/${season}/${series}/final/${series}-owners-points.json`,
  ).then((res) => res.json())) as OwnerStandingsEntry[];
