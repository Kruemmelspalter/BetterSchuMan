<template>
  <div class="container">
    <div ref="messageContainer" class="messages">
      <message-component v-for="m in messages" :key="m.id" :message="m" />
    </div>
    <div>
      <textarea id="textinput" ref="textinput" v-model="messageText"
                :rows="messageText.length === 0 ? 1 : 6 " cols="35"></textarea>
      <span id="btn_upload" class="material-icons" @click="clickAttachButton">attach_file</span>
      <span id="btn_send" class="material-icons" @click="sendMessage">send</span>
    </div>
    <div>
      <span v-for="f in files" id="filePreviews" :key="f.name">
        <span class="material-icons">description</span>
        {{ f.name }}
      </span>
    </div>
    <input
      ref="fileInput"
      accept="image/*"
      multiple
      style="display: none"
      type="file"
      @change="onFilePicked($event)" />
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
  data() {
    return {
      messageText: '',
      files: [],
    };
  },
  watch: {
    threadId: {
      immediate: true,
      deep: true,
      handler() {
        this.loadMessageData();
        setTimeout(_ => this.scrollDownInChat(), 500);
      },
    },
  },
  mounted() {
    this.loadMessageData();
  },
  methods: {
    sendMessage() {
      const msgText = this.messageText;
      this.messageText = '';

      const files = this.files;
      this.files = [];

      if (msgText.length === 0 && files.length === 0) return;

      superagent
        .post(`/api/chat/${this.threadId}`)
        .ok(_ => true)
        .auth(this.$store.state.token, { type: 'bearer' })
        .field('text', msgText)
        .field('files', files)
        .then(_ => {
          this.loadMessageData();
          this.scrollDownInChat();
        });
    },
    loadMessageData() {
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
          this.$store.commit('setThreadMessageData', [this.threadId, res.body]);
        });
    },
    scrollDownInChat() {
      this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
    },
    clickAttachButton() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files.item(i));
      }
      event.target.value = '';
    },
  },
};
</script>

<style scoped>
.messages {
  overflow: scroll;
  flex-basis: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-height: 60vh;
}

#btn_send {
  margin: 0 0 0 5px;
  user-select: none;
  cursor: pointer;
}

#textinput {
  font-size: 16px;
}

#filePreviews {
  font-size: 18px;
}
</style>