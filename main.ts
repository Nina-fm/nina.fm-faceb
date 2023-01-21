import App from "./app.vue";
import ElementPlus from "element-plus";
import { createApp } from "vue";

const app = createApp(App);

app.use(ElementPlus);
app.mount("#app");
