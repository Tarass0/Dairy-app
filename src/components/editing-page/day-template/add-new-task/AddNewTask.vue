<template>
  <fieldset>
    <label for="task">Enter new task:</label>
    <input id="task" type="text" v-model="newTaskItem" @blur="isInputTouched = true" />
    <button type="button" :disabled="!newTaskItem" @click="addNewTask">
      Add new Task
    </button>
    <small class="error__block" v-if="isValidInput">To add new task it should not be empty</small>
  </fieldset>
</template>
<script>
export default {
  data() {
    return {
      newTaskItem: '',
      isInputTouched: false,
    };
  },
  computed: {
    /**
     * Function isValidInput check is valid input
     * @returns {boolean|boolean}
     */
    isValidInput() {
      return this.isInputTouched && !!!this.newTaskItem.trim();
    },
  },
  methods: {
    /**
     * Function addNewTask emit event 'add-new-day'
     */
    addNewTask() {
      this.isInputTouched = false;
      const newTask = {
        content: this.newTaskItem,
        completed: false,
        id: new Date().getTime(),
      };
      this.newTaskItem = '';
      this.$emit('add-new-day', newTask);
    },
  },
};
</script>
<style scoped lang="scss">
fieldset {
  margin: 15px 0;
  label {
    font-size: 18px;
  }
  input {
    padding: 5px;
    margin-left: 5px;
  }
  button {
    margin-left: 5px;
  }
  small {
    display: block;
    color: red;
    padding: 7px 0;
  }
}
@media screen and (max-width: 465px) {
  fieldset {
    margin: 15px 0;
    label {
      display: block;
    }
    input {
      margin-left: 0;
      margin-top: 10px;
      width: 100%;
      box-sizing: border-box;
    }
    button {
      margin-left: 0;
      margin-top: 10px;
    }
    small {
      display: block;
      color: red;
      padding: 7px 0;
    }
  }
}
</style>
