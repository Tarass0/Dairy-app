<template>
  <li class="list__item">
    <div class="content">
      <div class="date">
        Day: <span>{{ day.date }}</span> <span>({{ day.dayName }})</span>
      </div>
      <div class="tasks__wrapper">
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
      <div class="buttons">
        <button type="button" class="bth bth__delete" @click="onClickDeleteBth">
          Delete day
        </button>
        <button type="button" class="bth bth__edit">
          <router-link :to="`/day/${day.id}`">Change day's information</router-link>
        </button>
      </div>
    </div>
    <DialogWindow v-if="showDialogWindow" @close="onAnswerFromDialogWindow"
      >Delete this day?</DialogWindow
    >
  </li>
</template>
<script>
import DialogWindow from '@/components/shared/dialog-window/DialogWindow.vue';
export default {
  data() {
    return {
      showDialogWindow: false,
    };
  },
  props: {
    day: {
      type: Object,
      required: true,
    },
  },
  components: {
    DialogWindow,
  },
  methods: {
    /**
     * Function onClickDeleteBth show dialog window
     */
    onClickDeleteBth() {
      this.showDialogWindow = true;
    },
    /**
     * Function onAnswerFromDialogWindow delete day in store in case successfully answer
     * @param answer: Boolean
     */
    onAnswerFromDialogWindow(answer) {
      this.showDialogWindow = false;
      answer.confirmAction ? this.$store.commit('deleteDayById', this.day.id) : null;
    },
  },
};
</script>
<style scoped lang="scss">
.list__item {
  border: 1px solid #6f6f70;
  padding: 10px 0;
  margin: 10px 0;
  .content {
    padding: 0 10px;
    font-size: 18px;
    .date,
    .tasks__wrapper {
      margin: 10px 0;
    }
    .tasks__wrapper {
      .task__item {
        padding: 5px 0;
        span {
          word-break: break-all;
        }
      }
      .task__completed {
        text-decoration: line-through;
      }
    }
    .buttons button:first-child {
      margin-right: 10px;
    }
  }
}
@media screen and (max-width: 465px) {
  .list__item {
    .content {
      .buttons {
        button:first-child {
          margin-right: 0;
        }
        button {
          display: block;
          width: 100%;
          margin: 10px 0;
        }
      }
    }
  }
}
</style>
