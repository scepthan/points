<template>
  <v-data-table
    :items="entries"
    :headers="[
      { title: 'Pos', value: 'position' },
      { title: 'Num', value: 'car_no' },
      { title: 'Driver', value: 'driver_last_name' },
      { title: 'Points', value: 'points' },
      { title: 'Behind', value: 'delta_leader' },
      { title: 'Starts', value: 'starts' },
      { title: 'Wins', value: 'wins' },
      { title: 'DNFs', value: 'dnf' },
    ]"
    :row-props="(item) => playoffCutoffClass(item.item)"
    :items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:item.car_no="{ item }">
      <CarBadge :series="series.id" :number="item.car_no" />
    </template>
    <template v-slot:item.driver_last_name="{ item }">
      <div class="d-flex flex-column">
        <span class="text-label-medium text-medium-emphasis">{{ item.driver_first_name }}</span>
        <span class="text-title-medium mt-n1">{{ item.driver_last_name }}</span>
      </div>
    </template>
  </v-data-table>

  <v-row no-gutters class="mt-2">
    <v-col cols="3" class="pa-3 playoff-impossible">Mathematically eliminated from Chase</v-col>
    <v-col cols="3" class="pa-3 playoff-ineligible">Ineligible for Chase</v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { DriverStandingsEntry } from "@/types";
import type { SeriesInfo } from "@/types/SeriesInfo";

const props = defineProps<{
  series: SeriesInfo;
  entries: DriverStandingsEntry[];
}>();

const racesCompleted = computed(() => Math.max(...props.entries.map((entry) => entry.starts)));

const playoffCutoffClass = (driver: DriverStandingsEntry) => {
  const classes = [];
  if (driver.position === props.series.playoff_spots) {
    classes.push(
      racesCompleted.value < props.series.regular_season_races
        ? "playoff-cutoff-upcoming"
        : "playoff-cutoff",
    );
  }
  if (!isPlayoffPossible(driver)) {
    classes.push("playoff-impossible");
  } else if (!isPlayoffEligible(driver)) {
    classes.push("playoff-ineligible");
  }
  return { class: classes };
};

const playoffWaiverDrivers = ["Alex Bowman", "Brent Crews"];

const isPlayoffEligible = (driver: DriverStandingsEntry) =>
  driver.starts === racesCompleted.value || playoffWaiverDrivers.includes(driver.driver_name);

const isPlayoffPossible = (driver: DriverStandingsEntry) =>
  driver.points + (props.series.regular_season_races - racesCompleted.value) * 75 >=
  props.entries[props.series.playoff_spots - 1].points;
</script>

<style scoped>
:deep(.playoff-cutoff-upcoming td) {
  border-bottom: 2px solid #f0cf08 !important;
}
:deep(.playoff-cutoff td) {
  border-bottom: 2px solid #ff2108 !important;
}

:deep(.playoff-impossible td),
div.playoff-impossible {
  background-color: #510400 !important;
}
:deep(.playoff-ineligible td),
div.playoff-ineligible {
  background-color: #512800 !important;
}
</style>
