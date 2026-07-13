import type { LiveRaceInfo } from "@/types";

export const GetLiveRaceInfoEndpoint = async () =>
  (await fetch(`https://cf.nascar.com/cacher/live/live-feed.json`).then((res) =>
    res.json(),
  )) as LiveRaceInfo;
