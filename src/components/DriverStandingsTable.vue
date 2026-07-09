<template>
  <v-data-table
    :items="entries"
    :headers="[
      { title: 'Pos', value: 'position' },
      { title: 'Num', value: 'car_no' },
      { title: 'Driver', value: 'driver_name' },
      { title: 'Mfr', value: 'manufacturer' },
      { title: 'Points', value: 'points' },
      { title: 'Behind', value: 'delta_leader' },
    ]"
    :row-props="(item) => ({ class: item.item.position == playoffCutoff ? 'playoff-cutoff' : '' })"
    :items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:item.car_no="{ item }">
      <CarBadge :series="series" :number="item.car_no" />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { DriverStandingsEntry } from "@/types";

const props = defineProps<{
  series: number;
  entries: DriverStandingsEntry[];
}>();

const playoffCutoff = computed(() => {
  switch (props.series) {
    case 1:
      return 16;
    case 2:
      return 12;
    case 3:
      return 10;
    default:
      return 0;
  }
});
</script>

<style scoped>
:deep(.playoff-cutoff td) {
  border-bottom: 2px solid #ff2108 !important;
}
</style>
