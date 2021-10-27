<template>
  <div id="userinfo">
    <router-link id="userlink" to="/userinfo">
      <span id="userlogo" class="material-icons">person</span>
      {{ name }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: "UserInfoLink",
  props: {
    name: String,
  },
};
</script>

<style scoped>
#userinfo {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

#userlink {
  font-size: .9em;
}
</style>