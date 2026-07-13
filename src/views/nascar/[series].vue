<template>
  <v-container>
    <div class="my-2">
      <router-link :to="{ name: 'home' }">
        <v-icon>mdi-arrow-left</v-icon> Back to home
      </router-link>
    </div>

    <div v-if="seriesInfo && entries.length > 0">
      <h1 class="my-1">
        <span v-if="currentlyInRace && stagesComplete > 0">Unofficial </span>{{ standingsYear }}
        {{ seriesInfo.name }} Driver Standings
      </h1>

      <div class="my-1" v-if="currentlyInRace && liveRaceInfo">
        <p class="my-1">
          <!-- TODO: get correct stage count -->
          Points earned as of completion of stage {{ stagesComplete }}/3, race
          {{ racesCompleted + 1 }} of {{ totalRaces }}
        </p>
        <h5 class="my-1">
          Live: lap {{ liveRaceInfo.lap_number }}/{{ liveRaceInfo.laps_in_race }} (stage
          {{ liveRaceInfo.stage.stage_num }} lap
          {{
            liveRaceInfo.lap_number -
            (liveRaceInfo.stage.finish_at_lap - liveRaceInfo.stage.laps_in_stage)
          }}/{{ liveRaceInfo.stage.finish_at_lap - liveRaceInfo.stage.laps_in_stage }});
          {{ flagState }} at
          {{ liveRaceInfo.track_name }}
        </h5>
      </div>
      <p class="mt-n1" v-else>
        After race {{ racesCompleted }} of {{ totalRaces }} (<span
          v-if="racesCompleted < seriesInfo.regular_season_races"
          >{{ seriesInfo.regular_season_races - racesCompleted }} races until Chase</span
        ><span v-else>{{ totalRaces - racesCompleted }} Chase races remaining</span>)
      </p>
      <DriverStandingsTable
        :entries="entries"
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
const raceId = ref(liveRaceQuery.liveRaceInfo.value?.race_id ?? 0);
const currentlyInRace = computed(
  () =>
    liveRaceQuery.liveRaceInfo.value?.series_id === seriesId.value &&
    liveRaceQuery.liveRaceInfo.value.run_type === 3,
);
// Only propagate live info if it's for an active points race in this series
const liveRaceInfo = computed(() =>
  currentlyInRace.value ? liveRaceQuery.liveRaceInfo.value : undefined,
);

const flagState = computed(() => {
  switch (liveRaceInfo.value?.flag_state) {
    case 1:
      return "green flag";
    case 2:
      return "yellow flag";
    case 3:
      return "red flag";
    case 5:
      return "warmup";
    case 8:
      return "pre-race";
    case 9:
      return "checkered flag";
    default:
      return "unknown status";
  }
});
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
