import type { DriverStandingsEntry } from "@/types";

export const useSeasonSimulation = () => {
  const simulateSeason = (entries: DriverStandingsEntry[], racesRemaining: number) => {
    const workingEntries = entries.map((entry) => ({ ...entry }));

    for (let i = 0; i < racesRemaining; i++) {
      const stageLotteryEntries = workingEntries.map((entry) => ({
        driver_id: entry.driver_id,
        lotteryEntries: entry.stage_points + racesRemaining,
      }));
      const getTotalLotteryEntries = (entries: { lotteryEntries: number }[]) => {
        return entries.reduce((total, entry) => total + entry.lotteryEntries, 0);
      };
    }
  };

  return { simulateSeason };
};
