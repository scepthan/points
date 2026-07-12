<template>
  <span v-if="driver.playoffPointsToClinch === null">&ndash;</span>
  <v-tooltip v-else :text="tooltipText">
    <template v-slot:activator="{ props }">
      <span v-bind="props" class="hover-tooltip">{{
        driver.playoffPointsToClinch <= 0 ? "Clinched" : "+" + driver.playoffPointsToClinch
      }}</span>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { useCurrentSeason, type PlayoffCalculationEntry } from "@/composables";

const props = defineProps<{
  driver: PlayoffCalculationEntry;
}>();

const { series } = useCurrentSeason();

const cardinalNumber = (n: number) => {
  n %= 100;
  if (n >= 11 && n <= 20) return n + "th";
  if (n % 10 === 1) return n + "st";
  if (n % 10 === 2) return n + "nd";
  if (n % 10 === 3) return n + "rd";
  return n + "th";
};

const tooltipText = computed(() => {
  if (props.driver.playoffPointsToClinch === null || series.value === null) return "";
  const driverCurrentlyInPlayoffs = props.driver.position <= series.value.playoff_spots;
  const driversToClinch = props.driver.playoffDriversBeatenToClinch ?? 0;

  const driverWithinPositions =
    driverCurrentlyInPlayoffs &&
    props.driver.position > series.value.playoff_spots + 1 - driversToClinch;
  const totalPointsToClinch = props.driver.points + props.driver.playoffPointsToClinch;

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

  if (props.driver.playoffClinched) {
    return (
      `The ${driverCountText} cannot${allText} surpass ${totalPointsToClinch} points,` +
      ` meaning ${props.driver.driver_name} has clinched a Chase spot.`
    );
  }

  return (
    `If ${props.driver.driver_name} reaches ${totalPointsToClinch} points,` +
    ` the ${driverCountText} will not${allText} be able to surpass them.`
  );
});
</script>
