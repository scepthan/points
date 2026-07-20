<template>
  <v-tooltip v-if="tooltipText" :text="tooltipText">
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

const { racesCompleted, getDriverWaiver, getCarDnqs } = useCurrentSeason();

const waiver = computed(() =>
  props.entry.name.type === "driver" ? getDriverWaiver(props.entry.name.full) : undefined,
);
const dnqs = computed(() =>
  props.entry.name.type === "owner" ? getCarDnqs(props.entry.carNumber) : undefined,
);

const tooltipText = computed(() => {
  if (racesCompleted.value === null) return "";
  const racesMissed = racesCompleted.value - props.entry.starts;
  const plural = racesMissed === 1 ? "" : "s";

  if (waiver.value)
    return (
      `${props.entry.name.full} has received a waiver and will be eligible for the Chase` +
      ` despite missing ${racesMissed} race${plural} due to ${waiver.value.reason}`
    );
  if (dnqs.value)
    return (
      `${props.entry.name.full} #${props.entry.carNumber} has attempted to qualify for every race` +
      ` and will be eligible for the Chase despite ${racesMissed} DNQ${plural}`
    );
});
</script>
