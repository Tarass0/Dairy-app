<template>
  <div class="day-content__wrapper">
    <div class="date">Day: {{ day.date }}({{ day.dayName }})</div>
    <TasksListInReadingMode v-bind:day="day" v-if="mode === 'reading'" />
    <form @submit.prevent="onSaveChanges" v-if="mode === 'editing'">
      <fieldset>
        <label for="tasks">Tasks I must do:</label>
        <ul id="tasks" v-if="haveTasksForDay">
          <TaskItem
            v-for="(taskItem, index) in day.tasksForDay"
            :key="taskItem.id"
            v-bind:taskItem="taskItem"
            v-bind:index="index"
            v-bind:mode="mode"
            @delete-task="deleteTask"
            @complete-task="completeTask"
            @change-task="updateTask"
            @some-input-invalid="isFormValid"
          />
        </ul>
        <div class="info__message" v-if="!haveTasksForDay">
          You dont have any tasks for this day
        </div>
      </fieldset>
      <AddNewTask @add-new-day="addNewTask" />
      <fieldset>
        <div class="buttons">
          <div class="save-bth__wrapper">
            <button type="submit" class="bth bth__save-changes" :disabled="!formValid">
              Save changes
            </button>
            <small v-if="!formValid">{{ saveBthInfoMessage }}</small>
          </div>
          <div class="cancel-bth__wrapper">
            <button
              type="button"
              class="bth bth__cancel-last-changes"
              :disabled="!canCancelLastChanges"
              @click="onCancelLastChanges"
            >
              Cancel the last change made to the page
            </button>
            <small v-if="!canCancelLastChanges">Cancel action is not available now!</small>
            <small v-if="statesForRestorationCount"
              >You can cancel <span>{{ statesForRestorationCount }}</span> last change</small
            >
          </div>
        </div>
      </fieldset>
    </form>
    <DialogWindow v-if="showDialogWindow" @close="onAnswerFromDialogWindow"
      >Are you sure to {{ questionWord }}?</DialogWindow
    >
  </div>
