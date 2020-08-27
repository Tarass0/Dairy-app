<template>
  <div class="wrapper">
    <div class="dialog__content">
      <div class="dialog__text">
        <slot></slot>
      </div>
      <div class="buttons">
        <button class="btn" @click="onCancel">Cancel</button>
        <button class="btn btn-ok" @click="onConfirm">Ok</button>
      </div>
    </div>
    <div class="dialog__overlay" @click="onCancel"></div>
  </div>
</template>
<script>
export default {
  methods: {
    onCancel: function () {
      this.$emit('close', { confirmAction: false });
    },
    onConfirm: function () {
      this.$emit('close', { confirmAction: true });
      // this.$emit('confirmed');
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  .dialog__overlay {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .dialog__content {
    width: 90%;
    max-width: 300px;
    padding: 30px;
    position: absolute;
    z-index: 20;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    text-align: center;
    border-radius: 10px;
    cursor: pointer;
    .dialog__text {
      font-size: 18px;
      padding: 15px 5px;
      color: #4a4a4a;
      word-wrap: break-word;
      word-break: break-all;
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      button {
        width: 50%;
        margin: 5px;
      }
    }
  }
}
</style>
