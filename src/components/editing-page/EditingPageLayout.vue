<template>
  <div>
    <header>
      <button
        type="button"
        class="bth bth__back-to-main-page"
        v-if="mode === 'reading'"
        @click="backToMainPage"
      >
        Back to main page
      </button>
      <div class="page__title">
        Page in mode: <span>{{ mode }}</span>
      </div>
      <div class="modes">
        <button
          type="button"
          class="bth bth__reading-mode"
          v-bind:class="{ active: mode === 'reading' }"
          @click="onClickReadingMode"
        >
          Reading mode
        </button>
        <button
          type="button"
          class="bth bth__editing-mode"
          v-bind:class="{ active: mode === 'editing' }"
          @click="mode = 'editing'"
        >
          Editing mode
        </button>
      </div>
    </header>
    <DayTemplate v-if="renderComponent" v-bind:mode="mode" />
    <button type="button" class="bth bth__delete" @click="onClickDeleteDayBth">
      Delete day
    </button>
    <DialogWindow v-if="showDialogWindow" @close="onAnswerFromDialogWindow"
      >Are you sure to {{ questionWord }}?</DialogWindow
    >
  </div>
</template>
<script>
import DialogWindow from '@/components/shared/dialog-window/DialogWindow.vue';
import DayTemplate from '@/components/editing-page/day-template/DayTemplate.vue';
export default {
  data() {
    return {
      dayId: parseInt(this.$route.params['id']),
      mode: 'reading',
      showDialogWindow: false,
      questionWord: '',
      actionAfterAnswerFromDialogWindow: null,
      renderComponent: true,
    };
  },
  components: {
    DayTemplate,
    DialogWindow,
  },
  methods: {
    /**
     * Function onClickReadingMode check want you return to reading mode after confirm
     */
    onClickReadingMode() {
      if (this.mode !== 'reading') {
        this.questionWord = "return to mode 'READING' without saving changes";
        this.showDialogWindow = true;
        this.actionAfterAnswerFromDialogWindow = () => {
          this.forceRerender();
          this.mode = 'reading';
        };
      }
    },
    /**
     * Function onClickDeleteDayBth delete day from store and redirect to main page  after confirm
     */
    onClickDeleteDayBth() {
      this.questionWord = 'delete';
      this.showDialogWindow = true;
      this.actionAfterAnswerFromDialogWindow = function () {
        this.$store.commit('deleteDayById', this.dayId);
        this.$router.push('/');
      };
    },
    /**
     * Function forceRerender component if user return to mode reading without saving
     */
    forceRerender() {
      this.renderComponent = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
    /**
     * Function backToMainPage redirect to main page
     */
    backToMainPage() {
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
      }
    },
  },
};
</script>
<style scoped lang="scss">
header {
  .page__title {
    font-size: 18px;
    margin: 10px 0;
    span {
      font-weight: bold;
    }
  }
  .modes {
    margin: 10px 0;
    border-bottom: 1px solid #6f6f70;
    button {
      margin-bottom: 20px;
    }
    button:first-child {
      margin-right: 10px;
    }
    button.active {
      background: #bbb4b4;
      border: 1px solid #000000;
    }
  }
}
.bth__delete {
  margin: 10px 0;
}
</style>
