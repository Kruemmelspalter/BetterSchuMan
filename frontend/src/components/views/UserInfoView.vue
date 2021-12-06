<template>
  <div>
    <h3>User Info</h3>
    First Name: {{$store.state.userinfo['firstname']}}<br/>
    Last Name: {{$store.state.userinfo['lastname']}}<br/>
    Email Address: {{$store.state.userinfo['email']}}
  </div>
</template>

<script>
export default {
  name: 'UserInfoView',
};
</script>

<style scoped>

</style>
