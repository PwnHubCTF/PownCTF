export const state = () => ({
  ctfOptions: null,
});

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    const state = await this.$api.config.getCtfState();
    const eventName = await this.$api.config.getEventName();
    const dates = await this.$api.config.getDates();
    const teamMode = await this.$api.config.getTeamMode();
    const categoryMode = await this.$api.categories.getCategoryMode();
    commit("setOptions", { eventName, state, dates, teamMode, categoryMode });
  },
};

export const mutations = {
  setOptions(state, data) {
    state.ctfOptions = data;
  },
};
