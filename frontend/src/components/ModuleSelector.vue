<template>
  <select @click="select($event)">
    <option value="default">Select Module</option>
    <option value="/">Start Page</option>
    <option value="/schedule">Schedule</option>
  </select>
</template>

<script>
export default {
  name: 'ModuleSelector',
  methods: {
    select(a) {
      const path = a.target.attributes.value.nodeValue;
      if (path && path !== 'default') {
        this.$router.push(path);
      }
      a.target.parentElement.value = 'default';
    },
  },
};
</script>

<style scoped>

</style>