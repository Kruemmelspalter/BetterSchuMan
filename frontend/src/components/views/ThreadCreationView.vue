<template>
  <div>
    <span style="cursor:pointer;" @click="$router.back()"><span class="material-icons">arrow_back</span> back</span>
    <div id="container">
      <div>
        <select id="recipient" v-model="recipientId">
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} ({{ u.subtext }})</option>
        </select>
        <br />
        <label for="title">Subject:</label> <input id="title" v-model="threadTitle"/>
        <br />
        <label for="content">Message:</label>
        <textarea id="content" v-model="messageContent" cols="50" rows="6" />
        <br />
        Attachments:
        <button @click="clickAttachButton"><span class="material-icons">add</span> Add Attachment</button>
        <br />
        <span v-for="f in files" :key="f.name">
          <span class="material-icons">description</span>
          {{ f.name }}
        </span>
        <input
          ref="fileInput"
          accept="image/*"
          multiple
          style="display: none"
          type="file"
          @change="onFilePicked($event)" />
        <br />
        <button :style="threadTitle.length === 0 || recipientId === -1 ? 'cursor: not-allowed' : ''"
                @click="createThread">
          Create Thread
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import superagent from 'superagent';

export default {
  name: 'ThreadCreationView',
  computed: {
    users() {
      return this.$store.state.chatUsers;
    },
  },
  data() {
    return {
      threadTitle: '',
      messageContent: '',
      files: [],
      recipientId: -1,
    };
  },
  methods: {
    loadChatUsers() {
      superagent
        .get('/api/chat/users')
        .ok(_ => true)
        .auth(this.$store.state.token, { type: 'bearer' })
        .send()
        .then(res => {
          if (res.status !== 200) {
            localStorage.removeItem('token');
            this.$router.push('/login');
            return;
          }
          this.$store.commit('setChatUsersData', res.body);
        });
    },
    clickAttachButton() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files.item(i));
      }
    },
    createThread() {
      if (this.threadTitle.length === 0 || this.recipientId === -1) return;

      superagent
        .post('/api/chat/')
        .ok(_ => true)
        .auth(this.$store.state.token, { type: 'bearer' })
        .field('recipientId', this.recipientId)
        .field('threadName', this.threadTitle)
        .field('text', this.messageContent)
        .field('files', this.files)
        .then(res => {
          this.$router.push(`/chat/${res.body}`);
        });
    },
  },
  mounted() {
    this.loadChatUsers();
  },
};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-size: 18px;
}

#container > div > * {
  font-size: 18px;
  margin: 5px
}
</style>