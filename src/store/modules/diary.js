export default {
  actions: {
    /**
     * Function fetchDairy fetch date from localStorage
     * @param ctx - Context
     */
    async fetchDairy(ctx) {
      const diaryInfo = await localStorage.getItem('diaryMadeByTaras');
      if (diaryInfo) {
        ctx.commit('updateDairy', JSON.parse(diaryInfo));
      }
    },
  },
  mutations: {
    /**
     * Function updateDairy update date in dairy
     * @param state
     * @param diary: Array
     */
    updateDairy(state, diary) {
      state.diary = diary;
    },
    /**
     * Function addNewDay add new day to dairy and update date in localStorage
     * @param state
     * @param newDay: Object
     */
    addNewDay(state, newDay) {
      state.diary.unshift(newDay);
      localStorage.setItem('diaryMadeByTaras', JSON.stringify(state.diary));
    },
    /**
     * Function deleteDayById delete day from dairy and update date in localStorage
     * @param state
     * @param id: Number
     */
    deleteDayById(state, id) {
      state.diary = state.diary.filter((day) => day.id !== id);
      const dayCount = state.diary.length;
      if (dayCount === 0) {
        localStorage.removeItem('diaryMadeByTaras');
      } else {
        localStorage.setItem('diaryMadeByTaras', JSON.stringify(state.diary));
      }
    },
    /**
     * Function updateListOfTasksInDayById update list of tasks after saving and update date in localStorage
     * @param state
     * @param dayId: Number
     * @param changedTasksItems: Array
     */
    updateListOfTasksInDayById(state, { dayId, changedTasksItems }) {
      const day = this.getters.getDayById(dayId);
      changedTasksItems.forEach((changedTaskItem) => {
        const { currentContent, taskId, completed } = changedTaskItem;
        const task = day.tasksForDay.find((task) => task.id === taskId);
        if (task && !changedTaskItem.deleteTask) {
          task.content = currentContent;
          task.completed = completed;
        } else if (!task && !changedTaskItem.deleteTask) {
          day.tasksForDay.push({
            id: taskId,
            content: currentContent,
            completed,
          });
        } else if (changedTaskItem.deleteTask) {
          const taskIndex = day.tasksForDay.indexOf(task);
          day.tasksForDay.splice(taskIndex, 1);
        }
      });
      localStorage.setItem('diaryMadeByTaras', JSON.stringify(state.diary));
    },
    /**
     * Function setStateTasksListForRestoration set state of tasks list For restoration and update date in localStorage
     * @param state
     * @param dayId: Number
     * @param stateTasks: Array
     */
    setStateTasksListForRestoration(state, { dayId, stateTasks }) {
      const day = this.getters.getDayById(dayId);
      const countOfState = this.getters.getStatesForRestorationCount(dayId);
      if (countOfState < 2) {
        day.stateTasksForDayBeforeChange.unshift(stateTasks);
      } else {
        day.stateTasksForDayBeforeChange.unshift(stateTasks);
        day.stateTasksForDayBeforeChange.pop();
      }
      localStorage.setItem('diaryMadeByTaras', JSON.stringify(state.diary));
    },
    /**
     * Function updateListOfTasksInDayByIdAfterCancelLastChange cancel the last user's saving and update date in localStorage
     * @param state
     * @param dayId: Number
     */
    updateListOfTasksInDayByIdAfterCancelLastChange(state, dayId) {
      const day = this.getters.getDayById(dayId);
      console.log(day.stateTasksForDayBeforeChange[0]);
      day.tasksForDay = [...day.stateTasksForDayBeforeChange[0]];
      day.stateTasksForDayBeforeChange.splice(0, 1);
      localStorage.setItem('diaryMadeByTaras', JSON.stringify(state.diary));
    },
  },
  state: {
    diary: [],
  },
  getters: {
    /**
     * Function getDairy return dairy
     * @param state
     * @returns {[]}
     */
    getDairy(state) {
      return state.diary;
    },
    /**
     * Function getDairyDaysCount return count of days in dairy
     * @param state
     * @returns {number}
     */
    getDairyDaysCount(state) {
      return state.diary.length;
    },
    /**
     * Function getDayById return day by id
     * @param state
     * @returns {{}}
     */
    getDayById: (state) => (id) => {
      return state.diary.find((day) => day.id === id);
    },
    /**
     *  Function getStatesForRestorationCount return count of states for restoration
     * @param state
     * @returns {function(*): number}
     */
    getStatesForRestorationCount: (state) => (id) => {
      return state.diary.find((day) => day.id === id).stateTasksForDayBeforeChange.length;
    },
  },
};
