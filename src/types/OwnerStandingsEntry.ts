export interface OwnerStandingsEntry {
  position: number;
  owner_name: string;
  vehicle_number: string;
  points: number;
  bonus_points: number;
  delta_next: number;
  delta_leader: number;
  delta_chase: number;
  starts: number;
  poles: number;
  wins: number;
  top_5: number;
  top_10: number;
  dnf: number;
  winnings: {
    source: string;
    parsedValue: number;
  };
  owner_id: number;
  owner_first_name: string;
  owner_last_name: string;
  owner_suffix: string;
}
