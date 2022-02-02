<template>
  <div>
    <div id="tabbuttons">
      <button class="tabbutton material-icons" @click="activate(0)">schedule</button>
      <button class="tabbutton material-icons" @click="activate(1)">calendar_today</button>
      <button class="tabbutton material-icons" @click="activate(2)">notifications</button>
      <button class="tabbutton material-icons" @click="activate(3)">chat</button>
      <button class="tabbutton material-icons" @click="activate(-1)">close</button>
    </div>
    <div id="sidebarcontent">
      <ScheduleSidebar v-show="activeTab === 0" class="tabcontent" />
      <CalendarComponent v-show="activeTab === 1" class="tabcontent" />
      <NotificationsComponent v-show="activeTab === 2" class="tabcontent" />
      <ChatSidebar v-show="activeTab === 3" class="tabcontent" />
    </div>
  </div>
</template>

<script>
import ScheduleSidebar from '@/components/sidebar/ScheduleSidebar';
import CalendarComponent from '@/components/sidebar/CalendarComponent';
import NotificationsComponent from '@/components/sidebar/NotificationsComponent';
import ChatSidebar from '@/components/sidebar/ChatSidebar';

export default {
  name: 'SidebarComponent',
  components: { ScheduleSidebar, ChatSidebar, NotificationsComponent, CalendarComponent },
  data() {
    const tabFromStorage = localStorage.getItem('activeTab');
    return {
      activeTab: tabFromStorage === undefined ? -1 : parseInt(tabFromStorage),
    };
  },
  methods: {
    activate(id) {
      this.activeTab = id;
      localStorage.setItem('activeTab', id);
    },
  },
};
</script>

<style scoped>
#sidebarcontent {
  overflow-y: scroll;
  max-height: 87.5vh;
}
</style>