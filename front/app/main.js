import { router } from "./route"
import { createApp } from "vue"
import App from "./app.vue"
import './index.css';

const app = createApp(App);
app.use(router);
app.mount('#app');