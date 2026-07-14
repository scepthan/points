<template>
  <v-tooltip v-if="entry.points > entry.previousPoints" :text="tooltipText">
    <template v-slot:activator="{ props }">
      <span v-bind="props" class="hover-tooltip">{{ entry.points }}</span>
    </template>
  </v-tooltip>
  <span v-else>{{ entry.points }}</span>
</template>

<script setup lang="ts">
import { cardinalNumber } from "@/composables";
import type { StandingsEntry } from "@/types";

const props = defineProps<{
  entry: StandingsEntry;
}>();

const tooltipText = computed(() => {
  let text = props.entry.previousPoints + " points";
  if (props.entry.currentRacePoints) text += ` + ${props.entry.currentRacePoints} earned this race`;
  if (props.entry.projectedRacePoints) {
    text += ` + ${props.entry.projectedRacePoints} projected (running ${cardinalNumber(props.entry.runningPosition)}`;
    if (props.entry.fastestLap) text += ", fastest lap";
    text += `)`;
  }
  return text;
});
</script>
