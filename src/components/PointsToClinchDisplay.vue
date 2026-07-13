<template>
  <span v-if="entry.playoffPointsToClinch === null">&ndash;</span>
  <v-tooltip v-else :text="tooltipText">
    <template v-slot:activator="{ props }">
      <span v-bind="props" class="hover-tooltip">{{
        entry.playoffPointsToClinch <= 0 ? "Clinched" : "+" + entry.playoffPointsToClinch
      }}</span>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { cardinalNumber, useCurrentSeason, type PlayoffCalculated } from "@/composables";
import type { DriverStandingsEntry } from "@/types";

const props = defineProps<{
  entry: PlayoffCalculated<DriverStandingsEntry>;
}>();

const { series } = useCurrentSeason();

const tooltipText = computed(() => {
  if (props.entry.playoffPointsToClinch === null || series.value === null) return "";
  const driverCurrentlyInPlayoffs = props.entry.position <= series.value.playoff_spots;
  const driversToClinch = props.entry.playoffDriversBeatenToClinch ?? 0;

  const driverWithinPositions =
    driverCurrentlyInPlayoffs &&
    props.entry.position > series.value.playoff_spots + 1 - driversToClinch;
  const totalPointsToClinch = props.entry.points + props.entry.playoffPointsToClinch;

  const highPosition = cardinalNumber(
    series.value.playoff_spots +
      2 -
      driversToClinch -
      (driverWithinPositions || !driverCurrentlyInPlayoffs ? 1 : 0),
  );
  const lowPosition = cardinalNumber(
    series.value.playoff_spots + (driverCurrentlyInPlayoffs ? 1 : 0),
  );
  const driverCountText =
    driversToClinch === 1
      ? `driver currently in ${lowPosition}`
      : `${driversToClinch} ${driverWithinPositions ? "other " : ""} drivers currently in ${highPosition} to ${lowPosition}`;
  const allText = driversToClinch === 1 ? "" : " all";

  if (props.entry.playoffClinched) {
    return (
      `The ${driverCountText} cannot${allText} surpass ${totalPointsToClinch} points,` +
      ` meaning ${props.entry.driver_name} has clinched a Chase spot.`
    );
  }

  return (
    `If ${props.entry.driver_name} reaches ${totalPointsToClinch} points,` +
    ` the ${driverCountText} will not${allText} be able to surpass them.`
  );
});
</script>
