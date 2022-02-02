<template>
  <div class="container">
    <span class="subject">{{ thread.subject }}</span>
    <br />
    <span class="subtext">
      {{ thread.sender }}
      <span class="material-icons subtext">navigate_next</span>
      {{ thread.recipients }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ThreadPreview',
  props: {
    threadId: {
      type: Number,
    },
  },
  computed: {
    thread() {
      const threads = this.$store.state.threads.filter(x => x.id === this.threadId);
      return threads.length === 1 ? threads[0] : null;
    },
  },
};
</script>

<style scoped>
.subject {
  font-size: 16px;
}

.subtext {
  font-size: 10px;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  display: inline-block;
}

.material-icons.subtext {
  font-size: 1em;
}

.container {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  flex-direction: column;
}
</style>