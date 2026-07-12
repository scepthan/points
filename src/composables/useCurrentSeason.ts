import { allWaivers } from "@/assets";
import type { DriverStandingsEntry, SeriesInfo } from "@/types";

const series = ref<SeriesInfo | null>(null);
const season = ref<number | null>(null);
const racesCompleted = ref<number | null>(null);

const getDriverWaiver = (driver: DriverStandingsEntry) => {
  if (!series.value || !season.value) return undefined;
  return allWaivers.find(
    (waiver) =>
      waiver.driver_name === driver.driver_name &&
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
