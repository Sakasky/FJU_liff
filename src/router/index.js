import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import routerMap from "./router.js";

const router = createRouter({
  history: createWebHistory(),
  routes: routerMap.routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});
router.beforeEach((to, from, next) => {
  console.log('[Router] 導航:', from.path, '→', to.path);
  next();
});

router.afterEach((to, from) => {
  console.log('[Router] 導航完成:', to.path);
});

router.onError((error, to) => {
  console.error('[Router] 導航錯誤:', error);
  // chunk 載入失敗時，重新載入目標頁面
  if (error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed')) {
    window.location.href = to.fullPath;
  }
});

export default router;
