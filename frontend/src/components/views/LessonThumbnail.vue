<template>
  <div :class="(lesson.cancelled?'cancelled':'')+''+(lesson.substitute?'substitute':'')" class="container" v-if="!lesson.event">
    <span :title="lesson.subject.name" class="name">
      {{ lesson.subject.abbreviation }}
      <span :title="lesson.substituted.subject.name" v-if="lesson.substitute">
        ({{lesson.substituted.subject.abbreviation}})
      </span>
    </span>
    <span class="room">
      {{ lesson.room }}
    </span>
    <span :title="lesson.teachers[0].firstname+' '+lesson.teachers[0].lastname" class="teacher">
      {{ lesson.teachers[0].abbreviation }}
    </span>
  </div>
</template>

<script>
export default {
  name: "LessonThumbnail",
  props: {
    lesson: {
      type: Object,
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.container > * {
  font-size: 1.5vh;
}

.cancelled {
  background-color: var(--color-text-accent-2);
}

.cancelled > span {
  background-color: var(--color-text-accent-2);
}

.substitute > span {
  color: var(--color-text-accent-1);
}

.name {
  font-weight: bold;
}

.room {
  margin: auto;
}

</style>