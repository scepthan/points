<template>
  <h5 class="my-1">
    Live: {{ flagState }} at {{ info.track_name }}, lap {{ actualLapNumber }}/{{
      info.laps_in_race
    }}
    ({{ stageLapsRemaining }} to go in stage {{ info.stage.stage_num }})
  </h5>
</template>

<script setup lang="ts">
import type { LiveRaceInfo } from "@/types";

const props = defineProps<{
  info: LiveRaceInfo;
}>();

const actualLapNumber = computed(() =>
  props.info.flag_state === 8 ? 0 : props.info.lap_number + (props.info.flag_state >= 4 ? 0 : 1),
);

const stageLapsRemaining = computed(() => props.info.stage.finish_at_lap - props.info.lap_number);

const flagState = computed(() => {
  switch (props.info.flag_state) {
    case 1:
      return "green flag";
    case 2:
      return "yellow flag";
    case 3:
      return "red flag";
    case 4:
      return "checkered flag";
    case 5:
      return "warmup";
    case 8:
      return "pre-race";
    case 9:
      return "inactive";
    default:
      return `unknown status (${props.info.flag_state})`;
  }
});
</script>
