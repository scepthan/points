<template>
  <v-img
    v-if="series"
    :src="`https://cf.nascar.com/data/images/carbadges/${series.id}/${number}.png`"
    :alt="`Car badge for #${number}`"
    width="40"
    height="40"
  />
</template>

<script setup lang="ts">
import { useCurrentSeason } from "@/composables";

defineProps<{
  number: string;
}>();

const { series } = useCurrentSeason();
</script>
