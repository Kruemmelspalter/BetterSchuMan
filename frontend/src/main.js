import Vue from "vue";
import App from "./App.vue";
import IndexView from "@/components/views/IndexView";
import VueRouter from "vue-router";
import LoginView from "@/components/views/LoginView";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", component: IndexView },
    { path: "/login", component: LoginView }
  ],
});

new Vue({
  router: router,
  render: h => h(App),
}).$mount("#app");
