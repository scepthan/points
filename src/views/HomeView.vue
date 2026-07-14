<template>
  <v-container>
    <h2>Points standings and Chase clinch calculations</h2>
    <v-list>
      <v-list-item v-for="series in allSeries">
        <RouterLink :to="{ name: 'nascar', params: { series: series.id, standings: 'drivers' } }">
          {{ series.name }}
        </RouterLink>
        (<RouterLink :to="{ name: 'nascar', params: { series: series.id, standings: 'owners' } }"
          >owners</RouterLink
        >)
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { allSeries } from "@/assets";
</script>
