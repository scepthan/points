<template>
  <v-container>
    <div class="my-2 d-flex justify-space-between">
      <router-link :to="{ name: 'home' }">
        <v-icon class="mb-1">mdi-arrow-left</v-icon> Back to home
      </router-link>
      <router-link :to="{ name: 'about' }">
        <v-icon class="mb-1">mdi-information-outline</v-icon> How does this work?
      </router-link>
    </div>

    <div class="d-flex justify-center">
      <v-tabs v-if="currentlyInRace" v-model="selectedTab">
        <v-tab>Current</v-tab>
        <v-tab>Projected</v-tab>
      </v-tabs>
    </div>

    <div v-if="seriesInfo && entries.length > 0">
      <h1 class="my-1">
        <span v-if="currentlyInRace && selectedTab === 1">Projected </span
        ><span v-else-if="currentlyInRace && stagesComplete > 0">Unofficial </span
        >{{ standingsYear }} {{ seriesInfo.name }} Driver Standings
      </h1>

      <div class="my-1" v-if="currentlyInRace && liveRaceInfo">
        <p class="my-1">
          <!-- TODO: get correct stage count -->
          <span v-if="selectedTab === 1"
            >Based on running order at lap {{ liveRaceInfo.lap_number }}/{{
              liveRaceInfo.laps_in_race
            }}</span
          ><span v-else>Points earned as of completion of stage {{ stagesComplete }}/3</span>, race
          {{ racesCompleted + 1 }} of {{ totalRaces }}
        </p>
        <LiveRaceInfoDisplay :info="liveRaceInfo" />
      </div>
      <p class="mt-n1" v-else>
        After race {{ racesCompleted }} of {{ totalRaces }} (<span
          v-if="racesCompleted < seriesInfo.regular_season_races"
          >{{ seriesInfo.regular_season_races - racesCompleted }} races until Chase</span
        ><span v-else>{{ totalRaces - racesCompleted }} Chase races remaining</span>)
      </p>
      <DriverStandingsTable
        :entries="entries"
        :projection="selectedTab === 1"
        :live-race-info="liveRaceInfo"
        :live-stage-points="liveStagePoints"
      />
    </div>
    <div v-else>
      <p v-if="query.isError.value">Error loading points standings for series ID {{ seriesId }}.</p>
      <p v-else>Loading...</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { allSeries } from "@/assets";
import { useCurrentSeason } from "@/composables";
import {
  useGetDriverStandingsQuery,
  useGetLiveRaceInfoQuery,
  useGetLiveStagePointsInfoQuery,
} from "@/network";

const route = useRoute();
const seriesId = computed(() => Number(route.params.series));
const seriesInfo = computed(() => allSeries.find((s) => s.id === seriesId.value));

const selectedTab = ref(Number(route.query.projected ?? 0));

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

const currentSeason = useCurrentSeason();
const updateCurrentSeason = () => {
  currentSeason.series.value = seriesInfo.value ?? null;
  currentSeason.season.value = standingsYear.value;
  currentSeason.racesCompleted.value = racesCompleted.value;
};
updateCurrentSeason();
watch([seriesInfo, standingsYear, racesCompleted], updateCurrentSeason);

const liveRaceQuery = useGetLiveRaceInfoQuery();
const currentlyInRace = computed(
  () =>
    liveRaceQuery.liveRaceInfo.value?.series_id === seriesId.value &&
    liveRaceQuery.liveRaceInfo.value.run_type === 3 &&
    liveRaceQuery.liveRaceInfo.value.flag_state !== 9,
);
// Only propagate live info if it's for an active points race in this series
const liveRaceInfo = computed(() =>
  currentlyInRace.value ? liveRaceQuery.liveRaceInfo.value : undefined,
);
const raceId = ref(liveRaceInfo.value?.race_id ?? 0);

watch(liveRaceInfo, (newVal) => {
  if (newVal) {
    raceId.value = newVal.race_id;
  }
});
watch(raceId, (newVal) => {
  if (newVal > 0) {
    liveStagePointsQuery.refetch();
  }
});

const liveStagePointsQuery = useGetLiveStagePointsInfoQuery(
  standingsYear.value,
  seriesId.value,
  raceId,
);
const liveStagePoints = computed(() => liveStagePointsQuery.liveStagePointsInfo.value);
const stagesComplete = computed(() => liveStagePoints.value?.length ?? 0);
</script>
