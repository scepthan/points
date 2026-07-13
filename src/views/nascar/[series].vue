<template>
  <v-container>
    <div class="my-2">
      <router-link :to="{ name: 'home' }">
        <v-icon>mdi-arrow-left</v-icon> Back to home
      </router-link>
    </div>

    <div v-if="seriesInfo && entries.length > 0">
      <h1 class="mb-n4">{{ standingsYear }} {{ seriesInfo.name }} Driver Standings</h1>

      <p>
        After race {{ racesCompleted }} of {{ totalRaces }} (<span
          v-if="racesCompleted < seriesInfo.regular_season_races"
          >{{ seriesInfo.regular_season_races - racesCompleted }} races until Chase</span
        ><span v-else>{{ totalRaces - racesCompleted }} Chase races remaining</span>)
      </p>
      <p v-if="liveRaceInfo?.series_id === seriesId">
        Race at {{ liveRaceInfo.track_name }} is live! (Flag state: {{ flagState }})
      </p>
      <DriverStandingsTable :entries="entries" />
    </div>
    <div v-else>
      <p v-if="query.isError.value">Error loading points standings for series ID {{ seriesId }}.</p>
      <p v-else>Loading...</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { allSeries } from "@/assets";
import { useCurrentSeason, usePlayoffCalculation } from "@/composables";
import { useGetDriverStandingsQuery, useGetLiveRaceInfoQuery } from "@/network";

const route = useRoute();
const seriesId = computed(() => Number(route.params.series));
const seriesInfo = computed(() => allSeries.find((s) => s.id === seriesId.value));

const query = useGetDriverStandingsQuery(seriesId.value);
const entries = computed(() => usePlayoffCalculation(query.entries.value ?? []));

const racesCompleted = computed(() => Math.max(...entries.value.map((entry) => entry.starts)));
const totalRaces = computed(() =>
  seriesInfo.value ? seriesInfo.value.regular_season_races + seriesInfo.value.playoff_races : 0,
);

const standingsYear = computed(() => {
  const currentYear = new Date().getFullYear();
  if (new Date().getMonth() < 2 && racesCompleted.value > 10) {
    return currentYear - 1;
  }
  return currentYear;
});

const currentSeason = useCurrentSeason();
const updateCurrentSeason = () => {
  currentSeason.series.value = seriesInfo.value ?? null;
  currentSeason.season.value = standingsYear.value;
  currentSeason.racesCompleted.value = racesCompleted.value;
};
updateCurrentSeason();
watch([seriesInfo, standingsYear, racesCompleted], updateCurrentSeason);

const liveRaceQuery = useGetLiveRaceInfoQuery();
const liveRaceInfo = computed(() => liveRaceQuery.liveRaceInfo.value);
const flagState = computed(() => {
  switch (liveRaceInfo.value?.flag_state ?? null) {
    case 1:
      return "green";
    case 2:
      return "yellow";
    case 3:
      return "red";
    case 5:
      return "warmup";
    case 8:
      return "pre-race";
    case 9:
      return "checkered";
    default:
      return "unknown";
  }
});
</script>
