<template>
  <div id="app">
    <div id="header">
      <div id="schuman_link">
        <router-link to="/">
          <span class="material-icons">school</span>
          Schulmanager
        </router-link>
      </div>
    </div>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  components: {},
  data() {
    let token = localStorage.getItem("token");
    return {
      token: token
    };
  },
  mounted() {
    if (this.token === null && this.$route.path !== "/login") this.$router.push("/login");
  },
  beforeUpdate() {
    if (this.token === null && this.$route.path !== "/login") this.$router.push("/login");
  }
};
</script>

<style scoped>

#app {
  display: grid;
  grid-template-columns: 25% auto 30%;
  grid-template-rows: calc(100vh / 16) auto;
  min-height: 100vh;
  background: var(--color-background)
}

#header {
  padding-top: 10px;
  grid-column-start: 1;
  grid-column-end: 4;

  overflow-y: hidden;
  max-height: calc(100vh / 16);
}

#schuman_link {
  margin-top: 5px;
  text-align: center;
  font-weight: bold;
  font-size: 1.5em;
  font-family: sans-serif;
  display: block;
  text-decoration: none;
}

#schuman_link > span {
  position: relative;
  font-size: 1.25em;
  top: 5px;
}


#content {
  grid-column: 2;
  grid-row: 2;

  overflow-y: auto;
  max-height: calc(100vh * 15 / 16);
}

@media (orientation: portrait) {
  #app {
    grid-template-columns: auto;
  }

  #header {
    grid-column: 1;
  }

  #content {
    grid-column: 1;
  }
}
</style>
