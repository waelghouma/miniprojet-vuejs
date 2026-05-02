import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

// Point d'entree de l'application Vue
createApp(App).use(router).mount("#app");
