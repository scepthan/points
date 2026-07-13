import type { LiveStagePointsInfo } from "@/types/LiveStagePointsInfo";

export const GetLiveStagePointsInfoEndpoint = async (
  seasonId: number,
  seriesId: number,
  raceId: number | Ref<number>,
) =>
  (await fetch(
    `https://cf.nascar.com/cacher/${seasonId}/${seriesId}/${unref(raceId)}/live-stage-points.json`,
  ).then((res) => res.json())) as LiveStagePointsInfo[];
