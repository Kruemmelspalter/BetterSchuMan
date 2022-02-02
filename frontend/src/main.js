import Vue from 'vue';
import App from './App.vue';
import IndexView from '@/components/views/IndexView';
import VueRouter from 'vue-router';
import LoginView from '@/components/views/LoginView';
import UserInfoView from '@/components/views/UserInfoView';
import Vuex from 'vuex';
import ScheduleView from '@/components/views/ScheduleView';
import ChatView from '@/components/views/ChatView';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  routes: [
    { path: '/', component: IndexView, name: 'Dashboard' },
    { path: '/login', component: LoginView, name: 'Login' },
    { path: '/userinfo', component: UserInfoView, name: 'Profile' },
    { path: '/schedule', component: ScheduleView, name: 'Schedule' },
    { path: '/chat', component: ChatView, name: 'Chat' },
    { path: '/chat/:id', component: ChatView, name: 'Chat' }
  ],
});
router.afterEach(() => {
  document.title = `SchuMan: ${
    router.currentRoute.name || router.currentRoute.path
  }`;
});
const store = new Vuex.Store({
  state() {
    return {
      token: null,
      userinfo: {},
      lessons: [],
      hours: [],
      threads: [],
      threadMessages: {},
    };
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUserInfo(state, userinfo) {
      state.userinfo = userinfo;
    },
    addLessonInfo(state, lessonInfo) {
      state.lessons = [...state.lessons, ...lessonInfo];
    },
    setHoursData(state, hoursData) {
      state.hours = hoursData;
    },
    setThreadsData(state, threads) {
      state.threads = threads;
    },
    addThreadMessageData(state, [threadId, messages]) {
      if (!state.threadMessages[threadId]) Vue.set(state.threadMessages, threadId, messages);

    },

  },
});
new Vue({
  router: router,
  store: store,
  render: (h) => h(App),
}).$mount('#app');
