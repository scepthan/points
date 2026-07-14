export interface StandingsEntry {
  entryId: string;
  position: number;
  carNumber: string;
  name:
    | { type: "driver"; first: string; last: string; full: string }
    | { type: "owner"; full: string };
  points: number;
  deltaLeader: number;
  starts: number;
  wins: number;
  top5s: number;
  top10s: number;
  dnfs: number;

  playoffEligible: boolean;
  playoffPossible: boolean;
  deltaCutline: number;
  playoffClinched: boolean;
  playoffPointsToClinch: number | null;
  playoffDriversBeatenToClinch: number | null;

  previousPoints: number;
  currentRacePoints: number;
  projectedRacePoints: number;
  runningPosition: number;
  fastestLap: boolean;
  stagesWon: number[];
  previousPosition: number;
}
