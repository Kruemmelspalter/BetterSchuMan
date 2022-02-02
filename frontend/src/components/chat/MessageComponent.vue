<template>
  <div class="message">
    {{ message.sender.firstname }} {{ message.sender.lastname }}
    <span class="material-icons subtext">navigate_next</span>
    {{ message.text }}
  </div>
</template>

<script>
export default {
  name: 'MessageComponent',
  props: {
    message: {
      type: Object,
    },
  },
};
</script>

<style scoped>
.message {
  font-size: 0.5em;
  white-space: pre-wrap;

}
</style>