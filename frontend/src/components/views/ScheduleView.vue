<template>
  <div id="container">
    <div id="panel">
      <button id="week_before" class="week_button material-icons" @click="changeWeek(-1)">
        navigate_before
      </button>
      <span id="label">
        Week {{ monday.weekNumber }} ({{ monday.weekYear }})
      </span>
      <button id="week_next" class="week_button material-icons" @click="changeWeek(1)">
        navigate_next
      </button>
    </div>

    <ScheduleComponent :days="days" />
  </div>
</template>

<script>
import ScheduleComponent from '@/components/ScheduleComponent';
import { DateTime } from 'luxon';

export default {
  name: 'ScheduleView',
  components: { ScheduleComponent },
  data: function() {
    let now = DateTime.now();
    if (now.weekday === 6 || now.weekday === 7) {
      now = now.plus({ weeks: 1 }).startOf('week');
    }
    return {
      monday: now.startOf('week'),
    };
  },
  methods: {
    changeWeek(amount) {
      this.monday = this.monday.plus({ weeks: amount }).startOf('week');
    },
  },
  computed: {
    days() {
      return Array.from({ length: 5 }, (_, i) =>
        this.monday.plus({ days: i }));
    },
  },
};
</script>

<style scoped>
#container {
  height: 85vh;
  display: grid;
  grid-template-rows: [top] 1% [toprow-start] 10% [toprow-end] 2.5% [schedule-start] 85% [schedule-end] 5% [bottom];
  grid-template-columns: [left] 5% [schedule-start] 30% [panel-start] 30% [panel-end] 30% [schedule-end] 5% [right];
}

#panel {
  height: 100%;
  width: 100%;
  grid-row-start: toprow-start;
  grid-row-end: toprow-end;
  grid-column-start: panel-start;
  grid-column-end: panel-end;

  display: flex;
  align-items: center;
}

#label {
  margin: auto;
  font-size: 2vh;
}

#schedule {
  grid-row-start: schedule-start;
  grid-row-end: schedule-end;
  grid-column-start: schedule-start;
  grid-column-end: schedule-end;
}
</style>