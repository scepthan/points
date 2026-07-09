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

defineProps<{
  series: number;
  entries: DriverStandingsEntry[];
}>();
</script>
