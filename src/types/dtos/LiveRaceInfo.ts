export interface LiveRaceInfo {
  lap_number: number;
  elapsed_time: number;
  flag_state: number;
  race_id: number;
  laps_in_race: number;
  laps_to_go: number;
  vehicles: LiveRaceVehicleInfo[];
  run_id: number;
  run_name: string;
  series_id: number;
  time_of_day: number;
  time_of_day_os: string;
  track_id: number;
  track_length: number;
  track_name: string;
  run_type: number;
  number_of_caution_segments: number;
  number_of_caution_laps: number;
  number_of_lead_changes: number;
  number_of_leaders: number;
  avg_diff_1to3: number;
  stage: LiveRaceStageInfo;
}

export interface LiveRaceVehicleInfo {
  average_restart_speed: number;
  average_running_position: number;
  average_speed: number;
  best_lap: number;
  best_lap_speed: number;
  best_lap_time: number;
  vehicle_manufacturer: string;
  vehicle_number: string;
  driver: LiveRaceVehicleDriverInfo;
  vehicle_elapsed_time: number;
  fastest_laps_run: number;
  laps_position_improved: number;
  laps_completed: number;
  laps_led: LiveRaceVehicleLapsLedInfo[];
  last_lap_speed: number;
  last_lap_time: number;
  passes_made: number;
  passing_differential: number;
  position_differential_last_10_percent: number;
  pit_stops: LiveRaceVehiclePitStopInfo[];
  qualifying_status: number;
  running_position: number;
  status: number;
  delta: number;
  sponsor_name: string;
  starting_position: number;
  times_passed: number;
  quality_passes: number;
  is_on_track: boolean;
  is_on_dvp: boolean;
}

interface LiveRaceVehicleDriverInfo {
  driver_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  is_in_chase: boolean;
}

interface LiveRaceVehicleLapsLedInfo {
  start_lap: number;
  end_lap: number;
}

interface LiveRaceVehiclePitStopInfo {
  positions_gained_lossed: number;
  pit_in_elapsed_time: number;
  pit_in_lap_count: number;
  pit_in_leader_lap: number;
  pit_out_elapsed_time: number;
  pit_in_rank: number;
  pit_out_rank: number;
}

interface LiveRaceStageInfo {
  stage_num: number;
  finish_at_lap: number;
  laps_in_stage: number;
}
