<template>
  <div>
    <div class="title">Tasks I must do:</div>
    <ul class="tasks">
      <li
        class="task__item"
        v-for="(taskItem, index) in day.tasksForDay"
        :key="taskItem.id"
        v-bind:class="{
          task__completed: taskItem.completed,
        }"
      >
        <span>{{ index + 1 }}.</span>
        <span>{{ taskItem.content }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    day: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style scoped lang="scss">
.title {
  font-size: 20px;
}
.task__item {
  padding: 10px 0;
  font-size: 18px;
  border-bottom: 1px solid #4a4a4a;
  span {
    word-break: break-all;
  }
}
.task__completed {
  text-decoration: line-through;
}
</style>
