import { createRouter, createWebHistory } from "vue-router";

import AboutView from "@/views/AboutView.vue";
import HomeView from "@/views/HomeView.vue";
import NascarView from "@/views/nascar/[series].vue";

const routes = [
  { path: "/", component: HomeView, name: "home" },
  { path: "/about", component: AboutView, name: "about" },
  { path: "/nascar/:series/:standings", component: NascarView, name: "nascar" },
];

const router = createRouter({
  history: createWebHistory("/points"),
  routes,
});

export default router;
