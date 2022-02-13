import Vue from 'vue';
import App from './App.vue';
import IndexView from '@/components/views/IndexView';
import VueRouter from 'vue-router';
import LoginView from '@/components/views/LoginView';
import UserInfoView from '@/components/views/UserInfoView';
import Vuex from 'vuex';
import ScheduleView from '@/components/views/ScheduleView';
import ChatView from '@/components/views/ChatView';
import ThreadCreationView from '@/components/views/ThreadCreationView';

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
    { path: '/chat/new', component: ThreadCreationView, name: 'New Thread' },
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
      lessons: {},
      hours: [],
      threads: [],
      threadMessages: {},
      chatUsers: [],
    };
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUserInfo(state, userinfo) {
      state.userinfo = userinfo;
    },
    addLessons(state, [day, lessons]) {
      Vue.set(state.lessons, day, lessons);
    },
    setHoursData(state, hoursData) {
      state.hours = hoursData;
    },
    setThreadsData(state, threads) {
      state.threads = threads;
    },
    setThreadMessageData(state, [threadId, messages]) {
      Vue.set(state.threadMessages, threadId, messages);
    },
    setChatUsersData(state, users) {
      state.chatUsers = users;
    },

  },
});
new Vue({
  router: router,
  store: store,
  render: (h) => h(App),
}).$mount('#app');
