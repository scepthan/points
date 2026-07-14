<template>
  <v-container>
    <h2>Points standings and Chase clinch calculations</h2>
    <v-list>
      <v-list-item v-for="series in allSeries">
        {{ series.name }}:
        <RouterLink :to="{ name: 'nascar', params: { series: series.id, standings: 'drivers' } }">
          Drivers</RouterLink
        >
        /
        <RouterLink :to="{ name: 'nascar', params: { series: series.id, standings: 'owners' } }"
          >Owners</RouterLink
        >
      </v-list-item>
    </v-list>
    <p>
      <router-link :to="{ name: 'about' }">
        <v-icon class="mb-1">mdi-information-outline</v-icon> How does this work?
      </router-link>
    </p>
  </v-container>
</template>

<script setup lang="ts">
import { allSeries } from "@/assets";
import { useLastPage } from "@/composables";

const { lastPage } = useLastPage();
lastPage.value = "home";
</script>
