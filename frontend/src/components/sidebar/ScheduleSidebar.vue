<template>
  <div id="container">
    <div id="buttons">
      <button id="week_before" class="week_button material-icons" @click="changeDay(-1)">
        navigate_before
      </button>
      <button id="week_next" class="week_button material-icons" @click="changeDay(1)">
        navigate_next
      </button>
    </div>
    <br />
    <ScheduleComponent id="schedule" :days="[day]" />
  </div>
</template>

<script>
import ScheduleComponent from '@/components/ScheduleComponent';
import { DateTime } from 'luxon';

export default {
  name: 'ScheduleSidebar',
  components: {
    ScheduleComponent,
  },
  methods: {
    changeDay(amount) {
      this.day = this.day.plus({ days: amount });
    },
  },
  data() {
    let now = DateTime.now();
    if (now.weekday === 6 || now.weekday === 7) {
      now = now.plus({ weeks: 1 }).startOf('week');
    }
    return {
      day: now,
    };
  },
};
</script>

<style scoped>
#buttons {
  display: flex;
  justify-content: center;
  justify-items: center;
}
</style>