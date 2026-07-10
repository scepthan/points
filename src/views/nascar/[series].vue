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
      <DriverStandingsTable :series="seriesInfo" :entries="entries" :season="standingsYear" />
    </div>
    <div v-else>
      <p v-if="query.isError.value">Error loading points standings for series ID {{ seriesId }}.</p>
      <p v-else>Loading...</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { allSeries } from "@/assets";
import { useGetDriverStandingsQuery } from "@/network/queries";

const route = useRoute();
const seriesId = computed(() => Number(route.params.series));
const seriesInfo = computed(() => allSeries.find((s) => s.id === seriesId.value));

const query = useGetDriverStandingsQuery(seriesId.value);
const entries = computed(() => query.entries.value ?? []);

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
</script>
