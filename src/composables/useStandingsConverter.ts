import type { DriverStandingsEntry, StandingsEntry } from "@/types";

export const useStandingsConverter = () => {
  const convertDriverStandings = (entries: DriverStandingsEntry[]): StandingsEntry[] =>
    entries.map((entry) => ({
      entryId: entry.driver_id.toString(),
      position: entry.position,
      carNumber: entry.car_no,
      name: {
        type: "driver",
        first: entry.driver_first_name,
        last: entry.driver_last_name,
        full: entry.driver_name,
      },
      points: entry.points,
      deltaLeader: entry.delta_leader,
      starts: entry.starts,
      wins: entry.wins,
      top5s: entry.top_5,
      top10s: entry.top_10,
      dnfs: entry.dnf,
      playoffEligible: false,
      playoffPossible: false,
      pointsToCutline: 0,
      playoffClinched: false,
      playoffPointsToClinch: 0,
      playoffDriversBeatenToClinch: 0,
      previousPoints: 0,
      currentRacePoints: 0,
      projectedRacePoints: 0,
      runningPosition: 0,
      fastestLap: false,
      stagesWon: [],
      previousPosition: 0,
    }));

  return { convertDriverStandings };
};
