import type {
  DriverStandingsEntry,
  LiveRaceInfo,
  LiveRaceVehicleInfo,
  LiveStagePointsEntry,
  StandingsEntry,
} from "@/types";

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
  entries: StandingsEntry[],
  calcProjection: boolean,
  liveStageInfo?: LiveStagePointsEntry[],
  liveRaceInfo?: LiveRaceInfo,
): StandingsEntry[] => {
  const updatedEntries: StandingsEntry[] = entries.map((entry) => ({
    ...entry,
    previousPoints: entry.points,
    currentRacePoints: 0,
    projectedRacePoints: 0,
    runningPosition: 0,
    fastestLap: false,
    stagesWon: [],
    previousPosition: entry.position,
  }));
  if (!liveStageInfo) {
    if (!calcProjection) return updatedEntries;
    liveStageInfo = [];
  }

  // TODO: account for Coca-Cola 600
  const stagesRemaining = Math.max(0, 2 - liveStageInfo.length);

  const entriesMatch = (entry: StandingsEntry, liveEntry: LiveRaceVehicleInfo) =>
    entry.name.type === "driver"
      ? liveEntry.driver.driver_id.toString() === entry.entryId
      : liveEntry.vehicle_number === entry.entryId.slice(-2);

  const findLiveEntry = (entry: StandingsEntry) =>
    liveRaceInfo?.vehicles.find((liveEntry) => entriesMatch(entry, liveEntry));

  const { entryId: fastLapDriver } = updatedEntries.reduce(
    (currentBest, entry) => {
      const liveEntry = findLiveEntry(entry);
      if (!liveEntry) return currentBest;
      if (liveEntry.best_lap_time >= currentBest.bestLapTime) {
        return currentBest;
      }
      return { entryId: entry.entryId, bestLapTime: liveEntry.best_lap_time };
    },
    { entryId: "", bestLapTime: Infinity },
  );

  for (const liveEntry of liveRaceInfo?.vehicles ?? []) {
    const entry = updatedEntries.find((entry) => entriesMatch(entry, liveEntry));
    if (!entry) {
      console.warn("Could not find standings entry for entry:", entry);
      continue;
    }

    let currentRacePoints = 0;
    for (const stage of liveStageInfo) {
      const stagePointsResult = stage.results.find((liveStagePoints) =>
        entry.name.type === "driver"
          ? liveStagePoints.driver_id.toString() === entry.entryId
          : liveStagePoints.vehicle_number === entry.entryId.slice(-2),
      );
      if (stagePointsResult) {
        currentRacePoints += stagePointsResult.stage_points;
        if (stagePointsResult.position === 1) {
          entry.stagesWon.push(stage.stage_number);
        }
      }
    }

    const fastestLap = entry.entryId === fastLapDriver;
    let projectedRacePoints = 0;
    let runningPosition = 0;
    if (calcProjection && liveRaceInfo) {
      const liveEntry = findLiveEntry(entry);
      if (liveEntry) {
        runningPosition = liveEntry.running_position;
        projectedRacePoints += Math.max(0, 11 - runningPosition) * stagesRemaining;
        projectedRacePoints += runningPosition === 1 ? 55 : Math.max(1, 37 - runningPosition);
        if (fastestLap) projectedRacePoints += 1;
      }
    }

    entry.starts += 1;
    entry.currentRacePoints = currentRacePoints;
    entry.projectedRacePoints = projectedRacePoints;
    entry.points += currentRacePoints + projectedRacePoints;
    entry.runningPosition = runningPosition;
    entry.fastestLap = fastestLap;
  }

  // TODO: sort by best finishes? (actual tiebreaker)
  updatedEntries.sort((a, b) => b.points - a.points || b.wins - a.wins);

  let position = 1;
  for (const entry of updatedEntries) {
    entry.position = position++;
    entry.deltaLeader = entry.points - updatedEntries[0].points;
  }

  return updatedEntries;
};
