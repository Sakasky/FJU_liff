import Home from "@/views/Home.vue";
import OrderView from "@/views/OrderView.vue";
import OrderViewV2 from "@/views/OrderViewV2.vue";
import FamilyBindView from "@/views/FamilyBindView.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/order", component: OrderView },
  { path: "/orderv2", component: OrderViewV2 },
  { path: "/family-bind", component: FamilyBindView },
];

export default { routes };
