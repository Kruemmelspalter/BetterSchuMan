import Vue from "vue";
import App from "./App.vue";
import IndexView from "@/components/views/IndexView";
import VueRouter from "vue-router";
import LoginView from "@/components/views/LoginView";
import UserInfoView from "@/components/views/UserInfoView";
import Vuex from "vuex";
import ScheduleView from "@/components/views/ScheduleView";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  routes: [
    { path: "/", component: IndexView, name: "Dashboard" },
    { path: "/login", component: LoginView, name: "Login" },
    { path: "/userinfo", component: UserInfoView, name: "Profile" },
    { path: "/schedule", component: ScheduleView, name: "Schedule" }
  ],
});
router.afterEach(() => {
  document.title = `SchuMan: ${
    router.currentRoute.name || router.currentRoute.path
  }`;
});
new Vue({
  router: router,
  store: new Vuex.Store({
    state() {
      return {
        token: null,
        userinfo: {},
      };
    },
    mutations: {
      setToken(state, token) {
        state.token = token;
      },
      setUserInfo(state, userinfo) {
        state.userinfo = userinfo;
      },
    },
  }),
  render: (h) => h(App),
}).$mount("#app");
