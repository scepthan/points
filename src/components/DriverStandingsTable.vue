<template>
  <v-data-table
    :items="calculatedEntries"
    :headers="tableHeaders"
    :row-props="(item) => playoffCutoffClass(item.item)"
    fixed-header
    height="calc(100vh - 250px)"
    style="min-height: 580px"
    :items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:item.position="{ item }">
      <PositionDisplay :current="item.position" :previous="item.previousPosition" />
    </template>

    <template v-slot:item.carNumber="{ item }">
      <CarBadge :number="item.carNumber" />
    </template>

    <template v-slot:item.name.full="{ item }">
      <div v-if="item.name.type === 'driver'" class="d-flex flex-column">
        <span class="text-label-medium text-medium-emphasis">{{ item.name.first }}</span>
        <span class="text-title-medium mt-n1">{{ item.name.last }}</span>
      </div>
      <span v-else class="text-body-medium">{{ item.name.full }}</span>
    </template>

    <template v-slot:item.runningPosition="{ item }">
      <span v-if="item.runningPosition">{{ cardinalNumber(item.runningPosition) }}</span>
      <span v-else>&ndash;</span>
    </template>

    <template v-slot:item.points="{ item }">
      <CurrentPointsDisplay :entry="item" />
    </template>

    <template v-slot:item.projectedPoints="{ item }">
      <span v-if="item.currentRacePoints + item.projectedRacePoints > 0">
        +{{ item.currentRacePoints + item.projectedRacePoints }}
      </span>
      <span v-else>&ndash;</span>
    </template>

    <template v-slot:item.pointsToCutline="{ item }">
      <span v-if="item.position <= (series?.playoff_spots ?? 0)">+{{ item.pointsToCutline }}</span>
      <span v-else>&minus;{{ Math.abs(item.pointsToCutline) }}</span>
    </template>

    <template v-slot:item.deltaLeader="{ item }">
      <span v-if="item.deltaLeader === 0">0</span>
      <span v-else>&minus;{{ Math.abs(item.deltaLeader) }}</span>
    </template>

    <template v-slot:item.playoffPointsToClinch="{ item }">
      <PointsToClinchDisplay :entry="item" :base-entry="findBaseEntry(item)" :owners="owners" />
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
  cardinalNumber,
  useCurrentSeason,
  useLivePointsCalculation,
  usePlayoffCalculation,
} from "@/composables";
import type { LiveRaceInfo, LiveStagePointsEntry, StandingsEntry } from "@/types";

const props = defineProps<{
  entries: StandingsEntry[];
  projection: boolean;
  owners: boolean;
  liveRaceInfo?: LiveRaceInfo;
  liveStagePoints?: LiveStagePointsEntry[];
}>();

const calculatedEntries = computed(() => {
  const liveEntries = useLivePointsCalculation(
    props.entries,
    props.projection,
    props.liveStagePoints,
    props.liveRaceInfo,
  );
  return usePlayoffCalculation(
    liveEntries,
    props.liveStagePoints?.length,
    props.liveStagePoints && props.projection,
  );
});

const calculatedEntriesWithoutProjection = computed(() => {
  const liveEntries = useLivePointsCalculation(props.entries, false, props.liveStagePoints);
  return usePlayoffCalculation(liveEntries, props.liveStagePoints?.length);
});
const findBaseEntry = (entry: StandingsEntry) =>
  calculatedEntriesWithoutProjection.value.find((entry2) => entry2.entryId === entry.entryId);

const anyEarnedPoints = computed(() =>
  calculatedEntries.value.some((entry) => entry.currentRacePoints || entry.projectedRacePoints),
);
const noneEarnedPoints = computed(() => !anyEarnedPoints.value);
const usingProjection = computed(() => props.projection);

const tableHeaders = computed(() =>
  [
    { title: "Pos", value: "position" },
    { title: "Num", value: "carNumber" },
    {
      title: props.owners ? "Owner" : "Driver",
      value: "name.full",
      cellProps: { style: "max-width: 230px" },
    },
    { title: "Points", value: "points" },
    { title: "Today", value: "projectedPoints", if: anyEarnedPoints },
    { title: "Running", value: "runningPosition", if: usingProjection },
    { title: "Cutline", value: "pointsToCutline" },
    { title: "Leader", value: "deltaLeader" },
    { title: "To Clinch", value: "playoffPointsToClinch" },
    { title: "Starts", value: "starts" },
    { title: "Wins", value: "wins" },
    { title: "DNFs", value: "dnfs", if: noneEarnedPoints },
  ].filter((header) => (header.if !== undefined ? unref(header.if) : true)),
);

const { racesCompleted, series } = useCurrentSeason();

const playoffCutoffClass = (entry: StandingsEntry) => {
  if (series.value === null || racesCompleted.value === null) return {};

  const classes = [];
  if (entry.position === series.value.playoff_spots) {
    classes.push(
      racesCompleted.value < series.value.regular_season_races
        ? "playoff-cutoff-upcoming"
        : "playoff-cutoff",
    );
  }
  const stagesRemaining = Math.max(2 - (props.liveStagePoints?.length ?? 0), 0);
  const maxPointsAvailable = props.projection ? 0 : 56 + 10 * stagesRemaining;
  if (!entry.playoffPossible) {
    classes.push("playoff-eliminated");
  } else if (!entry.playoffEligible) {
    classes.push("playoff-ineligible");
  } else if (entry.playoffClinched) {
    classes.push("playoff-clinched");
  } else if (
    entry.playoffPointsToClinch !== null &&
    entry.playoffPointsToClinch <= maxPointsAvailable
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
