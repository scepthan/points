<template>
  <v-img
    :src="`https://cf.nascar.com/data/images/carbadges/${series}/${number}.png`"
    :alt="`Car badge for #${number}`"
    width="40"
    height="40"
  />
</template>

<script setup lang="ts">
defineProps<{
  series: number;
  number: string;
}>();
</script>
