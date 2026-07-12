<template>
  <v-tooltip v-if="waiver" :text="tooltipText">
    <template v-slot:activator="{ props }">
      <span v-bind="props" class="hover-tooltip">{{ entry.starts }}</span>
    </template>
  </v-tooltip>
  <span v-else>{{ entry.starts }}</span>
</template>

<script setup lang="ts">
import { getDriverWaiver } from "@/assets";
import type { DriverStandingsEntry } from "@/types";

const props = defineProps<{
  entry: DriverStandingsEntry;
  seriesId: number;
  season: number;
  racesCompleted: number;
}>();

const waiver = computed(() => getDriverWaiver(props.entry, props.seriesId, props.season));

const tooltipText = computed(() => {
  if (!waiver.value) return "";
  const racesMissed = props.racesCompleted - props.entry.starts;
  return (
    `${props.entry.driver_name} has received a waiver and will be eligible for the Chase` +
    ` despite missing ${racesMissed} races due to ${waiver.value.reason}`
  );
});
</script>
