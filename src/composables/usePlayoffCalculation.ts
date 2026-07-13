import type { DriverStandingsEntry } from "@/types";
import { useCurrentSeason } from "./useCurrentSeason";

export type PlayoffCalculated<T extends DriverStandingsEntry> = T & {
  playoffEligible: boolean;
  playoffPossible: boolean;
  pointsToCutline: number;
  playoffClinched: boolean;
  playoffPointsToClinch: number | null;
  playoffDriversBeatenToClinch: number | null;
};

export const usePlayoffCalculation = <T extends DriverStandingsEntry>(
  standings: T[],
  stagesCompleted?: number,
): PlayoffCalculated<T>[] => {
  const currentSeason = useCurrentSeason();
  const series = currentSeason.series.value;
  const racesCompleted = currentSeason.racesCompleted.value;
  if (series === null || racesCompleted === null || standings.length < series.playoff_spots)
    return [];

  const racesRemaining = series.regular_season_races - racesCompleted;
  const stagesRemaining = racesRemaining * 2 - (stagesCompleted || 0); // Will need to account for Coca-Cola 600 eventually

  const maximumPointsRemaining = (position: number) => {
    const basePoints = position === 1 ? 56 : 37 - position; // Including fastest lap point in 1st place points
    const stagePoints = position <= 10 ? 11 - position : 0;
    return basePoints * racesRemaining + stagePoints * stagesRemaining;
  };

  const maximumPointsForNDrivers = (driver_count: number) => {
    let total = 0;
    for (let i = 0; i < driver_count; i++) {
      total += maximumPointsRemaining(i + 1);
    }
    return total;
  };

  const playoffSpots = series.playoff_spots;
  const cutoffPoints = standings[playoffSpots - 1].points;

  const eligibleDrivers = standings.filter(
    (driver) =>
      driver.starts === racesCompleted || currentSeason.getDriverWaiver(driver) !== undefined,
  );

  const calculated = [];
  for (const driver of standings) {
    const playoffEligible = eligibleDrivers.includes(driver);
    const playoffPossible = driver.points + maximumPointsRemaining(1) >= cutoffPoints;
    const pointsToCutline =
      driver.points -
      (driver.position > playoffSpots ? cutoffPoints : standings[playoffSpots].points);
    let playoffClinched = false;
    let playoffPointsToClinch: number | null = null;
    let playoffDriversBeatenToClinch: number | null = null;

    if (playoffEligible && playoffPossible) {
      const currentPlayoffsWithoutDriver = eligibleDrivers
        .filter((d) => d !== driver)
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
          playoffPointsToClinch = highestPossibleCutoff - driver.points;
          playoffDriversBeatenToClinch = i;
          if (driver.points >= highestPossibleCutoff) {
            playoffClinched = true;
            break;
          }
        }
      }
    }

    calculated.push(
      Object.assign({}, driver, {
        playoffEligible,
        playoffPossible,
        pointsToCutline,
        playoffClinched,
        playoffPointsToClinch,
        playoffDriversBeatenToClinch,
      }),
    );
  }

  return calculated;
};
