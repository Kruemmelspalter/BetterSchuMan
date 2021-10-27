import Vue from "vue";
import App from "./App.vue";
import IndexView from "@/components/views/IndexView";
import VueRouter from "vue-router";
import LoginView from "@/components/views/LoginView";
import UserInfoView from "@/components/views/UserInfoView";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", component: IndexView, name: "Dashboard" },
    { path: "/login", component: LoginView, name: "Login" },
    { path: "/userinfo", component: UserInfoView, name: "Profile" }
  ],
});

new Vue({
  router: router,
  render: (h) => h(App),
}).$mount("#app");
