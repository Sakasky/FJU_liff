
const routes = [
  {
    path: '/FJU_liff/',
    component: () => import("/src/views/Home.vue")
  },
  {
    path: "/FJU_liff/order",
    component: () => import("/src/views/OrderView.vue")
  },


];

export default { routes };
