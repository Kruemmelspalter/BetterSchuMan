<template>
  <div id="container">
    <div id="content">
      <form @submit.prevent="login">
        <span v-show="invalidCreds" class="error">Invalid Credentials<br /></span>
        <span v-show="loginError" class="error">An error occured<br /></span>
        <label for="user">Username: </label>
        <input id="user" v-model="username" type="text" />
        <br />
        <label for="pass">Password: </label>
        <input id="pass" v-model="password" type="password" />
        <br />
        <input type="submit" />
      </form>
    </div>
  </div>
</template>

<script>
import superagent from "superagent";

export default {
  name: "LoginView",
  data() {
    let token = localStorage.getItem("token");
    return {
      token: token,
      username: "",
      password: "",
      invalidCreds: false,
      loginError: false,
    };
  },
  mounted() {
    if (this.token === null) {
      if (this.$route.path !== "/login") this.$router.push("/login");
    } else if (this.$route.path === "/login") this.$router.push("/");
  },
  methods: {
    async login() {
      let res = await superagent
        .post("/api/session")
        .ok(_ => true)
        .send({ username: this.username, password: this.password });
      if (res.status === 401) {
        this.invalidCreds = true;
        return;
      } else if (res.status !== 200) {
        this.loginError = true;
        return;
      }
      const token = res.header["x-new-bearer-token"];
      if (token === undefined || token === null || token === "") {
        this.loginError = true;
        return;
      }
      localStorage.setItem("token", token);
      await this.$router.push("/");
    },
  },
};
</script>

<style scoped>
#container {
  height: calc(100vh * 14 / 16) !important;
  display: flex;
}

#content {
  text-align: center;
  background-color: red !important;
  margin: 20% auto auto;
  font-size: 0.75em;
}

.error {
  color: var(--color-text-accent-2);
}
</style>