<template>
  <v-container>
    <div class="my-2">
      <router-link :to="{ name: 'home' }">
        <v-icon>mdi-arrow-left</v-icon> Back to home
      </router-link>
    </div>
    <div v-if="entries.length > 0">
      <v-data-table
        :items="entries"
        :headers="[
          { title: 'Pos', value: 'position' },
          { title: 'Driver', value: 'driver_name' },
          { title: 'Num', value: 'car_no' },
          { title: 'Mfr', value: 'manufacturer' },
          { title: 'Points', value: 'points' },
          { title: 'Behind', value: 'delta_leader' },
        ]"
        :items-per-page="-1"
        hide-default-footer
      >
        <template v-slot:item.car_no="{ item }">
          <v-img
            :src="`https://cf.nascar.com/data/images/carbadges/${series}/${item.car_no}.png`"
            :alt="`Car badge for #${item.car_no}`"
            width="40"
            height="40"
          />
        </template>
      </v-data-table>
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <p v-if="query.isError.value">
            Error loading points standings for series ID {{ series }}.
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
const series = computed(() => Number(route.params.series));
const query = useGetPointsStandingsQuery(series.value);
const entries = computed(() => query.entries.value ?? []);
</script>
