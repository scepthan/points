export interface LiveStagePointsEntry {
  race_id: number;
  run_id: number;
  stage_number: number;
  results: LiveStagePointsResult[];
}

interface LiveStagePointsResult {
  position: number;
  vehicle_number: string;
  driver_id: number;
  full_name: string;
  stage_points: number;
}
