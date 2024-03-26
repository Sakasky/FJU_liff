import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/main.css'
import router from "./router/index";
import { createPinia } from "pinia";
// import VConsole from 'vconsole';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app");