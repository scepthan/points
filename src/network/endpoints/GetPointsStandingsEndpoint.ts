import type { PointsStandingsEntry } from "@/types";

export const GetPointsStandingsEndpoint = async (series: number) =>
  (await fetch(
    `https://cf.nascar.com/data/cacher/production/2026/${series}/racinginsights-points-feed.json`,
  ).then((res) => res.json())) as PointsStandingsEntry[];
