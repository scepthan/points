import { allWaivers } from "@/assets";
import type { SeriesInfo } from "@/types";

const series = ref<SeriesInfo | null>(null);
const season = ref<number | null>(null);
const racesCompleted = ref<number | null>(null);

const getDriverWaiver = (driverName: string) => {
  if (!series.value || !season.value) return undefined;
  return allWaivers.find(
    (waiver) =>
      waiver.driver_name === driverName &&
      waiver.series_id === series.value!.id &&
      waiver.year === season.value,
  );
};

export const useCurrentSeason = () => {
  return {
    series,
    season,
    racesCompleted,
    getDriverWaiver,
  };
};
