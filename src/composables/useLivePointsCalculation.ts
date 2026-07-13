import type { DriverStandingsEntry, LiveRaceInfo, LiveStagePointsInfo } from "@/types";

export type ExpandedDriverStandingsEntry = DriverStandingsEntry & {
  previousPoints: number;
  currentRacePoints: number;
  projectedRacePoints: number;
  runningPosition: number;
  fastestLap: boolean;
  stagesWon: number[];
  previousPosition: number;
};

export const useLivePointsCalculation = (
  entries: DriverStandingsEntry[],
  calcProjection: boolean,
  liveStagePoints?: LiveStagePointsInfo[],
  liveRaceInfo?: LiveRaceInfo,
): ExpandedDriverStandingsEntry[] => {
  const defaultEntries = entries.map((entry) => ({
    ...entry,
    previousPoints: entry.points,
    currentRacePoints: 0,
    projectedRacePoints: 0,
    runningPosition: 0,
    fastestLap: false,
    stagesWon: [],
    previousPosition: entry.position,
  }));
  if (!liveStagePoints) return defaultEntries;

  const { driverId: fastLapDriver } = defaultEntries.reduce(
    (currentBest, nextDriver) => {
      const liveEntry = liveRaceInfo?.vehicles.find(
        (liveEntry) => liveEntry.driver.driver_id === nextDriver.driver_id,
      );
      if (!liveEntry) return currentBest;
      if (liveEntry.best_lap_time >= currentBest.bestLapTime) {
        return currentBest;
      }
      return { driverId: nextDriver.driver_id, bestLapTime: liveEntry.best_lap_time };
    },
    { driverId: 0, bestLapTime: Infinity },
  );

  const updatedEntries = defaultEntries
    .map((entry) => {
      let currentRacePoints = 0;
      liveStagePoints?.forEach((stagePoints) => {
        const liveEntry = stagePoints.results.find(
          (liveEntry) => liveEntry.driver_id === entry.driver_id,
        );
        if (liveEntry) {
          currentRacePoints += liveEntry.stage_points;
        }
      });

      const fastestLap = entry.driver_id === fastLapDriver;
      let projectedRacePoints = 0;
      let runningPosition = 0;
      if (calcProjection && liveRaceInfo) {
        const liveEntry = liveRaceInfo.vehicles.find(
          (liveEntry) => liveEntry.driver.driver_id === entry.driver_id,
        );
        if (liveEntry) {
          runningPosition = liveEntry.running_position;
          projectedRacePoints += (11 - runningPosition) * Math.max(0, 2 - liveStagePoints.length);
          projectedRacePoints += runningPosition === 1 ? 55 : Math.max(37 - runningPosition, 1);
          if (fastestLap) projectedRacePoints += 1;
        }
      }

      return {
        ...entry,
        previousPoints: entry.points,
        points: entry.points + currentRacePoints + projectedRacePoints,
        currentRacePoints,
        runningPosition,
        fastestLap,
        projectedRacePoints,
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
