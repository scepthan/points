<template>
  <v-container>
    <router-link :to="{ name: 'home' }"> <v-icon>mdi-arrow-left</v-icon> Back to home </router-link>
    <div v-if="entries.length > 0">
      <v-row v-for="(entry, i) in entries" :key="entry.driver_id">
        <v-col>
          <h2>{{ i + 1 }}. {{ entry.driver_name }}</h2>
          <p>Points: {{ entry.points }}</p>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <p v-if="query.isError.value">
            Error loading points standings for series ID {{ route.params.series }}.
          </p>
          <p v-else>Loading...</p>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useGetPointsStandingsQuery } from "@/network/queries";
import { RouterLink } from "vue-router";

const route = useRoute();
const query = useGetPointsStandingsQuery(Number(route.params.series));
const entries = computed(() => query.entries.value ?? []);
</script>
