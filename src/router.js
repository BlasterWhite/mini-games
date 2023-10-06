import { createRouter, createWebHistory } from "vue-router";

import MinesWeeperView from "./views/MinesWeeperView.vue";

const routes = [
  {
    path: "/",
    name: "MinesWeeperView",
    component: MinesWeeperView,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
