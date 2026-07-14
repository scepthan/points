<template>
  <span v-if="points === 0">&ndash;</span>
  <span v-else style="white-space: nowrap">
    {{ current }}
    <v-icon v-if="direction" :icon="icon" :color="color" size="28" class="mr-n4" />
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  current: number;
  previous: number;
  points: number;
}>();

const direction = computed(() =>
  props.current < props.previous ? "up" : props.current > props.previous ? "down" : null,
);
const icon = computed(() => "mdi-menu-" + direction.value);
const color = computed(() => (direction.value === "up" ? "green" : "red"));
</script>
