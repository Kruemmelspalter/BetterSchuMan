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

    <table id="schedule">
      <tr>
        <th />
        <th v-for="d in weekdays" :key="d.toMillis()" scope="col">{{ d.toLocaleString() }}</th>
      </tr>
      <tr v-for="h in hours" :key="h.from">
        <th scope="row">{{ h.number }}</th>
        <td v-for="d in weekdays" :key="d.toMillis()" class="lesson">

          <LessonThumbnail v-for="l in lessonsByDayAndHour(d,h)" :key="l.date+l.hour.toString()" :lesson="l" />
        </td>

      </tr>
    </table>
  </div>
</template>

<script>

import * as superagent from "superagent";
import { DateTime } from "luxon";
import LessonThumbnail from "@/components/views/LessonThumbnail";

export default {
  name: "ScheduleView",
  components: { LessonThumbnail },
  data() {
    return {
      monday: DateTime.now().startOf("week"),
      hoursData: [],
      scheduleData: { hours: [] },
    };
  },
  mounted() {
    superagent
      .get("/api/schedule/hours")
      .ok(_ => true)
      .auth(this.$store.state.token, { type: "bearer" })
      .send()
      .then(res => {
        if (res.status !== 200) {
          localStorage.removeItem("token");
          this.$router.push("/login");
          return;
        }
        this.hoursData = res.body;
      });
    setTimeout(this.loadSchedule, 1000);
  },
  computed: {
    hours() {
      return [...this.hoursData].sort((a, b) =>
        DateTime.fromISO(a.from).toMillis() - DateTime.fromISO(b.from).toMillis());

    },
    weekdays() {
      return Array.from({ length: 5 }, (_, i) => {
        return this.monday.plus({ days: i });
      });
    },
  },
  methods: {
    changeWeek(amount) {
      this.monday = this.monday.plus({ weeks: amount });
      this.loadSchedule();
    },
    loadSchedule() {
      superagent.get("/api/schedule")
        .ok(_ => true)
        .auth(this.$store.state.token, { type: "bearer" })
        .query({
          start: this.monday.toISODate(),
          end: this.monday.plus({ days: 5 }).toISODate(),
        })
        .send()
        .then(res => {
          if (res.status !== 200) {
            localStorage.removeItem("token");
            this.$router.push("/login");
            return;
          }
          this.scheduleData = res.body;
        });
    },
    lessonsByDayAndHour(day, hour) {
      return this.scheduleData.hours.filter(l => l.hour === hour.id && l.date === day.toISODate());
    },
  },
};

</script>

<style scoped>
#container {
  height: 85vh;
  display: grid;
  grid-template-rows: [top] 2.5% [toprow-start] 10% [toprow-end] 2.5% [schedule-start] 85% [schedule-end] 5% [bottom];
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
  padding: 1%;
}
</style>