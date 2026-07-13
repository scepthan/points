import { useQuery } from "@tanstack/vue-query";
import { GetLiveStagePointsInfoEndpoint } from "../endpoints";

export const useGetLiveStagePointsInfoQuery = (
  seasonId: number,
  seriesId: number,
  raceId: number | Ref<number>,
) => {
  const queryKey = ["live_stage_points_info", raceId];
  const fetch = async () => await GetLiveStagePointsInfoEndpoint(seasonId, seriesId, raceId);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: fetch,
    refetchInterval: 1000 * 15,
  });

  return {
    liveStagePointsInfo: data,
    isPending,
    isError,
    refetch,
  };
};
