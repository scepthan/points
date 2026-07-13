import { useQuery } from "@tanstack/vue-query";
import { GetLiveRaceInfoEndpoint } from "../endpoints";

export const useGetLiveRaceInfoQuery = () => {
  const queryKey = ["live_race_info"];
  const fetch = async () => await GetLiveRaceInfoEndpoint();

  const { data, isPending, isError } = useQuery({
    queryKey: queryKey,
    queryFn: fetch,
    refetchInterval: 1000 * 30,
  });

  return {
    liveRaceInfo: data,
    isPending,
    isError,
  };
};
