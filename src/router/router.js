
const routes = [
  {
    path: "/",
    component: () => import("/src/views/Home.vue")
  },
  {
    path: "/order",
    component: () => import("/src/views/OrderView.vue")
  },
  {
    path: "/orderv2",
    component: () => import("/src/views/OrderViewV2.vue")
  },


];

export default { routes };
