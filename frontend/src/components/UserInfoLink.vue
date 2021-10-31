<template>
  <div>
    <div id="userinfo" @click="dropdown = !dropdown" v-if="$store.state.token !== null">
      {{ name }}
      <span id="userlogo" class="material-icons">person</span>
    </div>
    <div v-if="dropdown" id="dropdown-content">
      <router-link to="/userinfo">Profile</router-link>
      <br>
      <span style="cursor: pointer; color: var(--color-text-accent-1)" @click="logout">Log Out</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserInfoLink",
  methods: {
    logout() {
      localStorage.removeItem("token");
      document.location.reload();
    },
  },
  data() {
    return {
      dropdown: false,
    };
  },
  computed: {
    name() {
      return (this.$store.state.userinfo["firstname"] || "") + " " + (this.$store.state.userinfo["lastname"] || "");
    },
  },
  mounted() {
    this.$router.afterEach(() => {
      this.dropdown = false;
    });
  },
};
</script>

<style scoped>
#userinfo {
  display: flex;
  align-items: center;
  padding: 15px 20px 0;
  justify-content: right;
  font-size: .9em;
  cursor: pointer;
}

#dropdown-content {
  position: absolute;
  background-color: #1a1d23;
  border-radius: 20px;
  padding: 10px 10px 10px 15px;
  transform: translateX(30vw) translateX(-135px) translateY(10px);

}

#dropdown-content > * {
  background-color: #1a1d23;
}
</style>