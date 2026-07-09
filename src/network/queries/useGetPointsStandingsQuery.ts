import { useQuery } from "@tanstack/vue-query";
import { GetPointsStandingsEndpoint } from "../endpoints";

export const useGetPointsStandingsQuery = (series: number) => {
  const queryKey = ["standings", series];
  const fetch = async () => await GetPointsStandingsEndpoint(series);

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
