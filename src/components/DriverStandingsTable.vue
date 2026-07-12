<template>
  <v-data-table
    :items="entries"
    :headers="[
      { title: 'Pos', value: 'position' },
      { title: 'Num', value: 'car_no' },
      { title: 'Driver', value: 'driver_last_name' },
      { title: 'Points', value: 'points' },
      { title: 'Behind', value: 'delta_leader' },
      { title: 'Points to Clinch', value: 'playoffPointsToClinch' },
      { title: 'Starts', value: 'starts' },
      { title: 'Wins', value: 'wins' },
      { title: 'DNFs', value: 'dnf' },
    ]"
    :row-props="(item) => playoffCutoffClass(item.item)"
    :items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:item.car_no="{ item }">
      <CarBadge :number="item.car_no" />
    </template>

    <template v-slot:item.driver_last_name="{ item }">
      <div class="d-flex flex-column">
        <span class="text-label-medium text-medium-emphasis">{{ item.driver_first_name }}</span>
        <span class="text-title-medium mt-n1">{{ item.driver_last_name }}</span>
      </div>
    </template>

    <template v-slot:item.playoffPointsToClinch="{ item }">
      <PointsToClinchDisplay :driver="item" />
    </template>

    <template v-slot:item.starts="{ item }">
      <StartsDisplay :entry="item" />
    </template>
  </v-data-table>

  <v-row no-gutters class="mt-2 legend">
    <v-col v-for="entry in legendEntries" :key="entry.class" cols="6" md="3" :class="entry.class">
      {{ entry.text }}
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useCurrentSeason, type PlayoffCalculationEntry } from "@/composables";

const props = defineProps<{
  entries: PlayoffCalculationEntry[];
}>();

const { racesCompleted, series } = useCurrentSeason();

const playoffCutoffClass = (driver: PlayoffCalculationEntry) => {
  if (series.value === null || racesCompleted.value === null) return {};

  const classes = [];
  if (driver.position === series.value.playoff_spots) {
    classes.push(
      racesCompleted.value < series.value.regular_season_races
        ? "playoff-cutoff-upcoming"
        : "playoff-cutoff",
    );
  }
  if (!driver.playoffPossible) {
    classes.push("playoff-impossible");
  } else if (!driver.playoffEligible) {
    classes.push("playoff-ineligible");
  } else if (driver.playoffClinched) {
    classes.push("playoff-clinched");
  } else if (driver.playoffPointsToClinch !== null && driver.playoffPointsToClinch <= 76) {
    classes.push("playoff-clinchable");
  }
  return { class: classes };
};

const legendEntries = [
  { class: "playoff-clinched", text: "Mathematically clinched Chase spot" },
  { class: "playoff-clinchable", text: "Can mathematically clinch Chase spot next race" },
  { class: "playoff-ineligible", text: "Ineligible for Chase" },
  { class: "playoff-impossible", text: "Mathematically eliminated from Chase" },
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
:deep(div.playoff-impossible) {
  background-color: #510400 !important;
}
:deep(.playoff-ineligible td),
:deep(div.playoff-ineligible) {
  background-color: #512800 !important;
}
:deep(.playoff-clinched td),
:deep(div.playoff-clinched) {
  background-color: #0d4800 !important;
}
:deep(.playoff-clinchable td),
:deep(div.playoff-clinchable) {
  background-color: #002838 !important;
}

.legend div {
  padding: 12px;
}

:deep(.hover-tooltip) {
  border-bottom: 1px dotted #fff;
  cursor: help;
}
</style>
