<template>
  <div ref="messageContainer" class="messages">
    <message-component v-for="m in messages" :key="m.id" :message="m" />
  </div>
</template>

<script>
import superagent from 'superagent';
import MessageComponent from '@/components/chat/MessageComponent';
import { DateTime } from 'luxon';

export default {
  name: 'ChatComponent',
  components: { MessageComponent },
  computed: {
    messages() {
      const threadMessages = this.$store.state.threadMessages[this.threadId];
      if (!threadMessages || threadMessages.length === 0) return [];

      return threadMessages.slice().sort((x, y) => Math.sign(DateTime.fromISO(x.sentTimestamp) - DateTime.fromISO(y.sentTimestamp)));

    },
  },
  props: {
    'threadId': {
      type: Number,
    },
  },
  watch: {
    threadId: {
      immediate: true,
      deep: true,
      handler() {
        this.loadMessageData();
        setTimeout(_ => this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight, 500);
      },
    },
  },
  mounted() {
    this.loadMessageData();
  },
  methods: {

    loadMessageData() {
      if (!this.$store.state.threadMessages[this.threadId]) {
        superagent
          .get(`/api/chat/${this.threadId}`)
          .ok(_ => true)
          .auth(this.$store.state.token, { type: 'bearer' })
          .send()
          .then(res => {
            if (res.status !== 200) {
              localStorage.removeItem('token');
              this.$router.push('/login');
              return;
            }
            this.$store.commit('addThreadMessageData', [this.threadId, res.body]);
          });
      }
    },
  },
};
</script>

<style scoped>
.messages {
  padding: 10px;
  overflow: scroll;
  max-height: 60vh;
}
</style>