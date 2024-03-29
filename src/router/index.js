import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import routerMap from "./router.js";

const base = "/";

const router = createRouter({
  history: createWebHistory(base),
  routes: routerMap.routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});
router.beforeEach((to, from, next) => {
  next();
});

export default router;
