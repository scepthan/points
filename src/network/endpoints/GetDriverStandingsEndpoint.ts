import type { DriverStandingsEntry } from "@/types";

export const GetDriverStandingsEndpoint = async (series: number) =>
  (await fetch(
    `https://cf.nascar.com/data/cacher/production/2026/${series}/racinginsights-points-feed.json`,
  ).then((res) => res.json())) as DriverStandingsEntry[];
