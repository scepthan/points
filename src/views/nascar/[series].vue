<template>
  <v-container>
    <div class="my-2">
      <router-link :to="{ name: 'home' }">
        <v-icon>mdi-arrow-left</v-icon> Back to home
      </router-link>
    </div>

    <div v-if="entries.length > 0">
      <DriverStandingsTable :series="series" :entries="entries" />
    </div>
    <div v-else>
      <p v-if="query.isError.value">Error loading points standings for series ID {{ series }}.</p>
      <p v-else>Loading...</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useGetDriverStandingsQuery } from "@/network/queries";
import { RouterLink } from "vue-router";

const route = useRoute();
const series = computed(() => Number(route.params.series));
const query = useGetDriverStandingsQuery(series.value);
const entries = computed(() => query.entries.value ?? []);
</script>
