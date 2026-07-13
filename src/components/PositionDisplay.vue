<template>
  {{ current }}
  <v-icon v-if="direction" :icon="'mdi-menu-' + direction" :color="color" size="28" />
</template>

<script setup lang="ts">
const props = defineProps<{
  current: number;
  previous: number;
}>();

const direction = computed(() =>
  props.current < props.previous ? "up" : props.current > props.previous ? "down" : null,
);
const color = computed(() => (direction.value === "up" ? "green" : "red"));
</script>
