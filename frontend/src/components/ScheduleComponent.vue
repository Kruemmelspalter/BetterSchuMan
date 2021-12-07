<template>
  <table id="schedule">
    <tr>
      <th />
      <th v-for="d in days" :key="d.toMillis()" scope="col">
        {{ d.toLocaleString({ weekday: 'long' }) }}
        <br />
        {{ d.toLocaleString({ day: '2-digit', month: '2-digit', year: '2-digit' }) }}
      </th>
    </tr>
    <tr v-for="h in hours" :key="Math.random().toString()+h.from">
      <th scope="row" class="hour">
        <span class="hourTime">{{ h.from }}</span>
        <br />
        <span class="hourNumber">{{ h.number }}</span>
        <br />
        <span class="hourTime">{{ h.until }}</span>
      </th>
      <td v-for="d in days" :key="d.toMillis()" class="lesson">
        <LessonThumbnail v-for="l in lessonsByDayAndHour(d,h)" :key="Math.random()*l.hour" :lesson="l" />
      </td>
    </tr>
  </table>
</template>

<script>

import * as superagent from 'superagent';
import { DateTime } from 'luxon';
import LessonThumbnail from '@/components/LessonThumbnail';


export default {
  name: 'ScheduleView',
  components: { LessonThumbnail },
  props: {
    days: {
      type: Array,
    },
  },
  watch: {
    days() {
      this.loadSchedule();
    },
  },
  mounted() {
    superagent
      .get('/api/schedule/hours')
      .ok(_ => true)
      .auth(this.$store.state.token, { type: 'bearer' })
      .send()
      .then(res => {
        if (res.status !== 200) {
          localStorage.removeItem('token');
          this.$router.push('/login');
          return;
        }
        this.$store.commit('setHoursData', res.body);
      });
    setTimeout(this.loadSchedule, 1000);
  },
  computed: {
    hours() {
      return [...this.$store.state.hours].sort((a, b) =>
        DateTime.fromISO(a.from).toMillis() - DateTime.fromISO(b.from).toMillis());
    },
  },
  methods: {
    loadSchedule() {
      const days = [...this.days].sort((a, b) => Math.sign(a.toMillis() - b.toMillis()));

      for (const d in days) {
        if (this.$store.state.lessons.filter(x => x.date === days[d].toISODate()).length === 0) {
          superagent.get('/api/schedule')
            .ok(_ => true)
            .auth(this.$store.state.token, { type: 'bearer' })
            .query({
              start: days[d].toISODate(),
              end: days[d].toISODate(),
            })
            .send()
            .then(res => {
              if (res.status !== 200) {
                localStorage.removeItem('token');
                this.$router.push('/login');
                return;
              }
              this.$store.commit('addLessonInfo', res.body.hours);
            });
        }
      }

    },
    lessonsByDayAndHour(day, hour) {
      return this.$store.state.lessons.filter(l => l.hour === hour.id && l.date === day.toISODate());
    },
  },
};

</script>

<style scoped>
table, th, td {
  border: 1px solid var(--color-text);
  border-collapse: collapse;
}


table > * {
  font-size: 2vh;
}

@media only screen and (orientation: portrait) {
  table > * {
    font-size: 1vh;
  }
}

.lesson {
  padding: 2%;
  max-width: 10vw;
}

.hourTime {
  font-size: 1.25vh;
}

.hour {
  line-height: 80%;
}
</style>