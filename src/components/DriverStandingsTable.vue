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

    <template v-slot:item.starts="{ item }">
      <StartsDisplay
        :entry="item"
        :series-id="series.id"
        :season="season"
        :races-completed="racesCompleted"
      />
    </template>
  </v-data-table>

  <v-row no-gutters class="mt-2 legend">
    <v-col v-for="entry in legendEntries" :key="entry.class" cols="4" sm="3" :class="entry.class">
      {{ entry.text }}
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { getDriverWaiver } from "@/assets";
import type { DriverStandingsEntry } from "@/types";
import type { SeriesInfo } from "@/types/SeriesInfo";

const props = defineProps<{
  series: SeriesInfo;
  entries: DriverStandingsEntry[];
  season: number;
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

const isPlayoffEligible = (driver: DriverStandingsEntry) =>
  driver.starts === racesCompleted.value ||
  getDriverWaiver(driver, props.series.id, props.season) !== undefined;

const isPlayoffPossible = (driver: DriverStandingsEntry) =>
  driver.points + (props.series.regular_season_races - racesCompleted.value) * 75 >=
  props.entries[props.series.playoff_spots - 1].points;

const legendEntries = [
  { class: "playoff-impossible", text: "Mathematically eliminated from Chase" },
  { class: "playoff-ineligible", text: "Ineligible for Chase" },
  { class: "playoff-clinched", text: "Mathematically clinched Chase spot" },
];
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
:deep(.playoff-clinched td),
div.playoff-clinched {
  background-color: #0d4800 !important;
}

.legend div {
  padding: 12px;
}

.hover-tooltip {
  border-bottom: 1px dotted #fff;
  cursor: help;
}
</style>
