<template>
  <div class="message">
    {{ message.sender.firstname }} {{ message.sender.lastname }}
    <span class="material-icons subtext">navigate_next</span>
    <span class="message" v-html="formattedMessage"/>
  </div>
</template>

<script>
import linkifyHtml from 'linkifyjs/lib/linkify-html';

export default {
  name: 'MessageComponent',
  props: {
    message: {
      type: Object,
    },
  },
  computed: {
    formattedMessage() {
      let message = this.message.text;
      message = new Option(message).innerHTML;
      message = linkifyHtml(message);
      message = message.replaceAll(/\*(\w+)\*/g, '<b>$1</b>');
      return message;
    },
  },
};
</script>

<style scoped>
.message {
  font-size: 15px;
  white-space: pre-wrap;

}
</style>