<template>
  <div id="container">
    <div id="search">
      <input id="searchbox" maxlength="20" type="text" v-model="searchTerms" />
    </div>
    <div id="threads">
      <router-link v-for="t in threads" :key="t.id" :to="`/chat/${t.id}`">
        <thread-preview :thread-id="t.id" />
      </router-link>
    </div>
    <div v-if="$route.params.id" id="chatTitle">
      {{ threadTitle }}
    </div>
    <ChatComponent v-if="$route.params.id" id="currentThread" :thread-id="+$route.params.id" />
  </div>
</template>

<script>
import superagent from 'superagent';
import ThreadPreview from '@/components/chat/ThreadPreview';
import { DateTime } from 'luxon';
import ChatComponent from '@/components/chat/ChatComponent';

export default {
  name: 'ChatView',
  components: { ChatComponent, ThreadPreview },
  data() {
    return {
      searchTerms: '',
    };
  },
  computed: {
    threads() {
      return this.$store.state.threads.slice().sort((x, y) => {
        return Math.sign(DateTime.fromISO(y.lastMessage) - DateTime.fromISO(x.lastMessage));
      }).filter(x => x.subject.toLowerCase().includes(this.searchTerms.toLowerCase()) ||
        x.sender.toLowerCase().includes(this.searchTerms.toLowerCase()) ||
        x.recipients.toLowerCase().includes(this.searchTerms.toLowerCase())
      );
    },
    threadTitle() {
      const threads = this.threads.filter(x => x.id === +this.$route.params.id);
      return threads.length === 1 ? threads[0].subject : null;
    },
  },

  mounted() {
    if (this.$store.state.threads.length === 0) {
      superagent
        .get('/api/chat')
        .ok(_ => true)
        .auth(this.$store.state.token, { type: 'bearer' })
        .send()
        .then(res => {
          if (res.status !== 200) {
            localStorage.removeItem('token');
            this.$router.push('/login');
            return;
          }
          this.$store.commit('setThreadsData', res.body);
        });
    }
  },
};
</script>

<style scoped>
#container {
  display: grid;

  grid-template-columns: [sidebar-start] 40% [sidebar-end content-start] auto [content-end];
  grid-template-rows: [search-start] 10% [search-end content-start] auto [content-end];
  min-height: 75vh;
  margin: 5%;
  width: 90%;
}

#search {
  max-height: 100%;
  padding: 0 5% 5%;
}

#searchbox {
  max-width: 100%;
}

#threads {
  grid-column: sidebar-start;
  grid-row: content-start;
  overflow-x: scroll;
  max-height: 75vh;
}

#currentThread {
  grid-column: content-start;
  grid-row: content-start;
  max-height: 72vh;
}
</style>