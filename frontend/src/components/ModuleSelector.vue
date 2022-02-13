<template>
  <select @change="select($event)">
    <option value="default">Select Module</option>
    <option value="/">Start Page</option>
    <option value="/schedule">Schedule</option>
    <option value="/chat">Chat</option>
  </select>
</template>

<script>
export default {
  name: 'ModuleSelector',
  methods: {
    select(a) {
      const path = a.target.selectedOptions[0].attributes['value'].nodeValue;
      if (path && path !== 'default') this.$router.push(path);
      a.target.value = 'default';
    },
  },
};
</script>

<style scoped>

</style>