</template>
<script>
import DialogWindow from '@/components/shared/dialog-window/DialogWindow.vue';
import AddNewTask from '@/components/editing-page/day-template/add-new-task/AddNewTask.vue';
import TaskItem from '@/components/editing-page/day-template/task-item/TaskItem.vue';
import TasksListInReadingMode from '@/components/editing-page/day-template/task-list-in-reading-mode/TasksListInReadingMode.vue';
export default {
  data() {
    return {
      dayId: parseInt(this.$route.params['id']),
      day: {},
      changedTasksItems: [],
      stateTaskListBeforeSaving: null,
      statesForRestorationCount: null,
      showDialogWindow: false,
      actionAfterAnswerFromDialogWindow: null,
      haveTasksForDay: true,
      formValid: false,
      canCancelLastChanges: false,
      questionWord: '',
      newTaskItem: '',
      saveBthInfoMessage: 'There were no changes. Saving is not needed!',
    };
  },
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  /**
   * Function mounted get date about day by id
   */
  mounted() {
    if (this.$store.getters.getDayById(this.dayId)) {
      this.day = JSON.parse(JSON.stringify(this.$store.getters.getDayById(this.dayId)));
      this.stateTaskListBeforeSaving = JSON.parse(JSON.stringify(this.day.tasksForDay));
      this.canCancelLastChanges = !!this.$store.getters.getStatesForRestorationCount(this.dayId);
      this.statesForRestorationCount = this.$store.getters.getStatesForRestorationCount(this.dayId);
    } else {
      this.$router.push('/');
    }
  },
  components: {
    DialogWindow,
    AddNewTask,
    TaskItem,
    TasksListInReadingMode,
  },
  methods: {
    /**
     * Function deleteTask delete task by id and marked that this task must delete in store after saving
     * @param taskId: Number
     */
    deleteTask(taskId) {
      this.day.tasksForDay = this.day.tasksForDay.filter((task) => task.id !== taskId);
      this.day.tasksForDay.length === 0 ? (this.haveTasksForDay = false) : null;
      this.changedTasksItems.push({
        taskId,
        deleteTask: true,
      });
    },
    /**
     * Function completeTask complete task and marked that this task must complete in store after saving
     * @param taskInfo: Object
     */
    completeTask(taskInfo) {
      const { completed, taskId } = taskInfo;
      const task = this.day.tasksForDay.find((task) => task.id === taskId);
      task.completed = completed;
      const updatedTask = this.changedTasksItems.find((element) => element.taskId === taskId);
      if (!updatedTask) {
        this.changedTasksItems.push(taskInfo);
      } else {
        updatedTask.completed = completed;
      }
      this.formValid = true;
    },
    /**
     * Function updateTask update task and marked that this task must update in store after saving
     * @param taskInfo: Object
     */
    updateTask(taskInfo) {
      this.formValid = true;
      const { currentContent, taskId } = taskInfo;
      const task = this.day.tasksForDay.find((task) => task.id === taskId);
      task.content = currentContent;
      const updatedTask = this.changedTasksItems.find((element) => element.taskId === taskId);
      if (!updatedTask) {
        this.changedTasksItems.push(taskInfo);
      } else {
        updatedTask.currentContent = currentContent;
      }
    },
    /**
     * Function addNewTask add task and marked that this task must add in store after saving
     * @param newTask: Object
     */
    addNewTask(newTask) {
      this.formValid = true;
      this.haveTasksForDay = true;
      this.day.tasksForDay.push(newTask);
      const { content, completed, id } = newTask;
      const updatedTask = {
        currentContent: content,
        taskId: id,
        completed,
      };
      this.changedTasksItems.push(updatedTask);
    },
    /**
     * Function onSaveChanges save all changes in store and marked day info state for Restoration in store before saving
     */
    onSaveChanges() {
      this.$store.commit('updateListOfTasksInDayById', {
        dayId: this.dayId,
        changedTasksItems: this.changedTasksItems,
      });
      this.$router.push('/');
      this.changedTasksItems = [];
      this.$store.commit('setStateTasksListForRestoration', {
        dayId: this.dayId,
        stateTasks: this.stateTaskListBeforeSaving,
      });
    },
    /**
     * Function onCancelLastChanges cancel last saving in store and redirect to main page
     */
    onCancelLastChanges() {
      this.$store.commit('updateListOfTasksInDayByIdAfterCancelLastChange', this.dayId);
      this.$router.push('/');
    },
    /**
     * Function onAnswerFromDialogWindow call some function in case successfully answer
     * @param answer: Boolean
     */
    onAnswerFromDialogWindow(answer) {
      this.showDialogWindow = false;
      if (answer.confirmAction) {
        this.actionAfterAnswerFromDialogWindow();
      } else {
      }
    },
    /**
     * Function isFormValid check can you make saving
     * @param inputInfo: Object
     */
    isFormValid(inputInfo) {
      if (this.day.tasksForDay.length === 0) {
        this.formValid = false;
        this.saveBthInfoMessage =
          'You cant do saving, because there are not tasks. Add at least 1 task';
      } else {
        this.formValid = inputInfo.valid;
        this.saveBthInfoMessage = inputInfo.infoMessage;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.day-content__wrapper {
  .date {
    font-size: 19px;
    margin: 10px 0;
  }
  label {
    font-size: 18px;
  }
  ul#tasks {
    margin-top: 5px;
  }
  .info__message {
    width: 100%;
    text-align: center;
    padding: 20px;
    margin-top: 10px;
    font-size: 20px;
    color: #0179f1;
    border: 1px solid #4a4a4a;
  }
  .buttons {
    .cancel-bth__wrapper,
    .save-bth__wrapper {
      margin: 15px 0;
      display: flex;
      flex-direction: column;
    }
    small {
      font-size: 15px;
      margin-left: 5px;
      margin-top: 5px;
      color: red;
      span {
        font-weight: bold;
      }
    }
  }
}
</style>
