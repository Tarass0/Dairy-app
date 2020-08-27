<template>
  <div class="wrapper">
    <form @submit.prevent="onSubmit">
      <fieldset>
        <label for="date">Enter date:</label>
        <input id="date" type="date" v-model="date" @blur="isDateTouched = true" />
        <small class="error__block" v-if="isValidDate"
          >Date is invalid and it can not be date in past!
        </small>
      </fieldset>
      <fieldset>
        <label for="task">Enter task:</label>
        <input id="task" type="text" v-model="taskItem" @blur="isInputTouched = true" />
        <button type="button" :disabled="!taskItem" @click="addNewTask">
          Add Task
        </button>
        <small class="error__block" v-if="isValidInput"
          >To add new task it should not be empty</small
        >
      </fieldset>
      <div class="added--tasks__wrapper">
        <div class="title" v-if="tasks.length !== 0">Your added tasks:</div>
        <ul class="added__tasks" v-if="tasks.length !== 0">
          <li class="task" v-for="(taskItem, index) in tasks" :key="taskItem.id">
            <span>{{ index + 1 }}.</span>
            <span> {{ taskItem.content }}</span>
          </li>
        </ul>
      </div>
      <button type="submit" :disabled="!isFormValid || isValidDate" class="bth bth__create-day">
        Create Day
      </button>
      <small class="message" v-if="showInformationalBlock">Day was created</small>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      taskItem: '',
      tasks: [],
      showInformationalBlock: false,
      isInputTouched: false,
      isDateTouched: false,
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    };
  },
  computed: {
    /**
     * Function isFormValid check is form valid
     * @returns {null|boolean}
     */
    isFormValid() {
      return this.date && this.tasks.length !== 0;
    },
    /**
     * Function isValidInput check is input valid
     * @returns {boolean|boolean}
     */
    isValidInput() {
      return this.isInputTouched && !!!this.taskItem.trim();
    },
    /**
     * Function isValidDate check is input-date valid
     * @returns {boolean}
     */
    isValidDate() {
      const userDate = new Date(this.date);
      const currentDate = new Date();
      const isTheSameDay = userDate.getDate() === currentDate.getDate();
      return !(userDate.getTime() >= currentDate.getTime() || isTheSameDay) && this.isDateTouched;
    },
  },
  methods: {
    /**
     * Function onSubmit submit form and add day to store
     */
    onSubmit() {
      const newDay = {
        id: new Date().getTime(),
        date: this.date,
        dayName: this.days[new Date(this.date).getDay()],
        tasksForDay: this.tasks,
        stateTasksForDayBeforeChange: [],
      };
      this.$store.commit('addNewDay', newDay);
      this.taskItem = this.date = '';
      this.tasks = [];
      setTimeout(() => {
        this.showInformationalBlock = false;
      }, 1500);
      this.showInformationalBlock = true;
    },
    /**
     * Function addNewTask create new task
     */
    addNewTask() {
      if (this.taskItem.trim()) {
        const taskItemObj = {
          id: new Date().getTime(),
          content: this.taskItem,
          completed: false,
        };
        this.tasks.push(taskItemObj);
        this.taskItem = '';
        this.isInputTouched = false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
form {
  fieldset {
    border-bottom: 1px solid #6f6f70;
    padding-top: 10px;
    padding-bottom: 5px;
    label {
      font-size: 18px;
      margin-right: 5px;
    }
    input {
      width: 100%;
      max-width: 200px;
      box-sizing: border-box;
    }
    small.error__block {
      display: block;
      color: red;
      padding: 5px;
    }
    button {
      margin-left: 15px;
    }
  }
  .added--tasks__wrapper {
    border-bottom: 1px solid #6f6f70;
    .title {
      font-size: 18px;
      padding: 10px 0;
    }
    .added__tasks .task {
      padding: 5px 0;
    }
  }
  .bth__create-day {
    margin-top: 10px;
  }
  small.message {
    color: green;
    margin-left: 5px;
  }
}
@media screen and (max-width: 465px) {
  form {
    fieldset {
      input {
        max-width: 100%;
      }
      button {
        margin-left: 0;
        margin-top: 5px;
      }
    }
  }
}
</style>
