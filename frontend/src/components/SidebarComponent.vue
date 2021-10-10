<template>
  <div>
    <div id="tabbuttons">
      <button class="tabbutton material-icons" @click="activate(0)">schedule</button>
      <button class="tabbutton material-icons" @click="activate(1)">calendar_today</button>
      <button class="tabbutton material-icons" @click="activate(2)">notifications</button>
      <button class="tabbutton material-icons" @click="activate(3)">chat</button>
      <button class="tabbutton material-icons" @click="activate(-1)">close</button>
    </div>
    <schedule-component v-show="activeTab === 0" class="tabcontent" />
    <calendar-component v-show="activeTab === 1" class="tabcontent" />
    <notifications-component v-show="activeTab === 2" class="tabcontent" />
    <chat-component v-show="activeTab === 3" class="tabcontent" />
  </div>
</template>

<script>
import ScheduleComponent from "@/components/ScheduleComponent";
import CalendarComponent from "@/components/CalendarComponent";
import NotificationsComponent from "@/components/NotificationsComponent";
import ChatComponent from "@/components/ChatComponent";

export default {
  name: "SidebarComponent",
  components: { ChatComponent, NotificationsComponent, CalendarComponent, ScheduleComponent },
  data() {
    return {
      activeTab: -1,
    };
  },
  methods: {
    activate(id) {
      this.activeTab = id;
    },
  },
};
</script>

<style scoped>

</style>