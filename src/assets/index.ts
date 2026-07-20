import type { DnqInfo, SeriesInfo, WaiverInfo } from "@/types";
import dnqData from "./dnqs.json";
import seriesData from "./series.json";
import waiverData from "./waivers.json";

export const allDnqs: DnqInfo[] = dnqData;
export const allSeries: SeriesInfo[] = seriesData;
export const allWaivers: WaiverInfo[] = waiverData;
