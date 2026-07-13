import type { LiveStagePointsEntry } from "@/types/LiveStagePointsInfo";

export const GetLiveStagePointsInfoEndpoint = async (
  seasonId: number,
  seriesId: number,
  raceId: number | Ref<number>,
) => {
  const trueRaceId = unref(raceId);
  if (!trueRaceId) return [];
  return (await fetch(
    `https://cf.nascar.com/cacher/${seasonId}/${seriesId}/${trueRaceId}/live-stage-points.json`,
  ).then((res) => res.json())) as LiveStagePointsEntry[];
};
