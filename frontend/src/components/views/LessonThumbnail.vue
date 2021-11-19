<template>
  <div class="container">
    <div :title="lesson.subject.name" class="name">
      {{ lesson.subject.abbreviation }}
    </div>
    <div class="room">{{ lesson.room }}</div>
    <div :title="lesson.teachers[0].firstname+' '+lesson.teachers[0].lastname" class="teacher">
      {{ lesson.teachers[0].abbreviation }}
    </div>
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

.name {
  font-weight: bold;
}

.room {
  margin: auto;
}
</style>