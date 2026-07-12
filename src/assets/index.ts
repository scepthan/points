import type { DriverStandingsEntry, SeriesInfo, WaiverInfo } from "@/types";
import seriesData from "./series.json";
import waiverData from "./waivers.json";

export const allSeries: SeriesInfo[] = seriesData;
export const allWaivers: WaiverInfo[] = waiverData;
export const getDriverWaiver = (driver: DriverStandingsEntry, series_id: number, season: number) =>
  allWaivers.find(
    (waiver) =>
      waiver.driver_name === driver.driver_name &&
      waiver.series_id === series_id &&
      waiver.year === season,
  );
