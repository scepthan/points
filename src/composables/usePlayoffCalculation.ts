import type { StandingsEntry } from "@/types";
import { useCurrentSeason } from "./useCurrentSeason";

export const usePlayoffCalculation = (
  standings: StandingsEntry[],
  stagesCompleted?: number,
  raceCompleted?: boolean,
): StandingsEntry[] => {
  const currentSeason = useCurrentSeason();
  const series = currentSeason.series.value;
  const racesCompleted = currentSeason.racesCompleted.value;
  if (series === null || racesCompleted === null || standings.length < series.playoff_spots)
    return [];

  const racesRemaining = series.regular_season_races - racesCompleted - (raceCompleted ? 1 : 0);
  // TODO: account for Coca-Cola 600
  const stagesRemaining = racesRemaining * 2 - (raceCompleted ? 0 : stagesCompleted || 0);

  const maximumPointsRemaining = (position: number) => {
    const basePoints = position === 1 ? 56 : 37 - position; // Including fastest lap point in 1st place points
    const stagePoints = position <= 10 ? 11 - position : 0;
    return basePoints * racesRemaining + stagePoints * stagesRemaining;
  };

  const maximumPointsForNDrivers = (driverCount: number) => {
    let total = 0;
    for (let i = 0; i < driverCount; i++) {
      total += maximumPointsRemaining(i + 1);
    }
    return total;
  };

  const playoffSpots = series.playoff_spots;
  const cutoffPoints = standings[playoffSpots - 1].points;

  const eligibleEntries = standings.filter(
    (entry) =>
      entry.starts === racesCompleted ||
      (entry.name.type === "driver" &&
        currentSeason.getDriverWaiver(entry.name.full) !== undefined),
  );

  const calculated = [];
  for (const entry of standings) {
    const playoffEligible = eligibleEntries.includes(entry);
    const playoffPossible = entry.points + maximumPointsRemaining(1) >= cutoffPoints;
    const deltaCutline =
      entry.points -
      (entry.position > playoffSpots ? cutoffPoints : standings[playoffSpots].points);
    let playoffClinched = false;
    let playoffPointsToClinch: number | null = null;
    let playoffDriversBeatenToClinch: number | null = null;

    if (playoffEligible && playoffPossible) {
      const currentPlayoffsWithoutDriver = eligibleEntries
        .filter((d) => d !== entry)
        .slice(0, playoffSpots);

      let lowestHighestPossibleCutoff = Infinity;
      for (let i = 1; i <= playoffSpots; i++) {
        const totalLowestDriversPoints = currentPlayoffsWithoutDriver
          .slice(-i)
          .reduce((sum, d) => sum + d.points, 0);
        const maxPointsForOtherDrivers = maximumPointsForNDrivers(i);
        const highestPossibleCutoff = Math.floor(
          (totalLowestDriversPoints + maxPointsForOtherDrivers) / i,
        );
        if (highestPossibleCutoff < lowestHighestPossibleCutoff) {
          lowestHighestPossibleCutoff = highestPossibleCutoff;
          playoffPointsToClinch = highestPossibleCutoff + 1 - entry.points;
          playoffDriversBeatenToClinch = i;
          if (entry.points > highestPossibleCutoff) {
            playoffClinched = true;
            break;
          }
        }
      }
    }

    calculated.push({
      ...entry,
      playoffEligible,
      playoffPossible,
      deltaCutline,
      playoffClinched,
      playoffPointsToClinch,
      playoffDriversBeatenToClinch,
    });
  }

  return calculated;
};
