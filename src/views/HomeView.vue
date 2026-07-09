<template>
  <v-container v-if="entries.length > 0">
    <v-row v-for="(entry, i) in entries" :key="entry.driver_id">
      <v-col>
        <h2>{{ i + 1 }}. {{ entry.driver_name }}</h2>
        <p>Points: {{ entry.points }}</p>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col>
        <p>Loading...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useGetPointsStandingsQuery } from "@/network/queries";

const query = useGetPointsStandingsQuery(1);
const entries = computed(() => query.entries.value ?? []);
</script>
