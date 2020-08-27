<template>
  <div class="wrapper" v-if="dairy">
    <div class="title">Your days:</div>
    <ul>
      <DaysListItem v-for="day of dairy" v-bind:day="day" :key="day.id" />
    </ul>
  </div>
</template>

<script>
import DaysListItem from '@/components/main-page/days-list/days-list-item/DaysListItem.vue';
export default {
  props: ['dairy'],
  components: {
    DaysListItem,
  },
};
</script>
<style scoped lang="scss">
.wrapper {
  margin-top: 10px;
  .title {
    font-size: 20px;
    padding: 8px 0;
  }
}
</style>
