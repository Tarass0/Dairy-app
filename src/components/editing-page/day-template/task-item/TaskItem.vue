<template>
  <li class="task__item">
    <div class="task__content">
      <p class="index">
        <span>{{ index + 1 }}.</span>
      </p>
      <input
        :id="taskItem.id"
        type="text"
        v-model.trim="currentTaskContent"
        :disabled="mode !== 'editing' || taskItem.completed"
        v-bind:class="{
          active: mode === 'editing' && !taskItem.completed,
          task__completed: taskItem.completed,
        }"
        @blur="onLoseFocus"
      />
      <small v-if="isValidInput">Task can't be empty. Add text or delete it!</small>
    </div>
    <button
      type="button"
      class="bth bth__complete-task"
      :disabled="isValidInput"
      v-if="mode === 'editing'"
      @click="onClickCompleteTaskBth(taskItem.id)"
    >
      {{ completeTaskBthText }}
    </button>
    <button
      type="button"
      class="bth bth__delete-task"
      v-if="mode === 'editing'"
      @click="onClickDeleteTaskBth(taskItem.id)"
    >
      Delete task
    </button>
    <DialogWindow v-if="showDialogWindow" @close="onAnswerFromDialogWindow"
      >Are you sure to {{ questionWord }}?</DialogWindow
    >
  </li>
</template>
<script>
import DialogWindow from '@/components/shared/dialog-window/DialogWindow.vue';
export default {
  data() {
    return {
      startTaskContent: this.taskItem.content,
      currentTaskContent: this.taskItem.content,
      showDialogWindow: false,
      questionWord: '',
      actionAfterAnswerFromDialogWindow: null,
      completeTaskBthText: 'Complete task',
      isInputTouched: false,
    };
  },
  props: {
    taskItem: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  /**
   * Function mounted choose current state of completing
   */
  mounted() {
    if (this.taskItem.completed) {
      this.completeTaskBthText = 'Refresh task';
    } else {
      this.completeTaskBthText = 'Complete task';
    }
  },
  computed: {
    /**
     * Function isValidInput check is input valid
     * @returns Boolean
     */
    isValidInput() {
      const isValidInput = this.isInputTouched && !!!this.currentTaskContent.trim();
      if (isValidInput) {
        this.$emit('some-input-invalid', {
          valid: false,
          infoMessage: 'One of the task is empty and you cant do saving',
        });
      }
      return isValidInput;
    },
  },
  components: {
    DialogWindow,
  },
  methods: {
    /**
     * Function onClickDeleteTaskBth emit events 'delete-task' and 'some-input-invalid'
     * @param taskId: Number
     */
    onClickDeleteTaskBth(taskId) {
      this.questionWord = 'delete';
      this.showDialogWindow = true;
      this.actionAfterAnswerFromDialogWindow = () => {
        this.$emit('delete-task', taskId);
        this.$emit('some-input-invalid', { valid: true });
      };
    },
    /**
     * Function onClickCompleteTaskBth emit events 'complete-task' and change Complete button text
     * @param taskId: Number
     */
    onClickCompleteTaskBth(taskId) {
      const taskInfo = {
        currentContent: this.currentTaskContent,
        taskId,
      };
      if (!this.taskItem.completed) {
        taskInfo.completed = true;
        this.completeTaskBthText = 'Refresh task';
      } else {
        taskInfo.completed = false;
        this.completeTaskBthText = 'Complete task';
      }
      this.$emit('complete-task', taskInfo);
    },
    /**
     * Function onLoseFocus check can change task and emit event 'change-task'
     */
    onLoseFocus() {
      this.isInputTouched = true;
      this.currentTaskContent = this.currentTaskContent.replace(/\s+/g, ' ');
      const canChangeTask =
        this.startTaskContent !== this.currentTaskContent && !!this.currentTaskContent;
      if (canChangeTask) {
        this.$emit('change-task', {
          currentContent: this.currentTaskContent,
          taskId: this.taskItem.id,
          completed: this.taskItem.completed,
        });
        this.startTaskContent = this.currentTaskContent;
      }
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
  },
};
</script>
<style scoped lang="scss">
.task__item {
  padding: 10px 0;
  margin-bottom: 25px;
  display: flex;
  border-bottom: 1px solid #4a4a4a;
  .task__content {
    font-size: 16px;
    display: flex;
    width: 100%;
    p.index {
      display: flex;
      align-items: center;
      font-size: 18px;
    }
    small {
      width: 100%;
      display: block;
      padding: 7px 0;
      color: red;
    }
    input.active {
      border: 1px solid #000000;
      background: #f2efef;
      padding: 5px;
      margin-left: 5px;
      color: #000000;
      font-size: 16px;
      box-sizing: border-box;
      width: 100%;
      display: block;
    }
  }
  button {
    margin-left: 10px;
    height: 50px;
  }
}
.task__item .task__completed {
  text-decoration: line-through;
  border: transparent;
  background: transparent;
  color: #000000;
  font-size: 18px;
}
@media screen and (max-width: 465px) {
  .task__item {
    display: flex;
    flex-direction: column;
    .task__content {
      width: 100%;
      display: flex;
      align-items: center;
    }
    input {
      width: 100%;
      box-sizing: border-box;
    }
    button {
      margin-left: 0;
      width: 100%;
      margin-top: 15px;
      height: 30px;
    }
  }
}
</style>
