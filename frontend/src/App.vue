<template>
  <div id="app">
    <div id="module-sel">
      <ModuleSelector v-if="$route.path !== '/login'" />
    </div>
    <div id="schuman_link">
      <router-link to="/">
        <span class="material-icons">school</span>
        Schulmanager
      </router-link>
    </div>
    <UserInfoLink />
    <div id="content">
      <router-view />
    </div>
    <ScheduleSidebar v-if="$route.path !=='/login'" id="sidebar" />
  </div>
</template>

<script>

import superagent from 'superagent';
import UserInfoLink from '@/components/UserInfoLink';
import ModuleSelector from '@/components/ModuleSelector';
import ScheduleSidebar from '@/components/ScheduleSidebar';

export default {
  name: 'App',
  components: { ScheduleSidebar, ModuleSelector, UserInfoLink },
  beforeMount() {
    this.$store.commit('setToken', localStorage.getItem('token'));

    if (this.$store.state.token === null) {
      if (this.$route.path !== '/login') this.$router.push('/login');
    } else if (this.$route.path === '/login') this.$router.push('/');

    document.title = `SchuMan: ${this.$route.name || this.$route.path}`;

    superagent
      .get('/api/session')
      .ok(_ => true)
      .auth(this.$store.state.token, { type: 'bearer' })
      .send()
      .then(res => {
        if (res.status !== 200) {
          localStorage.removeItem('token');
          this.$router.push('/login');
          return;
        }
        this.$store.commit('setUserInfo', res.body);

      });
  },
};
</script>

<style scoped>

#module-sel {
  background-color: var(--color-content-background);
  width: 100%;
  height: 100%;
}

#module-sel > select {
  margin-top: 2%;
  float: right;
}

#app {
  display: grid;
  grid-template-columns: 20% auto 30%;
  grid-template-rows: calc(100vh / 16) auto;
  height: 100vh;
  background: var(--color-background)
}

#schuman_link {
  text-align: center;
  font-weight: bold;
  font-size: 2.5vh !important;
  display: block;
  text-decoration: none;
  color: var(--color-text-accent-1)
}

#schuman_link > a > span {
  position: relative;
  font-size: 1.25em;
  top: 5px;
  color: var(--color-text-accent-1)
}

#schuman_link > * {
  color: var(--color-text-accent-1);
  font-size: 1em !important;
}


#content {
  grid-column: 2;
  grid-row: 2;
  overflow-y: auto;
  max-height: calc(100vh * 14 / 16);
  padding: 2%;
  margin: 0 1% 1%;
}

#sidebar {
  grid-column: 3;
  grid-row: 2;
  margin-left: 1%;
  margin-bottom: 1%;
  padding: 2%;
  max-height: 80vh;
  overflow-y: scroll;
}

@media (orientation: portrait) {
  #app {
    grid-template-columns: auto;
  }

  #content {
    grid-column: 1;
  }

  #sidebar {
    display: none;
  }
}
</style>
