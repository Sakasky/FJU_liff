
const routes = [
  {
    path: "/",
    component: () => import("/src/views/Home.vue")
  },
  {
    path: "/order",
    component: () => import("/src/views/OrderView.vue")
  },


];

export default { routes };
