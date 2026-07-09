<template>
  <v-container>
    <h2>Points standings</h2>
    <v-list>
      <v-list-item>
        <RouterLink :to="{ name: 'nascar', params: { series: 1 } }"> NASCAR Cup Series </RouterLink>
      </v-list-item>
      <v-list-item>
        <RouterLink :to="{ name: 'nascar', params: { series: 2 } }">
          NASCAR O'Reilly Auto Parts Series
        </RouterLink>
      </v-list-item>
      <v-list-item>
        <RouterLink :to="{ name: 'nascar', params: { series: 3 } }">
          NASCAR Craftsman Truck Series
        </RouterLink>
      </v-list-item>
    </v-list>
  </v-container>
</template>
