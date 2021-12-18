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
import * as superagent from 'superagent';

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
    if (this.$store.state.lessons.filter(x => x.date === now.toISODate()).length === 0) {
      superagent.get('/api/schedule')
        .ok(_ => true)
        .auth(this.$store.state.token, { type: 'bearer' })
        .query({
          start: now.toISODate(),
          end: now.toISODate(),
        })
        .send()
        .then(res => {
          if (res.status !== 200) {
            localStorage.removeItem('token');
            this.$router.push('/login');
            return;
          }
          this.$store.commit('addLessonInfo', res.body.hours);
          let now = this.day||now;

          let lessons = this.$store.state.lessons.filter(x => x.date === now.toISODate());
          if (lessons.length === 0) return;
          lessons = lessons.filter(x =>
            DateTime.fromISO(this.$store.state.hours.filter(y => y.id === x.hour)[0].until) > now.plus({ minutes: 45 })
          );
          if (lessons.length === 0) {
            now = now.plus({ days: 1 });
            if (now.weekday === 6 || now.weekday === 7) {
              now = now.plus({ weeks: 1 }).startOf('week').startOf('day');
            }
          }
          this.day = now;
        });
    }
    let lessons = this.$store.state.lessons.filter(x => x.date === now.toISODate());
    lessons = lessons.filter(x =>
      DateTime.fromISO(this.$store.state.hours.filter(y => y.id === x.hour)[0].until) > now.plus({ minutes: 45 })
    );
    if (lessons.length === 0) {
      now = now.plus({ days: 1 });
    }
    if (now.weekday === 6 || now.weekday === 7) {
      now = now.plus({ weeks: 1 }).startOf('week').startOf('day');
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

#schedule {
min-width: 50%;
}
</style>