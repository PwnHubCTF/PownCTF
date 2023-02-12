export const state = () => ({
  userConfig: {
    view: "default",
    showSolved: true,
  },
});

export const mutations = {
  setView(state, val) {
    state.userConfig.view = val;
  },
  setShowSolved(state, val) {
    state.userConfig.showSolved = val;
  },
};
