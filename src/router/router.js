import Home from "@/views/Home.vue";
import OrderView from "@/views/OrderView.vue";
import OrderViewV2 from "@/views/OrderViewV2.vue";

const routes = [
  { path: "/", component: Home, meta: { title: "聖路加門診 基本資料填寫" } },
  { path: "/order", component: OrderView, meta: { title: "聖路加門診 線上預約" } },
  { path: "/orderv2", component: OrderViewV2, meta: { title: "聖路加門診 線上預約" } },
];

export default { routes };
