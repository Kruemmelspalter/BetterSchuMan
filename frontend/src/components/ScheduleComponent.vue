<template>
  <table id="schedule">
    <tr>
      <th />
      <th v-for="d in days" :key="d.toMillis()" scope="col">
        {{ d.toLocaleString({ weekday: 'long' }) }}
        <br />
        {{ d.toLocaleString({ day: '2-digit', month: '2-digit', year: '2-digit' }) }}
        <span v-if="loadingErrors[d.toISODate()]" class="loadingError">
          <br />
          couldn't load day
      </span>
      </th>
    </tr>
    <tr v-for="h in hours" :key="Math.random().toString()+h.from">
      <th class="hour" scope="row">
        <span class="hourTime">{{ convertISO(h.from).toLocaleString({ hour: 'numeric', minute: 'numeric' }) }}</span>
        <br />
        <span class="hourNumber">{{ h.number }}</span>
        <br />
        <span class="hourTime">{{ convertISO(h.until).toLocaleString({ hour: 'numeric', minute: 'numeric' }) }}</span>
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
  name: 'ScheduleComponent',
  components: { LessonThumbnail },
  props: {
    days: {
      type: Array,
    },
  },
  data() {
    return {
      loadingErrors: {},
    };
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
        if (!this.$store.state.lessons[d]) {
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
                this.loadingErrors[days[d].toISODate()] = true;
                throw `couldn't load hours for day ${days[d].toISODate()}`;
              }
              this.$store.commit('addLessons', [days[d].toISODate(), res.body.hours]);
            });
        }
      }

    },
    lessonsByDayAndHour(day, hour) {
      return (this.$store.state.lessons[day.toISODate()] || []).filter(l => l.hour === hour.id && l.date === day.toISODate());
    },
    convertISO(time) {
      return DateTime.fromISO(time);
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

.loadingError {
  background-color: var(--color-text-accent-2);
}
</style>