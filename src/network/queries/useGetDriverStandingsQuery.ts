import { useQuery } from "@tanstack/vue-query";
import { GetDriverStandingsEndpoint } from "../endpoints";

export const useGetDriverStandingsQuery = (series: number) => {
  const queryKey = ["driver_standings", series];
  const fetch = async () => await GetDriverStandingsEndpoint(series);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKey,
    queryFn: fetch,
    staleTime: 1000 * 60 * 5,
  });

  return {
    entries: data,
    isPending,
    isError,
  };
};
