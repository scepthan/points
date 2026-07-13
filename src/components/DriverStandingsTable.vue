<template>
  <v-data-table
    :items="calculatedEntries"
    :headers="[
      { title: 'Pos', value: 'position' },
      { title: 'Num', value: 'car_no' },
      { title: 'Driver', value: 'driver_last_name' },
      { title: 'Points', value: 'points' },
      { title: 'Cutline', value: 'pointsToCutline' },
      { title: 'Leader', value: 'delta_leader' },
      { title: 'To Clinch', value: 'playoffPointsToClinch' },
      { title: 'Starts', value: 'starts' },
      { title: 'Wins', value: 'wins' },
      { title: 'DNFs', value: 'dnf' },
    ]"
    :row-props="(item) => playoffCutoffClass(item.item)"
    :items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:item.position="{ item }">
      <PositionDisplay :current="item.position" :previous="item.previousPosition" />
    </template>

    <template v-slot:item.car_no="{ item }">
      <CarBadge :number="item.car_no" />
    </template>

    <template v-slot:item.driver_last_name="{ item }">
      <div class="d-flex flex-column">
        <span class="text-label-medium text-medium-emphasis">{{ item.driver_first_name }}</span>
        <span class="text-title-medium mt-n1">{{ item.driver_last_name }}</span>
      </div>
    </template>

    <template v-slot:item.points="{ item }">
      <CurrentPointsDisplay :entry="item" />
    </template>

    <template v-slot:item.pointsToCutline="{ item }">
      <span v-if="item.position <= (series?.playoff_spots ?? 0)">+{{ item.pointsToCutline }}</span>
      <span v-else>&minus;{{ Math.abs(item.pointsToCutline) }}</span>
    </template>

    <template v-slot:item.delta_leader="{ item }">
      <span v-if="item.delta_leader === 0">0</span>
      <span v-else>&minus;{{ Math.abs(item.delta_leader) }}</span>
    </template>

    <template v-slot:item.playoffPointsToClinch="{ item }">
      <PointsToClinchDisplay :entry="item" />
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
import {
  useCurrentSeason,
  useLivePointsCalculation,
  usePlayoffCalculation,
  type PlayoffCalculated,
} from "@/composables";
import type { DriverStandingsEntry, LiveRaceInfo, LiveStagePointsInfo } from "@/types";

const props = defineProps<{
  entries: DriverStandingsEntry[];
  projection: boolean;
  liveRaceInfo?: LiveRaceInfo;
  liveStagePoints?: LiveStagePointsInfo[];
}>();

const calculatedEntries = computed(() => {
  const liveEntries = useLivePointsCalculation(
    props.entries,
    props.projection,
    props.liveStagePoints,
    props.liveRaceInfo,
  );
  return usePlayoffCalculation(liveEntries, props.liveStagePoints?.length);
});

const { racesCompleted, series } = useCurrentSeason();

const playoffCutoffClass = (driver: PlayoffCalculated<DriverStandingsEntry>) => {
  if (series.value === null || racesCompleted.value === null) return {};

  const classes = [];
  if (driver.position === series.value.playoff_spots) {
    classes.push(
      racesCompleted.value < series.value.regular_season_races
        ? "playoff-cutoff-upcoming"
        : "playoff-cutoff",
    );
  }
  const stagesRemaining = Math.max(2 - (props.liveStagePoints?.length ?? 0), 0);
  const maxPointsAvailable = props.projection ? 0 : 56 + 10 * stagesRemaining;
  if (!driver.playoffPossible) {
    classes.push("playoff-eliminated");
  } else if (!driver.playoffEligible) {
    classes.push("playoff-ineligible");
  } else if (driver.playoffClinched) {
    classes.push("playoff-clinched");
  } else if (
    driver.playoffPointsToClinch !== null &&
    driver.playoffPointsToClinch <= maxPointsAvailable
  ) {
    classes.push("playoff-clinchable");
  }
  return { class: classes };
};

const legendEntries = [
  { class: "playoff-clinched", text: "Mathematically clinched Chase spot" },
  { class: "playoff-clinchable", text: "Can mathematically clinch Chase spot this race" },
  { class: "playoff-ineligible", text: "Ineligible for Chase" },
  { class: "playoff-eliminated", text: "Mathematically eliminated from Chase" },
];
</script>

<style scoped>
:deep(.playoff-cutoff-upcoming td) {
  border-bottom: 2px solid #f0cf08 !important;
}
:deep(.playoff-cutoff td) {
  border-bottom: 2px solid #ff2108 !important;
}

:deep(.playoff-eliminated td),
:deep(div.playoff-eliminated) {
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
