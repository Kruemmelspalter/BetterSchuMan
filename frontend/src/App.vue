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
    <router-view id="content" />
    <SidebarComponent id="sidebar" />
  </div>
</template>

<script>

import SidebarComponent from "@/components/SidebarComponent";

export default {
  name: "App",
  components: { SidebarComponent },
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
  max-height: 100vh;
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

  #sidebar {
    display: none;
  }
}
</style>
