import Vue from "vue";
import Vuex from "vuex";
import diary from "./modules/diary";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    diary,
  },
});
