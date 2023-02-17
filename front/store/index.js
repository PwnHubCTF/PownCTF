export const state = () => ({
  ctfOptions: null,
  categories: []
});

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    const config = await this.$api.config.getCtfConfig();
    const categoryMode = await this.$api.categories.getCategoryMode();
    config.teamMode = config.teamMode === "true"; // Convert true string in boolean

    commit("setOptions", { ...config, categoryMode });
  },
};

export const mutations = {
  setOptions(state, data) {
    state.ctfOptions = data;
  },
  setCategories(state, data) {
    state.categories = data;
  },
};
