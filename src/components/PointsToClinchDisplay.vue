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
import { cardinalNumber, useCurrentSeason } from "@/composables";
import type { StandingsEntry } from "@/types";

const props = defineProps<{
  entry: StandingsEntry;
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

  const entryName =
    props.entry.name.type === "driver"
      ? props.entry.name.full
      : props.entry.name.full + " #" + props.entry.carNumber;

  if (props.entry.playoffClinched) {
    return (
      `The ${driverCountText} cannot${allText} surpass ${totalPointsToClinch} points,` +
      ` meaning ${entryName} has clinched a Chase spot.`
    );
  }

  return (
    `If ${entryName} reaches ${totalPointsToClinch} points,` +
    ` the ${driverCountText} will not${allText} be able to surpass them.`
  );
});
</script>
