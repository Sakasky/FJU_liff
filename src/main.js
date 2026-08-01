import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/main.css'
import router from "./router/index";
import { createPinia } from "pinia";
// vConsole 只在測試環境啟用（dev server 或測試網域），正式 build 部署到生產不會出現
import VConsole from 'vconsole';
if (import.meta.env.DEV || location.hostname === 'fjuliff.billxu.net') {
    new VConsole();
}

const app = createApp(App);
const pinia = createPinia();


app.use(pinia);
app.use(router);

app.mount("#app");