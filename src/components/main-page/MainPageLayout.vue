<template>
  <div class="wrapper">
    <div class="title">
      Make your TIMETABLE
    </div>
    <AddNewDay />
    <DaysList v-if="getDairyDaysCount !== 0" v-bind:dairy="getDairy" />
    <div v-else class="info__block">
      <span>You dont have any days.</span> <span>Add at least one day</span>
    </div>
  </div>
</template>
<script>
import DaysList from '@/components/main-page/days-list/DaysList.vue';
import AddNewDay from '@/components/main-page/add-new-day/AddNewDay.vue';
import { mapGetters } from 'vuex';
export default {
  computed: mapGetters(['getDairy', 'getDairyDaysCount']),
  components: {
    DaysList,
    AddNewDay,
  },
};
</script>
<style scoped lang="scss">
.wrapper {
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  .info__block {
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    margin: 15px auto;
    border: 1px solid #6f6f70;
    font-size: 18px;
    padding: 10px;
    span {
      width: 100%;
      padding: 10px 0;
      text-align: center;
    }
  }
}
</style>
