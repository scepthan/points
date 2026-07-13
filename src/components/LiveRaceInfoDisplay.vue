<template>
  <h5 class="my-1">
    Live: lap {{ info.lap_number }}/{{ info.laps_in_race }} ({{ stageLapsRemaining }} to go in stage
    {{ info.stage.stage_num }}); {{ flagState }} at
    {{ info.track_name }}
  </h5>
</template>

<script setup lang="ts">
import type { LiveRaceInfo } from "@/types";

const props = defineProps<{
  info: LiveRaceInfo;
}>();

const stageLapsRemaining = computed(
  () => props.info.stage.finish_at_lap - props.info.lap_number + 1,
);

const flagState = computed(() => {
  switch (props.info.flag_state) {
    case 1:
      return "green flag";
    case 2:
      return "yellow flag";
    case 3:
      return "red flag";
    case 5:
      return "warmup";
    case 8:
      return "pre-race";
    case 9:
      return "checkered flag";
    default:
      return `unknown status (${props.info.flag_state})`;
  }
});
</script>
