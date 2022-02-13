<template>
  <div class="message">
    {{ message.sender.firstname }} {{ message.sender.lastname }}
    <span class="material-icons subtext">navigate_next</span>
    <span class="message" v-html="formattedMessage" />
    <div v-if="message.attachments.length !== 0">
      <a v-for="a in message.attachments" :key="a.url" :href="a.url" download>
        <span class="material-icons">description</span>
        {{ a.filename }}<br />
      </a>
    </div>
  </div>
</template>

<script>
import linkifyStr from 'linkifyjs/lib/linkify-string';

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
      message = linkifyStr(message, { target: '_blank' });
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