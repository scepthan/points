import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import NascarView from "@/views/nascar/[series].vue";

const routes = [
  { path: "/", component: HomeView, name: "home" },
  { path: "/nascar/:series", component: NascarView, name: "nascar" },
];

const router = createRouter({
  history: createWebHistory("/points"),
  routes,
});

export default router;
