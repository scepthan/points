import { useQuery } from "@tanstack/vue-query";
import { GetOwnerStandingsEndpoint } from "../endpoints";

export const useGetOwnerStandingsQuery = (season: number, series: number) => {
  const queryKey = ["owner_standings", series];
  const fetch = async () => await GetOwnerStandingsEndpoint(season, series);

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
