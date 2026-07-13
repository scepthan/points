import type { DriverStandingsEntry, LiveStagePointsInfo } from "@/types";

type ExpandedDriverStandingsEntry = DriverStandingsEntry & {
  previousPoints: number;
  currentRacePoints: number;
  previousPosition: number;
};

export const useLivePointsCalculation = (
  entries: DriverStandingsEntry[],
  liveStagePoints?: LiveStagePointsInfo[],
): ExpandedDriverStandingsEntry[] => {
  const defaultEntries = entries.map((entry) => ({
    ...entry,
    previousPoints: entry.points,
    currentRacePoints: 0,
    previousPosition: entry.position,
  }));
  if (!liveStagePoints) return defaultEntries;

  const updatedEntries = defaultEntries
    .map((entry) => {
      let totalStagePoints = 0;
      liveStagePoints?.forEach((stagePoints) => {
        const liveEntry = stagePoints.results.find(
          (liveEntry) => liveEntry.driver_id === entry.driver_id,
        );
        if (liveEntry) {
          totalStagePoints += liveEntry.stage_points;
        }
      });

      return {
        ...entry,
        previousPoints: entry.points,
        points: entry.points + totalStagePoints,
        currentRacePoints: totalStagePoints,
      };
    })
    .sort((a, b) => b.points - a.points || b.wins - a.wins);

  return updatedEntries.map((entry, index) => ({
    ...entry,
    previousPosition: entry.position,
    position: index + 1,
    delta_leader: index === 0 ? 0 : entry.points - updatedEntries[0].points,
  }));
};
