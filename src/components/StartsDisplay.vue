<template>
  <v-tooltip v-if="waiver" :text="tooltipText">
    <template v-slot:activator="{ props }">
      <span v-bind="props" class="hover-tooltip">{{ entry.starts }}</span>
    </template>
  </v-tooltip>
  <span v-else>{{ entry.starts }}</span>
</template>

<script setup lang="ts">
import { useCurrentSeason } from "@/composables";
import type { StandingsEntry } from "@/types";

const props = defineProps<{
  entry: StandingsEntry;
}>();

const { racesCompleted, getDriverWaiver } = useCurrentSeason();

const waiver = computed(() =>
  props.entry.name.type === "driver" ? getDriverWaiver(props.entry.name.full) : undefined,
);

const tooltipText = computed(() => {
  if (!waiver.value || racesCompleted.value === null) return "";
  const racesMissed = racesCompleted.value - props.entry.starts;
  return (
    `${props.entry.name.full} has received a waiver and will be eligible for the Chase` +
    ` despite missing ${racesMissed} races due to ${waiver.value.reason}`
  );
});
</script>
